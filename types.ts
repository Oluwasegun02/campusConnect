export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ICT_STAFF = 'ICT Staff',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  level: number;
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
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  timestamp: string; // ISO String
  type: 'text' | 'voice-note';
  text: string; // For text messages, can be empty for voice notes.
  audioData?: string; // base64 string for audio
  audioDuration?: number; // duration in seconds
}

export interface AttendanceRecord {
  id: string; // Composite key: `${studentId}-${date}`
  studentId: string;
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