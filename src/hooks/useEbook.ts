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
        const savedEbooks = localStorage.getItem('ebooks');
        const parsed = savedEbooks ? JSON.parse(savedEbooks) : [];
        console.log('Initial ebooks from localStorage:', parsed);
        return parsed;
    });
    const [error, setError] = useState<string | null>(null);

    const fetchEbooks = useCallback(async (limit: number = 20, offset: number = 0) => {
        try {
            setLoading(true);
            const response = await axios.get('/ebooks', {
                params: { limit, offset }
            });
            console.log('API response ebooks:', response.data);
            // Filter out invalid ebooks
            const validEbooks = response.data.filter((ebook: Ebook) => {
                if (!ebook.cover_path) {
                    console.warn(`Ebook with ID ${ebook.id} has null cover_path`);
                    return false;
                }
                return true;
            });
            setEbooks(validEbooks);
            localStorage.setItem('ebooks', JSON.stringify(validEbooks));
        } catch (error) {
            console.error('Error fetching ebooks:', error);
            setError('Failed to fetch ebooks');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch ebooks on mount
    useEffect(() => {
        fetchEbooks();
    }, [fetchEbooks]);

    const generateEbook = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await axios.post('/generate', formData);
            console.log('Ebook generated:', response.data);
            // Fetch ebooks again after generating
            await fetchEbooks();
        } catch (error) {
            console.error('Error generating ebook:', error);
            setError('Failed to generate ebook');
        } finally {
            setLoading(false);
        }
    };

    return { generateEbook, fetchEbooks, ebooks, loading, error };
};