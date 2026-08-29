import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

const CatalogCard = ({ product, onAdd }) => {
    const [added, setAdded] = useState(false);
    const price = product.offerPrice || product.price;

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!onAdd) return;
        onAdd(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
    };

    return (
        <article className="group flex h-full flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#3B2A1E]">
                <Link
                    to="/product"
                    state={{ product }}
                    className="absolute inset-0 block"
                    aria-label={product.name}
                >
                    <LazyImage
                        src={product.image}
                        alt={product.name}
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                </Link>
                {onAdd && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
                        className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#D3A34E] text-[#2A1D15] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                            {added ? 'check' : 'add'}
                        </span>
                    </button>
                )}
            </div>
            <div className="mt-4 flex min-h-[3.25rem] items-start justify-between gap-3">
                <h3 className="lp-display line-clamp-2 text-[1.05rem] leading-snug">
                    <Link to="/product" state={{ product }} className="transition-colors hover:text-[#D3A34E]">
                        {product.name}
                    </Link>
                </h3>
                <p className="shrink-0 pt-0.5 font-jost text-base tabular-nums text-[#EDE6D8]">
                    ₹{price}
                    {product.offerPrice && (
                        <span className="ml-2 text-[13px] text-[#C7BCA8]/50 line-through">₹{product.price}</span>
                    )}
                </p>
            </div>
        </article>
    );
};

export default CatalogCard;
