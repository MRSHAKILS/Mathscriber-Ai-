'use client';

interface User {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
}

interface UserCursorsProps {
  users?: User[];
}

export default function UserCursors({ users = [] }: UserCursorsProps) {
  const defaultUsers: User[] = [
    { id: '1', name: 'Alice', color: '#3B82F6', position: { x: 150, y: 200 } },
    { id: '2', name: 'Bob', color: '#10B981', position: { x: 300, y: 150 } },
    { id: '3', name: 'Charlie', color: '#8B5CF6', position: { x: 450, y: 250 } },
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;

  return (
    <div className="relative w-full h-full pointer-events-none">
      {displayUsers.map((user) => (
        <div
          key={user.id}
          className="absolute transition-all duration-200"
          style={{
            left: `${user.position.x}px`,
            top: `${user.position.y}px`,
          }}
        >
          {/* Cursor */}
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill={user.color}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          >
            <path d="M5.5 3.5L18.5 10.5L12 12.5L10 19L5.5 3.5Z" />
          </svg>

          {/* User Label */}
          <div
            className="ml-7 -mt-1 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>

          {/* Selection Highlight */}
          <div
            className="absolute top-6 left-0 h-0.5 w-32 animate-pulse"
            style={{ backgroundColor: user.color, opacity: 0.3 }}
          ></div>
        </div>
      ))}

      {/* Demo Info */}
      {displayUsers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 pointer-events-auto">
          <p className="text-xs text-gray-600 mb-2 font-medium">Active Cursors:</p>
          <div className="space-y-1">
            {displayUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                ></div>
                <span className="text-xs text-gray-700">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
