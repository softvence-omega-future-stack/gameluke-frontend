"use client"
import {
    History,
    Users,
    Timer,
    CheckCircle2,
    PencilLine,
    Trash2,
    Play,
    Info,
    AlertTriangle,
    RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetWaitlistQuery, WaitlistGroup } from "@/redux/api/admin/groupsApi";

const WaitlistSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-6 w-full">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-lg" />
                    <div className="space-y-3 flex-1">
                        <div className="h-5 bg-zinc-800/50 rounded w-1/3" />
                        <div className="flex gap-4">
                            <div className="h-3 bg-zinc-800/50 rounded w-20" />
                            <div className="h-3 bg-zinc-800/50 rounded w-20" />
                        </div>
                    </div>
                </div>
                <div className="w-32 h-10 bg-zinc-800/50 rounded-lg" />
            </div>
        ))}
    </div>
);

const StatSkeleton = () => (
    <div className="bg-bg-card border border-border p-6 flex items-center justify-between animate-pulse">
        <div className="space-y-2">
            <div className="h-3 bg-zinc-800/50 rounded w-20" />
            <div className="h-8 bg-zinc-800/50 rounded w-12" />
        </div>
        <div className="w-12 h-12 bg-zinc-800/50 rounded-lg" />
    </div>
);

export default function WaitlistPage() {
    const { data: waitlistData, isLoading, isError, refetch } = useGetWaitlistQuery();
    const waitlist = waitlistData?.data || [];

    const totalPlayers = waitlist.reduce((acc, group) => acc + group.totalPlayers, 0);

    const formatWaitTime = (createdAt: string) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = Math.max(0, now.getTime() - created.getTime());
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffMins}m ${diffSecs}s`;
    };

    const longestWait = waitlist.length > 0
        ? formatWaitTime(waitlist[0].createdAt)
        : "0m 0s";

    const stats = [
        {
            label: "Groups Waiting",
            value: isLoading ? "..." : String(waitlist.length).padStart(2, '0'),
            Icon: CheckCircle2,
            iconBg: "bg-brand-info/20",
            iconColor: "text-brand-info",
        },
        {
            label: "Total Players",
            value: isLoading ? "..." : String(totalPlayers).padStart(2, '0'),
            Icon: Users,
            iconBg: "bg-brand-warning/20",
            iconColor: "text-brand-warning",
        },
        {
            label: "Longest Wait",
            value: isLoading ? "..." : longestWait,
            Icon: History,
            iconBg: "bg-brand-accent/20",
            iconColor: "text-brand-accent",
        }
    ];

    return (
        <div className="space-y-8 max-w-8xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary text-nowrap">Waitlist Management</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Manage group queue and priority settings</p>
                </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
                ) : (
                    stats.map((item, index) => (
                        <div key={index} className="bg-bg-card border border-border p-4 sm:p-6 flex items-center justify-between group transition-all duration-300 hover:border-zinc-700">
                            <div>
                                <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{item.value}</h2>
                            </div>
                            <div className={cn("p-2.5 sm:p-3 rounded-lg transition-transform group-hover:scale-110", item.iconBg)}>
                                <item.Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", item.iconColor)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Queue Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Current Queue</h3>
                    {isError && (
                        <button
                            onClick={() => refetch()}
                            className="bg-brand-error/10 text-brand-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-error/20 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Retry
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <WaitlistSkeleton />
                    ) : isError ? (
                        <div className="bg-bg-card border border-brand-error/20 rounded-2xl p-12 flex flex-col items-center text-center gap-4">
                            <AlertTriangle className="text-brand-error w-12 h-12 opacity-50" />
                            <div>
                                <h4 className="text-white font-bold">Failed to load waitlist</h4>
                                <p className="text-zinc-500 text-sm mt-1">Check your connection and try again.</p>
                            </div>
                        </div>
                    ) : waitlist.length === 0 ? (
                        <div className="bg-bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center gap-5">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                                <Users className="text-zinc-600 w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Queue is Empty</h4>
                                <p className="text-zinc-500 text-sm mt-1">There are no groups currently waiting for a studio.</p>
                            </div>
                        </div>
                    ) : (
                        waitlist.map((group, index) => (
                            <div key={group.id} className="bg-bg-card border border-border p-3 sm:p-4 sm:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 group transition-all hover:border-zinc-700">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
                                    <div className="flex flex-col items-center justify-center min-w-14 sm:min-w-16">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 border border-zinc-700 group-hover:bg-brand-secondary group-hover:border-brand-secondary group-hover:text-black rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold mb-1 transition-all">
                                            #{index + 1}
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">Position</span>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                                            <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-50 sm:max-w-none">{group.name}</h4>
                                            {index === 0 && (
                                                <span className="bg-brand-warning/20 text-brand-warning px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap animate-pulse">Next up</span>
                                            )}
                                            {group.childFriendly && (
                                                <span className="bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Child Friendly</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-zinc-400 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                                <span>{group.totalPlayers} players</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                                <span>Waiting for {formatWaitTime(group.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">Status: {group.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <button className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-all whitespace-nowrap text-sm sm:text-base">
                                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" strokeWidth={3} />
                                        Assign Studio
                                    </button>
                                    <button className="p-2.5 cursor-pointer sm:p-2 text-zinc-500 border border-zinc-800 rounded-lg hover:bg-brand-error/20 hover:text-brand-error hover:border-brand-error/50 transition-all shrink-0">
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Notification Bar */}
            <div className="bg-bg-dark/40 border border-brand-info/20 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-info/10">
                    <Info className="w-6 h-6 text-brand-info" />
                </div>
                <div>
                    <h5 className="text-brand-info text-sm sm:text-base font-bold uppercase tracking-wider">FIFO Priority Enabled</h5>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1 leading-relaxed">
                        The queue follows the First In First Out order. You can manually promote a group by assigning it to an available studio from the actions menu above.
                    </p>
                </div>
            </div>
        </div>
    );
}
