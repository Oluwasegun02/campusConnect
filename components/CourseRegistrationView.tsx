import React, { useState, useMemo } from 'react';
import { User, Course, CourseRegistration } from '../types';
import { CheckCircleIcon } from '../constants';

interface CourseRegistrationViewProps {
    currentUser: User;
    courses: Course[];
    registrations: CourseRegistration[];
    onRegister: (studentId: string, courseIds: string[]) => void;
}

export const CourseRegistrationView: React.FC<CourseRegistrationViewProps> = ({ currentUser, courses, registrations, onRegister }) => {
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

    const registeredCourseIds = useMemo(() => new Set(registrations.map(r => r.courseId)), [registrations]);

    const availableCourses = useMemo(() => {
        return courses.filter(course => 
            course.department === currentUser.department &&
            course.level === currentUser.level &&
            !registeredCourseIds.has(course.id)
        );
    }, [courses, currentUser, registeredCourseIds]);
    
    const registeredCourses = useMemo(() => {
         return courses.filter(course => registeredCourseIds.has(course.id));
    }, [courses, registeredCourseIds]);

    const handleToggleCourse = (courseId: string) => {
        setSelectedCourseIds(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };
    
    const selectedCredits = useMemo(() => {
        return availableCourses
            .filter(c => selectedCourseIds.includes(c.id))
            .reduce((sum, course) => sum + course.credits, 0);
    }, [availableCourses, selectedCourseIds]);

    const handleSubmit = () => {
        if (selectedCourseIds.length === 0) {
            alert('Please select at least one course to register.');
            return;
        }
        onRegister(currentUser.id, selectedCourseIds);
        setSelectedCourseIds([]);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Course Registration</h2>
                    <p className="text-slate-500 mt-1">Select courses to register for the upcoming semester.</p>
                </div>
                <div className="text-right bg-white p-4 rounded-lg shadow-md border">
                     <p className="text-sm font-medium text-slate-500">Selected Credits</p>
                     <p className="text-3xl font-bold text-primary-600">{selectedCredits}</p>
                </div>
            </div>

            {/* Courses available for registration */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-slate-700">Available Courses</h3>
                 {availableCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableCourses.map(course => (
                            <div key={course.id} className={`bg-white p-4 rounded-lg shadow-md border-2 transition-all ${selectedCourseIds.includes(course.id) ? 'border-primary-500 shadow-lg' : 'border-transparent'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-slate-800">{course.title}</p>
                                        <p className="text-sm text-slate-500">{course.code} | {course.credits} Credits</p>
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourseIds.includes(course.id)}
                                            onChange={() => handleToggleCourse(course.id)}
                                            className="h-6 w-6 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-slate-600 mt-2">{course.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-8 bg-white rounded-lg shadow-md">No new courses available for registration in your department and level.</p>
                )}
            </div>
            
             {selectedCourseIds.length > 0 && (
                <div className="text-center py-4">
                     <button onClick={handleSubmit} className="bg-primary-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:bg-primary-700 transition-transform hover:scale-105">
                        Register for {selectedCourseIds.length} Course(s)
                    </button>
                </div>
            )}
            
             {/* Currently Registered Courses */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-slate-700">Currently Registered</h3>
                 {registeredCourses.length > 0 ? (
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <ul className="divide-y divide-slate-200">
                            {registeredCourses.map(course => (
                                <li key={course.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500"/>
                                        <div>
                                            <p className="font-semibold text-slate-800">{course.title}</p>
                                            <p className="text-sm text-slate-500">{course.code}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{course.credits} Credits</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                 ) : (
                    <p className="text-slate-500 text-center py-8">You are not registered for any courses yet.</p>
                 )}
            </div>
        </div>
    );
};