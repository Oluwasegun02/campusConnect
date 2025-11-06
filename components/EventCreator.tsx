import React, { useState } from 'react';
import { User, Event } from '../types';
import { XIcon } from '../constants';

interface EventCreatorProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (eventData: Omit<Event, 'id' | 'creatorId' | 'creatorName' | 'chatGroupId'>, isChatLocked: boolean) => void;
}

export const EventCreator: React.FC<EventCreatorProps> = ({ currentUser, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'Physical' | 'Online'>('Physical');
    const [location, setLocation] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [ticketPrice, setTicketPrice] = useState<number | ''>('');
    const [isChatLocked, setIsChatLocked] = useState(false);

    const handleTypeChange = (newType: 'Physical' | 'Online') => {
        setType(newType);
        // Set default lock status based on type
        setIsChatLocked(newType === 'Online');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventData: Omit<Event, 'id' | 'creatorId' | 'creatorName' | 'chatGroupId'> = {
            title,
            description,
            date,
            type,
            hosts: [currentUser.id], // The creator is the initial host
            location: type === 'Physical' ? location : undefined,
            videoLink: type === 'Online' ? videoLink : undefined,
            ticketPrice: type === 'Physical' && ticketPrice ? Number(ticketPrice) : undefined,
        };
        onCreate(eventData, isChatLocked);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Create New Event</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                            <select value={type} onChange={e => handleTypeChange(e.target.value as 'Online' | 'Physical')} className="w-full border-slate-300 rounded-md bg-white">
                                <option value="Physical">Physical</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                    </div>
                    
                    {type === 'Physical' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location / Venue</label>
                                <input type="text" value={location} onChange={e => setLocation(e.target.value)} required={type === 'Physical'} placeholder="e.g., Main Auditorium" className="w-full border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Price ($)</label>
                                <input type="number" value={ticketPrice} onChange={e => setTicketPrice(e.target.value === '' ? '' : Number(e.target.value))} min="0" step="0.01" placeholder="Leave blank for free entry" className="w-full border-slate-300 rounded-md" />
                            </div>
                        </div>
                    )}
                    
                    {type === 'Online' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Video Call Link</label>
                            <input type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)} required={type === 'Online'} placeholder="https://meet.google.com/..." className="w-full border-slate-300 rounded-md" />
                        </div>
                    )}

                    <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-md border">
                        <input id="lockChat" type="checkbox" checked={isChatLocked} onChange={e => setIsChatLocked(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        <div>
                            <label htmlFor="lockChat" className="font-medium text-slate-700">Lock event chat initially</label>
                            <p className="text-xs text-slate-500">If checked, only hosts can send messages until it's unlocked.</p>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md">Create Event</button>
                </div>
            </div>
        </div>
    );
};