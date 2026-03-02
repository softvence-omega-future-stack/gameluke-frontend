"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WaitingRoomPage() {
    const router = useRouter();

    useEffect(() => {
        // Simulate waiting for a few seconds before move to arena
        const timer = setTimeout(() => {
            router.push("/arena-map");
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-black text-white p-6">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.2] blur-[12px] scale-110"
                    priority
                />
            </div>

            {/* Animated Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Modern Spinner */}
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-[#FFFF00]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#FFFF00] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,255,0,0.3)]"></div>
                    <div className="absolute inset-4 border-2 border-[#E91E63]/30 rounded-full"></div>
                    <div className="absolute inset-4 border-2 border-[#E91E63] border-b-transparent rounded-full animate-spin-slow"></div>
                </div>

                <div className="text-center">
                    <h1 className="text-[#FFFF00] text-3xl font-black uppercase tracking-tighter mb-2">
                        Syncing Arena
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Preparing your team for battle...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-48 h-1 bg-gray-900 rounded-full mt-10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E91E63] to-[#FFFF00] animate-progress-loading"></div>
                </div>

                <p className="text-[#00E676] text-[10px] font-bold uppercase tracking-[0.2em] mt-4 opacity-70">
                    Connection Secure • Zone Map Loading
                </p>
            </div>

            <footer className="absolute bottom-12 text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Gameluke Engine v2.4.0
            </footer>
        </div>
    );
}
