import React, { useState, useEffect } from 'react';

const HABITS = [
  { key: 'lights', title: 'Turn off unused lights', icon: '💡', impact: 0.2 },
  { key: 'transport', title: 'Use public transport', icon: '🚌', impact: 0.5 },
  { key: 'no-plastic', title: 'No plastic today', icon: '🚫🧴', impact: 0.3 },
  { key: 'recycle', title: 'Recycled waste', icon: '♻️', impact: 0.1 },
  { key: 'short-shower', title: 'Took a short shower', icon: '🚿', impact: 0.15 },
];
const POINTS_PER_HABIT = 10;
const STREAK_BADGE = 7;

function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Dashboard card for CO2 saved
function CO2DashboardCard({ today, total }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8 p-6 bg-[#FFF5E4] rounded-2xl shadow-lg flex flex-col items-center animate-fadein">
      <h3 className="text-xl font-bold text-pastel-accent mb-2">Your Carbon Savings</h3>
      <div className="flex flex-col items-center">
        <div className="text-lg text-gray-700 mb-1">CO₂ Saved Today</div>
        <div className="text-3xl font-extrabold text-green-700 mb-3">{today.toFixed(2)} kg</div>
        <div className="text-lg text-gray-700 mb-1">Total CO₂ Saved</div>
        <div className="text-2xl font-bold text-pastel-accent">{total.toFixed(2)} kg</div>
      </div>
    </div>
  );
}

export default function EcoHabitTracker() {
  const [checked, setChecked] = useState({});
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [totalCO2, setTotalCO2] = useState(0);

  // Load from localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = JSON.parse(localStorage.getItem('ecoHabits') || '{}');
    setChecked(saved[todayKey]?.checked || {});
    setPoints(saved[todayKey]?.points || 0);
    setStreak(saved.streak || 0);
    setTotalCO2(saved.totalCO2 || 0);
  }, []);

  // Save to localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = JSON.parse(localStorage.getItem('ecoHabits') || '{}');
    saved[todayKey] = { checked, points };
    saved.streak = streak;
    saved.totalCO2 = totalCO2;
    localStorage.setItem('ecoHabits', JSON.stringify(saved));
  }, [checked, points, streak, totalCO2]);

  // Reset every 24h
  useEffect(() => {
    const interval = setInterval(() => {
      const todayKey = getTodayKey();
      const saved = JSON.parse(localStorage.getItem('ecoHabits') || '{}');
      if (!saved[todayKey]) {
        setChecked({});
        setPoints(0);
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

  // Handle checking a habit
  function handleCheck(key) {
    const newChecked = { ...checked, [key]: !checked[key] };
    setChecked(newChecked);
    const completed = Object.values(newChecked).filter(Boolean).length;
    setPoints(completed * POINTS_PER_HABIT);
    // Streak logic
    if (completed === HABITS.length) {
      const todayKey = getTodayKey();
      const saved = JSON.parse(localStorage.getItem('ecoHabits') || '{}');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      if (saved[yKey]?.points === HABITS.length * POINTS_PER_HABIT) {
        if (streak + 1 === STREAK_BADGE) setShowBadge(true);
        setStreak(streak + 1);
      } else {
        if (streak === STREAK_BADGE - 1) setShowBadge(true);
        setStreak(1);
      }
    }
  }

  // Badge modal
  function BadgeModal() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounceIn">
          <span className="text-6xl mb-4">🏅</span>
          <h2 className="text-2xl font-bold text-pastel-accent mb-2">Badge Earned!</h2>
          <p className="text-lg text-gray-700 mb-4">7-day Eco-Habit Streak! Keep it up 🌱</p>
          <button className="bg-pastel-accent text-white px-6 py-2 rounded-full shadow hover:bg-pastel-highlight transition" onClick={() => setShowBadge(false)}>Close</button>
        </div>
      </div>
    );
  }

  // Calculate total CO2 saved today
  const totalImpact = Object.entries(checked).reduce((sum, [key, val]) => {
    if (val) {
      const habit = HABITS.find(h => h.key === key);
      return sum + (habit ? habit.impact : 0);
    }
    return sum;
  }, 0);

  // Update total CO2 saved (across all days)
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = JSON.parse(localStorage.getItem('ecoHabits') || '{}');
    let runningTotal = 0;
    Object.keys(saved).forEach(key => {
      if (/\d{4}-\d{2}-\d{2}/.test(key) && saved[key]?.checked) {
        runningTotal += Object.entries(saved[key].checked).reduce((sum, [k, v]) => {
          if (v) {
            const habit = HABITS.find(h => h.key === k);
            return sum + (habit ? habit.impact : 0);
          }
          return sum;
        }, 0);
      }
    });
    setTotalCO2(runningTotal);
  }, [checked]);

  return (
    <div>
      <CO2DashboardCard today={totalImpact} total={totalCO2} />
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white bg-pastel-section rounded-2xl shadow-lg animate-fadein">
        <h2 className="text-3xl font-bold text-pastel-accent mb-6 text-center">Eco-Habit Tracker</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {HABITS.map(habit => (
            <div key={habit.key} className="flex items-center bg-[#FFE3E1] rounded-xl shadow p-4">
              <input
                type="checkbox"
                checked={!!checked[habit.key]}
                onChange={() => handleCheck(habit.key)}
                className="w-6 h-6 accent-pastel-accent mr-4"
                id={habit.key}
              />
              <label htmlFor={habit.key} className="flex items-center cursor-pointer w-full">
                <span className="text-2xl mr-3">{habit.icon}</span>
                <span className="text-lg font-semibold">{habit.title}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div className="text-xl font-bold text-pastel-accent">Points: {points}</div>
          <div className="text-lg text-gray-700">Streak: {streak} days</div>
          <div className="text-lg text-green-700 mt-2">Saved {totalImpact.toFixed(2)}kg CO₂ today!</div>
        </div>
        {showBadge && <BadgeModal />}
      </div>
    </div>
  );
} 