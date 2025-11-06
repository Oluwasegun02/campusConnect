import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEPARTMENTS, LEVELS } from '../constants';
import { AcademicCapIcon } from '../constants';

type UserData = Omit<User, 'id' | 'password'> & { password?: string };

interface SignupPageProps {
    onSignup: (userData: UserData) => void;
    onSwitchToLogin: () => void;
    error?: string | null;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    const [department, setDepartment] = useState(DEPARTMENTS[0]);
    const [level, setLevel] = useState(LEVELS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignup({
            name,
            email,
            password,
            role,
            department: role === UserRole.VISITOR ? 'N/A' : department,
            level: role === UserRole.STUDENT ? level : 0,
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                     <AcademicCapIcon className="w-16 h-16 mx-auto text-primary-600" />
                    <h1 className="text-4xl font-bold text-slate-800 mt-2">Create Account</h1>
                    <p className="text-slate-600">Join CampusConnect today!</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Role</label>
                            <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white">
                                <option value={UserRole.STUDENT}>Student</option>
                                <option value={UserRole.TEACHER}>Teacher</option>
                                <option value={UserRole.ICT_STAFF}>ICT Staff</option>
                                <option value={UserRole.VISITOR}>Visitor</option>
                            </select>
                        </div>
                        
                        {role !== UserRole.ICT_STAFF && role !== UserRole.VISITOR && (
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

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                                Sign Up
                            </button>
                        </div>
                    </form>
                     <p className="text-center text-sm text-slate-600 mt-6">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-primary-600 hover:text-primary-500">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};