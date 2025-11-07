import React, { useState, useMemo } from 'react';
import { User, ChatGroup, UserRole, Assignment, Exam, Submission, ExamSubmission, Hostel, RegisteredService } from '../types';
import { PlusCircleIcon, TrashIcon, PencilIcon, XIcon, CheckCircleIcon } from '../constants';

interface StaffPortalProps {
    currentUser: User;
    users: User[];
    chatGroups: ChatGroup[];
    assignments: Assignment[];
    exams: Exam[];
    submissions: Submission[];
    examSubmissions: ExamSubmission[];
    hostels: Hostel[];
    registeredServices: RegisteredService[];
    onUpdateHostelStatus: (hostelId: string, status: 'Approved' | 'Rejected') => void,
    onUpdateServiceStatus: (serviceId: string, status: 'Approved' | 'Rejected') => void,
    onDeleteUser: (userId: string) => void;
    onOpenUserCreator: () => void;
    onOpenManageAdmins: (group: ChatGroup) => void;
    onEditAssignment: (assignment: Assignment) => void;
    onDeleteAssignment: (assignmentId: string) => void;
    onViewSubmissions: (item: Assignment | Exam, itemType: 'assignment' | 'exam') => void;
    onDeleteExam: (examId: string) => void;
    onUpdateUser: (user: User) => Promise<User>;
}

export const StaffPortal: React.FC<StaffPortalProps> = (props) => {
    const { 
        currentUser, users, chatGroups, assignments, exams, submissions, examSubmissions,
        hostels, registeredServices, onUpdateHostelStatus, onUpdateServiceStatus,
        onDeleteUser, onOpenUserCreator, onOpenManageAdmins, 
        onEditAssignment, onDeleteAssignment, onViewSubmissions, onDeleteExam, onUpdateUser
    } = props;
    
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', name: 'User Management' },
        { id: 'chats', name: 'Chat Management' },
        { id: 'content', name: 'Content Management' },
        { id: 'accommodation', name: 'Hostel Management' },
        { id: 'sellers', name: 'Seller Verification' },
        { id: 'services', name: 'Service Verification' },
    ];
    
    const sellerApplicants = useMemo(() => {
        return users.filter(u => u.sellerApplicationStatus === 'pending');
    }, [users]);
    
    const pendingServices = useMemo(() => {
        return registeredServices.filter(s => s.status === 'Pending');
    }, [registeredServices]);

    const handleSellerApplication = (user: User, status: 'approved' | 'rejected') => {
        const isApproved = status === 'approved';
        onUpdateUser({
            ...user,
            sellerApplicationStatus: status,
            isVerifiedSeller: isApproved,
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">ICT Staff Portal</h2>
            
            <div>
                <label htmlFor="staff-portal-tabs" className="sr-only">Select a tab</label>
                <select
                    id="staff-portal-tabs"
                    name="staff-portal-tabs"
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabs.map(tab => (
                        <option key={tab.id} value={tab.id}>{tab.name}</option>
                    ))}
                </select>
            </div>
            
            {activeTab === 'users' && (
                <div>
                    <div className="flex justify-end mb-4">
                         <button onClick={onOpenUserCreator} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                            <PlusCircleIcon className="w-5 h-5"/>
                            <span>Create User</span>
                        </button>
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{user.role}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{user.department}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => onDeleteUser(user.id)}
                                                disabled={user.id === currentUser.id}
                                                className="text-red-600 hover:text-red-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                                                title="Delete User"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'chats' && (
                 <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Group Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Admins</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-slate-200">
                            {chatGroups.map(group => {
                                const adminNames = (group.adminIds || [])
                                    .map(adminId => users.find(u => u.id === adminId)?.name)
                                    .filter(Boolean);

                                return (
                                    <tr key={group.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{group.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {adminNames.length > 0 ? adminNames.join(', ') : <span className="text-slate-400 italic">None</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => onOpenManageAdmins(group)}
                                                className="bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-lg hover:bg-slate-200 transition text-xs"
                                            >
                                                Manage Admins
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="space-y-8">
                    {/* Assignments */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-700 mb-4">All Assignments</h3>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Creator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Submissions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(assignment => (
                                        <tr key={assignment.id}>
                                            <td className="px-6 py-4 font-medium">{assignment.title}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{assignment.creatorName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{submissions.filter(s => s.assignmentId === assignment.id).length}</td>
                                            <td className="px-6 py-4 flex items-center space-x-3">
                                                <button onClick={() => onViewSubmissions(assignment, 'assignment')} className="text-primary-600 hover:text-primary-800 text-sm font-semibold">View</button>
                                                <button onClick={() => onEditAssignment(assignment)} className="text-slate-500 hover:text-slate-700" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                                <button onClick={() => onDeleteAssignment(assignment.id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Exams */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-700 mb-4">All Exams</h3>
                         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Creator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Submissions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map(exam => (
                                        <tr key={exam.id}>
                                            <td className="px-6 py-4 font-medium">{exam.title}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{exam.creatorName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{examSubmissions.filter(s => s.examId === exam.id).length}</td>
                                            <td className="px-6 py-4 flex items-center space-x-3">
                                                <button onClick={() => onViewSubmissions(exam, 'exam')} className="text-primary-600 hover:text-primary-800 text-sm font-semibold">View</button>
                                                <button onClick={() => onDeleteExam(exam.id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'accommodation' && (
                 <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Pending Hostel Approvals</h3>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hostel Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hostels.filter(h => h.status === 'Pending').map(hostel => (
                                    <tr key={hostel.id}>
                                        <td className="px-4 py-3 font-medium">{hostel.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{users.find(u => u.id === hostel.ownerId)?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{hostel.location}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{hostel.contactPhone}</td>
                                        <td className="px-4 py-3 flex items-center gap-2 text-xs">
                                             <button onClick={() => onUpdateHostelStatus(hostel.id, 'Approved')} className="font-semibold text-green-600 hover:underline">Approve</button>
                                             <button onClick={() => onUpdateHostelStatus(hostel.id, 'Rejected')} className="font-semibold text-red-600 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {hostels.filter(h => h.status === 'Pending').length === 0 && <p className="text-center text-slate-400 p-8">No pending hostel submissions.</p>}
                    </div>
                 </div>
            )}
             {activeTab === 'sellers' && (
                 <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Pending Seller Applications</h3>
                     <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Applicant Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellerApplicants.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3 font-medium">{user.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{user.role}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                                        <td className="px-4 py-3 flex items-center gap-2 text-xs">
                                             <button onClick={() => handleSellerApplication(user, 'approved')} className="font-semibold text-green-600 hover:underline">Approve</button>
                                             <button onClick={() => handleSellerApplication(user, 'rejected')} className="font-semibold text-red-600 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {sellerApplicants.length === 0 && <p className="text-center text-slate-400 p-8">No pending seller applications.</p>}
                    </div>
                 </div>
            )}
            {activeTab === 'services' && (
                 <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Pending Service Approvals</h3>
                     <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Service Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Provider</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingServices.map(service => (
                                    <tr key={service.id}>
                                        <td className="px-4 py-3 font-medium">{service.serviceName}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{service.providerName}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{service.category}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">${service.price.toFixed(2)}</td>
                                        <td className="px-4 py-3 flex items-center gap-2 text-xs">
                                             <button onClick={() => onUpdateServiceStatus(service.id, 'Approved')} className="font-semibold text-green-600 hover:underline">Approve</button>
                                             <button onClick={() => onUpdateServiceStatus(service.id, 'Rejected')} className="font-semibold text-red-600 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {pendingServices.length === 0 && <p className="text-center text-slate-400 p-8">No pending service submissions.</p>}
                    </div>
                 </div>
            )}
        </div>
    );
};