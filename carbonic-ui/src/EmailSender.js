import React, { useState } from 'react';

function EmailSender() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Email sent successfully!');
        setTo('');
        setSubject('');
        setText('');
      } else {
        setStatus('Failed to send email: ' + data.error);
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Send Email</h2>
      <form className="space-y-4" onSubmit={handleSend}>
        <div>
          <label className="block text-sm font-semibold mb-1">To (Email)</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={to}
            onChange={e => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Subject</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {status && <div className="mt-4 text-center text-sm text-green-600">{status}</div>}
    </div>
  );
}

export default EmailSender; 