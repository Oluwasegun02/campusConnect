import React, { useState, useMemo } from 'react';
import { Exam, AssignmentType, ObjectiveQuestion, Course } from '../types';
import { DEPARTMENTS, LEVELS } from '../constants';
import { XIcon, PlusCircleIcon } from '../constants';

interface ExamCreatorProps {
    onClose: () => void;
    onCreate: (exam: Exam) => void;
    teacherId: string;
    teacherName: string;
    courses: Course[];
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({ onClose, onCreate, teacherId, teacherName, courses }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<AssignmentType>(AssignmentType.OBJECTIVE);
    const [courseCode, setCourseCode] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [questions, setQuestions] = useState<ObjectiveQuestion[]>([{ id: `q-${Date.now()}`, questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
    const [totalMarks, setTotalMarks] = useState(100);
    const [allowRetakes, setAllowRetakes] = useState(false);
    const [maxAttempts, setMaxAttempts] = useState(2);
    const [passingGrade, setPassingGrade] = useState(50);
    const [shuffleQuestions, setShuffleQuestions] = useState(false);

    const teacherCourses = useMemo(() => courses.filter(c => c.creatorId === teacherId), [courses, teacherId]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: `q-${Date.now()}`, questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
    };
    
    const handleQuestionChange = <T,>(index: number, field: keyof ObjectiveQuestion, value: T) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };
    
    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };
    
    const handleAddOption = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };
    
    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options.splice(oIndex, 1);
            setQuestions(newQuestions);
        }
    };
    
    const handleImageUpload = (qIndex: number, file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageBase64 = e.target?.result as string;
                handleQuestionChange(qIndex, 'image', imageBase64);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (PNG, JPG, JPEG).');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCourse = courses.find(c => c.code === courseCode);
        if (!selectedCourse) {
            alert("Please select a valid course.");
            return;
        }

        const newExam: Exam = {
            id: `exam-${Date.now()}`,
            title,
            description,
            type,
            startTime,
            endTime,
            durationMinutes,
            creatorId: teacherId,
            creatorName: teacherName,
            targetDepartments: [selectedCourse.department],
            targetLevels: [selectedCourse.level],
            questions: type === AssignmentType.OBJECTIVE ? questions : [],
            totalMarks,
            courseCode,
            retakePolicy: {
                allowed: allowRetakes,
                maxAttempts: allowRetakes ? maxAttempts : 1,
                passingGradePercentage: allowRetakes ? passingGrade : 0,
            },
            shuffleQuestions,
        };
        onCreate(newExam);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Create New Exam</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                            <select value={courseCode} onChange={e => setCourseCode(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white">
                                <option value="" disabled>Select a course</option>
                                {teacherCourses.map(course => (
                                    <option key={course.id} value={course.code}>{course.code} - {course.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                            <input type="number" value={durationMinutes} onChange={e => setDurationMinutes(parseInt(e.target.value))} min={1} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                            <input type="number" value={totalMarks} onChange={e => setTotalMarks(parseInt(e.target.value))} min={1} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                     {/* Policies */}
                     <div className="pt-4 border-t space-y-4">
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowRetakes}
                                onChange={e => setAllowRetakes(e.target.checked)}
                                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="font-medium text-slate-700">Allow Retakes</span>
                        </label>
                        {allowRetakes && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Attempts</label>
                                    <input type="number" value={maxAttempts} onChange={e => setMaxAttempts(parseInt(e.target.value))} min={2} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Passing Grade (%)</label>
                                    <input type="number" value={passingGrade} onChange={e => setPassingGrade(parseInt(e.target.value))} min={1} max={100} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"/>
                                    <p className="text-xs text-slate-500 mt-1">Students must score below this to be eligible for a retake.</p>
                                </div>
                            </div>
                        )}
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shuffleQuestions}
                                onChange={e => setShuffleQuestions(e.target.checked)}
                                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="font-medium text-slate-700">Shuffle question order for each student</span>
                        </label>
                    </div>
                     
                    {/* Questions for Objective */}
                    {type === AssignmentType.OBJECTIVE && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-t pt-4">Questions</h3>
                            {questions.map((q, qIndex) => (
                                <div key={q.id} className="p-4 border rounded-md bg-slate-50 space-y-3">
                                    <label className="block text-sm font-medium text-slate-700">Question {qIndex + 1}</label>
                                    <input type="text" value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} placeholder="Enter question text" required className="w-full border-slate-300 rounded-md shadow-sm" />
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Attach Diagram (Optional)</label>
                                        <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => e.target.files && handleImageUpload(qIndex, e.target.files[0])} className="text-sm w-full"/>
                                        {q.image && <img src={q.image} alt="diagram preview" className="mt-2 rounded-md border max-h-32"/>}
                                    </div>
                                    <div className="space-y-2">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center space-x-2">
                                                <input type="radio" name={`correct-answer-${qIndex}`} checked={q.correctAnswerIndex === oIndex} onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', oIndex)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300" />
                                                <input type="text" value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} required className="flex-grow border-slate-300 rounded-md shadow-sm text-sm" />
                                                <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={q.options.length <= 2}><XIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => handleAddOption(qIndex)} className="text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1">
                                       <PlusCircleIcon className="w-4 h-4"/> <span>Add Option</span>
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddQuestion} className="w-full text-center py-2 border-2 border-dashed rounded-lg text-slate-500 hover:border-primary-500 hover:text-primary-600 transition">
                                Add Another Question
                            </button>
                        </div>
                    )}
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Create Exam</button>
                </div>
            </div>
        </div>
    );
};
