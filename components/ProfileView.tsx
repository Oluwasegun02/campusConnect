import React, { useState } from 'react';
import { User } from '../types';
import { UserCircleIcon, PencilIcon } from '../constants';

interface ProfileViewProps {
    user: User;
    onUpdateUser: (user: User) => Promise<User>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
                setIsEditing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        const updatedUserData: User = { ...user, name, profilePicture };
        if (password) {
            updatedUserData.password = password;
        }

        try {
            await onUpdateUser(updatedUserData);
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError("Failed to update profile.");
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>

            <div className="bg-white p-8 rounded-lg shadow-md border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b">
                        <div className="relative">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-200" />
                            ) : (
                                <UserCircleIcon className="w-32 h-32 text-slate-300" />
                            )}
                            <label htmlFor="profile-pic-upload" className="absolute -bottom-1 -right-1 bg-primary-600 p-2 rounded-full text-white cursor-pointer hover:bg-primary-700 transition-transform hover:scale-110">
                                <PencilIcon className="w-5 h-5" />
                                <input id="profile-pic-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column for editing */}
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setIsEditing(true); }}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">New Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    placeholder="Leave blank to keep current password"
                                    onChange={(e) => { setPassword(e.target.value); setIsEditing(true); }}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setIsEditing(true); }}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                        {/* Right column for static info */}
                        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                             <div>
                                <label className="block text-xs font-medium text-slate-500">Email Address</label>
                                <p className="text-md text-slate-800">{user.email}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Role</label>
                                <p className="text-md text-slate-800">{user.role}</p>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-500">Department</label>
                                <p className="text-md text-slate-800">{user.department}</p>
                            </div>
                             {user.level > 0 && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-500">Level</label>
                                    <p className="text-md text-slate-800">{user.level}</p>
                                </div>
                             )}
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    {isEditing && (
                        <div className="pt-5 border-t">
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
