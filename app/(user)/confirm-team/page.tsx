"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Shuffle, Check } from "lucide-react";

interface Player {
    id: number;
    name: string;
    avatar: string;
}

interface Team {
    id: number;
    name: string;
    color: string;
    players: Player[];
}

export default function ConfirmTeamPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const [teams, setTeams] = useState<Team[]>([
        {
            id: 1,
            name: "Team 1",
            color: "#E91E63",
            players: [{ id: 101, name: "John Doe", avatar: "JD" }]
        },
        {
            id: 2,
            name: "Team 2",
            color: "#2196F3",
            players: [{ id: 102, name: "Jane Smith", avatar: "JS" }]
        },
        {
            id: 3,
            name: "Team 3",
            color: "#00E676",
            players: []
        },
    ]);

    useEffect(() => {
        const storedName = localStorage.getItem("userName") || "Tom Latham";
        setUserName(storedName);

        // Add user to Team 3 initially (to make it 3 players total as per previous design)
        setTeams(prev => prev.map(t => {
            if (t.id === 3 && t.players.length === 0) {
                return { ...t, players: [{ id: 999, name: storedName, avatar: storedName.substring(0, 2).toUpperCase() }] };
            }
            return t;
        }));
    }, []);

    const totalPlayers = teams.reduce((acc, t) => acc + t.players.length, 0);
    const configuration = teams.map(t => t.players.length).join("v");

    const handleShuffle = () => {
        const allPlayers = teams.flatMap(t => t.players);
        // Fisher-Yates shuffle
        for (let i = allPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
        }

        // Redistribute into 3 teams
        const newTeams = teams.map(t => ({ ...t, players: [] as Player[] }));
        allPlayers.forEach((player, index) => {
            newTeams[index % 3].players.push(player);
        });
        setTeams(newTeams);
    };

    // Drag and Drop Logic
    const [draggedPlayer, setDraggedPlayer] = useState<{ playerId: number, fromTeamId: number } | null>(null);

    const onDragStart = (playerId: number, fromTeamId: number) => {
        setDraggedPlayer({ playerId, fromTeamId });
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (toTeamId: number) => {
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
                        onClick={() => router.push("/waiting-room")}
                        className="flex-1 bg-[#FFFF00] text-black font-black text-sm py-3 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Check className="w-4 h-4" strokeWidth={4} />
                        Confirm
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
