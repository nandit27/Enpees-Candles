import React from 'react';

const ContactUs = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#201b12] overflow-x-hidden font-['Inter',_sans-serif]">
            {/* Full-bleed Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy3u9Q3Sxjn-RrYnaHN8oC-Xnj3tbUnVX3y0mUu_1xQ16scfVm9WiN9g__T9A85ltiBSgzqNk_cplW6wM_Ip3Hf16hbCUq9io-ttZdLxkJ5p9X07PgMfCrji-WGB89pwauBMbQEnHmvcvE6yILN9Ae1MYczFBOKLqQ0ire3wDpib_T63pZmmggMmDtu1tNs7Z8M3TMMpUNosGMAB_yUt9RN-rzqBuMZKAoPHMbhrAq_a5yLawHUKRqoKqDMOGNaFnLLPpsyjMvqCwL')" }}
                ></div>
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 flex h-full grow flex-col">
                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    {/* Central Glassmorphic Card */}
                    <div className="w-full max-w-4xl rounded-xl bg-[#FFF7ED]/70 backdrop-blur-lg shadow-2xl ring-1 ring-white/20 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left side: Contact Form */}
                            <div className="p-8 md:p-12">
                                <h1 className="font-['Italiana',_serif] text-4xl sm:text-5xl font-black leading-tight tracking-wide text-[#554B47] mb-2">
                                    Get in Touch
                                </h1>
                                <p className="text-[#554B47]/80 mb-8">
                                    We'd love to hear from you. Fill out the form below and we'll get back to you shortly.
                                </p>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <label className="flex flex-col">
                                        <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Full Name</p>
                                        <input
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#D8A24A]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-12 placeholder:text-[#554B47]/50 px-4 text-sm font-normal leading-normal"
                                            name="name"
                                            placeholder="Enter your full name"
                                            type="text"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Email Address</p>
                                        <input
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#D8A24A]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-12 placeholder:text-[#554B47]/50 px-4 text-sm font-normal leading-normal"
                                            name="email"
                                            placeholder="Enter your email address"
                                            type="email"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Message</p>
                                        <textarea
                                            className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#D8A24A]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 placeholder:text-[#554B47]/50 p-4 text-sm font-normal leading-normal"
                                            name="message"
                                            placeholder="Your message..."
                                            rows="5"
                                        ></textarea>
                                    </label>
                                    <div>
                                        <button
                                            className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-[#D8A24A] text-white font-bold leading-normal tracking-wide shadow-lg hover:brightness-110 transition-all duration-200"
                                            type="submit"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right side: Image and Contact Info */}
                            <div className="relative min-h-[300px] md:min-h-full">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAiVBmg56gE8Y1aY-aj5Bng_oCQxDBrZ9Jz2IkJpE03w0ghCCyWzfjZ0uVeQv3cNcifUp7qPlhEISbW4SBMvfrPkKChvJNljnsEayL98q8NAWyARGEHY85I9EX-aLc-zY2kI0CLVC6ydSJBR7HnPBuGX7bn4-2IJMS2NC9LX99FMeOSJwYcjqUk1KnYwZvEUdg_GjwtRvAwYkxZ7hxUPWEQWnHPQJDagr8r6bpL1NBL59h3Ij9y-mMGvydP8fxm4IHCb2BNdm8KgKt')" }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent"></div>
                                <div className="relative flex flex-col justify-end h-full p-8 text-white">
                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#D8A24A]">mail</span>
                                            <div>
                                                <p className="font-semibold">Email</p>
                                                <p className="text-white/80 text-sm">contact@enpees.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#D8A24A]">call</span>
                                            <div>
                                                <p className="font-semibold">Phone</p>
                                                <p className="text-white/80 text-sm">+1 (555) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#D8A24A]">location_on</span>
                                            <div>
                                                <p className="font-semibold">Address</p>
                                                <p className="text-white/80 text-sm">123 Luxe Lane, Ember City, 45678</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContactUs;
