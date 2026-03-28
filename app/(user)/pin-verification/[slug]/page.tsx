"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Lock, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useJoinGroupMutation, useGetGroupDetailsQuery } from "@/redux/api/player/playerApi";
import socketService from "@/lib/socket";

export default function PinVerificationPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const [pin, setPin] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [joinGroup, { isLoading }] = useJoinGroupMutation();
    const { data: groupData } = useGetGroupDetailsQuery(slug);

    const groupName = groupData?.data?.name || "Group";

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const email = localStorage.getItem("playerEmail");
        if (!email) {
            setError("Session expired. Please login again.");
            return;
        }

        if (!pin) {
            setError("Please enter the group PIN");
            return;
        }

        try {
            const response = await joinGroup({ pin, email }).unwrap();
            if (response.success) {
                // Emit socket event for joining the group
                const socket = socketService.getSocket();
                socket.emit('join-group', { groupId: slug });

                // Success! Store group ID and redirect to confirm-team
                localStorage.setItem("joinedGroupId", slug);
                router.push(`/group-details/${slug}`);
            }
        } catch (err: any) {
            setError(err?.data?.message || "Invalid PIN. Please check and try again.");
            console.error("Join error:", err);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.2] blur-[8px] scale-110"
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-[#111116]/95 border border-white/5 p-8 sm:p-10 shadow-3xl backdrop-blur-xl rounded-[32px] text-center border-t-white/10">
                    {/* Header Icon */}
                    <div className="w-16 h-16 bg-[#FFFF00] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-400/10 ring-8 ring-yellow-400/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Lock className="text-black w-8 h-8" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-white text-2xl font-black uppercase tracking-tight mb-2">
                        Enter Group PIN
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mb-8">
                        Enter the secret PIN for <span className="text-[#FFFF00] font-bold">{groupName}</span> to join the arena.
                    </p>

                    <form onSubmit={handleJoin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
                                <p className="text-red-500 text-xs font-bold text-left">{error}</p>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="E.G. ABC123"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full bg-white/5 border-2 border-white/10 py-5 px-6 text-2xl font-black tracking-[0.4em] text-center text-[#FFFF00] placeholder:text-gray-700 placeholder:tracking-normal focus:outline-none focus:border-[#FFFF00]/50 transition-all rounded-2xl uppercase ring-offset-black focus:ring-2 focus:ring-[#FFFF00]/20"
                                maxLength={10}
                                required
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#FFFF00] text-black font-black text-base py-5 rounded-2xl hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-2xl shadow-yellow-400/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Arena
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full bg-white/5 text-white font-bold text-sm py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] border border-white/5 uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                            Security Verified Interface
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
