import React from 'react';
import type { TimeUnit } from '../types';
import './TimeDisplay.scss';

type TimeDisplayProps = {
  startTime: Date | null;
  endTime: Date | null;
  duration: { hours: number; minutes: number; seconds: number; } | null;
  timeUnit: TimeUnit;
  isReady: boolean;
  onStart: () => void;
  onEnd: () => void;
  onSetTimeUnit: (unit: TimeUnit) => void;
  onReset: () => void;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  startTime,
  endTime,
  duration,
  timeUnit,
  isReady,
  onStart,
  onEnd,
  onSetTimeUnit,
  onReset
}) => {
  const formatTime = (date: Date | null) => {
    return date ? date.toLocaleTimeString('ja-JP') : '--:--:--';
  };

  const getDurationDisplay = () => {
    if (!duration) return '0';
    switch (timeUnit) {
      case 'hours':
        return (duration.hours + duration.minutes / 60 + duration.seconds / 3600).toFixed(2);
      case 'seconds':
        return (duration.hours * 3600 + duration.minutes * 60 + duration.seconds).toString();
      case 'minutes':
      default:
        return (duration.hours * 60 + duration.minutes + duration.seconds / 60).toFixed(2);
    }
  };


  return (
    <div className="time-display-container">
      <div className="time-controls">
        <div className="button-wrapper">
          <button onClick={onStart} disabled={!isReady || !!startTime} className="control-button start">開始</button>
          <p className="timestamp"><span>{formatTime(startTime)}</span></p>
        </div>
        <div className="button-wrapper">
          <button onClick={onEnd} disabled={!startTime || !!endTime} className="control-button end">終了</button>
          <p className="timestamp"><span>{formatTime(endTime)}</span></p>
        </div>
      </div>

      <div style={{display: "flex", justifyContent: "space-around"}}>
        <div className="duration">
          <div className="duration-value">
            {getDurationDisplay()}
          </div>
          <div className="unit-selectors">
            <button onClick={() => onSetTimeUnit('hours')} className={timeUnit === 'hours' ? 'active' : ''}>時</button>
            <button onClick={() => onSetTimeUnit('minutes')} className={timeUnit === 'minutes' ? 'active' : ''}>分</button>
            <button onClick={() => onSetTimeUnit('seconds')} className={timeUnit === 'seconds' ? 'active' : ''}>秒</button>
          </div>
        </div>
        <div className="reset-wrapper">
          <button onClick={onReset} className="reset-button">リセット</button>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;