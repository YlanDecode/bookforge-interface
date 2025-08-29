import React, { useState } from 'react';

interface EbookFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    error?: string | null;
}

const EbookForm: React.FC<EbookFormProps> = ({ onSubmit, error }) => {
    const [prompt, setPrompt] = useState<string>(
        'Écrire un guide pratique et motivant pour adopter une hygiène de vie saine. L’ebook doit couvrir l’alimentation équilibrée, le sommeil réparateur, l’activité physique adaptée, la gestion du stress, et inclure un plan d’action hebdomadaire facile à suivre.'
    );
    const [title, setTitle] = useState<string>('Vivre mieux : Les piliers d’une vie saine et équilibrée');
    const [font, setFont] = useState<string>('Times New Roman');
    const [author, setAuthor] = useState<string>('Dr. Élodie M.');
    const [style, setStyle] = useState<string>('bienveillant, structuré, axé résultats');
    const [formats, setFormats] = useState<string[]>(['pdf', 'epub']);
    const [userId, setUserId] = useState<string>('demo_user_21');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPrompt, setCoverPrompt] = useState<string>('');
    const [coverOption, setCoverOption] = useState<'generate' | 'upload'>('generate');
    const [formError, setFormError] = useState<string | null>(null);
    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormats((prevFormats) =>
            prevFormats.includes(value)
                ? prevFormats.filter((format) => format !== value)
                : [...prevFormats, value]
        );
    };

    const handleCoverOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCoverOption(e.target.value as 'generate' | 'upload');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate prompt
        if (!prompt || prompt.trim().length === 0) {
            setFormError('Le champ "Prompt" est requis et ne peut pas être vide.');
            return;
        }
        if (prompt.length < 10) {
            setFormError('Le prompt doit contenir au moins 10 caractères.');
            return;
        }

        // Validate formats
        if (formats.length === 0) {
            setFormError('Vous devez sélectionner au moins un format (PDF ou EPUB).');
            return;
        }

        setFormError(null);

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('title', title);
        formData.append('font', font);
        formData.append('author', author);
        formData.append('style', style);
        formData.append('user_id', userId);
        formats.forEach((format) => formData.append('formats', format));
        if (coverOption === 'generate' && coverPrompt) {
            formData.append('cover_prompt', coverPrompt);
        }
        if (coverOption === 'upload' && coverImage) {
            formData.append('cover_image', coverImage);
        }

        // Debug: Log FormData entries
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${typeof value === 'string' ? value : '[File]'}`);
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            setFormError(`Erreur lors de la soumission : ${err?.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Générer un Ebook</h2>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            {formError && <p className="mb-4 text-red-500">{formError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="prompt" className="block text-gray-700">Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez le prompt de l'ebook"
                        required
                        minLength={10}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700">Titre</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez le titre de l'ebook"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="font" className="block text-gray-700">Police</label>
                    <input
                        type="text"
                        id="font"
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez le style de police"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="author" className="block text-gray-700">Auteur</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez le nom de l'auteur"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="style" className="block text-gray-700">Style</label>
                    <input
                        type="text"
                        id="style"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez le style de l'ebook"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Formats</label>
                    <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="pdf"
                                value="pdf"
                                checked={formats.includes('pdf')}
                                onChange={handleFormatChange}
                                className="mr-2"
                            />
                            <label htmlFor="pdf">PDF</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="epub"
                                value="epub"
                                checked={formats.includes('epub')}
                                onChange={handleFormatChange}
                                className="mr-2"
                            />
                            <label htmlFor="epub">EPUB</label>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="user_id" className="block text-gray-700">ID Utilisateur</label>
                    <input
                        type="text"
                        id="user_id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="mt-2 p-2 w-full border rounded-md"
                        placeholder="Entrez l'ID utilisateur"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Option de couverture</label>
                    <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="generate"
                                value="generate"
                                checked={coverOption === 'generate'}
                                onChange={handleCoverOptionChange}
                                className="mr-2"
                            />
                            <label htmlFor="generate">Générer la couverture</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="upload"
                                value="upload"
                                checked={coverOption === 'upload'}
                                onChange={handleCoverOptionChange}
                                className="mr-2"
                            />
                            <label htmlFor="upload">Télécharger la couverture</label>
                        </div>
                    </div>
                </div>
                {coverOption === 'upload' && (
                    <div className="mb-4">
                        <label htmlFor="cover_image" className="block text-gray-700">Image de couverture</label>
                        <input
                            type="file"
                            id="cover_image"
                            onChange={handleCoverImageChange}
                            className="mt-2 p-2 w-full border rounded-md"
                            accept="image/jpeg"
                        />
                    </div>
                )}
                {coverOption === 'generate' && (
                    <div className="mb-4">
                        <label htmlFor="cover_prompt" className="block text-gray-700">Prompt de couverture</label>
                        <input
                            type="text"
                            id="cover_prompt"
                            value={coverPrompt}
                            onChange={(e) => setCoverPrompt(e.target.value)}
                            className="mt-2 p-2 w-full border rounded-md"
                            placeholder="Entrez le prompt de la couverture"
                        />
                    </div>
                )}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Générer l'Ebook
                </button>
            </form>
        </div>
    );
};

export default EbookForm;