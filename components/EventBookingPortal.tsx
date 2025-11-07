import React, { useState, useMemo, useEffect } from 'react';
import { User, Event, EventRegistration, RegisteredService, ServiceBooking, ServiceCategory, EventTicketPurchase, ChatGroup } from '../types';
import { XIcon, GlobeAltIcon, MapPinIcon, UserGroupIcon, VideoCameraIcon, TicketIcon, PlusCircleIcon, CheckCircleIcon, SparklesIcon, SearchIcon, ChatBubbleOvalLeftEllipsisIcon } from '../constants';
import * as api from '../api/mockApi';

interface EventPortalViewProps {
    currentUser: User;
    events: Event[];
    registrations: EventRegistration[];
    ticketPurchases: EventTicketPurchase[];
    services: RegisteredService[];
    bookings: ServiceBooking[];
    chatGroups: ChatGroup[];
    onRegisterForEvent: (eventId: string) => void;
    onViewDetails: (event: Event) => void;
    onCreateEvent: () => void;
    onRegisterService: () => void;
    onBookServiceNoEvent: (service: RegisteredService) => void;
    setActiveView: (view: string, context?: { groupId?: string }) => void;
    initialSearch?: string;
    initialTab?: 'browse-events' | 'browse-services';
    onDidUseInitialSearch?: () => void;
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

const ServiceCard: React.FC<{ service: RegisteredService; onBook: () => void; onMessage: () => void; onOpenPublicChat: () => void; isOwner: boolean; hasPublicChat: boolean; }> = ({ service, onBook, onMessage, onOpenPublicChat, isOwner, hasPublicChat }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group p-4">
            <h3 className="text-lg font-bold text-slate-800">{service.serviceName}</h3>
            <p className="text-sm text-slate-500">by {service.providerName}</p>
            <p className="text-sm text-slate-600 mt-2 flex-grow">{service.description}</p>
            <div className="flex justify-between items-end mt-4">
                <p className="text-2xl font-bold text-primary-600">${service.price.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                     {hasPublicChat && <button 
                        onClick={onOpenPublicChat}
                        className="p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600 rounded-full transition-colors"
                        title="Public Q&A"
                    >
                        <UserGroupIcon className="w-6 h-6"/>
                    </button>}
                     <button 
                        onClick={onMessage}
                        disabled={isOwner}
                        className="p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-600 rounded-full transition-colors disabled:opacity-50"
                        title="Message Provider Privately"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>
                    </button>
                    <button 
                        onClick={onBook}
                        disabled={isOwner}
                        className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-slate-400"
                    >
                        {isOwner ? "Your Service" : "Book"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const EventPortalView: React.FC<EventPortalViewProps> = (props) => {
    const { currentUser, events, registrations, ticketPurchases, services, chatGroups, onRegisterForEvent, onViewDetails, onCreateEvent, onRegisterService, onBookServiceNoEvent, setActiveView, initialSearch, initialTab, onDidUseInitialSearch } = props;
    const [activeTab, setActiveTab] = useState<'browse-events' | 'my-events' | 'browse-services'>(initialTab || 'browse-events');
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [serviceCategory, setServiceCategory] = useState<ServiceCategory | 'All'>('All');

     useEffect(() => {
        if ((initialSearch || (initialTab && initialTab !== 'browse-events')) && onDidUseInitialSearch) {
            setActiveTab(initialTab || 'browse-services');
            setSearchTerm(initialSearch || '');
            onDidUseInitialSearch();
        }
    }, [initialSearch, initialTab, onDidUseInitialSearch]);

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
    }, [registrations, ticketPurchases, currentUser]);

    const approvedServices = useMemo(() => services.filter(s => s.status === 'Approved'), [services]);
    const serviceCategories: (ServiceCategory | 'All')[] = useMemo(() => ['All', ...Array.from(new Set(approvedServices.map(s => s.category)))], [approvedServices]);

    const filteredServices = useMemo(() => {
        return approvedServices.filter(s => 
            (s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (serviceCategory === 'All' || s.category === serviceCategory)
        );
    }, [approvedServices, searchTerm, serviceCategory]);

    const handleMessageProvider = async (service: RegisteredService) => {
        if (currentUser.id === service.providerId) return;
        const context = {
            type: 'service' as const,
            itemId: service.id,
            itemName: service.serviceName,
        };
        const groupId = await api.getOrCreatePrivateChat(currentUser.id, service.providerId, context);
        setActiveView('chat', { groupId });
    };

    const handleOpenPublicChat = (service: RegisteredService) => {
        const publicGroup = chatGroups.find(g => g.isServiceGroup && g.relatedServiceId === service.id);
        if (publicGroup) {
            setActiveView('chat', { groupId: publicGroup.id });
        } else {
            alert("Could not find the public chat for this service.");
        }
    };

    const TabButton: React.FC<{tabId: typeof activeTab, children: React.ReactNode}> = ({ tabId, children }) => (
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
                <h2 className="text-3xl font-bold text-slate-800">Events & Services</h2>
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
                <TabButton tabId="browse-events">Browse Events</TabButton>
                <TabButton tabId="my-events">My Events</TabButton>
                <TabButton tabId="browse-services">Browse Services</TabButton>
            </div>
            
            {activeTab === 'browse-services' && (
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
                    <div className="relative w-full md:w-2/5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
                        <input type="text" placeholder="Search for services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full"/>
                    </div>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                       {serviceCategories.map(cat => (
                            <button key={cat} onClick={() => setServiceCategory(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${serviceCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border'}`}>{cat}</button>
                       ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'browse-events' && events.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        onAction={() => handleCardAction(event)}
                        onViewDetails={() => onViewDetails(event)}
                        isRegisteredOrHasTicket={eventStatusMap.has(event.id)}
                    />
                ))}
                 {activeTab === 'my-events' && userEvents.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        onAction={() => {}} // Should not be shown
                        onViewDetails={() => onViewDetails(event)}
                        isRegisteredOrHasTicket={true}
                    />
                ))}
                 {activeTab === 'browse-services' && filteredServices.map(service => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onBook={() => onBookServiceNoEvent(service)}
                        onMessage={() => handleMessageProvider(service)}
                        onOpenPublicChat={() => handleOpenPublicChat(service)}
                        isOwner={service.providerId === currentUser.id}
                        hasPublicChat={chatGroups.some(g => g.isServiceGroup && g.relatedServiceId === service.id)}
                    />
                ))}
            </div>
            {activeTab === 'browse-events' && events.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">No events scheduled right now.</p>}
            {activeTab === 'my-events' && userEvents.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">You have not registered for any events.</p>}
            {activeTab === 'browse-services' && filteredServices.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">No services found.</p>}
        </div>
    );
};