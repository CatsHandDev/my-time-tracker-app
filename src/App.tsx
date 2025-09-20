// src/App.tsx
import React, { useState, useEffect } from 'react';
import Selector from './components/Selector';
import TimeDisplay from './components/TimeDisplay';
import LogList from './components/LogList';
import type { LogEntry, Session, ActiveTab, TimeUnit } from './types';
import './App.scss';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HoldingList from './components/HoldingList';
import BottomNav from './components/BottomNav';
import UnitSelector from './components/UnitSelector';
// localStorageから読み込んだ、Dateが文字列である状態のセッションの型
type RawSession = Omit<Session, 'initialStartTime' | 'currentStartTime'> & {
  initialStartTime: string;
  currentStartTime: string;
};

const App: React.FC = () => {
  // 状態管理
  const [workers, setWorkers] = useState<string[]>(() => JSON.parse(localStorage.getItem('workers') || '[]'));
  const [tasks, setTasks] = useState<string[]>(() => JSON.parse(localStorage.getItem('tasks') || '[]'));
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      return JSON.parse(savedSessions).map((s: RawSession) => ({
        ...s,
        initialStartTime: new Date(s.initialStartTime),
        currentStartTime: new Date(s.currentStartTime),
      }));
    }
    return [];
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => JSON.parse(localStorage.getItem('logs') || '[]'));

  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('measurement');
  const [holdingTimeUnit, setHoldingTimeUnit] = useState<TimeUnit>('minutes');
  const [logTimeUnit, setLogTimeUnit] = useState<TimeUnit>('minutes');
  const activeSession = sessions.find(s => s.status === 'active') || null;
  const holdingSessions = sessions.filter(s => s.status === 'holding');
  const handleReset = () => {
    setSelectedWorker(null);
    setSelectedTask(null);
  };

  // ローカルストレージへの保存
  useEffect(() => { localStorage.setItem('workers', JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('logs', JSON.stringify(logs)); }, [logs]);

  // 共通のセッション更新ロジック
  const updateSession = (id: number, updates: Partial<Session>): void => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // 進行中のセッションがあれば経過時間を計算して保留状態にする
  const holdCurrentSession = (): void => {
    if (activeSession) {
      const elapsedTime = new Date().getTime() - activeSession.currentStartTime.getTime();
      updateSession(activeSession.id, {
        status: 'holding',
        totalElapsedTime: activeSession.totalElapsedTime + elapsedTime,
      });
    }
  };

  // 新規セッション開始
  const handleStart = () => {
    if (!selectedWorker || !selectedTask) return;
    holdCurrentSession(); // 既存のセッションがあれば保留

    const now = new Date();
    const newSession: Session = {
      id: Date.now(),
      worker: selectedWorker,
      task: selectedTask,
      initialStartTime: now,
      currentStartTime: now,
      totalElapsedTime: 0,
      status: 'active',
    };
    setSessions(prev => [...prev, newSession]);
  };

  // 保留
  const handleHold = () => {
    if (!activeSession) return;
    holdCurrentSession();
  };

  // 完了
  const handleFinish = () => {
    if (!activeSession) return;
    const now = new Date();
    const elapsedTime = now.getTime() - activeSession.currentStartTime.getTime();
    // finalElapsedTime は合計の「実働」時間 (ms)
    const finalElapsedTime = activeSession.totalElapsedTime + elapsedTime;

    // 合計保留時間を計算
    const totalSessionTime = now.getTime() - activeSession.initialStartTime.getTime();
    const totalHoldingTime = totalSessionTime - finalElapsedTime;

    // 実働時間を時分秒に変換
    const durationSeconds = Math.floor(finalElapsedTime / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);
    const durationHours = Math.floor(durationMinutes / 60);

    // 保留時間を時分秒に変換
    const holdingSeconds = Math.floor(totalHoldingTime / 1000);
    const holdingMinutes = Math.floor(holdingSeconds / 60);
    const holdingHours = Math.floor(holdingMinutes / 60);

    const timeFormatOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    };

    const newLog: LogEntry = {
      id: activeSession.id,
      date: activeSession.initialStartTime.toLocaleDateString('ja-JP'),
      worker: activeSession.worker,
      task: activeSession.task,
      startTime: activeSession.initialStartTime.toLocaleTimeString('ja-JP', timeFormatOptions),
      endTime: now.toLocaleTimeString('ja-JP', timeFormatOptions),
      duration: {
        hours: durationHours,
        minutes: durationMinutes % 60,
        seconds: durationSeconds % 60
      },
      holdingTime: {
        hours: holdingHours,
        minutes: holdingMinutes % 60,
        seconds: holdingSeconds % 60,
      },
      status: '完了',
    };

    setLogs(prev => [newLog, ...prev]);
    setSessions(prev => prev.filter(s => s.id !== activeSession.id));
  };

  // 再開
  const handleResume = (id: number) => {
    holdCurrentSession(); // 既存のセッションがあれば保留
    const sessionToResume = sessions.find(s => s.id === id);
    if (sessionToResume) {
      updateSession(id, { status: 'active', currentStartTime: new Date() });
      setSelectedWorker(sessionToResume.worker);
      setSelectedTask(sessionToResume.task);
    }
  };

  const addWorker = (name: string) => {
    if (!workers.includes(name)) setWorkers([...workers, name]);
  };

  const addTask = (name: string) => {
    if (!tasks.includes(name)) setTasks([...tasks, name]);
  };

  const handleDeleteWorker = (workerToDelete: string) => {
    if (window.confirm(`作業者「${workerToDelete}」を削除しますか？`)) {
      // 選択中の作業者を削除した場合は、選択状態も解除する
      if (selectedWorker === workerToDelete) {
        setSelectedWorker(null);
      }
      setWorkers(workers.filter(worker => worker !== workerToDelete));
    }
  };

  const handleDeleteTask = (taskToDelete: string) => {
    if (window.confirm(`作業内容「${taskToDelete}」を削除しますか？`)) {
      // 選択中の作業内容を削除した場合は、選択状態も解除する
      if (selectedTask === taskToDelete) {
        setSelectedTask(null);
      }
      setTasks(tasks.filter(task => task !== taskToDelete));
    }
  };

  const handleDeleteLog = (id: number) => {
    if (window.confirm('この記録を削除しますか？')) setLogs(logs.filter(log => log.id !== id));
  };

  const handleClearAllLogs = () => {
    if (window.confirm('本当にすべての記録を削除しますか？')) setLogs([]);
  };

  const handleDeleteSession = (idToDelete: number) => {
    if (window.confirm('この保留中のセッションを完全に削除しますか？この操作は取り消せません。')) {
      setSessions(prevSessions => prevSessions.filter(session => session.id !== idToDelete));
    }
  };

  const renderHeaderContent = () => {
    switch (activeTab) {
      case 'measurement':
        return (
          <>
            <h1>Meas</h1>
            <button onClick={handleReset} className="header-reset-button">リセット</button>
          </>
        );
      case 'holding':
        return (
          <>
            <h1>保留中</h1>
            <UnitSelector timeUnit={holdingTimeUnit} onSetTimeUnit={setHoldingTimeUnit} />
          </>
        );
      case 'logs':
        return (
          <>
            <h1>履歴</h1>
            <UnitSelector timeUnit={logTimeUnit} onSetTimeUnit={setLogTimeUnit} />
          </>
        );
      default:
        return <h1>Meas</h1>; // デフォルトのタイトル
    }
  };

  return (
    <div className="app-container">
      <header className="page-header">
        {renderHeaderContent()}
      </header>
      <main className="content-area">
        {activeTab === 'measurement' && (
          <>
            <Selector
              title="作業者"
              icon={<PersonIcon />}
              items={workers}
              selectedItem={selectedWorker}
              onSelectItem={setSelectedWorker}
              onAddItem={addWorker}
              onDeleteItem={handleDeleteWorker}
            />
            <Selector
              title="作業内容"
              icon={<AssignmentIcon />}
              items={tasks}
              selectedItem={selectedTask}
              onSelectItem={setSelectedTask}
              onAddItem={addTask}
              onDeleteItem={handleDeleteTask}
            />
            <TimeDisplay
              activeSession={activeSession}
              latestLog={logs[0] || null}
              selectedWorker={selectedWorker}
              selectedTask={selectedTask}
              isReadyToStart={!!selectedWorker && !!selectedTask}
              onStart={handleStart}
              onHold={handleHold}
              onFinish={handleFinish}
            />
          </>
        )}

        {activeTab === 'holding' && (
          <HoldingList
            sessions={holdingSessions}
            onResume={handleResume}
            timeUnit={holdingTimeUnit}
            onDelete={handleDeleteSession}
          />
        )}
        {activeTab === 'logs' && (
          <LogList
            logs={logs}
            onDeleteLog={handleDeleteLog}
            onClearAllLogs={handleClearAllLogs}
            timeUnit={logTimeUnit}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        holdingCount={holdingSessions.length}
      />
    </div>
  );
};

export default App;