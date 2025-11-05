import React from 'react';
import { Assignment, Submission, Exam, ExamSubmission, AssignmentType } from '../types';
import { XIcon } from '../constants';

interface ViewSubmissionsProps {
    item: Assignment | Exam;
    submissions: (Submission | ExamSubmission)[];
    onClose: () => void;
    onGrade?: (submission: Submission | ExamSubmission) => void;
}

export const ViewSubmissions: React.FC<ViewSubmissionsProps> = ({ item, submissions, onClose, onGrade }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Submissions for "{item.title}"</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6">
                    {submissions.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted At</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {submissions.map(sub => (
                                        <tr key={sub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{sub.studentName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(sub.submittedAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">
                                                {sub.grade !== undefined ? `${sub.grade} / ${item.totalMarks}` : 'Pending'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {sub.grade === undefined && item.type === AssignmentType.THEORY && onGrade && (
                                                    <button 
                                                        onClick={() => onGrade(sub)} 
                                                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary-200 transition"
                                                    >
                                                        Grade
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No submissions yet.</p>
                    )}
                </div>
                 <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Close</button>
                </div>
            </div>
        </div>
    );
};