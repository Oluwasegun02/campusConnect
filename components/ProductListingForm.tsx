import React, { useState } from 'react';
import { MarketplaceListing, ItemCondition } from '../types';
import { XIcon } from '../constants';

interface ProductListingFormProps {
    onClose: () => void;
    onSave: (listing: any) => void;
    listingToEdit?: MarketplaceListing;
}

const conditions: ItemCondition[] = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

export const ProductListingForm: React.FC<ProductListingFormProps> = ({ onClose, onSave, listingToEdit }) => {
    const [title, setTitle] = useState(listingToEdit?.title || '');
    const [description, setDescription] = useState(listingToEdit?.description || '');
    const [price, setPrice] = useState<number | ''>(listingToEdit?.price || '');
    const [category, setCategory] = useState(listingToEdit?.category || '');
    const [condition, setCondition] = useState<ItemCondition>(listingToEdit?.condition || 'Used - Good');
    const [image, setImage] = useState<string | null>(listingToEdit?.image || null);
    const [quantityAvailable, setQuantityAvailable] = useState<number | ''>(listingToEdit?.quantityAvailable || 1);
    
    const isEditMode = !!listingToEdit;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (price === '' || quantityAvailable === '' || !image) return;
        const listingData = {
            ...listingToEdit,
            title,
            description,
            price: Number(price),
            category,
            condition,
            image,
            quantityAvailable: Number(quantityAvailable),
        };
        onSave(listingData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full border-slate-300 rounded-md"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} min="0" step="0.01" required className="w-full border-slate-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                             <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Books, Electronics" required className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                            <select value={condition} onChange={e => setCondition(e.target.value as ItemCondition)} required className="w-full border-slate-300 rounded-md bg-white">
                                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Available</label>
                            <input type="number" value={quantityAvailable} onChange={e => setQuantityAvailable(e.target.value === '' ? '' : Number(e.target.value))} min="1" required className="w-full border-slate-300 rounded-md" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm"/>
                        {image && <img src={image} className="mt-2 w-32 h-32 object-cover rounded-md border"/>}
                    </div>
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border">Cancel</button>

                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md">{isEditMode ? 'Save Changes' : 'Create Listing'}</button>
                </div>
            </div>
        </div>
    );
};
