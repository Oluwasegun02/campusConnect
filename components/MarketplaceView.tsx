import React, { useState, useMemo, useEffect } from 'react';
import { User, MarketplaceListing } from '../types';
import { SearchIcon, ChatBubbleOvalLeftEllipsisIcon } from '../constants';
import { SellerDashboard } from './SellerDashboard';
import * as api from '../api/mockApi';

interface MarketplaceViewProps {
    currentUser: User;
    listings: MarketplaceListing[];
    onPurchase: (listing: MarketplaceListing) => void;
    onApplySeller: () => void;
    onCreateListing: () => void;
    onDeleteListing: (listingId: string) => void;
    onEditListing: (listing: MarketplaceListing) => void;
    setActiveView: (view: string, context?: { groupId?: string }) => void;
    initialSearch?: string;
    onDidUseInitialSearch?: () => void;
}

const ProductCard: React.FC<{ listing: MarketplaceListing; onPurchase: () => void; onMessageSeller: () => void; isOwner: boolean; }> = ({ listing, onPurchase, onMessageSeller, isOwner }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
        <div className="relative h-48 bg-slate-200">
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                    onClick={onPurchase}
                    disabled={!listing.isAvailable || isOwner}
                    className="bg-primary-600 text-white font-bold py-2 px-6 rounded-full hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                 >
                    {isOwner ? 'Your Item' : listing.isAvailable ? 'Buy Now' : 'Sold Out'}
                </button>
            </div>
             <span className="absolute top-2 right-2 bg-slate-800/60 text-white text-xs font-semibold px-2 py-1 rounded-full">{listing.condition}</span>
             {listing.isAvailable && listing.quantityAvailable <= 5 && (
                <span className="absolute top-2 left-2 bg-yellow-400/80 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">Only {listing.quantityAvailable} left!</span>
             )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 truncate">{listing.title}</h3>
            <p className="text-sm text-slate-500">{listing.category} by {listing.sellerName}</p>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 flex-grow">{listing.description}</p>
            <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-bold text-primary-600">${listing.price.toFixed(2)}</p>
                 <button 
                    onClick={onMessageSeller}
                    disabled={isOwner}
                    className="p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600 rounded-full transition-colors disabled:opacity-0"
                    title="Message Seller"
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    </div>
);


export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ currentUser, listings, onPurchase, onApplySeller, onCreateListing, onDeleteListing, onEditListing, setActiveView, initialSearch, onDidUseInitialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [category, setCategory] = useState('All');
    const [activeTab, setActiveTab] = useState<'browse' | 'dashboard'>('browse');

    useEffect(() => {
        if (initialSearch && onDidUseInitialSearch) {
            setSearchTerm(initialSearch);
            onDidUseInitialSearch();
        }
    }, [initialSearch, onDidUseInitialSearch]);

    const categories = useMemo(() => ['All', ...Array.from(new Set(listings.map(l => l.category)))], [listings]);
    
    const filteredListings = useMemo(() => {
        return listings.filter(l => 
            (l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (category === 'All' || l.category === category)
        );
    }, [listings, searchTerm, category]);
    
    const userListings = useMemo(() => {
        return listings.filter(l => l.sellerId === currentUser.id);
    }, [listings, currentUser.id]);

    const handleMessageSeller = async (sellerId: string, listing: MarketplaceListing) => {
        if (currentUser.id === sellerId) return;
        const groupId = await api.getOrCreatePrivateChat(currentUser.id, sellerId, listing);
        setActiveView('chat', { groupId });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Marketplace</h2>
                {currentUser.isVerifiedSeller && (
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-full">
                        <button onClick={() => setActiveTab('browse')} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'browse' ? 'bg-white shadow' : 'text-slate-600'}`}>Browse</button>
                        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-white shadow' : 'text-slate-600'}`}>My Seller Dashboard</button>
                    </div>
                )}
            </div>

            {activeTab === 'browse' && (
                <>
                    {!currentUser.isVerifiedSeller && (
                         <div className="bg-primary-50 border-l-4 border-primary-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="py-1">
                                    <p className="text-sm text-primary-700">
                                       Want to sell your own items? {' '}
                                       {currentUser.sellerApplicationStatus === 'pending' ? (
                                            <span className="font-bold">Your application is pending review.</span>
                                       ) : (
                                            <button onClick={onApplySeller} className="font-bold underline hover:text-primary-600">Apply to become a verified seller.</button>
                                       )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
                        <div className="relative w-full md:w-2/5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
                            <input type="text" placeholder="Search for items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full"/>
                        </div>
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                           {categories.map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${category === cat ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border'}`}>{cat}</button>
                           ))}
                        </div>
                    </div>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredListings.map(listing => (
                            <ProductCard 
                                key={listing.id} 
                                listing={listing} 
                                onPurchase={() => onPurchase(listing)} 
                                onMessageSeller={() => handleMessageSeller(listing.sellerId, listing)}
                                isOwner={listing.sellerId === currentUser.id}
                            />
                        ))}
                    </div>
                    {filteredListings.length === 0 && <p className="text-slate-500 text-center py-12">No items found.</p>}
                </>
            )}

            {activeTab === 'dashboard' && currentUser.isVerifiedSeller && (
                <SellerDashboard 
                    userListings={userListings}
                    onCreateListing={onCreateListing}
                    onDeleteListing={onDeleteListing}
                    onEditListing={onEditListing}
                />
            )}
        </div>
    );
};