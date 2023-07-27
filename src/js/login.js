document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
          formData.append('email', email);
          formData.append('password', password);

    try {
      // Enviar la solicitud de inicio de sesión al backend
      const response = await fetch('http://localhost:3003/login/', {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json();

      if (responseData.error) {
        if (responseData.error === 1) {
          // Mostrar mensaje de error en el formulario de inicio de sesión
          loginMessage.style.display = 'none';
          errorMessage.textContent = responseData.message;
          errorMessage.style.display = 'block';
        } else if (responseData.error === 2) {
          loginMessage.style.display = 'none';
          errorMessage.textContent = responseData.message;
          errorMessage.style.display = 'block';
        }

      } else {
        Cookies.set('token', JSON.stringify(responseData), { expires: 1, path: '/' });

        // Redirigir a la página de inicio o mostrar mensaje de éxito
        window.location.href = './home.html';
      }
    } catch (error) {
      console.error(error);
      // Mostrar mensaje de error en el formulario de inicio de sesión
    }
  });
});
