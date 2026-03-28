"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Shuffle, Check, AlertTriangle, Loader2, Users } from "lucide-react";
import { useGetTeamsQuery, useConfirmTeamsMutation } from "@/redux/api/player/playerApi";
import { toast } from "sonner";
import socketService from "@/lib/socket";

interface Player {
    id: string;
    name: string;
    avatar: string;
    email: string;
}

interface Team {
    id: string;
    name: string;
    color: string;
    players: Player[];
}

const ConfirmTeamSkeleton = () => (
    <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 py-8 overflow-hidden">
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
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center animate-pulse">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl mb-5" />
            <div className="text-center mb-6 space-y-2">
                <div className="h-8 w-48 bg-zinc-800 rounded mx-auto" />
                <div className="h-4 w-64 bg-zinc-800 rounded mx-auto" />
            </div>
            <div className="flex gap-2 mb-8">
                <div className="h-6 w-32 bg-zinc-800 rounded-full" />
                <div className="h-6 w-24 bg-zinc-800 rounded-full" />
            </div>
            <div className="w-full space-y-4 mb-10">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-zinc-800 rounded" />
                            <div className="h-3 w-20 bg-zinc-800 rounded" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-full bg-zinc-800 rounded-lg" />
                        <div className="h-12 w-full bg-zinc-800 rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="w-full flex gap-3">
                <div className="h-12 flex-1 bg-zinc-800 rounded-[14px]" />
                <div className="h-12 flex-1 bg-zinc-800 rounded-[14px]" />
            </div>
        </div>
    </div>
);

export default function ConfirmTeamPage() {
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

    const { data: teamsData, isLoading, isError, refetch } = useGetTeamsQuery(groupId || "", {
        skip: !groupId
    });

    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        if (teamsData?.success && teamsData.data?.[0]) {
            const assignment = teamsData.data[0];
            const colors = ["#E91E63", "#2196F3", "#00E676", "#FFFF00", "#A855F7"];

            const mappedTeams: Team[] = assignment.subTeams.map((st, index) => ({
                id: st.id,
                name: st.name,
                color: colors[index % colors.length],
                players: st.players.map(p => ({
                    id: p.player.id,
                    name: p.player.name,
                    email: p.player.email,
                    avatar: p.player.name.substring(0, 2).toUpperCase()
                }))
            }));

            setTeams(mappedTeams);
        }
    }, [teamsData]);

    // Socket integration for real-time player updates
    useEffect(() => {
        if (!groupId) return;

        const socket = socketService.getSocket();

        // Join group room
        socket.emit('join-group', { groupId });

        // Listen for new players
        socket.on('join-group', () => {
            console.log("Player joined on ConfirmTeamPage, refetching teams...");
            refetch();
        });

        return () => {
            socket.off('player-joined');
        };
    }, [groupId, refetch]);

    const configuration = (teamsData?.data?.[0] as any)?.config?.teamSetup || teams.map(t => t.players.length).join("v");

    const totalPlayers = teams.reduce((acc, t) => acc + t.players.length, 0);
    const maxPlayers = (teamsData?.data?.[0] as any)?.config?.studioSize || 12;
    const isFull = totalPlayers === maxPlayers;

    const handleShuffle = () => {
        const allPlayers = teams.flatMap(t => t.players);
        // Fisher-Yates shuffle
        for (let i = allPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
        }

        // Redistribute into the same number of teams
        const teamCount = teams.length;
        const newTeams = teams.map(t => ({ ...t, players: [] as Player[] }));
        allPlayers.forEach((player, index) => {
            newTeams[index % teamCount].players.push(player);
        });
        setTeams(newTeams);
    };

    // Drag and Drop Logic
    const [draggedPlayer, setDraggedPlayer] = useState<{ playerId: string, fromTeamId: string } | null>(null);

    const onDragStart = (playerId: string, fromTeamId: string) => {
        setDraggedPlayer({ playerId, fromTeamId });
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (toTeamId: string) => {
        if (!draggedPlayer) return;
        if (draggedPlayer.fromTeamId === toTeamId) {
            setDraggedPlayer(null);
            return;
        }

        const sourceTeam = teams.find(t => t.id === draggedPlayer.fromTeamId);
        const player = sourceTeam?.players.find(p => p.id === draggedPlayer.playerId);

        if (!player) return;

        setTeams(prev => prev.map(t => {
            if (t.id === draggedPlayer.fromTeamId) {
                return { ...t, players: t.players.filter(p => p.id !== draggedPlayer.playerId) };
            }
            if (t.id === toTeamId) {
                return { ...t, players: [...t.players, player] };
            }
            return t;
        }));
        setDraggedPlayer(null);
    };

    const [confirmTeams, { isLoading: isConfirming }] = useConfirmTeamsMutation();

    const handleConfirm = async () => {
        if (!groupId) return;

        if (totalPlayers < 2) {
            toast.error("Minimum 2 players required to confirm teams", {
                description: "Add more players or join an existing group with more members.",
                style: {
                    background: "#111116",
                    border: "1px solid #333",
                    color: "#fff"
                }
            });
            return;
        }

        try {
            const payload = {
                groupId,
                teams: teams.map(t => ({
                    teamId: t.id,
                    playerIds: t.players.map(p => p.id)
                }))
            };

            const res = await confirmTeams(payload).unwrap();
            if (res.success) {
                toast.success("Teams confirmed successfully!", {
                    style: {
                        background: "#111116",
                        border: "1px solid #00E67650",
                        color: "#00E676"
                    }
                });
                router.push("/get-ready");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to confirm teams", {
                style: {
                    background: "#111116",
                    border: "1px solid #E91E6350",
                    color: "#E91E63"
                }
            });
        }
    };

    if (isLoading || !groupId) return <ConfirmTeamSkeleton />;

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
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">System Error</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        We couldn't retrieve your team assignments. Please check your connection and try again.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="w-full bg-[#FFFF00] text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                    >
                        <Shuffle className="w-5 h-5" />
                        Retry Connection
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="w-full mt-4 text-gray-500 font-bold text-sm hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 py-8 overflow-hidden">
            {/* Blurry Background Image */}
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

            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">

                {/* Header Icon */}
                <div className="w-12 h-12 bg-[#E91E63] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-pink-500/10">
                    <Shield className="text-white w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Title Section */}
                <div className="text-center mb-6">
                    <h1 className="text-[#FFFF00] text-3xl font-[900] tracking-tighter leading-none mb-2">
                        Team Assignment
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Review your teams before entering the arena
                    </p>
                </div>

                {/* Configuration Badges */}
                <div className="flex gap-2 mb-8">
                    <div className="bg-[#1A1A23]/80 border-border rounded-full px-4 py-1 flex items-center">
                        <span className="text-[#A855F7] text-[11px] font-bold">Configuration: {configuration}</span>
                    </div>
                    <div className="bg-[#1A1A23]/80 border-border rounded-full px-4 py-1 flex items-center">
                        <span className="text-[#2196F3] text-[11px] font-bold">{totalPlayers} Players</span>
                    </div>
                </div>

                {/* Team List Containers */}
                <div className="w-full space-y-4 mb-10">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            onDragOver={onDragOver}
                            onDrop={() => onDrop(team.id)}
                            className="bg-[#111116]/80 border-border p-4 shadow-xl backdrop-blur-sm transition-colors hover:border-[#FFFF00]/50"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${team.color}20` }}>
                                    <Shield className="w-6 h-6" style={{ color: team.color }} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-white text-base font-bold leading-tight">{team.name}</h3>
                                    <p className="text-gray-400 text-[11px] font-medium">{team.players.length} member{team.players.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {team.players.map((player) => (
                                    <div
                                        key={player.id}
                                        draggable
                                        onDragStart={() => onDragStart(player.id, team.id)}
                                        className="bg-[#1A1A23] border-border p-2.5 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all hover:bg-[#22222E]"
                                    >
                                        <div
                                            className="w-8 h-8 p-1 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md"
                                            style={{ backgroundColor: team.color }}
                                        >
                                            {player.avatar}
                                        </div>
                                        <span className="text-white text-sm font-bold tracking-tight">
                                            {player.name}
                                        </span>
                                    </div>
                                ))}
                                {team.players.length === 0 && (
                                    <div className="h-12 border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-700 text-xs font-bold">
                                        Drop player here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex gap-3 mb-6">
                    <button
                        onClick={handleShuffle}
                        className="flex-1 bg-white text-[#A855F7] font-black text-sm py-3 rounded-[14px] hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Shuffle className="w-4 h-4" strokeWidth={3} />
                        Shuffle
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming || !isFull}
                        className="flex-1 bg-[#FFFF00] text-black font-black text-sm py-4 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isConfirming ? (
                            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={4} />
                        ) : !isFull ? (
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 opacity-50" />
                                <span className="opacity-50">Waiting for players ({totalPlayers}/{maxPlayers})</span>
                            </div>
                        ) : (
                            <>
                                <Check className="w-4 h-4" strokeWidth={4} />
                                Confirm Teams
                            </>
                        )}
                    </button>
                </div>

                {/* Bottom Instruction */}
                <p className="text-[#00E676] text-[10px] font-bold tracking-tight text-center opacity-80 max-w-[300px]">
                    Drag and drop players between teams to manually adjust assignments or shuffle for random.
                </p>
            </div>
        </div>
    );
}
