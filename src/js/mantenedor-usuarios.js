let idTipoUsuario;
let idUsuario;
const insertarUsuarioForm = document.getElementById('insertarUsuarioForm');

        insertarUsuarioForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

            // Obtener los valores del formulario

            let nombre = document.getElementById('nombre').value;
            let apellido = document.getElementById('apellido').value;
            let email = document.getElementById('email').value;
            let contrasena = document.getElementById('contrasena').value;
            let descripcion = document.getElementById('descripcion').value;
            let tipoUsuario = document.getElementById('btnTipoUsuario').textContent; // Obtener el texto del botón

            nombre = nombre.toLowerCase();
            apellido = apellido.toLowerCase();
            email = email.toLowerCase();
            descripcion = descripcion.toLowerCase();

        // Crear el objeto de datos para enviar a la API
            const nuevoUsuario = {
                nombre_usuario:nombre,
                apellido_usuario:apellido,
                email_usuario:email,
                pass_usuario:contrasena,
                descripcion_usuario:descripcion,
                tipoUsuario: tipoUsuario,
                id_tipo_usuario: idTipoUsuario
            };

            // Llamar a la función para guardar el usuario en la API
            guardarUsuario(nuevoUsuario);
        });

        function loadRoles() {
            const url = 'http://localhost:3003/tipo-usuario/'; // URL de la API para obtener los roles
            fetch(url)
            .then(response => response.json())
            .then(data => {
                const rolDropdown = document.getElementById('tipoUsuario');

                data.forEach(tipoUsuario => {
                    const option = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.classList.add('dropdown-item');
                    anchor.textContent = tipoUsuario.nombre_tipo_usuario;
                    anchor.id = tipoUsuario.id_tipo_usuario;
                    idTipoUsuario = anchor.id;
                    // Agregar evento clic para actualizar el texto del botón cuando se seleccione una opción
                    anchor.addEventListener('click', function () {
                        const rolButton = document.getElementById('btnTipoUsuario');
                        rolButton.textContent = this.textContent;
                    });
                    option.appendChild(anchor);
                    rolDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar los roles desde la API:', error);
            });
        }
        function guardarUsuario(usuario) {
            // Realizar la solicitud a la API para guardar el usuario
            const url = 'http://localhost:3003/usuario'; // URL de la API para guardar el usuario
        
            fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
            })
            .then(response => response.json())
            .then(data => {
        
                if(data.code === 1){
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.textContent = data.error;
                    document.getElementById('insertarUsuarioForm').appendChild(alertDiv); 
                    limpiarText();
                    // loadRoles()
                    // limpiarDropdown();
                }else{
                    console.log('Usuario guardado:', data);

                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-primary mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.textContent = '¡Usuario registrado correctamente!';
                    document.getElementById('insertarUsuarioForm').appendChild(alertDiv);

                     // Cierra la alerta después de 2 segundos
                  setTimeout(function () {
                    alertDiv.remove(); // Elimina la alerta del DOM
                    //cargar la lista de usuarios para mostrar los cambios en la tabla
                    cargarUsuarios();
                    limpiarText();
                    }, 2000);
                }
            
            })
            .catch(error => {
                console.error('Error al guardar el usuario:', error);

                const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.textContent = '¡Error al guardar el usuario!';
                    document.getElementById('insertarUsuarioForm').appendChild(alertDiv);

                       // Cierra la alerta después de 2 segundos
                  setTimeout(function () {
                    alertDiv.remove(); // Elimina la alerta del DOM
                    //cargar la lista de usuarios para mostrar los cambios en la tabla
                    cargarUsuarios();
                    limpiarText();
                    }, 2000);

                    // limpiarText();
                    // document.getElementById('btnTipoUsuario').textContent;
                    // limpiarDropdown();
            });
            
        }
  
        function limpiarDropdown() {
            const dropdownItems = document.querySelectorAll('.dropdown-menu li');
            dropdownItems.forEach((item) => {
            item.remove();
            });
        }

        function limpiarText(){
            document.getElementById('nombre').value = '';
            document.getElementById('apellido').value = '';
            document.getElementById('email').value = '';
            document.getElementById('contrasena').value = '';
            document.getElementById('descripcion').value = '';
        }

        function cargarUsuarios() {
            const tablaUsuarios = document.getElementById('tablaUsuarios');
            const tbody = tablaUsuarios.getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Limpiar el contenido del tbody antes de agregar los usuarios
        
            fetch('http://localhost:3003/usuario/')
            .then(response => response.json())
            .then(data => {
                data.forEach(usuario => {
                const row = tbody.insertRow();
        
                row.insertCell().textContent = usuario.id_usuario;
                row.insertCell().textContent = capitalize(usuario.nombre_usuario);
                row.insertCell().textContent = capitalize(usuario.apellido_usuario);
                row.insertCell().textContent = usuario.email_usuario;
                row.insertCell().textContent = usuario.descripcion_usuario;
                row.insertCell().textContent = usuario.nombre_tipo_usuario;
        
                const accionesCell = row.insertCell();
                const editarButton = document.createElement('button');
                editarButton.className = 'btn btn-primary btn-sm';
                editarButton.innerHTML = '<i class="bi bi-pencil"></i>';
                editarButton.onclick = () => editarUsuario(usuario.id_usuario);
                accionesCell.appendChild(editarButton);
        
                const eliminarButton = document.createElement('button');
                eliminarButton.className = 'btn btn-danger btn-sm';
                eliminarButton.innerHTML = '<i class="bi bi-trash"></i>';
                eliminarButton.onclick = () => eliminarUsuario(usuario.id_usuario);
                accionesCell.appendChild(eliminarButton);
                });
            })
            .catch(error => {
                console.error('Error al obtener el listado de usuarios:', error);
            });
        }

        function editarUsuario(id) {
            // Realizar la solicitud a la API para obtener los datos del usuario
            const url = `http://localhost:3003/usuario/${id}`;
            
            fetch(url)
              .then(response => response.json())
              .then(data => {
                // Llenar los campos del formulario con los datos del usuario
                document.getElementById('idEditar').value = data.id_usuario;
                document.getElementById('nombreEditar').value = capitalize(data.nombre_usuario);
                document.getElementById('apellidoEditar').value = capitalize(data.apellido_usuario);
                document.getElementById('emailEditar').value = data.email_usuario;
                document.getElementById('descripcionEditar').value = capitalize(data.descripcion_usuario);
                document.getElementById('btnTipoUsuarioEditar').textContent = data.nombre_tipo_usuario;
                idTipoUsuario = data.id_tipo_usuario;
          
                // Abrir el modal
                const modalEditar = new bootstrap.Modal(document.getElementById('editarModal'));
                modalEditar.show();
              })
              .catch(error => {
                console.error('Error al obtener los datos del usuario:', error);
              });
        }

        function guardarCambios() {
            const id = document.getElementById('idEditar').value;
            const nombre = document.getElementById('nombreEditar').value;
            const apellido = document.getElementById('apellidoEditar').value;
            const email = document.getElementById('emailEditar').value;
            const descripcion = document.getElementById('descripcionEditar').value;
            const tipoUsuario = document.getElementById('tipoUsuarioEditar').value;
            // ... Obtén los demás datos que desees modificar
          
            // Crear el objeto de datos para enviar a la API
            const datosActualizados = {
              id_usuario: id,
              nombre_usuario: nombre,
              apellido_usuario: apellido,
              descripcion_usuario: descripcion,
              tipoUsuario: tipoUsuario,
              id_tipo_usuario: idTipoUsuario,
              email_usuario: email,
            };
          
            // Realizar la solicitud a la API para guardar los cambios
            const url = `http://localhost:3003/usuario/${id}`;
          
            fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosActualizados),
            })
              .then(response => response.json())
              .then(data => {

                const myModalEl = document.querySelector('#editarModal');
                const modal = bootstrap.Modal.getOrCreateInstance(myModalEl); // Returns a Bootstrap modal instance

                // Crea la alerta para mostrar el mensaje de éxito
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-primary mt-3';
                alertDiv.role = 'alert';
                alertDiv.textContent = '¡Usuario modificado correctamente!';

                // Agrega la alerta al contenedor del modal
                const modalBody = document.querySelector('#editarModal .modal-body');
                modalBody.appendChild(alertDiv);

                // Cierra el modal después de 2 segundos
                setTimeout(function () {
                modal.hide(); // Cierra el modal
                alertDiv.remove(); // Elimina la alerta del DOM

                // Vuelve a cargar la lista de usuarios para mostrar los cambios en la tabla
                cargarUsuarios();
                }, 2000);
              })
              .catch(error => {
                console.error('Error al guardar los cambios:', error);
                // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger mt-3';
                alertDiv.role = 'alert';
                alertDiv.textContent = '¡Error al modificar el usuario!';
                document.getElementById('insertarUsuarioForm').appendChild(alertDiv);
              });
        }

        function eliminarUsuario(id) {
            // Realizar la solicitud a la API para obtener los datos del usuario

            const idUsuario_ = document.getElementById('idEliminar').value;
            const url = `http://localhost:3003/usuario/${id}`;
            
            fetch(url)
              .then(response => response.json())
              .then(data => {
                // Llenar los campos del formulario con los datos del usuario
                document.getElementById('idEliminar').value = data.id_usuario;
                document.getElementById('nombreEliminar').value = capitalize(data.nombre_usuario);
                document.getElementById('apellidoEliminar').value = capitalize(data.apellido_usuario);
                document.getElementById('emailEliminar').value = data.email_usuario;
                document.getElementById('descripcionEliminar').value = capitalize(data.descripcion_usuario);
                document.getElementById('tipoUsuarioEliminar').value = data.nombre_tipo_usuario;
                idUsuario = id;
          
                // Abrir el modal
                const modalEliminar = new bootstrap.Modal(document.getElementById('eliminarModal'));
                modalEliminar.show();
              })
              .catch(error => {
                console.error('Error al obtener los datos del usuario:', error);
              });
        }

        function guardarCambiosEliminar() {

              // Realizar la solicitud a la API para guardar los cambios
              const url = `http://localhost:3003/usuario/${idUsuario}`;
          
              fetch(url, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body:null,
              })
                .then(response => response.json())
                .then(data => {
  
                  const myModalEl = document.querySelector('#eliminarModal');
                  const modal = bootstrap.Modal.getOrCreateInstance(myModalEl); // Returns a Bootstrap modal instance
  
                  // Crea la alerta para mostrar el mensaje de éxito
                  const alertDiv = document.createElement('div');
                  alertDiv.className = 'alert alert-primary mt-3';
                  alertDiv.role = 'alert';
                  alertDiv.textContent = '¡Usuario eliminado correctamente!';
  
                  // Agrega la alerta al contenedor del modal
                  const modalBody = document.querySelector('#eliminarModal .modal-body');
                  modalBody.appendChild(alertDiv);
  
                  // Cierra el modal después de 2 segundos
                  setTimeout(function () {
                  modal.hide(); // Cierra el modal
                  alertDiv.remove(); // Elimina la alerta del DOM
  
                  // Vuelve a cargar la lista de usuarios para mostrar los cambios en la tabla
                  cargarUsuarios();
                  }, 2000);
                })
                .catch(error => {
                  console.error('Error al guardar los cambios:', error);
                  // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción
                  const alertDiv = document.createElement('div');
                  alertDiv.className = 'alert alert-danger mt-3';
                  alertDiv.role = 'alert';
                  alertDiv.textContent = '¡Error al eliminar el usuario!';
                  document.getElementById('insertarUsuarioForm').appendChild(alertDiv);
                });
        }

                   
  document.addEventListener("DOMContentLoaded", loadRoles);
  document.addEventListener('DOMContentLoaded', cargarUsuarios);