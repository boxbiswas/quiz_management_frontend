import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPassword/ForgotPasswordForm';
import icon from '../assets/icon.png';

const ForgotPassword = () => {
    return (
        <div className="min-h-screen bg-warm-50 bg-[radial-gradient(circle_at_20%_-10%,rgba(200,132,42,0.08),transparent_50%)] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl3 shadow-glass-lg p-10">
                <div className="flex items-center gap-3 mb-8">
                    <img src={icon} alt="QuizVerse Logo" className="w-12 h-12 mix-blend-multiply object-contain" />
                    <span className="font-display font-bold text-2xl text-ink-900 tracking-tight">
                        QuizVerse
                    </span>
                </div>
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-8">Reset Password</h1>
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPassword;
