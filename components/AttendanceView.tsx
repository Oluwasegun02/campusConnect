import React, { useState } from 'react';
import { User, AttendanceRecord, Course, CourseRegistration } from '../types';
import { MarkAttendance } from './MarkAttendance';
import { AttendanceOverview } from './AttendanceOverview';

interface AttendanceViewProps {
    currentUser: User;
    allUsers: User[];
    records: AttendanceRecord[];
    onSave: (recordsToSave: { studentId: string, status: 'Present' | 'Absent' | 'Late' }[], date: string, courseId: string) => void;
    courses: Course[];
    courseRegistrations: CourseRegistration[];
}

type AttendanceTab = 'mark' | 'overview';

export const AttendanceView: React.FC<AttendanceViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AttendanceTab>('mark');

    const TabButton: React.FC<{tabId: AttendanceTab, currentTab: AttendanceTab, onClick: (tab: AttendanceTab) => void, children: React.ReactNode}> = 
    ({ tabId, currentTab, onClick, children }) => (
         <button
            onClick={() => onClick(tabId)}
            className={`${
                currentTab === tabId
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-slate-800">Attendance</h2>
            </div>
            
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                   <TabButton tabId="mark" currentTab={activeTab} onClick={setActiveTab}>Mark Attendance</TabButton>
                   <TabButton tabId="overview" currentTab={activeTab} onClick={setActiveTab}>Overview</TabButton>
                </nav>
            </div>

            <div>
                {activeTab === 'mark' && <MarkAttendance {...props} />}
                {activeTab === 'overview' && <AttendanceOverview {...props} />}
            </div>
        </div>
    );
};