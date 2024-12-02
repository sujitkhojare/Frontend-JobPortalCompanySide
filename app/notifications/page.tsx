"use client";

import { BellIcon } from '@heroicons/react/24/outline'; // Importing the Bell icon

export default function Notifications() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <BellIcon className="h-8 w-8 text-blue-500 mr-2" /> {/* Icon for Notifications */}
        Notifications
      </h1>
      <div className="p-4 bg-gray-100 rounded shadow">
        <h2 className="text-lg font-semibold flex items-center">
          <BellIcon className="h-5 w-5 text-blue-500 mr-2" /> {/* Smaller icon for New Message */}
          New Message
        </h2>
        <p>Your application has been approved.</p>
      </div>
    </div>
  );
}
