'use client';

import { useState } from 'react';

interface Cursor {
  id: string;
  user: string;
  color: string;
  position: { x: number; y: number };
}

export default function CollabEditor() {
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice', color: 'blue', status: 'active' },
    { id: '2', name: 'Bob', color: 'green', status: 'active' },
    { id: '3', name: 'Charlie', color: 'purple', status: 'idle' },
  ]);

  return (
    <div className="space-y-4">
      {/* Active Users */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Collaborators ({users.length})</h3>
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Invite
          </button>
        </div>
        <div className="flex gap-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Editor */}
      <div className="relative bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Shared Document</span>
          <div className="flex gap-2">
            <button className="text-sm text-gray-600 hover:text-gray-800">Save</button>
            <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
          </div>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="Start typing... Your collaborators will see changes in real-time"
        />

        {/* Cursor Indicators (visual placeholders) */}
        <div className="absolute top-16 left-8 pointer-events-none">
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-5 bg-blue-500 animate-pulse"></div>
            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">Alice</span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Alice</span> edited line 5
            <span className="text-gray-400 ml-2">2 min ago</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">Bob</span> added equation
            <span className="text-gray-400 ml-2">5 min ago</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-purple-600">Charlie</span> joined session
            <span className="text-gray-400 ml-2">10 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
