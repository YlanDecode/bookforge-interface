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
    console.log("ebook : "+ebook.cover_path)
    return (
        <div key={ebook.id} className="bg-white shadow-md rounded-lg p-4">
            <img src={`http://77.37.124.223:8000/${ebook.cover_path}`} alt="Cover" className="w-full h-48 object-cover mb-4 rounded-lg" />
            <h3 className="font-semibold text-xl">{ebook.title}</h3>
            <p className="text-gray-600">{ebook.author}</p>
            <a href={`/ebooks/${ebook.id}`} className="text-blue-500 hover:underline mt-2">View Details</a>
        </div>
    );
};

export { EbookCard };