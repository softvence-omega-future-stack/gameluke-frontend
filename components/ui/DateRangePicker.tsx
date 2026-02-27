"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
    value: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
    className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayText = value?.from
        ? value.to
            ? `${format(value.from, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`
            : format(value.from, "LLL dd, y")
        : "Select date range";

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors shadow-lg w-full sm:w-auto",
                    isOpen && "ring-2 ring-brand-secondary"
                )}
            >
                <CalendarIcon size={16} />
                <span>{displayText}</span>
            </button>

            {isOpen && (
                <div
                    className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 top-[20%] md:top-12 z-[200] border-border-2 p-4 shadow-2xl max-w-[95vw] md:max-w-none mx-auto"
                    style={{ backgroundColor: '#000000', opacity: 1 }}
                >
                    <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                        <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">Select Date Range</span>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <style>{`
                        .rdp {
                            --rdp-cell-size: 40px;
                            --rdp-accent-color: #fff200;
                            --rdp-background-color: #3f3f46;
                            --rdp-outline: 2px solid var(--rdp-accent-color);
                            --rdp-outline-selected: 2px solid var(--rdp-accent-color);
                            margin: 0;
                        }
                        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                            background-color: var(--rdp-accent-color) !important;
                            color: black !important;
                            font-weight: 800;
                        }
                        .rdp-day_range_middle {
                            background-color: rgba(255, 242, 0, 0.2) !important;
                            color: white !important;
                        }
                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                            background-color: rgba(255, 255, 255, 0.1) !important;
                        }
                        .rdp-caption_label {
                            color: #fff200;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        .rdp-nav_button {
                            color: #3dffb3;
                        }
                        .rdp-head_cell {
                            color: #3dffb3;
                            font-size: 0.75rem;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                        .rdp-day {
                            color: #d1d5db;
                        }
                    `}</style>

                    <DayPicker
                        mode="range"
                        selected={value}
                        onSelect={onChange}
                        showOutsideDays
                        className="text-white"
                    />

                    <div className="mt-4 flex gap-2 pt-2 border-t border-zinc-800">
                        <button
                            onClick={() => {
                                const today = new Date();
                                onChange({ from: today, to: today });
                                setIsOpen(false);
                            }}
                            className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 7);
                                onChange({ from: start, to: end });
                                setIsOpen(false);
                            }}
                            className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-brand-secondary text-black rounded hover:bg-brand-secondary/90 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 md:hidden z-[190] backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
