import React, { useEffect } from 'react';
import { BookOpen, Loader2, Share2 } from 'lucide-react';
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
            <header className="mb-10 flex flex-col items-center animate-fade-in">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2 tracking-tight drop-shadow-lg">BookForge</h1>
                <p className="text-lg text-gray-600 text-center max-w-2xl mb-4">Créez, explorez et téléchargez des ebooks originaux générés par l’intelligence artificielle. Découvrez des ouvrages uniques, suivez leur progression en temps réel et enrichissez votre bibliothèque !</p>
                <div className="flex gap-4 mt-2">
                    <a href="/generate" className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold shadow hover:bg-gray-700 transition">Générer un nouvel ebook</a>
                    <a href="#ebooks" className="px-6 py-2 rounded-full bg-white border border-gray-300 text-gray-900 font-semibold shadow hover:bg-gray-100 transition">Voir la bibliothèque</a>
                </div>
            </header>

            {/* Cartes d'accueil stylées et animées */}
            <section className="mb-12 flex flex-col md:flex-row gap-8 items-center justify-center">
                {[1,2,3].map((i) => (
                    <div
                        key={i}
                        className={`group bg-white border border-gray-200 shadow-lg rounded-xl w-72 h-80 flex flex-col items-center justify-center p-6 transition-all duration-500 cursor-pointer relative animate-fade-in-up`}
                        style={{ animationDelay: `${i * 200}ms` }}
                    >
                        <div className="w-24 h-24 mb-4 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                            {i === 1 && <BookOpen size={64} className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />}
                            {i === 2 && <Loader2 size={64} className="text-gray-700 animate-spin group-hover:text-gray-900 transition-colors duration-300" />}
                            {i === 3 && <Share2 size={64} className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2 transition-colors duration-300 group-hover:text-gray-900">{i === 1 ? 'Créez votre ebook' : i === 2 ? 'Suivez la progression' : 'Téléchargez et partagez'}</h3>
                        <p className="text-gray-500 text-center text-sm mb-2">{i === 1 ? 'Générez un livre unique en quelques clics.' : i === 2 ? 'Visualisez l’avancement en temps réel.' : 'Ajoutez à votre collection et partagez !'}</p>
                        <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gray-900 transition-all duration-300 pointer-events-none"></span>
                    </div>
                ))}
            </section>

            <section id="ebooks" className="animate-fade-in-up">
                {ebooks?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-gray-300"><rect x="12" y="12" width="40" height="40" rx="8"/><path d="M24 24h16v16H24z"/></svg>
                        <p className="text-gray-500 text-lg">Aucun ebook disponible pour le moment.<br/>Générez-en un pour commencer votre collection !</p>
                    </div>
                ) : (
                    <EbookList ebooks={ebooks} />
                )}
            </section>
        </div>
    );
};

export default Home;
