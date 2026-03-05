"use client";

import Image from "next/image";
import { useState } from "react";

function Loginpage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

    const handleContinue = () => {
        if (formData.firstName) {
            localStorage.setItem("userName", formData.firstName);
            window.location.href = "/available-group";
        } else {
            alert("Please enter your name");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-black">
            {/* Background Image - More blur and darker overlay as per design */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.3] blur-[6px] scale-110"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto px-6 py-6 sm:py-12">
                {/* Logo Section */}
                <div className="mb-0">
                    <Image
                        src="/images/gameshow-logo.png"
                        alt="Gameshow Arena Logo"
                        width={100}
                        height={80}
                        className="object-contain"
                    />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-[#FFFF00] text-xl sm:text-2xl font-bold uppercase text-nowrap leading-[1.1] mb-2 font-geist-sans">
                        GAMESHOW ARENA
                    </h1>
                    <p className="text-white text-xs font-medium opacity-80">
                        Enter the ultimate gaming experience
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full bg-[#111111]/85 border-border p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        {/* Purple Sparkle Icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A855F7] fill-current">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                        <h2 className="text-white text-xl font-bold tracking-tight">Player Login</h2>
                    </div>

                    <form className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-white/90 text-xs font-medium ml-1">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="w-full bg-[#1F1F1F] border-border py-2.5 px-4 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FFFF00] transition-all"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/90 text-xs font-medium ml-1">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="w-full bg-[#1F1F1F] border-border py-2.5 px-4 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FFFF00] transition-all"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/90 text-xs font-medium ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full bg-[#1F1F1F] border-border py-2.5 px-4 text-[#4ADE80] text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FFFF00] transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full cursor-pointer bg-white text-black font-bold text-sm py-3.5 rounded-[14px] hover:bg-gray-100 transition-all transform active:scale-[0.98] mt-4 shadow-lg shadow-black/20"
                        >
                            Continue to Game
                        </button>

                        <p className="text-center text-gray-500 text-[11px] font-medium mt-6">
                            No app installation required
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Loginpage;