import React, { useEffect } from 'react';
import { EbookCard } from "./EbookCard.tsx";

interface EbookListProps {
    ebooks: Array<{
        id: string;
        title: string;
        author: string;
        cover_path: string | null;
        task_id: string | null;
        status: string;
        files: {
            pdf: string | null;
            epub: string | null;
        };
    }> | undefined;
}

const EbookList: React.FC<EbookListProps> = ({ ebooks }) => {
    const [progressMap, setProgressMap] = React.useState<{ [taskId: string]: number }>({});
    const [, setWsDebugMap] = React.useState<{ [taskId: string]: string }>({});
    const [state, setState] = React.useState("");
    const [elapsed_seconds, setSeconds] = React.useState<string>(() => {
        // On récupère la valeur stockée au reload pour le premier ebook (améliorable pour multi-ebooks)
        if (ebooks && ebooks.length > 0) {
            const val = localStorage.getItem(`elapsed_seconds_${ebooks[0].id}`);
            return val || "0";
        }
        return "0";
    });
    const wsRefs = React.useRef<{ [taskId: string]: WebSocket }>({});
    useEffect(() => {
    console.log('EbookList useEffect triggered. ebooks:', ebooks);
    ebooks?.map((ebook) => {
            if (
                ebook.status !== "SUCCESS" &&
                ebook.id
            ) {
                const wsUrl = localStorage.getItem(`websocket${ebook.id}`);
                if (wsUrl) {
                    const ws = new WebSocket(wsUrl.startsWith('ws') ? wsUrl : `ws://77.37.124.223:8000${wsUrl}`);
                    wsRefs.current[ebook.id] = ws;
                    ws.onmessage = (event) => {
                        let data;
                        try {
                            data = JSON.parse(event.data);
                        } catch (e) {
                            data = event.data;
                        }
                        if (data.percent !== undefined) {
                            setProgressMap((prev) => ({ ...prev, [String(ebook.id)]: data.percent }));
                        }
                        setWsDebugMap((prev) => ({ ...prev, [String(ebook.task_id)]: data }));
                        console.log('WebSocket message for ebook', ebook.id, data);
                        setState(data.state)
                        setSeconds(data.elapsed_seconds)
                        // Stocke la valeur dans localStorage pour ce ebook
                        localStorage.setItem(`elapsed_seconds_${ebook.id}`, String(data.elapsed_seconds));
                    };
                    ws.onclose = () => {
                        ws.close();
                        if (typeof ebook.id === 'string') {
                            delete wsRefs.current[ebook.id];
                        }
                    };
                }
            }
        });
    }, []);

    function formatDuration(seconds: number): string {
        if (seconds < 60) return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${seconds >= 120 ? 's' : ''} ${seconds % 60 ? (seconds % 60) + 's' : ''}`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} heure${seconds >= 7200 ? 's' : ''} ${Math.floor((seconds % 3600) / 60) ? Math.floor((seconds % 3600) / 60) + 'min' : ''}`;
        return `${Math.floor(seconds / 86400)} jour${seconds >= 172800 ? 's' : ''} ${Math.floor((seconds % 86400) / 3600) ? Math.floor((seconds % 86400) / 3600) + 'h' : ''}`;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ebooks?.map((ebook, idx) => (
                <div
                    key={ebook.id}
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                >
                    <EbookCard ebook={ebook} />

                    {ebook.status !== "SUCCESS" && ebook.id && (
                        <div className="mt-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 shadow flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2">
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 animate-spin-slow"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                                <span className="font-semibold text-gray-700">Génération en cours</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gray-400 h-4 rounded-full transition-all duration-700"
                                    style={{ width: `${progressMap[ebook.id] || 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs mt-2 text-gray-500 font-medium animate-pulse">Chargement: {progressMap[ebook.id] || 0}%</p>
                            <span className="text-xs text-gray-400 mt-1">Temps écoulé : <strong>{formatDuration(parseInt(elapsed_seconds))}</strong></span>
                            {state === "SUCCESS" && (
                                <p className="text-xs text-gray-600 mt-2 animate-fade-in">Veuillez actualiser la page pour voir les liens de téléchargement.</p>
                            )}
                        </div>
                    )}

                    {ebook.status === "SUCCESS" && (
                        <div
                            className="mt-4 p-4 bg-white border border-gray-100 rounded-xl shadow flex flex-col items-center animate-fade-in">
                            <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"
                                     className="text-gray-400">
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                                Téléchargements disponibles
                            </h4>
                            <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"
                                     className="text-gray-400">
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                                Temps passés : {elapsed_seconds}
                            </h4>
                            <ul className="list-none space-y-2 w-full">
                                {ebook.files.pdf && (
                                    <li>
                                        <a
                                            href={`http://77.37.124.223:8000/api/ebooks/download/${ebook.id}?format=pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor"
                                                 strokeWidth="1.5" className="text-gray-400">
                                                <rect x="4" y="4" width="10" height="10" rx="2"/>
                                                <path d="M9 7v4"/>
                                                <path d="M7 11h4"/>
                                            </svg>
                                            PDF
                                        </a>
                                    </li>
                                )}
                                {ebook.files.epub && (
                                    <li>
                                        <a
                                            href={`http://77.37.124.223:8000/api/ebooks/download/${ebook.id}?format=epub`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor"
                                                 strokeWidth="1.5" className="text-gray-400">
                                                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="2"
                                                        fill="none"/>
                                                <text x="9" y="13" textAnchor="middle" fontSize="8"
                                                      fill="currentColor">EPUB
                                                </text>
                                            </svg>
                                            EPUB
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
// Animations CSS (à ajouter dans index.css ou App.css)
    /*
    .animate-fade-in-up {
        animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both;
    }
    .animate-fade-in {
        animation: fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both;
    }
    .animate-spin-slow {
        animation: spin 2s linear infinite;
    }
    .animate-pulse {
        animation: pulse 1.5s infinite;
    }
    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    @keyframes spin {
        100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
    }
    */
};

export default EbookList;
