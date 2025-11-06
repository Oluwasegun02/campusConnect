import React, { useState } from 'react';
import { Hostel } from '../types';
import { XIcon, PlusCircleIcon } from '../constants';

interface HostelRegistrationFormProps {
    onClose: () => void;
    onRegister: (hostelData: Omit<Hostel, 'id' | 'ownerId' | 'status'>) => void;
}

export const HostelRegistrationForm: React.FC<HostelRegistrationFormProps> = ({ onClose, onRegister }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState<'On-Campus' | 'Off-Campus'>('Off-Campus');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [rules, setRules] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const handleAddAmenity = () => {
        if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity('');
        }
    };

    const handleRemoveAmenity = (amenityToRemove: string) => {
        setAmenities(amenities.filter(a => a !== amenityToRemove));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({
            name,
            location,
            address,
            description,
            amenities,
            rules,
            contactPerson,
            contactPhone,
            images: images.length > 0 ? images : ['https://via.placeholder.com/400x250.png?text=No+Image'],
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Register Your Hostel/Home</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hostel/Property Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <select value={location} onChange={e => setLocation(e.target.value as 'On-Campus' | 'Off-Campus')} className="w-full border-slate-300 rounded-md bg-white">
                                <option>Off-Campus</option>
                                <option>On-Campus</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
                        <div className="flex items-center gap-2">
                            <input type="text" value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="e.g., WiFi, AC" className="flex-grow border-slate-300 rounded-md" />
                            <button type="button" onClick={handleAddAmenity} className="bg-primary-500 text-white p-2 rounded-md"><PlusCircleIcon className="w-5 h-5"/></button>
                        </div>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {amenities.map(a => <span key={a} className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">{a} <button type="button" onClick={() => handleRemoveAmenity(a)}><XIcon className="w-3 h-3"/></button></span>)}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rules</label>
                        <textarea value={rules} onChange={e => setRules(e.target.value)} rows={2} className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                            <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Images</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm"/>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {images.map((img, i) => <img key={i} src={img} className="w-20 h-20 object-cover rounded-md border"/>)}
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