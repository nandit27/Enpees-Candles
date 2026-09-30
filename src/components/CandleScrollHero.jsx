/**
 * CandleScrollHero — Frame-by-frame scroll animation.
 *
 * Frames: public/hero-frames/frame-%04d.webp (1–240)
 * Video:  10s × 24fps = 240 frames, 1280×720 WebP q90
 *
 * Canvas renders ONE frame at a time, controlled by scroll progress.
 * GSAP ScrollTrigger pins the section for the animation duration.
 * Text lives in a separate z-index layer, positioned left (negative space).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Config ─────────────────────────────────────────────────── */
const FRAME_COUNT  = 240;         // 10s × 24fps
const FRAME_DIR    = '/hero-frames';
const FRAME_EXT    = 'webp';
const PIN_DURATION = 5;           // how many viewport-heights to pin

const getFramePath = (i) => {
    const n = String(i + 1).padStart(4, '0');
    return `${FRAME_DIR}/frame-${n}.${FRAME_EXT}`;
};

/* ── Helpers ─────────────────────────────────────────────────── */
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * object-fit: cover — fills canvas, centres image, preserves aspect ratio.
 * High-quality image smoothing is enabled on every draw call so the
 * browser's bicubic/bilinear filter is used regardless of canvas state.
 */
const drawCover = (ctx, img, cw, ch) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih || !cw || !ch) return;
    // Always assert high-quality smoothing (ctx state can be reset by resize)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const scale = Math.max(cw / iw, ch / ih);
    const dw    = iw * scale;
    const dh    = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
};

const loadImage = (src) =>
    new Promise((resolve) => {
        const img    = new Image();
        img.decoding = 'async';
        img.onload   = () => resolve(img);
        img.onerror  = () => resolve(null);
        img.src      = src;
    });

const usePrefersReducedMotion = () => {
    const [reduce, setReduce] = useState(
        () => typeof window !== 'undefined' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setReduce(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    return reduce;
};

/* ── Component ───────────────────────────────────────────────── */
export default function CandleScrollHero() {
    const reduce        = usePrefersReducedMotion();
    const wrapRef       = useRef(null);
    const pinRef        = useRef(null);
    const canvasRef     = useRef(null);
    const textRef       = useRef(null);
    const framesRef     = useRef([]);
    const lastIndexRef  = useRef(-1);
    const sizeRef       = useRef({ w: 0, h: 0, dpr: 1 });
    const rafRef        = useRef(null);

    const [hasFirst,  setHasFirst]  = useState(false);
    const [status,    setStatus]    = useState('loading'); // loading | ready | fallback

    /* ── Canvas sizing with DPR support ── */
    const sizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const pin    = pinRef.current;
        if (!canvas || !pin) return null;
        const ctx  = canvas.getContext('2d', { alpha: false });
        if (!ctx)  return null;
        const rect = pin.getBoundingClientRect();
        // Cap at 3 — covers all current Retina / Super Retina XDR / high-DPI displays
        const dpr  = Math.min(window.devicePixelRatio || 1, 3);
        const w    = Math.max(1, Math.round(rect.width));
        const h    = Math.max(1, Math.round(rect.height));
        const prev = sizeRef.current;
        if (prev.w === w && prev.h === h && prev.dpr === dpr) return { ctx, w, h };
        canvas.width        = Math.round(w * dpr);
        canvas.height       = Math.round(h * dpr);
        canvas.style.width  = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Re-apply after setTransform — some browsers reset smoothing on transform change
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        sizeRef.current = { w, h, dpr };
        return { ctx, w, h };
    }, []);

    /* ── Draw the best available frame for a given index ── */
    const drawIndex = useCallback((index) => {
        const frames = framesRef.current;
        let img = frames[index];
        // walk backward for nearest loaded frame
        if (!img) {
            for (let i = index - 1; i >= 0; i--) {
                if (frames[i]) { img = frames[i]; break; }
            }
        }
        // walk forward
        if (!img) {
            for (let i = index + 1; i < frames.length; i++) {
                if (frames[i]) { img = frames[i]; break; }
            }
        }
        if (!img) return;
        const sized = sizeCanvas();
        if (!sized) return;
        drawCover(sized.ctx, img, sized.w, sized.h);
        lastIndexRef.current = index;
    }, [sizeCanvas]);

    /* ── Convert scroll progress → frame index → draw (via rAF) ── */
    const applyProgress = useCallback((progress) => {
        const p          = clamp01(progress);
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1)));
        if (frameIndex === lastIndexRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            drawIndex(frameIndex);
            rafRef.current = null;
        });
    }, [drawIndex]);

    /* ── Progressive image loading ── */
    useEffect(() => {
        let cancelled = false;
        const frames  = new Array(FRAME_COUNT);

        const run = async () => {
            // 1. Load frame 0 immediately and paint it
            const firstImg = await loadImage(getFramePath(0));
            if (cancelled) return;
            frames[0]       = firstImg;
            framesRef.current = frames;
            if (firstImg) { drawIndex(0); setHasFirst(true); }

            // 2. Load remaining frames in parallel batches of 20
            const BATCH = 20;
            for (let start = 1; start < FRAME_COUNT; start += BATCH) {
                if (cancelled) return;
                const end  = Math.min(start + BATCH, FRAME_COUNT);
                const batch = [];
                for (let i = start; i < end; i++) {
                    batch.push(
                        loadImage(getFramePath(i)).then((img) => {
                            frames[i] = img;
                            // if the user has already scrolled to this frame, redraw
                            if (!cancelled && lastIndexRef.current === i) {
                                framesRef.current = [...frames];
                                drawIndex(i);
                            }
                        })
                    );
                }
                await Promise.all(batch);
                framesRef.current = [...frames];
            }

            if (cancelled) return;
            const ok = frames.filter(Boolean).length;
            setStatus(ok > 0 ? 'ready' : 'fallback');
        };

        run();
        return () => {
            cancelled = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [drawIndex]);

    /* ── Resize observer ── */
    useEffect(() => {
        const pin = pinRef.current;
        if (!pin) return;
        const ro = new ResizeObserver(() => {
            sizeRef.current = { w: 0, h: 0, dpr: 0 };
            drawIndex(Math.max(0, lastIndexRef.current));
        });
        ro.observe(pin);
        return () => ro.disconnect();
    }, [drawIndex]);

    /* ── GSAP ScrollTrigger pin + scrub ── */
    const canScrub = hasFirst && !reduce && status !== 'fallback';

    useGSAP(() => {
        if (!canScrub || !wrapRef.current) return;

        ScrollTrigger.create({
            trigger: wrapRef.current,
            start:   'top top',
            end:     'bottom bottom',
            scrub:   true,
            invalidateOnRefresh: true,
            onUpdate: (self) => applyProgress(self.progress),
            onRefresh: (self) => applyProgress(self.progress),
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
    }, { dependencies: [canScrub, applyProgress], revertOnUpdate: true, scope: wrapRef });

    /* ── Reduced-motion fallback: show frame 0 statically ── */
    useEffect(() => {
        if (reduce && status === 'ready') drawIndex(0);
    }, [reduce, status, drawIndex]);

    /* ── Text entrance animation (runs once, not on every scroll frame) ── */
    useGSAP(() => {
        const text = textRef.current;
        if (!text || reduce) return;
        gsap.fromTo(
            text.querySelectorAll('.hero-anim'),
            { opacity: 0, y: 28 },
            {
                opacity: 1, y: 0,
                duration: 1.1,
                stagger: 0.14,
                ease: 'power3.out',
                delay: 0.3,
            }
        );
    }, { scope: textRef, dependencies: [hasFirst] });

    /* ── Layout ── */
    const wrapH     = reduce || status === 'fallback' ? '100dvh' : `${PIN_DURATION * 100}vh`;
    const showFallback = status === 'fallback';
    const stillLoading = !hasFirst && status === 'loading';

    return (
        <section
            ref={wrapRef}
            className="relative"
            style={{ height: wrapH, background: '#F0E8D8' }}
            aria-label="Fleroma Candles hero animation"
        >
            {/* ── Sticky viewport — the pinned frame ── */}
            <div
                ref={pinRef}
                className="sticky top-0 h-[100dvh] overflow-hidden"
                style={{ background: '#F0E8D8' }}
            >
                {/* Canvas: renders one frame at a time */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 block h-full w-full"
                    role="img"
                    aria-label="Handcrafted candles rotating on a walnut table"
                    aria-hidden={showFallback ? 'true' : undefined}
                />

                {/* Fallback still (if frames can't load) */}
                {showFallback && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: '#F0E8D8' }}
                    >
                        <p className="font-marcellus text-2xl" style={{ color: '#3D2B1F' }}>
                            Fleroma Candles
                        </p>
                    </div>
                )}

                {/* Subtle vignette — keeps edges soft, does NOT darken the frame centre */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(210,190,160,0.25) 100%),
                            linear-gradient(180deg, rgba(240,232,216,0.18) 0%, transparent 12%, transparent 88%, rgba(240,232,216,0.22) 100%)
                        `,
                    }}
                />

                {/* ── Hero text — left column, negative space ── */}
                <div
                    ref={textRef}
                    className="pointer-events-none absolute inset-0 flex items-center"
                    style={{ zIndex: 10 }}
                >
                    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
                        {/* Text sits in left ~42% of the viewport (where the frame has soft curtain backdrop) */}
                        <div className="w-full lg:w-[42%]">
                            {/* Brand wordmark */}
                            <p
                                className="hero-anim font-outfit"
                                style={{
                                    fontWeight: 500,
                                    fontSize: 'clamp(0.625rem, 0.85vw, 0.75rem)',
                                    letterSpacing: '0.28em',
                                    textTransform: 'uppercase',
                                    color: '#9A7854',
                                    marginBottom: '1rem',
                                }}
                            >
                                Hand-poured in Rajkot
                            </p>

                            {/* Main headline */}
                            <h1
                                className="hero-anim font-marcellus"
                                style={{
                                    fontSize: 'clamp(2.4rem, 4.8vw, 4.25rem)',
                                    fontWeight: 400,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.02em',
                                    color: '#2E1F14',
                                    marginBottom: '0.25rem',
                                }}
                            >
                                Fleroma
                            </h1>
                            <h1
                                className="hero-anim font-marcellus"
                                style={{
                                    fontSize: 'clamp(2.4rem, 4.8vw, 4.25rem)',
                                    fontWeight: 400,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.02em',
                                    color: '#2E1F14',
                                    marginBottom: '1.5rem',
                                    fontStyle: 'italic',
                                }}
                            >
                                Candles
                            </h1>

                            {/* Sub-headline */}
                            <p
                                className="hero-anim font-outfit"
                                style={{
                                    fontSize: 'clamp(1rem, 1.15vw, 1.15rem)',
                                    fontWeight: 300,
                                    lineHeight: 1.75,
                                    color: '#5C3E28',
                                    maxWidth: '30ch',
                                    marginBottom: '2rem',
                                }}
                            >
                                Light that becomes a memory.
                                <br />
                                Warmth, fragrance &amp; beauty,
                                <br />
                                in every handcrafted pour.
                            </p>

                            {/* CTA buttons — pointer events re-enabled here */}
                            <div
                                className="hero-anim pointer-events-auto flex flex-col sm:flex-row gap-3"
                            >
                                <Link
                                    to="/shop"
                                    className="lp-btn lp-btn-primary"
                                    style={{
                                        background: '#3D2B1F',
                                        color: '#F5EDE0',
                                        boxShadow: '0 8px 28px -8px rgba(61,43,31,0.45)',
                                    }}
                                >
                                    Explore Collection
                                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                                <Link
                                    to="#story"
                                    className="lp-btn lp-btn-ghost"
                                    style={{
                                        borderColor: 'rgba(61,43,31,0.4)',
                                        color: '#3D2B1F',
                                    }}
                                >
                                    Our Story
                                </Link>
                            </div>

                            {/* Scroll cue */}
                            <div
                                className="hero-anim mt-10 flex items-center gap-3"
                                aria-hidden="true"
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 1,
                                        background: 'linear-gradient(90deg, rgba(61,43,31,0.6), rgba(61,43,31,0.2))',
                                    }}
                                />
                                <span
                                    className="font-outfit"
                                    style={{
                                        fontSize: '0.625rem',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        color: '#9A7854',
                                    }}
                                >
                                    Scroll to explore
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {stillLoading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: '#F0E8D8', zIndex: 30 }}
                        aria-live="polite"
                        aria-busy="true"
                    >
                        <span className="sr-only">Loading candle animation…</span>
                        <div style={{ textAlign: 'center' }}>
                            <p
                                className="font-marcellus animate-pulse"
                                style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                    color: '#3D2B1F',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                Fleroma Candles
                            </p>
                            <div
                                className="mt-4 mx-auto"
                                style={{
                                    width: 40,
                                    height: 1,
                                    background: 'linear-gradient(90deg, transparent, #9A7854, transparent)',
                                    animation: 'lp-pulse-bar 1.6s ease-in-out infinite',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
