"use client"
import { Shield, MapPin, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { useGetGroupDetailsQuery, useGetStudioDetailsQuery } from "@/redux/api/player/playerApi";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MapSkeleton = () => (
    <div className="relative min-h-screen bg-black text-white p-4 py-12 md:p-8 flex items-center justify-center overflow-x-hidden">
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
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center gap-6 animate-pulse">
            <div className="h-8 w-32 bg-zinc-800 rounded-full mb-2" />
            <div className="space-y-4 w-full">
                <div className="h-10 w-48 bg-zinc-800 rounded mx-auto" />
                <div className="h-4 w-64 bg-zinc-800 rounded mx-auto" />
            </div>
            <div className="w-full h-24 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
            <div className="w-full h-40 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
            <div className="w-full h-64 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
            <div className="w-full h-14 bg-zinc-800 rounded-2xl" />
        </div>
    </div>
);

export default function ArenaMapPage() {
    const router = useRouter();
    const [groupId, setGroupId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("joinedGroupId");
        if (id) {
            setGroupId(id);
        } else {
            router.push("/available-group");
        }
    }, [router]);

    // Fetch group details to find assigned studio
    const { data: groupData, isLoading: isGroupLoading, isError: isGroupError } = useGetGroupDetailsQuery(groupId || "", {
        skip: !groupId
    });

    // In a real scenario, the studioId would come from groupData.
    // For now, if not in groupData, we fallback to 1 as per user's example.
    const studioId = groupData?.data?.studioAssignments?.[0]?.studioId || 1;

    const { data: studioData, isLoading: isStudioLoading, isError: isStudioError, refetch } = useGetStudioDetailsQuery(studioId, {
        skip: !groupData?.success
    });

    if (isGroupLoading || isStudioLoading || !groupId) return <MapSkeleton />;

    if (isGroupError || isStudioError) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/arcade-bg.png"
                        alt="Arcade Background"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="brightness-[0.2] blur-[8px]"
                    />
                </div>
                <div className="relative z-10 w-full max-w-sm bg-[#111116]/90 border border-red-900/30 p-8 rounded-3xl text-center backdrop-blur-md">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Data Error</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        We couldn't retrieve your arena location. Please try again or ask staff for help.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="w-full bg-[#FFFF00] text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Loader2 className="w-5 h-5" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const group = groupData?.data;
    const studio = studioData?.data;

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
                <div className="flex items-center gap-2 bg-[#121216] border border-white/5 px-4 py-1.5 shadow-[0_0_15px_rgba(0,230,118,0.1)] rounded-full">
                    <div className="w-2.5 h-2.5 bg-[#00E676] rounded-full animate-pulse shadow-[0_0_8px_#00E676]"></div>
                    <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest">
                        {studio?.status === "OCCUPIED" ? "Game In Progress" : "Arena Ready!"}
                    </span>
                </div>

                {/* Title Section */}
                <div className="text-center mb-2">
                    <h1 className="text-[#FFFF00] text-3xl font-[900] tracking-tighter leading-none mb-1">
                        Get Ready!
                    </h1>
                    <p className="text-gray-400 text-xs font-semibold">
                        {studio?.gameName || "Basketball"} - Level Activated
                    </p>
                </div>

                {/* Game Ready Alert Card */}
                <div className="w-full bg-[#1A1A23]/60 border border-white/5 p-4 flex items-center gap-4 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-[#00E676]/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="text-[#00E676] w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-bold uppercase">Game is Activated!</h3>
                        <p className="text-gray-400 text-[10px] font-medium leading-tight">
                            The arena is primed for <span className="text-[#FFFF00]">{group?.name}</span> - head to your location!
                        </p>
                    </div>
                </div>

                {/* Team & Studio Info Card */}
                <div className="w-full bg-[#111116]/80 border border-white/5 p-5 shadow-xl backdrop-blur-sm rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E91E63] rounded-xl flex items-center justify-center">
                                <Shield className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[#00E676] text-[10px] font-bold uppercase tracking-wide">Assigned Group</p>
                                <h3 className="text-white text-sm font-black uppercase">{group?.name || "Team Phoenix"}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1A1A23] border border-white/5 p-6 flex flex-col items-center rounded-2xl">
                        <div className="w-12 h-12 bg-[#FFFF00] rounded-xl flex items-center justify-center mb-3">
                            <MapPin className="text-black w-6 h-6" />
                        </div>
                        <p className="text-[#00E676] text-[10px] font-bold uppercase mb-1">Your Location</p>
                        <h2 className="text-white text-3xl font-black uppercase mb-1 tracking-tight">
                            {studio?.name || `Studio ${studio?.studioNumber || 1}`}
                        </h2>
                        <p className="text-gray-500 text-[9px] font-medium text-center">
                            Your session time is active! Please proceed to the arena entry.
                        </p>
                    </div>
                </div>

                {/* Facility Map Card */}
                <div className="w-full bg-[#111116]/80 border border-white/5 p-5 shadow-xl backdrop-blur-sm rounded-3xl overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-yellow-900/40 rounded-lg flex items-center justify-center">
                            <MapPin className="text-[#FFFF00] w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-bold uppercase leading-none">Studio Location</h3>
                            <p className="text-[#00E676] text-[10px] font-bold mt-1 tracking-wider uppercase">Find your entry point</p>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 aspect-[16/9] relative rounded-2xl overflow-hidden group/map">
                        <Image
                            src={studio?.imageUrl ? `https://4lbnzk45-5000.asse.devtunnels.ms${studio.imageUrl}` : "/images/studio.webp"}
                            alt="Facility Map"
                            fill
                            className="object-cover transition-transform duration-700 group-hover/map:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="mt-4 bg-[#1A1A23]/60 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <span className="text-[#FFFF00] text-lg">💡</span>
                        <p className="text-gray-400 text-[10px] font-medium leading-relaxed">
                            <span className="text-[#FFFF00] font-bold uppercase mr-1">Navigation Tip:</span>
                            Locate the <span className="text-white font-bold">{studio?.name}</span> entry portal. Staff members are available if you need further assistance!
                        </p>
                    </div>
                </div>

                {/* Final Action */}
                <button
                    onClick={() => router.push("/start-game")}
                    className="w-full bg-[#FFFF00] text-black font-black text-sm py-4 rounded-2xl hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-2xl shadow-yellow-400/20 cursor-pointer mt-2 uppercase tracking-widest"
                >
                    I&apos;m at the Studio - Start Game!
                </button>
            </div>
        </div>
    );
}
