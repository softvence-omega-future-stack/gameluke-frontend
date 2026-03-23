"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, MapPin, Map, Sparkles, Circle } from "lucide-react";
import { useState, useEffect } from "react";

export default function ArenaMapPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Player");

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) setUserName(storedName);
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white p-4 py-12 md:p-8 flex items-center justify-center overflow-x-hidden">
            {/* Blurry Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.3] blur-[6px] scale-110"
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-6">

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-[#121216] border-border-2 px-4 py-1.5 shadow-[0_0_15px_rgba(0,230,118,0.1)]">
                    <div className="w-2.5 h-2.5 bg-[#00E676] rounded-full animate-pulse shadow-[0_0_8px_#00E676]"></div>
                    <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest">Game Ready!</span>
                </div>

                {/* Title Section */}
                <div className="text-center mb-2">
                    <h1 className="text-[#FFFF00] text-3xl font-[900] tracking-tighter leading-none mb-1">
                        Get Ready!
                    </h1>
                    <p className="text-gray-400 text-xs font-semibold">
                        Your arena is ready - proceed to your studio!
                    </p>
                </div>

                {/* Game Ready Alert Card */}
                <div className="w-full bg-[#1A1A23]/60 border-border-2 p-4 flex items-center gap-4 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-[#00E676]/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="text-[#00E676] w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-bold uppercase">Game is Ready!</h3>
                        <p className="text-gray-400 text-[10px] font-medium leading-tight">
                            The admin has activated your studio - head to your location now!
                        </p>
                    </div>
                </div>

                {/* Team & Studio Info Card */}
                <div className="w-full bg-[#111116]/80 border-border p-5 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#A855F7] rounded-xl flex items-center justify-center">
                                <Shield className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[#00E676] text-[10px] font-bold uppercase tracking-wide">Your Group</p>
                                <h3 className="text-white text-sm font-black uppercase">Team Phoenix</h3>
                            </div>
                        </div>
                        {/* <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold">
                            <span className="w-3 h-3 border-2 border-gray-600 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-gray-600 transform rotate-[45deg] -translate-y-[1px]"></div>
                            </span>
                            Waiting 0:55
                        </div> */}
                    </div>

                    <div className="bg-[#1A1A23] border-border p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#A855F7] rounded-xl flex items-center justify-center mb-3">
                            <MapPin className="text-white w-6 h-6" />
                        </div>
                        <p className="text-[#00E676] text-[10px] font-bold uppercase mb-1">You will start in</p>
                        <h2 className="text-white text-2xl font-black uppercase mb-1 tracking-tight">Studio 1</h2>
                        <p className="text-gray-500 text-[9px] font-medium">Your time for the game already runs, please go to Studio.</p>
                    </div>
                </div>

                {/* Facility Map Card */}
                <div className="w-full bg-[#111116]/80 border-border p-5 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-yellow-900/40 rounded-lg flex items-center justify-center">
                            <MapPin className="text-[#FFFF00] w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-bold uppercase leading-none">Facility Map</h3>
                            <p className="text-[#00E676] text-[10px] font-bold mt-1">Find your studio location</p>
                        </div>
                    </div>

                    <div className="bg-black/40 border-border-2 aspect-[16/9] relative overflow-hidden group/map">
                        {/* Actual Map Image */}
                        <Image
                            src="/images/studio.webp"
                            alt="Facility Map"
                            fill
                            className="object-fill transition-transform duration-700 group-hover/map:scale-110"
                        />
                        {/* Overlay with subtle grid for aesthetic */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
                    </div>

                    <div className="mt-4 bg-[#1A1A23]/60 rounded-lg p-2.5 border-border border-white/5 flex items-center gap-2">
                        <span className="text-[#FFFF00] text-xs">📍</span>
                        <p className="text-gray-400 text-[9px] font-medium italic">
                            <span className="text-[#FFFF00] font-bold not-italic">Tip:</span> Follow the purple markers to find your studio. Ask staff if you need directions!
                        </p>
                    </div>
                </div>

                {/* Next Steps Card */}
                {/* <div className="w-full bg-[#111116]/80 border-border p-5 shadow-xl backdrop-blur-sm">
                    <h3 className="text-white text-sm font-bold uppercase mb-4 opacity-80">What happens next?</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-6 h-6 bg-[#1A1A23] border-border rounded flex items-center justify-center text-[#A855F7] text-xs font-black shrink-0">1</div>
                            <div>
                                <h4 className="text-white text-[11px] font-bold leading-none">Wait for admin approval</h4>
                                <p className="text-[#00E676] text-[9px] font-medium mt-1">✓ Approved! You can now proceed</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 bg-[#1A1A23] border-border rounded flex items-center justify-center text-[#A855F7] text-xs font-black shrink-0">2</div>
                            <div>
                                <h4 className="text-white text-[11px] font-bold leading-none">Head to your studio</h4>
                                <p className="text-gray-500 text-[9px] font-medium mt-1">Use the map above to find your studio</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 bg-[#1A1A23] border-border rounded flex items-center justify-center text-[#A855F7] text-xs font-black shrink-0">3</div>
                            <div>
                                <h4 className="text-white text-[11px] font-bold leading-none">Game automatically starts</h4>
                                <p className="text-gray-500 text-[9px] font-medium mt-1">The system will detect when you enter and begin the timer</p>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Final */}
                <button
                    onClick={() => router.push("/start-game")}
                    className="w-full bg-[#FFFF00] text-black font-black text-sm py-4 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg cursor-pointer mt-2"
                >
                    I&apos;m at the Studio - Start Game!
                </button>
            </div>
        </div>
    );
}
