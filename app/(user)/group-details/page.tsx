"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

export default function GroupDetailsPage() {
    const router = useRouter();

    const members = [
        { id: 1, name: "John Doe", avatar: "JD" },
        { id: 2, name: "Jane Paul", avatar: "JS" },
        { id: 3, name: "Tom Latham", avatar: "TD" },
    ];

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 overflow-hidden">
            {/* Blurry Background Image - Retained per user request */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.15] blur-[8px] scale-110"
                    priority
                />
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-[600px] bg-[#111116]/95 border border-[#FFFF00]/60 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">

                {/* Header Section */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#E91E63] rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="text-white w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-[#FFFF00] text-xl font-black uppercase tracking-tight leading-tight">
                            Team Phoenix
                        </h1>
                        <p className="text-[#00E676] text-xs font-bold mt-0.5 opacity-90">
                            3 players in group
                        </p>
                    </div>
                </div>

                {/* Player Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="bg-[#1A1A23] border border-[#FFFF00]/40 rounded-xl p-3 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-[#E91E63] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md">
                                {member.avatar}
                            </div>
                            <span className="text-white text-base font-bold tracking-tight">
                                {member.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-white text-slate-900 font-black text-sm py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => router.push("/confirm-team")}
                        className="flex-1 bg-[#FFFF00] text-black font-black text-sm py-3 rounded-xl hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
                    >
                        Join Group
                    </button>
                </div>
            </div>
        </div>
    );
}
