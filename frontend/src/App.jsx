import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(true);

  if (token) return <Dashboard />;

  return (
    <div>
      {showSignup ? (
        <div>
          <Signup />
          <p>
            Already have an account?{' '}
            <button onClick={() => setShowSignup(false)}>Login</button>
          </p>
        </div>
      ) : (
        <div>
          <Login setToken={setToken} />
          <p>
            Don't have an account?{' '}
            <button onClick={() => setShowSignup(true)}>Signup</button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
