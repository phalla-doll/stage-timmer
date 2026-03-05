import type { FunctionReference } from "convex/server";

declare const api: {
    rooms: {
        get: FunctionReference<"query", "public", { roomId: string }, {
            _id: string;
            _creationTime: number;
            roomId: string;
            mode: "countdown" | "countup" | "clock";
            duration: number;
            status: "running" | "paused";
            referenceTime: number;
            pausedRemaining: number;
            message: string;
            messageColor: string;
            flash: boolean;
            invertColors: boolean;
            showAnimation: boolean;
            signalColors: {
                speedUp: string;
                wrapUp: string;
                timesUp: string;
            };
        } | null, undefined>;
        join: FunctionReference<"mutation", "public", { roomId: string }, void, undefined>;
        update: FunctionReference<"mutation", "public", {
            roomId: string;
            mode?: "countdown" | "countup" | "clock";
            duration?: number;
            status?: "running" | "paused";
            referenceTime?: number;
            pausedRemaining?: number;
            message?: string;
            messageColor?: string;
            flash?: boolean;
            invertColors?: boolean;
            showAnimation?: boolean;
            signalColors?: {
                speedUp: string;
                wrapUp: string;
                timesUp: string;
            };
        }, void, undefined>;
    };
};

export { api };
