import React, { useState } from 'react';
import { Assignment, Submission, Exam, ExamSubmission, TheoryAnswer } from '../types';
import { XIcon } from '../constants';

interface GradeSubmissionProps {
    item: Assignment | Exam;
    submission: Submission | ExamSubmission;
    itemType: 'assignment' | 'exam';
    onClose: () => void;
    onSaveGrade: (submissionId: string, grade: number, itemType: 'assignment' | 'exam') => void;
}

export const GradeSubmission: React.FC<GradeSubmissionProps> = ({ item, submission, itemType, onClose, onSaveGrade }) => {
    const [grade, setGrade] = useState<number | ''>(submission.grade ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (grade === '' || grade < 0 || grade > item.totalMarks) {
            alert(`Please enter a valid grade between 0 and ${item.totalMarks}.`);
            return;
        }
        setIsSaving(true);
        onSaveGrade(submission.id, grade, itemType);
    };
    
    const assignment = item as Assignment;
    const studentAnswers = submission.answers as TheoryAnswer[];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                         <h2 className="text-2xl font-bold text-slate-800">Grade Submission</h2>
                         <p className="text-sm text-slate-500">For: "{item.title}" by {submission.studentName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                             <h3 className="font-semibold text-slate-800">General Instructions</h3>
                             <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-md border whitespace-pre-wrap">{item.description}</p>
                        </div>
                        <h3 className="font-semibold text-slate-800 border-t pt-4">Student's Answers</h3>
                        <div className="space-y-4">
                            {studentAnswers.map((answer, index) => {
                                const question = assignment.theoryQuestions.find(q => q.id === answer.questionId);
                                if (!question) return null;
                                return (
                                    <div key={index} className="border rounded-lg overflow-hidden">
                                        <div className="bg-slate-100 p-4 border-b">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-slate-800">Question {index + 1}</h4>
                                                <span className="text-sm font-semibold text-slate-600">{question.marks} Marks</span>
                                            </div>
                                            <p className="mt-1 text-slate-700 whitespace-pre-wrap">{question.questionText}</p>
                                            {question.image && <img src={question.image} alt="Question Diagram" className="mt-2 rounded border bg-white max-w-sm"/>}
                                            
                                            {/* Display Rubric if it exists */}
                                            {question.rubric && question.rubric.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-slate-200">
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Grading Rubric</h5>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                                                        {question.rubric.map(item => (
                                                            <li key={item.id}>
                                                                {item.description} - <span className="font-semibold">{item.marks} marks</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <p className="text-slate-800 whitespace-pre-wrap">{answer.text || <em className="text-slate-400">No text answer provided.</em>}</p>
                                            {answer.image && (
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 mb-1">Student's Diagram:</p>
                                                    <img src={answer.image} alt="Student Diagram" className="mt-2 rounded border bg-white max-w-sm"/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-lg border flex flex-col items-center justify-center self-start sticky top-0">
                        <label className="block text-lg font-medium text-slate-700 mb-2">Enter Final Grade</label>
                        <div className="flex items-center space-x-2">
                             <input 
                                type="number" 
                                value={grade}
                                onChange={e => setGrade(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                min="0"
                                max={item.totalMarks}
                                className="w-24 text-center text-2xl font-bold border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                            <span className="text-xl text-slate-500">/ {item.totalMarks}</span>
                        </div>
                         <button 
                            type="button" 
                            onClick={handleSave} 
                            className="w-full mt-6 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:bg-slate-400 transition-colors"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Grade'}
                        </button>
                    </div>
                </div>
                <div className="p-6 border-t bg-slate-50 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Back to Submissions</button>
                </div>
            </div>
        </div>
    );
};