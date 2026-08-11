import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import icon from '../../assets/icon.png';

const StudentLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser()).unwrap().then(() => {
            navigate('/login');
        });
    };

    const getNavClass = ({ isActive }) =>
        `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isActive
                ? 'text-ink-900 bg-warm-200/50'
                : 'text-ink-700 hover:text-ink-900 hover:bg-warm-100/50'
        }`;

    return (
        <div className="min-h-screen bg-warm-50 flex flex-col">
            <header className="sticky top-0 z-50 bg-warm-50/80 backdrop-blur-glass backdrop-saturate-150 border-b border-warm-200/30">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src={icon} alt="QuizVerse Logo" className="w-8 h-8 mix-blend-multiply object-contain" />
                        <span className="font-display font-semibold text-xl text-ink-900 tracking-tight">
                            QuizVerse
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/student/dashboard" className={getNavClass}>Dashboard</NavLink>
                        <NavLink to="/student/quizzes" className={getNavClass}>Discover Quizzes</NavLink>
                        <NavLink to="/student/history" className={getNavClass}>History</NavLink>
                        <NavLink to="/student/leaderboard" className={getNavClass}>Leaderboard</NavLink>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs rounded-full py-1 pr-4 pl-1.5 shadow-glass-sm border border-white/60">
                            <div className="w-7 h-7 bg-sage-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                                {user?.name?.[0]?.toUpperCase() || 'S'}
                            </div>
                            <span className="text-sm font-medium text-ink-700 truncate max-w-[100px]">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-ink-500 hover:text-rose-500 transition-colors bg-white/50 hover:bg-white rounded-full shadow-sm"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 md:py-12">
                <Outlet />
            </main>
        </div>
    );
};

export default StudentLayout;
