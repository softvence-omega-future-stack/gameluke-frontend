"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Clock, Trophy, Shield, Loader2, AlertTriangle, PartyPopper, CheckCircle } from "lucide-react";
import { useGetTeamsQuery } from "@/redux/api/player/playerApi";
import { useDispatch } from "react-redux";
import { clearTimer } from "@/redux/features/timerSlice";
import { AppDispatch } from "@/redux/store/store";
import { useEnterScoresMutation } from "@/redux/api/admin/scoresApi";
import { toast } from "sonner";

const EndGameSkeleton = () => (
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
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
                ))}
            </div>
        </div>
    </div>
);

export default function EndGamePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [groupId, setGroupId] = useState<string | null>(null);
    const [selectedScores, setSelectedScores] = useState<Record<string, number>>({});
    const [playerId, setPlayerId] = useState<string | null>(null);

    const [enterScores, { isLoading: isSubmitting }] = useEnterScoresMutation();

    useEffect(() => {
        const id = localStorage.getItem("joinedGroupId");
        const pId = localStorage.getItem("playerId");
        if (id) setGroupId(id);
        if (pId) setPlayerId(pId);

        if (!id) {
            router.push("/available-group");
        }
    }, [router]);

    // Clear timer when reaching end game
    useEffect(() => {
        dispatch(clearTimer());
    }, [dispatch]);

    const { data: teamsData, isLoading, isError, refetch } = useGetTeamsQuery(groupId || "", {
        skip: !groupId,
    });

    // Initialize scores from API data
    useEffect(() => {
        if (teamsData?.data?.[0]?.subTeams) {
            const initialScores: Record<string, number> = {};
            teamsData.data[0].subTeams.forEach(team => {
                initialScores[team.name] = team.score;
            });
            setSelectedScores(initialScores);
        }
    }, [teamsData]);

    if (isLoading || !groupId) return <EndGameSkeleton />;

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
                        Failed to retrieve final scores. Please try again.
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

    const teamAssignments = teamsData?.data?.[0];
    const studio = teamAssignments?.studio;
    const subTeams = teamAssignments?.subTeams || [];

    const totalScore = Object.values(selectedScores).reduce((acc, score) => acc + score, 0);

    const handleScoreChange = (teamName: string, value: string) => {
        setSelectedScores(prev => ({
            ...prev,
            [teamName]: parseInt(value) || 0
        }));
    };

    const handleSubmitScores = async () => {
        if (!teamAssignments?.id || !playerId) {
            toast.error("Missing required information for submission");
            return;
        }

        try {
            await enterScores({
                assignmentId: teamAssignments.id,
                scores: selectedScores,
                playerId: playerId
            }).unwrap();

            toast.success("Game result submitted successfully!");
            router.push("/game-complete");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit scores");
        }
    };

    // Calculate winners based on selected scores for visual feedback
    const maxScore = Math.max(...Object.values(selectedScores), 0);

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

                {/* Header Card */}
                <div className="bg-[#4D0F28] border-border p-4 flex flex-col items-center relative overflow-hidden">
                    <div className="flex w-full justify-between items-start mb-2 relative">
                        {/* Left */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Time Remaining
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#E91E63] rounded-lg">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-2xl font-black">00:00</span>
                            </div>
                        </div>

                        {/* Center title for Desktop */}
                        <h1 className="hidden sm:block text-[#FFFF00] text-xl font-black uppercase tracking-tight absolute left-1/2 -translate-x-1/2 top-4">
                            {studio?.gameName || "Basketball"} Game
                        </h1>

                        {/* Right */}
                        <div className="flex flex-col items-end">
                            <h1 className="sm:hidden text-[#FFFF00] text-lg text-nowrap font-black uppercase tracking-tight">
                                {studio?.gameName || "Basketball"} Game
                            </h1>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Total Score
                            </span>
                            <span className="text-2xl font-black">{totalScore}</span>
                        </div>
                    </div>
                    {/* Progress Bar (Full) */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full mt-2 overflow-hidden border-border border-white/5">
                        <div className="h-full bg-white w-full"></div>
                    </div>
                </div>

                {/* Playing Status */}
                <div className="w-full bg-[#1A1A1A] border-border p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Playing as</span>
                        <span className="text-[#FFFF00] text-base font-black uppercase">{subTeams[0]?.name || "Team Phoenix"}</span>
                    </div>
                    <div className="bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full"></div>
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
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Select Score</span>
                                    <select
                                        value={selectedScores[team.name] || 100}
                                        onChange={(e) => handleScoreChange(team.name, e.target.value)}
                                        className="w-24 bg-black/40 border-border text-[#FFFF00] text-xl font-black text-center focus:outline-none focus:border-[#FFFF00] transition-all cursor-pointer rounded h-10 px-2"
                                    >
                                        {[100, 200, 300].map(val => (
                                            <option key={val} value={val} className="bg-[#111111] text-white">
                                                {val}
                                            </option>
                                        ))}
                                    </select>
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

                {/* Action Button */}
                <button
                    onClick={handleSubmitScores}
                    disabled={isSubmitting}
                    className="w-full bg-[#FFFF00] text-black font-black text-sm py-4 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg mt-2 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter Game Result"}
                </button>
            </div>
        </div>
    );
}
