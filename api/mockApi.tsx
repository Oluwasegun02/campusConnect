import { User, Assignment, Submission, Exam, ExamSubmission, ChatGroup, ChatMessage, AttendanceRecord, Course, CourseRegistration, FeeStatement, PaymentRecord } from '../types';
import { MOCK_USERS, MOCK_CHAT_GROUPS, MOCK_CHAT_MESSAGES, MOCK_COURSES, MOCK_FEE_STATEMENTS } from '../constants';

// --- HELPERS ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
    USERS: 'users',
    CURRENT_USER: 'currentUser',
    ASSIGNMENTS: 'assignments',
    SUBMISSIONS: 'submissions',
    EXAMS: 'exams',
    EXAM_SUBMISSIONS: 'examSubmissions',
    CHAT_GROUPS: 'chatGroups',
    CHAT_MESSAGES: 'chatMessages',
    ATTENDANCE: 'attendanceRecords',
    COURSES: 'courses',
    REGISTRATIONS: 'courseRegistrations',
    FEES: 'feeStatements',
    PAYMENTS: 'paymentRecords',
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key “${key}”:`, error);
    }
};

const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) saveToStorage(STORAGE_KEYS.USERS, MOCK_USERS);
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) saveToStorage(STORAGE_KEYS.ASSIGNMENTS, []);
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) saveToStorage(STORAGE_KEYS.SUBMISSIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) saveToStorage(STORAGE_KEYS.EXAMS, []);
    if (!localStorage.getItem(STORAGE_KEYS.EXAM_SUBMISSIONS)) saveToStorage(STORAGE_KEYS.EXAM_SUBMISSIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_GROUPS)) saveToStorage(STORAGE_KEYS.CHAT_GROUPS, MOCK_CHAT_GROUPS);
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, MOCK_CHAT_MESSAGES);
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) saveToStorage(STORAGE_KEYS.ATTENDANCE, []);
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) saveToStorage(STORAGE_KEYS.COURSES, MOCK_COURSES);
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) saveToStorage(STORAGE_KEYS.REGISTRATIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.FEES)) saveToStorage(STORAGE_KEYS.FEES, MOCK_FEE_STATEMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) saveToStorage(STORAGE_KEYS.PAYMENTS, []);
};

initializeStorage();

// --- API FUNCTIONS ---

// Auth
export const getCurrentUser = async (): Promise<User | null> => {
    await sleep(100);
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const login = async (email: string, password: string): Promise<User> => {
    await sleep(500);
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
        return user;
    }
    throw new Error('Invalid email or password.');
};

export const signup = async (userData: Omit<User, 'id'>): Promise<User> => {
    await sleep(500);
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
    }
    const newUser = { ...userData, id: `user-${Date.now()}` };
    const updatedUsers = [...users, newUser];
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
};

export const logout = async (): Promise<void> => {
    await sleep(200);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
};

// Generic fetcher for all data types
const fetchData = async <T,>(key: string, defaultValue: T[] = []): Promise<T[]> => {
    await sleep(300);
    return getFromStorage<T[]>(key, defaultValue);
};

// Generic creator
const createData = async <T,>(key: string, newItem: T): Promise<T> => {
    await sleep(400);
    const items = getFromStorage<T[]>(key, []);
    saveToStorage(key, [...items, newItem]);
    return newItem;
};

// Generic updater
const updateData = async <T extends {id: string},>(key: string, updatedItem: T): Promise<T> => {
    await sleep(400);
    const items = getFromStorage<T[]>(key, []);
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    saveToStorage(key, updatedItems);
    return updatedItem;
};

// Generic deleter
const deleteData = async <T extends {id: string},>(key: string, itemId: string): Promise<void> => {
    await sleep(400);
    const items = getFromStorage<T[]>(key, []);
    const updatedItems = items.filter(item => item.id !== itemId);
    saveToStorage(key, updatedItems);
};

// Data-specific API exports
export const getUsers = () => fetchData<User>(STORAGE_KEYS.USERS);
export const createUser = (user: User) => createData<User>(STORAGE_KEYS.USERS, user);
export const deleteUser = (userId: string) => deleteData<User>(STORAGE_KEYS.USERS, userId);

export const getAssignments = () => fetchData<Assignment>(STORAGE_KEYS.ASSIGNMENTS);
export const createAssignment = (assignment: Assignment) => createData<Assignment>(STORAGE_KEYS.ASSIGNMENTS, assignment);
export const updateAssignment = (assignment: Assignment) => updateData<Assignment>(STORAGE_KEYS.ASSIGNMENTS, assignment);
export const deleteAssignment = (id: string) => deleteData<Assignment>(STORAGE_KEYS.ASSIGNMENTS, id);

export const getSubmissions = () => fetchData<Submission>(STORAGE_KEYS.SUBMISSIONS);
export const createSubmission = (submission: Submission) => createData<Submission>(STORAGE_KEYS.SUBMISSIONS, submission);
export const updateSubmission = (submission: Submission) => updateData<Submission>(STORAGE_KEYS.SUBMISSIONS, submission);

export const getExams = () => fetchData<Exam>(STORAGE_KEYS.EXAMS);
export const createExam = (exam: Exam) => createData<Exam>(STORAGE_KEYS.EXAMS, exam);
export const deleteExam = (id: string) => deleteData<Exam>(STORAGE_KEYS.EXAMS, id);

export const getExamSubmissions = () => fetchData<ExamSubmission>(STORAGE_KEYS.EXAM_SUBMISSIONS);
export const createExamSubmission = (submission: ExamSubmission) => createData<ExamSubmission>(STORAGE_KEYS.EXAM_SUBMISSIONS, submission);
export const updateExamSubmission = (submission: ExamSubmission) => updateData<ExamSubmission>(STORAGE_KEYS.EXAM_SUBMISSIONS, submission);

export const getChatGroups = () => fetchData<ChatGroup>(STORAGE_KEYS.CHAT_GROUPS);
export const updateChatGroup = (group: ChatGroup) => updateData<ChatGroup>(STORAGE_KEYS.CHAT_GROUPS, group);

export const getChatMessages = () => fetchData<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES);
export const createChatMessage = (message: ChatMessage) => createData<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES, message);

export const getAttendanceRecords = () => fetchData<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE);
export const saveAttendanceRecords = async (records: AttendanceRecord[], date: string) => {
    await sleep(500);
    const allRecords = await getAttendanceRecords();
    const otherDateRecords = allRecords.filter(r => r.date !== date);
    const updatedRecords = [...otherDateRecords, ...records];
    saveToStorage(STORAGE_KEYS.ATTENDANCE, updatedRecords);
};

export const getCourses = () => fetchData<Course>(STORAGE_KEYS.COURSES);

export const getCourseRegistrations = () => fetchData<CourseRegistration>(STORAGE_KEYS.REGISTRATIONS);
export const saveCourseRegistrations = async (registrations: CourseRegistration[]) => {
    await sleep(400);
    const allRegs = await getCourseRegistrations();
    const studentId = registrations[0]?.studentId;
    const courseIds = registrations.map(r => r.courseId);
    
    const otherStudentRegs = allRegs.filter(r => r.studentId !== studentId);
    const currentStudentRegs = allRegs.filter(r => r.studentId === studentId && !courseIds.includes(r.courseId));

    const updatedRegs = [...otherStudentRegs, ...currentStudentRegs, ...registrations];
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, updatedRegs);
};

export const getFeeStatements = () => fetchData<FeeStatement>(STORAGE_KEYS.FEES);
export const updateFeeStatement = (statement: FeeStatement) => updateData<FeeStatement>(STORAGE_KEYS.FEES, statement);

export const getPaymentRecords = () => fetchData<PaymentRecord>(STORAGE_KEYS.PAYMENTS);
export const createPaymentRecord = (record: PaymentRecord) => createData<PaymentRecord>(STORAGE_KEYS.PAYMENTS, record);
