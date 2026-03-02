"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function AvailableGroupPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Player");

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) setUserName(storedName);
    }, []);

    const groups = [
        {
            id: 1,
            name: "Team Phoenix",
            tag: "( Children Groups )",
            players: 2,
            slots: 4,
            teams: 3
        },
        {
            id: 2,
            name: "Dragon Squad",
            tag: "",
            players: 1,
            slots: 5,
            teams: 3
        },
    ];

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 overflow-hidden">
            {/* Blurry Background Image */}
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

            {/* Content overlay */}
            <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center">

                {/* Header Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5">
                    <Users className="text-black w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Welcome Message */}
                <div className="text-center mb-8">
                    <h1 className="text-[#FFFF00] text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">
                        Welcome, {userName} !
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Join or create your gaming group
                    </p>
                </div>

                {/* Available Groups List */}
                <div className="w-full">
                    <h2 className="text-white text-xs font-bold mb-4 ml-1 opacity-60">
                        Available Groups ({groups.length})
                    </h2>

                    <div className="space-y-3">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => router.push("/group-details")}
                                className="group cursor-pointer bg-[#121216]/90 border border-[#FFFF00]/60 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-[#1A1A1F] active:scale-[0.98] backdrop-blur-sm"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-white text-base font-bold">
                                        {group.name}
                                        {group.tag && (
                                            <span className="text-[#E91E63] text-xs font-medium ml-2">
                                                {group.tag}
                                            </span>
                                        )}
                                    </h3>
                                    <div className="text-[#00E676] text-[11px] font-bold flex items-center gap-1">
                                        <span>{group.players} players</span>
                                        <span className="text-gray-500">•</span>
                                        <span>{group.slots} slots available</span>
                                        <span className="text-gray-500">•</span>
                                        <span>{group.teams} Teams</span>
                                    </div>
                                </div>

                                <ArrowRight className="text-[#00E676] w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => router.push("/login")}
                    className="mt-8 text-gray-500 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-widest"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
