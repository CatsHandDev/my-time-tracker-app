import React, { useState } from 'react';
import type { Session, LogEntry, TimeUnit } from '../types';
import './TimeDisplay.scss';
import UnitSelector from './UnitSelector';

type TimeDisplayProps = {
  activeSession: Session | null;
  latestLog: LogEntry | null;
  selectedWorker: string | null;
  selectedTask: string | null;
  isReadyToStart: boolean;
  onStart: () => void;
  onHold: () => void;
  onFinish: () => void;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  activeSession,
  latestLog,
  selectedWorker,
  selectedTask,
  isReadyToStart,
  onStart,
  onHold,
  onFinish,
}) => {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');

  const shouldDisplayLog =
    !activeSession &&
    latestLog &&
    latestLog.worker === selectedWorker &&
    latestLog.task === selectedTask;

  const getDurationDisplay = () => {
    if (activeSession) return '計測中...';
    if (shouldDisplayLog) {
      const { duration } = latestLog;
      const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
      switch (timeUnit) {
        case 'hours': return (totalSeconds / 3600).toFixed(2);
        case 'seconds': return totalSeconds.toString();
        case 'minutes':
        default: return (totalSeconds / 60).toFixed(2);
      }
    }
    return '0';
  };

  const formatTime = (date: Date | null) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date ? date.toLocaleTimeString('ja-JP', options) : '--:--:--';
  };

  const startTimeDisplay = activeSession
    ? formatTime(activeSession.initialStartTime)
    : (shouldDisplayLog ? latestLog.startTime : '--:--:--');

  const endTimeDisplay = activeSession
    ? '進行中'
    : (shouldDisplayLog ? latestLog.endTime : '--:--:--');

  return (
    <div className="time-display-container">
      <div className="time-controls">
        <div className="button-wrapper">
          <button onClick={onStart} disabled={!isReadyToStart || !!activeSession} className="control-button start">開始</button>
          <p className="timestamp"><span>{startTimeDisplay}</span></p>
        </div>
        <div className="button-wrapper">
          <button onClick={onHold} disabled={!activeSession} className="control-button hold">保留</button>
        </div>
        <div className="button-wrapper">
          <button onClick={onFinish} disabled={!activeSession} className="control-button end">終了</button>
          <p className="timestamp"><span>{endTimeDisplay}</span></p>
        </div>
      </div>

      <div className="duration">
        <div className="duration-value">
          {getDurationDisplay()}
        </div>
        <UnitSelector timeUnit={timeUnit} onSetTimeUnit={setTimeUnit} />
      </div>
    </div>
  );
};

export default TimeDisplay;