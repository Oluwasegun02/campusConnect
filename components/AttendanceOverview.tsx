import React, { useState, useMemo } from 'react';
import { User, UserRole, AttendanceRecord } from '../types';

interface AttendanceOverviewProps {
    currentUser: User;
    allUsers: User[];
    records: AttendanceRecord[];
}

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

// Helper to get the start of the month
const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ currentUser, allUsers, records }) => {
    const today = new Date();
    const [startDate, setStartDate] = useState(getStartOfMonth(today).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const studentsInDepartment = useMemo(() => {
        return allUsers.filter(user => 
            user.role === UserRole.STUDENT && user.department === currentUser.department
        );
    }, [allUsers, currentUser.department]);

    const filteredRecords = useMemo(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return records.filter(r => {
            const recordDate = new Date(r.date);
            return recordDate >= start && recordDate <= end;
        });
    }, [records, startDate, endDate]);

    const studentStats = useMemo(() => {
        return studentsInDepartment.map(student => {
            const studentRecords = filteredRecords.filter(r => r.studentId === student.id);
            const present = studentRecords.filter(r => r.status === 'Present').length;
            const absent = studentRecords.filter(r => r.status === 'Absent').length;
            const late = studentRecords.filter(r => r.status === 'Late').length;
            const total = present + absent + late;
            const attendancePercentage = total > 0 ? ((present + late) / total) * 100 : 100;

            return {
                id: student.id,
                name: student.name,
                present,
                absent,
                late,
                percentage: attendancePercentage,
            };
        });
    }, [studentsInDepartment, filteredRecords]);

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Attendance Overview</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="border-slate-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="border-slate-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => { setStartDate(getStartOfWeek(today).toISOString().split('T')[0]); setEndDate(today.toISOString().split('T')[0]); }} className="text-sm bg-white border border-slate-300 rounded-md px-3 py-2 hover:bg-slate-100">This Week</button>
                    <button onClick={() => { setStartDate(getStartOfMonth(today).toISOString().split('T')[0]); setEndDate(today.toISOString().split('T')[0]); }} className="text-sm bg-white border border-slate-300 rounded-md px-3 py-2 hover:bg-slate-100">This Month</button>
                </div>
            </div>
            
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Present</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Absent</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Late</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance %</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {studentStats.map(stat => (
                            <tr key={stat.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{stat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{stat.present}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{stat.absent}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{stat.late}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getPercentageColor(stat.percentage)}`}>
                                        {stat.percentage.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {studentStats.length === 0 && <p className="text-center text-slate-500 py-8">No students found in your department.</p>}
        </div>
    );
};
