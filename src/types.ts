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
};

export type TimeUnit = 'hours' | 'minutes' | 'seconds';