function validarToken() {

    const tokenString = Cookies.get('token');
    let token = '';
    if(tokenString){
        token = JSON.parse(tokenString)
    }
    if (token) {
      console.log("El token de usuario existe:", JSON.stringify(token));
        if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location. pathname === '/src/login.html') {
            window.location.href = '/src/home.html';
        }
      
    } else {
      console.log("El token de usuario no existe. Redirigiendo al login.");
      // window.location.href = '/src/login.html';
      if (window.location.pathname === '/index.html' || window.location.pathname === '/' ) {
        window.location.href = '/src/login.html';
      }
    }
  }

  document.addEventListener("DOMContentLoaded", validarToken);