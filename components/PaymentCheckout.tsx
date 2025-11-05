import React, { useState } from 'react';
import { XIcon, CreditCardIcon, CheckCircleIcon } from '../constants';

interface PaymentCheckoutProps {
    amount: number;
    onClose: () => void;
    onConfirmPayment: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ amount, onClose, onConfirmPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirmPayment();
            }, 1500); // Wait a bit on the success screen before closing
        }, 2000); // Simulate network delay
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                
                {isSuccess ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                        <h3 className="text-2xl font-bold text-slate-800 mt-4">Payment Successful!</h3>
                        <p className="mt-2 text-slate-600">Your transaction has been completed.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <CreditCardIcon className="w-12 h-12 text-primary-600 mx-auto"/>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2">Confirm Payment</h3>
                            <p className="text-slate-500">You are about to pay</p>
                            <p className="text-4xl font-bold text-primary-600 mt-2">${amount.toFixed(2)}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Card Number</label>
                                <input type="text" placeholder="**** **** **** 1234" required className="mt-1 w-full border-slate-300 rounded-md shadow-sm"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                                    <input type="text" placeholder="MM / YY" required className="mt-1 w-full border-slate-300 rounded-md shadow-sm"/>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700">CVC</label>
                                    <input type="text" placeholder="***" required className="mt-1 w-full border-slate-300 rounded-md shadow-sm"/>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" disabled={isProcessing} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-slate-400 flex items-center justify-center">
                                    {isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
