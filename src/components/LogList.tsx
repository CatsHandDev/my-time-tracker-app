import React from 'react';
import type { LogEntry, TimeUnit } from '../types';
import './LogList.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type LogListProps = {
  logs: LogEntry[];
  onDeleteLog: (id: number) => void;
  onClearAllLogs: () => void;
  timeUnit: TimeUnit;
};

const formatDuration = (
  duration: { hours: number; minutes: number; seconds: number } | undefined,
  unit: TimeUnit
): string => {
  if (!duration) return '0';

  const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
  switch (unit) {
    case 'hours':
      return `${(totalSeconds / 3600).toFixed(2)} 時間`;
    case 'seconds':
      return `${totalSeconds} 秒`;
    case 'minutes':
    default:
      return `${(totalSeconds / 60).toFixed(2)} 分`;
  }
};

const LogList: React.FC<LogListProps> = ({ logs, onDeleteLog, onClearAllLogs, timeUnit }) => {
  return (
    <div className="log-list-container">
      <div className="list-header">
        <div className="list-header-content">
          {logs.length > 0 && (
            <button onClick={onClearAllLogs} className="clear-all-button">すべて削除</button>
          )}
        </div>
      </div>

      {logs.length === 0 ? (
        <p>記録はまだありません。</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="log-item">
              <div className="log-header">
                <span className="log-date">{log.date}</span>
                <span className="log-status">{log.status}</span>
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
                  実働時間: {formatDuration(log.duration, timeUnit)}
                </p>
                {log.holdingTime && (
                  <p className="log-holding-time">
                    保留時間: {log.holdingTime.hours}時間 {log.holdingTime.minutes}分 {log.holdingTime.seconds}秒
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogList;