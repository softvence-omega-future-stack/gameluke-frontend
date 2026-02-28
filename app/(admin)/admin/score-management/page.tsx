"use client";

import React, { useState } from "react";
import {
  History,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  X,
  Target,
  User,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const stats = [
  {
    label: "Total Scores Today",
    value: "04",
    icon: CheckCircle2,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    label: "Edited Scores",
    value: "01",
    icon: Edit2,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  {
    label: "Changes Today",
    value: "01",
    icon: History,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
];

const historyData = [
  {
    team: "Team Phoenix",
    room: "Room 1",
    station: "Station A",
    oldScore: 150,
    newScore: 160,
    editedBy: "Admin",
    time: "14m ago",
    reason: "Sensor calibration error",
  },
];

const currentScores = [
  {
    id: 1,
    name: "Future Stack",
    room: "Room 1",
    stations: "Station A,B,C",
    games: "Basketball",
    time: "13m ago",
    score: 425,
    isEdited: false,
    timeRemaining: "00:00",
    gameName: "Basketball Game",
    teamName: "Team Phoenix",
    stationDetails: [
      {
        name: "Station A",
        team: "Team 01",
        score: 150,
        players: ["John Doe", "John Doe"],
      },
      {
        name: "Station B",
        team: "Team 02",
        score: 130,
        players: ["Jane", "Jane"],
      },
      {
        name: "Station C",
        team: "Team 02",
        score: 145,
        players: ["Tom Latham", "Tom Latham"],
      },
    ],
  },
  {
    id: 2,
    name: "Team Phoenix",
    room: "Room 1",
    stations: "Station A,B,C",
    games: "Basketball",
    time: "13m ago",
    score: 435,
    isEdited: true,
  },
  {
    id: 3,
    name: "Alpha",
    room: "Room 1",
    stations: "Station A,B,C",
    games: "Basketball",
    time: "13m ago",
    score: 420,
    isEdited: false,
  },
  {
    id: 4,
    name: "Omega",
    room: "Room 1",
    stations: "Station A,B,C",
    games: "Basketball",
    time: "13m ago",
    score: 430,
    isEdited: false,
  },
];

interface StationDetail {
  name: string;
  team: string;
  score: number | string;
  players: string[];
}

interface ConfirmationModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

function ConfirmationModal({ onConfirm, onCancel }: ConfirmationModalProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg bg-bg-card border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight italic mb-2">
          Confirm Score Changes
        </h3>
        <p className="text-zinc-400 text-sm mb-6">
          Please provide a reason for this change for the audit log.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
              Reason for Change
            </label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Sensor calibration error, manual override required..."
              className="w-full bg-bg-deep border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-secondary transition-all min-h-25 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-zinc-800 text-zinc-400 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-zinc-700 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!reason.trim()}
              onClick={() => onConfirm(reason)}
              className="flex-1 px-6 py-3 bg-brand-secondary text-black rounded-xl font-black uppercase tracking-wider text-sm hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScoreDetailsModalProps {
  score: (typeof currentScores)[0];
  onClose: () => void;
  onSave: (newDetails: StationDetail[], reason: string) => void;
}

function ScoreDetailsModal({ score, onClose, onSave }: ScoreDetailsModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [editableDetails, setEditableDetails] = useState<StationDetail[]>(
    (score.stationDetails as StationDetail[]) || [
      {
        name: "Station A",
        team: "Team 01",
        score: 150,
        players: ["John Doe", "John Doe"],
      },
      {
        name: "Station B",
        team: "Team 02",
        score: 130,
        players: ["Jane", "Jane"],
      },
      {
        name: "Station C",
        team: "Team 02",
        score: 145,
        players: ["Tom Latham", "Tom Latham"],
      },
    ],
  );

  if (!score) return null;

  const handleScoreChange = (idx: number, newVal: string) => {
    const updated = [...editableDetails];
    // Allow empty string to let users clear the input while typing
    updated[idx].score = newVal === "" ? "" : parseInt(newVal) || 0;
    setEditableDetails(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-bg-deep border border-zinc-800 rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Fixed Header Content */}
          <div className="p-4 sm:p-8 space-y-6 pb-0">
            {/* Game Header Card */}
            <div className="bg-[#2D0B2E] border-border p-6 relative overflow-hidden group rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                      Time Remaining
                    </p>
                    <h4 className="text-white text-2xl font-black">
                      {score.timeRemaining || "00:00"}
                    </h4>
                  </div>
                </div>

                <h3 className="text-brand-secondary text-xl sm:text-2xl font-black uppercase tracking-tighter text-center italic">
                  {score.gameName || "Basketball Game"}
                </h3>

                <div className="text-center sm:text-right">
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    Total Score
                  </p>
                  <h4 className="text-white text-2xl font-black">
                    {editableDetails.reduce(
                      (acc, curr) => acc + (Number(curr.score) || 0),
                      0,
                    )}
                  </h4>
                </div>
              </div>
              {/* Progress Bar Style Divider */}
              <div className="mt-6 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-brand-secondary w-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,230,0,0.5)]" />
              </div>
            </div>

            {/* Team Info */}
            <div className="bg-bg-card border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                Playing as
              </p>
              <h4 className="text-brand-secondary text-xl font-bold uppercase tracking-wide">
                {score.teamName || "Team Phoenix"}
              </h4>
            </div>
          </div>

          {/* Scrollable Stations List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-4">
              {editableDetails.map((station, idx) => (
                <div
                  key={idx}
                  className="bg-bg-card border-border p-4 sm:p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center group-hover/station:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-brand-secondary text-xl font-black uppercase italic tracking-tight">
                          {station.name}
                        </h4>
                        <p className="text-zinc-500 text-xs font-bold uppercase">
                          {station.team}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Score
                        </p>
                        <input
                          type="number"
                          value={station.score}
                          onChange={(e) =>
                            handleScoreChange(idx, e.target.value)
                          }
                          className="w-20 sm:w-24 bg-bg-deep border-border py-2 px-3 text-white text-xl sm:text-2xl font-black text-center focus:outline-none focus:border-brand-secondary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {station.players.map((player, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-bg-deep border-border p-3 flex items-center gap-3 group/player"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            pIdx % 2 === 0
                              ? "bg-brand-accent/20"
                              : "bg-brand-info/20",
                          )}
                        >
                          {pIdx % 2 === 0 ? (
                            <User className="w-4 h-4 text-brand-accent" />
                          ) : (
                            <Trophy className="w-4 h-4 text-brand-info" />
                          )}
                        </div>
                        <span className="text-zinc-300 text-sm font-bold uppercase tracking-wide">
                          {player}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Save Changes Button */}
            <div className="pt-4">
              <button
                onClick={() => setIsConfirming(true)}
                className="w-full bg-brand-secondary text-black py-3 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <ConfirmationModal
          onConfirm={(reason) => onSave(editableDetails, reason)}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}

export default function ScoreManagementPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedScore, setSelectedScore] = useState<
    (typeof currentScores)[0] | null
  >(null);

  return (
    <div className="space-y-8 max-w-8xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">
            Score Management
          </h1>
          <p className="text-brand-success mt-1 text-sm tracking-wider">
            Edit scores and view change history
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-colors text-sm sm:text-base"
        >
          <History className="w-4 h-4" />
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-bg-card border-border p-4 sm:p-6 rounded-xl flex items-center justify-between group cursor-default transition-all duration-300"
          >
            <div>
              <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </h2>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg flex items-center justify-center transition-transform">
              <stat.icon
                className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconColor)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Change History Section (Conditional) */}
      {showHistory && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Change History
          </h2>
          <div className="bg-bg-dark border-border p-4 sm:p-6 space-y-4 max-h-100 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {historyData.map((item, index) => (
              <div
                key={index}
                className="bg-bg-deep border-border rounded-xl p-4 sm:p-5 relative group transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        {item.team}
                      </span>
                      <span className="text-zinc-500 text-[10px] sm:text-xs font-medium">
                        {item.room} - {item.station}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-500/80 line-through text-base sm:text-lg font-bold">
                        {item.oldScore}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                      <span className="text-green-500 text-lg sm:text-xl font-bold">
                        {item.newScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-brand-success">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        {item.reason}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      by {item.editedBy}
                    </p>
                    <p className="text-brand-success text-[10px] sm:text-xs font-medium mt-1 uppercase tracking-wider">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Scores List */}
      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {showHistory ? "Room Wise Current Scores" : "Current Scores"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {currentScores.map((row, index) => (
            <div
              key={index}
              onClick={() => setSelectedScore(row)}
              className="bg-bg-card cursor-pointer border-border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all duration-300"
            >
              <div className="space-y-2 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {row.name}
                  </h3>
                  {row.isEdited && (
                    <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Edit2 className="w-3 h-3" />
                      Edited
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:flex items-center gap-x-4 gap-y-1 text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <p>
                    Room: <span className="text-zinc-300 ml-1">{row.room}</span>
                  </p>
                  <p>
                    Station:{" "}
                    <span className="text-zinc-300 ml-1">{row.stations}</span>
                  </p>
                  <p>
                    Games:{" "}
                    <span className="text-zinc-300 ml-1">{row.games}</span>
                  </p>
                  <p className="col-span-2 sm:col-span-1">
                    Time: <span className="text-zinc-300 ml-1">{row.time}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-10 border-t sm:border-t-0 border-zinc-800/50 pt-4 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    Score:{" "}
                  </span>
                  <span className="text-brand-secondary text-lg sm:text-xl font-extrabold">
                    {row.score}
                  </span>
                </div>
                {/* <div className="bg-brand-accent p-2 rounded-lg cursor-pointer hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20">
                                    <Edit2 className="w-4 h-4 sm:w-5 h-5 text-white" />
                                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Details Modal */}
      {selectedScore && (
        <ScoreDetailsModal
          score={selectedScore}
          onClose={() => setSelectedScore(null)}
          onSave={(newDetails, reason) => {
            // Mock save logic: clean up scores and log reason
            if (selectedScore) {
              const cleanedDetails = newDetails.map((d) => ({
                ...d,
                score: Number(d.score) || 0,
              }));
              const newTotal = cleanedDetails.reduce(
                (acc, curr) => acc + curr.score,
                0,
              );

              const updatedScore = {
                ...selectedScore,
                score: newTotal,
                stationDetails: cleanedDetails,
                isEdited: true,
              };

              // Proactively add to history (mock)
              console.log(
                `Score saved for ${updatedScore.name}. Reason: ${reason}`,
              );
            }
            setSelectedScore(null);
          }}
        />
      )}
    </div>
  );
}
