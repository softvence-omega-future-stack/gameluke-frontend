"use client";

import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { usePlayerLoginMutation } from "@/redux/api/player/playerApi";

function Loginpage() {
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [playerLogin, { isLoading }] = usePlayerLoginMutation();

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.email) {
            setError("Please enter your name and email");
            return;
        }

        try {
            const response = await playerLogin(formData).unwrap();

            if (response.success) {
                localStorage.setItem("playerId", response.data.id);
                localStorage.setItem("playerName", response.data.name);
                localStorage.setItem("playerEmail", response.data.email);
                window.location.href = "/available-group";
            }
        } catch (err: any) {
            setError(err?.data?.message || "Failed to login. Please try again.");
            console.error("Login error:", err);
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
                <div className="w-full bg-[#111111]/85 border border-[#333] p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        {/* Purple Sparkle Icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A855F7] fill-current">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                        <h2 className="text-white text-xl font-bold tracking-tight">Player Login</h2>
                    </div>

                    <form onSubmit={handleContinue} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <p className="text-red-500 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-white/90 text-xs font-bold uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full bg-[#1F1F1F] border border-[#333] py-3 px-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FFFF00] transition-all rounded-xl"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-white/90 text-xs font-bold uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full bg-[#1F1F1F] border border-[#333] py-3 px-4 text-[#4ADE80] text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FFFF00] transition-all rounded-xl"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer bg-white text-black font-bold text-sm py-3.5 rounded-xl hover:bg-gray-100 transition-all transform active:scale-[0.98] mt-4 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Continue to Game"
                            )}
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