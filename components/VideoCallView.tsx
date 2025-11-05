import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XIcon, MicrophoneIcon, VideoCameraIcon, PhoneXMarkIcon, Cog6ToothIcon } from '../constants';

interface VideoCallViewProps {
    onClose: () => void;
}

export const VideoCallView: React.FC<VideoCallViewProps> = ({ onClose }) => {
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // New state for settings
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [videoQuality, setVideoQuality] = useState('720'); // Default to 720p
    const [echoCancellation, setEchoCancellation] = useState(true);

    const updateStream = useCallback(async () => {
        // Stop any existing tracks before creating a new stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        const constraints: MediaStreamConstraints = {
            audio: {
                echoCancellation: echoCancellation,
            },
            video: {
                height: { ideal: parseInt(videoQuality) }
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            // After getting a new stream, re-apply the mute/off states to the new tracks
            stream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
            stream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
        } catch (err) {
            console.error("Error accessing media devices with new constraints.", err);
            alert("Could not apply settings. Please check permissions and device capabilities, or try a lower resolution.");
        }
    }, [videoQuality, echoCancellation, isMicMuted, isCameraOff]);

    useEffect(() => {
        updateStream();

        // Cleanup function to stop tracks when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [updateStream]);

    const toggleMic = () => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMicMuted(prev => !prev);
        }
    };
    
    const toggleCamera = () => {
         if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(prev => !prev);
        }
    };

    const SettingsPanel = () => (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-md p-6 rounded-lg shadow-2xl w-full max-w-sm z-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Call Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white"><XIcon className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="videoQuality" className="block text-sm font-medium text-slate-300 mb-1">Video Quality</label>
                    <select
                        id="videoQuality"
                        value={videoQuality}
                        onChange={(e) => setVideoQuality(e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="360">Low (360p)</option>
                        <option value="720">Medium (720p)</option>
                        <option value="1080">High (1080p)</option>
                    </select>
                </div>
                 <div>
                    <label className="flex items-center justify-between cursor-pointer">
                         <span className="text-sm font-medium text-slate-300">Enable Echo Cancellation</span>
                         <div className="relative">
                             <input 
                                type="checkbox" 
                                checked={echoCancellation}
                                onChange={(e) => setEchoCancellation(e.target.checked)}
                                className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                         </div>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900 text-white z-50 flex flex-col">
            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center">
                {/* Remote Video (Placeholder) */}
                <div className="w-full h-full bg-black flex items-center justify-center">
                     <div className="text-center text-slate-500">
                        <VideoCameraIcon className="w-24 h-24 mx-auto opacity-30"/>
                        <p className="mt-2">Waiting for others to join...</p>
                    </div>
                </div>

                {/* Local Video */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-slate-700">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                     {isCameraOff && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><p className="text-xs">Camera Off</p></div>}
                </div>
                 {/* Settings Panel */}
                {isSettingsOpen && <SettingsPanel />}
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 flex justify-center items-center space-x-4">
                <button onClick={toggleMic} className={`p-4 rounded-full transition-colors ${isMicMuted ? 'bg-red-500' : 'bg-slate-600 hover:bg-slate-500'}`} title={isMicMuted ? 'Unmute' : 'Mute'}>
                    <MicrophoneIcon className="w-6 h-6"/>
                </button>
                 <button onClick={toggleCamera} className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-red-500' : 'bg-slate-600 hover:bg-slate-500'}`} title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}>
                    <VideoCameraIcon className="w-6 h-6"/>
                </button>
                 <button onClick={() => setIsSettingsOpen(prev => !prev)} className={`p-4 rounded-full transition-colors ${isSettingsOpen ? 'bg-primary-600' : 'bg-slate-600 hover:bg-slate-500'}`} title="Settings">
                    <Cog6ToothIcon className="w-6 h-6"/>
                </button>
                 <button onClick={onClose} className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors ml-4" title="End Call">
                    <PhoneXMarkIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};
