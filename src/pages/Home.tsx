import React, { useEffect } from 'react';
import { useEbook } from '../hooks/useEbook';
import EbookList from '../components/EbookList';

const Home: React.FC = () => {
    const { fetchEbooks, ebooks, loading, error } = useEbook();

    useEffect(() => {
        console.log('Home: Fetching ebooks on mount');
        fetchEbooks();
    }, [fetchEbooks]);

    if (loading) return <p>Loading ebooks...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to BookForge</h1>
            {ebooks?.length === 0 ? (
                <p>No ebooks available.</p>
            ) : (
                <EbookList ebooks={ebooks} />
            )}
        </div>
    );
};

export default Home;
