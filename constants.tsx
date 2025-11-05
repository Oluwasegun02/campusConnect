
import React from 'react';
import { User, UserRole, ChatGroup, ChatMessage, Course, FeeStatement } from './types';

// Icons
// Fix: Make className prop required to avoid type inference issues with children.
// FIX: Changed className to be a required prop and removed the redundant default value.
// Fix: Explicitly type Icon as a React.FunctionComponent to resolve type inference issues with the children prop.
// FIX: Added optional title prop to Icon component to allow tooltips.
export const Icon: React.FunctionComponent<{ children: React.ReactNode, className: string, title?: string }> = ({ children, className, title }) => (
    <div className={className} title={title}>{children}</div>
);

// Fix: Provide a default value for className to satisfy the updated Icon component's prop requirement.
export const HomeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg></Icon>;
// Fix: Provide a default value for className.
export const ClipboardListIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h10.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25-2.25H6.75a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z" /></svg></Icon>;
// Fix: Provide a default value for className.
export const BookOpenIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.185 0 4.237.668 6 1.848M12 6.042V18.157m0 0c2.185-1.18 4.237-1.848 6-1.848a8.987 8.987 0 013-1.488V4.262c-.938-.332-1.948-.512-3-.512a8.967 8.967 0 00-6 2.292m0 0v12.115" /></svg></Icon>;
// Fix: Provide a default value for className.
export const AcademicCapIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M12 14.25c-3.72 0-7.16-1.4-9.72-3.72a.75.75 0 010-1.06l9.72-9.72a.75.75 0 011.06 0l9.72 9.72a.75.75 0 010 1.06c-2.56 2.32-6 3.72-9.72 3.72z" /><path d="M12 14.25v6m-6-3.375c-3.72 0-7.16-1.4-9.72-3.72a.75.75 0 010-1.06l9.72-9.72a.75.75 0 011.06 0l9.72 9.72a.75.75 0 010 1.06c-2.56 2.32-6 3.72-9.72 3.72z" /></svg></Icon>;
// Fix: Provide a default value for className.
export const UserGroupIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.095-2.21-1.047-2.73m-2.5 2.73a9.084 9.084 0 01-3.741-.479 3 3 0 014.682-2.72M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 12.75v.007M12 12.75a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 15v.007" /></svg></Icon>;
// Fix: Provide a default value for className.
export const LogoutIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg></Icon>;
// Fix: Provide a default value for className.
export const PlusCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
// Fix: Provide a default value for className.
export const XIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></Icon>;
// Fix: Provide a default value for className.
export const CheckCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L11.25 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" /></svg></Icon>;
// Fix: Provide a default value for className.
export const PencilIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></Icon>;
// Fix: Provide a default value for className.
export const ClockIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
// New Icons
export const ChatBubbleLeftRightIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72h-1.981c-1.136 0-2.1-.847-2.193-1.98l-.007-.022v-4.286c0-.97.616-1.813 1.5-2.097m4.5 0V5.25c0-.97.616-1.813 1.5-2.097m4.5 0V5.25c0-.97.616-1.813 1.5-2.097m-4.5 2.097c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097M8.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097M3.75 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097" /></svg></Icon>;
export const CalendarDaysIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg></Icon>;
export const Cog6ToothIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.26.716.53 1.003l.928.928c.374.374.84.562 1.357.562h1.281c.542 0 .94.56.94 1.11v2.594c0 .55-.398 1.02-.94 1.11l-1.28.213a2.25 2.25 0 01-1.004.53l-.928.928a2.25 2.25 0 01-1.003.53l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.28a2.25 2.25 0 01-.53-1.004l-.928-.928a2.25 2.25 0 01-.53-1.003l-1.28-.213c-.542-.09-.94-.56-.94-1.11v-2.594c0-.55.398-1.02.94-1.11l1.28-.213a2.25 2.25 0 011.004-.53l.928.928a2.25 2.25 0 011.003-.53l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></Icon>;
export const DocumentPlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></Icon>;
export const CreditCardIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg></Icon>;

// Icons for Video Call & Voice Notes
export const VideoCameraIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg></Icon>;
export const PhoneXMarkIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15" /></svg></Icon>;
export const MicrophoneIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 5.25v-1.5m-6-6v-1.5m-6 7.5v-1.5m6-6h.008v.008H12v-.008zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg></Icon>;
export const StopIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></svg></Icon>;
export const PaperAirplaneIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></Icon>;
export const PlayIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg></Icon>;
export const PauseIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg></Icon>;
export const TrashIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></Icon>;
// FIX: Updated ShieldCheckIcon to accept and pass a title prop to fix type error.
export const ShieldCheckIcon = ({ className = 'w-6 h-6', title }: { className?: string; title?: string; }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg></Icon>;


// Data
export const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'];
export const LEVELS = [100, 200, 300, 400, 500];

export const MOCK_USERS: User[] = [
  { id: 'teacher1', name: 'Dr. Evelyn Reed', email: 'teacher@test.com', password: 'password', role: UserRole.TEACHER, department: 'Computer Science', level: 0 },
  { id: 'student1', name: 'Alice Johnson', email: 'student1@test.com', password: 'password', role: UserRole.STUDENT, department: 'Computer Science', level: 300 },
  { id: 'student2', name: 'Bob Williams', email: 'student2@test.com', password: 'password', role: UserRole.STUDENT, department: 'Electrical Engineering', level: 200 },
  { id: 'student3', name: 'Charlie Brown', email: 'student3@test.com', password: 'password', role: UserRole.STUDENT, department: 'Computer Science', level: 300 },
  { id: 'student4', name: 'Diana Miller', email: 'student4@test.com', password: 'password', role: UserRole.STUDENT, department: 'Mechanical Engineering', level: 400 },
  { id: 'ictstaff1', name: 'Admin User', email: 'ict@test.com', password: 'password', role: UserRole.ICT_STAFF, department: 'Administration', level: 0 },
];

export const MOCK_COURSES: Course[] = [
  { id: 'cs301', code: 'CS301', title: 'Data Structures & Algorithms', description: 'An in-depth study of fundamental data structures and algorithms.', department: 'Computer Science', level: 300, credits: 3 },
  { id: 'cs302', code: 'CS302', title: 'Operating Systems', description: 'Principles of modern operating systems design and implementation.', department: 'Computer Science', level: 300, credits: 3 },
  { id: 'cs303', code: 'CS303', title: 'Web Development', description: 'Client-side and server-side technologies for building web applications.', department: 'Computer Science', level: 300, credits: 3 },
  { id: 'ee201', code: 'EE201', title: 'Circuit Theory', description: 'Fundamentals of electrical circuits.', department: 'Electrical Engineering', level: 200, credits: 4 },
  { id: 'ee202', code: 'EE202', title: 'Digital Logic Design', description: 'Combinational and sequential logic circuits.', department: 'Electrical Engineering', level: 200, credits: 3 },
  { id: 'me401', code: 'ME401', title: 'Thermodynamics', description: 'The study of energy, heat, and work.', department: 'Mechanical Engineering', level: 400, credits: 4 },
];

export const MOCK_CHAT_GROUPS: ChatGroup[] = [
    { id: 'group-cs-300', name: 'CS 300 Level', department: 'Computer Science', level: 300, adminIds: [] },
    { id: 'group-cs-gen', name: 'Computer Science General', department: 'Computer Science', adminIds: [] },
    { id: 'group-ee-200', name: 'EE 200 Level', department: 'Electrical Engineering', level: 200, adminIds: [] },
    { id: 'group-gen-announcements', name: 'University Announcements', adminIds: [] },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg1', groupId: 'group-cs-300', senderId: 'teacher1', senderName: 'Dr. Evelyn Reed', text: 'Reminder: The deadline for Assignment 2 is this Friday!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'text' },
    { id: 'msg2', groupId: 'group-cs-300', senderId: 'student1', senderName: 'Alice Johnson', text: 'Thanks for the reminder, Dr. Reed!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), type: 'text' },
    { id: 'msg3', groupId: 'group-ee-200', senderId: 'student2', senderName: 'Bob Williams', text: 'Does anyone have the notes from yesterday\'s lecture?', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), type: 'text' },
];

export const MOCK_FEE_STATEMENTS: FeeStatement[] = [
    {
        id: 'fs-student1-2023',
        studentId: 'student1',
        session: '2023-2024',
        items: [
            { id: 'tuition', description: 'Tuition Fee', amount: 2000 },
            { id: 'library', description: 'Library Fee', amount: 100 },
            { id: 'health', description: 'Health Insurance', amount: 150 },
        ],
        totalAmount: 2250,
        amountPaid: 1000,
        status: 'Partially Paid',
    },
    {
        id: 'fs-student2-2023',
        studentId: 'student2',
        session: '2023-2024',
        items: [
            { id: 'tuition', description: 'Tuition Fee', amount: 2100 },
            { id: 'lab', description: 'Lab Fee', amount: 250 },
        ],
        totalAmount: 2350,
        amountPaid: 2350,
        status: 'Paid',
    },
     {
        id: 'fs-student3-2023',
        studentId: 'student3',
        session: '2023-2024',
        items: [
            { id: 'tuition', description: 'Tuition Fee', amount: 2000 },
            { id: 'sports', description: 'Sports Complex Fee', amount: 75 },
        ],
        totalAmount: 2075,
        amountPaid: 0,
        status: 'Unpaid',
    },
];
