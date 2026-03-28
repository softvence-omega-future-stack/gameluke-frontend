import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  startTime: number | null; // fall-back timestamp
  duration: number; // total duration
  remainingTime: number; // authoritative seconds from server
  isActive: boolean;
  phase: 'GAME' | 'INTERVAL' | 'FINISHED';
  status: 'ACTIVE' | 'PAUSED' | 'FINISHED';
  message: string;
}

const getInitialState = (): TimerState => {
  const defaultState: TimerState = {
    startTime: null,
    duration: 12 * 60,
    remainingTime: 12 * 60,
    isActive: false,
    phase: 'GAME',
    status: 'ACTIVE',
    message: '',
  };

  if (typeof window === "undefined") return defaultState;

  const savedStartTime = localStorage.getItem("sessionTimer_startTime");
  const savedDuration = localStorage.getItem("sessionTimer_duration");

  if (savedStartTime && savedDuration) {
    const startTime = parseInt(savedStartTime);
    const duration = parseInt(savedDuration);
    const now = Date.now();

    const elapsed = Math.floor((now - startTime) / 1000);

    // Only set as active on mount if the session is still within its valid duration window
    if (elapsed < duration && elapsed >= 0) {
      return {
        ...defaultState,
        startTime,
        duration,
        remainingTime: Math.max(0, duration - elapsed),
        isActive: true,
      };
    }
  }

  return defaultState;
};

const timerSlice = createSlice({
  name: "timer",
  initialState: getInitialState(),
  reducers: {
    startTimer: (state, action: PayloadAction<number>) => {
      const startTime = Date.now();
      const duration = action.payload * 60; // convert min to sec

      if (typeof window !== "undefined") {
        localStorage.setItem("sessionTimer_startTime", startTime.toString());
        localStorage.setItem("sessionTimer_duration", duration.toString());
      }

      return {
        ...state,
        startTime,
        duration,
        remainingTime: duration,
        isActive: true,
        status: 'ACTIVE',
        phase: 'GAME',
      };
    },
    clearTimer: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sessionTimer_startTime");
        localStorage.removeItem("sessionTimer_duration");
      }
      return {
        ...state,
        startTime: null,
        isActive: false,
        status: 'FINISHED',
        phase: 'FINISHED',
      };
    },
    syncTimer: (state, action: PayloadAction<{ startTime: number; duration: number }>) => {
      const now = Date.now();
      const remainingTime = Math.max(0, action.payload.duration - Math.floor((now - action.payload.startTime) / 1000));

      if (typeof window !== "undefined") {
        localStorage.setItem("sessionTimer_startTime", action.payload.startTime.toString());
        localStorage.setItem("sessionTimer_duration", action.payload.duration.toString());
      }

      return {
        ...state,
        startTime: action.payload.startTime,
        duration: action.payload.duration,
        remainingTime,
        isActive: remainingTime > 0,
        status: remainingTime > 0 ? 'ACTIVE' : 'FINISHED',
      };
    },
    // Authority push from server (Matches image timeline)
    updateGamePulse: (state, action: PayloadAction<{ remainingTime: number; totalTime?: number; phase?: 'GAME' | 'INTERVAL' | 'FINISHED' }>) => {
      const duration = action.payload.totalTime || state.duration;
      const phase = action.payload.phase || state.phase;

      // Sync local Clock base (startTime) with the Server pulse (remainingTime)
      const now = Date.now();
      const startTime = now - (duration - action.payload.remainingTime) * 1000;

      return {
        ...state,
        remainingTime: action.payload.remainingTime,
        duration,
        phase,
        startTime,
        isActive: true,
        status: 'ACTIVE',
      };
    },

    // Local 1-second pulse
    tick: (state) => {
      if (state.isActive && state.status === 'ACTIVE') {
        const nextRemaining = Math.max(0, state.remainingTime - 1);
        
        // Final terminal state check
        if (nextRemaining === 0 && state.phase === 'FINISHED') {
          return {
            ...state,
            remainingTime: 0,
            isActive: false,
            status: 'FINISHED',
          };
        }

        return {
          ...state,
          remainingTime: nextRemaining,
        };
      }
      return state;
    },

    setGameStatus: (state, action: PayloadAction<{ status: 'ACTIVE' | 'PAUSED' | 'FINISHED'; message?: string }>) => {
      const nextStatus = action.payload.status;
      const nextMessage = action.payload.message ?? state.message;
      let nextIsActive = state.isActive;
      let nextStartTime = state.startTime;
      let nextRemainingTime = state.remainingTime;
      let nextPhase = state.phase;

      if (nextStatus === 'PAUSED') {
        nextIsActive = false;
        // Freeze accurate remaining time
        const now = Date.now();
        if (state.startTime) {
          nextRemainingTime = Math.max(0, state.duration - Math.floor((now - state.startTime) / 1000));
        }
      } else if (nextStatus === 'ACTIVE') {
        nextIsActive = true;
        // Resume from current remaining time
        const now = Date.now();
        nextStartTime = now - (state.duration - state.remainingTime) * 1000;
      } else if (nextStatus === 'FINISHED') {
        nextIsActive = false;
        nextPhase = 'FINISHED';
      }

      return {
        ...state,
        status: nextStatus,
        message: nextMessage,
        isActive: nextIsActive,
        startTime: nextStartTime,
        remainingTime: nextRemainingTime,
        phase: nextPhase,
      };
    }
  },
});

export const { startTimer, clearTimer, syncTimer, updateGamePulse, setGameStatus, tick } = timerSlice.actions;
export default timerSlice.reducer;
