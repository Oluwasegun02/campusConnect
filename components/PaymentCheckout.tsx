import React, { useState } from 'react';
import { XIcon, CreditCardIcon, CheckCircleIcon } from '../constants';

interface PaymentCheckoutProps {
    paymentDetails: {
        amount: number;
        description: string;
        type: 'payment' | 'deposit';
        metadata?: any;
    };
    walletBalance: number;
    onClose: () => void;
    onConfirmPayment: (method: 'card' | 'wallet') => void;
}

const PaymentSummary: React.FC<{ details: PaymentCheckoutProps['paymentDetails'] }> = ({ details }) => {
    const { metadata, amount, type, description } = details;

    if (type === 'deposit') {
         return (
            <div className="bg-slate-50 border rounded-lg p-4 mb-6">
                <h4 className="font-bold text-slate-700 mb-2">Transaction Summary</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                    <li><strong>Type:</strong> Wallet Deposit</li>
                </ul>
                <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold">
                    <span className="text-slate-800">Total</span>
                    <span className="text-primary-600 text-lg">${amount.toFixed(2)}</span>
                </div>
            </div>
        )
    }
    
    if (!metadata) {
        return <p className="text-slate-500 mt-2 text-center">{description}</p>;
    }

    const renderDetails = () => {
        switch (metadata.paymentType) {
            case 'accommodation':
                return (
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li><strong>Hostel:</strong> {metadata.hostelName}</li>
                        <li><strong>Room:</strong> {metadata.roomNumber} ({metadata.roomType})</li>
                        <li><strong>Duration:</strong> {metadata.duration}</li>
                    </ul>
                );
            case 'marketplace':
                return (
                     <ul className="text-sm text-slate-600 space-y-1">
                        <li><strong>Item:</strong> {metadata.listingTitle}</li>
                        <li><strong>Seller:</strong> {metadata.sellerName}</li>
                    </ul>
                );
            case 'event_ticket':
                 return (
                     <ul className="text-sm text-slate-600 space-y-1">
                        <li><strong>Event:</strong> {metadata.eventTitle}</li>
                        <li><strong>Tickets:</strong> {metadata.quantity}</li>
                        <li><strong>Price:</strong> ${metadata.pricePerTicket?.toFixed(2)} / ticket</li>
                    </ul>
                );
            case 'service_booking':
                 return (
                     <ul className="text-sm text-slate-600 space-y-1">
                        <li><strong>Service:</strong> {metadata.serviceName}</li>
                        <li><strong>Provider:</strong> {metadata.providerName}</li>
                        {metadata.details?.details && <li><strong>Details:</strong> {metadata.details.details}</li>}
                    </ul>
                );
            default:
                 return <p className="text-slate-500 mt-2">{description}</p>;
        }
    };

    return (
        <div className="bg-slate-50 border rounded-lg p-4 mb-6">
            <h4 className="font-bold text-slate-700 mb-2">Order Summary</h4>
            {renderDetails()}
            <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold">
                <span className="text-slate-800">Total</span>
                <span className="text-primary-600 text-lg">${amount.toFixed(2)}</span>
            </div>
        </div>
    )
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ paymentDetails, walletBalance, onClose, onConfirmPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = (method: 'card' | 'wallet') => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirmPayment(method);
            }, 1500); // Wait a bit on the success screen before closing
        }, 2000); // Simulate network delay
    };

    const canPayWithWallet = walletBalance >= paymentDetails.amount;

    const isWalletApplicable = paymentDetails.type === 'payment' && paymentDetails.metadata?.paymentType !== 'visitor_library_fee';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                
                {isSuccess ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                        <h3 className="text-2xl font-bold text-slate-800 mt-4">
                            {paymentDetails.type === 'deposit' ? 'Deposit Successful!' : 'Payment Successful!'}
                        </h3>
                        <p className="mt-2 text-slate-600">Your transaction has been completed.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-4">
                            <CreditCardIcon className="w-12 h-12 text-primary-600 mx-auto"/>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2">
                               {paymentDetails.type === 'deposit' ? 'Confirm Deposit' : 'Confirm Payment'}
                            </h3>
                        </div>

                        <PaymentSummary details={paymentDetails} />

                        {isWalletApplicable && (
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handlePayment('wallet')} 
                                    disabled={!canPayWithWallet || isProcessing}
                                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Pay with Wallet (Balance: ${walletBalance.toFixed(2)})
                                </button>
                                 <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-slate-300"></div>
                                    <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
                                    <div className="flex-grow border-t border-slate-300"></div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={(e) => { e.preventDefault(); handlePayment('card'); }} className="space-y-4">
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
                            <div className="pt-2">
                                <button type="submit" disabled={isProcessing} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-slate-400 flex items-center justify-center">
                                    {isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {isProcessing ? 'Processing...' : `Pay $${paymentDetails.amount.toFixed(2)} with Card`}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};