import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUserById, clearSelectedUser, updateAdminUserStatus, deleteAdminUser } from '../../../redux/slices/adminUsersSlice';
import { ArrowLeft, Loader2, ShieldAlert, CheckCircle, Trash2, Calendar, Mail, User as UserIcon, Activity, Trophy, XCircle } from 'lucide-react';

import { toast } from 'react-toastify';

const UserProfileContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedUser: data, loading, error } = useSelector((state) => state.adminUsers);

    useEffect(() => {
        dispatch(fetchAdminUserById(id));
        return () => {
            dispatch(clearSelectedUser());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                <p className="text-ink-500 font-medium">Loading profile...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShieldAlert className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <p className="text-rose-500 font-medium mb-2">Failed to load profile</p>
                <p className="text-sm text-ink-500 mb-6">{error}</p>
                <Link to="/admin/users" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                    &larr; Back to Students
                </Link>
            </div>
        );
    }

    const { profile, performance, history } = data;

    const handleToggleStatus = () => {
        const newStatus = profile.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        dispatch(updateAdminUserStatus({ userId: profile.id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`User marked as ${newStatus.toLowerCase()}`))
            .catch((err) => toast.error(err));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this user? All their attempts will be lost.')) {
            dispatch(deleteAdminUser(profile.id))
                .unwrap()
                .then(() => {
                    toast.success('User deleted successfully');
                    navigate('/admin/users');
                })
                .catch((err) => toast.error(err));
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Students
                </Link>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl3 shadow-glass-lg p-8 md:p-10 mb-8 border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center shadow-glass-sm border border-white">
                            <UserIcon className="w-10 h-10 text-amber-600/50" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="font-display font-semibold text-3xl text-ink-900 tracking-tight">{profile.name}</h1>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest border ${
                                    profile.status === 'ACTIVE' ? 'bg-sage-500/10 text-sage-600 border-sage-500/20' : 'bg-ink-100 text-ink-600 border-ink-200'
                                }`}>
                                    {profile.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center gap-2 text-sm text-ink-700">
                                    <Mail className="w-4 h-4 text-ink-400" />
                                    {profile.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-ink-700">
                                    <Calendar className="w-4 h-4 text-ink-400" />
                                    Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleToggleStatus}
                            className="bg-white hover:bg-warm-50 text-ink-700 font-body font-medium text-sm px-4 py-2.5 rounded-full shadow-glass-sm transition-all border border-warm-200/50 flex items-center gap-2"
                        >
                            {profile.status === 'ACTIVE' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {profile.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-body font-medium text-sm px-4 py-2.5 rounded-full shadow-none transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-500 mb-4">Performance Metrics</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-glass-sm border border-warm-100/50">
                        <div className="flex items-center gap-2 mb-2 text-ink-500">
                            <Activity className="w-4 h-4" />
                            <h3 className="font-mono text-[11px] uppercase tracking-wider">Attempts</h3>
                        </div>
                        <p className="font-display text-3xl text-ink-900">{performance.quizzesAttempted}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-glass-sm border border-warm-100/50">
                        <div className="flex items-center gap-2 mb-2 text-ink-500">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <h3 className="font-mono text-[11px] uppercase tracking-wider">Avg Score</h3>
                        </div>
                        <p className="font-display text-3xl text-ink-900">{performance.averageScore}%</p>
                    </div>
                    <div className="bg-sage-50/50 backdrop-blur-sm rounded-xl p-6 shadow-glass-sm border border-sage-100/50">
                        <div className="flex items-center gap-2 mb-2 text-sage-600">
                            <CheckCircle className="w-4 h-4" />
                            <h3 className="font-mono text-[11px] uppercase tracking-wider">Passed</h3>
                        </div>
                        <p className="font-display text-3xl text-sage-700">{performance.passed}</p>
                    </div>
                    <div className="bg-rose-50/50 backdrop-blur-sm rounded-xl p-6 shadow-glass-sm border border-rose-100/50">
                        <div className="flex items-center gap-2 mb-2 text-rose-600">
                            <XCircle className="w-4 h-4" />
                            <h3 className="font-mono text-[11px] uppercase tracking-wider">Failed</h3>
                        </div>
                        <p className="font-display text-3xl text-rose-700">{performance.failed}</p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-500 mb-4">Quiz History</p>
                <div className="bg-white/60 backdrop-blur-glass rounded-xl2 shadow-glass-sm border-0 overflow-hidden">
                    {history.length === 0 ? (
                        <div className="p-12 text-center text-ink-500 font-body">
                            No quiz attempts recorded yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-warm-200/40 bg-warm-50/50">
                                        <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Quiz Title</th>
                                        <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Category</th>
                                        <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Score</th>
                                        <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-warm-200/30">
                                    {history.map((attempt) => (
                                        <tr key={attempt.id} className="hover:bg-white/50 transition-colors">
                                            <td className="px-6 py-4 font-body font-medium text-ink-900">
                                                {attempt.quiz.title}
                                            </td>
                                            <td className="px-6 py-4 font-body text-sm text-ink-700">
                                                {attempt.quiz.category.name}
                                            </td>
                                            <td className="px-6 py-4 font-body text-sm text-ink-500">
                                                {new Date(attempt.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-body text-sm font-medium text-ink-900">
                                                {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                    attempt.status === 'PASSED' 
                                                        ? 'bg-sage-50 text-sage-600 border-sage-200' 
                                                        : 'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}>
                                                    {attempt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileContent;
