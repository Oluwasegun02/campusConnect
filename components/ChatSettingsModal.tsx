import React, { useState } from 'react';
import { ChatGroup } from '../types';
import { XIcon, LockClosedIcon, LockOpenIcon } from '../constants';

interface ChatSettingsModalProps {
    group: ChatGroup;
    onClose: () => void;
    onSave: (groupId: string, isLocked: boolean) => void;
}

export const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({ group, onClose, onSave }) => {
    const [isLocked, setIsLocked] = useState(group.isLocked);

    const handleSave = () => {
        onSave(group.id, isLocked);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-800">Chat Settings</h2>
                        <p className="text-sm text-slate-500">For group: "{group.name}"</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <div className="p-6 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-slate-50 border hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                            {isLocked ? <LockClosedIcon className="w-6 h-6 text-red-500"/> : <LockOpenIcon className="w-6 h-6 text-green-500"/>}
                            <div>
                                <span className="font-medium text-slate-800">Lock Chat</span>
                                <p className="text-xs text-slate-500">
                                    {isLocked ? "Only admins can send messages." : "All members can send messages."}
                                </p>
                            </div>
                        </div>
                         <div className="relative">
                             <input 
                                type="checkbox" 
                                checked={isLocked}
                                onChange={(e) => setIsLocked(e.target.checked)}
                                className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                         </div>
                    </label>
                </div>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
