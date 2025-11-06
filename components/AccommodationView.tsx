import React, { useState, useMemo } from 'react';
import { User, Hostel, Room, AccommodationApplication } from '../types';
import { CheckCircleIcon, XIcon, BuildingOfficeIcon } from '../constants';

// --- Booking Modal ---
interface BookingModalProps {
    room: Room;
    hostel: Hostel;
    onClose: () => void;
    onSubmit: (room: Room, duration: string, price: number) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, hostel, onClose, onSubmit }) => {
    const [selectedDuration, setSelectedDuration] = useState(room.pricing[0]?.duration || '');

    const selectedPrice = useMemo(() => {
        return room.pricing.find(p => p.duration === selectedDuration)?.price || 0;
    }, [room.pricing, selectedDuration]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(room, selectedDuration, selectedPrice);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-slate-800">Book a Room</h3>
                <p className="mt-2 text-slate-600">You are booking <strong>Room {room.roomNumber} ({room.type})</strong> at <strong>{hostel.name}</strong>.</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Duration:</label>
                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="w-full border-slate-300 rounded-md shadow-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                        >
                            {room.pricing.map(p => <option key={p.duration} value={p.duration}>{p.duration}</option>)}
                        </select>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg text-center">
                        <p className="text-sm font-medium text-primary-800">Total Amount</p>
                        <p className="text-3xl font-bold text-primary-700">${selectedPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold">Proceed to Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main View Component ---
interface AccommodationViewProps {
    currentUser: User;
    hostels: Hostel[];
    rooms: Room[];
    applications: AccommodationApplication[];
    onInitiateBooking: (room: Room, duration: string, price: number) => void;
    onRegisterHostel: () => void;
}

export const AccommodationView: React.FC<AccommodationViewProps> = ({ currentUser, hostels, rooms, applications, onInitiateBooking, onRegisterHostel }) => {
    const [bookingDetails, setBookingDetails] = useState<{ room: Room, hostel: Hostel } | null>(null);

    const studentBooking = useMemo(() => {
        return applications.find(app => app.studentId === currentUser.id);
    }, [applications, currentUser.id]);

    const approvedHostels = useMemo(() => hostels.filter(h => h.status === 'Approved'), [hostels]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Accommodation Portal</h2>
                <button 
                    onClick={onRegisterHostel}
                    className="bg-white border border-primary-500 text-primary-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-50 transition"
                >
                    <BuildingOfficeIcon className="w-5 h-5"/>
                    <span>Register Your Hostel</span>
                </button>
            </div>
            
            {/* Booking Status */}
            <div>
                 <h3 className="text-xl font-bold text-slate-700 mb-4">My Booking Status</h3>
                 {studentBooking ? (
                    (() => {
                        const hostel = hostels.find(h => h.id === studentBooking.hostelId);
                        const room = rooms.find(r => r.id === studentBooking.roomId);
                        return (
                            <div className="bg-green-100 text-green-800 border-l-4 border-green-400 p-6 rounded-lg flex items-start gap-4">
                                <div className="flex-shrink-0"><CheckCircleIcon className="w-8 h-8"/></div>
                                <div>
                                    <h4 className="font-bold text-lg">Room Booked Successfully!</h4>
                                    <p className="text-sm mt-1">
                                        You have booked <strong>Room {room?.roomNumber} ({room?.type})</strong> at <strong>{hostel?.name}</strong> for the {studentBooking.duration}.
                                    </p>
                                </div>
                            </div>
                        );
                    })()
                 ) : (
                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
                         <p className="text-slate-500">You have no active bookings. Browse available rooms below.</p>
                     </div>
                 )}
            </div>

            {/* Hostels & Rooms List */}
            <div className="space-y-6">
                {approvedHostels.map(hostel => (
                    <div key={hostel.id} className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-xl font-bold text-slate-800">{hostel.name}</h4>
                                <p className="text-sm text-slate-500">{hostel.location} - {hostel.address}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${hostel.ownerId === 'school' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                {hostel.ownerId === 'school' ? 'School Hostel' : 'Private'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{hostel.description}</p>
                        
                        <div className="mt-4 pt-4 border-t">
                             <h5 className="text-md font-semibold text-slate-700 mb-2">Available Rooms</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rooms.filter(r => r.hostelId === hostel.id && r.isAvailable).map(room => (
                                    <div key={room.id} className="border p-4 rounded-lg bg-slate-50">
                                        <p className="font-bold">{room.type} Room ({room.roomNumber})</p>
                                        <div className="text-sm text-slate-600 mt-1">
                                            {room.pricing.map(p => (
                                                <p key={p.duration}>${p.price} / {p.duration}</p>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setBookingDetails({ room, hostel })}
                                            disabled={!!studentBooking}
                                            className="w-full mt-3 bg-primary-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        >
                                           {studentBooking ? 'Already Booked' : 'Book Now'}
                                        </button>
                                    </div>
                                ))}
                                {rooms.filter(r => r.hostelId === hostel.id && r.isAvailable).length === 0 && (
                                    <p className="text-sm text-slate-400 italic md:col-span-2 lg:col-span-3">No available rooms in this hostel.</p>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {bookingDetails && (
                <BookingModal 
                    room={bookingDetails.room}
                    hostel={bookingDetails.hostel}
                    onClose={() => setBookingDetails(null)}
                    onSubmit={onInitiateBooking}
                />
            )}
        </div>
    );
};