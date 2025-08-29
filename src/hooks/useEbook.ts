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

export const useEbook = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [ebooks, setEbooks] = useState<Ebook[]>(() => {
        const savedEbooks = localStorage.getItem("ebooks");
        return savedEbooks ? JSON.parse(savedEbooks) : [];
    });
    const [error, setError] = useState<string | null>(null);

    const fetchEbooks = useCallback(
        async (limit: number = 20, offset: number = 0) => {
            try {
                setLoading(true);
                const response = await axios.get("/ebooks", {
                    params: { limit, offset },
                });
                console.log("API response ebooks:", response.data);

                setEbooks(response.data); // ✅ on met à jour le state
                localStorage.setItem("ebooks", JSON.stringify(response.data));
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

            // ✅ On refetch après génération pour inclure le nouvel ebook
            await fetchEbooks();
        } catch (error) {
            console.error("Error generating ebook:", error);
            setError("Failed to generate ebook");
        } finally {
            setLoading(false);
        }
    };

    return { generateEbook, fetchEbooks, ebooks, loading, error };
};