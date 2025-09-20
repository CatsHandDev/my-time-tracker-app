import React from 'react';
import type { TimeUnit } from '../types';
import './UnitSelector.scss';

type UnitSelectorProps = {
  timeUnit: TimeUnit;
  onSetTimeUnit: (unit: TimeUnit) => void;
};

const UnitSelector: React.FC<UnitSelectorProps> = ({ timeUnit, onSetTimeUnit }) => {
  return (
    <div className="unit-selectors">
      <button onClick={() => onSetTimeUnit('hours')} className={timeUnit === 'hours' ? 'active' : ''}>時</button>
      <button onClick={() => onSetTimeUnit('minutes')} className={timeUnit === 'minutes' ? 'active' : ''}>分</button>
      <button onClick={() => onSetTimeUnit('seconds')} className={timeUnit === 'seconds' ? 'active' : ''}>秒</button>
    </div>
  );
};

export default UnitSelector;