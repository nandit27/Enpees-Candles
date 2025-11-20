import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
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
                    <header className="fixed top-0 left-0 right-0 z-50 p-6">
                        <div className="container mx-auto max-w-7xl">
                            <nav className="flex items-center justify-between rounded-xl bg-[#FFF7ED]/70 backdrop-blur-md border border-[#FFF7ED]/20 shadow-lg px-8 py-3">
                                <div className="flex items-center gap-4">
                                    <svg className="h-6 w-6 text-[#554B47]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"></path>
                                        <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fillRule="evenodd"></path>
                                    </svg>
                                    <h2 className="text-xl font-['Italiana',_serif] font-bold leading-tight tracking-wide text-[#554B47]">Enpees Candles</h2>
                                </div>
                                <div className="hidden items-center gap-9 lg:flex">
                                    <Link className="text-sm font-medium leading-normal text-[#554B47] transition-colors hover:text-[#D8A24A]" to="/shop">Shop All</Link>
                                    <Link className="text-sm font-medium leading-normal text-[#554B47] transition-colors hover:text-[#D8A24A]" to="/shop">Scent Collections</Link>
                                    <Link className="text-sm font-medium leading-normal text-[#554B47] transition-colors hover:text-[#D8A24A]" to="/contact">About Us</Link>
                                    <Link className="text-sm font-medium leading-normal text-[#554B47] transition-colors hover:text-[#D8A24A]" to="/contact">Contact</Link>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#554B47] transition-colors hover:bg-[#D8A24A]/20 hover:text-[#D8A24A]">
                                        <span className="material-symbols-outlined">search</span>
                                    </button>
                                    <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#554B47] transition-colors hover:bg-[#D8A24A]/20 hover:text-[#D8A24A]">
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                    </button>
                                    <Link to="/admin" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#554B47] transition-colors hover:bg-[#D8A24A]/20 hover:text-[#D8A24A]">
                                        <span className="material-symbols-outlined">person</span>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </header>

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
                            <Button className="h-14 px-8 text-lg font-bold tracking-wider bg-[#D8A24A] text-[#554B47] hover:bg-[#D8A24A]/90 hover:shadow-lg hover:shadow-[#D8A24A]/30 transition-all rounded-xl">
                                Explore All Collections
                            </Button>
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
