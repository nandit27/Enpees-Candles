import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#FAF6EF] text-[#4A2A1A]">
            <Navbar />
            <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-10 lg:px-16">
                <p className="lp-eyebrow">Lost in the studio</p>
                <h1 className="lp-display mt-5 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                    This page melted away.
                </h1>
                <p className="lp-lede mt-5 max-w-[42ch]">
                    The link you followed is out of wax. The full collection is still on the shelf.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Link to="/shop" className="lp-btn lp-btn-primary">Shop candles</Link>
                    <Link to="/track-order" className="lp-btn lp-btn-ghost">Track an order</Link>
                </div>
            </main>
        </div>
    );
}
