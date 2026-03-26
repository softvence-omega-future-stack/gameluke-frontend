import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  startTime: number | null; // timestamp
  duration: number; // in seconds
  isActive: boolean;
}

const getInitialState = (): TimerState => {
  if (typeof window === "undefined") {
    return {
      startTime: null,
      duration: 12 * 60,
      isActive: false,
    };
  }

  const savedStartTime = localStorage.getItem("sessionTimer_startTime");
  const savedDuration = localStorage.getItem("sessionTimer_duration");

  if (savedStartTime && savedDuration) {
    const startTime = parseInt(savedStartTime);
    const duration = parseInt(savedDuration);
    const now = Date.now();

    if (now - startTime < duration * 1000) {
      return {
        startTime,
        duration,
        isActive: true,
      };
    }
  }

  return {
    startTime: null,
    duration: 12 * 60,
    isActive: false,
  };
};

const timerSlice = createSlice({
  name: "timer",
  initialState: getInitialState(),
  reducers: {
    startTimer: (state, action: PayloadAction<number>) => {
      const startTime = Date.now();
      const duration = action.payload * 60; // convert min to sec
      state.startTime = startTime;
      state.duration = duration;
      state.isActive = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("sessionTimer_startTime", startTime.toString());
        localStorage.setItem("sessionTimer_duration", duration.toString());
      }
    },
    clearTimer: (state) => {
      state.startTime = null;
      state.isActive = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("sessionTimer_startTime");
        localStorage.removeItem("sessionTimer_duration");
      }
    },
    syncTimer: (state, action: PayloadAction<{ startTime: number; duration: number }>) => {
      state.startTime = action.payload.startTime;
      state.duration = action.payload.duration;
      state.isActive = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionTimer_startTime", action.payload.startTime.toString());
        localStorage.setItem("sessionTimer_duration", action.payload.duration.toString());
      }
    },
  },
});

export const { startTimer, clearTimer, syncTimer } = timerSlice.actions;
export default timerSlice.reducer;
