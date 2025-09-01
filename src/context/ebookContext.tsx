import React, { createContext, useContext, useState, useEffect } from "react";

interface EbookProgress {
    progress: number;
    step: string;
    elapsed: number;
    state: "PENDING" | "PROGRESS" | "SUCCESS" | "FAILURE";
    files?: { pdf?: string; epub?: string; cover?: string };
}

interface EbookContextType {
    websocketUrl: string | null;
    setWebsocketUrl: (url: string | null) => void;
    progress: EbookProgress;
}

const EbookContext = createContext<EbookContextType | undefined>(undefined);

export const EbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState<EbookProgress>({
        progress: 0,
        step: "",
        elapsed: 0,
        state: "PENDING",
    });

    useEffect(() => {
        if (!websocketUrl) return;

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const ws = new WebSocket(`${protocol}://77.37.124.223:8000${websocketUrl}`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.state === "PROGRESS" || data.state === "SUCCESS") {
                    setProgress({
                        progress: data.percent,
                        step: data.meta.step,
                        elapsed: data.elapsed_seconds,
                        state: data.state,
                        files: data.state === "SUCCESS" ? data.meta : undefined,
                    });
                }
            } catch (err) {
                console.error("Erreur parsing websocket:", err);
            }
        };

        ws.onerror = (err) => console.error("WebSocket error:", err);
        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
    }, [websocketUrl]);

    return (
        <EbookContext.Provider value={{ websocketUrl, setWebsocketUrl, progress }}>
            {children}
        </EbookContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEbookContext = () => {
    const context = useContext(EbookContext);
    if (!context) throw new Error("useEbookContext must be used within EbookProvider");
    return context;
};
