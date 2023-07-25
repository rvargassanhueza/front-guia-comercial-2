document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Enviar la solicitud de inicio de sesión al backend
    fetch('http://localhost:3003/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      },
      body: JSON.stringify({ email, password })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // Mostrar mensaje de error en el formulario de inicio de sesión
          loginMessage.style.display = 'none';
          errorMessage.textContent = 'El nombre de usuario o contraseña no son válidos.';
          errorMessage.style.display = 'block';
        } else {
          console.log(data.token);
          // Almacenar el token en una cookie
          Cookies.set('token', data.token, { expires: 1, path: '/' });

          // Redirigir a la página de inicio o mostrar mensaje de éxito
          window.location.href = './home.html';
        }
      })
      .catch((error) => {
        console.error(error);
        // Mostrar mensaje de error en el formulario de inicio de sesión
      });
  });
});