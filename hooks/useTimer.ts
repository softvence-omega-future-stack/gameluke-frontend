import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { clearTimer } from "@/redux/features/timerSlice";

export const useTimer = () => {
    const dispatch = useDispatch();
    const { startTime, duration, isActive } = useSelector((state: RootState) => state.timer);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!isActive || !startTime) {
            setTimeLeft(0);
            return;
        }

        const calculateTimeLeft = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, duration - elapsed);
            return remaining;
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                dispatch(clearTimer());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime, duration, dispatch]);

    const formattedTime = useMemo(() => {
        if (!isActive || timeLeft <= 0) return "--";
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, [timeLeft, isActive]);

    return { timeLeft, formattedTime, isActive };
};
