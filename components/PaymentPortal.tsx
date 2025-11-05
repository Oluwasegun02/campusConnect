import React, { useState, useMemo } from 'react';
import { User, FeeStatement, PaymentRecord } from '../types';
import { CheckCircleIcon, CreditCardIcon } from '../constants';

interface PaymentPortalProps {
    currentUser: User;
    feeStatement?: FeeStatement;
    paymentHistory: PaymentRecord[];
    onInitiatePayment: (statementId: string, amount: number) => void;
}

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ currentUser, feeStatement, paymentHistory, onInitiatePayment }) => {
    const [paymentAmount, setPaymentAmount] = useState<number | ''>('');

    const outstandingBalance = useMemo(() => {
        if (!feeStatement) return 0;
        return feeStatement.totalAmount - feeStatement.amountPaid;
    }, [feeStatement]);

    const handlePayment = () => {
        if (!feeStatement || !paymentAmount || paymentAmount <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }
        if (paymentAmount > outstandingBalance) {
            alert(`Payment amount cannot be greater than the outstanding balance of $${outstandingBalance.toFixed(2)}.`);
            return;
        }
        onInitiatePayment(feeStatement.id, paymentAmount);
    };

    const getStatusBadge = (status: 'Paid' | 'Unpaid' | 'Partially Paid') => {
        const styles = {
            'Paid': 'bg-green-100 text-green-800',
            'Unpaid': 'bg-red-100 text-red-800',
            'Partially Paid': 'bg-yellow-100 text-yellow-800',
        };
        return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    }

    if (!feeStatement) {
        return (
            <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-700">No Fee Information</h2>
                <p className="text-slate-500 mt-2">There is no fee statement available for your account at this time.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Payment Portal</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fee Statement */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Fee Statement for {feeStatement.session}</h3>
                            <p className="text-sm text-slate-500">Student: {currentUser.name}</p>
                        </div>
                        {getStatusBadge(feeStatement.status)}
                    </div>
                    <ul className="divide-y divide-slate-200 mt-4">
                        {feeStatement.items.map(item => (
                            <li key={item.id} className="py-3 flex justify-between items-center">
                                <span className="text-slate-600">{item.description}</span>
                                <span className="font-semibold text-slate-800">${item.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t-2 border-dashed space-y-2">
                         <div className="flex justify-between text-md font-semibold text-slate-600">
                            <span>Total Amount</span>
                            <span>${feeStatement.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-md font-semibold text-slate-600">
                            <span>Amount Paid</span>
                            <span>-${feeStatement.amountPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-slate-800 pt-2">
                            <span>Outstanding Balance</span>
                            <span>${outstandingBalance.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCardIcon className="w-6 h-6 text-primary-600"/> Make a Payment</h3>
                        {outstandingBalance > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-slate-500 sm:text-sm">$</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            value={paymentAmount}
                                            onChange={e => setPaymentAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            placeholder={outstandingBalance.toFixed(2)}
                                            min="1"
                                            max={outstandingBalance}
                                            className="block w-full rounded-md border-slate-300 pl-7 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <button onClick={handlePayment} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto"/>
                                <p className="mt-2 font-semibold text-green-700">Your fees are fully paid.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div>
                <h3 className="text-xl font-bold text-slate-700 mb-4">Payment History</h3>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {paymentHistory.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Transaction ID</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-slate-200">
                                {paymentHistory.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">${p.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{p.method}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{p.transactionId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <p className="text-center text-slate-500 py-8">No payment history found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};