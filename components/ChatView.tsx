import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, ChatGroup, ChatMessage, Event, UserRole, EventRegistration, EventTicketPurchase } from '../types';
import { PaperAirplaneIcon, MicrophoneIcon, VideoCameraIcon, StopIcon, XIcon, PlayIcon, ShieldCheckIcon, ArrowLeftIcon, Cog6ToothIcon, UserCircleIcon, PaperClipIcon, ArrowDownTrayIcon, TrashIcon, CalendarDaysIcon, ShoppingCartIcon, WrenchScrewdriverIcon } from '../constants';
import { AudioPlayer } from './AudioPlayer';

interface ChatViewProps {
    currentUser: User;
    allUsers: User[];
    groups: ChatGroup[];
    messages: ChatMessage[];
    events: Event[];
    onSendMessage: (groupId: string, content: { text?: string; audioData?: string; audioDuration?: number; imageData?: string; fileName?: string; }) => void;
    onStartVideoCall: () => void;
    onOpenSettings: (group: ChatGroup) => void;
    setActiveView: (view: string, context?: { groupId?: string }) => void;
    onDeleteMessage: (messageId: string) => void;
    initialActiveGroupId: string | null;
    setInitialActiveGroupId: (id: string | null) => void;
    // New props for contextual navigation
    eventRegistrations: EventRegistration[];
    eventTicketPurchases: EventTicketPurchase[];
    onViewEventDetails: (eventId: string) => void;
    onViewMarketplaceItem: (listingId: string) => void;
    onViewService: (serviceId: string) => void;
}

const downloadFile = (fileData: string, fileName: string) => {
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]); // MIME type will be inferred by browser
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


const ChatMessageItem: React.FC<{ message: ChatMessage; isCurrentUser: boolean; sender?: User; isAdmin: boolean; canDelete: boolean; onDelete: () => void; }> = ({ message, isCurrentUser, sender, isAdmin, canDelete, onDelete }) => {
    const [showActions, setShowActions] = useState(false);
    
    if (message.senderId === 'system') {
        return (
            <div className="text-center my-2">
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{message.text}</span>
            </div>
        )
    }
    return (
        <div 
            className={`flex items-end gap-2 group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {!isCurrentUser && (
                <div className="flex-shrink-0">
                    {sender?.profilePicture ? (
                        <img src={sender.profilePicture} alt={sender.name} className="w-8 h-8 rounded-full object-cover"/>
                    ) : (
                        <UserCircleIcon className="w-8 h-8 text-slate-300" />
                    )}
                </div>
            )}
            <div className={`flex flex-col space-y-1 text-sm max-w-xs mx-2 ${isCurrentUser ? 'order-2 items-end' : 'order-1 items-start'}`}>
                <div className={`px-4 py-2 rounded-lg inline-block ${isCurrentUser ? 'rounded-br-none bg-primary-600 text-white' : 'rounded-bl-none bg-slate-200 text-slate-800'}`}>
                    {!isCurrentUser && (
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-primary-700 text-xs">{sender?.name || message.senderName}</p>
                            {isAdmin && <ShieldCheckIcon className="w-4 h-4 text-yellow-500" title="Group Admin" />}
                        </div>
                    )}
                    
                    {message.type === 'image' && message.imageData && (
                        <div className="relative cursor-pointer mb-2" onClick={() => message.fileName && downloadFile(message.imageData, message.fileName)}>
                            <img src={`data:image/jpeg;base64,${message.imageData}`} alt={message.fileName || 'image attachment'} className="rounded-md max-w-full h-auto max-h-64" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ArrowDownTrayIcon className="w-8 h-8 text-white"/>
                            </div>
                        </div>
                    )}

                    {message.type === 'voice-note' && message.audioData && (
                        <AudioPlayer audioData={message.audioData} isCurrentUser={isCurrentUser} duration={message.audioDuration}/>
                    )}

                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                    
                    <span className="block text-xs text-right mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
             {canDelete && (
                <button 
                    onClick={onDelete} 
                    className={`p-1 text-slate-400 hover:text-red-500 transition-opacity ${isCurrentUser ? 'order-1' : 'order-2'} ${showActions ? 'opacity-100' : 'opacity-0'}`}
                    title="Delete message"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

const ChatInput: React.FC<{ onSendMessage: (content: { text?: string; audioData?: string; audioDuration?: number; imageData?: string; fileName?: string; }) => void, disabled?: boolean, disabledText?: string }> = ({ onSendMessage, disabled = false, disabledText }) => {
    const [text, setText] = useState('');
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'preview'>('idle');
    const [audioPreview, setAudioPreview] = useState<{ url: string; data: string; duration: number } | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingStartRef = useRef<number>(0);
    const [recordingTime, setRecordingTime] = useState(0);

    const [imagePreview, setImagePreview] = useState<{ url: string; data: string; file: File } | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let timer: number;
        if (recordingStatus === 'recording') {
            timer = window.setInterval(() => {
                setRecordingTime(Date.now() - recordingStartRef.current);
            }, 1000);
        }
        return () => window.clearInterval(timer);
    }, [recordingStatus]);
    
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const duration = Date.now() - recordingStartRef.current;

                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64Data = reader.result as string;
                    setAudioPreview({ url: audioUrl, data: base64Data.split(',')[1], duration: Math.round(duration / 1000) });
                };
                
                setRecordingStatus('preview');
                stream.getTracks().forEach(track => track.stop()); // Release microphone
            };

            mediaRecorderRef.current.start();
            recordingStartRef.current = Date.now();
            setRecordingStatus('recording');
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access was denied. Please allow microphone access in your browser settings.");
        }
    };
    
    const handleStopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = (reader.result as string).split(',')[1];
                setImagePreview({
                    url: URL.createObjectURL(file),
                    data: base64Data,
                    file: file
                });
            };
        }
    };
    
    const cancelImagePreview = () => {
        if(imagePreview) URL.revokeObjectURL(imagePreview.url);
        setImagePreview(null);
        if(imageInputRef.current) imageInputRef.current.value = "";
    }

    const handleSend = () => {
        if (recordingStatus === 'preview' && audioPreview) {
            onSendMessage({ audioData: audioPreview.data, audioDuration: audioPreview.duration });
        } else if (imagePreview) {
            onSendMessage({ imageData: imagePreview.data, fileName: imagePreview.file.name, text });
        } else if (text.trim()) {
            onSendMessage({ text });
        }
        setText('');
        setAudioPreview(null);
        setRecordingStatus('idle');
        cancelImagePreview();
    };

    const handleDiscardRecording = () => {
        if (audioPreview) URL.revokeObjectURL(audioPreview.url);
        setAudioPreview(null);
        setRecordingStatus('idle');
    };
    
    const formatRecordingTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    if (disabled) {
        return (
            <div className="text-center text-sm text-slate-500 bg-slate-100 p-3 rounded-full">
                {disabledText || "Chat is currently disabled."}
            </div>
        );
    }
    
    if (imagePreview) {
        return (
             <div className="border rounded-lg p-2 flex flex-col gap-2">
                <div className="relative self-start">
                    <img src={imagePreview.url} alt="Preview" className="max-h-32 rounded-lg"/>
                    <button onClick={cancelImagePreview} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5"><XIcon className="w-4 h-4"/></button>
                </div>
                 <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-3">
                    <input 
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a caption..."
                        className="flex-1 border-slate-300 rounded-full shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4"
                    />
                    <button type="submit" className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 transition">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        )
    }

    if (recordingStatus === 'recording') {
        return (
            <div className="flex items-center space-x-3 w-full">
                <div className="flex-1 flex items-center bg-slate-200 rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                    <span className="font-mono text-slate-700">{formatRecordingTime(recordingTime)}</span>
                </div>
                <button type="button" onClick={handleStopRecording} className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition">
                    <StopIcon className="w-6 h-6"/>
                </button>
            </div>
        );
    }
    
    if (recordingStatus === 'preview' && audioPreview) {
        return (
            <div className="flex items-center space-x-3 w-full">
                <button type="button" onClick={handleDiscardRecording} className="bg-slate-200 text-slate-700 rounded-full p-3 hover:bg-slate-300 transition">
                    <TrashIcon className="w-6 h-6"/>
                </button>
                <div className="flex-1 bg-slate-200 rounded-full">
                    <AudioPlayer audioUrl={audioPreview.url} isCurrentUser={true} duration={audioPreview.duration}/>
                </div>
                <button type="button" onClick={handleSend} className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 transition">
                    <PaperAirplaneIcon className="w-6 h-6"/>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-3">
             <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
             <button type="button" onClick={() => imageInputRef.current?.click()} className="text-slate-500 hover:text-primary-600 p-2 rounded-full" title="Attach image">
                <PaperClipIcon className="w-6 h-6"/>
            </button>
            <input 
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-slate-300 rounded-full shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4"
            />
            {text.trim() ? (
                <button type="submit" className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 transition">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            ) : (
                <button type="button" onClick={handleStartRecording} className="bg-slate-600 text-white rounded-full p-3 hover:bg-slate-700 transition">
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
            )}
        </form>
    );
};


export const ChatView: React.FC<ChatViewProps> = (props) => {
    const { currentUser, allUsers, groups, messages, onSendMessage, onStartVideoCall, onOpenSettings, setActiveView, onDeleteMessage, initialActiveGroupId, setInitialActiveGroupId, eventRegistrations, eventTicketPurchases, onViewEventDetails, onViewMarketplaceItem, onViewService } = props;
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isMobileChatVisible, setIsMobileChatVisible] = useState(false);

    const userGroups = useMemo(() => {
        const registeredEventIds = new Set([
            ...eventRegistrations.filter(r => r.userId === currentUser.id).map(r => r.eventId),
            ...eventTicketPurchases.filter(p => p.userId === currentUser.id).map(p => p.eventId)
        ]);

        return groups.filter(g => {
            if (g.isPrivate) {
                return g.members?.includes(currentUser.id);
            }
            if(currentUser.role === UserRole.ICT_STAFF) return true;
            if(g.isEventGroup && g.eventId) {
                // Show if user is an admin (creator) or has registered/bought a ticket
                return g.adminIds?.includes(currentUser.id) || registeredEventIds.has(g.eventId);
            }
            return !g.department || // Public group
                   (g.department === currentUser.department && (!g.level || g.level === currentUser.level))
        });
    }, [groups, currentUser, eventRegistrations, eventTicketPurchases]);
    
    useEffect(() => {
        if (!activeGroupId && userGroups.length > 0) {
            setActiveGroupId(userGroups[0].id);
        }
    }, [userGroups, activeGroupId]);

    useEffect(() => {
        if (initialActiveGroupId) {
            const groupExists = userGroups.some(g => g.id === initialActiveGroupId);
            if (groupExists) {
                setActiveGroupId(initialActiveGroupId);
                setIsMobileChatVisible(true);
            }
            setInitialActiveGroupId(null); // Consume the value
        }
    }, [initialActiveGroupId, setInitialActiveGroupId, userGroups]);

    const activeMessages = useMemo(() => {
        return messages
            .filter(m => m.groupId === activeGroupId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, activeGroupId]);

    const activeGroup = useMemo(() => {
        return groups.find(g => g.id === activeGroupId);
    }, [groups, activeGroupId]);

    const isCurrentUserAdmin = useMemo(() => {
        if (!activeGroup || !currentUser) return false;
        if (currentUser.role === UserRole.ICT_STAFF) return true;
        return activeGroup.adminIds?.includes(currentUser.id) ?? false;
    }, [activeGroup, currentUser]);
    
    const isChatDisabled = useMemo(() => {
        if (!activeGroup) return true;
        return activeGroup.isLocked && !isCurrentUserAdmin;
    }, [activeGroup, isCurrentUserAdmin]);
    
    const handleSendMessageWrapper = (content: { text?: string; audioData?: string; audioDuration?: number; imageData?: string; fileName?: string; }) => {
        if (activeGroupId) {
            onSendMessage(activeGroupId, content);
        }
    }
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    const handleSelectGroup = (groupId: string) => {
        setActiveGroupId(groupId);
        setIsMobileChatVisible(true);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-md overflow-hidden">
            {/* Sidebar with groups */}
            <aside className={`w-full md:w-1/3 border-r flex-col ${isMobileChatVisible ? 'hidden' : 'flex'} md:flex`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Chat Groups</h2>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    {userGroups.map(group => (
                        <button 
                            key={group.id} 
                            onClick={() => handleSelectGroup(group.id)}
                            className={`w-full text-left p-4 hover:bg-slate-100 transition-colors flex items-center gap-3 ${activeGroupId === group.id ? 'bg-primary-50 border-r-4 border-primary-500' : ''}`}
                        >
                            {group.isPrivate && <UserCircleIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />}
                            <p className="font-semibold text-slate-800 truncate">{group.name}</p>
                        </button>
                    ))}
                </nav>
            </aside>
            
            {/* Main Chat Area */}
            <main className={`w-full md:w-2/3 flex-col ${isMobileChatVisible ? 'flex' : 'hidden'} md:flex`}>
                {activeGroup ? (
                    <>
                        <header className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMobileChatVisible(false)} className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </button>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">{activeGroup.name}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {activeGroup.isEventGroup && activeGroup.eventId && (
                                    <button onClick={() => onViewEventDetails(activeGroup.eventId!)} className="text-sm bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-lg hover:bg-slate-200 transition flex items-center gap-1.5"><CalendarDaysIcon className="w-4 h-4" />View Event</button>
                                )}
                                {activeGroup.relatedListingId && (
                                     <button onClick={() => onViewMarketplaceItem(activeGroup.relatedListingId!)} className="text-sm bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-lg hover:bg-slate-200 transition flex items-center gap-1.5"><ShoppingCartIcon className="w-4 h-4" />View Item</button>
                                )}
                                {activeGroup.relatedServiceId && (
                                     <button onClick={() => onViewService(activeGroup.relatedServiceId!)} className="text-sm bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-lg hover:bg-slate-200 transition flex items-center gap-1.5"><WrenchScrewdriverIcon className="w-4 h-4" />View Service</button>
                                )}
                                <button onClick={onStartVideoCall} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="Start Video Call">
                                    <VideoCameraIcon className="w-6 h-6"/>
                                </button>
                                {isCurrentUserAdmin && (
                                    <button onClick={() => onOpenSettings(activeGroup)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="Chat Settings">
                                        <Cog6ToothIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </header>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
                            {activeMessages.map(msg => {
                                const sender = allUsers.find(u => u.id === msg.senderId);
                                const isSender = msg.senderId === currentUser.id;
                                const canDelete = isSender || isCurrentUserAdmin;
                                return (
                                    <ChatMessageItem 
                                        key={msg.id} 
                                        message={msg} 
                                        isCurrentUser={isSender}
                                        sender={sender}
                                        isAdmin={activeGroup.adminIds?.includes(msg.senderId) ?? false}
                                        canDelete={canDelete}
                                        onDelete={() => onDeleteMessage(msg.id)}
                                    />
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-white">
                            <ChatInput onSendMessage={handleSendMessageWrapper} disabled={isChatDisabled} disabledText="Chat is currently locked by an admin." />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 hidden md:flex items-center justify-center text-slate-500">
                        <p>Select a group to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};