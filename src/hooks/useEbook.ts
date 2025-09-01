import { useState, useCallback, useEffect } from 'react';
import { axiosInstance as axios } from "../api/axiosInstance.ts";

interface Ebook {
    id: string;
    title: string;
    author: string;
    cover_path: string | null;
    task_id: string | null;
    status: string;
    progress?: number;
    files: {
        pdf: string | null;
        epub: string | null;
    };
}

interface EbookResponse {
    taskId: string
    websocket: string;
    download_urls: [string];
}

export const useEbook = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [ebooks, setEbooks] = useState<Ebook[]>();
    const [ebookResponse, setEbooksResponse] = useState<EbookResponse>();
    const [error, setError] = useState<string | null>(null);

    const fetchEbooks = useCallback(
        async (limit: number = 20, offset: number = 0) => {
            try {
                setLoading(true);
                const response = await axios.get("/ebooks", {
                    params: { limit, offset },
                });
                console.log("API response ebooks:", response.data);
                setEbooks(response.data);
            } catch (error) {
                console.error("Error fetching ebooks:", error);
                setError("Failed to fetch ebooks");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Fetch ebooks on mount
    useEffect(() => {
        fetchEbooks();
    }, [fetchEbooks]);

    const generateEbook = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await axios.post("/generate", formData);
            console.log("Ebook generated:", response.data);
            setEbooksResponse(response.data);
            console.log("Ebook ws generated:", response.data?.websocket);
            if (response.data?.task_id && response.data?.websocket) {
                localStorage.setItem(`websocket${response.data.task_id}`, response.data.websocket);
                console.log("localstorage:", localStorage.getItem(`websocket${response.data.task_id}`));
            }
            await fetchEbooks();
        } catch (error) {
            console.error("Error generating ebook:", error);
            setError("Failed to generate ebook");
        } finally {
            setLoading(false);
        }
    };

    return { generateEbook, fetchEbooks, ebooks, loading, error, ebookResponse };
};