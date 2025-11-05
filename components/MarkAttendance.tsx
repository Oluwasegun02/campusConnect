import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, AttendanceRecord } from '../types';

interface MarkAttendanceProps {
    currentUser: User;
    allUsers: User[];
    records: AttendanceRecord[];
    onSave: (recordsToSave: { studentId: string, status: 'Present' | 'Absent' | 'Late' }[], date: string) => void;
}

export const MarkAttendance: React.FC<MarkAttendanceProps> = ({ currentUser, allUsers, records, onSave }) => {
    
    // YYYY-MM-DD format
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
    
    const studentsInDepartment = useMemo(() => {
        return allUsers.filter(user => 
            user.role === UserRole.STUDENT && user.department === currentUser.department
        );
    }, [allUsers, currentUser.department]);

    useEffect(() => {
        const recordsForDate = records.filter(r => r.date === selectedDate);
        const initialData: Record<string, 'Present' | 'Absent' | 'Late'> = {};
        studentsInDepartment.forEach(student => {
            const record = recordsForDate.find(r => r.studentId === student.id);
            initialData[student.id] = record ? record.status : 'Present'; // Default to Present
        });
        setAttendanceData(initialData);
    }, [selectedDate, records, studentsInDepartment]);
    
    const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };
    
    const handleSave = () => {
        const recordsToSave = Object.entries(attendanceData).map(([studentId, status]) => ({
            studentId,
            status,
        }));
        onSave(recordsToSave, selectedDate);
        alert('Attendance saved successfully!');
    };

    return (
        <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 flex justify-between items-center border-b">
                 <h3 className="text-xl font-bold text-slate-800">Mark Daily Attendance</h3>
                <div className="flex items-center space-x-4">
                    <input 
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                     <button 
                        onClick={handleSave}
                        className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-semibold"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>
            
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
                        {studentsInDepartment.map(student => (
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
            </div>
             {studentsInDepartment.length === 0 && <p className="text-center text-slate-500 py-8">No students found in your department.</p>}
        </div>
    );
};
