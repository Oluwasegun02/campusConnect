import React, { useState, useMemo } from 'react';
import { User, Event, EventRegistration, RegisteredService, ServiceBooking, ServiceCategory, EventTicketPurchase } from '../types';
import { XIcon, GlobeAltIcon, MapPinIcon, UserGroupIcon, VideoCameraIcon, TicketIcon, PlusCircleIcon, CheckCircleIcon } from '../constants';

interface EventDetailsViewProps {
    event: Event;
    currentUser: User;
    registrations: EventRegistration[];
    ticketPurchases: EventTicketPurchase[];
    services: RegisteredService[];
    bookings: ServiceBooking[];
    onClose: () => void;
    onRegister: (eventId: string) => void;
    onBookService: (event: Event, service: RegisteredService, details: any) => void;
    onInitiateTicketPurchase: (event: Event, quantity: number) => void;
    setActiveView: (view: string, context?: { groupId?: string }) => void;
}

const ServiceBooking: React.FC<{ service: RegisteredService; onBook: (details: any) => void }> = ({ service, onBook }) => {
    const [quantity, setQuantity] = useState(1);
    
    return (
         <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
            <div>
                <p className="font-bold">{service.serviceName}</p>
                <p className="text-sm text-slate-600">{service.description}</p>
                <p className="text-sm text-slate-500">Provider: {service.providerName}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-primary-600">${service.price.toFixed(2)}</p>
                {service.category === 'Merchandise' ? (
                     <div className="flex items-center gap-2 mt-2">
                        <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10)))} min="1" className="w-16 border-slate-300 rounded-md text-center"/>
                        <button onClick={() => onBook({ quantity })} className="bg-primary-600 text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-primary-700">Book</button>
                    </div>
                ) : (
                    <button onClick={() => onBook({})} className="bg-primary-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary-700 mt-2">Book</button>
                )}
            </div>
        </div>
    )
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = (props) => {
    const { event, currentUser, registrations, ticketPurchases, services, bookings, onClose, onRegister, onBookService, onInitiateTicketPurchase, setActiveView } = props;
    const [activeTab, setActiveTab] = useState<ServiceCategory>('Food');
    const [ticketQuantity, setTicketQuantity] = useState(1);

    const isRegisteredOrHasTicket = useMemo(() => {
        if (event.type === 'Online') {
            return registrations.some(r => r.userId === currentUser.id && r.eventId === event.id);
        }
        // For physical events, check ticket purchases
        return ticketPurchases.some(p => p.userId === currentUser.id && p.eventId === event.id);
    }, [registrations, ticketPurchases, currentUser, event]);
    
    const availableServices = useMemo(() => {
        return services.filter(s => s.status === 'Approved');
    }, [services]);

    const handleJoinChat = () => {
        if (event.chatGroupId) {
            setActiveView('chat', { groupId: event.chatGroupId });
        }
        onClose();
    };
    
    const ActionButton: React.FC = () => {
        if (isRegisteredOrHasTicket) {
            return (
                 <div className="w-full text-center bg-green-100 text-green-800 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-5 h-5"/>
                    <span>{event.type === 'Online' ? 'Registered' : 'Ticket Purchased'}</span>
                </div>
            );
        }
    
        if (event.type === 'Physical') {
            if (event.ticketPrice && event.ticketPrice > 0) {
                return (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="ticket-qty" className="text-sm font-medium">Qty:</label>
                            <input 
                                id="ticket-qty"
                                type="number" 
                                value={ticketQuantity} 
                                onChange={e => setTicketQuantity(Math.max(1, parseInt(e.target.value, 10)))} 
                                min="1" 
                                className="w-16 border-slate-300 rounded-md text-center"
                            />
                        </div>
                        <button 
                            onClick={() => onInitiateTicketPurchase(event, ticketQuantity)} 
                            className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition"
                        >
                            Buy Ticket for ${(event.ticketPrice * ticketQuantity).toFixed(2)}
                        </button>
                    </div>
                );
            }
            // Free physical event
            return (
                 <button onClick={() => onRegister(event.id)} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition">Register (Free)</button>
            );
        }
    
        // Free Online Event
        return (
             <button onClick={() => onRegister(event.id)} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition">Register</button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-full ${event.type === 'Online' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {event.type === 'Online' ? <GlobeAltIcon className="w-6 h-6" /> : <MapPinIcon className="w-6 h-6" />}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-800">{event.title}</h3>
                        </div>
                         <p className="text-slate-500 mt-2">By {event.creatorName} on {new Date(event.date).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
                    <p className="text-slate-600 whitespace-pre-wrap">{event.description}</p>
                    
                    {isRegisteredOrHasTicket && (
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border">
                            {event.type === 'Online' && (
                                <a href={event.videoLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                                    <VideoCameraIcon className="w-5 h-5"/> Join Video Call
                                </a>
                            )}
                            <button onClick={handleJoinChat} className="flex-1 text-center bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                                <UserGroupIcon className="w-5 h-5" /> Open Event Chat
                            </button>
                        </div>
                    )}
                    
                    {isRegisteredOrHasTicket && (
                         <div className="pt-4 border-t">
                             <h4 className="text-lg font-bold text-slate-700 mb-2">Book Event Services</h4>
                             <div className="border-b border-slate-200">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    {(['Food', 'Ride', 'Merchandise', 'Photography'] as ServiceCategory[]).map(cat => (
                                        <button key={cat} onClick={() => setActiveTab(cat)} className={`${activeTab === cat ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                                            {cat}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="mt-4 space-y-3">
                                {availableServices.filter(s => s.category === activeTab).map(service => (
                                    <ServiceBooking key={service.id} service={service} onBook={(details) => onBookService(event, service, details)} />
                                ))}
                                {availableServices.filter(s => s.category === activeTab).length === 0 && (
                                    <p className="text-slate-400 text-center py-4">No {activeTab.toLowerCase()} services available for this event.</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                <div className="pt-4 border-t mt-4">
                    <ActionButton />
                </div>
            </div>
        </div>
    );
};