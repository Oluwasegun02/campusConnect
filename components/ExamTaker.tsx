import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Exam, ExamSubmission, AssignmentType } from '../types';
import { XIcon, ClockIcon } from '../constants';

interface ExamTakerProps {
    exam: Exam;
    studentId: string;
    studentName: string;
    onClose: () => void;
    onSubmit: (submission: Omit<ExamSubmission, 'id' | 'grade'>) => void;
    attemptNumber: number;
}

export const ExamTaker: React.FC<ExamTakerProps> = ({ exam, studentId, studentName, onClose, onSubmit, attemptNumber }) => {
    
    const shuffledQuestions = useMemo(() => {
        const questionsWithOriginalIndex = exam.questions.map((q, index) => ({ ...q, originalIndex: index }));
        if (exam.shuffleQuestions) {
            return questionsWithOriginalIndex.sort(() => Math.random() - 0.5);
        }
        return questionsWithOriginalIndex;
    }, [exam]);

    const [answers, setAnswers] = useState<(string | number)[]>(
        Array(exam.questions.length).fill('')
    );
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
    const [startedAt] = useState(new Date().toISOString());
    const [isClosing, setIsClosing] = useState(false);
    
    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const submitted = useRef(false);

    const handleSubmit = useCallback(() => {
        if (submitted.current) return;
        submitted.current = true;

        const finalSubmission: Omit<ExamSubmission, 'id' | 'grade'> = {
            examId: exam.id,
            studentId,
            studentName,
            startedAt: startedAt,
            submittedAt: new Date().toISOString(),
            answers: answersRef.current,
            attemptNumber: attemptNumber,
        };
        onSubmit(finalSubmission);
    }, [onSubmit, exam.id, studentId, studentName, startedAt, attemptNumber]);
    
    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        };

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleSubmit]);
    
    // Warn user before closing window/tab
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ''; // Required for the prompt to show
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (originalIndex: number, value: string | number) => {
        const newAnswers = [...answers];
        newAnswers[originalIndex] = value;
        setAnswers(newAnswers);
    };
    
    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
    }
    
    const handleCloseAttempt = () => {
        setIsClosing(true);
    };
    
    const handleConfirmCloseAndSubmit = () => {
        handleSubmit();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{exam.title}</h2>
                            <p className="text-sm text-slate-500">{exam.type} - {exam.totalMarks} Marks (Attempt {attemptNumber})</p>
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className={`text-center p-2 rounded-lg transition-colors duration-300 ${timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                               <div className="flex items-center justify-center space-x-2">
                                    <ClockIcon className="w-6 h-6"/>
                                    <span className="text-2xl font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
                               </div>
                               <p className="text-xs uppercase font-semibold">Time Remaining</p>
                            </div>
                            <button onClick={handleCloseAttempt} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                        </div>
                    </div>
                    <form onSubmit={onFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                        <p className="text-slate-600">{exam.description}</p>
                        {exam.type === AssignmentType.THEORY && (
                            <div>
                                <label className="block text-lg font-medium text-slate-700 mb-2">Your Answer</label>
                                <textarea
                                    value={answers[0] as string || ''}
                                    onChange={e => handleAnswerChange(0, e.target.value)}
                                    rows={15}
                                    required
                                    placeholder="Type your answer here..."
                                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                ></textarea>
                            </div>
                        )}
                        {exam.type === AssignmentType.OBJECTIVE && (
                            <div className="space-y-8">
                                {shuffledQuestions.map((q, qIndex) => (
                                    <div key={q.id}>
                                        <p className="font-semibold text-slate-800 mb-2">{qIndex + 1}. {q.questionText}</p>
                                        {q.image && <img src={q.image} alt="Question Diagram" className="mb-4 rounded-md border bg-white p-2 max-w-md" />}
                                        <div className="space-y-2">
                                            {q.options.map((opt, oIndex) => (
                                                <label key={oIndex} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        checked={answers[q.originalIndex] === oIndex}
                                                        onChange={() => handleAnswerChange(q.originalIndex, oIndex)}
                                                        required
                                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300"
                                                    />
                                                    <span className="ml-3 text-slate-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                    <div className="p-6 border-t bg-slate-50 flex justify-end">
                        <button type="submit" onClick={onFormSubmit} className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-semibold">Submit Exam</button>
                    </div>
                </div>
            </div>
            {isClosing && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold text-slate-800">Are you sure?</h3>
                        <p className="mt-4 text-slate-600">If you close this window, your current answers will be submitted automatically.</p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button onClick={() => setIsClosing(false)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                            <button onClick={handleConfirmCloseAndSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Close & Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};