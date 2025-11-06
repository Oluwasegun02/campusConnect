import React from 'react';
import { User, Course, CourseRegistration, CourseMaterial, UserRole } from '../types';
import { PlusCircleIcon, DocumentArrowDownIcon, TrashIcon } from '../constants';

interface CourseMaterialsViewProps {
    currentUser: User;
    courses: Course[];
    courseRegistrations: CourseRegistration[];
    materials: CourseMaterial[];
    onUploadClick: () => void;
    onDelete: (materialId: string) => void;
}

const downloadFile = (fileData: string, fileName: string, fileType: string) => {
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


export const CourseMaterialsView: React.FC<CourseMaterialsViewProps> = ({ currentUser, courses, courseRegistrations, materials, onUploadClick, onDelete }) => {
    
    const relevantCourses = currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.ICT_STAFF
        ? courses.filter(c => c.department === currentUser.department || currentUser.role === UserRole.ICT_STAFF) // ICT staff sees all courses in all departments (simplified for now)
        : courses.filter(c => courseRegistrations.some(r => r.courseId === c.id));

    const canManage = currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.ICT_STAFF;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Course Materials</h2>
                {canManage && (
                    <button onClick={onUploadClick} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>Upload Material</span>
                    </button>
                )}
            </div>

            {relevantCourses.length > 0 ? (
                <div className="space-y-6">
                    {relevantCourses.map(course => {
                        const courseMaterials = materials.filter(m => m.courseId === course.id);
                        return (
                            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-xl font-bold text-slate-800">{course.title} ({course.code})</h3>
                                <p className="text-sm text-slate-500 mb-4">{course.description}</p>
                                
                                {courseMaterials.length > 0 ? (
                                    <ul className="divide-y divide-slate-200">
                                        {courseMaterials.map(material => {
                                            const canDelete = material.uploaderId === currentUser.id || currentUser.role === UserRole.ICT_STAFF;
                                            return (
                                                <li key={material.id} className="py-3 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-slate-700">{material.title}</p>
                                                        <p className="text-sm text-slate-500">{material.fileName} - Uploaded on {new Date(material.uploadedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button onClick={() => downloadFile(material.fileData, material.fileName, material.fileType)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition" title="Download">
                                                            <DocumentArrowDownIcon className="w-5 h-5"/>
                                                        </button>
                                                        {canManage && canDelete && (
                                                            <button onClick={() => onDelete(material.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition" title="Delete">
                                                                <TrashIcon className="w-5 h-5"/>
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-center text-slate-400 py-4">No materials uploaded for this course yet.</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-slate-700">No Courses Found</h2>
                    <p className="text-slate-500 mt-2">
                        {currentUser.role === UserRole.STUDENT
                            ? "You are not registered for any courses. Please go to 'Course Registration' to enroll."
                            : "There are no courses listed for your department."}
                    </p>
                </div>
            )}
        </div>
    );
};
