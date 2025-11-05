import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, ChatGroup, ChatMessage } from '../types';
import { PaperAirplaneIcon, MicrophoneIcon, VideoCameraIcon, StopIcon, XIcon, PlayIcon, ShieldCheckIcon } from '../constants';
import { AudioPlayer } from './AudioPlayer';

interface ChatViewProps {
    currentUser: User;
    groups: ChatGroup[];
    messages: ChatMessage[];
    onSendMessage: (groupId: string, content: { text?: string; audioData?: string; audioDuration?: number }) => void;
    onStartVideoCall: () => void;
}

const ChatMessageItem: React.FC<{ message: ChatMessage; isCurrentUser: boolean; isAdmin: boolean; }> = ({ message, isCurrentUser, isAdmin }) => {
    return (
        <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col space-y-1 text-sm max-w-xs mx-2 ${isCurrentUser ? 'order-1 items-end' : 'order-2 items-start'}`}>
                <div className={`px-4 py-2 rounded-lg inline-block ${isCurrentUser ? 'rounded-br-none bg-primary-600 text-white' : 'rounded-bl-none bg-slate-200 text-slate-800'}`}>
                    {!isCurrentUser && (
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-primary-700 text-xs">{message.senderName}</p>
                            {isAdmin && <ShieldCheckIcon className="w-4 h-4 text-yellow-500" title="Group Admin" />}
                        </div>
                    )}
                    
                    {message.type === 'voice-note' && message.audioData ? (
                        <AudioPlayer audioData={message.audioData} isCurrentUser={isCurrentUser} duration={message.audioDuration}/>
                    ) : (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                    )}
                    
                    <span className="block text-xs text-right mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
};

const ChatInput: React.FC<{ onSendMessage: (content: { text?: string; audioData?: string; audioDuration?: number }) => void }> = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'preview'>('idle');
    const [audioPreview, setAudioPreview] = useState<{ url: string; data: string; duration: number } | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingStartRef = useRef<number>(0);
    const [recordingTime, setRecordingTime] = useState(0);

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

    const handleSend = () => {
        if (recordingStatus === 'preview' && audioPreview) {
            onSendMessage({ audioData: audioPreview.data, audioDuration: audioPreview.duration });
        } else if (text.trim()) {
            onSendMessage({ text });
        }
        setText('');
        setAudioPreview(null);
        setRecordingStatus('idle');
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
                    <XIcon className="w-6 h-6"/>
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


export const ChatView: React.FC<ChatViewProps> = ({ currentUser, groups, messages, onSendMessage, onStartVideoCall }) => {
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const userGroups = useMemo(() => {
        return groups.filter(g => 
            !g.department || // Public group
            (g.department === currentUser.department && (!g.level || g.level === currentUser.level))
        );
    }, [groups, currentUser]);
    
    useEffect(() => {
        if (!activeGroupId && userGroups.length > 0) {
            setActiveGroupId(userGroups[0].id);
        }
    }, [userGroups, activeGroupId]);

    const activeMessages = useMemo(() => {
        return messages
            .filter(m => m.groupId === activeGroupId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, activeGroupId]);

    const activeGroup = useMemo(() => {
        return groups.find(g => g.id === activeGroupId);
    }, [groups, activeGroupId]);
    
    const handleSendMessageWrapper = (content: { text?: string; audioData?: string; audioDuration?: number }) => {
        if (activeGroupId) {
            onSendMessage(activeGroupId, content);
        }
    }
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-md">
            {/* Sidebar with groups */}
            <aside className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Chat Groups</h2>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    {userGroups.map(group => (
                        <button 
                            key={group.id} 
                            onClick={() => setActiveGroupId(group.id)}
                            className={`w-full text-left p-4 hover:bg-slate-100 transition-colors ${activeGroupId === group.id ? 'bg-primary-50 border-r-4 border-primary-500' : ''}`}
                        >
                            <p className="font-semibold text-slate-800">{group.name}</p>
                        </button>
                    ))}
                </nav>
            </aside>
            
            {/* Main Chat Area */}
            <main className="w-2/3 flex flex-col">
                {activeGroup ? (
                    <>
                        <header className="p-4 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">{activeGroup.name}</h2>
                            <button onClick={onStartVideoCall} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="Start Video Call">
                                <VideoCameraIcon className="w-6 h-6"/>
                            </button>
                        </header>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
                            {activeMessages.map(msg => (
                                <ChatMessageItem 
                                    key={msg.id} 
                                    message={msg} 
                                    isCurrentUser={msg.senderId === currentUser.id}
                                    isAdmin={activeGroup.adminIds?.includes(msg.senderId) ?? false}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-white">
                            <ChatInput onSendMessage={handleSendMessageWrapper} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <p>Select a group to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};