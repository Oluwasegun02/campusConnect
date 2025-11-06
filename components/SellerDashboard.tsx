import React from 'react';
import { MarketplaceListing } from '../types';
import { PlusCircleIcon, TrashIcon, PencilIcon } from '../constants';

interface SellerDashboardProps {
    userListings: MarketplaceListing[];
    onCreateListing: () => void;
    onDeleteListing: (listingId: string) => void;
    onEditListing: (listing: MarketplaceListing) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ userListings, onCreateListing, onDeleteListing, onEditListing }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold text-slate-800">My Listings</h3>
                 <button onClick={onCreateListing} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Create New Listing</span>
                </button>
            </div>

             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {userListings.map(listing => (
                            <tr key={listing.id}>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 flex items-center gap-4">
                                    <img src={listing.image} alt={listing.title} className="w-12 h-12 object-cover rounded-md"/>
                                    {listing.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-semibold">${listing.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {listing.isAvailable ? 'Available' : 'Sold'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(listing.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm flex items-center gap-4">
                                     <button onClick={() => onEditListing(listing)} className="text-slate-500 hover:text-primary-600" title="Edit Listing">
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => onDeleteListing(listing.id)} className="text-red-500 hover:text-red-700" title="Delete Listing">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {userListings.length === 0 && <p className="text-center text-slate-500 py-12">You haven't listed any items for sale yet.</p>}
            </div>
        </div>
    );
};
