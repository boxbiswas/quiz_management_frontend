import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';

const UnauthorizedContent = () => {
    const { user } = useSelector((state) => state.auth);

    const redirectPath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

    return (
        <div className="min-h-screen bg-warm-50 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h1 className="font-display font-semibold text-3xl text-ink-900 mb-3">Access Denied</h1>
                <p className="font-body text-ink-700 mb-8">
                    You don't have permission to view this page. Please ensure you are logged in with the correct account role.
                </p>
                <Link 
                    to={redirectPath}
                    className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm px-6 py-3 rounded-full transition-all"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedContent;
