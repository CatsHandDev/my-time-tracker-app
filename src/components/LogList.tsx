import React from 'react';
import type { LogEntry } from '../types';
import './LogList.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type LogListProps = {
  logs: LogEntry[];
  onDeleteLog: (id: number) => void;
  onClearAllLogs: () => void;
};

const LogList: React.FC<LogListProps> = ({ logs, onDeleteLog, onClearAllLogs }) => {
  return (
    <div className="log-list-container">
      <div className="list-header">
        <h2>作業記録</h2>
        {logs.length > 0 && (
          <button onClick={onClearAllLogs} className="clear-all-button">すべて削除</button>
        )}
      </div>

      {logs.length === 0 ? (
        <p>記録はまだありません。</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="log-item">
              <div className="log-header">
                <span className="log-date">{log.date}</span>
                <span className="log-worker">{log.worker}</span>
                <button onClick={() => onDeleteLog(log.id)} className="delete-log-button">
                  <DeleteForeverIcon fontSize="small" />
                </button>
              </div>
              <div className="log-body">
                <p className="log-task">作業内容: {log.task}</p>
                <p className="log-time">
                  {log.startTime} 〜 {log.endTime}
                </p>
                <p className="log-duration">
                  経過時間: {log.duration.hours}時間 {log.duration.minutes}分 {log.duration.seconds}秒
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogList;