import React, { useState, useMemo } from 'react';
import { User, Event, EventRegistration, RegisteredService, EventTicketPurchase } from '../types';
import { PlusCircleIcon, SparklesIcon, GlobeAltIcon, MapPinIcon, CheckCircleIcon } from '../constants';

interface EventBookingPortalProps {
    currentUser: User;
    events: Event[];
    registrations: EventRegistration[];
    ticketPurchases: EventTicketPurchase[];
    services: RegisteredService[];
    onRegisterForEvent: (eventId: string) => void;
    onViewDetails: (event: Event) => void;
    onCreateEvent: () => void;
    onRegisterService: () => void;
}

const EventCard: React.FC<{ event: Event; onAction: () => void; onViewDetails: () => void; isRegisteredOrHasTicket: boolean; }> = ({ event, onAction, onViewDetails, isRegisteredOrHasTicket }) => {
    
    const actionText = () => {
        if (event.type === 'Physical' && event.ticketPrice) {
            return 'Buy Ticket';
        }
        return 'Register';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 pr-2">{event.title}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${event.type === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {event.type === 'Online' ? <GlobeAltIcon className="w-3.5 h-3.5" /> : <MapPinIcon className="w-3.5 h-3.5" />}
                        {event.type}
                    </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">By {event.creatorName} on {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">{event.description}</p>
            </div>
            <div className="flex space-x-2 mt-4">
                <button onClick={onViewDetails} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition">View Details</button>
                {isRegisteredOrHasTicket ? (
                     <div className="flex-1 bg-green-100 text-green-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                        <CheckCircleIcon className="w-5 h-5"/>
                        <span>{event.type === 'Online' ? 'Registered' : 'Ticket Purchased'}</span>
                    </div>
                ) : (
                    <button onClick={onAction} className="flex-1 bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition">{actionText()}</button>
                )}
            </div>
        </div>
    );
};

export const EventBookingPortal: React.FC<EventBookingPortalProps> = ({ currentUser, events, registrations, ticketPurchases, services, onRegisterForEvent, onViewDetails, onCreateEvent, onRegisterService }) => {
    const [activeTab, setActiveTab] = useState<'browse' | 'registered'>('browse');

    const userEvents = useMemo(() => {
        const registrationIds = new Set(registrations.filter(r => r.userId === currentUser.id).map(r => r.eventId));
        const ticketedEventIds = new Set(ticketPurchases.filter(p => p.userId === currentUser.id).map(p => p.eventId));
        return events.filter(e => registrationIds.has(e.id) || ticketedEventIds.has(e.id));
    }, [events, registrations, ticketPurchases, currentUser.id]);
    
    const eventStatusMap = useMemo(() => {
        const map = new Map<string, boolean>();
        registrations.forEach(r => {
            if (r.userId === currentUser.id) map.set(r.eventId, true);
        });
        ticketPurchases.forEach(p => {
             if (p.userId === currentUser.id) map.set(p.eventId, true);
        });
        return map;
    }, [registrations, ticketPurchases, currentUser.id]);

    const TabButton: React.FC<{tabId: 'browse' | 'registered', children: React.ReactNode}> = ({ tabId, children }) => (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === tabId ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{children}</button>
    );

    const handleCardAction = (event: Event) => {
        if (event.type === 'Online' || !event.ticketPrice) {
            onRegisterForEvent(event.id);
        } else {
            // For paid physical events, the main action is in the details view
            onViewDetails(event);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Event & Booking Portal</h2>
                <div className="flex items-center gap-4">
                    <button onClick={onRegisterService} className="bg-white border border-primary-500 text-primary-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-50 transition">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>Register a Service</span>
                    </button>
                     <button onClick={onCreateEvent} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                        <SparklesIcon className="w-5 h-5"/>
                        <span>Create Event</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-full self-start">
                <TabButton tabId="browse">Browse All Events</TabButton>
                <TabButton tabId="registered">My Events</TabButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'browse' && events.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        onAction={() => handleCardAction(event)}
                        onViewDetails={() => onViewDetails(event)}
                        isRegisteredOrHasTicket={eventStatusMap.has(event.id)}
                    />
                ))}
                 {activeTab === 'registered' && userEvents.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        onAction={() => {}} // Should not be shown
                        onViewDetails={() => onViewDetails(event)}
                        isRegisteredOrHasTicket={true}
                    />
                ))}
            </div>
            {activeTab === 'browse' && events.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">No events scheduled right now.</p>}
            {activeTab === 'registered' && userEvents.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">You have not registered for any events.</p>}
        </div>
    );
};