"use client";

import React, { useState, useEffect } from "react";
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
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetScoresQuery, useEditScoreMutation } from "@/redux/api/admin/scoresApi";
import { useGetTeamsQuery } from "@/redux/api/player/playerApi";
import { useEnterScoresMutation } from "@/redux/api/admin/scoresApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { format } from "date-fns";

const ScoreManagementSkeleton = () => (
  <div className="space-y-8 max-w-8xl mx-auto pb-10 animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800 rounded-lg"></div>
        <div className="h-4 w-48 bg-zinc-800/50 rounded-lg"></div>
      </div>
      <div className="h-10 w-32 bg-zinc-800 rounded-lg"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-zinc-800/50 rounded-xl border border-zinc-800"></div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-6 w-48 bg-zinc-800 rounded-lg"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-zinc-800/30 rounded-xl border border-zinc-800/50"></div>
        ))}
      </div>
    </div>
  </div>
);

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
  score: any;
  onClose: () => void;
  onSave?: (newDetails: any[], reason: string) => void;
}

const ModalSkeleton = () => (
  <div className="p-8 space-y-6 animate-pulse">
    <div className="h-32 bg-zinc-800 rounded-2xl" />
    <div className="h-20 bg-zinc-800/50 rounded-2xl" />
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="h-40 bg-zinc-800/30 rounded-2xl border border-zinc-800/50" />
      ))}
    </div>
  </div>
);

function ScoreDetailsModal({ score, onClose, onSave }: ScoreDetailsModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [editableScores, setEditableScores] = useState<Record<string, number>>({});
  const adminId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: teamsData, isLoading, isError, refetch } = useGetTeamsQuery(score?.groupId || "", {
    skip: !score?.groupId,
  });

  const [enterScores, { isLoading: isSavingBatch }] = useEnterScoresMutation();
  const [editScore, { isLoading: isEditing }] = useEditScoreMutation();
  const isSaving = isSavingBatch || isEditing;

  useEffect(() => {
    if (score?.subTeamScores) {
      setEditableScores(score.subTeamScores);
    }
  }, [score]);

  if (!score) return null;

  const group = score.group;
  const assignment = score.studioAssignment;
  const subTeams = teamsData?.data?.[0]?.subTeams || [];
  const studio = assignment?.studio;

  const handleScoreChange = (teamName: string, newVal: string) => {
    setEditableScores(prev => ({
      ...prev,
      [teamName]: newVal === "" ? 0 : parseInt(newVal) || 0
    }));
  };

  const handleFinalSave = async (reason: string) => {
    if (!score?.id) return;

    const modifiedTeams = Object.entries(editableScores).filter(([name, val]) => {
      const originalVal = score.subTeamScores[name];
      return originalVal !== val;
    });

    if (modifiedTeams.length === 0) {
      setIsConfirming(false);
      return;
    }

    try {
      await Promise.all(
        modifiedTeams.map(([teamName, newVal]) =>
          editScore({
            gameResultId: score.id,
            subTeamName: teamName,
            newScore: newVal,
            reason: reason,
          }).unwrap()
        )
      );

      toast.success("Scores updated successfully!");
      if (onSave) onSave([], reason);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update scores");
    } finally {
      setIsConfirming(false);
    }
  };

  const totalScore = Object.values(editableScores).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-bg-deep border border-zinc-800 rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <ModalSkeleton />
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 opacity-50" />
              <h3 className="text-xl font-bold text-white">Data Fetch Error</h3>
              <p className="text-zinc-500 text-center">Unable to load team details for this group.</p>
              <button onClick={() => refetch()} className="px-6 py-2 bg-zinc-800 rounded-xl font-bold uppercase hover:bg-zinc-700">Retry</button>
            </div>
          ) : (
            <>
              <div className="p-4 sm:p-8 space-y-6 pb-0">
                <div className="bg-[#2D0B2E] border-border p-6 relative overflow-hidden group rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                          Session Finished
                        </p>
                        <h4 className="text-white text-2xl font-black">
                          {score.createdAt ? format(new Date(score.createdAt), "HH:mm") : "00:00"}
                        </h4>
                      </div>
                    </div>

                    <h3 className="text-brand-secondary text-xl sm:text-2xl font-black uppercase tracking-tighter text-center italic">
                      {studio?.gameName || score.games || "Game Result"}
                    </h3>

                    <div className="text-center sm:text-right">
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        Total Score
                      </p>
                      <h4 className="text-white text-2xl font-black">
                        {totalScore}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-6 h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-secondary w-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,230,0,0.5)]" />
                  </div>
                </div>

                <div className="bg-bg-card border border-zinc-800 rounded-2xl p-5">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Performed by
                  </p>
                  <h4 className="text-brand-secondary text-xl font-bold uppercase tracking-wide">
                    {group?.name} (PIN: {group?.pin})
                  </h4>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="space-y-4">
                  {subTeams.map((team: any, idx: number) => (
                    <div
                      key={team.id}
                      className="bg-bg-card border-border p-4 sm:p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center group-hover/station:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-brand-secondary text-xl font-black uppercase italic tracking-tight">
                              {team.name}
                            </h4>
                            <p className="text-zinc-500 text-xs font-bold uppercase">
                              Team Score Override
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                              Score
                            </p>
                             <select
                                value={editableScores[team.name] ?? team.score}
                                onChange={(e) =>
                                  handleScoreChange(team.name, e.target.value)
                                }
                                className="w-24 sm:w-28 bg-bg-deep border-border py-2 px-3 text-white text-lg sm:text-xl font-black rounded-lg focus:outline-none focus:border-brand-secondary transition-all cursor-pointer appearance-none"
                              >
                                {[100, 200, 300].map(val => (
                                  <option key={val} value={val} className="bg-bg-deep text-white">
                                    {val}
                                  </option>
                                ))}
                              </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.players?.map((p: any, pIdx: number) => (
                          <div
                            key={p.id}
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
                              {p.player.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsConfirming(true)}
                    disabled={isSaving}
                    className="w-full bg-brand-secondary text-black py-3 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isConfirming && (
        <ConfirmationModal
          onConfirm={handleFinalSave}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}

export default function ScoreManagementPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedScore, setSelectedScore] = useState<any>(null);

  const { data: scoresData, isLoading, isError, refetch } = useGetScoresQuery();

  if (isLoading) return <ScoreManagementSkeleton />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">Sync Failure</h3>
        <p className="text-gray-400 max-w-md mb-8">
          Unable to synchronize with the scoring database. Please verify your administrative permissions.
        </p>
        <button
          onClick={() => refetch()}
          className="bg-brand-secondary text-black font-bold py-3 px-8 rounded-2xl hover:bg-brand-secondary/90 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={18} />
          Retry Connection
        </button>
      </div>
    );
  }

  const scores = scoresData?.data || [];
  const finishedCount = scores.filter((s: any) => s.group.status === "FINISHED").length;
  const playingScores = scores.filter((s: any) => s.group.status === "PLAYING");
  const activePlayers = playingScores.reduce((acc: number, s: any) => acc + (s.group.totalPlayers || 0), 0);
  const activeStudios = new Set(playingScores.map((s: any) => s.studioAssignment?.studio?.id)).size;

  const todayStats = [
    {
      label: "Total Finished Today",
      value: finishedCount.toString().padStart(2, "0"),
      icon: CheckCircle2,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Active Players",
      value: activePlayers.toString().padStart(2, "0"),
      icon: User,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    {
      label: "Active Studios",
      value: activeStudios.toString().padStart(2, "0"),
      icon: Target,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-8xl mx-auto pb-10">
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
          className="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <History className="w-4 h-4" />
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayStats.map((stat, index) => (
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
            <div className={cn("p-2.5 sm:p-3 rounded-lg flex items-center justify-center", stat.iconBg)}>
              <stat.icon
                className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconColor)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {showHistory ? "Studio Wise Current Scores" : "Current Sessions"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {scores.length > 0 ? (
            scores.map((score: any) => {
              const group = score.group;
              const assignment = score.studioAssignment;
              const studioName = assignment?.studio?.name || "Not Assigned";
              const studioNum = assignment?.studio?.studioNumber || "-";
              const isPlaying = group.status === "PLAYING";

              return (
                <div
                  key={score.id}
                  onClick={() => setSelectedScore(score)}
                  className="bg-bg-card cursor-pointer border-border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all duration-300 hover:border-brand-secondary/30"
                >
                  <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {group.name}
                      </h3>
                      {isPlaying && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 lg:flex items-center gap-x-4 gap-y-1 text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <p>
                        Studio: <span className="text-zinc-300 ml-1">{studioName} (#{studioNum})</span>
                      </p>
                      <p>
                        PIN: <span className="text-zinc-300 ml-1">{group.pin}</span>
                      </p>
                      <p>
                        Players: <span className="text-zinc-300 ml-1">{group.totalPlayers}</span>
                      </p>
                      <p>
                        Status: <span className={cn(
                          "ml-1",
                          isPlaying ? "text-blue-500" : "text-brand-success"
                        )}>{group.status}</span>
                      </p>
                      <p className="col-span-2 sm:col-span-1">
                        Recorded: <span className="text-zinc-300 ml-1">{format(new Date(score.createdAt), "HH:mm")}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-10 border-t sm:border-t-0 border-zinc-800/50 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-white text-lg sm:text-xl font-bold">
                        Total Score:{" "}
                      </span>
                      <span className="text-brand-secondary text-2xl sm:text-3xl font-black uppercase italic tracking-tighter">
                        {score.totalGroupPoints}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-bg-card border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <History className="w-12 h-12 text-zinc-700 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No Active Records</h3>
              <p className="text-zinc-500 text-sm">There are no playing or finished game sessions to display currently.</p>
            </div>
          )}
        </div>
      </div>

      {selectedScore && (
        <ScoreDetailsModal
          score={selectedScore}
          onClose={() => setSelectedScore(null)}
          onSave={() => {
            refetch();
            setSelectedScore(null);
          }}
        />
      )}
    </div>
  );
}
