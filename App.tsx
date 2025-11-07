

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, UserRole, Assignment, Submission, Exam, ExamSubmission, AssignmentType, AssignmentPriority, ChatGroup, ChatMessage, AttendanceRecord, Course, CourseRegistration, FeeStatement, PaymentRecord, Hostel, Room, AccommodationApplication, CourseMaterial, UserWallet, WalletTransaction, MarketplaceListing, MarketplaceOrder, Event, EventRegistration, RegisteredService, ServiceBooking, LibraryBook, ReadingProgress, VisitorPayment, BookRequest, BookReview, EventTicketPurchase } from './types';
import * as api from './api/mockApi';
import {
    HomeIcon, ClipboardListIcon, AcademicCapIcon, UserGroupIcon, LogoutIcon,
    PlusCircleIcon, BookOpenIcon, XIcon, CheckCircleIcon, PencilIcon, ClockIcon,
    ChatBubbleLeftRightIcon, CalendarDaysIcon, Cog6ToothIcon, DocumentPlusIcon,
    CreditCardIcon, SearchIcon, TrashIcon, BuildingOfficeIcon, DocumentArrowDownIcon,
    UserCircleIcon, ShoppingCartIcon, MenuIcon, WrenchScrewdriverIcon
} from './constants';
import { AssignmentCreator } from './components/AssignmentCreator';
import { AssignmentTaker } from './components/AssignmentTaker';
import { ExamCreator } from './components/ExamCreator';
import { ExamTaker } from './components/ExamTaker';
import { ViewSubmissions } from './components/ViewSubmissions';
import { GradeSubmission } from './components/GradeSubmission';
import { GradesView } from './components/GradesView';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ChatView } from './components/ChatView';
import { AttendanceView } from './components/AttendanceView';
import { StaffPortal } from './components/StaffPortal';
import { CourseRegistrationView } from './components/CourseRegistrationView';
import { PaymentPortal } from './components/PaymentPortal';
import { PaymentCheckout } from './components/PaymentCheckout';
import { VideoCallView } from './components/VideoCallView';
import { UserCreator } from './components/UserCreator';
import { ManageChatAdmins } from './components/ManageChatAdmins';
import { AccommodationView } from './components/AccommodationView';
import { CourseMaterialsView } from './components/CourseMaterialsView';
import { MaterialUploader } from './components/MaterialUploader';
import { HostelRegistrationForm } from './components/HostelRegistrationForm';
import { ProfileView } from './components/ProfileView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProductListingForm } from './components/ProductListingForm';
import { EventPortalView } from './components/EventBookingPortal';
import { EventCreator } from './components/EventCreator';
import { ServiceRegistrationForm } from './components/ServiceRegistrationForm';
import { EventDetailsView } from './components/EventDetailsView';
import { LibraryView } from './components/LibraryView';
import { BookUploader } from './components/BookUploader';
import { BookReader } from './components/BookReader';
import { BookRequestForm } from './components/BookRequestForm';
import { BookRequestManager } from './components/BookRequestManager';
import { ChatSettingsModal } from './components/ChatSettingsModal';
import { CourseCreator } from './components/CourseCreator';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ExamsView } from './components/ExamsView';


type PaymentDetails = {
    amount: number;
    description: string;
    type: 'payment' | 'deposit';
    metadata?: any; // To store extra info like roomId, duration, listingId
}

// Helper components
const Navbar: React.FC<{ user: User; onLogout: () => void; activeView: string; setActiveView: (view: string) => void; onToggleSidebar: () => void; }> = ({ user, onLogout, activeView, setActiveView, onToggleSidebar }) => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 mr-2">
                <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 capitalize">{activeView.replace(/-/g, ' ')}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
                 <button onClick={() => setActiveView('profile')} className="font-semibold text-slate-800 hover:text-primary-600 transition-colors">{user.name}</button>
                <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button onClick={onLogout} title="Logout" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors">
                <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
    </header>
);

const Sidebar: React.FC<{ role: UserRole; activeView: string; setActiveView: (view: string) => void; assignmentsDueSoonCount?: number; }> = ({ role, activeView, setActiveView, assignmentsDueSoonCount }) => {
    
    const baseNav = [
        { icon: HomeIcon, label: 'Dashboard' },
        { icon: BookOpenIcon, label: 'Library' },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat' },
        { icon: CalendarDaysIcon, label: 'Events' },
        { icon: ShoppingCartIcon, label: 'Marketplace' },
    ];
    
    let roleNav;
    switch (role) {
        case UserRole.TEACHER:
            roleNav = [
                { icon: ClipboardListIcon, label: 'Assignments' },
                { icon: BookOpenIcon, label: 'Exams' },
                { icon: DocumentPlusIcon, label: 'Course Registration' },
                { icon: DocumentArrowDownIcon, label: 'Course Materials' },
                { icon: CalendarDaysIcon, label: 'Attendance' },
            ];
            break;
        case UserRole.STUDENT:
            roleNav = [
                { icon: ClipboardListIcon, label: 'Assignments' },
                { icon: BookOpenIcon, label: 'Exams' },
                { icon: AcademicCapIcon, label: 'Grades' },
                { icon: DocumentPlusIcon, label: 'Course Registration' },
                { icon: DocumentArrowDownIcon, label: 'Course Materials' },
                { icon: BuildingOfficeIcon, label: 'Accommodation' },
            ];
            break;
        case UserRole.ICT_STAFF:
             roleNav = [
                { icon: DocumentPlusIcon, label: 'Course Registration' },
                { icon: Cog6ToothIcon, label: 'Staff Portal'}
             ];
             break;
        case UserRole.VISITOR:
            roleNav = [
                 { icon: BuildingOfficeIcon, label: 'Accommodation' },
            ];
            break;
        default:
            roleNav = [];
    }
    
    const userSpecificNav = [
        { icon: CreditCardIcon, label: 'Payment Portal' },
    ]

    const navItems = role === UserRole.VISITOR 
        ? [...baseNav.filter(i => i.label !== 'Dashboard'), ...roleNav, ...userSpecificNav]
        : [...baseNav, ...roleNav, ...userSpecificNav];


    return (
        <>
            <div className="flex items-center space-x-2 mb-10 shrink-0">
                <AcademicCapIcon className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold">CampusConnect</span>
            </div>
            <nav className="flex-grow overflow-y-auto">
                {navItems.map(item => (
                    <button
                        key={item.label}
                        onClick={() => setActiveView(item.label.toLowerCase().replace(/ /g, '-'))}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors mb-2 ${activeView === item.label.toLowerCase().replace(/ /g, '-') ? 'bg-primary-600 text-white' : 'hover:bg-slate-700'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span>{item.label}</span>
                         {item.label === 'Assignments' && assignmentsDueSoonCount && assignmentsDueSoonCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {assignmentsDueSoonCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </>
    );
};

const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) return <span className="text-red-500">Overdue</span>;
    if (diffDays === 0) return <span className="text-yellow-500">Due today</span>;
    if (diffDays === 1) return <span className="text-green-600">Due tomorrow</span>;
    return <span className="text-green-600">Due in {diffDays} days</span>;
};

const PriorityBadge: React.FC<{priority: AssignmentPriority}> = ({priority}) => {
    const colors = {
        [AssignmentPriority.LOW]: 'bg-green-100 text-green-800',
        [AssignmentPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
        [AssignmentPriority.HIGH]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[priority]}`}>{priority}</span>
}

const FullScreenLoader: React.FC<{ message?: string }> = ({ message = "Loading CampusConnect..." }) => (
    <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="text-center">
            <AcademicCapIcon className="w-16 h-16 mx-auto text-primary-600 animate-pulse" />
            <p className="mt-4 text-lg font-semibold text-slate-700">{message}</p>
        </div>
    </div>
);

// Helper component for dashboard stats
const StatCard: React.FC<{ icon: React.FC<{className?: string}>; label: string; value: string | number; onClick?: () => void; }> = ({ icon: Icon, label, value, onClick }) => (
    <button 
        onClick={onClick} 
        disabled={!onClick}
        className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg hover:scale-105 transition-transform disabled:hover:scale-100 disabled:cursor-default text-left"
    >
        <div className="p-3 bg-primary-100 rounded-full"><Icon className="w-8 h-8 text-primary-600"/></div>
        <div>
            <p className="text-slate-500">{label}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    </button>
);

// Main App Component
export default function App() {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');
    const [authError, setAuthError] = useState<string | null>(null);

    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [examSubmissions, setExamSubmissions] = useState<ExamSubmission[]>([]);
    const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistration[]>([]);
    const [feeStatements, setFeeStatements] = useState<FeeStatement[]>([]);
    const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [accommodationApplications, setAccommodationApplications] = useState<AccommodationApplication[]>([]);
    const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
    const [wallets, setWallets] = useState<UserWallet[]>([]);
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
    const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
    const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
    const [eventTicketPurchases, setEventTicketPurchases] = useState<EventTicketPurchase[]>([]);
    const [registeredServices, setRegisteredServices] = useState<RegisteredService[]>([]);
    const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
    const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>([]);
    const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
    const [visitorPayments, setVisitorPayments] = useState<VisitorPayment[]>([]);
    const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
    const [bookReviews, setBookReviews] = useState<BookReview[]>([]);

    // UI State
    const [activeView, setActiveView] = useState('dashboard');
    const [modal, setModal] = useState<{ type: string | null; data?: any }>({ type: null });
    const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');
    const [assignmentDateFilter, setAssignmentDateFilter] = useState('all');
    const [paymentModalData, setPaymentModalData] = useState<PaymentDetails | null>(null);
    const [serviceBookingModalData, setServiceBookingModalData] = useState<RegisteredService | null>(null);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [isUserCreatorOpen, setIsUserCreatorOpen] = useState(false);
    const [manageAdminsModalGroup, setManageAdminsModalGroup] = useState<ChatGroup | null>(null);
    const [manageChatSettingsModalGroup, setManageChatSettingsModalGroup] = useState<ChatGroup | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // State for contextual navigation
    const [initialActiveGroupId, setInitialActiveGroupId] = useState<string | null>(null);
    const [initialMarketplaceSearch, setInitialMarketplaceSearch] = useState('');
    const [initialEventSearch, setInitialEventSearch] = useState('');
    const [initialEventTab, setInitialEventTab] = useState<'browse-events' | 'browse-services'>('browse-events');


    // Initial load: check if user is logged in
    useEffect(() => {
        const checkUserSession = async () => {
            setIsLoading(true);
            const user = await api.getCurrentUser();
            setCurrentUser(user);
            setIsLoading(false);
        };
        checkUserSession();
    }, []);

    // Data fetching when user logs in
    useEffect(() => {
        if (currentUser) {
            const loadAllData = async () => {
                setIsLoading(true);
                try {
                    const [
                        usersData, assignmentsData, submissionsData, examsData, examSubmissionsData,
                        chatGroupsData, chatMessagesData, attendanceData, coursesData,
                        registrationsData, feesData, paymentsData, hostelsData, roomsData, applicationsData,
                        materialsData, walletsData, transactionsData, listingsData, ordersData, eventsData,
                        eventRegsData, ticketPurchasesData, registeredServicesData, serviceBookingsData, libraryBooksData,
                        readingProgressData, visitorPaymentsData, bookRequestsData, bookReviewsData
                    ] = await Promise.all([
                        api.getUsers(), api.getAssignments(), api.getSubmissions(), api.getExams(), api.getExamSubmissions(),
                        api.getChatGroups(), api.getChatMessages(), api.getAttendanceRecords(), api.getCourses(),
                        api.getCourseRegistrations(), api.getFeeStatements(), api.getPaymentRecords(),
                        api.getHostels(), api.getRooms(), api.getAccommodationApplications(),
                        api.getCourseMaterials(), api.getWallets(), api.getWalletTransactions(),
                        api.getMarketplaceListings(), api.getMarketplaceOrders(), api.getEvents(),
                        api.getEventRegistrations(), api.getEventTicketPurchases(), api.getRegisteredServices(), api.getServiceBookings(),
                        api.getLibraryBooks(), api.getReadingProgress(), api.getVisitorPayments(),
                        api.getBookRequests(), api.getBookReviews(),
                    ]);
                    setUsers(usersData);
                    setAssignments(assignmentsData);
                    setSubmissions(submissionsData);
                    setExams(examsData);
                    setExamSubmissions(examSubmissionsData);
                    setChatGroups(chatGroupsData);
                    setChatMessages(chatMessagesData);
                    setAttendanceRecords(attendanceData);
                    setCourses(coursesData);
                    setCourseRegistrations(registrationsData);
                    setFeeStatements(feesData);
                    setPaymentRecords(paymentsData);
                    setHostels(hostelsData);
                    setRooms(roomsData);
                    setAccommodationApplications(applicationsData);
                    setCourseMaterials(materialsData);
                    setWallets(walletsData);
                    setWalletTransactions(transactionsData);
                    setMarketplaceListings(listingsData);
                    setMarketplaceOrders(ordersData);
                    setEvents(eventsData);
                    setEventRegistrations(eventRegsData);
                    setEventTicketPurchases(ticketPurchasesData);
                    setRegisteredServices(registeredServicesData);
                    setServiceBookings(serviceBookingsData);
                    setLibraryBooks(libraryBooksData);
                    setReadingProgress(readingProgressData);
                    setVisitorPayments(visitorPaymentsData);
                    setBookRequests(bookRequestsData);
                    setBookReviews(bookReviewsData);
                } catch (error) {
                    console.error("Failed to load app data:", error);
                    // Handle error, maybe show a toast notification
                } finally {
                    setIsLoading(false);
                }
            };
            loadAllData();
        }
    }, [currentUser]);

    // --- HANDLERS ---
    const handleSetActiveView = (view: string, context?: { groupId?: string }) => {
        if (context?.groupId) {
            setInitialActiveGroupId(context.groupId);
        } else {
            // Clear initial group if not navigating to chat, to prevent stale state
            if(view !== 'chat') setInitialActiveGroupId(null);
        }
        setActiveView(view);
    };

    const handleViewEventDetails = (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        if (event) {
            setModal({ type: 'view-event', data: event });
        }
    };

    const handleViewMarketplaceItem = (listingId: string) => {
        const listing = marketplaceListings.find(l => l.id === listingId);
        if (listing) {
            setInitialMarketplaceSearch(listing.title);
            setActiveView('marketplace');
        } else {
            setActiveView('marketplace');
        }
    };
    
    const handleViewService = (serviceId: string) => {
        const service = registeredServices.find(s => s.id === serviceId);
        if (service) {
            setInitialEventSearch(service.serviceName);
            setInitialEventTab('browse-services');
            setActiveView('events');
        } else {
            setActiveView('events');
        }
    };


    const handleLogin = async (email: string, password: string) => {
        setAuthError(null);
        try {
            const user = await api.login(email, password);
            setCurrentUser(user);
            setActiveView(user.role === UserRole.ICT_STAFF ? 'staff-portal' : (user.role === UserRole.VISITOR ? 'library' : 'dashboard'));
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    };

    const handleSignup = async (userData: Omit<User, 'id'>) => {
        setAuthError(null);
        try {
            const newUser = await api.signup(userData);
            setCurrentUser(newUser);
            setActiveView(newUser.role === UserRole.VISITOR ? 'library' : 'dashboard');
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    };

    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        setActiveView('dashboard');
        setAuthView('login');
    };

    const handleUpdateUser = async (updatedUser: User) => {
        const updated = await api.updateUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        if (currentUser?.id === updated.id) {
            setCurrentUser(updated);
            await api.login(updated.email, updated.password); // re-login to update session
        }
        return updated;
    };
    
    const handleCreateAssignment = async (newAssignment: Assignment) => {
        const created = await api.createAssignment(newAssignment);
        setAssignments(prev => [...prev, created]);
        setModal({ type: null });
    };
    
    const handleUpdateAssignment = async (updatedAssignment: Assignment) => {
        const updated = await api.updateAssignment(updatedAssignment);
        setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
        setModal({ type: null });
    };

    const handleSubmitAssignment = async (submission: Submission) => {
        const assignment = assignments.find(a => a.id === submission.assignmentId);
        let submissionWithGrade = { ...submission };
        if (assignment && assignment.type === AssignmentType.OBJECTIVE) {
            let correctAnswers = 0;
            const objectiveAnswers = submission.answers as number[];
            assignment.objectiveQuestions.forEach((q, i) => {
                if (objectiveAnswers[i] === q.correctAnswerIndex) correctAnswers++;
            });
            const marksPerQ = assignment.objectiveQuestions.length > 0 ? assignment.totalMarks / assignment.objectiveQuestions.length : 0;
            submissionWithGrade.grade = Math.round(correctAnswers * marksPerQ);
        }
        const created = await api.createSubmission(submissionWithGrade);
        setSubmissions(prev => [...prev, created]);
        setModal({ type: null });
    };
    
    const handleCreateExam = async (newExam: Exam) => {
        const created = await api.createExam(newExam);
        setExams(prev => [...prev, created]);
        setModal({ type: null });
    };

    const handleSubmitExam = async (submission: Omit<ExamSubmission, 'id' | 'grade'>) => {
        const submissionWithId: ExamSubmission = {
            ...submission,
            id: `sub-${Date.now()}`,
        };
    
        const exam = exams.find(e => e.id === submission.examId);
        let submissionWithGrade = { ...submissionWithId };
    
        if (exam && exam.type === AssignmentType.OBJECTIVE) {
            let correctAnswers = 0;
            exam.questions.forEach((q, i) => {
                // The student's answers need to be re-mapped to the original question index
                const studentAnswerForQ = submission.answers[i];
                if (studentAnswerForQ === q.correctAnswerIndex) {
                    correctAnswers++;
                }
            });
            const marksPerQ = exam.questions.length > 0 ? exam.totalMarks / exam.questions.length : 0;
            submissionWithGrade.grade = Math.round(correctAnswers * marksPerQ);
        }
    
        const created = await api.createExamSubmission(submissionWithGrade);
        setExamSubmissions(prev => [...prev, created]);
        setModal({ type: null });
    };
    
    const handleGradeSubmission = async (submissionId: string, grade: number, itemType: 'assignment' | 'exam') => {
        if (itemType === 'assignment') {
            const sub = submissions.find(s => s.id === submissionId);
            if(sub) {
                const updated = await api.updateSubmission({ ...sub, grade });
                setSubmissions(prev => prev.map(s => s.id === submissionId ? updated : s));
            }
        } else {
            const sub = examSubmissions.find(s => s.id === submissionId);
             if(sub) {
                const updated = await api.updateExamSubmission({ ...sub, grade });
                setExamSubmissions(prev => prev.map(s => s.id === submissionId ? updated : s));
            }
        }
        setModal({ type: 'view-submissions', data: { item: modal.data.item, itemType: modal.data.itemType } });
    };
    
    const handleSendMessage = async (groupId: string, content: { text?: string; audioData?: string; audioDuration?: number; imageData?: string; fileName?: string; }) => {
        if (!currentUser || (!content.text?.trim() && !content.audioData && !content.imageData)) return;

        let messageType: 'text' | 'voice-note' | 'image' = 'text';
        if (content.audioData) {
            messageType = 'voice-note';
        } else if (content.imageData) {
            messageType = 'image';
        }

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            groupId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: new Date().toISOString(),
            type: messageType,
            text: content.text || '',
            audioData: content.audioData,
            audioDuration: content.audioDuration,
            imageData: content.imageData,
            fileName: content.fileName,
        };
        const created = await api.createChatMessage(newMessage);
        setChatMessages(prev => [...prev, created]);
    };
    
    const handleDeleteMessage = async (messageId: string) => {
        if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            await api.deleteChatMessage(messageId);
            setChatMessages(prev => prev.filter(m => m.id !== messageId));
        }
    };

    const handleSaveAttendance = async (recordsToSave: { studentId: string, status: 'Present' | 'Absent' | 'Late' }[], date: string, courseId: string) => {
        if (!currentUser) return;
        const newRecords: AttendanceRecord[] = recordsToSave.map(r => ({
            id: `${r.studentId}-${courseId}-${date}`,
            studentId: r.studentId,
            courseId: courseId,
            date: date,
            status: r.status,
            markedById: currentUser.id,
        }));
        await api.saveAttendanceRecords(newRecords, date, courseId);
        const otherRecords = attendanceRecords.filter(r => r.date !== date || r.courseId !== courseId);
        setAttendanceRecords([...otherRecords, ...newRecords]);
    };

    const handleRegisterCourses = async (studentId: string, courseIds: string[]) => {
        const newRegistrations = courseIds.map(courseId => ({
            id: `${studentId}-${courseId}`,
            studentId,
            courseId,
            registeredAt: new Date().toISOString(),
        }));
        await api.saveCourseRegistrations(newRegistrations);
        setCourseRegistrations(prev => [...prev, ...newRegistrations]);
        alert('Courses registered successfully!');
    };
    
    const handleDeleteAssignment = async (assignmentId: string) => {
        if (window.confirm('Are you sure you want to delete this assignment and all its submissions?')) {
            await api.deleteAssignment(assignmentId);
            setAssignments(prev => prev.filter(a => a.id !== assignmentId));
            setSubmissions(prev => prev.filter(s => s.assignmentId !== assignmentId));
        }
    };

    const handleDeleteExam = async (examId: string) => {
        if (window.confirm('Are you sure you want to delete this exam and all its submissions?')) {
            await api.deleteExam(examId);
            setExams(prev => prev.filter(e => e.id !== examId));
            setExamSubmissions(prev => prev.filter(s => s.examId !== examId));
        }
    };

    const handleDeleteUser = async (userId: string) => {
         if (userId === currentUser?.id) { alert("You cannot delete your own account."); return; }
        if (window.confirm('Are you sure?')) {
            await api.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const handleCreateUserByAdmin = async (userData: Omit<User, 'id'>) => {
        const newUser: User = { ...userData, id: `user-${Date.now()}` };
        try {
            const created = await api.createUser(newUser);
            setUsers(prev => [...prev, created]);
            setIsUserCreatorOpen(false);
            return true;
        } catch (error) {
            alert("Failed to create user. Email may already exist.");
            return false;
        }
    };
    
    const handleUpdateChatAdmins = async (groupId: string, adminIds: string[]) => {
        const group = chatGroups.find(g => g.id === groupId);
        if (group) {
            const updated = await api.updateChatGroup({ ...group, adminIds });
            setChatGroups(prev => prev.map(g => g.id === groupId ? updated : g));
            setManageAdminsModalGroup(null);
        }
    };

    const handleUpdateChatLock = async (groupId: string, isLocked: boolean) => {
        const group = chatGroups.find(g => g.id === groupId);
        if (group) {
            const updated = await api.updateChatGroup({ ...group, isLocked });
            setChatGroups(prev => prev.map(g => g.id === groupId ? updated : g));
            setManageChatSettingsModalGroup(null);
        }
    };
    
    const handleUploadMaterial = async (material: Omit<CourseMaterial, 'id' | 'uploaderId' | 'uploadedAt' | 'fileName' | 'fileType' | 'fileData'>, file: File) => {
        if (!currentUser) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileData = (e.target?.result as string).split(',')[1];
            const newMaterial: CourseMaterial = {
                ...material,
                id: `mat-${Date.now()}`,
                uploaderId: currentUser.id,
                uploadedAt: new Date().toISOString(),
                fileName: file.name,
                fileType: file.type,
                fileData,
            };
            const created = await api.createCourseMaterial(newMaterial);
            setCourseMaterials(prev => [...prev, created]);
            setModal({ type: null });
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteMaterial = async (materialId: string) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            await api.deleteCourseMaterial(materialId);
            setCourseMaterials(prev => prev.filter(m => m.id !== materialId));
        }
    };
    
    const handleRegisterHostel = async (hostelData: Omit<Hostel, 'id' | 'ownerId' | 'status'>) => {
        if (!currentUser) return;
        const newHostel: Hostel = {
            ...hostelData,
            id: `hostel-${Date.now()}`,
            ownerId: currentUser.id,
            status: 'Pending',
        };
        const created = await api.createHostel(newHostel);
        setHostels(prev => [...prev, created]);
        setModal({ type: null });
        alert('Hostel submitted for review!');
    };
    
    const handleUpdateHostelStatus = async (hostelId: string, status: 'Approved' | 'Rejected') => {
        const hostel = hostels.find(h => h.id === hostelId);
        if (hostel) {
            const updated = await api.updateHostel({ ...hostel, status });
            setHostels(prev => prev.map(h => h.id === hostelId ? updated : h));
        }
    };

    const handleInitiateBooking = (room: Room, duration: string, price: number) => {
        const hostel = hostels.find(h => h.id === room.hostelId);
        setPaymentModalData({
            amount: price,
            description: `Booking for ${room.type} Room (${room.roomNumber}) for ${duration}`,
            type: 'payment',
            metadata: { 
                paymentType: 'accommodation', 
                roomId: room.id, 
                hostelId: room.hostelId, 
                duration,
                hostelName: hostel?.name,
                roomNumber: room.roomNumber,
                roomType: room.type,
             }
        });
    };

    const handleInitiateDeposit = (amount: number) => {
        setPaymentModalData({
            amount,
            description: `Deposit to your wallet`,
            type: 'deposit',
        });
    };

    const handleInitiateMarketplacePayment = (listing: MarketplaceListing) => {
        setPaymentModalData({
            amount: listing.price,
            description: `Purchase: ${listing.title}`,
            type: 'payment',
            metadata: { 
                paymentType: 'marketplace', 
                listingId: listing.id,
                listingTitle: listing.title,
                sellerName: listing.sellerName,
                sellerId: listing.sellerId,
            }
        });
    };

    const handleInitiateTicketPurchase = (event: Event, quantity: number) => {
        if (!event.ticketPrice) return;
        setPaymentModalData({
            amount: event.ticketPrice * quantity,
            description: `Purchase ${quantity} ticket(s) for "${event.title}"`,
            type: 'payment',
            metadata: { 
                paymentType: 'event_ticket', 
                eventId: event.id, 
                quantity,
                eventTitle: event.title,
                pricePerTicket: event.ticketPrice
            }
        });
    };

    const handleInitiateVisitorPayment = () => {
        setPaymentModalData({
            amount: 10, // Hardcoded fee
            description: `One-time library access fee`,
            type: 'payment',
            metadata: { paymentType: 'visitor_library_fee' }
        });
    };

    const handleConfirmPayment = async (method: 'card' | 'wallet') => {
        if (!paymentModalData || !currentUser) return;

        const { amount, description, type, metadata } = paymentModalData;

        // Wallet logic
        if (method === 'wallet') {
            const wallet = wallets.find(w => w.userId === currentUser.id);
            if (!wallet || wallet.balance < amount) {
                alert("Insufficient wallet balance.");
                setPaymentModalData(null);
                return;
            }
            const updatedWallet: UserWallet = { ...wallet, balance: wallet.balance - amount };
            await api.updateWallet(updatedWallet);
            setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
        }

        // Transaction record
        const newTransaction: WalletTransaction = {
            id: `tx-${Date.now()}`,
            walletId: currentUser.id,
            type: type === 'deposit' ? 'deposit' : 'payment',
            amount,
            description,
            timestamp: new Date().toISOString(),
        };
        const createdTx = await api.createWalletTransaction(newTransaction);
        setWalletTransactions(prev => [...prev, createdTx]);
        
        // Handle metadata-specific logic
        if (metadata) {
            switch (metadata.paymentType) {
                case 'accommodation':
                    const newApplication: AccommodationApplication = {
                        id: `app-${Date.now()}`,
                        studentId: currentUser.id,
                        studentName: currentUser.name,
                        hostelId: metadata.hostelId,
                        roomId: metadata.roomId,
                        duration: metadata.duration,
                        amountPaid: amount,
                        bookedAt: new Date().toISOString(),
                    };
                    const createdApp = await api.createAccommodationApplication(newApplication);
                    setAccommodationApplications(prev => [...prev, createdApp]);
                    
                    const roomToUpdate = rooms.find(r => r.id === metadata.roomId);
                    if(roomToUpdate) {
                        const updatedRoom = await api.updateRoom({...roomToUpdate, isAvailable: false});
                        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
                    }
                    break;
                case 'marketplace':
                    const listing = marketplaceListings.find(l => l.id === metadata.listingId);
                    if (!listing) break;
                    
                    const newOrder: MarketplaceOrder = {
                        id: `order-${Date.now()}`,
                        buyerId: currentUser.id,
                        listingId: metadata.listingId,
                        listingTitle: metadata.listingTitle,
                        sellerId: metadata.sellerId,
                        sellerName: metadata.sellerName,
                        amount,
                        orderedAt: new Date().toISOString(),
                    };
                    const createdOrder = await api.createMarketplaceOrder(newOrder);
                    setMarketplaceOrders(prev => [...prev, createdOrder]);
                    
                    // Credit seller's wallet
                    const sellerWallet = wallets.find(w => w.userId === listing.sellerId);
                    if (sellerWallet) {
                        const updatedSellerWallet = { ...sellerWallet, balance: sellerWallet.balance + amount };
                        await api.updateWallet(updatedSellerWallet);
                        setWallets(prev => prev.map(w => w.id === updatedSellerWallet.id ? updatedSellerWallet : w));
                        
                        const creditTx: WalletTransaction = {
                            id: `tx-sale-${Date.now()}`,
                            walletId: listing.sellerId,
                            type: 'sale_credit',
                            amount,
                            description: `Sale: ${listing.title}`,
                            timestamp: new Date().toISOString(),
                        };
                        const createdCreditTx = await api.createWalletTransaction(creditTx);
                        setWalletTransactions(prev => [...prev, createdCreditTx]);
                    }

                    // Update listing quantity
                    const updatedListing = await api.updateMarketplaceListing({ ...listing, quantityAvailable: listing.quantityAvailable - 1, isAvailable: listing.quantityAvailable - 1 > 0 });
                    setMarketplaceListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));

                    break;
                case 'event_ticket':
                    const newPurchase: EventTicketPurchase = {
                        id: `ticket-${Date.now()}`,
                        eventId: metadata.eventId,
                        userId: currentUser.id,
                        userName: currentUser.name,
                        quantity: metadata.quantity,
                        amountPaid: amount,
                        purchasedAt: new Date().toISOString(),
                    };
                    const createdPurchase = await api.createEventTicketPurchase(newPurchase);
                    setEventTicketPurchases(prev => [...prev, createdPurchase]);
                    break;
                case 'visitor_library_fee':
                     const newVisitorPayment: VisitorPayment = {
                        id: `vp-${Date.now()}`,
                        visitorId: currentUser.id,
                        feeType: 'library_access',
                        amountPaid: amount,
                        paidAt: new Date().toISOString(),
                    };
                    const createdVP = await api.createVisitorPayment(newVisitorPayment);
                    setVisitorPayments(prev => [...prev, createdVP]);
                    break;
                case 'service_booking':
                    const newBooking: ServiceBooking = {
                        id: `book-${Date.now()}`,
                        eventId: metadata.eventId,
                        userId: currentUser.id,
                        serviceId: metadata.serviceId,
                        details: metadata.details,
                        amount: amount,
                        bookedAt: new Date().toISOString(),
                    };
                    const createdBooking = await api.createServiceBooking(newBooking);
                    setServiceBookings(prev => [...prev, createdBooking]);
                    break;
            }
        }
        
        // Finalize
        setPaymentModalData(null);
    };

    const handleCreateCourse = async (courseData: Omit<Course, 'id' | 'creatorId'>) => {
        if(!currentUser) return;
        const newCourse: Course = {
            ...courseData,
            id: `course-${Date.now()}`,
            creatorId: currentUser.id
        };
        const created = await api.createCourse(newCourse);
        setCourses(prev => [...prev, created]);
        setModal({ type: null });
    };

    const handleCreateBook = async (bookData: Omit<LibraryBook, 'id' | 'uploaderId' | 'uploadedAt' | 'ratings' | 'reviews'>) => {
        if (!currentUser) return;
        const newBook: LibraryBook = {
            ...bookData,
            id: `book-${Date.now()}`,
            uploaderId: currentUser.id,
            uploadedAt: new Date().toISOString(),
            ratings: [],
            reviews: [],
        };
        const created = await api.createLibraryBook(newBook);
        setLibraryBooks(prev => [...prev, created]);
        setModal({ type: null });
    };

    const handleUpdateReadingProgress = async (bookId: string, currentPage: number) => {
        if (!currentUser) return;
        const progress: ReadingProgress = {
            id: `${currentUser.id}-${bookId}`,
            userId: currentUser.id,
            bookId,
            currentPage,
            lastReadAt: new Date().toISOString(),
        };
        const updated = await api.updateReadingProgress(progress);
        setReadingProgress(prev => {
            const existing = prev.find(p => p.id === updated.id);
            if (existing) {
                return prev.map(p => p.id === updated.id ? updated : p);
            }
            return [...prev, updated];
        });
    };
    
    const handleCreateBookRequest = async (requestData: Omit<BookRequest, 'id' | 'userId' | 'userName' | 'status' | 'requestedAt'>) => {
        if (!currentUser) return;
        const newRequest: BookRequest = {
            ...requestData,
            id: `req-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            status: 'Pending',
            requestedAt: new Date().toISOString(),
        };
        const created = await api.createBookRequest(newRequest);
        setBookRequests(prev => [...prev, created]);
        setModal({ type: null });
    };

    const handleUpdateBookRequestStatus = async (requestId: string, status: BookRequest['status']) => {
        const request = bookRequests.find(r => r.id === requestId);
        if (request) {
            const updated = await api.updateBookRequest({ ...request, status });
            setBookRequests(prev => prev.map(r => r.id === requestId ? updated : r));
        }
    };

    const handleCreateReview = async (reviewData: Omit<BookReview, 'id'|'userId'|'userName'|'createdAt'>) => {
        if (!currentUser) return;
        const newReview: BookReview = {
            ...reviewData,
            id: `rev-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date().toISOString(),
        };
        const created = await api.createBookReview(newReview);
        setBookReviews(prev => [...prev, created]);
        // Update the book with the new review and rating
        const bookToUpdate = libraryBooks.find(b => b.id === reviewData.bookId);
        if (bookToUpdate) {
            const updatedBook: LibraryBook = {
                ...bookToUpdate,
                reviews: [...(bookToUpdate.reviews || []), created],
                ratings: [...(bookToUpdate.ratings || []), reviewData.rating],
            };
            const updated = await api.updateLibraryBook(updatedBook);
            setLibraryBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
            // update the book in the modal
            setModal({type: 'read-book', data: {book: updated, progress: modal.data.progress}});
        }
    };

    const handleCreateEvent = async (eventData: Omit<Event, 'id'|'creatorId'|'creatorName'|'chatGroupId'>, isChatLocked: boolean) => {
        if (!currentUser) return;
        const newEvent: Event = {
            ...eventData,
            id: `event-${Date.now()}`,
            creatorId: currentUser.id,
            creatorName: currentUser.name,
        };
        const created = await api.createEvent(newEvent, isChatLocked);
        setEvents(prev => [...prev, created]);
        // Refetch chat groups to include the new event group
        api.getChatGroups().then(setChatGroups);
        setModal({ type: null });
    };

    const handleRegisterForEvent = async (eventId: string) => {
        if (!currentUser) return;
        const newRegistration: EventRegistration = {
            id: `re-${Date.now()}`,
            eventId,
            userId: currentUser.id,
            registeredAt: new Date().toISOString(),
        };
        const created = await api.createEventRegistration(newRegistration);
        setEventRegistrations(prev => [...prev, created]);
        alert("Registered for event successfully!");
    };
    
    const handleRegisterService = async (serviceData: Omit<RegisteredService, 'id'|'providerId'|'providerName'|'status'>) => {
        if (!currentUser) return;
        const newService: RegisteredService = {
            ...serviceData,
            id: `serv-${Date.now()}`,
            providerId: currentUser.id,
            providerName: currentUser.name,
            status: 'Pending',
        };
        const created = await api.createRegisteredService(newService);
        setRegisteredServices(prev => [...prev, created]);
        setModal({ type: null });
        alert("Service submitted for review!");
    };
    
    const handleUpdateServiceStatus = async (serviceId: string, status: 'Approved' | 'Rejected') => {
        const service = registeredServices.find(s => s.id === serviceId);
        if (service) {
            const updated = await api.updateRegisteredService({ ...service, status });
            setRegisteredServices(prev => prev.map(s => s.id === serviceId ? updated : s));
        }
    };
    
    const handleBookService = (event: Event, service: RegisteredService, details: any) => {
        setPaymentModalData({
            amount: service.price * (details.quantity || 1),
            description: `Booking: ${service.serviceName} for "${event.title}"`,
            type: 'payment',
            metadata: { paymentType: 'service_booking', serviceId: service.id, eventId: event.id, details }
        });
    };

    const handleInitiateServiceBooking = (service: RegisteredService) => {
        setServiceBookingModalData(service);
    };

    const handleConfirmServiceBooking = (details: any, price: number) => {
        if (!serviceBookingModalData) return;
        setPaymentModalData({
            amount: price,
            description: `Booking: ${serviceBookingModalData.serviceName}`,
            type: 'payment',
            metadata: { 
                paymentType: 'service_booking', 
                serviceId: serviceBookingModalData.id, 
                details,
                serviceName: serviceBookingModalData.serviceName,
                providerName: serviceBookingModalData.providerName,
            }
        });
        setServiceBookingModalData(null);
    }

    // --- MEMOIZED VALUES ---
    const assignmentsDueSoonCount = useMemo(() => {
        if (!currentUser || currentUser.role !== UserRole.STUDENT) return 0;
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        return assignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            const isSubmitted = submissions.some(s => s.assignmentId === a.id && s.studentId === currentUser.id);
            return !isSubmitted && dueDate > now && dueDate < threeDaysFromNow;
        }).length;
    }, [currentUser, assignments, submissions]);
    
    const filteredStudentAssignments = useMemo(() => {
        if (!currentUser || currentUser.role !== UserRole.STUDENT) return [];
        let filtered = assignments.filter(a => 
            a.targetDepartments.includes(currentUser.department) &&
            a.targetLevels.includes(currentUser.level)
        );
        if (assignmentSearchTerm) {
            filtered = filtered.filter(a => a.title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()));
        }
        if (assignmentDateFilter !== 'all') {
            const now = new Date();
            if (assignmentDateFilter === 'today') {
                filtered = filtered.filter(a => new Date(a.dueDate).toDateString() === now.toDateString());
            } else if (assignmentDateFilter === 'this_week') {
                const endOfWeek = new Date(now);
                endOfWeek.setDate(now.getDate() + 7);
                filtered = filtered.filter(a => {
                    const dueDate = new Date(a.dueDate);
                    return dueDate >= now && dueDate <= endOfWeek;
                });
            } else if (assignmentDateFilter === 'overdue') {
                 filtered = filtered.filter(a => new Date(a.dueDate) < now && !submissions.some(s => s.assignmentId === a.id));
            }
        }
        return filtered;
    }, [currentUser, assignments, submissions, assignmentSearchTerm, assignmentDateFilter]);
    
    const teacherAssignments = useMemo(() => {
        if (!currentUser || currentUser.role !== UserRole.TEACHER) return [];
        return assignments.filter(a => a.creatorId === currentUser.id);
    }, [currentUser, assignments]);

    // Memoized values for dashboard
    const dashboardStats = useMemo(() => {
        if (!currentUser) return {};

        switch (currentUser.role) {
            case UserRole.STUDENT:
                const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);
                const studentAssignments = assignments.filter(a => 
                    a.targetDepartments.includes(currentUser.department) &&
                    a.targetLevels.includes(currentUser.level)
                );
                const pendingAssignments = studentAssignments.filter(a => !studentSubmissions.some(s => s.assignmentId === a.id) && new Date(a.dueDate) > new Date());

                const now = new Date();
                const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                const studentExams = exams.filter(e => 
                    e.targetDepartments.includes(currentUser.department) &&
                    e.targetLevels.includes(currentUser.level)
                );
                const upcomingExams = studentExams.filter(e => {
                    const startTime = new Date(e.startTime);
                    return startTime > now && startTime < sevenDaysFromNow;
                });
                
                const studentWallet = wallets.find(w => w.userId === currentUser.id);

                return {
                    pendingAssignments: pendingAssignments.length,
                    upcomingExams: upcomingExams.length,
                    gradedItems: submissions.filter(s => s.studentId === currentUser.id && s.grade !== undefined).length + examSubmissions.filter(s => s.studentId === currentUser.id && s.grade !== undefined).length,
                    walletBalance: studentWallet?.balance.toFixed(2) || '0.00'
                };
            
            case UserRole.TEACHER:
                const teacherAssignments = assignments.filter(a => a.creatorId === currentUser.id);
                const submissionsToGrade = submissions.filter(s => {
                    const assignment = teacherAssignments.find(a => a.id === s.assignmentId);
                    return assignment && s.grade === undefined && assignment.type === AssignmentType.THEORY;
                });
                
                const teacherExams = exams.filter(e => e.creatorId === currentUser.id);
                const activeExams = teacherExams.filter(e => new Date(e.startTime) < new Date() && new Date(e.endTime) > new Date());

                const teacherCourses = courses.filter(c => c.creatorId === currentUser.id);

                return {
                    submissionsToGrade: submissionsToGrade.length,
                    activeExams: activeExams.length,
                    coursesManaged: teacherCourses.length,
                    assignmentsCreated: teacherAssignments.length
                };

            case UserRole.ICT_STAFF:
                const pendingHostelApprovals = hostels.filter(h => h.status === 'Pending').length;
                const pendingServiceApprovals = registeredServices.filter(s => s.status === 'Pending').length;
                const pendingSellerApprovals = users.filter(u => u.sellerApplicationStatus === 'pending').length;

                return {
                    totalUsers: users.length,
                    pendingApprovals: pendingHostelApprovals + pendingServiceApprovals + pendingSellerApprovals,
                    totalCourses: courses.length,
                    totalAssignments: assignments.length + exams.length
                };
            default:
                return {};
        }
    }, [currentUser, assignments, submissions, exams, examSubmissions, courses, users, hostels, registeredServices, wallets]);

    // --- RENDER LOGIC ---
    if (isLoading) return <FullScreenLoader />;

    if (!currentUser) {
        return authView === 'login' ? 
            <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} error={authError} /> : 
            <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} error={authError} />;
    }
    
    if (isVideoCallActive) {
        return <VideoCallView onClose={() => setIsVideoCallActive(false)} />;
    }

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-800">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentUser.role === UserRole.STUDENT && (
                                <>
                                    <StatCard icon={ClipboardListIcon} label="Pending Assignments" value={dashboardStats.pendingAssignments || 0} onClick={() => setActiveView('assignments')} />
                                    <StatCard icon={ClockIcon} label="Upcoming Exams (7d)" value={dashboardStats.upcomingExams || 0} onClick={() => setActiveView('exams')} />
                                    <StatCard icon={AcademicCapIcon} label="Graded Items" value={dashboardStats.gradedItems || 0} onClick={() => setActiveView('grades')} />
                                    <StatCard icon={CreditCardIcon} label="Wallet Balance" value={`$${dashboardStats.walletBalance || '0.00'}`} onClick={() => setActiveView('payment-portal')} />
                                </>
                            )}
                            {currentUser.role === UserRole.TEACHER && (
                                <>
                                    <StatCard icon={PencilIcon} label="Submissions to Grade" value={dashboardStats.submissionsToGrade || 0} onClick={() => setActiveView('assignments')} />
                                    <StatCard icon={ClockIcon} label="Active Exams" value={dashboardStats.activeExams || 0} onClick={() => setActiveView('exams')} />
                                    <StatCard icon={BookOpenIcon} label="Courses Managed" value={dashboardStats.coursesManaged || 0} onClick={() => setActiveView('course-registration')} />
                                    <StatCard icon={ClipboardListIcon} label="Assignments Created" value={dashboardStats.assignmentsCreated || 0} onClick={() => setActiveView('assignments')} />
                                </>
                            )}
                            {currentUser.role === UserRole.ICT_STAFF && (
                                <>
                                    <StatCard icon={UserGroupIcon} label="Total Users" value={dashboardStats.totalUsers || 0} onClick={() => setActiveView('staff-portal')} />
                                    <StatCard icon={CheckCircleIcon} label="Pending Approvals" value={dashboardStats.pendingApprovals || 0} onClick={() => setActiveView('staff-portal')} />
                                    <StatCard icon={BookOpenIcon} label="Total Courses" value={dashboardStats.totalCourses || 0} onClick={() => setActiveView('course-registration')} />
                                    <StatCard icon={DocumentPlusIcon} label="Total Content" value={dashboardStats.totalAssignments || 0} onClick={() => setActiveView('staff-portal')} />
                                </>
                            )}
                            {currentUser.role === UserRole.VISITOR && (
                                <div className="col-span-full bg-white p-8 rounded-lg shadow-md text-center">
                                    <h3 className="text-2xl font-bold text-slate-800">Welcome to CampusConnect</h3>
                                    <p className="mt-2 text-slate-600">Explore the digital library, check out upcoming events, or browse the marketplace.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'assignments':
                if (currentUser.role === UserRole.TEACHER) {
                    return (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-800">My Assignments</h2>
                                <button onClick={() => setModal({ type: 'create-assignment' })} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                                    <PlusCircleIcon className="w-5 h-5"/>
                                    <span>Create Assignment</span>
                                </button>
                            </div>
                            {teacherAssignments.length > 0 ? (
                                teacherAssignments.map(assignment => {
                                     const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
                                     return (
                                        <div key={assignment.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                                                <p className="text-sm text-slate-500">{assignment.targetDepartments.join(', ')} - Level {assignment.targetLevels.join(', ')}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => setModal({ type: 'view-submissions', data: {item: assignment, itemType: 'assignment'} })} className="text-sm font-semibold text-primary-600 hover:underline">
                                                    {assignmentSubmissions.length} Submissions
                                                </button>
                                                <button onClick={() => setModal({ type: 'edit-assignment', data: assignment })} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteAssignment(assignment.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p>You have not created any assignments yet.</p>
                            )}
                        </div>
                    );
                }
                if (currentUser.role === UserRole.STUDENT) {
                     return (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-800">My Assignments</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredStudentAssignments.map(assignment => {
                                        const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser.id);
                                        const isOverdue = new Date(assignment.dueDate) < new Date();

                                        return (
                                            <div key={assignment.id} className={`bg-white rounded-lg shadow-md p-6 flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}>
                                                <div className="flex justify-between items-start">
                                                    <PriorityBadge priority={assignment.priority} />
                                                    {submission ? 
                                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">SUBMITTED</span> :
                                                        isOverdue ? 
                                                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">OVERDUE</span> : 
                                                        null
                                                    }
                                                </div>
                                                <div className="flex-grow my-3">
                                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{assignment.title}</h3>
                                                    <p className="text-sm text-slate-500">By {assignment.creatorName}</p>
                                                    <p className="text-xs text-slate-400 mt-2">{assignment.type} - {assignment.totalMarks} Marks</p>
                                                </div>
                                                <div className="border-t pt-4 space-y-3">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-semibold text-slate-600">Due Date:</span>
                                                        {formatDueDate(assignment.dueDate)}
                                                    </div>
                                                    <button
                                                        onClick={() => setModal({ type: 'take-assignment', data: assignment })}
                                                        disabled={!!submission || isOverdue}
                                                        className="w-full bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                                                    >
                                                        {submission ? 'Submitted' : 'Take Assignment'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {filteredStudentAssignments.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                        <h3 className="text-xl font-bold text-slate-700">All Caught Up!</h3>
                                        <p className="text-slate-500 mt-2">You have no pending assignments that match your filters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }
                break;
            case 'exams':
                return <ExamsView 
                    currentUser={currentUser} 
                    exams={exams} 
                    examSubmissions={examSubmissions}
                    onTakeExam={(exam, attemptNumber) => setModal({ type: 'take-exam', data: { exam, attemptNumber } })}
                    onCreateExam={() => setModal({ type: 'create-exam' })}
                    onViewSubmissions={(item, itemType) => setModal({ type: 'view-submissions', data: { item, itemType } })}
                    onDeleteExam={handleDeleteExam}
                />;
            case 'grades':
                return <GradesView assignments={assignments} submissions={submissions.filter(s => s.studentId === currentUser.id)} exams={exams} examSubmissions={examSubmissions.filter(s => s.studentId === currentUser.id)} />;
            case 'chat':
                return <ChatView currentUser={currentUser} allUsers={users} groups={chatGroups} messages={chatMessages} events={events} onSendMessage={handleSendMessage} onStartVideoCall={() => setIsVideoCallActive(true)} onOpenSettings={(group) => setManageChatSettingsModalGroup(group)} setActiveView={handleSetActiveView} onDeleteMessage={handleDeleteMessage} initialActiveGroupId={initialActiveGroupId} setInitialActiveGroupId={setInitialActiveGroupId} eventRegistrations={eventRegistrations} eventTicketPurchases={eventTicketPurchases} onViewEventDetails={handleViewEventDetails} onViewMarketplaceItem={handleViewMarketplaceItem} onViewService={handleViewService} />
            case 'attendance':
                return <AttendanceView currentUser={currentUser} allUsers={users} records={attendanceRecords} onSave={handleSaveAttendance} courses={courses} courseRegistrations={courseRegistrations} />
            case 'staff-portal':
                return <StaffPortal currentUser={currentUser} users={users} chatGroups={chatGroups} assignments={assignments} exams={exams} submissions={submissions} examSubmissions={examSubmissions} hostels={hostels} registeredServices={registeredServices} onUpdateHostelStatus={handleUpdateHostelStatus} onUpdateServiceStatus={handleUpdateServiceStatus} onDeleteUser={handleDeleteUser} onOpenUserCreator={() => setIsUserCreatorOpen(true)} onOpenManageAdmins={(group) => setManageAdminsModalGroup(group)} onEditAssignment={(assignment) => setModal({ type: 'edit-assignment', data: assignment })} onDeleteAssignment={handleDeleteAssignment} onViewSubmissions={(item, itemType) => setModal({ type: 'view-submissions', data: {item, itemType} })} onDeleteExam={handleDeleteExam} onUpdateUser={handleUpdateUser} />
            case 'course-registration':
                return <CourseRegistrationView currentUser={currentUser} courses={courses} registrations={courseRegistrations.filter(r => r.studentId === currentUser.id)} onRegister={handleRegisterCourses} onOpenCourseCreator={() => setModal({type: 'create-course'})}/>
            case 'payment-portal':
                return <PaymentPortal currentUser={currentUser} feeStatements={feeStatements.filter(fs => fs.studentId === currentUser.id)} wallet={wallets.find(w => w.userId === currentUser.id)} transactions={walletTransactions.filter(wt => wt.walletId === currentUser.id)} marketplaceOrders={marketplaceOrders.filter(o => o.buyerId === currentUser.id)} onDeposit={handleInitiateDeposit} />;
            case 'accommodation':
                 return <AccommodationView currentUser={currentUser} hostels={hostels} rooms={rooms} applications={accommodationApplications} onInitiateBooking={handleInitiateBooking} onRegisterHostel={() => setModal({type: 'register-hostel'})} />
            case 'course-materials':
                return <CourseMaterialsView currentUser={currentUser} courses={courses} courseRegistrations={courseRegistrations.filter(r => r.studentId === currentUser.id)} materials={courseMaterials} onUploadClick={() => setModal({type: 'upload-material'})} onDelete={handleDeleteMaterial} />
            case 'profile':
                 return <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'marketplace':
                return <MarketplaceView currentUser={currentUser} listings={marketplaceListings} onPurchase={handleInitiateMarketplacePayment} onApplySeller={() => handleUpdateUser({...currentUser, sellerApplicationStatus: 'pending'})} onCreateListing={() => setModal({type: 'create-listing'})} onDeleteListing={async (id) => {await api.deleteMarketplaceListing(id); setMarketplaceListings(await api.getMarketplaceListings());}} onEditListing={(l) => setModal({type: 'edit-listing', data: l})} setActiveView={handleSetActiveView} initialSearch={initialMarketplaceSearch} onDidUseInitialSearch={() => setInitialMarketplaceSearch('')} />
            case 'events':
                return <EventPortalView currentUser={currentUser} events={events} registrations={eventRegistrations} ticketPurchases={eventTicketPurchases} services={registeredServices} bookings={serviceBookings} onRegisterForEvent={handleRegisterForEvent} onViewDetails={(e) => setModal({type: 'view-event', data: e})} onCreateEvent={() => setModal({type: 'create-event'})} onRegisterService={() => setModal({type: 'register-service'})} onBookServiceNoEvent={handleInitiateServiceBooking} setActiveView={handleSetActiveView} initialSearch={initialEventSearch} initialTab={initialEventTab} onDidUseInitialSearch={() => { setInitialEventSearch(''); setInitialEventTab('browse-events'); }} />
            case 'library':
                return <LibraryView currentUser={currentUser} books={libraryBooks} readingProgress={readingProgress} visitorPayments={visitorPayments} bookRequests={bookRequests} onOpenReader={(book, progress) => setModal({type: 'read-book', data: {book, progress}})} onOpenUploader={() => setModal({type: 'upload-book'})} onUpdateProgress={handleUpdateReadingProgress} onInitiatePayment={handleInitiateVisitorPayment} onOpenRequestForm={() => setModal({type: 'request-book'})} onOpenRequestManager={() => setModal({type: 'manage-requests'})} />;
            default:
                return <p>View not found.</p>;
        }
    };

    return (
        <div className="h-screen flex bg-slate-100">
            {/* Sidebar */}
            <aside className={`absolute md:relative z-20 md:z-auto w-64 bg-slate-800 text-white p-6 flex-col shrink-0 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}>
                <Sidebar role={currentUser.role} activeView={activeView} setActiveView={handleSetActiveView} assignmentsDueSoonCount={assignmentsDueSoonCount} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar user={currentUser} onLogout={handleLogout} activeView={activeView} setActiveView={handleSetActiveView} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>
            
            {/* Modals */}
            {modal.type && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { if(modal.type !== 'take-exam') setModal({type: null})}}></div>
            )}
            {modal.type === 'create-assignment' && <AssignmentCreator onClose={() => setModal({type: null})} onSave={handleCreateAssignment} teacherId={currentUser.id} teacherName={currentUser.name} />}
            {modal.type === 'edit-assignment' && <AssignmentCreator onClose={() => setModal({type: null})} onSave={handleUpdateAssignment} teacherId={currentUser.id} teacherName={currentUser.name} assignmentToEdit={modal.data} />}
            {modal.type === 'take-assignment' && <AssignmentTaker assignment={modal.data} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitAssignment} />}
            {modal.type === 'create-exam' && <ExamCreator onClose={() => setModal({ type: null })} onCreate={handleCreateExam} teacherId={currentUser.id} teacherName={currentUser.name} courses={courses} />}
            {modal.type === 'take-exam' && <ExamTaker exam={modal.data.exam} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitExam} attemptNumber={modal.data.attemptNumber} />}
            {/* FIX: Use `in` operator as a type guard to correctly filter submissions based on whether they have an `assignmentId` or `examId`. */}
            {modal.type === 'view-submissions' && <ViewSubmissions item={modal.data.item} submissions={(modal.data.itemType === 'assignment' ? submissions : examSubmissions).filter(s => ('assignmentId' in s && s.assignmentId === modal.data.item.id) || ('examId' in s && s.examId === modal.data.item.id))} onClose={() => setModal({ type: null })} onGrade={(submission) => setModal({ type: 'grade-submission', data: { item: modal.data.item, submission, itemType: modal.data.itemType } })} />}
            {modal.type === 'grade-submission' && <GradeSubmission item={modal.data.item} submission={modal.data.submission} itemType={modal.data.itemType} onClose={() => setModal({ type: 'view-submissions', data: { item: modal.data.item, itemType: modal.data.itemType }})} onSaveGrade={handleGradeSubmission} />}
            {isUserCreatorOpen && <UserCreator onClose={() => setIsUserCreatorOpen(false)} onCreateUser={handleCreateUserByAdmin} />}
            {manageAdminsModalGroup && <ManageChatAdmins group={manageAdminsModalGroup} allUsers={users} onClose={() => setManageAdminsModalGroup(null)} onSave={handleUpdateChatAdmins} />}
            {manageChatSettingsModalGroup && <ChatSettingsModal group={manageChatSettingsModalGroup} onClose={() => setManageChatSettingsModalGroup(null)} onSave={handleUpdateChatLock}/>}
            {modal.type === 'upload-material' && <MaterialUploader currentUser={currentUser} courses={courses} onClose={() => setModal({ type: null })} onUpload={handleUploadMaterial} />}
            {modal.type === 'register-hostel' && <HostelRegistrationForm onClose={() => setModal({type: null})} onRegister={handleRegisterHostel}/>}
            {paymentModalData && <PaymentCheckout paymentDetails={paymentModalData} walletBalance={wallets.find(w=>w.userId===currentUser.id)?.balance || 0} onClose={() => setPaymentModalData(null)} onConfirmPayment={handleConfirmPayment}/>}
            {serviceBookingModalData && <ServiceBookingModal service={serviceBookingModalData} onClose={() => setServiceBookingModalData(null)} onSubmit={handleConfirmServiceBooking} />}
            {modal.type === 'create-listing' && <ProductListingForm onClose={() => setModal({type:null})} onSave={async (d) => { await api.createMarketplaceListing({...d, id:`m-${Date.now()}`, sellerId: currentUser.id, sellerName: currentUser.name, createdAt: new Date().toISOString(), isAvailable: true }); setMarketplaceListings(await api.getMarketplaceListings()); setModal({type:null}); }} />}
            {modal.type === 'edit-listing' && <ProductListingForm onClose={() => setModal({type:null})} onSave={async (d) => { await api.updateMarketplaceListing(d); setMarketplaceListings(await api.getMarketplaceListings()); setModal({type:null}); }} listingToEdit={modal.data} />}
            {modal.type === 'create-event' && <EventCreator currentUser={currentUser} onClose={() => setModal({type: null})} onCreate={handleCreateEvent} />}
            {modal.type === 'register-service' && <ServiceRegistrationForm onClose={() => setModal({type: null})} onRegister={handleRegisterService} />}
            {modal.type === 'view-event' && <EventDetailsView event={modal.data} currentUser={currentUser} registrations={eventRegistrations} ticketPurchases={eventTicketPurchases} services={registeredServices} bookings={serviceBookings} onClose={() => setModal({type: null})} onRegister={handleRegisterForEvent} onBookService={handleBookService} onInitiateTicketPurchase={handleInitiateTicketPurchase} setActiveView={handleSetActiveView} />}
            {modal.type === 'upload-book' && <BookUploader onClose={() => setModal({type: null})} onCreateBook={handleCreateBook} />}
            {modal.type === 'read-book' && <BookReader book={modal.data.book} progress={modal.data.progress} currentUser={currentUser} onClose={() => setModal({type: null})} onProgressUpdate={handleUpdateReadingProgress} onCreateReview={handleCreateReview} />}
            {modal.type === 'request-book' && <BookRequestForm onClose={() => setModal({type: null})} onCreateRequest={handleCreateBookRequest} />}
            {modal.type === 'manage-requests' && <BookRequestManager requests={bookRequests} onClose={() => setModal({type: null})} onUpdateStatus={handleUpdateBookRequestStatus} />}
            {modal.type === 'create-course' && <CourseCreator currentUser={currentUser} onClose={() => setModal({type: null})} onCreateCourse={handleCreateCourse} />}
        </div>
    );
}