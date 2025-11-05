import React, { useState } from 'react';
import { ChatGroup, User, UserRole } from '../types';
import { XIcon, TrashIcon } from '../constants';

interface ManageChatAdminsProps {
    group: ChatGroup;
    allUsers: User[];
    onClose: () => void;
    onSave: (groupId: string, adminIds: string[]) => void;
}

export const ManageChatAdmins: React.FC<ManageChatAdminsProps> = ({ group, allUsers, onClose, onSave }) => {
    const [adminIds, setAdminIds] = useState<string[]>(group.adminIds || []);
    const [selectedStudent, setSelectedStudent] = useState<string>('');

    const students = allUsers.filter(u => u.role === UserRole.STUDENT);

    const handleAddAdmin = () => {
        if (selectedStudent && !adminIds.includes(selectedStudent)) {
            setAdminIds(prev => [...prev, selectedStudent]);
            setSelectedStudent('');
        }
    };

    const handleRemoveAdmin = (userId: string) => {
        setAdminIds(prev => prev.filter(id => id !== userId));
    };

    const handleSave = () => {
        onSave(group.id, adminIds);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Manage Admins</h2>
                        <p className="text-sm text-slate-500">For group: "{group.name}"</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Current Admins</h3>
                        {adminIds.length > 0 ? (
                            <ul className="space-y-2">
                                {adminIds.map(id => {
                                    const adminUser = allUsers.find(u => u.id === id);
                                    return (
                                        <li key={id} className="flex justify-between items-center bg-slate-100 p-2 rounded-md">
                                            <span className="text-sm font-medium text-slate-800">{adminUser?.name || 'Unknown User'}</span>
                                            <button onClick={() => handleRemoveAdmin(id)} className="text-red-500 hover:text-red-700" title="Remove Admin">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No student admins assigned.</p>
                        )}
                    </div>
                    
                    <div className="border-t pt-6">
                         <h3 className="text-lg font-medium text-slate-700 mb-2">Add New Admin</h3>
                        <div className="flex items-center gap-2">
                             <select 
                                value={selectedStudent} 
                                onChange={e => setSelectedStudent(e.target.value)}
                                className="flex-grow border-slate-300 rounded-md shadow-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="" disabled>Select a student...</option>
                                {students
                                    .filter(s => !adminIds.includes(s.id)) // Don't show existing admins in dropdown
                                    .map(student => (
                                        <option key={student.id} value={student.id}>{student.name}</option>
                                ))}
                            </select>
                             <button 
                                onClick={handleAddAdmin}
                                disabled={!selectedStudent}
                                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-slate-300"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
