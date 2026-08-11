import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStudentQuizzes } from '../../../redux/slices/studentQuizzesSlice';
import { Search, Loader2, Play, BookOpen, Filter, SearchX } from 'lucide-react';

const QuizListContent = () => {
    const dispatch = useDispatch();
    const { quizzes, loading, error } = useSelector((state) => state.studentQuizzes);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const params = {
            search: debouncedTerm,
            difficulty: difficultyFilter
        };
        dispatch(fetchStudentQuizzes(params));
    }, [dispatch, debouncedTerm, difficultyFilter]);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">Available Quizzes</h1>
                    <p className="font-body text-ink-700">Test your knowledge across various subjects.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-ink-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/70 backdrop-blur-sm rounded-full pl-10 pr-4 py-2.5 font-body text-sm text-ink-900 placeholder:text-ink-500 border border-warm-200/50 shadow-glass-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                        />
                    </div>
                    
                    <div className="relative w-full sm:w-48 flex items-center bg-white/70 backdrop-blur-sm rounded-full border border-warm-200/50 shadow-glass-sm pr-4 py-0.5">
                        <div className="pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-ink-500" />
                        </div>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-body text-ink-900 py-2 pl-2 pr-2 appearance-none outline-none"
                        >
                            <option value="">All Difficulties</option>
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                    {error}
                </div>
            )}

            {loading && quizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                    <p className="text-ink-500 font-medium">Finding quizzes...</p>
                </div>
            ) : quizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-white/50 backdrop-blur-md rounded-xl2 border border-white">
                    <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                        <SearchX className="w-6 h-6 text-ink-500" />
                    </div>
                    <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No quizzes found</h3>
                    <p className="text-ink-500 text-sm">Try adjusting your search or difficulty filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md border border-white/50 p-6 flex flex-col transition-all hover:shadow-glass-lg hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`inline-flex items-center text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                    quiz.difficulty === 'EASY' ? 'bg-sage-50 text-sage-600 border-sage-200' : 
                                    quiz.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                    'bg-rose-50 text-rose-600 border-rose-200'
                                }`}>
                                    {quiz.difficulty}
                                </span>
                                {quiz.category && (
                                    <span className="text-xs font-body font-medium text-ink-500 flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        {quiz.category.name}
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="font-display font-semibold text-xl text-ink-900 mb-2 line-clamp-2">
                                {quiz.title}
                            </h3>
                            <p className="font-body text-sm text-ink-600 mb-6 line-clamp-2 flex-grow">
                                {quiz.description || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-warm-200/50">
                                <div className="text-xs font-mono text-ink-500">
                                    <span className="font-bold text-ink-900">{quiz.duration}</span> mins
                                </div>
                                <Link 
                                    to={`/student/quizzes/${quiz.id}`}
                                    className="bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white hover:shadow-md font-body font-medium text-sm px-4 py-2 rounded-full transition-all flex items-center gap-2"
                                >
                                    View Details
                                    <Play className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizListContent;
