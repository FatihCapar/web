import { useState } from 'react'

import './Login.css'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [waiting, setWaiting] = useState(false);

  const handleSubmit = (event) => {
      event.preventDefault();

      if (waiting) {
          return;
      }

      const requiredWaitTime = Math.pow(2, failedAttempts) * 1000;

      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = data.redirectUrl;
          } else {
              setErrorMessage(data.message);
              setFailedAttempts(failedAttempts + 1);
              showCountdown(requiredWaitTime / 1000);
          }
      })
      .catch(error => {
          console.error('Fehler:', error);
          setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      });
  };

  const showCountdown = (seconds) => {
      setWaiting(true);
      setTimer(seconds);

      const interval = setInterval(() => {
          seconds -= 1;
          setTimer(seconds);

          if (seconds <= 0) {
              clearInterval(interval);
              setWaiting(false);
          }
      }, 1000);
  };

  return (
      <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
              <label>
                  Benutzername:
                  <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
              </label>
              <label>
                  Passwort:
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </label>
              <button type="submit" disabled={waiting}>Anmelden</button>
          </form>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {waiting && <div className="timer">Bitte warten Sie {timer} Sekunden, bevor Sie es erneut versuchen.</div>}
      </div>
  );
}

export default Login