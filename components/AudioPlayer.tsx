import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '../constants';

interface AudioPlayerProps {
    audioData?: string; // base64
    audioUrl?: string; // object URL for previews
    isCurrentUser: boolean;
    duration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData, audioUrl, isCurrentUser, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const src = audioUrl || `data:audio/webm;base64,${audioData}`;
        audioRef.current = new Audio(src);

        const updateProgress = () => {
            if (audioRef.current) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audioRef.current.addEventListener('timeupdate', updateProgress);
        audioRef.current.addEventListener('ended', onEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.removeEventListener('ended', onEnded);
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioData, audioUrl]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    const formatDuration = (sec?: number) => {
        if (sec === undefined) return '0:00';
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    const textColor = isCurrentUser ? 'text-white' : 'text-slate-700';
    const progressBg = isCurrentUser ? 'bg-white/30' : 'bg-slate-300';
    const progressFill = isCurrentUser ? 'bg-white' : 'bg-primary-500';

    return (
        <div className="flex items-center gap-3 w-48">
            <button type="button" onClick={togglePlay} className={`flex-shrink-0 ${textColor}`}>
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex-grow flex items-center gap-2">
                <div className={`w-full h-1 rounded-full ${progressBg}`}>
                    <div className={`h-1 rounded-full ${progressFill}`} style={{ width: `${progress}%` }}></div>
                </div>
                 <span className={`text-xs font-mono ${textColor} opacity-80`}>{formatDuration(duration)}</span>
            </div>
        </div>
    );
};