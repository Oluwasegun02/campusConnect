import React from 'react';
import { User, UserRole, Exam, ExamSubmission } from '../types';
import { PlusCircleIcon, TrashIcon, ClockIcon, PencilIcon } from '../constants';

interface ExamsViewProps {
    currentUser: User;
    exams: Exam[];
    examSubmissions: ExamSubmission[];
    onTakeExam: (exam: Exam, attemptNumber: number) => void;
    onCreateExam: () => void;
    onViewSubmissions: (item: Exam, itemType: 'exam') => void;
    onDeleteExam: (examId: string) => void;
}

const formatExamTime = (isoString: string) => new Date(isoString).toLocaleString();

export const ExamsView: React.FC<ExamsViewProps> = ({ currentUser, exams, examSubmissions, onTakeExam, onCreateExam, onViewSubmissions, onDeleteExam }) => {
    
    // --- TEACHER VIEW ---
    if (currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.ICT_STAFF) {
        const teacherExams = exams.filter(e => e.creatorId === currentUser.id || currentUser.role === UserRole.ICT_STAFF);

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800">My Exams</h2>
                    <button onClick={onCreateExam} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>Create Exam</span>
                    </button>
                </div>
                {teacherExams.length > 0 ? (
                    teacherExams.map(exam => {
                         const examSubs = examSubmissions.filter(s => s.examId === exam.id);
                         return (
                            <div key={exam.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800">{exam.title} ({exam.courseCode})</h3>
                                    <p className="text-sm text-slate-500">
                                        Active from {formatExamTime(exam.startTime)} to {formatExamTime(exam.endTime)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onViewSubmissions(exam, 'exam')} className="text-sm font-semibold text-primary-600 hover:underline">
                                        {examSubs.length} Submissions
                                    </button>
                                    <button onClick={() => onDeleteExam(exam.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p>You have not created any exams yet.</p>
                )}
            </div>
        );
    }

    // --- STUDENT VIEW ---
    const studentExams = exams.filter(e => 
        e.targetDepartments.includes(currentUser.department) &&
        e.targetLevels.includes(currentUser.level)
    );

    const now = new Date();
    const activeExams = studentExams.filter(e => new Date(e.startTime) <= now && new Date(e.endTime) >= now);
    const upcomingExams = studentExams.filter(e => new Date(e.startTime) > now);
    const completedExams = studentExams.filter(e => new Date(e.endTime) < now);

    const ExamCard: React.FC<{ exam: Exam }> = ({ exam }) => {
        const mySubmissions = examSubmissions.filter(s => s.examId === exam.id && s.studentId === currentUser.id);
        const lastSubmission = mySubmissions.sort((a,b) => b.attemptNumber - a.attemptNumber)[0];
        const canRetake = lastSubmission &&
                          exam.retakePolicy.allowed &&
                          lastSubmission.grade !== undefined &&
                          lastSubmission.grade < exam.retakePolicy.passingGradePercentage &&
                          mySubmissions.length < exam.retakePolicy.maxAttempts;

        return (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-800">{exam.title}</h3>
                    <p className="text-sm text-slate-500">{exam.courseCode} | {exam.durationMinutes} mins</p>
                    <p className="text-xs text-slate-400 mt-2">{exam.totalMarks} Marks</p>
                </div>
                <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-600">
                            {new Date(exam.startTime) > now ? 'Starts:' : 'Ends:'}
                        </span>
                        <span className="text-slate-600">
                            {new Date(exam.startTime) > now ? formatExamTime(exam.startTime) : formatExamTime(exam.endTime)}
                        </span>
                    </div>
                    {lastSubmission ? (
                        canRetake ? (
                            <button onClick={() => onTakeExam(exam, mySubmissions.length + 1)} className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600">
                                Retake Exam (Attempt {mySubmissions.length + 1})
                            </button>
                        ) : (
                             <div className="w-full text-center bg-green-100 text-green-800 font-bold py-2 rounded-lg">
                                Submitted (Grade: {lastSubmission.grade !== undefined ? `${lastSubmission.grade}/${exam.totalMarks}`: 'Pending'})
                            </div>
                        )
                    ) : (
                        <button onClick={() => onTakeExam(exam, 1)} disabled={new Date(exam.startTime) > now || new Date(exam.endTime) < now} className="w-full bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 disabled:bg-slate-300">
                            {new Date(exam.startTime) > now ? 'Upcoming' : new Date(exam.endTime) < now ? 'Completed' : 'Take Exam'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">My Exams</h2>
            
            {(['active', 'upcoming', 'completed'] as const).map(category => {
                const examList = { active: activeExams, upcoming: upcomingExams, completed: completedExams }[category];
                if (examList.length === 0) return null;
                return (
                    <div key={category}>
                        <h3 className="text-xl font-bold text-slate-700 capitalize mb-4 pb-2 border-b">{category} Exams</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examList.map(exam => <ExamCard key={exam.id} exam={exam} />)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
