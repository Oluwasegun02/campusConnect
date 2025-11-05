import React, { useState } from 'react';
import { AcademicCapIcon } from '../constants';

interface LoginPageProps {
    onLogin: (email: string, password: string) => void;
    onSwitchToSignup: () => void;
    error?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <AcademicCapIcon className="w-16 h-16 mx-auto text-primary-600" />
                    <h1 className="text-4xl font-bold text-slate-800 mt-2">CampusConnect</h1>
                    <p className="text-slate-600">Welcome back! Please log in.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Log In
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <button onClick={onSwitchToSignup} className="font-medium text-primary-600 hover:text-primary-500">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
