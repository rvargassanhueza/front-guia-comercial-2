async function logoutUser(){

    try {
                    const tokenString = Cookies.get('token');
            let token = '';
            if(tokenString){
                token = JSON.parse(tokenString)
            }
           const userId = token.id_usuario;
            // Realizar la solicitud para cerrar sesión al backend
            const response = await fetch(`http://localhost:3003/logout?id=${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`,
                'Origin': 'http://localhost:8080'
              }
            });
        
            // Verificar si la solicitud fue exitosa (código de respuesta 200)
            if (response.ok) {
              // Eliminar la cookie del token
              Cookies.remove('token');
        
              // Redirigir al usuario a la página de inicio de sesión
              window.location.href = './login.html';
              alert('Sesión cerrada correctamente.');

            } else {
              // Si hubo un error en la respuesta del servidor, muestra un mensaje de error
              console.error('Error al cerrar sesión');
              alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
            }
          } catch (error) {
            console.error(error);
            alert('Error en el servidor al cerrar sesión. Por favor, intenta nuevamente.');
          }
        }
