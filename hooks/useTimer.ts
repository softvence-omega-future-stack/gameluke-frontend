import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export const useTimer = () => {
    const timer = useSelector((state: RootState) => state.timer);

    const formattedTime = useMemo(() => {
        // If game is finished or time is up
        if (timer.status === 'FINISHED' || timer.remainingTime <= 0) {
            return "00:00";
        }

        const minutes = Math.floor(timer.remainingTime / 60);
        const seconds = timer.remainingTime % 60;

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, [timer.remainingTime, timer.status]);

    const progressPercentage = useMemo(() => {
        if (!timer.duration || timer.duration === 0) return 100;
        return Math.max(0, Math.floor((timer.remainingTime / timer.duration) * 100));
    }, [timer.remainingTime, timer.duration]);

    return {
        timeLeft: timer.remainingTime,
        formattedTime,
        isActive: timer.isActive,
        status: timer.status,
        phase: timer.phase,
        duration: timer.duration,
        progressPercentage,
        message: timer.message,
    };
};