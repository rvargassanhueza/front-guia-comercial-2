document.addEventListener('DOMContentLoaded', () => {
    const navbarContentDiv = document.getElementById('navBarContent');
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        navbarContentDiv.innerHTML = data;
    // Obtener el nombre del usuario de la cookie "token"
    const token = getCookieValue('token');
    const usuario = JSON.parse(atob(token.split('.')[1])); // Decodificar token y obtener los datos del usuario

    // Actualizar el contenido del elemento con el id "nombreUsuario"
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    nombreUsuarioElement.textContent = `Bienvenido: ${usuario.nombre_usuario} ${usuario.apellido_usuario}`;
      })
      .catch(error => {
        console.error('Error al cargar el navBar:', error);
      });
  });

        // Función para obtener el valor de la cookie por su nombre

  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }