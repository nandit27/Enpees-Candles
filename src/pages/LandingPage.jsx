import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import heroBg from '../assets/hero-bg.png';
import productPlaceholder from '../assets/product-placeholder.png';
import flowerCandle from '../assets/Flower_Glass_Jar_Candle__199.webp';
import snowmanCandle from '../assets/Snowman_Candle ___199.webp';
import teddyCandle from '../assets/Teddy_Heart_Candle__60.webp';
import vanillaCandle from '../assets/Vanilla_Bliss_Glass_Jar_Candle__249.webp';
import roseCandle from '../assets/Rose_Flower_Basket_Candle___249.webp';
import sandalwoodCandle from '../assets/Chai_Biscuit_Glass_Candle___90.webp'; // Using Chai as placeholder for Sandalwood

const LandingPage = () => {
    return (
        <div className="relative w-full font-['Inter',_sans-serif] text-[#554B47] antialiased bg-[#3B2A23]">
            {/* Hero Section */}
            <div className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-screen w-full overflow-hidden">
                    <img
                        src={heroBg}
                        alt="Luxury Candle Background"
                        className="h-full w-full object-cover animate-fade-in"
                    />
                    <div className="absolute inset-0 bg-[#3B2A23]/40"></div>
                </div>

                <div className="relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <Navbar className="fixed top-0 left-0 right-0 z-50 bg-[#3B2A23]/80 backdrop-blur-md" />

                    <main className="flex-grow">
                        <section className="flex h-screen items-center justify-center px-6">
                            <div className="w-full max-w-4xl rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg p-12 md:p-16 text-center">
                                <h1 className="font-['Italiana',_serif] text-5xl md:text-7xl font-bold leading-tight tracking-wide text-[#554B47] drop-shadow-lg">
                                    Where every flame tells a handmade story.
                                </h1>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Collections Grid */}
            <section className="relative bg-[#3B2A23] py-24 sm:py-32">
                <div className="absolute inset-0">
                    <img alt="Elegant lifestyle setting with candles" className="h-full w-full object-cover opacity-30" src={productPlaceholder} />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:max-w-none">
                        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-16 lg:grid-cols-2">
                            <div className="space-y-8">
                                <div className="group relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg">
                                    <div className="absolute inset-0 z-0">
                                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Floral & Sweet" src={flowerCandle} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A23]/30 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 flex h-full flex-col justify-end p-8">
                                        <p className="font-['Italiana',_serif] text-3xl font-bold text-white">Floral & Sweet</p>
                                    </div>
                                </div>
                                <div className="group relative aspect-[4/3] w-full max-w-lg self-end overflow-hidden rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg lg:ml-auto">
                                    <div className="absolute inset-0 z-0">
                                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Seasonal Favorites" src={snowmanCandle} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A23]/30 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 flex h-full flex-col justify-end p-8">
                                        <p className="font-['Italiana',_serif] text-3xl font-bold text-white">Seasonal Favorites</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8 lg:mt-24">
                                <div className="group relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg">
                                    <div className="absolute inset-0 z-0">
                                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Woody & Earthy" src={sandalwoodCandle} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A23]/30 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 flex h-full flex-col justify-end p-8">
                                        <p className="font-['Italiana',_serif] text-3xl font-bold text-white">Woody & Earthy</p>
                                    </div>
                                </div>
                                <div className="group relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg">
                                    <div className="absolute inset-0 z-0">
                                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Gift Sets" src={teddyCandle} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A23]/30 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 flex h-full flex-col justify-end p-8">
                                        <p className="font-['Italiana',_serif] text-3xl font-bold text-white">Gift Sets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-20 flex justify-center">
                            <Link to="/shop">
                                <Button className="h-14 px-8 text-lg font-bold tracking-wider bg-[#D8A24A] text-[#554B47] hover:bg-[#D8A24A]/90 hover:shadow-lg hover:shadow-[#D8A24A]/30 transition-all rounded-xl">
                                    Explore All Collections
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="bg-[#3B2A23] py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-['Italiana',_serif] text-4xl font-bold tracking-tight text-[#EAD2C0] sm:text-5xl">Our Best Sellers</h2>
                        <p className="mt-4 text-lg leading-8 text-[#EAD2C0]/80">Discover the scents our customers love the most. Hand-poured with passion.</p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {[
                            { name: "Amber & Musk", desc: "A warm, inviting blend of rich amber and earthy musk, perfect for a cozy evening.", img: vanillaCandle },
                            { name: "Vanilla & Lavender", desc: "A calming and soothing aroma that combines sweet vanilla with fresh lavender fields.", img: roseCandle },
                            { name: "Sandalwood & Cedar", desc: "An earthy and grounding fragrance with notes of rich sandalwood and aromatic cedarwood.", img: sandalwoodCandle }
                        ].map((product, index) => (
                            <article key={index} className="flex flex-col items-start justify-between">
                                <div className="relative w-full">
                                    <img alt={product.name} className="aspect-[1/1] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" src={product.img} />
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#EAD2C0]/10"></div>
                                </div>
                                <div className="max-w-xl">
                                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                                        <time className="text-[#EAD2C0]/60">Best Seller</time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-2xl font-['Italiana',_serif] font-semibold leading-6 text-[#EAD2C0] group-hover:text-[#D8A24A] transition-colors">
                                            <a href="#"><span className="absolute inset-0"></span>{product.name}</a>
                                        </h3>
                                        <p className="mt-5 text-sm leading-6 text-[#EAD2C0]/80">{product.desc}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Difference */}
            <section className="relative bg-[#3B2A23] py-24 sm:py-32">
                <div className="absolute inset-0">
                    <img alt="Hands crafting a candle" className="h-full w-full object-cover opacity-20" src={productPlaceholder} />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                        <div className="lg:pr-8 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="font-['Italiana',_serif] text-4xl font-bold tracking-tight text-[#EAD2C0] sm:text-5xl">The Enpees Difference</h2>
                                <p className="mt-6 text-lg leading-8 text-[#EAD2C0]/80">We believe in quality, craftsmanship, and creating moments of tranquility. Our candles are more than just a product; they are an experience.</p>
                                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-[#EAD2C0]/70 lg:max-w-none">
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-[#EAD2C0]">
                                            <svg className="absolute left-1 top-1 h-5 w-5 text-[#D8A24A]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>
                                            Natural Ingredients.
                                        </dt>
                                        <dd className="inline"> We use 100% soy wax and premium, phthalate-free fragrance oils infused with essential oils.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-[#EAD2C0]">
                                            <svg className="absolute left-1 top-1 h-5 w-5 text-[#D8A24A]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>
                                            Hand-Poured with Care.
                                        </dt>
                                        <dd className="inline"> Each candle is meticulously hand-poured in small batches in our studio to ensure the highest quality.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-[#EAD2C0]">
                                            <svg className="absolute left-1 top-1 h-5 w-5 text-[#D8A24A]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>
                                            Sustainable Practices.
                                        </dt>
                                        <dd className="inline"> From our recyclable packaging to our eco-friendly ingredients, we are committed to sustainability.</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg p-2">
                                <img alt="Product image" className="w-[30rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[32rem]" src={productPlaceholder} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
