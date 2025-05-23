import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;