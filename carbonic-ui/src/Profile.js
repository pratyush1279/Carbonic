import React, { useState } from 'react';

function Profile({ isOpen, onClose, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    status: initialData.status || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
  });
  const [editing, setEditing] = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData.name || '',
        status: initialData.status || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      });
      setEditing(true);
    }
  }, [isOpen]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    setEditing(false);
    if (onClose) onClose(form);
  };

  const handleCancel = e => {
    e.preventDefault();
    setEditing(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 animate-fadein" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full p-8 mx-2 animate-slidein"
        style={{ minWidth: 320 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">My Profile</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.status}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadein { animation: fadein 0.3s; }
        @keyframes slidein { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slidein { animation: slidein 0.4s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
    </div>
  );
}

export default Profile; 