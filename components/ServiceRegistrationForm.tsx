import React, { useState } from 'react';
import { RegisteredService, ServiceCategory } from '../types';
import { XIcon } from '../constants';

interface ServiceRegistrationFormProps {
    onClose: () => void;
    onRegister: (serviceData: Omit<RegisteredService, 'id' | 'providerId' | 'providerName' | 'status'>) => void;
}

export const ServiceRegistrationForm: React.FC<ServiceRegistrationFormProps> = ({ onClose, onRegister }) => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [category, setCategory] = useState<ServiceCategory>('Ride');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (price === '') return;
        onRegister({
            serviceName,
            description,
            price: Number(price),
            category,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Register a New Service</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                        <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} required placeholder="e.g., Event Ride, Food Stall" className="w-full border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price / Rate ($)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} min="0" step="0.01" required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                             <select value={category} onChange={e => setCategory(e.target.value as ServiceCategory)} className="w-full border-slate-300 rounded-md bg-white">
                                <option value="Ride">Ride</option>
                                <option value="Food">Food</option>
                                <option value="Table Booking">Table Booking</option>
                                <option value="Merchandise">Merchandise</option>
                                <option value="Photography">Photography</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md">Submit for Review</button>
                </div>
            </div>
        </div>
    );
};