// src/App.tsx
import React, { useState, useEffect } from 'react';
import Selector from './components/Selector';
import LogList from './components/LogList';
import HoldingList from './components/HoldingList';
import BottomNav from './components/BottomNav';
import ExecutingList from './components/ExecutingList';
import UnitSelector from './components/UnitSelector';
import type { LogEntry, Session, ActiveTab, TimeUnit } from './types';
import './App.scss';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

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

  const activeSessions = sessions.filter(s => s.status === 'active');
  const holdingSessions = sessions.filter(s => s.status === 'holding');

  const [newMemo, setNewMemo] = useState('');

  // ローカルストレージへの保存
  useEffect(() => { localStorage.setItem('workers', JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('logs', JSON.stringify(logs)); }, [logs]);

  // 共通のセッション更新ロジック
  const updateSession = (id: number, updates: Partial<Session>): void => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // 新規セッション開始
  const handleStart = () => {
    if (!selectedWorker || !selectedTask) {
      alert("作業者と作業内容を選択してください。");
      return;
    }

    const now = new Date();
    const newSession: Session = {
      id: Date.now(),
      worker: selectedWorker,
      task: selectedTask,
      memo: newMemo,
      initialStartTime: now,
      currentStartTime: now,
      totalElapsedTime: 0,
      status: 'active',
    };
    setSessions(prev => [...prev, newSession]);
    setNewMemo('');
    setActiveTab('executing');
  };

  // 保留
  const handleHold = (id: number) => {
    const sessionToHold = sessions.find(s => s.id === id);
    if (sessionToHold) {
      const elapsedTime = new Date().getTime() - sessionToHold.currentStartTime.getTime();
      updateSession(id, {
        status: 'holding',
        totalElapsedTime: sessionToHold.totalElapsedTime + elapsedTime,
      });
    }
  };

  // 完了
  const handleFinish = (id: number) => {
    const sessionToFinish = sessions.find(s => s.id === id);
    if (!sessionToFinish) return;

    const now = new Date();
    const elapsedTime = now.getTime() - sessionToFinish.currentStartTime.getTime();
    const finalElapsedTime = sessionToFinish.totalElapsedTime + elapsedTime;

    const totalSessionTime = now.getTime() - sessionToFinish.initialStartTime.getTime();
    const totalHoldingTime = totalSessionTime - finalElapsedTime;

    const durationSeconds = Math.floor(finalElapsedTime / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);
    const durationHours = Math.floor(durationMinutes / 60);

    const holdingSeconds = Math.floor(totalHoldingTime / 1000);
    const holdingMinutes = Math.floor(holdingSeconds / 60);
    const holdingHours = Math.floor(holdingMinutes / 60);

    const timeFormatOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    };

    const newLog: LogEntry = {
      id: sessionToFinish.id,
      date: sessionToFinish.initialStartTime.toLocaleDateString('ja-JP'),
      worker: sessionToFinish.worker,
      task: sessionToFinish.task,
      memo: sessionToFinish.memo,
      startTime: sessionToFinish.initialStartTime.toLocaleTimeString('ja-JP', timeFormatOptions),
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
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // 再開
  const handleResume = (id: number) => {
    const sessionToResume = sessions.find(s => s.id === id);
    if (sessionToResume) {
      updateSession(id, { status: 'active', currentStartTime: new Date() });
      setActiveTab('executing'); // ★ 実行中タブに自動で切り替え
    }
  };

  const handleReset = () => {
    setSelectedWorker(null);
    setSelectedTask(null);
    setNewMemo('');
  };

  const handleUpdateMemo = (id: number, updatedMemo: string) => {
    updateSession(id, { memo: updatedMemo });
  };

  const addWorker = (name: string) => {
    if (!workers.includes(name)) setWorkers([...workers, name]);
  };
  const addTask = (name: string) => {
    if (!tasks.includes(name)) setTasks([...tasks, name]);
  };
  const handleDeleteWorker = (workerToDelete: string) => {
    if (window.confirm(`作業者「${workerToDelete}」を削除しますか？`)) {
      if (selectedWorker === workerToDelete) {
        setSelectedWorker(null);
      }
      setWorkers(workers.filter(worker => worker !== workerToDelete));
    }
  };
  const handleDeleteTask = (taskToDelete: string) => {
    if (window.confirm(`作業内容「${taskToDelete}」を削除しますか？`)) {
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
    if (window.confirm('このセッションを完全に削除しますか？この操作は取り消せません。')) {
      setSessions(prevSessions => prevSessions.filter(session => session.id !== idToDelete));
    }
  };

  const renderHeaderContent = () => {
    switch (activeTab) {
      case 'measurement':
        return (
          <>
            <h1>計測開始</h1>
            <button onClick={handleReset} className="header-reset-button">リセット</button>
          </>
        );
      case 'executing':
        return <h1>実行中</h1>;
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
            <h1>作業記録</h1>
            <UnitSelector timeUnit={logTimeUnit} onSetTimeUnit={setLogTimeUnit} />
          </>
        );
      default:
        return <h1>Meas</h1>;
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
            <textarea
              className="memo-input"
              placeholder="作業に関するメモ (任意)"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
            />
            <div className="start-button-container">
              <button
                className="start-button"
                onClick={handleStart}
                disabled={!selectedWorker || !selectedTask}
              >
                作業を開始
              </button>
            </div>
          </>
        )}

        {activeTab === 'executing' && (
          <ExecutingList
            sessions={activeSessions}
            onHold={handleHold}
            onFinish={handleFinish}
            onUpdateMemo={handleUpdateMemo}
            onDelete={handleDeleteSession}
          />
        )}

        {activeTab === 'holding' && (
          <HoldingList
            sessions={holdingSessions}
            onResume={handleResume}
            timeUnit={holdingTimeUnit}
            onDelete={handleDeleteSession}
            onUpdateMemo={handleUpdateMemo}
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
        executingCount={activeSessions.length}
        holdingCount={holdingSessions.length}
      />
    </div>
  );
};

export default App;