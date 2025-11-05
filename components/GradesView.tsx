import React from 'react';
import { Assignment, Submission, Exam, ExamSubmission } from '../types';
import { AcademicCapIcon, CheckCircleIcon } from '../constants';

interface GradesViewProps {
    assignments: Assignment[];
    submissions: Submission[];
    exams: Exam[];
    examSubmissions: ExamSubmission[];
}

export const GradesView: React.FC<GradesViewProps> = ({ assignments, submissions, exams, examSubmissions }) => {
    
    const gradedAssignments = submissions
        .filter(s => s.grade !== undefined)
        .map(sub => {
            const assignment = assignments.find(a => a.id === sub.assignmentId);
            return {
                title: assignment?.title || 'Unknown Assignment',
                type: 'Assignment',
                grade: sub.grade,
                totalMarks: assignment?.totalMarks || 0,
                submittedAt: sub.submittedAt,
            };
        });

    const gradedExams = examSubmissions
        .filter(s => s.grade !== undefined)
        .map(sub => {
            const exam = exams.find(e => e.id === sub.examId);
            return {
                title: exam?.title || 'Unknown Exam',
                type: 'Exam',
                grade: sub.grade,
                totalMarks: exam?.totalMarks || 0,
                submittedAt: sub.submittedAt,
            };
        });

    const allGradedItems = [...gradedAssignments, ...gradedExams]
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const totalPossibleMarks = allGradedItems.reduce((sum, item) => sum + (item.totalMarks || 0), 0);
    const totalEarnedMarks = allGradedItems.reduce((sum, item) => sum + (item.grade || 0), 0);
    const averagePercentage = totalPossibleMarks > 0 ? (totalEarnedMarks / totalPossibleMarks) * 100 : 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">My Grades</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full"><CheckCircleIcon className="w-8 h-8 text-green-600"/></div>
                    <div>
                        <p className="text-slate-500">Graded Items</p>
                        <p className="text-3xl font-bold text-slate-800">{allGradedItems.length}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 rounded-full"><AcademicCapIcon className="w-8 h-8 text-primary-600"/></div>
                    <div>
                        <p className="text-slate-500">Overall Score</p>
                        <p className="text-3xl font-bold text-slate-800">{averagePercentage.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {allGradedItems.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'Exam' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(item.submittedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                    {item.grade} / {item.totalMarks}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {allGradedItems.length === 0 && <p className="text-center text-slate-500 py-12">No graded items yet. Check back later!</p>}
            </div>

        </div>
    );
}
