import React from "react";
import EbookForm from "../components/forms/EbookForm.tsx";
import { useEbook } from "../hooks/useEbook.ts";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";

const GenerateEbook: React.FC = () => {
    const navigate = useNavigate();
    const { generateEbook } = useEbook();

    const handleFormSubmit = async (formData: FormData) => {
        try {
            await generateEbook(formData);
            toast.success("📚 Génération de l'ebook en cours...");
            navigate("/");
        } catch (err) {
            console.error("Error generating ebook:", err);
            toast.error("❌ Une erreur est survenue pendant la génération");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <EbookForm onSubmit={handleFormSubmit} />
        </div>
    );
};

export default GenerateEbook;
