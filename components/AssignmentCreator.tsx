
import React, { useState, useEffect } from 'react';
import { Assignment, AssignmentType, ObjectiveQuestion, TheoryQuestion, RubricItem, AssignmentPriority } from '../types';
import { DEPARTMENTS, LEVELS } from '../constants';
import { XIcon, PlusCircleIcon } from '../constants';

interface AssignmentCreatorProps {
    onClose: () => void;
    onSave: (assignment: Assignment) => void;
    teacherId: string;
    teacherName: string;
    assignmentToEdit?: Assignment;
}

export const AssignmentCreator: React.FC<AssignmentCreatorProps> = ({ onClose, onSave, teacherId, teacherName, assignmentToEdit }) => {
    const [title, setTitle] = useState(assignmentToEdit?.title || '');
    const [description, setDescription] = useState(assignmentToEdit?.description || '');
    const [type, setType] = useState<AssignmentType>(assignmentToEdit?.type || AssignmentType.THEORY);
    const [dueDate, setDueDate] = useState(assignmentToEdit?.dueDate || '');
    const [targetDepartments, setTargetDepartments] = useState<string[]>(assignmentToEdit?.targetDepartments || []);
    const [targetLevels, setTargetLevels] = useState<number[]>(assignmentToEdit?.targetLevels || []);
    const [objectiveQuestions, setObjectiveQuestions] = useState<ObjectiveQuestion[]>(assignmentToEdit?.objectiveQuestions || []);
    const [theoryQuestions, setTheoryQuestions] = useState<TheoryQuestion[]>(assignmentToEdit?.theoryQuestions || []);
    const [totalMarks, setTotalMarks] = useState(assignmentToEdit?.totalMarks || 10);
    const [priority, setPriority] = useState<AssignmentPriority>(assignmentToEdit?.priority || AssignmentPriority.MEDIUM);
    
    const isEditMode = !!assignmentToEdit;

    // Initialize with a default question if creating a new assignment
    useEffect(() => {
        if (!isEditMode) {
            if (type === AssignmentType.OBJECTIVE && objectiveQuestions.length === 0) {
                 setObjectiveQuestions([{ id: `q-${Date.now()}`, questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
            } else if (type === AssignmentType.THEORY && theoryQuestions.length === 0) {
                setTheoryQuestions([{ id: `q-${Date.now()}`, questionText: '', marks: 10, rubric: [] }]);
            }
        }
    }, [type, isEditMode]);


    // Auto-calculate total marks for theory assignments
    useEffect(() => {
        if (type === AssignmentType.THEORY) {
            const sum = theoryQuestions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0);
            setTotalMarks(sum);
        }
    }, [theoryQuestions, type]);

    const handleAddObjectiveQuestion = () => {
        setObjectiveQuestions([...objectiveQuestions, { id: `q-${Date.now()}`, questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
    };
    
    const handleObjectiveQuestionChange = <T,>(index: number, field: keyof ObjectiveQuestion, value: T) => {
        const newQuestions = [...objectiveQuestions];
        (newQuestions[index] as any)[field] = value;
        setObjectiveQuestions(newQuestions);
    };
    
    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...objectiveQuestions];
        newQuestions[qIndex].options[oIndex] = value;
        setObjectiveQuestions(newQuestions);
    };
    
    const handleAddOption = (qIndex: number) => {
        const newQuestions = [...objectiveQuestions];
        newQuestions[qIndex].options.push('');
        setObjectiveQuestions(newQuestions);
    };
    
    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...objectiveQuestions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options.splice(oIndex, 1);
            setObjectiveQuestions(newQuestions);
        }
    };
    
    const handleAddTheoryQuestion = () => {
        setTheoryQuestions([...theoryQuestions, { id: `q-${Date.now()}`, questionText: '', marks: 10, rubric: [] }]);
    };

    const handleRemoveTheoryQuestion = (index: number) => {
        if (theoryQuestions.length > 1) {
            setTheoryQuestions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleTheoryQuestionChange = <T,>(index: number, field: keyof TheoryQuestion, value: T) => {
        const newQuestions = [...theoryQuestions];
        (newQuestions[index] as any)[field] = value;
        setTheoryQuestions(newQuestions);
    };

    const handleImageUpload = (qIndex: number, file: File, questionType: AssignmentType) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageBase64 = e.target?.result as string;
                if (questionType === AssignmentType.THEORY) {
                    handleTheoryQuestionChange(qIndex, 'image', imageBase64);
                } else {
                    handleObjectiveQuestionChange(qIndex, 'image', imageBase64);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (PNG, JPG, JPEG).');
        }
    };

    const handleAddRubricItem = (qIndex: number) => {
        const newQuestions = [...theoryQuestions];
        const question = newQuestions[qIndex];
        if (!question.rubric) {
            question.rubric = [];
        }
        question.rubric.push({ id: `r-${Date.now()}`, description: '', marks: 0 });
        setTheoryQuestions(newQuestions);
    };

    const handleRemoveRubricItem = (qIndex: number, rIndex: number) => {
        const newQuestions = [...theoryQuestions];
        newQuestions[qIndex].rubric?.splice(rIndex, 1);
        
        // Recalculate marks after removing an item
        const question = newQuestions[qIndex];
        if (question.rubric && question.rubric.length > 0) {
            const rubricTotal = question.rubric.reduce((acc, item) => acc + (Number(item.marks) || 0), 0);
            question.marks = rubricTotal;
        }
        setTheoryQuestions(newQuestions);
    };

    const handleRubricItemChange = (qIndex: number, rIndex: number, field: keyof RubricItem, value: string | number) => {
        const newQuestions = [...theoryQuestions];
        const question = newQuestions[qIndex];
        const rubric = question.rubric;

        if (rubric) {
            const processedValue = field === 'marks' ? parseInt(value as string, 10) || 0 : value;
            (rubric[rIndex] as any)[field] = processedValue;

            // Recalculate question marks from rubric
            const rubricTotal = rubric.reduce((acc, item) => acc + (Number(item.marks) || 0), 0);
            question.marks = rubricTotal;
            
            setTheoryQuestions(newQuestions);
        }
    };


    const toggleDepartment = (dept: string) => {
        setTargetDepartments(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
    };
    
    const toggleLevel = (level: number) => {
        setTargetLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assignmentData: Assignment = {
            id: assignmentToEdit?.id || `asg-${Date.now()}`,
            title,
            description,
            type,
            dueDate,
            creatorId: teacherId,
            creatorName: teacherName,
            targetDepartments,
            targetLevels,
            objectiveQuestions: type === AssignmentType.OBJECTIVE ? objectiveQuestions : [],
            theoryQuestions: type === AssignmentType.THEORY ? theoryQuestions : [],
            totalMarks,
            priority,
        };
        onSave(assignmentData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Assignment' : 'Create New Assignment'}</h2>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Type</label>
                            <select value={type} onChange={e => setType(e.target.value as AssignmentType)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                                {Object.values(AssignmentType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">General Instructions / Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                            <input type="number" value={totalMarks} onChange={e => setTotalMarks(parseInt(e.target.value))} min={1} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100" disabled={type === AssignmentType.THEORY} />
                            {type === AssignmentType.THEORY && (
                                <p className="text-xs text-slate-500 mt-1">
                                    Total marks are calculated automatically from the sum of theory questions.
                                </p>
                            )}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value as AssignmentPriority)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white">
                                {Object.values(AssignmentPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                     {/* Targeting */}
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Target Departments</label>
                        <div className="flex flex-wrap gap-2">
                            {DEPARTMENTS.map(dept => <button type="button" key={dept} onClick={() => toggleDepartment(dept)} className={`px-3 py-1 text-sm rounded-full border ${targetDepartments.includes(dept) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{dept}</button>)}
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Target Levels</label>
                        <div className="flex flex-wrap gap-2">
                             {LEVELS.map(level => <button type="button" key={level} onClick={() => toggleLevel(level)} className={`px-3 py-1 text-sm rounded-full border ${targetLevels.includes(level) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{level}</button>)}
                        </div>
                     </div>
                    {/* Questions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-slate-800 border-t pt-4">Questions</h3>
                        {type === AssignmentType.THEORY && theoryQuestions.map((q, qIndex) => (
                            <div key={q.id} className="p-4 border rounded-md bg-slate-50 space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-700">Question {qIndex + 1}</label>
                                    <button type="button" onClick={() => handleRemoveTheoryQuestion(qIndex)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={theoryQuestions.length <= 1}><XIcon className="w-4 h-4" /></button>
                                </div>
                                <textarea value={q.questionText} onChange={e => handleTheoryQuestionChange(qIndex, 'questionText', e.target.value)} placeholder="Enter question text" required rows={4} className="w-full border-slate-300 rounded-md shadow-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Attach Diagram (Optional)</label>
                                        <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => e.target.files && handleImageUpload(qIndex, e.target.files[0], AssignmentType.THEORY)} className="text-sm w-full"/>
                                        {q.image && <img src={q.image} alt="diagram preview" className="mt-2 rounded-md border max-h-32"/>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Marks for this question</label>
                                        <input type="number" value={q.marks} onChange={e => handleTheoryQuestionChange(qIndex, 'marks', parseInt(e.target.value, 10))} min={1} required className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={q.rubric && q.rubric.length > 0} />
                                        {q.rubric && q.rubric.length > 0 && <p className="text-xs text-slate-500 mt-1">Marks are auto-calculated from rubric.</p>}
                                    </div>
                                </div>
                                 {/* New Rubric Section */}
                                <div className="mt-4 pt-3 border-t border-slate-200">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Grading Rubric (Optional)</h4>
                                    <div className="space-y-2">
                                        {q.rubric?.map((item, rIndex) => (
                                            <div key={item.id} className="flex items-center gap-2 bg-slate-100 p-2 rounded">
                                                <input 
                                                    type="text" 
                                                    value={item.description}
                                                    onChange={e => handleRubricItemChange(qIndex, rIndex, 'description', e.target.value)}
                                                    placeholder="Rubric criterion description"
                                                    className="flex-grow border-slate-300 rounded-md shadow-sm text-sm"
                                                />
                                                <input 
                                                    type="number"
                                                    value={item.marks}
                                                    onChange={e => handleRubricItemChange(qIndex, rIndex, 'marks', e.target.value)}
                                                    min={0}
                                                    className="w-20 border-slate-300 rounded-md shadow-sm text-sm"
                                                    placeholder="Marks"
                                                />
                                                <button type="button" onClick={() => handleRemoveRubricItem(qIndex, rIndex)} className="text-red-500 hover:text-red-700">
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => handleAddRubricItem(qIndex)} className="text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1 mt-2">
                                        <PlusCircleIcon className="w-4 h-4"/> <span>Add Rubric Item</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {type === AssignmentType.OBJECTIVE && objectiveQuestions.map((q, qIndex) => (
                            <div key={q.id} className="p-4 border rounded-md bg-slate-50 space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Question {qIndex + 1}</label>
                                <input type="text" value={q.questionText} onChange={e => handleObjectiveQuestionChange(qIndex, 'questionText', e.target.value)} placeholder="Enter question text" required className="w-full border-slate-300 rounded-md shadow-sm" />
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Attach Diagram (Optional)</label>
                                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => e.target.files && handleImageUpload(qIndex, e.target.files[0], AssignmentType.OBJECTIVE)} className="text-sm w-full"/>
                                    {q.image && <img src={q.image} alt="diagram preview" className="mt-2 rounded-md border max-h-32"/>}
                                </div>
                                <div className="space-y-2">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-2">
                                            <input type="radio" name={`correct-answer-${qIndex}`} checked={q.correctAnswerIndex === oIndex} onChange={() => handleObjectiveQuestionChange(qIndex, 'correctAnswerIndex', oIndex)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300" />
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
                        <button type="button" onClick={type === AssignmentType.THEORY ? handleAddTheoryQuestion : handleAddObjectiveQuestion} className="w-full text-center py-2 border-2 border-dashed rounded-lg text-slate-500 hover:border-primary-500 hover:text-primary-600 transition">
                            Add Another Question
                        </button>
                    </div>
                </form>
                <div className="p-6 border-t bg-slate-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">{isEditMode ? 'Save Changes' : 'Create Assignment'}</button>
                </div>
            </div>
        </div>
    );
};
