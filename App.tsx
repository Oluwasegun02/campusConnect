import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, UserRole, Assignment, Submission, Exam, ExamSubmission, AssignmentType, AssignmentPriority, ChatGroup, ChatMessage, AttendanceRecord, Course, CourseRegistration, FeeStatement, PaymentRecord } from './types';
import * as api from './api/mockApi';
import {
    HomeIcon, ClipboardListIcon, AcademicCapIcon, UserGroupIcon, LogoutIcon,
    PlusCircleIcon, BookOpenIcon, XIcon, CheckCircleIcon, PencilIcon, ClockIcon,
    ChatBubbleLeftRightIcon, CalendarDaysIcon, Cog6ToothIcon, DocumentPlusIcon,
    CreditCardIcon
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

// Helper components
const Navbar: React.FC<{ user: User; onLogout: () => void; activeView: string }> = ({ user, onLogout, activeView }) => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center shrink-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</h1>
        <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button onClick={onLogout} title="Logout" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors">
                <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
    </header>
);

const Sidebar: React.FC<{ role: UserRole; activeView: string; setActiveView: (view: string) => void; assignmentsDueSoonCount?: number; }> = ({ role, activeView, setActiveView, assignmentsDueSoonCount }) => {
    
    const baseNav = [{ icon: HomeIcon, label: 'Dashboard' }, { icon: ChatBubbleLeftRightIcon, label: 'Chat' }];
    
    let roleNav;
    switch (role) {
        case UserRole.TEACHER:
            roleNav = [
                { icon: ClipboardListIcon, label: 'Assignments' },
                { icon: BookOpenIcon, label: 'Exams' },
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
                { icon: CreditCardIcon, label: 'Payment Portal' },
            ];
            break;
        case UserRole.ICT_STAFF:
             roleNav = [
                { icon: Cog6ToothIcon, label: 'Staff Portal'}
             ];
             break;
        default:
            roleNav = [];
    }

    const navItems = [...baseNav, ...roleNav];

    return (
        <aside className="w-64 bg-slate-800 text-slate-200 p-6 flex flex-col">
            <div className="flex items-center space-x-2 mb-10">
                <AcademicCapIcon className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold">CampusConnect</span>
            </div>
            <nav className="flex-grow">
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
        </aside>
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

    // UI State
    const [activeView, setActiveView] = useState('dashboard');
    const [modal, setModal] = useState<{ type: string | null; data?: any }>({ type: null });
    const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');
    const [assignmentDateFilter, setAssignmentDateFilter] = useState('all');
    const [checkoutModalData, setCheckoutModalData] = useState<{ statementId: string; amount: number } | null>(null);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [isUserCreatorOpen, setIsUserCreatorOpen] = useState(false);
    const [manageAdminsModalGroup, setManageAdminsModalGroup] = useState<ChatGroup | null>(null);

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
                        registrationsData, feesData, paymentsData
                    ] = await Promise.all([
                        api.getUsers(), api.getAssignments(), api.getSubmissions(), api.getExams(), api.getExamSubmissions(),
                        api.getChatGroups(), api.getChatMessages(), api.getAttendanceRecords(), api.getCourses(),
                        api.getCourseRegistrations(), api.getFeeStatements(), api.getPaymentRecords()
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
            setActiveView(user.role === UserRole.ICT_STAFF ? 'staff-portal' : 'dashboard');
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    };

    const handleSignup = async (userData: Omit<User, 'id'>) => {
        setAuthError(null);
        try {
            const newUser = await api.signup(userData);
            setCurrentUser(newUser);
            setActiveView('dashboard');
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

    const handleSubmitExam = async (submission: ExamSubmission) => {
        const exam = exams.find(e => e.id === submission.examId);
        let submissionWithGrade = { ...submission };
        if (exam && exam.type === AssignmentType.OBJECTIVE) {
            let correctAnswers = 0;
            exam.questions.forEach((q, i) => {
                if (submission.answers[i] === q.correctAnswerIndex) correctAnswers++;
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
    
    const handleSendMessage = async (groupId: string, content: { text?: string; audioData?: string; audioDuration?: number }) => {
        if (!currentUser || (!content.text?.trim() && !content.audioData)) return;
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            groupId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: new Date().toISOString(),
            type: content.audioData ? 'voice-note' : 'text',
            text: content.text || '',
            audioData: content.audioData,
            audioDuration: content.audioDuration,
        };
        const created = await api.createChatMessage(newMessage);
        setChatMessages(prev => [...prev, created]);
    };

    const handleSaveAttendance = async (recordsToSave: { studentId: string, status: 'Present' | 'Absent' | 'Late' }[], date: string) => {
        if (!currentUser) return;
        const newRecords: AttendanceRecord[] = recordsToSave.map(r => ({
            id: `${r.studentId}-${date}`,
            ...r,
            date,
            markedById: currentUser.id,
        }));
        await api.saveAttendanceRecords(newRecords, date);
        const otherDateRecords = attendanceRecords.filter(r => r.date !== date);
        setAttendanceRecords([...otherDateRecords, ...newRecords]);
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

    const handleMakePayment = async (statementId: string, amount: number) => {
        if (!currentUser) return;
        const statement = feeStatements.find(s => s.id === statementId);
        if(!statement) return;

        const newAmountPaid = statement.amountPaid + amount;
        const newStatus = newAmountPaid >= statement.totalAmount ? 'Paid' : 'Partially Paid';
        const updatedStatement = { ...statement, amountPaid: newAmountPaid, status: newStatus };
        
        const newPayment: PaymentRecord = {
            id: `pay-${Date.now()}`,
            feeStatementId: statementId,
            studentId: currentUser.id,
            amount,
            paymentDate: new Date().toISOString(),
            method: 'Card (Simulated)',
            transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        };

        const [updatedStmt] = await Promise.all([
            api.updateFeeStatement(updatedStatement),
            api.createPaymentRecord(newPayment)
        ]);
        
        setFeeStatements(prev => prev.map(s => s.id === statementId ? updatedStmt : s));
        setPaymentRecords(prev => [...prev, newPayment]);
        setCheckoutModalData(null);
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
    const getSubmissionForExam = useCallback((examId: string) => examSubmissions.find(s => s.examId === examId && s.studentId === currentUser?.id), [examSubmissions, currentUser]);

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
        const submission = getSubmissionForExam(exam.id);
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        if (submission) {
             return <div className="bg-green-100 text-green-800 p-2 rounded-lg flex items-center justify-center space-x-2"><CheckCircleIcon className="w-5 h-5"/> <span>Submitted {submission.grade !== undefined ? `| Grade: ${submission.grade}/${exam.totalMarks}` : ''}</span></div>
        }
        if (now < startTime) {
            const diff = Math.floor((startTime.getTime() - now.getTime()) / 1000);
            const d = Math.floor(diff / 86400); const h = Math.floor((diff % 86400) / 3600); const m = Math.floor((diff % 3600) / 60); const s = diff % 60;
            return <div className="w-full text-center bg-blue-100 text-blue-800 font-semibold py-2 rounded-lg">Starts in {d > 0 ? `${d}d ` : ''}{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</div>
        }
        if (now > endTime) return <button disabled className="w-full bg-red-400 text-white font-semibold py-2 rounded-lg">Missed</button>;
        return <button onClick={() => setModal({type: 'take-exam', data: exam})} className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition">Start Exam</button>;
    }
    
    const renderContent = () => {
        if (isLoading) return <FullScreenLoader message="Loading your dashboard..." />;
        
        switch (activeView) {
            case 'dashboard':
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
                                    </div>
                               </div>
                           ))}
                        </div>
                         {filteredTeacherAssignments.length === 0 && <p className="text-slate-500 text-center mt-8">You haven't created any assignments yet, or none match your search.</p>}
                    </div>
                );
                const FilterButton: React.FC<{filterValue: string, label: string}> = ({filterValue, label}) => (<button onClick={() => setAssignmentDateFilter(filterValue)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${assignmentDateFilter === filterValue ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>{label}</button>);
                return (
                     <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Assignments</h2>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-slate-100 rounded-lg">
                            <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-lg"><FilterButton filterValue="all" label="All" /><FilterButton filterValue="due-this-week" label="Due this Week" /><FilterButton filterValue="overdue" label="Overdue" /><FilterButton filterValue="completed" label="Completed" /></div>
                            <div className="w-full md:w-1/3"><input type="text" placeholder="Search assignments..." value={assignmentSearchTerm} onChange={e => setAssignmentSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"/></div>
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
                                <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"><h3 className="text-lg font-bold text-slate-800">{exam.title}</h3><p className="text-sm text-slate-500 mt-1">{exam.type} - {exam.durationMinutes} mins</p><div className="text-xs text-slate-500 mt-2 space-y-1"><p>Starts: {new Date(exam.startTime).toLocaleString()}</p><p>Ends: {new Date(exam.endTime).toLocaleString()}</p></div><button onClick={() => setModal({type: 'view-submissions', data: {item: exam, itemType: 'exam'}})} className="w-full mt-4 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition">View Submissions ({examSubmissions.filter(s => s.examId === exam.id).length})</button></div>
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
            case 'course-registration': return <CourseRegistrationView currentUser={currentUser} courses={courses} registrations={courseRegistrations.filter(r => r.studentId === currentUser.id)} onRegister={handleRegisterCourses}/>;
            case 'payment-portal': return <PaymentPortal currentUser={currentUser} feeStatement={feeStatements.find(fs => fs.studentId === currentUser.id)} paymentHistory={paymentRecords.filter(pr => pr.studentId === currentUser.id)} onInitiatePayment={(statementId, amount) => setCheckoutModalData({ statementId, amount })}/>;
            case 'chat': return <ChatView currentUser={currentUser} groups={chatGroups} messages={chatMessages} onSendMessage={handleSendMessage} onStartVideoCall={() => setIsVideoCallActive(true)}/>;
            case 'attendance': return <AttendanceView currentUser={currentUser} allUsers={users} records={attendanceRecords} onSave={handleSaveAttendance}/>;
            case 'staff-portal': return <StaffPortal currentUser={currentUser} users={users} chatGroups={chatGroups} assignments={assignments} exams={exams} submissions={submissions} examSubmissions={examSubmissions} onDeleteUser={handleDeleteUser} onOpenUserCreator={() => setIsUserCreatorOpen(true)} onOpenManageAdmins={setManageAdminsModalGroup} onEditAssignment={(a) => setModal({ type: 'edit-assignment', data: a })} onDeleteAssignment={handleDeleteAssignment} onViewSubmissions={(item, itemType) => setModal({ type: 'view-submissions', data: { item, itemType } })} onDeleteExam={handleDeleteExam}/>
            default: return <div>Select a view</div>;
        }
    };
    
    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar role={currentUser.role} activeView={activeView} setActiveView={setActiveView} assignmentsDueSoonCount={assignmentsDueSoonCount}/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar user={currentUser} onLogout={handleLogout} activeView={activeView} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>

            {modal.type === 'create-assignment' && <AssignmentCreator onClose={() => setModal({ type: null })} onSave={handleCreateAssignment} teacherId={currentUser.id} teacherName={currentUser.name}/>}
            {modal.type === 'edit-assignment' && <AssignmentCreator onClose={() => setModal({ type: null })} onSave={handleUpdateAssignment} teacherId={currentUser.id} teacherName={currentUser.name} assignmentToEdit={modal.data}/>}
            {modal.type === 'take-assignment' && <AssignmentTaker assignment={modal.data} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitAssignment}/>}
            {modal.type === 'create-exam' && <ExamCreator onClose={() => setModal({ type: null })} onCreate={handleCreateExam} teacherId={currentUser.id} teacherName={currentUser.name}/>}
            {modal.type === 'take-exam' && <ExamTaker exam={modal.data} studentId={currentUser.id} studentName={currentUser.name} onClose={() => setModal({ type: null })} onSubmit={handleSubmitExam}/>}
            {modal.type === 'view-submissions' && <ViewSubmissions item={modal.data.item} submissions={modal.data.itemType === 'assignment' ? submissions.filter(s => s.assignmentId === modal.data.item.id) : examSubmissions.filter(s => s.examId === modal.data.item.id)} onClose={() => setModal({ type: null })} onGrade={(sub) => setModal({ type: 'grade-submission', data: { submission: sub, item: modal.data.item, itemType: modal.data.itemType, }})}/>}
            {modal.type === 'grade-submission' && <GradeSubmission item={modal.data.item} submission={modal.data.submission} itemType={modal.data.itemType} onClose={() => setModal({ type: 'view-submissions', data: { item: modal.data.item, itemType: modal.data.itemType } })} onSaveGrade={handleGradeSubmission}/>}
            {checkoutModalData && <PaymentCheckout amount={checkoutModalData.amount} onClose={() => setCheckoutModalData(null)} onConfirmPayment={() => handleMakePayment(checkoutModalData.statementId, checkoutModalData.amount)}/>}
            {isVideoCallActive && <VideoCallView onClose={() => setIsVideoCallActive(false)} />}
            {isUserCreatorOpen && <UserCreator onClose={() => setIsUserCreatorOpen(false)} onCreateUser={handleCreateUserByAdmin}/>}
            {manageAdminsModalGroup && <ManageChatAdmins group={manageAdminsModalGroup} allUsers={users} onClose={() => setManageAdminsModalGroup(null)} onSave={handleUpdateChatAdmins}/>}
        </div>
    );
}
