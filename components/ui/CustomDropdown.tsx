"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    label,
    className,
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("space-y-2 w-full", className)} ref={dropdownRef}>
            {label && <label className="text-gray-400 text-sm font-medium">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-[#111827] border-border-2 py-3 px-4 flex items-center justify-between text-left transition-all duration-300 cursor-pointer",
                        isOpen ? "border-border-2" : "hover:border-border-2",
                        !selectedOption ? "text-gray-500" : "text-gray-200"
                    )}
                >
                    <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                    <ChevronDown
                        className={cn("text-[#059669] transition-transform duration-300", isOpen && "rotate-180")}
                        size={20}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-[100] mt-2 w-full border-border-2 rounded-xl py-2 overflow-hidden"
                        style={{ backgroundColor: '#000000', opacity: 1 }}>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 italic">No options available</div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer",
                                            value === option.value
                                                ? "bg-[#059669] text-[#3dffb3] font-bold"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
