export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ICT_STAFF = 'ICT Staff',
  VISITOR = 'Visitor',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  level: number;
  profilePicture?: string; // base64 string
  // New fields for Marketplace
  isVerifiedSeller?: boolean;
  sellerBio?: string;
  sellerApplicationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

export enum AssignmentType {
  THEORY = 'Theory',
  OBJECTIVE = 'Objective',
}

export enum AssignmentPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface ObjectiveQuestion {
  id: string;
  questionText: string;
  image?: string; // base64 string
  options: string[];
  correctAnswerIndex: number;
}

// New type for a single rubric item
export interface RubricItem {
  id: string;
  description: string;
  marks: number;
}

// New type for structured theory questions
export interface TheoryQuestion {
  id: string;
  questionText: string;
  image?: string; // base64 string
  marks: number;
  rubric?: RubricItem[]; // Optional grading rubric
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  objectiveQuestions: ObjectiveQuestion[];
  theoryQuestions: TheoryQuestion[];
  dueDate: string;
  creatorId: string;
  creatorName: string;
  targetDepartments: string[];
  targetLevels: number[];
  totalMarks: number;
  priority: AssignmentPriority;
}

// New type for structured theory answers
export interface TheoryAnswer {
  questionId: string;
  text: string;
  image?: string; // base64 string
  // New fields for file submissions
  fileName?: string;
  fileType?: string;
  fileData?: string; // base64 encoded
}


export interface Submission {
  id:string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: number[] | TheoryAnswer[]; // Objective answers are indices (number), theory are structured objects
  grade?: number;
}

export interface ExamRetakePolicy {
  allowed: boolean;
  maxAttempts: number;
  passingGradePercentage: number; // e.g., 40 for 40%
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: AssignmentType; // Re-use this enum (Theory/Objective)
  questions: ObjectiveQuestion[];
  startTime: string; // ISO string
  endTime: string;   // ISO string
  durationMinutes: number;
  creatorId: string;
  creatorName: string;
  targetDepartments: string[];
  targetLevels: number[];
  totalMarks: number;
  retakePolicy: ExamRetakePolicy;
  shuffleQuestions: boolean; // New field for question shuffling
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string; // ISO string
  submittedAt: string; // ISO string
  answers: (string | number)[];
  grade?: number;
  attemptNumber: number;
}

// New Types for Chat and Attendance
export interface ChatGroup {
  id: string;
  name: string;
  // For simplicity, access is determined by department/level.
  // A real app would have member lists.
  department?: string; // e.g., 'Computer Science'
  level?: number;      // e.g., 300
  adminIds?: string[]; // New: List of user IDs who are admins
  isEventGroup?: boolean;
  eventId?: string;
  isLocked: boolean;
  // New fields for direct messaging
  isPrivate?: boolean;
  members?: string[]; // [userId1, userId2]
  relatedListingId?: string; // Link to marketplace item
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  timestamp: string; // ISO String
  type: 'text' | 'voice-note' | 'image';
  text: string; // For text messages, can be empty for voice/image notes.
  audioData?: string; // base64 string for audio
  audioDuration?: number; // duration in seconds
  imageData?: string; // base64 string for image
  fileName?: string; // for downloadable images
}

export interface AttendanceRecord {
  id: string; // Composite key: `${studentId}-${courseId}-${date}`
  studentId: string;
  courseId: string; // New field for course-specific attendance
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
  markedById: string;
}

// New types for Course Registration
export interface Course {
  id: string;
  code: string; // e.g., CS301
  title: string;
  description: string;
  department: string;
  level: number;
  credits: number;
}

export interface CourseRegistration {
  id: string; // Composite key: `${studentId}-${courseId}`
  studentId: string;
  courseId: string;
  registeredAt: string; // ISO String
}

// New type for course materials
export interface CourseMaterial {
  id: string;
  courseId: string;
  uploaderId: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileData: string; // base64 encoded
  uploadedAt: string; // ISO String
}

// New Types for Payment Portal
export interface FeeItem {
  id: string;
  description: string;
  amount: number;
}

export interface FeeStatement {
  id: string;
  studentId: string;
  session: string; // e.g., "2023-2024"
  items: FeeItem[];
  totalAmount: number;
  amountPaid: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
}

export interface PaymentRecord {
  id: string;
  feeStatementId: string;
  studentId: string;
  amount: number;
  paymentDate: string; // ISO String
  method: string; // e.g., "Card", "Bank Transfer"
  transactionId: string;
}

export interface VisitorPayment {
    id: string;
    visitorId: string;
    feeType: 'library_access';
    amountPaid: number;
    paidAt: string; // ISO string
}

// New Types for Accommodation Portal
export interface Hostel {
  id: string;
  name: string;
  ownerId: string; // 'school' for official hostels, or a userId
  location: 'On-Campus' | 'Off-Campus';
  address: string;
  description: string;
  images: string[]; // array of base64 strings or URLs
  amenities: string[];
  rules: string;
  contactPerson: string;
  contactPhone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  type: 'Single' | 'Double' | 'Quad';
  pricing: { duration: string; price: number }[]; // e.g., [{ duration: 'Session', price: 800 }]
  isAvailable: boolean;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Allocated';

export interface AccommodationApplication {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  roomId: string;
  duration: string;
  amountPaid: number;
  bookedAt: string; // ISO String
}

// New Types for Student Wallet
export interface UserWallet {
  id: string; // same as user.id
  userId: string;
  balance: number;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'payment' | 'sale_credit';
  amount: number;
  description: string;
  timestamp: string; // ISO String
}

export type ItemCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';

// New Types for Marketplace
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string; // base64
  condition: ItemCondition; // New field for item condition
  createdAt: string; // ISO String
  isAvailable: boolean;
}

export interface MarketplaceOrder {
  id: string;
  buyerId: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  amount: number;
  orderedAt: string; // ISO String
}

// New Types for Event/Booking Portal
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO String
  type: 'Online' | 'Physical';
  hosts: string[]; // Array of user IDs
  creatorId: string;
  creatorName: string;
  chatGroupId?: string;
  location?: string;
  videoLink?: string;
  ticketPrice?: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string; // ISO String
}

export interface EventTicketPurchase {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  quantity: number;
  amountPaid: number;
  purchasedAt: string;
}

export type ServiceCategory = 'Ride' | 'Food' | 'Table Booking' | 'Merchandise' | 'Photography';

export interface RegisteredService {
  id: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  description: string;
  price: number;
  category: ServiceCategory;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface EventBooking {
  id: string;
  eventId: string;
  userId: string;
  serviceId: string;
  details: any; // e.g., { quantity: 2 } for tickets
  amount: number;
  bookedAt: string; // ISO String
}

// New Types for Library
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string; // base64
  content: string; // Could be a very long string with page markers
  uploaderId: string;
  uploadedAt: string; // ISO String
  ratings: number[]; // e.g., [5, 4, 5]
  reviews: BookReview[];
}

export interface ReadingProgress {
  id: string; // composite: `${userId}-${bookId}`
  userId: string;
  bookId: string;
  currentPage: number;
  lastReadAt: string; // ISO String
}

export interface BookRequest {
    id: string;
    userId: string;
    userName: string;
    title: string;
    author: string;
    reason: string;
    status: 'Pending' | 'Acquired' | 'Rejected';
    requestedAt: string; // ISO String
}

export interface BookReview {
    id: string;
    bookId: string;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string; // ISO String
}
