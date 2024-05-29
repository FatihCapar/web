document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const timerDiv = document.getElementById('timer');
    const countdownSpan = document.getElementById('countdown');
    let failedAttempts = 0;
    let waiting = false;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (waiting) {
            return;
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const requiredWaitTime = Math.pow(2, failedAttempts) * 1000; // Wartezeit in Millisekunden

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
                showErrorMessage(data.message);
                failedAttempts += 1; // Erhöhe die Anzahl der fehlgeschlagenen Versuche
                showCountdown(requiredWaitTime / 1000);
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            showErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    });

    function showErrorMessage(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }

    function showCountdown(seconds) {
        waiting = true;
        timerDiv.style.display = 'block';
        countdownSpan.textContent = seconds;

        const interval = setInterval(() => {
            seconds -= 1;
            countdownSpan.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(interval);
                timerDiv.style.display = 'none';
                errorMessageDiv.style.display = 'none';
                waiting = false;
            }
        }, 1000);
    }
});
