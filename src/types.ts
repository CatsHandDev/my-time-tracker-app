export type SessionStatus = 'active' | 'holding';
export type ActiveTab = 'measurement' | 'holding' | 'logs';

export type Session = {
  id: number;
  worker: string;
  task: string;
  initialStartTime: Date;
  currentStartTime: Date;
  totalElapsedTime: number;
  status: SessionStatus;
};

export type LogEntry = {
  id: number;
  date: string;
  worker: string;
  task: string;
  startTime: string;
  endTime:string;
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  holdingTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  status: '完了';
};

export type TimeUnit = 'hours' | 'minutes' | 'seconds';