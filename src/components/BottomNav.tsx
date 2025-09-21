import React from 'react';
import type { ActiveTab } from '../types';
import './BottomNav.scss';
import TimerIcon from '@mui/icons-material/Timer';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

type BottomNavProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  executingCount: number;
  holdingCount: number;
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, executingCount, holdingCount }) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${activeTab === 'measurement' ? 'active' : ''}`}
        onClick={() => setActiveTab('measurement')}
      >
        <TimerIcon />
        <span>計測</span>
      </button>
      <button className={`nav-button ${activeTab === 'executing' ? 'active' : ''}`} onClick={() => setActiveTab('executing')}>
        <PlaylistPlayIcon />
        <span>実行中</span>
        {executingCount > 0 && <span className="badge">{executingCount}</span>}
      </button>
      <button
        className={`nav-button ${activeTab === 'holding' ? 'active' : ''}`}
        onClick={() => setActiveTab('holding')}
      >
        <PauseCircleOutlineIcon />
        <span>保留</span>
        {holdingCount > 0 && <span className="badge">{holdingCount}</span>}
      </button>
      <button
        className={`nav-button ${activeTab === 'logs' ? 'active' : ''}`}
        onClick={() => setActiveTab('logs')}
      >
        <HistoryIcon />
        <span>履歴</span>
      </button>
    </nav>
  );
};

export default BottomNav;