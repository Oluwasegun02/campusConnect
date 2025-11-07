import React, { useState } from 'react';
// FIX: Import User type to resolve prop type error.
import { Course, User } from '../types';
import { DEPARTMENTS, LEVELS } from '../constants';
import { XIcon } from '../constants';

interface CourseCreatorProps {
    currentUser: User;
    onClose: () => void;
    onCreateCourse: (courseData: Omit<Course, 'id' | 'creatorId'>) => void;
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({ currentUser, onClose, onCreateCourse }) => {
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState(currentUser.department);
    const [level, setLevel] = useState(LEVELS[0]);
    const [credits, setCredits] = useState<number | ''>(3);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!code || !title || credits === '') {
            setError('Please fill all required fields.');
            return;
        }
        onCreateCourse({
            code: code.toUpperCase(),
            title,
            description,
            department,
            level,
            credits: Number(credits),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Create New Course</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
                            <input type="text" value={code} onChange={e => setCode(e.target.value)} required placeholder="e.g., CS301" className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Data Structures" className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full border-slate-300 rounded-md bg-white">
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                            <select value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full border-slate-300 rounded-md bg-white">
                                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                            <input type="number" value={credits} onChange={e => setCredits(e.target.value === '' ? '' : Number(e.target.value))} required min="1" className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md">Create Course</button>
                </div>
            </div>
        </div>
    );
};