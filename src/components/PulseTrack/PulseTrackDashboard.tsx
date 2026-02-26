import React from 'react';
import { Line } from 'react-chartjs-2';

const PulseTrackDashboard: React.FC = () => {
  // Sample data
  const totalVisitors = { count: 12450, percentage: 12 };
  const uniqueVisitors = { count: 8210, percentage: 5 };
  const totalScans = { count: 45600, percentage: -2 };
  const totalOrders = { count: 1205, percentage: 18 };

  // Line chart data
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Activity Overview',
        data: [15, 20, 25, 10, 30, 45, 30],
        borderColor: '#96c94b',
        backgroundColor: 'rgba(150, 201, 75, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white text-black p-5">
      <h1 className="text-xl font-bold mb-4">Pulse Track Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-200 p-4 rounded shadow">
          <h2>Total Visitors</h2>
          <p>{totalVisitors.count} (+{totalVisitors.percentage}%)</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow">
          <h2>Unique Visitors</h2>
          <p>{uniqueVisitors.count} (+{uniqueVisitors.percentage}%)</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow">
          <h2>Total Scans</h2>
          <p>{totalScans.count} ({totalScans.percentage}%)</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow">
          <h2>Total Orders</h2>
          <p>{totalOrders.count} (+{totalOrders.percentage}%)</p>
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2">Activity Overview</h2>
      <Line data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default PulseTrackDashboard;