

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, UserRole, Assignment, Submission, Exam, ExamSubmission, AssignmentType, AssignmentPriority, ChatGroup, ChatMessage, AttendanceRecord, Course, CourseRegistration, FeeStatement, PaymentRecord, Hostel, Room, AccommodationApplication, CourseMaterial, UserWallet, WalletTransaction, MarketplaceListing, MarketplaceOrder, Event, EventRegistration, RegisteredService, EventBooking, LibraryBook, ReadingProgress, VisitorPayment, BookRequest, BookReview, EventTicketPurchase } from './types';
import * as api from './api/mockApi';
import {
    HomeIcon, ClipboardListIcon, AcademicCapIcon, UserGroupIcon, LogoutIcon,
    PlusCircleIcon, BookOpenIcon, XIcon, CheckCircleIcon, PencilIcon, ClockIcon,
    ChatBubbleLeftRightIcon, CalendarDaysIcon, Cog6ToothIcon, DocumentPlusIcon,
    CreditCardIcon, SearchIcon, TrashIcon, BuildingOfficeIcon, DocumentArrowDownIcon,
    UserCircleIcon, ShoppingCartIcon, MenuIcon
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
import { EventBookingPortal } from './components/EventBookingPortal';
import { EventCreator } from './components/EventCreator';
import { ServiceRegistrationForm } from './components/ServiceRegistrationForm';
import { EventDetailsView } from './components/EventDetailsView';
import { LibraryView } from './components/LibraryView';
import { BookUploader } from './components/BookUploader';
import { BookReader } from './components/BookReader';
import { BookRequestForm } from './components/BookRequestForm';
import { BookRequestManager } from './components/BookRequestManager';
import { ChatSettingsModal } from './components/ChatSettingsModal';


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
        { icon: CalendarDaysIcon, label: 'Event/Booking' },
        { icon: ShoppingCartIcon, label: 'Marketplace' },
    ];
    
    let roleNav;
    switch (role) {
        case UserRole.TEACHER:
            roleNav = [
                { icon: ClipboardListIcon, label: 'Assignments' },
                { icon: BookOpenIcon, label: 'Exams' },
                { icon: DocumentArrowDownIcon, label: 'Course Materials' },
                { icon: CalendarDaysIcon, label: 'Attendance' },
                { icon: UserGroupIcon, label: 'Students' }
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
    const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
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
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [isUserCreatorOpen, setIsUserCreatorOpen] = useState(false);
    const [manageAdminsModalGroup, setManageAdminsModalGroup] = useState<ChatGroup | null>(null);
    const [manageChatSettingsModalGroup, setManageChatSettingsModalGroup] = useState<ChatGroup | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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
                        eventRegsData, ticketPurchasesData, registeredServicesData, eventBookingsData, libraryBooksData,
                        readingProgressData, visitorPaymentsData, bookRequestsData, bookReviewsData
                    ] = await Promise.all([
                        api.getUsers(), api.getAssignments(), api.getSubmissions(), api.getExams(), api.getExamSubmissions(),
                        api.getChatGroups(), api.getChatMessages(), api.getAttendanceRecords(), api.getCourses(),
                        api.getCourseRegistrations(), api.getFeeStatements(), api.getPaymentRecords(),
                        api.getHostels(), api.getRooms(), api.getAccommodationApplications(),
                        api.getCourseMaterials(), api.getWallets(), api.getWalletTransactions(),
                        api.getMarketplaceListings(), api.getMarketplaceOrders(), api.getEvents(),
                        api.getEventRegistrations(), api.getEventTicketPurchases(), api.getRegisteredServices(), api.getEventBookings(),
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
                    setEventBookings(eventBookingsData);
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
                if (submission.answers[i] === q.correctAnswerIndex) {
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

// FIX: Update handleSaveAttendance to accept courseId, correctly create AttendanceRecord objects,
// call the API with all required arguments, and correctly update local state.
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
        setPaymentModalData({
            amount: price,
            description: `Booking for ${room.type} Room (${room.roomNumber}) for ${duration}`,
            type: 'payment',
            metadata: { paymentType: 'accommodation', roomId: room.id, hostelId: room.hostelId, duration }
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
            description: `Purchase of "${listing.title}"`,
            type: 'payment',
            metadata: { paymentType: 'marketplace', listingId: listing.id }
        });
    };

    const handleInitiateVisitorLibraryPayment = () => {
        setPaymentModalData({
            amount: 25, // Fixed library fee for visitors
            description: `One-time library access fee`,
            type: 'payment',
            metadata: { paymentType: 'visitor_library_fee' }
        });
    };

    const handleConfirmPayment = async (method: 'card' | 'wallet') => {
        if (!paymentModalData || !currentUser) return;

        const { amount, description, type, metadata } = paymentModalData;
        const userWallet = wallets.find(w => w.userId === currentUser.id);

        if (type === 'deposit') {
            if (userWallet) {
                const updatedWallet = { ...userWallet, balance: userWallet.balance + amount };
                const newTransaction: WalletTransaction = {
                    id: `txn-${Date.now()}`,
                    walletId: userWallet.id,
                    type: 'deposit',
                    amount,
                    description: `Deposit via ${method}`,
                    timestamp: new Date().toISOString(),
                };
                const [updated] = await Promise.all([
                    api.updateWallet(updatedWallet),
                    api.createWalletTransaction(newTransaction)
                ]);
                setWallets(prev => prev.map(w => w.id === updated.id ? updated : w));
                setWalletTransactions(prev => [...prev, newTransaction]);
            }
        } else if (type === 'payment') {
             if (method === 'wallet' && userWallet) {
                if(userWallet.balance < amount) {
                    alert("Insufficient wallet balance.");
                    setPaymentModalData(null);
                    return;
                }
                const updatedWallet = { ...userWallet, balance: userWallet.balance - amount };
                const newTransaction: WalletTransaction = {
                    id: `txn-${Date.now()}`,
                    walletId: userWallet.id,
                    type: 'payment',
                    amount,
                    description,
                    timestamp: new Date().toISOString(),
                };
                 const [updated] = await Promise.all([
                    api.updateWallet(updatedWallet),
                    api.createWalletTransaction(newTransaction)
                ]);
                setWallets(prev => prev.map(w => w.id === updated.id ? updated : w));
                setWalletTransactions(prev => [...prev, newTransaction]);
            }
            
            // Handle accommodation booking
            if (metadata?.paymentType === 'accommodation') {
                const roomToUpdate = rooms.find(r => r.id === metadata.roomId);
                if (roomToUpdate) {
                    const updatedRoom = { ...roomToUpdate, isAvailable: false };
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
                    const [updatedR, createdApp] = await Promise.all([
                        api.updateRoom(updatedRoom),
                        api.createAccommodationApplication(newApplication)
                    ]);
                    setRooms(prev => prev.map(r => r.id === updatedR.id ? updatedR : r));
                    setAccommodationApplications(prev => [...prev, createdApp]);
                }
            } else if (metadata?.paymentType === 'marketplace') {
                 const listing = marketplaceListings.find(l => l.id === metadata.listingId);
                 if (listing) {
                    const newOrder: MarketplaceOrder = {
                        id: `order-${Date.now()}`,
                        buyerId: currentUser.id,
                        listingId: listing.id,
                        listingTitle: listing.title,
                        sellerId: listing.sellerId,
                        amount: listing.price,
                        orderedAt: new Date().toISOString(),
                    };
                    const updatedListing = { ...listing, isAvailable: false };
                    const [createdOrder] = await Promise.all([
                         api.createMarketplaceOrder(newOrder),
                         api.updateMarketplaceListing(updatedListing),
                    ]);
                     setMarketplaceOrders(prev => [...prev, createdOrder]);
                     setMarketplaceListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
                 }
            } else if (metadata?.paymentType === 'event_booking') {
                const newBooking: EventBooking = {
                    id: `booking-${Date.now()}`,
                    eventId: metadata.eventId,
                    userId: currentUser.id,
                    serviceId: metadata.serviceId,
                    details: metadata.details,
                    amount,
                    bookedAt: new Date().toISOString(),
                };
                const createdBooking = await api.createEventBooking(newBooking);
                setEventBookings(prev => [...prev, createdBooking]);
            } else if (metadata?.paymentType === 'visitor_library_fee') {
                const newPayment: VisitorPayment = {
                    id: `vp-${Date.now()}`,
                    visitorId: currentUser.id,
                    feeType: 'library_access',
                    amountPaid: amount,
                    paidAt: new Date().toISOString(),
                };
                const createdPayment = await api.createVisitorPayment(newPayment);
                setVisitorPayments(prev => [...prev, createdPayment]);
            } else if (metadata?.paymentType === 'event_ticket') {
                 const newPurchase: EventTicketPurchase = {
                    id: `ticket-${Date.now()}`,
                    eventId: metadata.eventId,
                    userId: currentUser.id,
                    userName: currentUser.name,
                    quantity: metadata.quantity,
                    amountPaid: amount,
                    purchasedAt: new Date().toISOString(),
                };
                const created = await api.createEventTicketPurchase(newPurchase);
                setEventTicketPurchases(prev => [...prev, created]);
            }
        }

        setPaymentModalData(null);
    };

    // Marketplace handlers
    const handleCreateListing = async (listing: Omit<MarketplaceListing, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'isAvailable'>) => {
        if (!currentUser) return;
        const newListing: MarketplaceListing = {
            ...listing,
            id: `m-${Date.now()}`,
            sellerId: currentUser.id,
            sellerName: currentUser.name,
            createdAt: new Date().toISOString(),
            isAvailable: true,
        };
        const created = await api.createMarketplaceListing(newListing);
        setMarketplaceListings(prev => [...prev, created]);
        setModal({ type: null });
    };

    const handleUpdateListing = async (listing: MarketplaceListing) => {
        const updated = await api.updateMarketplaceListing(listing);
        setMarketplaceListings(prev => prev.map(l => l.id === updated.id ? updated : l));
        setModal({ type: null });
    };

    const handleDeleteListing = async (listingId: string) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            await api.deleteMarketplaceListing(listingId);
            setMarketplaceListings(prev => prev.filter(l => l.id !== listingId));
        }
    };

    // Event/Booking Handlers
    const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'creatorId' | 'creatorName' | 'chatGroupId'>, isChatLocked: boolean) => {
        if (!currentUser) return;
        const newEvent: Event = {
            ...eventData,
            id: `evt-${Date.now()}`,
            creatorId: currentUser.id,
            creatorName: currentUser.name,
        };
        const created = await api.createEvent(newEvent, isChatLocked);
        setEvents(prev => [...prev, created]);
        const allGroups = await api.getChatGroups();
        setChatGroups(allGroups); // Refresh groups to get the new event group
        setModal({ type: null });
    };
    
    const handleRegisterForEvent = async (eventId: string) => {
        if (!currentUser) return;
        const newRegistration: EventRegistration = {
            id: `re-${currentUser.id}-${eventId}`,
            eventId,
            userId: currentUser.id,
            registeredAt: new Date().toISOString(),
        };
        const created = await api.createEventRegistration(newRegistration);
        setEventRegistrations(prev => [...prev, created]);
    };
    
    const handleRegisterService = async (serviceData: Omit<RegisteredService, 'id' | 'providerId' | 'providerName' | 'status'>) => {
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
        alert('Service submitted for review!');
    };

    const handleUpdateServiceStatus = async (serviceId: string, status: 'Approved' | 'Rejected') => {
        const service = registeredServices.find(s => s.id === serviceId);
        if (service) {
            const updated = await api.updateRegisteredService({ ...service, status });
            setRegisteredServices(prev => prev.map(s => s.id === serviceId ? updated : s));
        }
    };
    
    const handleInitiateEventBooking = (event: Event, service: RegisteredService, details: any) => {
        setPaymentModalData({
            amount: service.price * (details.quantity || 1),
            description: `Booking: ${service.serviceName} for "${event.title}"`,
            type: 'payment',
            metadata: {
                paymentType: 'event_booking',
                eventId: event.id,
                serviceId: service.id,
                details: details,
            }
        });
    };

    const handleInitiateTicketPurchase = (event: Event, quantity: number) => {
        if (!event.ticketPrice) return;
        setPaymentModalData({
            amount: event.ticketPrice * quantity,
            description: `Ticket(s) for "${event.title}" (x${quantity})`,
            type: 'payment',
            metadata: {
                paymentType: 'event_ticket',
                eventId: event.id,
                quantity: quantity,
            }
        });
    };

    // Library Handlers
    const handleCreateBook = async (bookData: Omit<LibraryBook, 'id' | 'uploaderId' | 'uploadedAt'>) => {
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
        alert('Your book request has been submitted!');
    };

    const handleUpdateBookRequestStatus = async (requestId: string, status: BookRequest['status']) => {
        const request = bookRequests.find(r => r.id === requestId);
        if (request) {
            const updated = await api.updateBookRequest({ ...request, status });
            setBookRequests(prev => prev.map(r => r.id === requestId ? updated : r));
        }
    };

    const handleCreateBookReview = async (reviewData: Omit<BookReview, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
        if (!currentUser) return;
        const newReview: BookReview = {
            ...reviewData,
            id: `rev-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date().toISOString(),
        };
        const bookToUpdate = libraryBooks.find(b => b.id === newReview.bookId);
        if (bookToUpdate) {
            const updatedBook: LibraryBook = {
                ...bookToUpdate,
                ratings: [...(bookToUpdate.ratings || []), newReview.rating],
                reviews: [...(bookToUpdate.reviews || []), newReview],
            };
            const [createdReview, updatedBookResult] = await Promise.all([
                api.createBookReview(newReview),
                api.updateLibraryBook(updatedBook),
            ]);
            setBookReviews(prev => [...prev, createdReview]);
            setLibraryBooks(prev => prev.map(b => b.id === updatedBookResult.id ? updatedBookResult : b));
        }
    };


    // --- MEMOIZED DERIVED STATE ---
    const getSubmissionForAssignment = useCallback((assignmentId: string) => submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser?.id), [submissions, currentUser]);
    const isAssignmentOverdue = (assignment: Assignment) => new Date(assignment.dueDate) < new Date();
    
    const assignmentsDueSoonCount = useMemo(() => {
        if (currentUser?.role !== UserRole.STUDENT) return 0;
        const isDueSoon = (dueDateString: string) => {
            const due = new Date(dueDateString);
            const now = new Date();
            const twoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
            return due > now && due <= twoDays;
        };
        return assignments.filter(a =>
            a.targetDepartments.includes(currentUser.department) &&
            a.targetLevels.includes(currentUser.level) &&
            !getSubmissionForAssignment(a.id) &&
            isDueSoon(a.dueDate)
        ).length;
    }, [assignments, currentUser, getSubmissionForAssignment]);

    const filteredTeacherAssignments = useMemo(() => {
        if (currentUser?.role !== UserRole.TEACHER) return [];
        return assignments
            .filter(a => a.creatorId === currentUser.id)
            .filter(a => a.title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()));
    }, [assignments, currentUser, assignmentSearchTerm]);

    const filteredStudentAssignments = useMemo(() => {
        if (currentUser?.role !== UserRole.STUDENT) return [];
        const isDueThisWeek = (dueDateString: string) => {
            const due = new Date(dueDateString);
            const now = new Date();
            const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return due > now && due <= sevenDays;
        };
        let filtered = assignments.filter(a => 
            a.targetDepartments.includes(currentUser.department) &&
            a.targetLevels.includes(currentUser.level)
        );
        switch(assignmentDateFilter) {
            case 'due-this-week': filtered = filtered.filter(a => !getSubmissionForAssignment(a.id) && isDueThisWeek(a.dueDate)); break;
            case 'overdue': filtered = filtered.filter(a => !getSubmissionForAssignment(a.id) && isAssignmentOverdue(a)); break;
            case 'completed': filtered = filtered.filter(a => !!getSubmissionForAssignment(a.id)); break;
        }
        if (assignmentSearchTerm) {
            filtered = filtered.filter(a => a.title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()));
        }
        return filtered;
    }, [assignments, currentUser, assignmentDateFilter, assignmentSearchTerm, getSubmissionForAssignment]);
    
    const teacherExams = useMemo(() => exams.filter(e => e.creatorId === currentUser?.id), [exams, currentUser]);
    const studentExams = useMemo(() => exams.filter(e => 
        e.targetDepartments.includes(currentUser?.department || '') &&
        e.targetLevels.includes(currentUser?.level || 0)
    ), [exams, currentUser]);

    // --- RENDER LOGIC ---
    if (isLoading && !currentUser) return <FullScreenLoader />;

    if (!currentUser) {
        return authView === 'login' ? 
            <LoginPage onLogin={handleLogin} onSwitchToSignup={() => { setAuthView('signup'); setAuthError(null); }} error={authError} /> :
            <SignupPage onSignup={handleSignup} onSwitchToLogin={() => { setAuthView('login'); setAuthError(null); }} error={authError} />;
    }

    const ExamStatusButton: React.FC<{exam: Exam}> = ({exam}) => {
        const [now, setNow] = useState(new Date());
        
        useEffect(() => {
            const timer = setInterval(() => setNow(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        const submissionsForThisExam = useMemo(() =>
            examSubmissions
                .filter(s => s.examId === exam.id && s.studentId === currentUser.id)
                .sort((a, b) => b.attemptNumber - a.attemptNumber),
            [examSubmissions, exam.id, currentUser.id]
        );

        const latestSubmission = submissionsForThisExam[0];
        const attemptCount = submissionsForThisExam.length;
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);

        if (latestSubmission) {
            const latestGrade = latestSubmission.grade;
            const canRetake =
                exam.retakePolicy.allowed &&
                attemptCount < exam.retakePolicy.maxAttempts &&
                latestGrade !== undefined &&
                ((latestGrade / exam.totalMarks) * 100 < exam.retakePolicy.passingGradePercentage) &&
                now < endTime; // Cannot retake after exam window closes

            if (canRetake) {
                return (
                    <div className="text-center space-y-2">
                        <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg text-sm">
                            Score: {latestGrade}/{exam.totalMarks}. You can retake this exam.
                        </div>
                        <button onClick={() => setModal({ type: 'take-exam', data: { exam, attemptNumber: attemptCount + 1 } })} className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition">
                            Retake Exam (Attempt {attemptCount + 1})
                        </button>
                    </div>
                );
            }
            
            const highestGrade = Math.max(...submissionsForThisExam.map(s => s.grade ?? 0));
            return (
                <div className="bg-green-100 text-green-800 p-2 rounded-lg flex items-center justify-center space-x-2 text-sm">
                    <CheckCircleIcon className="w-5 h-5"/>
                    <span>Submitted | Best Score: {highestGrade}/{exam.totalMarks}</span>
                </div>
            );
        }

        if (now < startTime) {
            const diff = Math.floor((startTime.getTime() - now.getTime()) / 1000);
            const d = Math.floor(diff / 86400); const h = Math.floor((diff % 86400) / 3600); const m = Math.floor((diff % 3600) / 60); const s = diff % 60;
            return <div className="w-full text-center bg-blue-100 text-blue-800 font-semibold py-2 rounded-lg">Starts in {d > 0 ? `${d}d ` : ''}{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</div>
        }
        if (now > endTime) return <button disabled className="w-full bg-red-400 text-white font-semibold py-2 rounded-lg">Missed</button>;
        
        return <button onClick={() => setModal({type: 'take-exam', data: { exam, attemptNumber: 1 }})} className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition">Start Exam</button>;
    }
    
    const renderContent = () => {
        if (isLoading) return <FullScreenLoader message="Loading your dashboard..." />;
        
        switch (activeView) {
            case 'dashboard':
                 if (currentUser.role === UserRole.VISITOR) {
                    setActiveView('library'); // Visitors default to library
                    return null;
                }
                const teacherAssignments = assignments.filter(a => a.creatorId === currentUser.id);
                const studentAssignments = assignments.filter(a => a.targetDepartments.includes(currentUser?.department || '') && a.targetLevels.includes(currentUser?.level || 0));
                return (
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                                <div className="p-3 bg-primary-100 rounded-full"><ClipboardListIcon className="w-6 h-6 text-primary-600"/></div>
                                <div>
                                    <p className="text-slate-500 text-sm">{currentUser.role === UserRole.TEACHER ? "Assignments Created" : "Pending Assignments"}</p>
                                    <p className="text-2xl font-bold text-slate-800">{currentUser.role === UserRole.TEACHER ? teacherAssignments.length : studentAssignments.filter(a => !getSubmissionForAssignment(a.id)).length}</p>
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full"><CheckCircleIcon className="w-6 h-6 text-green-600"/></div>
                                <div>
                                     <p className="text-slate-500 text-sm">{currentUser.role === UserRole.TEACHER ? "Total Submissions" : "Completed Assignments"}</p>
                                    <p className="text-2xl font-bold text-slate-800">{currentUser.role === UserRole.TEACHER ? submissions.filter(s => teacherAssignments.some(a => a.id === s.assignmentId)).length : submissions.filter(s => s.studentId === currentUser.id).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'assignments':
                if (currentUser.role === UserRole.TEACHER) return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Your Assignments</h2>
                            <button onClick={() => setModal({ type: 'create-assignment' })} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition"><PlusCircleIcon className="w-5 h-5"/><span>Create Assignment</span></button>
                        </div>
                         <div className="mb-6"><input type="text" placeholder="Search assignments by title..." value={assignmentSearchTerm} onChange={e => setAssignmentSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"/></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {filteredTeacherAssignments.map(a => (
                               <div key={a.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
                                   <div className="flex-grow">
                                        <div className="flex justify-between items-start"><h3 className="text-lg font-bold text-slate-800 pr-2">{a.title}</h3><PriorityBadge priority={a.priority || AssignmentPriority.MEDIUM} /></div>
                                        <p className="text-sm text-slate-500 mt-1">{a.type} - {a.totalMarks} Marks</p>
                                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{a.description}</p>
                                        <div className="flex items-center space-x-2 mt-4 text-sm text-slate-500"><ClockIcon className="w-4 h-4" /><span>{formatDueDate(a.dueDate)}</span></div>
                                   </div>
                                    <div className="flex space-x-2 mt-4">
                                        <button onClick={() => setModal({type: 'view-submissions', data: {item: a, itemType: 'assignment'}})} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition">View Submissions ({submissions.filter(s => s.assignmentId === a.id).length})</button>
                                        <button onClick={() => setModal({type: 'edit-assignment', data: a})} className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition" aria-label="Edit Assignment"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteAssignment(a.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" aria-label="Delete Assignment"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                               </div>
                           ))}
                        </div>
                         {filteredTeacherAssignments.length === 0 && <p className="text-slate-500 text-center mt-8">You haven't created any assignments yet, or none match your search.</p>}
                    </div>
                );
                const FilterButton: React.FC<{filterValue: string, label: string}> = ({filterValue, label}) => (<button onClick={() => setAssignmentDateFilter(filterValue)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${assignmentDateFilter === filterValue ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{label}</button>);
                return (
                     <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Assignments</h2>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border">
                            <div className="relative w-full md:w-2/5">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search assignments by title..." 
                                    value={assignmentSearchTerm} 
                                    onChange={e => setAssignmentSearchTerm(e.target.value)} 
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-full">
                                <FilterButton filterValue="all" label="All" />
                                <FilterButton filterValue="due-this-week" label="Due this Week" />
                                <FilterButton filterValue="overdue" label="Overdue" />
                                <FilterButton filterValue="completed" label="Completed" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {filteredStudentAssignments.map(a => {
                               const submission = getSubmissionForAssignment(a.id);
                               return (
                                   <div key={a.id} className={`bg-white p-6 rounded-lg shadow-md transition-shadow ${submission ? 'opacity-70' : 'hover:shadow-xl'}`}>
                                        <div className="flex justify-between items-start"><h3 className="text-lg font-bold text-slate-800 pr-2">{a.title}</h3><PriorityBadge priority={a.priority || AssignmentPriority.MEDIUM} /></div>
                                       <p className="text-sm text-slate-500 mt-1">{a.type} - By {a.creatorName}</p>
                                       <p className="text-sm text-slate-600 mt-2 line-clamp-2">{a.description}</p>
                                       <div className="flex items-center space-x-2 mt-4 text-sm text-slate-500"><ClockIcon className="w-4 h-4" /><span>{formatDueDate(a.dueDate)}</span></div>
                                       <div className="mt-4">
                                           {submission ? (
                                               <div className="bg-green-100 text-green-800 p-2 rounded-lg flex items-center justify-center space-x-2"><CheckCircleIcon className="w-5 h-5"/> <span>Submitted {submission.grade !== undefined ? `| Grade: ${submission.grade}/${a.totalMarks}` : ''}</span></div>
                                           ) : (
                                               <button onClick={() => setModal({ type: 'take-assignment', data: a })} disabled={isAssignmentOverdue(a)} className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed">{isAssignmentOverdue(a) ? 'Overdue' : 'Start Assignment'}</button>
                                           )}
                                       </div>
                                   </div>
                               )
                           })}
                        </div>
                        {filteredStudentAssignments.length === 0 && <p className="text-slate-500 text-center mt-8">No assignments match your criteria.</p>}
                     </div>
                );
            case 'exams':
                 if (currentUser.role === UserRole.TEACHER) return (
                    <div>
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800">Your Exams</h2><button onClick={() => setModal({ type: 'create-exam' })} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition"><PlusCircleIcon className="w-5 h-5"/><span>Create Exam</span></button></div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teacherExams.map(exam => (
                                <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-slate-800">{exam.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{exam.type} - {exam.durationMinutes} mins</p>
                                        <div className="text-xs text-slate-500 mt-2 space-y-1">
                                            <p>Starts: {new Date(exam.startTime).toLocaleString()}</p>
                                            <p>Ends: {new Date(exam.endTime).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <button onClick={() => setModal({type: 'view-submissions', data: {item: exam, itemType: 'exam'}})} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition">
                                            Submissions ({examSubmissions.filter(s => s.examId === exam.id).length})
                                        </button>
                                        <button onClick={() => handleDeleteExam(exam.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" aria-label="Delete Exam">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                         </div>
                         {teacherExams.length === 0 && <p className="text-slate-500 text-center mt-8">You haven't created any exams yet.</p>}
                    </div>
                 );
                 return (
                     <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Exams</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {studentExams.map(exam => (
                               <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-lg font-bold text-slate-800">{exam.title}</h3><p className="text-sm text-slate-500 mt-1">{exam.type} - By {exam.creatorName}</p><p className="text-sm text-slate-500 mt-1">{exam.durationMinutes} minutes - {exam.totalMarks} marks</p><div className="mt-4"><ExamStatusButton exam={exam} /></div></div>
                           ))}
                         </div>
                          {studentExams.length === 0 && <p className="text-slate-500 text-center mt-8">No exams available for you at the moment.</p>}
                     </div>
                 );
            case 'grades': return <GradesView assignments={assignments} submissions={submissions.filter(s => s.studentId === currentUser.id)} exams={exams} examSubmissions={examSubmissions.filter(s => s.studentId === currentUser.id)}/>;
            case 'library': return <LibraryView currentUser={currentUser} books={libraryBooks} readingProgress={readingProgress} visitorPayments={visitorPayments} bookRequests={bookRequests} onOpenReader={(book, progress) => setModal({type: 'book-reader', data: {book, progress}})} onOpenUploader={() => setModal({type: 'book-uploader'})} onUpdateProgress={handleUpdateReadingProgress} onInitiatePayment={handleInitiateVisitorLibraryPayment} onOpenRequestForm={() => setModal({type: 'book-request-form'})} onOpenRequestManager={() => setModal({type: 'book-request-manager'})} />;
            case 'course-registration': return <CourseRegistrationView currentUser={currentUser} courses={courses} registrations={courseRegistrations.filter(r => r.studentId === currentUser.id)} onRegister={handleRegisterCourses}/>;
            case 'course-materials': return <CourseMaterialsView currentUser={currentUser} courses={courses} courseRegistrations={courseRegistrations} materials={courseMaterials} onUploadClick={() => setModal({ type: 'upload-material' })} onDelete={handleDeleteMaterial} />;
            case 'accommodation': return <AccommodationView currentUser={currentUser} hostels={hostels} rooms={rooms} applications={accommodationApplications} onInitiateBooking={handleInitiateBooking} onRegisterHostel={() => setModal({ type: 'register-hostel' })}/>;
            case 'payment-portal': return <PaymentPortal currentUser={currentUser} feeStatements={feeStatements.filter(fs => fs.studentId === currentUser.id)} wallet={wallets.find(w => w.userId === currentUser.id)} transactions={walletTransactions.filter(t => t.walletId === currentUser.id)} marketplaceOrders={marketplaceOrders.filter(o => o.buyerId === currentUser.id)} onDeposit={handleInitiateDeposit} />;
            case 'marketplace': return <MarketplaceView currentUser={currentUser} listings={marketplaceListings} onPurchase={handleInitiateMarketplacePayment} onApplySeller={() => handleUpdateUser({...currentUser, sellerApplicationStatus: 'pending'})} onCreateListing={() => setModal({ type: 'create-listing' })} onDeleteListing={handleDeleteListing} onEditListing={(listing) => setModal({ type: 'edit-listing', data: listing })} setActiveView={setActiveView} />;
            case 'profile': return <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'chat': return <ChatView currentUser={currentUser} allUsers={users} groups={chatGroups} messages={chatMessages} events={events} onSendMessage={handleSendMessage} onStartVideoCall={() => setIsVideoCallActive(true)} onOpenSettings={(group) => setManageChatSettingsModalGroup(group)} setActiveView={setActiveView} onDeleteMessage={handleDeleteMessage}/>;
            case 'attendance': return <AttendanceView currentUser={currentUser} allUsers={users} records={attendanceRecords} onSave={handleSaveAttendance} courses={courses} courseRegistrations={courseRegistrations}/>;
            case 'event/booking': return <EventBookingPortal currentUser={currentUser} events={events} registrations={eventRegistrations} ticketPurchases={eventTicketPurchases} services={registeredServices} onRegisterForEvent={handleRegisterForEvent} onViewDetails={(event) => setModal({type: 'event-details', data: event})} onCreateEvent={() => setModal({type: 'create-event'})} onRegisterService={() => setModal({type: 'register-service'})} />;
            case 'staff-portal': return <StaffPortal currentUser={currentUser} users={users} chatGroups={chatGroups} assignments={assignments} exams={exams} submissions={submissions} examSubmissions={examSubmissions} hostels={hostels} registeredServices={registeredServices} bookRequests={bookRequests} onUpdateHostelStatus={handleUpdateHostelStatus} onUpdateServiceStatus={handleUpdateServiceStatus} onUpdateBookRequestStatus={handleUpdateBookRequestStatus} onDeleteUser={handleDeleteUser} onOpenUserCreator={() => setIsUserCreatorOpen(true)} onOpenManageAdmins={setManageAdminsModalGroup} onEditAssignment={(a) => setModal({ type: 'edit-assignment', data: a })} onDeleteAssignment={handleDeleteAssignment} onViewSubmissions={(item, itemType) => setModal({ type: 'view-submissions', data: { item, itemType } })} onDeleteExam={handleDeleteExam} onUpdateUser={handleUpdateUser} />
            default: return <div>Select a view</div>;
        }
    };
    
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
             {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}
            
            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-800 text-slate-200 p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar
                    role={currentUser.role}
                    activeView={activeView}
                    setActiveView={(view) => { setActiveView(view); closeSidebar(); }}
                    assignmentsDueSoonCount={assignmentsDueSoonCount}
                />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar 
                    user={currentUser} 
                    onLogout={handleLogout} 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    onToggleSidebar={() => setIsSidebarOpen(o => !o)} 
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
                    {renderContent()}
                </main>
            </div>

            {modal.type === 'create-assignment' && <AssignmentCreator onClose={() => setModal({ type: null })} onSave={handleCreateAssignment} teacherId={currentUser.id} teacherName={currentUser.name}/>}
            {modal.type === 'edit-assignment' && <AssignmentCreator onClose={() => setModal({ type: null })} onSave={handleUpdateAssignment} teacherId={currentUser.id} teacherName={currentUser.name} assignmentToEdit={modal.data}/>}
            {modal.type === 'take-assignment' && <AssignmentTaker assignment={modal.data} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitAssignment}/>}
            {modal.type === 'create-exam' && <ExamCreator onClose={() => setModal({ type: null })} onCreate={handleCreateExam} teacherId={currentUser.id} teacherName={currentUser.name}/>}
            {modal.type === 'take-exam' && <ExamTaker exam={modal.data.exam} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitExam} attemptNumber={modal.data.attemptNumber}/>}
            {modal.type === 'view-submissions' && <ViewSubmissions item={modal.data.item} submissions={modal.data.itemType === 'assignment' ? submissions.filter(s => s.assignmentId === modal.data.item.id) : examSubmissions.filter(s => s.examId === modal.data.item.id)} onClose={() => setModal({ type: null })} onGrade={(sub) => setModal({ type: 'grade-submission', data: { submission: sub, item: modal.data.item, itemType: modal.data.itemType, }})}/>}
            {modal.type === 'grade-submission' && <GradeSubmission item={modal.data.item} submission={modal.data.submission} itemType={modal.data.itemType} onClose={() => setModal({ type: 'view-submissions', data: { item: modal.data.item, itemType: modal.data.itemType } })} onSaveGrade={handleGradeSubmission}/>}
            {paymentModalData && <PaymentCheckout paymentDetails={paymentModalData} walletBalance={wallets.find(w => w.userId === currentUser.id)?.balance || 0} onClose={() => setPaymentModalData(null)} onConfirmPayment={handleConfirmPayment}/>}
            {isVideoCallActive && <VideoCallView onClose={() => setIsVideoCallActive(false)} />}
            {isUserCreatorOpen && <UserCreator onClose={() => setIsUserCreatorOpen(false)} onCreateUser={handleCreateUserByAdmin}/>}
            {manageAdminsModalGroup && <ManageChatAdmins group={manageAdminsModalGroup} allUsers={users} onClose={() => setManageAdminsModalGroup(null)} onSave={handleUpdateChatAdmins}/>}
            {manageChatSettingsModalGroup && <ChatSettingsModal group={manageChatSettingsModalGroup} onClose={() => setManageChatSettingsModalGroup(null)} onSave={handleUpdateChatLock} />}
            {modal.type === 'upload-material' && <MaterialUploader currentUser={currentUser} courses={courses} onClose={() => setModal({ type: null })} onUpload={handleUploadMaterial} />}
            {modal.type === 'register-hostel' && <HostelRegistrationForm onClose={() => setModal({ type: null })} onRegister={handleRegisterHostel} />}
            {modal.type === 'create-listing' && <ProductListingForm onClose={() => setModal({ type: null })} onSave={handleCreateListing} />}
            {modal.type === 'edit-listing' && <ProductListingForm onClose={() => setModal({ type: null })} onSave={handleUpdateListing} listingToEdit={modal.data} />}
            {modal.type === 'create-event' && <EventCreator onClose={() => setModal({type: null})} onCreate={handleCreateEvent} currentUser={currentUser} />}
            {modal.type === 'register-service' && <ServiceRegistrationForm onClose={() => setModal({type: null})} onRegister={handleRegisterService} />}
            {modal.type === 'event-details' && <EventDetailsView event={modal.data} currentUser={currentUser} registrations={eventRegistrations} ticketPurchases={eventTicketPurchases} services={registeredServices} bookings={eventBookings} onBookService={handleInitiateEventBooking} onInitiateTicketPurchase={handleInitiateTicketPurchase} onClose={() => setModal({ type: null })} onRegister={handleRegisterForEvent} setActiveView={setActiveView} />}
            {modal.type === 'book-uploader' && <BookUploader onClose={() => setModal({type: null})} onCreateBook={handleCreateBook} />}
            {modal.type === 'book-reader' && <BookReader book={modal.data.book} progress={modal.data.progress} currentUser={currentUser} onClose={() => setModal({type: null})} onProgressUpdate={handleUpdateReadingProgress} onCreateReview={handleCreateBookReview} />}
            {modal.type === 'book-request-form' && <BookRequestForm onClose={() => setModal({type: null})} onCreateRequest={handleCreateBookRequest} />}
            {modal.type === 'book-request-manager' && <BookRequestManager requests={bookRequests} onClose={() => setModal({type: null})} onUpdateStatus={handleUpdateBookRequestStatus} />}
        </div>
    );
}