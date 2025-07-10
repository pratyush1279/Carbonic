import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // <-- Add this
  ArcElement, // <-- Add this
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRef } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // <-- Register BarElement
  ArcElement, // <-- Register ArcElement
  Title,
  Tooltip,
  Legend
);

const initialEntries = [
  { date: '2024-06-01', vehicle: 'Car', distance: 20, emissions: 4.2 },
  { date: '2024-06-02', vehicle: 'Bike', distance: 5, emissions: 0.2 },
  { date: '2024-06-03', vehicle: 'Car', distance: 15, emissions: 3.1 },
];

const vehicleTypes = [
  { label: 'Car', value: 'car', factor: 2.3 }, // kg CO2 per hour (example)
  { label: 'Bus', value: 'bus', factor: 0.8 },
  { label: 'Bike', value: 'bike', factor: 0.05 },
  { label: 'Train', value: 'train', factor: 0.4 },
  { label: 'Walk', value: 'walk', factor: 0 },
];

// Sample missions
const sampleMissions = [
  { id: 1, text: 'Use public transport for 3 days', type: 'weekly', goal: 3 },
  { id: 2, text: 'Bike to work once', type: 'daily', goal: 1 },
  { id: 3, text: 'Walk 5 km in a week', type: 'weekly', goal: 5 },
];
const sampleBadges = [
  { id: 1, name: 'Eco Starter', icon: '🌱', desc: 'Completed your first mission!' },
  { id: 2, name: 'Transit Champ', icon: '🚌', desc: 'Used public transport 3 times.' },
];

function Dashboard() {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState({ date: '', vehicle: '', distance: '', emissions: '' });
  const [journey, setJourney] = useState({
    vehicle: '',
    duration: '',
  });
  const [missions, setMissions] = useState(sampleMissions.map(m => ({ ...m, progress: 0, completed: false })));
  const [badges, setBadges] = useState([sampleBadges[0]]);
  const [invite, setInvite] = useState({ email: '', username: '' });
  const [inviteMsg, setInviteMsg] = useState('');

  // Calculate summary
  const totalEmissions = entries.reduce((sum, e) => sum + Number(e.emissions), 0);
  const avgEmissions = entries.length ? (totalEmissions / entries.length).toFixed(2) : 0;

  // Chart data
  const chartData = {
    labels: entries.map(e => e.date),
    datasets: [
      {
        label: 'Emissions (kg CO₂)',
        data: entries.map(e => e.emissions),
        fill: false,
        borderColor: '#FF9494',
        backgroundColor: '#FF9494',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Carbon Footprint Over Time' },
    },
  };

  // Bar Chart: Emissions by Vehicle Type
  const vehicleEmissions = entries.reduce((acc, e) => {
    if (!acc[e.vehicle]) acc[e.vehicle] = 0;
    acc[e.vehicle] += Number(e.emissions);
    return acc;
  }, {});
  const barData = {
    labels: Object.keys(vehicleEmissions),
    datasets: [
      {
        label: 'Emissions (kg CO₂)',
        data: Object.values(vehicleEmissions),
        backgroundColor: [
          '#FF9494', '#A0E7E5', '#B4F8C8', '#FBE7C6', '#A0C4FF', '#FFD6A5',
        ],
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Emissions by Vehicle Type' },
    },
  };

  // Pie Chart: Emissions Share by Vehicle Type
  const pieData = {
    labels: Object.keys(vehicleEmissions),
    datasets: [
      {
        label: 'Emissions Share',
        data: Object.values(vehicleEmissions),
        backgroundColor: [
          '#FF9494', '#A0E7E5', '#B4F8C8', '#FBE7C6', '#A0C4FF', '#FFD6A5',
        ],
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Emissions Share by Vehicle Type' },
    },
  };

  // Trees Saved Calculation
  const TREE_CO2_KG = 21; // 1 tree absorbs ~21 kg CO2/year
  const treesSaved = Math.floor((totalEmissions / TREE_CO2_KG) * 100) / 100;

  // Social Share Message
  const shareMessage = `I've tracked my carbon footprint with Carbonic! Total emissions: ${totalEmissions.toFixed(2)} kg CO₂, which is equal to saving ${treesSaved} trees 🌳. Join me and #GoGreen with @carbonicapp!`;
  const shareUrl = window.location.origin + '/dashboard';
  const clipboardRef = useRef();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    if (clipboardRef.current) {
      clipboardRef.current.innerText = 'Copied!';
      setTimeout(() => {
        clipboardRef.current.innerText = 'Copy Caption';
      }, 1500);
    }
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Carbonic Stats',
        text: shareMessage,
        url: shareUrl,
      });
    }
  };

  // Handle form
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.date || !form.vehicle || !form.distance || !form.emissions) return;
    setEntries([...entries, { ...form, distance: Number(form.distance), emissions: Number(form.emissions) }]);
    setForm({ date: '', vehicle: '', distance: '', emissions: '' });
  };

  // Add Vehicle Journey
  const handleJourneyChange = e => {
    setJourney({ ...journey, [e.target.name]: e.target.value });
  };

  const handleJourneySave = e => {
    e.preventDefault();
    if (!journey.vehicle || !journey.duration) return;
    const type = vehicleTypes.find(v => v.value === journey.vehicle);
    const emissions = type ? (type.factor * Number(journey.duration)).toFixed(2) : 0;
    setEntries([
      ...entries,
      {
        date: new Date().toISOString().slice(0, 10),
        vehicle: type ? type.label : journey.vehicle,
        distance: '-',
        emissions: Number(emissions),
        duration: journey.duration,
      },
    ]);
    setJourney({ vehicle: '', duration: '' });
  };

  // Mission progress handlers
  const handleMissionProgress = (id) => {
    setMissions(missions => missions.map(m => {
      if (m.id === id && !m.completed) {
        const newProgress = m.progress + 1;
        const completed = newProgress >= m.goal;
        // Award badge if completed
        if (completed && !badges.find(b => b.id === id + 1)) {
          setBadges(badges => [...badges, sampleBadges[id] || sampleBadges[0]]);
        }
        return { ...m, progress: newProgress, completed };
      }
      return m;
    }));
  };

  // Invite/challenge friend
  const handleInviteChange = e => {
    setInvite({ ...invite, [e.target.name]: e.target.value });
  };
  const handleInvite = e => {
    e.preventDefault();
    if (invite.email || invite.username) {
      setInviteMsg('Invite sent!');
      setTimeout(() => setInviteMsg(''), 2000);
      setInvite({ email: '', username: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-pastel-accent">Dashboard</h2>
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-pastel-section rounded-lg p-4 shadow text-center">
          <div className="text-lg font-semibold mb-2">Total Emissions</div>
          <div className="text-2xl font-bold text-pastel-accent">{totalEmissions.toFixed(2)} kg CO₂</div>
        </div>
        <div className="flex-1 bg-pastel-section rounded-lg p-4 shadow text-center">
          <div className="text-lg font-semibold mb-2">Average per Entry</div>
          <div className="text-2xl font-bold text-pastel-accent">{avgEmissions} kg CO₂</div>
        </div>
      </div>
      {/* Chart */}
      <div className="mb-8 bg-white rounded-lg p-4 shadow">
        <Line data={chartData} options={chartOptions} />
      </div>
      {/* Bar & Pie Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      {/* Visual Feedback: Trees Saved */}
      <div className="mb-8 text-center">
        <span className="text-lg font-semibold text-green-700">
          You saved emissions equal to <span className="text-2xl font-bold">{treesSaved}</span> trees 🌳
        </span>
      </div>
      {/* Challenges & Missions Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">🏆 Challenges & Missions</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Missions List */}
          <div className="bg-yellow-50 rounded-lg p-4 shadow flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-2">Your Missions</h4>
            {missions.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <input type="checkbox" checked={m.completed} readOnly className="accent-yellow-500" />
                <span className={m.completed ? 'line-through text-gray-400' : ''}>{m.text}</span>
                <button
                  className="ml-auto bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                  disabled={m.completed}
                  onClick={() => handleMissionProgress(m.id)}
                >
                  {m.completed ? 'Done' : `+1 (${m.progress}/${m.goal})`}
                </button>
              </div>
            ))}
          </div>
          {/* Badges & Rewards */}
          <div className="bg-green-50 rounded-lg p-4 shadow flex flex-col gap-4 items-center">
            <h4 className="text-lg font-semibold mb-2">Badges & Rewards</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              {badges.map(b => (
                <div key={b.id} className="flex flex-col items-center bg-white rounded-lg shadow px-3 py-2">
                  <span className="text-3xl">{b.icon}</span>
                  <span className="font-bold text-sm mt-1">{b.name}</span>
                  <span className="text-xs text-gray-500">{b.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">More badges coming soon!</div>
          </div>
        </div>
        {/* Invite/Challenge Friends */}
        <div className="bg-blue-50 rounded-lg p-4 shadow flex flex-col md:flex-row gap-4 items-center justify-between">
          <form className="flex flex-col md:flex-row gap-2 items-end" onSubmit={handleInvite}>
            <input
              type="email"
              name="email"
              value={invite.email}
              onChange={handleInviteChange}
              placeholder="Friend's Email"
              className="border rounded px-2 py-1"
            />
            <span className="text-gray-500">or</span>
            <input
              type="text"
              name="username"
              value={invite.username}
              onChange={handleInviteChange}
              placeholder="Username"
              className="border rounded px-2 py-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Invite</button>
          </form>
          {inviteMsg && <span className="text-green-600 font-semibold ml-4">{inviteMsg}</span>}
        </div>
      </div>
      {/* Social Sharing Section */}
      <div className="mb-8 text-center">
        <h3 className="text-xl font-bold mb-4">Share Your Progress</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`, '_blank')}
          >
            <span>Facebook</span>
          </button>
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded font-semibold hover:bg-blue-500 transition flex items-center gap-2"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
          >
            <span>Twitter</span>
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 transition flex items-center gap-2"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`, '_blank')}
          >
            <span>WhatsApp</span>
          </button>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition flex items-center gap-2"
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
          >
            <span>LinkedIn</span>
          </button>
          {navigator.share && (
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition flex items-center gap-2"
              onClick={handleWebShare}
            >
              <span>Share...</span>
            </button>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded font-semibold hover:bg-pink-600 transition flex items-center gap-2"
            onClick={handleCopy}
          >
            <span ref={clipboardRef}>Copy Caption</span>
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Instagram does not support direct web sharing. Paste the copied caption in your post or story!</div>
      </div>
      {/* Add Vehicle Journey Form */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Add Vehicle Journey</h3>
        <form className="flex flex-col md:flex-row gap-2 items-end" onSubmit={handleJourneySave}>
          <div>
            <label className="block text-sm font-semibold mb-1">Vehicle Type</label>
            <select
              name="vehicle"
              value={journey.vehicle}
              onChange={handleJourneyChange}
              className="border rounded px-2 py-1 w-40"
              required
            >
              <option value="" disabled>Select vehicle</option>
              {vehicleTypes.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              value={journey.duration}
              onChange={handleJourneyChange}
              className="border rounded px-2 py-1 w-32"
              min="0"
              step="any"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Save</button>
        </form>
      </div>
      {/* Vehicle Data Entries */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Vehicle Data Entries</h3>
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead className="bg-pastel-section">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Vehicle</th>
              <th className="py-2 px-4">Distance (km)</th>
              <th className="py-2 px-4">Emissions (kg CO₂)</th>
              <th className="py-2 px-4">Duration (h)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-4 text-center">{entry.date}</td>
                <td className="py-2 px-4 text-center">{entry.vehicle}</td>
                <td className="py-2 px-4 text-center">{entry.distance}</td>
                <td className="py-2 px-4 text-center">{entry.emissions}</td>
                <td className="py-2 px-4 text-center">{entry.duration || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Entry Form */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Add New Entry</h4>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleAdd}>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-2 py-1" required />
          <input type="text" name="vehicle" placeholder="Vehicle" value={form.vehicle} onChange={handleChange} className="border rounded px-2 py-1" required />
          <input type="number" name="distance" placeholder="Distance (km)" value={form.distance} onChange={handleChange} className="border rounded px-2 py-1" required min="0" step="any" />
          <input type="number" name="emissions" placeholder="Emissions (kg CO₂)" value={form.emissions} onChange={handleChange} className="border rounded px-2 py-1" required min="0" step="any" />
          <button type="submit" className="bg-pastel-accent text-white px-4 py-1 rounded">Add</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard; 