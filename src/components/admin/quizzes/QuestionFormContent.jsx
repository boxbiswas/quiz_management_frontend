import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createAdminQuestion, updateAdminQuestion } from '../../../redux/slices/adminQuestionsSlice';
import { fetchAdminQuizById } from '../../../redux/slices/adminQuizzesSlice';
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const QuestionFormContent = () => {
    const { quizId, questionId } = useParams();
    const isEditMode = Boolean(questionId);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { questions, actionLoading } = useSelector((state) => state.adminQuestions);
    const { currentQuiz } = useSelector((state) => state.adminQuizzes);

    const [formData, setFormData] = useState({
        questionText: '',
        marks: 1,
        difficulty: 'EASY',
        explanation: ''
    });

    const [options, setOptions] = useState([
        { id: 1, optionText: '', isCorrect: true },
        { id: 2, optionText: '', isCorrect: false }
    ]);

    useEffect(() => {
        if (!currentQuiz || currentQuiz.id !== parseInt(quizId)) {
            dispatch(fetchAdminQuizById(quizId));
        }

        if (isEditMode && questions.length > 0) {
            const question = questions.find(q => q.id === parseInt(questionId));
            if (question) {
                setFormData({
                    questionText: question.questionText || '',
                    marks: question.marks || 1,
                    difficulty: question.difficulty || 'EASY',
                    explanation: question.explanation || ''
                });
                
                if (question.options && question.options.length > 0) {
                    setOptions(question.options.map(opt => ({
                        id: opt.id,
                        optionText: opt.optionText,
                        isCorrect: opt.isCorrect
                    })));
                }
            } else {
                toast.error("Question not found");
                navigate(`/admin/quizzes/${quizId}/questions`);
            }
        }
    }, [isEditMode, questionId, quizId, questions, currentQuiz, dispatch, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionTextChange = (id, text) => {
        setOptions(prev => prev.map(opt => 
            opt.id === id ? { ...opt, optionText: text } : opt
        ));
    };

    const handleCorrectOptionSelect = (id) => {
        setOptions(prev => prev.map(opt => ({
            ...opt,
            isCorrect: opt.id === id
        })));
    };

    const addOption = () => {
        setOptions(prev => [
            ...prev,
            { id: Date.now(), optionText: '', isCorrect: false }
        ]);
    };

    const removeOption = (id) => {
        if (options.length <= 2) {
            toast.warn("A question must have at least 2 options.");
            return;
        }

        const optionToRemove = options.find(o => o.id === id);
        if (optionToRemove.isCorrect) {
            toast.warn("You cannot remove the currently selected correct option. Select another correct option first.");
            return;
        }

        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.questionText) {
            toast.error("Question text is required.");
            return;
        }

        if (options.some(opt => !opt.optionText.trim())) {
            toast.error("All options must have text. Please remove empty options or fill them in.");
            return;
        }

        const correctOptionsCount = options.filter(opt => opt.isCorrect).length;
        if (correctOptionsCount !== 1) {
            toast.error("You must select exactly one correct option.");
            return;
        }

        const payload = {
            questionText: formData.questionText,
            marks: parseInt(formData.marks),
            difficulty: formData.difficulty,
            explanation: formData.explanation,
            options: options.map(opt => ({
                optionText: opt.optionText,
                isCorrect: opt.isCorrect
            }))
        };

        try {
            if (isEditMode) {
                await dispatch(updateAdminQuestion({ id: questionId, questionData: payload })).unwrap();
                toast.success("Question updated successfully!");
            } else {
                await dispatch(createAdminQuestion({ quizId, questionData: payload })).unwrap();
                toast.success("Question created successfully!");
            }
            navigate(`/admin/quizzes/${quizId}/questions`);
        } catch (error) {
            toast.error(error || "An error occurred while saving the question.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to={`/admin/quizzes/${quizId}/questions`} className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Questions
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                    {isEditMode ? 'Edit Question' : 'Add Question'}
                </h1>
                <p className="font-body text-ink-700">
                    {currentQuiz ? `For Quiz: ${currentQuiz.title}` : 'Build your quiz content'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Question Details */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-lg p-8 border border-white/50">
                    <h2 className="font-display font-semibold text-xl text-ink-900 mb-6">Question Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Question Text *</label>
                            <textarea
                                name="questionText"
                                value={formData.questionText}
                                onChange={handleFormChange}
                                placeholder="What is the capital of..."
                                rows="3"
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Marks *</label>
                            <input
                                type="number"
                                name="marks"
                                min="1"
                                value={formData.marks}
                                onChange={handleFormChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Difficulty *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleFormChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Explanation (Optional)</label>
                            <textarea
                                name="explanation"
                                value={formData.explanation}
                                onChange={handleFormChange}
                                placeholder="Explain why the correct answer is correct..."
                                rows="2"
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Options Configuration */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-lg p-8 border border-white/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-display font-semibold text-xl text-ink-900">Answers / Options</h2>
                            <p className="text-sm text-ink-500 mt-1">Provide options and select the correct one using the radio button.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="bg-warm-100 text-ink-700 hover:bg-warm-200 font-body font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
                    </div>

                    <div className="space-y-4">
                        {options.map((option, index) => (
                            <div 
                                key={option.id} 
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                                    option.isCorrect ? 'bg-sage-50 border-sage-200' : 'bg-white/50 border-warm-200/50'
                                }`}
                            >
                                <div className="pt-3">
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        checked={option.isCorrect}
                                        onChange={() => handleCorrectOptionSelect(option.id)}
                                        className="w-5 h-5 text-sage-600 focus:ring-sage-500 border-gray-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={option.optionText}
                                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className={`w-full bg-transparent border-b px-2 py-2 font-body outline-none transition-colors ${
                                            option.isCorrect 
                                            ? 'border-sage-300 focus:border-sage-500 text-sage-900 placeholder:text-sage-400' 
                                            : 'border-warm-200 focus:border-amber-400 text-ink-900'
                                        }`}
                                    />
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => removeOption(option.id)}
                                        className="p-2 text-warm-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Remove Option"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link 
                        to={`/admin/quizzes/${quizId}/questions`}
                        className="px-6 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEditMode ? 'Save Question' : 'Add Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionFormContent;
