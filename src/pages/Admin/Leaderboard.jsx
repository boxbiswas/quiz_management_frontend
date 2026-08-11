import React from 'react';
import LeaderboardContent from '../../components/common/LeaderboardContent';

const Leaderboard = () => {
    return (
        <div className="w-full">
            <LeaderboardContent userRole="ADMIN" />
        </div>
    );
};

export default Leaderboard;
