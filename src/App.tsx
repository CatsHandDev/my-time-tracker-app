import React, { useState, useEffect } from 'react';
import Selector from './components/Selector';
import TimeDisplay from './components/TimeDisplay';
import LogList from './components/LogList';
import type { LogEntry, TimeUnit } from './types';
import './App.scss';

const App: React.FC = () => {
  // 状態管理
  const [workers, setWorkers] = useState<string[]>(() => JSON.parse(localStorage.getItem('workers') || '[]'));
  const [tasks, setTasks] = useState<string[]>(() => JSON.parse(localStorage.getItem('tasks') || '[]'));
  const [logs, setLogs] = useState<LogEntry[]>(() => JSON.parse(localStorage.getItem('logs') || '[]'));

  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');

  // ローカルストレージへの保存
  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  // 経過時間の計算
  useEffect(() => {
    if (startTime && endTime) {
      const diff = endTime.getTime() - startTime.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      setDuration({
        hours: hours,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    } else if (!startTime) {
      setDuration(null);
    }
  }, [startTime, endTime]);


  const handleStart = () => {
    setStartTime(new Date());
    setEndTime(null);
    setDuration(null);
  };

  const handleEnd = () => {
    if (!startTime) return;
    const currentEndTime = new Date();
    setEndTime(currentEndTime);

    if (selectedWorker && selectedTask && startTime) {
        const diff = currentEndTime.getTime() - startTime.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

      const newLog: LogEntry = {
        id: Date.now(),
        date: startTime.toLocaleDateString('ja-JP'),
        worker: selectedWorker,
        task: selectedTask,
        startTime: startTime.toLocaleTimeString('ja-JP'),
        endTime: currentEndTime.toLocaleTimeString('ja-JP'),
        duration: {
            hours: hours,
            minutes: minutes % 60,
            seconds: seconds % 60,
        },
      };
      setLogs([newLog, ...logs]);
    }
  };

  const addWorker = (name: string) => {
    if (!workers.includes(name)) {
      setWorkers([...workers, name]);
    }
  };

  const addTask = (name: string) => {
    if (!tasks.includes(name)) {
      setTasks([...tasks, name]);
    }
  };

  const handleReset = () => {
    setSelectedWorker(null);
    setSelectedTask(null);
    setStartTime(null);
    setEndTime(null);
  };

  const handleDeleteLog = (id: number) => {
    if (window.confirm('この記録を削除しますか？')) {
        setLogs(logs.filter(log => log.id !== id));
    }
  };

  const handleClearAllLogs = () => {
    if (window.confirm('本当にすべての記録を削除しますか？')) {
        setLogs([]);
    }
  };

  const isReady = !!selectedWorker && !!selectedTask;

  return (
    <div className="app-container">
      <h1>作業時間トラッカー</h1>
      <Selector
        title="作業者"
        items={workers}
        selectedItem={selectedWorker}
        onSelectItem={setSelectedWorker}
        onAddItem={addWorker}
      />
      <Selector
        title="作業内容"
        items={tasks}
        selectedItem={selectedTask}
        onSelectItem={setSelectedTask}
        onAddItem={addTask}
      />
      <TimeDisplay
        startTime={startTime}
        endTime={endTime}
        duration={duration}
        timeUnit={timeUnit}
        isReady={isReady}
        onStart={handleStart}
        onEnd={handleEnd}
        onSetTimeUnit={setTimeUnit}
        onReset={handleReset}
      />
      <LogList
        logs={logs}
        onDeleteLog={handleDeleteLog}
        onClearAllLogs={handleClearAllLogs}
      />
    </div>
  );
};

export default App;