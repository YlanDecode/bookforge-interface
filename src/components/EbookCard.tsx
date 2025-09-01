import React from 'react';

interface EbookCardProps {
    ebook: {
        id: string;
        title: string;
        author: string;
        cover_path: string | null;
    };
}

const EbookCard: React.FC<EbookCardProps> = ({ ebook }) => {
    return (
        <div
            key={ebook.id}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-5 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col items-center"
        >
            <div className="w-full h-48 flex items-center justify-center mb-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {ebook.cover_path ? (
                    <img
                        src={`http://77.37.124.223:8000${ebook.cover_path}`}
                        alt={ebook.title}
                        className="w-full h-full object-cover transition-all duration-500"
                        style={{ filter: 'grayscale(10%)', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)' }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
                        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2"><rect x="8" y="8" width="32" height="32" rx="6"/><path d="M16 16h16v16H16z"/></svg>
                        <span className="text-xs">Pas de couverture</span>
                    </div>
                )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 text-center mb-1 line-clamp-2 tracking-tight">{ebook.title}</h3>
            <p className="text-gray-500 text-center italic mb-1">{ebook.author}</p>
            <p className="text-xs text-gray-300 text-center select-all">ID: {ebook.id}</p>
        </div>
    );
};

export {EbookCard};