import React, { useState } from 'react';
import { LibraryBook } from '../types';
import { XIcon } from '../constants';

interface BookUploaderProps {
    onClose: () => void;
    onCreateBook: (bookData: Omit<LibraryBook, 'id' | 'uploaderId' | 'uploadedAt' | 'ratings' | 'reviews'>) => void;
}

export const BookUploader: React.FC<BookUploaderProps> = ({ onClose, onCreateBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<string>('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const allowedTypes = [
                'text/plain',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Unsupported file type. Please upload a .txt, .pdf, or .doc/.docx file.');
                setFile(null);
            }
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title || !author || !file || !coverImage || !category) {
            setError('Please fill all fields, select a content file, and upload a cover image.');
            return;
        }

        setIsUploading(true);

        const processAndCreateBook = (content: string) => {
            onCreateBook({
                title,
                author,
                category,
                description,
                content,
                coverImage,
            });
            setIsUploading(false);
        };

        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                processAndCreateBook(content);
            };
            reader.onerror = () => {
                setError('Failed to read the content file.');
                setIsUploading(false);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf') {
            const content = `[PDF Content for ${file.name}]\n\nThis is a placeholder for the PDF content, as reading PDF files directly in the browser requires a complex library. In a real application, a server-side process would extract this text.\n\nPAGE_BREAK\n\nThis would be page 2 of the PDF.`;
            processAndCreateBook(content);
        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const content = `[Word Document Content for ${file.name}]\n\nThis is a placeholder for the document content, as reading Word files directly in the browser is not natively supported. A library or server-side conversion would be needed in a production app.\n\nPAGE_BREAK\n\nThis would be another section of the document.`;
            processAndCreateBook(content);
        } else {
             setError('Unsupported file type. Please upload a .txt, .pdf, or .doc/.docx file.');
             setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Upload New Book</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g., Computer Science, Engineering, History" className="w-full border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} required className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Book Content File</label>
                        <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} required className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                        <p className="text-xs text-slate-500 mt-1">Upload the book content (.txt, .pdf, .doc). For .txt files, use 'PAGE_BREAK' on a new line to separate pages.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} required className="w-full text-sm"/>
                        {coverImage && <img src={coverImage} className="mt-2 w-24 h-32 object-cover rounded-md border"/>}
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={isUploading} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-slate-400">
                        {isUploading ? 'Uploading...' : 'Upload Book'}
                    </button>
                </div>
            </div>
        </div>
    );
};