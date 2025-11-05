import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEPARTMENTS, LEVELS } from '../constants';
import { XIcon } from '../constants';

type UserData = Omit<User, 'id'>;

interface UserCreatorProps {
    onClose: () => void;
    onCreateUser: (userData: UserData) => boolean; // Returns success status
}

export const UserCreator: React.FC<UserCreatorProps> = ({ onClose, onCreateUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    const [department, setDepartment] = useState(DEPARTMENTS[0]);
    const [level, setLevel] = useState(LEVELS[0]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!name || !email || !role) {
            setError("Please fill in all required fields.");
            return;
        }

        const success = onCreateUser({
            name,
            email,
            password: 'password123', // Set a default password
            role,
            department,
            level: role === UserRole.STUDENT ? level : 0,
        });

        if (!success) {
            setError("Failed to create user. Email may already exist.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Create New User</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white">
                            <option value={UserRole.STUDENT}>Student</option>
                            <option value={UserRole.TEACHER}>Teacher</option>
                            <option value={UserRole.ICT_STAFF}>ICT Staff</option>
                        </select>
                    </div>
                    
                    {role !== UserRole.ICT_STAFF && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Department</label>
                                <select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white">
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            {role === UserRole.STUDENT && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Level</label>
                                    <select value={level} onChange={e => setLevel(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white">
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                     <p className="text-xs text-slate-500">A default password 'password123' will be set for the new user.</p>
                     {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                 <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Create User</button>
                </div>
            </div>
        </div>
    );
};
