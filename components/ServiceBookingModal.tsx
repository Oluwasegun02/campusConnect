import React, { useState } from 'react';
import { RegisteredService } from '../types';
import { XIcon } from '../constants';

interface ServiceBookingModalProps {
    service: RegisteredService;
    onClose: () => void;
    onSubmit: (details: any, price: number) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ service, onClose, onSubmit }) => {
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState(service.price);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ details }, price);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-slate-800">Book Service</h3>
                <p className="mt-2 text-slate-600">You are booking: <strong>{service.serviceName}</strong></p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Booking Details</label>
                        <textarea
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            rows={3}
                            placeholder="Add any specific requests, pickup location, time, etc."
                            className="w-full border-slate-300 rounded-md"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Agreed Price ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            min="0"
                            step="0.01"
                            required
                            className="w-full border-slate-300 rounded-md"
                        />
                        <p className="text-xs text-slate-500 mt-1">Default price is shown. You can edit this if you have negotiated a different price with the provider via chat.</p>
                    </div>
                    <div className="flex justify-end space-x-4 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold">Proceed to Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
