import React, { useState } from 'react';
import { BookRequest } from '../types';
import { XIcon } from '../constants';

interface BookRequestFormProps {
    onClose: () => void;
    onCreateRequest: (requestData: Omit<BookRequest, 'id' | 'userId' | 'userName' | 'status' | 'requestedAt'>) => void;
}

export const BookRequestForm: React.FC<BookRequestFormProps> = ({ onClose, onCreateRequest }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [reason, setReason] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) return;
        onCreateRequest({
            title,
            author,
            reason,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Request a Book</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">
                        Can't find what you're looking for? Let us know what books you'd like to see in the library.
                    </p>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Request (Optional)</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md">Submit Request</button>
                </div>
            </div>
        </div>
    );
};