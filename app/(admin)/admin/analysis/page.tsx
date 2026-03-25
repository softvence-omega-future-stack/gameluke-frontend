"use client";

import React, { useState, useMemo } from "react";
import {
    Users,
    Clock,
    TrendingUp,
    Calendar,
    Download,
    Trophy,
    Activity,
    ChevronRight
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { format } from "date-fns";
import { useGetAnalyticsQuery } from "@/redux/api/admin/dashboardApi";
import { AlertCircle, RefreshCcw, AlertTriangle } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    Area,
    AreaChart
} from "recharts";

const topGroupsColors = ["#ff8c00", "#94a3b8", "#f97316", "#c026d3", "#db2777"];

const Skeleton = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <div className={`bg-zinc-800/50 animate-pulse rounded ${className}`} style={style} />
);

const SummaryCardSkeleton = () => (
    <div className="bg-bg-card border border-border p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-32" />
    </div>
);

const ChartSkeleton = ({ title }: { title: string }) => (
    <div className="bg-bg-card border-border p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="h-[300px] w-full flex items-end gap-2 px-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton 
                    key={i} 
                    className="flex-1" 
                    style={{ height: `${20 + Math.random() * 60}%` }} 
                />
            ))}
        </div>
    </div>
);

const TopGroupSkeleton = () => (
    <div className="bg-bg-card border-border p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-bg-card border-border-2 gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="flex gap-12">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CustomXAxisTick = ({ x, y, payload }: any) => {
    if (!payload.value) return null;
    const value = payload.value.split(" ")[0];

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="middle"
                fill="#3dffb3"
                fontSize={14}
                fontWeight="bold"
            >
                {value}
            </text>
            <text
                x={0}
                y={0}
                dy={32}
                textAnchor="middle"
                fill="#3dffb3"
                fontSize={10}
            >
                players
            </text>
        </g>
    );
};

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const queryParams = useMemo(() => {
        if (!dateRange?.from) return { dateFilter: "today" };

        const start = format(dateRange.from, "yyyy-MM-dd");
        const end = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : start;

        // Check if it's today
        const today = format(new Date(), "yyyy-MM-dd");
        if (start === today && end === today) {
            return { dateFilter: "today" };
        }

        return {
            dateFilter: "custom",
            startDate: start,
            endDate: end
        };
    }, [dateRange]);

    const { data: analyticsData, isLoading, isError, refetch } = useGetAnalyticsQuery(queryParams);

    const displayData = useMemo(() => {
        if (!analyticsData?.data) return null;

        const { overview, traffic, groupSizes, topGroups } = analyticsData.data;

        return {
            traffic: traffic.map(t => ({
                time: `${String(t.hour).padStart(2, '0')}:00`,
                value: t.players
            })),
            distribution: groupSizes.map(g => ({
                name: `${g.size} players`,
                count: g.count
            })),
            topGroups: topGroups.map((g, index) => ({
                ...g,
                color: topGroupsColors[index % topGroupsColors.length]
            })),
            sessions: overview.totalSessions,
            players: overview.totalPlayers,
            avgTime: overview.avgSessionTime + "m",
            sessionGrowth: overview.sessionGrowth >= 0 ? `+${overview.sessionGrowth}%` : `${overview.sessionGrowth}%`,
            playerGrowth: overview.playerGrowth >= 0 ? `+${overview.playerGrowth}%` : `${overview.playerGrowth}%`,
        };
    }, [analyticsData]);

    if (isError) {
        return (
            <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center gap-6 px-4">
                <div className="w-20 h-20 bg-brand-error/10 rounded-full flex items-center justify-center border border-brand-error/20">
                    <AlertTriangle className="text-brand-error w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Failed to load analytics</h2>
                    <p className="text-gray-400 max-w-md mx-auto">We encountered an issue while fetching the reports. Please check your connection or try again.</p>
                </div>
                <button 
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#fff200] text-black rounded-lg font-bold hover:bg-[#e6d800] transition-all"
                >
                    <RefreshCcw size={18} />
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">Analytics & Reports</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Performance insights and engagement metrics</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <DateRangePicker value={dateRange} onChange={setDateRange} className="w-full sm:w-auto" />
                    <button className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-[#fff200] text-black rounded-lg text-sm font-bold hover:bg-[#e6d800] transition-colors shadow-[0_0_15px_rgba(255,242,0,0.3)] w-full sm:w-auto">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {isLoading ? (
                    <>
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                    </>
                ) : (
                    <>
                        <SummaryCard
                            title="Total Sessions"
                            value={displayData?.sessions.toString() || "0"}
                            trend={displayData?.sessionGrowth + " vs prev period" || "0%"}
                            icon={<Activity className="text-purple-400" size={20} />}
                            iconColor="bg-purple-900/30 border-purple-500/30"
                        />
                        <SummaryCard
                            title="Total Players"
                            value={displayData?.players.toString() || "0"}
                            trend={displayData?.playerGrowth + " vs prev period" || "0%"}
                            icon={<Users className="text-blue-400" size={20} />}
                            iconColor="bg-blue-900/30 border-blue-500/30"
                        />
                        <SummaryCard
                            title="Avg Session Time"
                            value={displayData?.avgTime || "0m"}
                            trend="Per group"
                            icon={<Clock className="text-green-400" size={20} />}
                            iconColor="bg-green-900/30 border-green-500/30"
                            hideTrendIcon
                        />
                    </>
                )}
            </div>

            {/* Charts Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartSkeleton title="Player Traffic (Hourly)" />
                    <ChartSkeleton title="Group Size Distribution" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-bg-card border-border p-6">
                        <h2 className="text-[#fff200] text-base font-bold mb-6">Player Traffic (Hourly)</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayData?.traffic}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#666"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                        itemStyle={{ color: "#3b82f6" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#141414" }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-bg-card border-border p-6">
                        <h2 className="text-[#fff200] text-base font-bold mb-6">Group Size Distribution</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={displayData?.distribution} margin={{ bottom: 40, top: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#3dffb3"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={0}
                                        tick={<CustomXAxisTick />}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                        {displayData?.distribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill="#ec4899" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Performing Groups */}
            {isLoading ? (
                <TopGroupSkeleton />
            ) : (
                <div className="bg-bg-card border-border p-6 mb-8">
                    <div className="flex items-center gap-2 mb-6 text-[#fff200]">
                        <Trophy size={24} />
                        <h2 className="text-base font-bold font-heading">Top Performing Groups</h2>
                    </div>

                    {!displayData || displayData.topGroups.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center gap-4 bg-bg-card border-border-2">
                            <Trophy size={48} className="text-gray-700" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No data available for this period</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayData?.topGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-card border-border-2 transition-all duration-300 group relative overflow-hidden gap-4"
                                >
                                    {/* Rank Badge */}
                                    <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0"
                                            style={{
                                                backgroundColor: group.color,
                                                boxShadow: `0 0 20px ${group.color}33`
                                            }}
                                        >
                                            #{group.id}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-base text-white group-hover:text-[#fff200] transition-colors truncate">{group.name}</h3>
                                            <p className="text-gray-400 text-sm whitespace-nowrap">{group.games} games played</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-12 text-right relative z-10 w-full sm:w-auto border-t border-zinc-800/50 sm:border-0 pt-4 sm:pt-0">
                                        <div>
                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Score</p>
                                            <p className="text-lg font-bold text-white">{group.totalScore}</p>
                                        </div>
                                        <div className="sm:w-24">
                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Avg per Game</p>
                                            <p className="text-lg font-bold text-[#ec2c8a]">{group.avgScore}</p>
                                        </div>
                                    </div>

                                    {/* Hover effect background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3dffb3]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2a122e] to-[#141414] border border-[#4a1d52]">
                    <p className="text-gray-400 text-sm mb-4">Peak Hours</p>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">{isLoading ? "..." : "2PM - 4PM"}</h3>
                    <p className="text-gray-500 text-xs">Highest player activity</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#122e1b] to-[#141414] border border-[#1d5225]">
                    <p className="text-gray-400 text-sm mb-4">Avg Group Size</p>
                    <h3 className="text-xl font-bold text-green-400 mb-4">{isLoading ? "..." : (displayData?.avgTime || "4.8 players")}</h3>
                    <p className="text-gray-500 text-xs">Optimal utilization</p>
                </div>
            </div>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
    iconColor: string;
    hideTrendIcon?: boolean;
}

function SummaryCard({ title, value, trend, icon, iconColor, hideTrendIcon = false }: SummaryCardProps) {
    return (
        <div className="bg-bg-card border border-border p-5 relative overflow-hidden group transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-center gap-1">
                {!hideTrendIcon && <TrendingUp size={14} className="text-[#3dffb3]" />}
                <span className="text-[#3dffb3] text-sm">{trend}</span>
            </div>
        </div>
    );
}
