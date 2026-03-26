"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Clock, Trophy, Users, Shield, Loader2, AlertTriangle, AlertCircle } from "lucide-react";
import { useGetTeamsQuery } from "@/redux/api/player/playerApi";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, syncTimer } from "@/redux/features/timerSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import { useTimer } from "@/hooks/useTimer";
import { cn } from "@/lib/utils";

const StartGameSkeleton = () => (
    <div className="relative min-h-screen bg-[#141414] text-white p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
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
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4 animate-pulse">
            <div className="h-32 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
            <div className="h-12 bg-zinc-900/60 border border-zinc-800 rounded-xl" />
            <div className="h-20 bg-zinc-900/60 border border-zinc-800 rounded-xl" />
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
                ))}
            </div>
        </div>
    </div>
);

export default function StartGamePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { timeLeft, formattedTime } = useTimer();
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    const [groupId, setGroupId] = useState<string | null>(null);

    const timerState = useSelector((state: RootState) => state.timer);

    useEffect(() => {
        const id = localStorage.getItem("joinedGroupId");
        if (id) {
            setGroupId(id);
        } else {
            router.push("/available-group");
        }
    }, [router]);

    const { data: teamsData, isLoading, isError, refetch } = useGetTeamsQuery(groupId || "", {
        skip: !groupId,
    });

    // Sync timer from server if not active
    useEffect(() => {
        if (teamsData?.data?.[0]?.createdAt && !timerState.isActive) {
            const startTime = new Date(teamsData.data[0].createdAt).getTime();
            const duration = 12 * 60; // 12 minutes standard duration
            dispatch(syncTimer({ startTime, duration }));
        }
    }, [teamsData, timerState.isActive, dispatch]);

    const sessionDuration = timerState.duration || 12 * 60;

    useEffect(() => {
        if (timeLeft <= 0 && timerState.isActive) {
            router.push("/end-game");
        }
    }, [timeLeft, timerState.isActive, router]);


    if (isLoading || !groupId) return <StartGameSkeleton />;

    if (isError) {
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
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Sync Error</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        We couldn't retrieve the live game data. Please check your connection.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="w-full bg-[#FFFF00] text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Loader2 className="w-5 h-5" />
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    const teamAssignment = teamsData?.data?.[0];
    const studio = teamAssignment?.studio;
    const subTeams = teamAssignment?.subTeams || [];

    // Derive "Playing as" team - for now let's show the first team or find based on current user if possible
    // Given the prompt, showing the context of the group's assigned teams
    const playingTeamName = subTeams[0]?.name || "Team Phoenix";

    return (
        <div className="relative min-h-screen bg-[#141414] text-white p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
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

            <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">
                {/* Low Time Warning */}
                {timeLeft < 10 * 60 && timeLeft > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 text-xs font-bold uppercase tracking-wider">
                            Warning: Less than 10 minutes remaining!
                        </span>
                    </div>
                )}

                {/* Header Card */}
                <div className="bg-[#4D0F28] border-border p-4 flex flex-col items-center relative overflow-hidden">
                    <div className="flex w-full justify-between items-start mb-2 relative">
                        {/* Left */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Time Remaining
                            </span>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    timeLeft < 10 * 60 ? "bg-red-600" : "bg-[#E91E63]"
                                )}>
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <span className={cn(
                                    "text-2xl font-black transition-colors",
                                    timeLeft < 10 * 60 ? "text-red-500" : "text-white"
                                )}>
                                    {formattedTime}
                                </span>
                            </div>
                        </div>

                        {/* Middle (Desktop) */}
                        <div className="hidden sm:flex flex-col absolute left-1/2 -translate-x-1/2 top-4">
                            <h1 className="text-[#FFFF00] text-xl font-black uppercase tracking-tight">
                                {studio?.gameName || "Basketball"} Game
                            </h1>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end">
                            <h1 className="text-[#FFFF00] text-lg font-black uppercase text-nowrap tracking-tight sm:hidden">
                                {studio?.gameName || "Basketball"} Game
                            </h1>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Total Score
                            </span>
                            <span className="text-2xl font-black">
                                {subTeams.reduce((acc, team) => acc + team.score, 0)}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full mt-2 overflow-hidden border-border border-white/5">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000",
                                timeLeft < 10 * 60 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-white"
                            )}
                            style={{ width: `${(timeLeft / sessionDuration) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Rules Button */}
                <button
                    onClick={() => setIsRulesModalOpen(true)}
                    className="w-full bg-[#FFFF00] text-black cursor-pointer font-black text-sm py-3 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg"
                >
                    Game Rules
                </button>

                {/* Playing Status */}
                <div className="w-full bg-[#1A1A1A] border-border p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Playing as</span>
                        <span className="text-[#FFFF00] text-base font-black uppercase">{playingTeamName}</span>
                    </div>
                    <div className="bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-pulse"></div>
                        <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* Teams List */}
                <div className="space-y-4">
                    {subTeams.map((team, idx) => (
                        <div key={team.id} className="bg-[#111111] border-border p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: team.color || (idx === 0 ? '#E91E63' : '#2196F3') }}>
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{team.name}</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Score</span>
                                    <span className="text-[#FFFF00] text-2xl font-black leading-none">{String(team.score).padStart(2, '0')}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {team.players.map((p, pIdx) => (
                                    <div key={p.id} className="bg-[#1C2028] border-border-3 border-white/5 p-3 flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg border" style={{ borderColor: idx % 2 === 0 ? '#E91E63' : '#2196F3' }}>
                                            <Trophy className="w-3.5 h-3.5" style={{ color: idx % 2 === 0 ? '#E91E63' : '#2196F3' }} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300">{p.player.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rules Modal */}
            {isRulesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0F172A] border border-white/5 w-full max-w-md relative overflow-hidden shadow-2xl rounded-3xl">
                        <button
                            onClick={() => setIsRulesModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="p-8">
                            <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-8">{studio?.gameName || "Game"} rules</h2>

                            <div className="space-y-6 text-gray-300 text-base font-medium">
                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">1. Players</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>{teamAssignment?.config?.teamSetup || "Standard"} match formation</li>
                                        <li>All players must be at their positions</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">2. Time</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Total session time: {Math.floor(sessionDuration / 60)} minutes</li>
                                        <li>Watch the countdown for session expiry</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">3. Scoring</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>Follow arena scoring instructions</li>
                                        <li>Points are updated in real-time</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">4. Conduct</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>Fair play is essential</li>
                                        <li>Respect opponent teams</li>
                                    </ul>
                                </section>
                            </div>

                            <button
                                onClick={() => setIsRulesModalOpen(false)}
                                className="w-full mt-8 bg-[#FFFF00] text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all uppercase tracking-widest text-sm"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
