import { User, Assignment, Submission, Exam, ExamSubmission, ChatGroup, ChatMessage, AttendanceRecord, Course, CourseRegistration, FeeStatement, PaymentRecord, Hostel, Room, AccommodationApplication, CourseMaterial, UserWallet, WalletTransaction, MarketplaceListing, MarketplaceOrder, Event, EventRegistration, RegisteredService, EventBooking, LibraryBook, ReadingProgress, VisitorPayment, BookRequest, BookReview, EventTicketPurchase } from '../types';
import { MOCK_USERS, MOCK_CHAT_GROUPS, MOCK_CHAT_MESSAGES, MOCK_COURSES, MOCK_FEE_STATEMENTS, MOCK_HOSTELS, MOCK_ROOMS, MOCK_WALLETS, MOCK_EXAMS, MOCK_EXAM_SUBMISSIONS, MOCK_MARKETPLACE_LISTINGS, MOCK_EVENTS, MOCK_REGISTERED_SERVICES, MOCK_LIBRARY_BOOKS, MOCK_BOOK_REQUESTS, MOCK_BOOK_REVIEWS, MOCK_TICKET_PURCHASES } from '../constants';

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
    HOSTELS: 'hostels',
    ROOMS: 'rooms',
    ACCOMMODATION_APPLICATIONS: 'accommodationApplications',
    COURSE_MATERIALS: 'courseMaterials',
    WALLETS: 'wallets',
    WALLET_TRANSACTIONS: 'walletTransactions',
    MARKETPLACE_LISTINGS: 'marketplaceListings',
    MARKETPLACE_ORDERS: 'marketplaceOrders',
    EVENTS: 'events',
    EVENT_REGISTRATIONS: 'eventRegistrations',
    REGISTERED_SERVICES: 'registeredServices',
    EVENT_BOOKINGS: 'eventBookings',
    LIBRARY_BOOKS: 'libraryBooks',
    READING_PROGRESS: 'readingProgress',
    VISITOR_PAYMENTS: 'visitorPayments',
    BOOK_REQUESTS: 'bookRequests',
    BOOK_REVIEWS: 'bookReviews',
    EVENT_TICKET_PURCHASES: 'eventTicketPurchases',
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue; // Explicitly handle case where key doesn't exist
        const parsed = JSON.parse(item);
        // Handle case where stored value is the string "null"
        return parsed === null ? defaultValue : parsed;
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
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) saveToStorage(STORAGE_KEYS.EXAMS, MOCK_EXAMS);
    if (!localStorage.getItem(STORAGE_KEYS.EXAM_SUBMISSIONS)) saveToStorage(STORAGE_KEYS.EXAM_SUBMISSIONS, MOCK_EXAM_SUBMISSIONS);
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_GROUPS)) saveToStorage(STORAGE_KEYS.CHAT_GROUPS, MOCK_CHAT_GROUPS);
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, MOCK_CHAT_MESSAGES);
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) saveToStorage(STORAGE_KEYS.ATTENDANCE, []);
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) saveToStorage(STORAGE_KEYS.COURSES, MOCK_COURSES);
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) saveToStorage(STORAGE_KEYS.REGISTRATIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.FEES)) saveToStorage(STORAGE_KEYS.FEES, MOCK_FEE_STATEMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) saveToStorage(STORAGE_KEYS.PAYMENTS, []);
    if (!localStorage.getItem(STORAGE_KEYS.HOSTELS)) saveToStorage(STORAGE_KEYS.HOSTELS, MOCK_HOSTELS);
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) saveToStorage(STORAGE_KEYS.ROOMS, MOCK_ROOMS);
    if (!localStorage.getItem(STORAGE_KEYS.ACCOMMODATION_APPLICATIONS)) saveToStorage(STORAGE_KEYS.ACCOMMODATION_APPLICATIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.COURSE_MATERIALS)) saveToStorage(STORAGE_KEYS.COURSE_MATERIALS, []);
    if (!localStorage.getItem(STORAGE_KEYS.WALLETS)) saveToStorage(STORAGE_KEYS.WALLETS, MOCK_WALLETS);
    if (!localStorage.getItem(STORAGE_KEYS.WALLET_TRANSACTIONS)) saveToStorage(STORAGE_KEYS.WALLET_TRANSACTIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.MARKETPLACE_LISTINGS)) saveToStorage(STORAGE_KEYS.MARKETPLACE_LISTINGS, MOCK_MARKETPLACE_LISTINGS);
    if (!localStorage.getItem(STORAGE_KEYS.MARKETPLACE_ORDERS)) saveToStorage(STORAGE_KEYS.MARKETPLACE_ORDERS, []);
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) saveToStorage(STORAGE_KEYS.EVENTS, MOCK_EVENTS);
    if (!localStorage.getItem(STORAGE_KEYS.EVENT_REGISTRATIONS)) saveToStorage(STORAGE_KEYS.EVENT_REGISTRATIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.REGISTERED_SERVICES)) saveToStorage(STORAGE_KEYS.REGISTERED_SERVICES, MOCK_REGISTERED_SERVICES);
    if (!localStorage.getItem(STORAGE_KEYS.EVENT_BOOKINGS)) saveToStorage(STORAGE_KEYS.EVENT_BOOKINGS, []);
    if (!localStorage.getItem(STORAGE_KEYS.LIBRARY_BOOKS)) saveToStorage(STORAGE_KEYS.LIBRARY_BOOKS, MOCK_LIBRARY_BOOKS);
    if (!localStorage.getItem(STORAGE_KEYS.READING_PROGRESS)) saveToStorage(STORAGE_KEYS.READING_PROGRESS, []);
    if (!localStorage.getItem(STORAGE_KEYS.VISITOR_PAYMENTS)) saveToStorage(STORAGE_KEYS.VISITOR_PAYMENTS, []);
    if (!localStorage.getItem(STORAGE_KEYS.BOOK_REQUESTS)) saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, MOCK_BOOK_REQUESTS);
    if (!localStorage.getItem(STORAGE_KEYS.BOOK_REVIEWS)) saveToStorage(STORAGE_KEYS.BOOK_REVIEWS, MOCK_BOOK_REVIEWS);
    if (!localStorage.getItem(STORAGE_KEYS.EVENT_TICKET_PURCHASES)) saveToStorage(STORAGE_KEYS.EVENT_TICKET_PURCHASES, MOCK_TICKET_PURCHASES);
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
export const updateUser = (user: User) => updateData<User>(STORAGE_KEYS.USERS, user);
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
export const deleteChatMessage = (messageId: string) => deleteData<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES, messageId);

export const getOrCreatePrivateChat = async (user1Id: string, user2Id: string, listing: MarketplaceListing): Promise<string> => {
    await sleep(400);
    const allGroups = getFromStorage<ChatGroup[]>(STORAGE_KEYS.CHAT_GROUPS, []);
    
    // Check if a chat for this listing between these users already exists
    const existingGroup = allGroups.find(g => 
        g.isPrivate && 
        g.relatedListingId === listing.id &&
        g.members?.includes(user1Id) && 
        g.members?.includes(user2Id)
    );

    if (existingGroup) {
        return existingGroup.id;
    }

    // Create a new one
    const user1 = getFromStorage<User[]>(STORAGE_KEYS.USERS, []).find(u => u.id === user1Id);
    const user2 = getFromStorage<User[]>(STORAGE_KEYS.USERS, []).find(u => u.id === user2Id);

    const newGroup: ChatGroup = {
        id: `dm-${user1Id}-${user2Id}-${listing.id}`,
        name: `Inquiry: ${listing.title}`,
        isPrivate: true,
        members: [user1Id, user2Id],
        relatedListingId: listing.id,
        isLocked: false,
        adminIds: [],
    };

    saveToStorage(STORAGE_KEYS.CHAT_GROUPS, [...allGroups, newGroup]);
    
    // Add an initial system message
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      groupId: newGroup.id,
      senderId: 'system',
      senderName: 'System',
      timestamp: new Date().toISOString(),
      type: 'text',
      text: `${user1?.name} started a chat with ${user2?.name} about "${listing.title}".`
    };
    const allMessages = getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, [...allMessages, initialMessage]);

    return newGroup.id;
};


export const getAttendanceRecords = () => fetchData<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE);
export const saveAttendanceRecords = async (records: AttendanceRecord[], date: string, courseId: string) => {
    await sleep(500);
    const allRecords = await getAttendanceRecords();
    // Filter out any existing records for THIS specific date and course
    const otherRecords = allRecords.filter(r => r.date !== date || r.courseId !== courseId);
    const updatedRecords = [...otherRecords, ...records];
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

// Accommodation API
export const getHostels = () => fetchData<Hostel>(STORAGE_KEYS.HOSTELS);
export const createHostel = (hostel: Hostel) => createData<Hostel>(STORAGE_KEYS.HOSTELS, hostel);
export const updateHostel = (hostel: Hostel) => updateData<Hostel>(STORAGE_KEYS.HOSTELS, hostel);
export const getRooms = () => fetchData<Room>(STORAGE_KEYS.ROOMS);
export const updateRoom = (room: Room) => updateData<Room>(STORAGE_KEYS.ROOMS, room);

export const getAccommodationApplications = () => fetchData<AccommodationApplication>(STORAGE_KEYS.ACCOMMODATION_APPLICATIONS);
export const createAccommodationApplication = (application: AccommodationApplication) => createData<AccommodationApplication>(STORAGE_KEYS.ACCOMMODATION_APPLICATIONS, application);
export const updateAccommodationApplication = (application: AccommodationApplication) => updateData<AccommodationApplication>(STORAGE_KEYS.ACCOMMODATION_APPLICATIONS, application);

// Course Materials API
export const getCourseMaterials = () => fetchData<CourseMaterial>(STORAGE_KEYS.COURSE_MATERIALS);
export const createCourseMaterial = (material: CourseMaterial) => createData<CourseMaterial>(STORAGE_KEYS.COURSE_MATERIALS, material);
export const deleteCourseMaterial = (id: string) => deleteData<CourseMaterial>(STORAGE_KEYS.COURSE_MATERIALS, id);

// Wallet API
export const getWallets = () => fetchData<UserWallet>(STORAGE_KEYS.WALLETS);
export const updateWallet = (wallet: UserWallet) => updateData<UserWallet>(STORAGE_KEYS.WALLETS, wallet);
export const getWalletTransactions = () => fetchData<WalletTransaction>(STORAGE_KEYS.WALLET_TRANSACTIONS);
export const createWalletTransaction = (transaction: WalletTransaction) => createData<WalletTransaction>(STORAGE_KEYS.WALLET_TRANSACTIONS, transaction);

// Marketplace API
export const getMarketplaceListings = () => fetchData<MarketplaceListing>(STORAGE_KEYS.MARKETPLACE_LISTINGS);
export const createMarketplaceListing = (listing: MarketplaceListing) => createData<MarketplaceListing>(STORAGE_KEYS.MARKETPLACE_LISTINGS, listing);
export const updateMarketplaceListing = (listing: MarketplaceListing) => updateData<MarketplaceListing>(STORAGE_KEYS.MARKETPLACE_LISTINGS, listing);
export const deleteMarketplaceListing = (id: string) => deleteData<MarketplaceListing>(STORAGE_KEYS.MARKETPLACE_LISTINGS, id);

export const getMarketplaceOrders = () => fetchData<MarketplaceOrder>(STORAGE_KEYS.MARKETPLACE_ORDERS);
export const createMarketplaceOrder = (order: MarketplaceOrder) => createData<MarketplaceOrder>(STORAGE_KEYS.MARKETPLACE_ORDERS, order);

// Events API
export const getEvents = () => fetchData<Event>(STORAGE_KEYS.EVENTS);

export const createEvent = async (event: Event, isChatLocked: boolean): Promise<Event> => {
    await sleep(400);
    let eventToSave = { ...event };
    
    const newChatGroup: ChatGroup = {
        id: `group-evt-${Date.now()}`,
        name: `${event.title} - Event Group`,
        adminIds: event.hosts,
        isEventGroup: true,
        eventId: event.id,
        isLocked: isChatLocked,
    };
    const chatGroups = getFromStorage<ChatGroup[]>(STORAGE_KEYS.CHAT_GROUPS, []);
    saveToStorage(STORAGE_KEYS.CHAT_GROUPS, [...chatGroups, newChatGroup]);
    eventToSave.chatGroupId = newChatGroup.id;
    
    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, []);
    saveToStorage(STORAGE_KEYS.EVENTS, [...events, eventToSave]);

    return eventToSave;
};

export const updateEvent = (event: Event) => updateData<Event>(STORAGE_KEYS.EVENTS, event);
export const deleteEvent = (id: string) => deleteData<Event>(STORAGE_KEYS.EVENTS, id);

export const getEventRegistrations = () => fetchData<EventRegistration>(STORAGE_KEYS.EVENT_REGISTRATIONS);
export const createEventRegistration = (reg: EventRegistration) => createData<EventRegistration>(STORAGE_KEYS.EVENT_REGISTRATIONS, reg);

export const getEventTicketPurchases = () => fetchData<EventTicketPurchase>(STORAGE_KEYS.EVENT_TICKET_PURCHASES);
export const createEventTicketPurchase = (purchase: EventTicketPurchase) => createData<EventTicketPurchase>(STORAGE_KEYS.EVENT_TICKET_PURCHASES, purchase);

export const getRegisteredServices = () => fetchData<RegisteredService>(STORAGE_KEYS.REGISTERED_SERVICES);
export const createRegisteredService = (service: RegisteredService) => createData<RegisteredService>(STORAGE_KEYS.REGISTERED_SERVICES, service);
export const updateRegisteredService = (service: RegisteredService) => updateData<RegisteredService>(STORAGE_KEYS.REGISTERED_SERVICES, service);

export const getEventBookings = () => fetchData<EventBooking>(STORAGE_KEYS.EVENT_BOOKINGS);
export const createEventBooking = (booking: EventBooking) => createData<EventBooking>(STORAGE_KEYS.EVENT_BOOKINGS, booking);

// Library API
export const getLibraryBooks = () => fetchData<LibraryBook>(STORAGE_KEYS.LIBRARY_BOOKS);
export const createLibraryBook = (book: LibraryBook) => createData<LibraryBook>(STORAGE_KEYS.LIBRARY_BOOKS, book);
export const updateLibraryBook = (book: LibraryBook) => updateData<LibraryBook>(STORAGE_KEYS.LIBRARY_BOOKS, book);

export const getReadingProgress = () => fetchData<ReadingProgress>(STORAGE_KEYS.READING_PROGRESS);
export const updateReadingProgress = async (progress: ReadingProgress): Promise<ReadingProgress> => {
    await sleep(200);
    const allProgress = getFromStorage<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, []);
    const existingIndex = allProgress.findIndex(p => p.id === progress.id);
    if (existingIndex > -1) {
        allProgress[existingIndex] = progress;
        saveToStorage(STORAGE_KEYS.READING_PROGRESS, allProgress);
    } else {
        saveToStorage(STORAGE_KEYS.READING_PROGRESS, [...allProgress, progress]);
    }
    return progress;
};

export const getVisitorPayments = () => fetchData<VisitorPayment>(STORAGE_KEYS.VISITOR_PAYMENTS);
export const createVisitorPayment = (payment: VisitorPayment) => createData<VisitorPayment>(STORAGE_KEYS.VISITOR_PAYMENTS, payment);

export const getBookRequests = () => fetchData<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS);
export const createBookRequest = (request: BookRequest) => createData<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS, request);
export const updateBookRequest = (request: BookRequest) => updateData<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS, request);

export const getBookReviews = () => fetchData<BookReview>(STORAGE_KEYS.BOOK_REVIEWS);
export const createBookReview = (review: BookReview) => createData<BookReview>(STORAGE_KEYS.BOOK_REVIEWS, review);