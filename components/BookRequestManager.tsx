import React from 'react';
import { BookRequest } from '../types';
import { XIcon } from '../constants';

interface BookRequestManagerProps {
    requests: BookRequest[];
    onClose: () => void;
    onUpdateStatus: (requestId: string, status: BookRequest['status']) => void;
}

export const BookRequestManager: React.FC<BookRequestManagerProps> = ({ requests, onClose, onUpdateStatus }) => {
    
    const StatusBadge: React.FC<{status: BookRequest['status']}> = ({status}) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Acquired': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>{status}</span>
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Manage Book Requests</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6">
                    {requests.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Book Details</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Requested By</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {requests.map(req => (
                                        <tr key={req.id}>
                                            <td className="px-4 py-3 text-sm">
                                                <p className="font-bold text-slate-800">{req.title}</p>
                                                <p className="text-slate-500">by {req.author}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{req.userName}</td>
                                            <td className="px-4 py-3 text-sm"><StatusBadge status={req.status} /></td>
                                            <td className="px-4 py-3 text-sm">
                                                <select
                                                    value={req.status}
                                                    onChange={(e) => onUpdateStatus(req.id, e.target.value as BookRequest['status'])}
                                                    className="border-slate-300 rounded-md text-xs py-1"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Acquired">Acquired</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No book requests have been submitted yet.</p>
                    )}
                </div>
                 <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Close</button>
                </div>
            </div>
        </div>
    );
};