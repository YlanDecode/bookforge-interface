import React, { useState } from 'react';
import EbookForm from "../components/forms/EbookForm.tsx";
import { useEbook } from "../hooks/useEbook.ts";

const GenerateEbook: React.FC = () => {
    const { generateEbook } = useEbook();

    const handleFormSubmit = async (formData: FormData) => {
        try {
           await generateEbook(formData);
        } catch (err) {
            console.error("Error generating ebook:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <EbookForm onSubmit={handleFormSubmit} />
        </div>
    );
};

export default GenerateEbook;
