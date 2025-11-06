import React, { useState } from 'react';
import { User, Course, CourseMaterial } from '../types';
import { XIcon } from '../constants';

interface MaterialUploaderProps {
    currentUser: User;
    courses: Course[];
    onClose: () => void;
    onUpload: (material: Omit<CourseMaterial, 'id' | 'uploaderId' | 'uploadedAt' | 'fileName' | 'fileType' | 'fileData'>, file: File) => void;
}

export const MaterialUploader: React.FC<MaterialUploaderProps> = ({ currentUser, courses, onClose, onUpload }) => {
    const teacherCourses = courses.filter(c => c.department === currentUser.department); // Simplified assumption

    const [courseId, setCourseId] = useState(teacherCourses[0]?.id || '');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!courseId || !title || !file) {
            setError('Please fill out all fields and select a file.');
            return;
        }
        onUpload({ courseId, title, description }, file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Upload Course Material</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                        <select
                            value={courseId}
                            onChange={e => setCourseId(e.target.value)}
                            required
                            className="w-full border-slate-300 rounded-md shadow-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="" disabled>Select a course...</option>
                            {teacherCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Material Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Lecture 1 Notes" className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                        <input type="file" onChange={handleFileChange} required className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Upload</button>
                </div>
            </div>
        </div>
    );
};
