/**
 * CandleScrollHero — Apple-style scroll-scrubbed image sequence.
 *
 * WHERE TO DROP THE REAL SEQUENCE
 *   public/frames/frame_0001.webp … frame_00XX.webp
 *
 * RECOMMENDED EXPORT (ffmpeg)
 *   mkdir -p public/frames
 *   ffmpeg -i candle.mp4 -vf "fps=15,scale=1920:-1" public/frames/frame_%04d.webp
 *
 *   60–150 frames (~10–20 fps of the source clip) looks smooth.
 *   WebP at quality ~80 keeps each frame small; PNG works if you
 *   change FRAME_EXT. Cap width at 1920px so preload stays sane.
 *
 * Then set FRAME_COUNT to the file count and tune PIN_DURATION_VH
 * (more frames → more viewport-heights so each frame has scroll room).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import fallbackStill from '../assets/candle-scroll-fallback.webp';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const FRAME_COUNT = 120;
export const FRAME_PAD = 4;
export const FRAME_EXT = 'webp';
export const FRAME_DIR = '/frames';
export const PIN_DURATION_VH = 4;

export const getFramePath = (index) => {
    const n = String(index + 1).padStart(FRAME_PAD, '0');
    return `${FRAME_DIR}/frame_${n}.${FRAME_EXT}`;
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const openingOpacity = (progress) => {
    if (progress <= 0.08) return 1;
    if (progress >= 0.22) return 0;
    return 1 - (progress - 0.08) / 0.14;
};

const closingOpacity = (progress) => {
    if (progress <= 0.82) return 0;
    if (progress >= 0.94) return 1;
    return (progress - 0.82) / 0.12;
};

const drawCover = (ctx, img, cssW, cssH) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih || !cssW || !cssH) return;
    const scale = Math.max(cssW / iw, cssH / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh);
};

const loadImage = (src) =>
    new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });

const usePrefersReducedMotion = () => {
    const [reduce, setReduce] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setReduce(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    return reduce;
};

export default function CandleScrollHero() {
    const reduce = usePrefersReducedMotion();
    const wrapRef = useRef(null);
    const pinRef = useRef(null);
    const canvasRef = useRef(null);
    const openingRef = useRef(null);
    const closingRef = useRef(null);
    const framesRef = useRef([]);
    const lastIndexRef = useRef(-1);
    const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
    const [hasFirst, setHasFirst] = useState(false);
    const [status, setStatus] = useState('loading');

    const sizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const pin = pinRef.current;
        if (!canvas || !pin) return null;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        const rect = pin.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        const prev = sizeRef.current;
        if (prev.w === w && prev.h === h && prev.dpr === dpr) {
            return { ctx, w, h };
        }
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeRef.current = { w, h, dpr };
        return { ctx, w, h };
    }, []);

    const drawIndex = useCallback(
        (index) => {
            const frames = framesRef.current;
            let img = frames[index];
            if (!img) {
                for (let i = index - 1; i >= 0; i -= 1) {
                    if (frames[i]) {
                        img = frames[i];
                        break;
                    }
                }
            }
            if (!img) {
                for (let i = index + 1; i < frames.length; i += 1) {
                    if (frames[i]) {
                        img = frames[i];
                        break;
                    }
                }
            }
            if (!img) return;
            const sized = sizeCanvas();
            if (!sized) return;
            drawCover(sized.ctx, img, sized.w, sized.h);
            lastIndexRef.current = index;
        },
        [sizeCanvas]
    );

    const applyProgress = useCallback(
        (progress) => {
            const p = clamp01(progress);
            const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT));
            if (frameIndex !== lastIndexRef.current) {
                drawIndex(frameIndex);
            }
            const open = openingRef.current;
            const close = closingRef.current;
            if (open) {
                const o = openingOpacity(p);
                open.style.opacity = String(o);
                open.style.pointerEvents = o > 0.2 ? 'auto' : 'none';
                open.setAttribute('aria-hidden', o > 0.2 ? 'false' : 'true');
            }
            if (close) {
                const c = closingOpacity(p);
                close.style.opacity = String(c);
                close.setAttribute('aria-hidden', c > 0.2 ? 'false' : 'true');
            }
        },
        [drawIndex]
    );

    useEffect(() => {
        let cancelled = false;
        const frames = new Array(FRAME_COUNT);

        const paintFirst = (img) => {
            if (cancelled || !img) return;
            framesRef.current = frames;
            drawIndex(0);
            setHasFirst(true);
        };

        const run = async () => {
            const first = loadImage(getFramePath(0)).then((img) => {
                frames[0] = img;
                paintFirst(img);
                return img;
            });

            const rest = [];
            for (let i = 1; i < FRAME_COUNT; i += 1) {
                rest.push(
                    loadImage(getFramePath(i)).then((img) => {
                        frames[i] = img;
                        if (!cancelled && lastIndexRef.current === i) {
                            framesRef.current = frames;
                            drawIndex(i);
                        }
                        return img;
                    })
                );
            }

            const loaded = await Promise.all([first, ...rest]);
            if (cancelled) return;
            framesRef.current = frames;
            const okCount = loaded.filter(Boolean).length;
            if (okCount === 0) {
                setStatus('fallback');
                return;
            }
            drawIndex(Math.max(0, lastIndexRef.current));
            setStatus('ready');
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [drawIndex]);

    useEffect(() => {
        const pin = pinRef.current;
        if (!pin) return;
        const ro = new ResizeObserver(() => {
            sizeRef.current = { w: 0, h: 0, dpr: 0 };
            const idx = Math.max(0, lastIndexRef.current);
            drawIndex(idx);
        });
        ro.observe(pin);
        return () => ro.disconnect();
    }, [drawIndex]);

    const canScrub = hasFirst && !reduce && status !== 'fallback';

    useGSAP(
        () => {
            if (!canScrub || !wrapRef.current) return;

            ScrollTrigger.create({
                trigger: wrapRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => applyProgress(self.progress),
                onRefresh: (self) => applyProgress(self.progress),
            });

            requestAnimationFrame(() => ScrollTrigger.refresh());
        },
        { dependencies: [canScrub, applyProgress], revertOnUpdate: true, scope: wrapRef }
    );

    useEffect(() => {
        if (status !== 'ready') return;
        if (reduce) {
            drawIndex(0);
            if (openingRef.current) {
                openingRef.current.style.opacity = '1';
                openingRef.current.style.pointerEvents = 'auto';
            }
            if (closingRef.current) closingRef.current.style.opacity = '0';
        }
    }, [status, reduce, drawIndex]);

    const wrapHeight = reduce || status === 'fallback' ? '100dvh' : `${PIN_DURATION_VH * 100}vh`;
    const showFallback = status === 'fallback';
    const stillLoading = !hasFirst && status === 'loading';

    return (
        <section
            ref={wrapRef}
            className="relative bg-[#1A120C]"
            style={{ height: wrapHeight }}
            aria-label="Enpees candle, scroll to watch it tip and go out"
        >
            <div
                ref={pinRef}
                className="sticky top-0 isolate h-[100dvh] overflow-hidden bg-[#1A120C]"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 block h-full w-full"
                    role="img"
                    aria-label="A lit black-glass candle that tips over as you scroll"
                    aria-hidden={showFallback ? 'true' : undefined}
                />

                {showFallback && (
                    <img
                        src={fallbackStill}
                        alt="A lit black-glass Enpees candle on a wooden table"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A120C]/75 via-transparent to-[#1A120C]/55"
                    aria-hidden="true"
                />

                <div
                    ref={openingRef}
                    className="absolute inset-0 z-10 flex items-end pb-12 pt-28 lg:items-center lg:pb-20 lg:pt-24"
                >
                    <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16">
                        <div className="max-w-[36rem] [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
                            <p className="lp-eyebrow tracking-[0.28em] text-[#D3A34E]">
                                Hand-poured in Rajkot
                            </p>
                            <h1 className="lp-display mt-6 text-[2.75rem] font-light leading-[1.1] tracking-[-0.03em] text-[#F5EFE6] sm:text-6xl lg:text-7xl">
                                <span className="block">Shaped before</span>
                                <span className="block pb-1">
                                    it{' '}
                                    <em
                                        className="lp-wonk not-italic text-[#D3A34E]"
                                        style={{ fontStyle: 'italic' }}
                                    >
                                        burns.
                                    </em>
                                </span>
                            </h1>
                            <p className="lp-lede mt-6 max-w-[32ch] text-[#EDE6D8]">
                                Teddies, roses, hearts. Poured by hand in small batches in Rajkot.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <Link to="/shop" className="lp-btn lp-btn-primary">
                                    Shop candles
                                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                                <Link to="#process" className="lp-btn lp-btn-ghost">
                                    How it's made
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={closingRef}
                    className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-5 pb-16 opacity-0 sm:pb-20"
                    aria-hidden="true"
                >
                    <p className="lp-display text-center text-3xl leading-[1.15] tracking-[0.08em] text-[#F5EFE6] [text-shadow:0_2px_32px_rgba(0,0,0,0.65)] sm:text-4xl sm:tracking-[0.16em] lg:text-5xl">
                        Hand-poured. Slow burn.
                    </p>
                </div>

                {stillLoading && (
                    <div
                        className="absolute inset-0 z-20 flex items-center justify-center bg-[#1A120C]/40"
                        aria-live="polite"
                        aria-busy="true"
                    >
                        <span className="sr-only">Loading candle sequence</span>
                        <span
                            className="h-px w-16 origin-left animate-pulse bg-[#D3A34E]"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
