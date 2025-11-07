import React, { useState, useMemo } from 'react';
import { User, UserWallet, WalletTransaction, FeeStatement, MarketplaceOrder } from '../types';
import { CreditCardIcon, TicketIcon } from '../constants';

interface PaymentPortalProps {
    currentUser: User;
    feeStatements: FeeStatement[];
    wallet?: UserWallet;
    transactions: WalletTransaction[];
    marketplaceOrders: MarketplaceOrder[];
    onDeposit: (amount: number) => void;
}

type PaymentTab = 'fees' | 'wallet' | 'marketplace';

const TabButton: React.FC<{tabId: PaymentTab, currentTab: PaymentTab, onClick: (tab: PaymentTab) => void, children: React.ReactNode}> = 
({ tabId, currentTab, onClick, children }) => (
     <button
        onClick={() => onClick(tabId)}
        className={`${
            currentTab === tabId
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
    >
        {children}
    </button>
);

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ currentUser, feeStatements, wallet, transactions, marketplaceOrders, onDeposit }) => {
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<PaymentTab>('fees');

    const handleDeposit = () => {
        if (depositAmount && depositAmount > 0) {
            onDeposit(depositAmount);
            setIsDepositModalOpen(false);
            setDepositAmount('');
        }
    };

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [transactions]);
    
    const sortedOrders = useMemo(() => {
        return [...marketplaceOrders].sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
    }, [marketplaceOrders]);


    const renderContent = () => {
        switch (activeTab) {
            case 'fees':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">My School Fees</h3>
                        {feeStatements.map(statement => (
                             <div key={statement.id} className="border-b last:border-b-0 py-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-lg text-slate-800">Session {statement.session}</p>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statement.status === 'Paid' ? 'bg-green-100 text-green-800' : statement.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {statement.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 mt-2">Total: ${statement.totalAmount.toFixed(2)} | Paid: ${statement.amountPaid.toFixed(2)} | Due: <span className="font-bold">${(statement.totalAmount - statement.amountPaid).toFixed(2)}</span></p>
                            </div>
                        ))}
                         {feeStatements.length === 0 && <p className="text-center text-slate-500 py-12">No fee statements found.</p>}
                    </div>
                )
            case 'wallet':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1 bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-xl shadow-2xl text-white">
                            <p className="font-semibold opacity-80">Current Balance</p>
                            <p className="text-5xl font-bold mt-2">${wallet?.balance.toFixed(2) ?? '0.00'}</p>
                            <button 
                                onClick={() => setIsDepositModalOpen(true)}
                                className="w-full mt-8 bg-white/20 hover:bg-white/30 font-bold py-3 rounded-lg transition-colors"
                            >
                                Deposit Funds
                            </button>
                        </div>
                        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Wallet Transactions</h3>
                            <div className="max-h-96 overflow-y-auto">
                                {sortedTransactions.length > 0 ? (
                                    <table className="min-w-full">
                                        <tbody className="divide-y divide-slate-200">
                                            {sortedTransactions.map(tx => (
                                                <tr key={tx.id}>
                                                    <td className="py-4">
                                                        <p className="font-medium text-slate-800">{tx.description}</p>
                                                        <p className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                                    </td>
                                                    <td className={`py-4 text-right text-lg font-bold ${tx.type === 'deposit' || tx.type === 'sale_credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.type === 'deposit' || tx.type === 'sale_credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-slate-500 py-12">No transactions yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
             case 'marketplace':
                return (
                     <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">My Marketplace Orders</h3>
                        <div className="max-h-96 overflow-y-auto">
                            {sortedOrders.length > 0 ? (
                                <table className="min-w-full">
                                    <tbody className="divide-y divide-slate-200">
                                        {sortedOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className="py-4">
                                                    <p className="font-medium text-slate-800">{order.listingTitle}</p>
                                                    <p className="text-sm text-slate-500">Sold by {order.sellerName} on {new Date(order.orderedAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="py-4 text-right text-lg font-bold text-slate-800">
                                                    ${order.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-slate-500 py-12">You haven't purchased anything from the marketplace yet.</p>
                            )}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Payment Portal</h2>
            
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                   <TabButton tabId="fees" currentTab={activeTab} onClick={setActiveTab}>School Fees</TabButton>
                   <TabButton tabId="wallet" currentTab={activeTab} onClick={setActiveTab}>My Wallet</TabButton>
                   <TabButton tabId="marketplace" currentTab={activeTab} onClick={setActiveTab}>Marketplace Orders</TabButton>
                </nav>
            </div>

            <div>
                {renderContent()}
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-2xl font-bold text-slate-800 text-center">Deposit Funds</h3>
                        <p className="text-slate-500 text-center mt-1">Enter the amount to add to your wallet.</p>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-500 sm:text-sm">$</span>
                                </div>
                                <input 
                                    type="number" 
                                    value={depositAmount}
                                    onChange={e => setDepositAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    min="1"
                                    className="block w-full rounded-md border-slate-300 pl-7 pr-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-2xl font-bold"
                                />
                            </div>
                        </div>
                         <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button onClick={() => setIsDepositModalOpen(false)} className="w-full px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold order-2 sm:order-1">Cancel</button>
                            <button onClick={handleDeposit} className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold order-1 sm:order-2">Proceed</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};