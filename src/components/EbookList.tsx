import React from 'react';
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
    }>;
}

const EbookList: React.FC<EbookListProps> = ({ ebooks }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
                <div key={ebook.id} className="bg-white p-4 shadow-md rounded-lg">
                    <EbookCard ebook={ebook} />

                    {ebook.status !== "SUCCESS" && (
                        <div className="mt-4">
                            <p className="text-lg font-semibold">Status: {ebook.status}</p>
                        </div>
                    )}

                    {ebook.status === "SUCCESS" && (
                        <div className="mt-4 p-4 bg-green-100 rounded-lg shadow">
                            <h4 className="text-lg font-semibold mb-2">Téléchargements disponibles :</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {ebook.files.pdf && (
                                    <li>
                                        <a
                                            href={`http://77.37.124.223:8000/api/ebooks/download/${ebook.id}?format=pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Télécharger en PDF
                                        </a>
                                    </li>
                                )}
                                {ebook.files.epub && (
                                    <li>
                                        <a
                                            href={`http://77.37.124.223:8000/api/ebooks/download/${ebook.id}?format=epub`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Télécharger en EPUB
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
};

export default EbookList;
