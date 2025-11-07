import React, { useState, useEffect } from 'react';
import { Assignment, Submission, AssignmentType, TheoryAnswer } from '../types';
import { XIcon, ClockIcon } from '../constants';

interface AssignmentTakerProps {
    assignment: Assignment;
    studentId: string;
    studentName: string;
    onClose: () => void;
    onSubmit: (submission: Submission) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const AssignmentTaker: React.FC<AssignmentTakerProps> = ({ assignment, studentId, studentName, onClose, onSubmit }) => {
    const [answers, setAnswers] = useState<number[] | TheoryAnswer[]>(() => {
        if (assignment.type === AssignmentType.THEORY) {
            return assignment.theoryQuestions.map(q => ({ questionId: q.id, text: '', image: undefined, fileData: undefined, fileName: undefined, fileType: undefined }));
        }
        return Array(assignment.objectiveQuestions.length).fill(-1);
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const dueDate = new Date(assignment.dueDate).getTime();
        const now = new Date().getTime();
        return Math.max(0, Math.floor((dueDate - now) / 1000));
    });
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const d = Math.floor(seconds / (3600*24));
        const h = Math.floor(seconds % (3600*24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        return `${d > 0 ? `${d}d ` : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // FIX: Refactor state updates to handle the union type `number[] | TheoryAnswer[]` correctly,
    // ensuring type safety and immutability.
    const handleAnswerChange = (index: number, value: string | number) => {
        if (assignment.type === AssignmentType.THEORY) {
            setAnswers(prev => {
                const newAnswers = [...(prev as TheoryAnswer[])];
                newAnswers[index] = { ...newAnswers[index], text: value as string };
                return newAnswers;
            });
        } else {
            setAnswers(prev => {
                const newAnswers = [...(prev as number[])];
                newAnswers[index] = value as number;
                return newAnswers;
            });
        }
    };

    const handleImageUpload = (index: number, file: File) => {
        if (file && file.type.startsWith('image/') && assignment.type === AssignmentType.THEORY) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAnswers(prev => {
                    const newAnswers = [...(prev as TheoryAnswer[])];
                    newAnswers[index] = { ...newAnswers[index], image: e.target?.result as string };
                    return newAnswers;
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (PNG, JPG, JPEG).');
        }
    };
    
    const handleFileUpload = async (index: number, file: File) => {
        if (file && assignment.type === AssignmentType.THEORY) {
            try {
                const fileData = await fileToBase64(file);
                setAnswers(prev => {
                    const newAnswers = [...(prev as TheoryAnswer[])];
                    newAnswers[index] = { 
                        ...newAnswers[index],
                        fileData: fileData,
                        fileName: file.name,
                        fileType: file.type
                    };
                    return newAnswers;
                });
            } catch (error) {
                console.error("Failed to read file:", error);
                alert("Sorry, there was an error uploading your file.");
            }
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };
    
    const handleConfirmSubmit = () => {
        const submission: Submission = {
            id: `sub-${Date.now()}`,
            assignmentId: assignment.id,
            studentId,
            studentName,
            submittedAt: new Date().toISOString(),
            answers,
        };
        onSubmit(submission);
        setShowConfirmModal(false);
    };


    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{assignment.title}</h2>
                            <p className="text-sm text-slate-500">{assignment.type} - {assignment.totalMarks} Marks</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${timeLeft < 3600 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                               <ClockIcon className="w-4 h-4"/>
                               <span>{formatTime(timeLeft)} left</span>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                        <p className="text-slate-600 whitespace-pre-wrap">{assignment.description}</p>
                        
                        {assignment.type === AssignmentType.THEORY && (
                            <div className="space-y-8">
                                {assignment.theoryQuestions.map((q, qIndex) => (
                                    <div key={q.id} className="p-4 border rounded-lg bg-slate-50">
                                        <div className="font-semibold text-slate-800 mb-3 flex justify-between">
                                            <span>{qIndex + 1}. {q.questionText}</span>
                                            <span className="font-normal text-sm text-slate-500">{q.marks} Marks</span>
                                        </div>
                                        {q.image && <img src={q.image} alt="Question Diagram" className="mb-4 rounded-md border bg-white p-2 max-w-md" />}
                                        
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Answer</label>
                                        <textarea
                                            value={(answers as TheoryAnswer[])[qIndex].text}
                                            onChange={e => handleAnswerChange(qIndex, e.target.value)}
                                            rows={8}
                                            placeholder="Type your answer here..."
                                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                        ></textarea>
    
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Attach Diagram (Optional)</label>
                                                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => e.target.files && handleImageUpload(qIndex, e.target.files[0])} className="text-sm w-full"/>
                                                {(answers as TheoryAnswer[])[qIndex].image && <img src={(answers as TheoryAnswer[])[qIndex].image} alt="answer diagram preview" className="mt-2 rounded-md border max-h-32"/>}
                                            </div>
                                             <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Upload File (Optional)</label>
                                                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => e.target.files && handleFileUpload(qIndex, e.target.files[0])} className="text-sm w-full"/>
                                                {(answers as TheoryAnswer[])[qIndex].fileName && <p className="text-xs text-green-600 mt-2">File selected: {(answers as TheoryAnswer[])[qIndex].fileName}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
    
                        {assignment.type === AssignmentType.OBJECTIVE && (
                            <div className="space-y-8">
                                {assignment.objectiveQuestions.map((q, qIndex) => (
                                    <div key={q.id}>
                                        <p className="font-semibold text-slate-800 mb-2">{qIndex + 1}. {q.questionText}</p>
                                        {q.image && <img src={q.image} alt="Question Diagram" className="mb-4 rounded-md border bg-white p-2 max-w-md" />}
                                        <div className="space-y-2">
                                            {q.options.map((opt, oIndex) => (
                                                <label key={oIndex} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        checked={(answers as number[])[qIndex] === oIndex}
                                                        onChange={() => handleAnswerChange(qIndex, oIndex)}
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
                        <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-semibold">Submit Assignment</button>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold text-slate-800">Confirm Submission</h3>
                        <p className="mt-4 text-slate-600">Are you sure you want to submit your answers? This action cannot be undone.</p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button onClick={() => setShowConfirmModal(false)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                            <button onClick={handleConfirmSubmit} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold">Confirm & Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};