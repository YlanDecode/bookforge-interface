import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">BookForge</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:text-gray-400">Home</a></li>
                        <li><a href="/generate" className="hover:text-gray-400">Generate Ebook</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export { Header };
