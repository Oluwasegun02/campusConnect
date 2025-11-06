import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, AttendanceRecord, Course, CourseRegistration } from '../types';

interface MarkAttendanceProps {
    currentUser: User;
    allUsers: User[];
    records: AttendanceRecord[];
    onSave: (recordsToSave: { studentId: string, status: 'Present' | 'Absent' | 'Late' }[], date: string, courseId: string) => void;
    courses: Course[];
    courseRegistrations: CourseRegistration[];
}

export const MarkAttendance: React.FC<MarkAttendanceProps> = ({ currentUser, allUsers, records, onSave, courses, courseRegistrations }) => {
    
    // YYYY-MM-DD format
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
    
    const teacherCourses = useMemo(() => {
        return courses.filter(course => 
            course.department === currentUser.department // Simplified: Teacher teaches all courses in their department
        );
    }, [courses, currentUser.department]);

    const studentsForSelectedCourse = useMemo(() => {
        if (!selectedCourseId) return [];
        const studentIds = new Set(courseRegistrations.filter(reg => reg.courseId === selectedCourseId).map(reg => reg.studentId));
        return allUsers.filter(user => user.role === UserRole.STUDENT && studentIds.has(user.id));
    }, [allUsers, courseRegistrations, selectedCourseId]);

    useEffect(() => {
        if (!selectedCourseId) {
            setAttendanceData({});
            return;
        };

        const recordsForDateAndCourse = records.filter(r => r.date === selectedDate && r.courseId === selectedCourseId);
        const initialData: Record<string, 'Present' | 'Absent' | 'Late'> = {};
        studentsForSelectedCourse.forEach(student => {
            const record = recordsForDateAndCourse.find(r => r.studentId === student.id);
            initialData[student.id] = record ? record.status : 'Present'; // Default to Present
        });
        setAttendanceData(initialData);
    }, [selectedDate, selectedCourseId, records, studentsForSelectedCourse]);
    
    const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };
    
    const handleSave = () => {
        if (!selectedCourseId) {
            alert('Please select a course first.');
            return;
        }
        const recordsToSave = Object.entries(attendanceData).map(([studentId, status]) => ({
            id: `${studentId}-${selectedCourseId}-${selectedDate}`,
            studentId,
            courseId: selectedCourseId,
            date: selectedDate,
            status,
            markedById: currentUser.id,
        }));
        onSave(recordsToSave, selectedDate, selectedCourseId);
        alert('Attendance saved successfully!');
    };

    return (
        <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b">
                 <h3 className="text-xl font-bold text-slate-800">Mark Daily Attendance</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                        value={selectedCourseId}
                        onChange={e => setSelectedCourseId(e.target.value)}
                        className="border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
                    >
                        <option value="" disabled>-- Select a Course --</option>
                        {teacherCourses.map(course => (
                            <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                        ))}
                    </select>
                    <input 
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                     <button 
                        onClick={handleSave}
                        disabled={!selectedCourseId}
                        className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-semibold disabled:bg-slate-300"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>
            
            {!selectedCourseId ? (
                <div className="text-center p-12 text-slate-500">
                    <p>Please select a course to begin marking attendance.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {studentsForSelectedCourse.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex space-x-4">
                                            {(['Present', 'Absent', 'Late'] as const).map(status => (
                                                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`status-${student.id}`}
                                                        value={status}
                                                        checked={attendanceData[student.id] === status}
                                                        onChange={() => handleStatusChange(student.id, status)}
                                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300"
                                                    />
                                                    <span>{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {studentsForSelectedCourse.length === 0 && <p className="text-center text-slate-500 py-8">No students are registered for this course.</p>}
                </div>
            )}
        </div>
    );
};