import React from 'react';
import { User, UserRole, ChatGroup, ChatMessage, Course, FeeStatement, Hostel, Room, UserWallet, Exam, ExamSubmission, AssignmentType, ObjectiveQuestion, MarketplaceListing, Event, RegisteredService, LibraryBook, BookRequest, BookReview, EventTicketPurchase } from './types';

// Icons
// Fix: Make className prop required to avoid type inference issues with children.
// FIX: Changed className to be a required prop and removed the redundant default value.
// Fix: Explicitly type Icon as a React.FunctionComponent to resolve type inference issues with the children prop.
// FIX: Added optional title prop to Icon component to allow tooltips.
export const Icon: React.FunctionComponent<{ children: React.ReactNode, className: string, title?: string }> = ({ children, className, title }) => (
    <div className={className} title={title}>{children}</div>
);

// Fix: Provide a default value for className to satisfy the updated Icon component's prop requirement.
// FIX: Add optional title prop.
export const HomeIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const ClipboardListIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h10.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25-2.25H6.75a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const BookOpenIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.185 0 4.237.668 6 1.848M12 6.042V18.157m0 0c2.185-1.18 4.237-1.848 6-1.848a8.987 8.987 0 013-1.488V4.262c-.938-.332-1.948-.512-3-.512a8.967 8.967 0 00-6 2.292m0 0v12.115" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const AcademicCapIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M12 14.25c-3.72 0-7.16-1.4-9.72-3.72a.75.75 0 010-1.06l9.72-9.72a.75.75 0 011.06 0l9.72 9.72a.75.75 0 010 1.06c-2.56 2.32-6 3.72-9.72 3.72z" /><path d="M12 14.25v6m-6-3.375c-3.72 0-7.16-1.4-9.72-3.72a.75.75 0 010-1.06l9.72-9.72a.75.75 0 011.06 0l9.72 9.72a.75.75 0 010 1.06c-2.56 2.32-6 3.72-9.72 3.72z" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const UserGroupIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.095-2.21-1.047-2.73m-2.5 2.73a9.084 9.084 0 01-3.741-.479 3 3 0 014.682-2.72M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 12.75v.007M12 12.75a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 15v.007" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const LogoutIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const PlusCircleIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const XIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const CheckCircleIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L11.25 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const PencilIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></Icon>;
// Fix: Provide a default value for className.
// FIX: Add optional title prop.
export const ClockIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
// New Icons
// FIX: Add optional title prop.
export const ChatBubbleLeftRightIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72h-1.981c-1.136 0-2.1-.847-2.193-1.98l-.007-.022v-4.286c0-.97.616-1.813 1.5-2.097m4.5 0V5.25c0-.97.616-1.813 1.5-2.097m4.5 0V5.25c0-.97.616-1.813 1.5-2.097m-4.5 2.097c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097M8.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097M3.75 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 .97-.616 1.813-1.5 2.097" /></svg></Icon>;
// FIX: Add optional title prop.
export const CalendarDaysIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg></Icon>;
// FIX: Add optional title prop.
export const Cog6ToothIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.26.716.53 1.003l.928.928c.374.374.84.562 1.357.562h1.281c.542 0 .94.56.94 1.11v2.594c0 .55-.398 1.02-.94 1.11l-1.28.213a2.25 2.25 0 01-1.004.53l-.928.928a2.25 2.25 0 01-1.003.53l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.28a2.25 2.25 0 01-.53-1.004l-.928-.928a2.25 2.25 0 01-.53-1.003l-1.28-.213c-.542-.09-.94-.56-.94-1.11v-2.594c0 .55.398-1.02.94-1.11l1.28-.213a2.25 2.25 0 011.004-.53l.928.928a2.25 2.25 0 011.003-.53l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></Icon>;
// FIX: Add optional title prop.
export const DocumentPlusIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></Icon>;
// FIX: Add optional title prop.
export const CreditCardIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg></Icon>;
// FIX: Add optional title prop.
export const BuildingOfficeIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6M9 20.25h6M4.5 6.75h.75v.75H4.5v-.75zm.75 2.25h-.75v.75h.75v-.75zm-.75 2.25h.75v.75H4.5v-.75zm.75 2.25h-.75v.75h.75v-.75zm-.75 2.25h.75v.75H4.5v-.75zM18 6.75h.75v.75h-.75v-.75zm.75 2.25h-.75v.75h.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h-.75v.75h.75v-.75zm-.75 2.25h.75v.75h-.75v-.75z" /></svg></Icon>;
// FIX: Add optional title prop.
export const DocumentArrowDownIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></Icon>;
export const ArrowDownTrayIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></Icon>;


// Icons for Video Call & Voice Notes
// FIX: Add optional title prop.
export const VideoCameraIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg></Icon>;
// FIX: Add optional title prop.
export const PhoneXMarkIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15" /></svg></Icon>;
// FIX: Add optional title prop.
export const MicrophoneIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 5.25v-1.5m-6-6v-1.5m-6 7.5v-1.5m6-6h.008v.008H12v-.008zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg></Icon>;
// FIX: Add optional title prop.
export const StopIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></svg></Icon>;
// FIX: Add optional title prop.
export const PaperAirplaneIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></Icon>;
// FIX: Add optional title prop.
export const PlayIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg></Icon>;
// FIX: Add optional title prop.
export const PauseIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg></Icon>;
// FIX: Add optional title prop.
export const TrashIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></Icon>;
// FIX: Add optional title prop.
export const ShieldCheckIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg></Icon>;
// FIX: Add optional title prop.
export const SearchIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></Icon>;
// FIX: Add optional title prop.
export const XCircleIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
// New Icons for Profile & Marketplace
export const UserCircleIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg></Icon>;
export const ShoppingCartIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.838-5.513c.245-.737-.248-1.503-1.087-1.503H5.25" /></svg></Icon>;
export const TicketIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m0 0H3m9 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon>;
export const ChatBubbleOvalLeftEllipsisIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.455.09-.934.09-1.425v-2.909A9.75 9.75 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg></Icon>;
// New Icons for Event/Booking
export const GlobeAltIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.432 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m15.432 0L12 10.5" /></svg></Icon>;
export const MapPinIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></Icon>;
export const SparklesIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.5z" /></svg></Icon>;
// New Icons for Library
export const LightBulbIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 17.64 2.25 14.434 2.25 10.5 2.25 6.25 6.25 2.25 10.5 2.25c4.25 0 8.25 4 8.25 8.25 0 3.934-2.258 7.14-5.25 8.25z" /></svg></Icon>;
// Fix: Explicitly type StarIcon as a React.FC to allow the 'key' prop when used in lists.
export const StarIcon: React.FC<{ className?: string, title?: string }> = ({ className = 'w-6 h-6', title }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg></Icon>;
// New icons for responsiveness
export const MenuIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></Icon>;
export const ArrowLeftIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg></Icon>;
// New icons for chat settings
export const LockClosedIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></Icon>;
export const LockOpenIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 18.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></Icon>;
export const PaperClipIcon = ({ className = 'w-6 h-6', title }: { className?: string, title?: string }) => <Icon className={className} title={title}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" /></svg></Icon>;


// Data constants
export const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
];

export const LEVELS = [100, 200, 300, 400, 500];

// Mock Data
export const MOCK_USERS: User[] = [
  { id: 'stud1', name: 'Alice Johnson', email: 'alice@test.com', password: 'password', role: UserRole.STUDENT, department: 'Computer Science', level: 300, isVerifiedSeller: true, sellerApplicationStatus: 'approved', profilePicture: undefined },
  { id: 'stud2', name: 'Bob Williams', email: 'bob@test.com', password: 'password', role: UserRole.STUDENT, department: 'Computer Science', level: 300, isVerifiedSeller: false, sellerApplicationStatus: 'pending', profilePicture: undefined },
  { id: 'stud3', name: 'Charlie Brown', email: 'charlie@test.com', password: 'password', role: UserRole.STUDENT, department: 'Electrical Engineering', level: 200, isVerifiedSeller: false, sellerApplicationStatus: 'none', profilePicture: undefined },
  { id: 'teach1', name: 'Prof. Davis', email: 'davis@test.com', password: 'password', role: UserRole.TEACHER, department: 'Computer Science', level: 0, isVerifiedSeller: true, sellerApplicationStatus: 'approved', profilePicture: undefined },
  { id: 'teach2', name: 'Dr. Miller', email: 'miller@test.com', password: 'password', role: UserRole.TEACHER, department: 'Electrical Engineering', level: 0, isVerifiedSeller: false, sellerApplicationStatus: 'none', profilePicture: undefined },
  { id: 'staff1', name: 'ICT Admin', email: 'admin@test.com', password: 'password', role: UserRole.ICT_STAFF, department: 'ICT', level: 0, isVerifiedSeller: false, sellerApplicationStatus: 'none', profilePicture: undefined },
  { id: 'visitor1', name: 'Guest User', email: 'visitor@test.com', password: 'password', role: UserRole.VISITOR, department: 'N/A', level: 0, isVerifiedSeller: false, sellerApplicationStatus: 'none', profilePicture: undefined },
];

export const MOCK_CHAT_GROUPS: ChatGroup[] = [
    { id: 'group1', name: 'General Announcements', adminIds: ['staff1'], isLocked: false },
    { id: 'group2', name: 'CS 300 Level', department: 'Computer Science', level: 300, adminIds: ['teach1'], isLocked: false },
    { id: 'group3', name: 'EE 200 Level', department: 'Electrical Engineering', level: 200, adminIds: ['teach2'], isLocked: false },
    { id: 'group-evt-1', name: 'CS Tech Talk Q&A - Event Group', adminIds: ['teach1'], isEventGroup: true, eventId: 'e-1', isLocked: true },
    { id: 'group-evt-2', name: 'End of Semester Party - Event Group', adminIds: ['stud1'], isEventGroup: true, eventId: 'e-2', isLocked: false },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg1', groupId: 'group2', senderId: 'teach1', senderName: 'Prof. Davis', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), type: 'text', text: 'Reminder: The midterm project proposal is due this Friday.'},
    { id: 'msg2', groupId: 'group2', senderId: 'stud1', senderName: 'Alice Johnson', timestamp: new Date(Date.now() - 60000 * 4).toISOString(), type: 'text', text: 'Thanks for the reminder, Professor!'},
];

export const MOCK_COURSES: Course[] = [
    { id: 'cs301', code: 'CS 301', title: 'Data Structures', description: 'Fundamental data structures and algorithms.', department: 'Computer Science', level: 300, credits: 3 },
    { id: 'cs302', code: 'CS 302', title: 'Operating Systems', description: 'Core concepts of modern operating systems.', department: 'Computer Science', level: 300, credits: 3 },
    { id: 'ee201', code: 'EE 201', title: 'Circuit Analysis', description: 'Analysis of analog electronic circuits.', department: 'Electrical Engineering', level: 200, credits: 4 },
];

export const MOCK_FEE_STATEMENTS: FeeStatement[] = [
    {
        id: 'fee-stud1',
        studentId: 'stud1',
        session: '2023-2024',
        items: [
            { id: 'item1', description: 'Tuition Fee', amount: 1500 },
            { id: 'item2', description: 'Lab Fee', amount: 150 },
            { id: 'item3', description: 'Library Fee', amount: 50 },
        ],
        totalAmount: 1700,
        amountPaid: 1000,
        status: 'Partially Paid'
    },
     {
        id: 'fee-stud3',
        studentId: 'stud3',
        session: '2023-2024',
        items: [
            { id: 'item1', description: 'Tuition Fee', amount: 1500 },
            { id: 'item3', description: 'Library Fee', amount: 50 },
        ],
        totalAmount: 1550,
        amountPaid: 1550,
        status: 'Paid'
    }
];

export const MOCK_HOSTELS: Hostel[] = [
    {
        id: 'hostel1',
        name: 'Unity Hall (School Hostel)',
        ownerId: 'school',
        status: 'Approved',
        location: 'On-Campus',
        address: '1 University Road',
        description: 'A modern on-campus residence hall with excellent facilities and a vibrant student community. Close to the library and engineering faculty.',
        images: ['https://via.placeholder.com/400x250.png?text=Unity+Hall+Exterior'],
        amenities: ['WiFi', '24/7 Security', 'Study Lounge', 'Laundry Service', 'Common Kitchenette'],
        rules: 'No smoking, quiet hours after 11 PM, visitors allowed until 10 PM.',
        contactPerson: 'Mr. John Doe',
        contactPhone: '123-456-7890',
    },
    {
        id: 'hostel2',
        name: 'Pioneer Suites (Private)',
        ownerId: 'landlord1',
        status: 'Approved',
        location: 'Off-Campus',
        address: '25 Student Way, City Center',
        description: 'Premium off-campus apartments located just a 10-minute walk from the main gate. Offers more independence and private space.',
        images: ['https://via.placeholder.com/400x250.png?text=Pioneer+Suites'],
        amenities: ['High-speed WiFi', 'AC', 'Private Bathroom', 'Kitchenette', 'Gym Access'],
        rules: 'Lease agreement required. Rent due on the 1st of each month.',
        contactPerson: 'Campus Living Services',
        contactPhone: '987-654-3210',
    },
    {
        id: 'hostel3',
        name: 'Student Haven',
        ownerId: 'stud2', // A student can also be a landlord
        status: 'Pending',
        location: 'Off-Campus',
        address: '50 Education Avenue',
        description: 'A cozy shared house with a friendly atmosphere, perfect for students looking for affordable accommodation.',
        images: ['https://via.placeholder.com/400x250.png?text=Student+Haven'],
        amenities: ['WiFi', 'Shared Kitchen', 'Garden'],
        rules: 'Clean up after yourself. Be respectful of housemates.',
        contactPerson: 'Bob Williams',
        contactPhone: '555-123-4567',
    }
];

export const MOCK_ROOMS: Room[] = [
    // Unity Hall Rooms
    { id: 'room101', hostelId: 'hostel1', roomNumber: 'A101', type: 'Double', pricing: [{duration: 'Full Session', price: 800}, {duration: 'Semester', price: 450}], isAvailable: true },
    { id: 'room102', hostelId: 'hostel1', roomNumber: 'A102', type: 'Double', pricing: [{duration: 'Full Session', price: 800}, {duration: 'Semester', price: 450}], isAvailable: true },
    { id: 'room103', hostelId: 'hostel1', roomNumber: 'B205', type: 'Quad', pricing: [{duration: 'Full Session', price: 500}], isAvailable: false },
    // Pioneer Suites Rooms
    { id: 'room201', hostelId: 'hostel2', roomNumber: 'Suite 1A', type: 'Single', pricing: [{duration: 'Full Session', price: 1200}], isAvailable: true },
    { id: 'room202', hostelId: 'hostel2', roomNumber: 'Suite 1B', type: 'Single', pricing: [{duration: 'Full Session', price: 1200}], isAvailable: true },
];

export const MOCK_WALLETS: UserWallet[] = [
    { id: 'stud1', userId: 'stud1', balance: 50.00 },
    { id: 'stud2', userId: 'stud2', balance: 250.00 },
    { id: 'stud3', userId: 'stud3', balance: 1200.00 },
];

const MOCK_EXAM_QUESTIONS: ObjectiveQuestion[] = [
    { id: 'q1', questionText: 'What is 2+2?', options: ['3', '4', '5'], correctAnswerIndex: 1 },
    { id: 'q2', questionText: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris'], correctAnswerIndex: 2 }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam1',
    title: 'CS301 Midterm Exam',
    description: 'Covers topics from week 1 to 6.',
    type: AssignmentType.OBJECTIVE,
    questions: MOCK_EXAM_QUESTIONS,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    creatorId: 'teach1',
    creatorName: 'Prof. Davis',
    targetDepartments: ['Computer Science'],
    targetLevels: [300],
    totalMarks: 100,
    retakePolicy: {
      allowed: true,
      maxAttempts: 2,
      passingGradePercentage: 50,
    },
    shuffleQuestions: true,
  },
  {
    id: 'exam2',
    title: 'EE201 Final Exam',
    description: 'Comprehensive final examination.',
    type: AssignmentType.OBJECTIVE,
    questions: MOCK_EXAM_QUESTIONS,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    creatorId: 'teach2',
    creatorName: 'Dr. Miller',
    targetDepartments: ['Electrical Engineering'],
    targetLevels: [200],
    totalMarks: 100,
    retakePolicy: {
      allowed: false,
      maxAttempts: 1,
      passingGradePercentage: 40,
    },
    shuffleQuestions: false,
  }
];

export const MOCK_EXAM_SUBMISSIONS: ExamSubmission[] = [
    {
        id: 'exsub1',
        examId: 'exam2',
        studentId: 'stud3',
        studentName: 'Charlie Brown',
        startedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        answers: [0, 1],
        grade: 0,
        attemptNumber: 1,
    },
    {
        id: 'exsub2',
        examId: 'exam1',
        studentId: 'stud1',
        studentName: 'Alice Johnson',
        startedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
        answers: [1, 1],
        grade: 50, // Below 50% is 49, so let's make it 45 for testing
        attemptNumber: 1,
    }
];

// Correcting the grade for student 1 to be a failing grade
MOCK_EXAM_SUBMISSIONS[1].grade = 45;

export const MOCK_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
    { id: 'm-1', sellerId: 'teach1', sellerName: 'Prof. Davis', title: 'Used Data Structures Textbook', description: 'Slightly used, 4th edition. Perfect for CS301.', price: 45.00, category: 'Books', image: 'https://via.placeholder.com/300x200.png?text=Textbook', condition: 'Used - Good', createdAt: new Date().toISOString(), isAvailable: true },
    { id: 'm-2', sellerId: 'stud1', sellerName: 'Alice Johnson', title: 'Scientific Calculator', description: 'Barely used Casio scientific calculator. Works perfectly.', price: 15.00, category: 'Electronics', image: 'https://via.placeholder.com/300x200.png?text=Calculator', condition: 'Used - Like New', createdAt: new Date().toISOString(), isAvailable: true },
];

export const MOCK_EVENTS: Event[] = [
    { 
        id: 'e-1', 
        title: 'CS Tech Talk Q&A', 
        description: 'Join a live Q&A session with industry experts on the future of AI. The chat will be locked for messages until the day of the event.', 
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
        type: 'Online',
        creatorId: 'teach1',
        creatorName: 'Prof. Davis',
        hosts: ['teach1'],
        chatGroupId: 'group-evt-1',
        videoLink: 'https://meet.google.com/xyz-abc-pqr'
    },
    { 
        id: 'e-2', 
        title: 'End of Semester Party', 
        description: 'Celebrate the end of exams with music, food, and fun at the main campus auditorium.', 
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
        type: 'Physical',
        creatorId: 'stud1',
        creatorName: 'Alice Johnson',
        hosts: ['stud1'],
        location: 'Main Campus Auditorium',
        ticketPrice: 20,
        chatGroupId: 'group-evt-2',
    },
];

export const MOCK_REGISTERED_SERVICES: RegisteredService[] = [
    { id: 'serv-1', providerId: 'stud2', providerName: 'Bob Williams', serviceName: 'Event Ride Service', description: 'Safe and reliable rides to and from the event venue.', price: 10, category: 'Ride', status: 'Approved' },
    { id: 'serv-2', providerId: 'landlord1', providerName: 'Campus Foods', serviceName: 'Event Catering Pack', description: 'Pre-order a meal pack with a burger, fries, and a drink.', price: 15, category: 'Food', status: 'Approved' },
    { id: 'serv-3', providerId: 'stud3', providerName: 'Charlie Brown', serviceName: 'Event Transport', description: 'I can drive up to 3 people.', price: 8, category: 'Ride', status: 'Pending' },
];

export const MOCK_TICKET_PURCHASES: EventTicketPurchase[] = [];

export const MOCK_BOOK_REVIEWS: BookReview[] = [
    { id: 'rev-1', bookId: 'book-1', userId: 'stud2', userName: 'Bob Williams', rating: 5, comment: "This book is a must-have for any CS student. The explanations are clear and the examples are very helpful.", createdAt: new Date().toISOString() },
    { id: 'rev-2', bookId: 'book-1', userId: 'stud3', userName: 'Charlie Brown', rating: 4, comment: "A bit dense, but incredibly thorough. Great reference book.", createdAt: new Date().toISOString() },
];

export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
    {
        id: 'book-1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        description: 'The bible of algorithms. A comprehensive textbook covering a broad range of algorithms in depth.',
        category: 'Computer Science',
        coverImage: 'https://via.placeholder.com/300x400.png?text=Intro+to+Algorithms',
        content: `Chapter 1: The Role of Algorithms in Computing... [Content for Page 1]\n\nPAGE_BREAK\n\n...an algorithm is any well-defined computational procedure... [Content for Page 2]\n\nPAGE_BREAK\n\n...This book provides a comprehensive introduction to the modern study of computer algorithms... [Content for Page 3]`,
        uploaderId: 'staff1',
        uploadedAt: new Date().toISOString(),
        ratings: [5, 4],
        reviews: MOCK_BOOK_REVIEWS,
    },
    {
        id: 'book-2',
        title: 'Operating System Concepts',
        author: 'Abraham Silberschatz',
        description: 'A classic text on operating systems, explaining core concepts with practical examples.',
        category: 'Computer Science',
        coverImage: 'https://via.placeholder.com/300x400.png?text=OS+Concepts',
        content: 'An operating system is a program that manages a computer’s hardware... [Page 1]\n\nPAGE_BREAK\n\nIt also provides a basis for application programs and acts as an intermediary... [Page 2]',
        uploaderId: 'teach1',
        uploadedAt: new Date().toISOString(),
        ratings: [],
        reviews: [],
    }
];

export const MOCK_BOOK_REQUESTS: BookRequest[] = [
    { id: 'req-1', userId: 'stud1', userName: 'Alice Johnson', title: 'The Pragmatic Programmer', author: 'David Thomas', reason: 'Heard it is a great book for software engineering principles.', status: 'Pending', requestedAt: new Date().toISOString() },
    { id: 'req-2', userId: 'stud3', userName: 'Charlie Brown', title: 'Clean Code', author: 'Robert C. Martin', reason: 'I want to learn how to write better, more maintainable code for my projects.', status: 'Acquired', requestedAt: new Date().toISOString() },
];
