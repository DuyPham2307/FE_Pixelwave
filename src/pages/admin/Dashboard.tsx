import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  Legend,
} from 'recharts';
import '@/styles/pages/_dashboard.scss';

const loginData = [
  { date: 'Jan', logins: 120 },
  { date: 'Feb', logins: 200 },
  { date: 'Mar', logins: 150 },
  { date: 'Apr', logins: 180 },
  { date: 'May', logins: 250 },
];

const reportData = [
  { name: 'Resolved', value: 300 },
  { name: 'Pending', value: 200 },
  { name: 'Rejected', value: 100 },
];

const accountData = [
  { month: 'Jan', accounts: 50 },
  { month: 'Feb', accounts: 80 },
  { month: 'Mar', accounts: 65 },
  { month: 'Apr', accounts: 90 },
  { month: 'May', accounts: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Admin Dashboard</h1>
      <p>Manage your application efficiently from here.</p>

      <div className="chart-section">
        <h2>Login Activity Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="logins" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Monthly Reports Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {reportData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Accounts Created Per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accountData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accounts" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
