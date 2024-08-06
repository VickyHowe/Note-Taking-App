document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('error-message').innerHTML = '';
        alert('Login successful! You will be redirected to the dashboard.'); // Add a success message
        window.location.href = '/dashboard'; // Redirect to the dashboard
      } else {
        const errorMessage = await response.text();
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerHTML = errorMessage;
      }
    } catch (error) {
      console.error(error);
    }
  });