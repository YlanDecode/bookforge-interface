import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
            <div className="container mx-auto flex justify-between items-center py-3 px-2">
                <a href="/" className="flex items-center gap-2">
                    <span className="inline-block rounded-full bg-gray-900 p-2">
                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2"><rect x="6" y="6" width="16" height="16" rx="4"/><path d="M10 10h8v8h-8z"/></svg>
                    </span>
                    <span className="text-xl font-serif font-bold text-gray-900 tracking-tight">BookForge</span>
                </a>
                <nav>
                    <ul className="flex space-x-2 md:space-x-6">
                        <li>
                            <a href="/" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">Accueil</a>
                        </li>
                        <li>
                            <a href="/generate" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">Générer un ebook</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export { Header };
