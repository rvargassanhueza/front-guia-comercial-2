// Variable para almacenar el tiempo de espera antes de realizar la búsqueda
let searchTimeout, regionId_, provinciaId_, comunaId_, idLocalidad_, textoLocalidad, textoRegion, textoProvincia, textoComuna;
const insertarLocalidadForm = document.getElementById('insertarLocalidadForm');
const inputComuna = document.getElementById('buscarComuna');

function editarLocalidad(id) {
    // Realizar la solicitud a la API para obtener los datos del usuario
    const url = `http://localhost:3003/localidad/${id}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Llenar los campos del formulario con los datos del usuario

        data.forEach(lc => {
            document.getElementById('idEditar').value = lc.id_localidad;
            document.getElementById('regionMostrarEditar').value = capitalize(lc.nombre_region);
            document.getElementById('provinciaMostrarEditar').value = capitalize(lc.nombre_provincia);
            document.getElementById('comunaMostrarEditar').value = capitalize(lc.nombre_comuna);
            document.getElementById('localidadEditar').value = capitalize(lc.nombre_localidad);
    
            idLocalidad_ = lc.id_localidad;
        })
  
        // Abrir el modal
        const modalEditar = new bootstrap.Modal(document.getElementById('editarModal'));
        modalEditar.show();
      })
      .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
      });
}

// Función para cargar los datos de la localidad desde la API y llenar la tabla
function cargarDatosLocalidad(idComuna) {
    const url = `http://localhost:3003/localidad/comuna/${idComuna}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Llenar la tabla con los datos de la localidad
        const tablaLocalidad = document.getElementById('tablaLocalidad');
            const tbody = tablaLocalidad.getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Limpiar el contenido del tbody antes de agregar los usuarios
    data.forEach(lc => {
            const row = tbody.insertRow();

                textoLocalidad  = capitalize(lc.nombre_localidad);
                textoRegion     = capitalize(lc.nombre_region);            
                textoProvincia  = capitalize(lc.nombre_provincia);
                textoComuna     = capitalize(lc.nombre_comuna);
                regionId_= lc.id_region;
                provinciaId_ = lc.id_provincia;
                comunaId_ = lc.id_comuna;
            
            row.insertCell().textContent = lc.id_localidad;
            row.insertCell().textContent = textoLocalidad;
            row.insertCell().textContent = textoRegion;
            row.insertCell().textContent = textoProvincia;
            row.insertCell().textContent = textoComuna;
    
            const accionesCell = row.insertCell();
            const editarButton = document.createElement('button');
                    editarButton.className = 'btn btn-primary btn-sm';
                    editarButton.innerHTML = '<i class="bi bi-pencil"></i>';
                    editarButton.onclick = () => editarLocalidad(lc.id_localidad);
                    accionesCell.appendChild(editarButton);
            
            const eliminarButton = document.createElement('button');
                    eliminarButton.className = 'btn btn-danger btn-sm';
                    eliminarButton.innerHTML = '<i class="bi bi-trash"></i>';
                    eliminarButton.onclick = () => eliminarLocalidad(lc.id_localidad);
                    accionesCell.appendChild(eliminarButton);
                    });
      })
      .catch(error => {
        console.error('Error al cargar los datos de la localidad desde la API:', error);
      });
}



function guardarLocalidad(nuevaLocalidad) {
    // Realizar la solicitud a la API para guardar el usuario
    const url = 'http://localhost:3003/localidad/'; // URL de la API para guardar el usuario

    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevaLocalidad),
    })
    .then(response => response.json())
    .then(data => {

        if(data.code === 1){
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = data.error;
            document.getElementById('insertarLocalidadForm').appendChild(alertDiv); 

        }else{
            console.log('Localidad guardada:', data);

            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-primary mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = 'Localidad registrada correctamente!';
            document.getElementById('insertarLocalidadForm').appendChild(alertDiv);
            document.getElementById('localidad').value = '';

             // Cierra la alerta después de 2 segundos
          setTimeout(function () {
            alertDiv.remove(); // Elimina la alerta del DOM
            // //cargar la lista de usuarios para mostrar los cambios en la tabla
            // cargarDatosLocalidad(comunaId_);
            // limpiarText();
            }, 2000);
        }
    
    })
    .catch(error => {
        console.error('Error al guardar la Localidad:', error);

        const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = '¡Error al guardar la localidad!';
            document.getElementById('insertarLocalidadForm').appendChild(alertDiv);

               // Cierra la alerta después de 2 segundos
          setTimeout(function () {
            alertDiv.remove(); // Elimina la alerta del DOM
            //cargar la lista de usuarios para mostrar los cambios en la tabla
            // cargarUsuarios();
            // limpiarText();
            }, 2000);

            // limpiarText();
            // document.getElementById('btnTipoUsuario').textContent;
            // limpiarDropdown();
    });
    
}

function guardarCambiosLocalidad() {

    let regionSeleccionada, provinciaSeleccionada, comunaSeleccionada = false;


    const id = document.getElementById('idEditar').value;
    const nombreLocalidadElement = document.getElementById('localidadEditar');
    const regionElement = document.getElementById('regionEditar');
    const provinciaElement = document.getElementById('provinciaEditar');
    const comunaElement = document.getElementById('comunaEditar');

    let nombreLocalidad = nombreLocalidadElement.value.trim() || nombreLocalidadElement.textContent.trim() || textoLocalidad;

    nombreLocalidad = nombreLocalidad.toLowerCase();

        // Evento que se activa cuando se selecciona una región
    regionElement.addEventListener('click', function () {
        regionSeleccionada = true;
        });

    provinciaElement.addEventListener('click', function () {
            provinciaSeleccionada = true;
            });

    comunaElement.addEventListener('click', function () {
            comunaSeleccionada = true;
            });
    let region = regionSeleccionada ? regionElement.textContent.trim() : regionId_;

    let provincia = provinciaSeleccionada ? provinciaElement.textContent.trim() : provinciaId_;

    let comuna = comunaSeleccionada ? comunaElement.textContent.trim() : comunaId_;

    // Crear el objeto de datos para enviar a la API
    const datosActualizados = {
      id_localidad: id,
      nombre_localidad: nombreLocalidad,
      region_localidad: region,
      provincia_localidad: provincia,
      comuna_localidad: comuna
    };
  
    // Realizar la solicitud a la API para guardar los cambios
    const url = `http://localhost:3003/localidad/${id}`;
  
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
        alertDiv.textContent = 'Localidad modificada correctamente!';
        document.getElementById('editarLocalidadForm').appendChild(alertDiv);

        // Agrega la alerta al contenedor del modal
        const modalBody = document.querySelector('#editarModal .modal-body');
        modalBody.appendChild(alertDiv);

        // Cierra el modal después de 2 segundos
        setTimeout(function () {
        modal.hide(); // Cierra el modal
        alertDiv.remove(); // Elimina la alerta del DOM

        cargarDatosLocalidad(comunaId_)

        // Vuelve a cargar la lista de usuarios para mostrar los cambios en la tabla
        // cargarUsuarios();
        }, 2000);
      })
      .catch(error => {
        console.error('Error al guardar los cambios:', error);
        // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger mt-3';
        alertDiv.role = 'alert';
        alertDiv.textContent = '¡Error al modificar la localidad!';
        document.getElementById('editarLocalidadForm').appendChild(alertDiv);
      });
}

// Función para cargar las comunas de una provincia seleccionada
function cargarComunas(idProvincia) {
    const url = `http://localhost:3003/comuna/${idProvincia}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const dropComuna = document.getElementById('dropComuna');
        const comunaEditar = document.getElementById('comunaEditar');

  
        dropComuna.innerHTML = ''; // Limpiar el dropdown antes de llenarlo con las comunas
        comunaEditar.innerHTML = '';
        data.comuna.forEach(cm => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.textContent = capitalize(cm.nombre_comuna);
          anchor.setAttribute('data-id', cm.id_comuna);
  
          // Agregar el evento de clic para las opciones del dropdown de comuna
          anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const comunaSeleccionada = anchor.textContent; // Obtener el nombre de la comuna seleccionada
            const btnComuna = document.getElementById('btnComuna');
            const btnComunaEditar = document.getElementById('btnComunaEditar');

            btnComuna.textContent = comunaSeleccionada; // Asignar el nombre de la comuna al botón del dropdown
            btnComunaEditar.textContent = comunaSeleccionada; // Asignar el nombre de la comuna al botón del dropdown

            const idComuna = this.getAttribute('data-id'); // Obtener el id de la comuna seleccionada

            comunaId_ = idComuna;
          });
  
          li.appendChild(anchor);
          dropComuna.appendChild(li);
          comunaEditar.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error al cargar las comunas desde la API:', error);
      });
}
  
  // Función para cargar las provincias de una región seleccionada
function cargarProvincias(idRegion) {
    const url = `http://localhost:3003/provincia/${idRegion}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const dropProvincia = document.getElementById('dropProvincia');
        const provinciaEditar = document.getElementById('provinciaEditar')

        dropProvincia.innerHTML = ''; // Limpiar el dropdown antes de llenarlo con las provincias
        provinciaEditar.innerHTML = '';

        data.provincia.forEach(pv => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.textContent = capitalize(pv.nombre_provincia);
          anchor.setAttribute('data-id', pv.id_provincia); // Almacenar el id de la provincia como atributo data-id
  
          // Agregar evento clic para actualizar el texto del botón cuando se seleccione una opción
          anchor.addEventListener('click', function () {
            const btnProvincia = document.getElementById('btnProvincia');
            const btnProvinciaEditar = document.getElementById('btnProvinciaEditar');

            btnProvincia.textContent = this.textContent;
            btnProvinciaEditar.textContent = this.textContent;

            const selectedProvinciaId = this.getAttribute('data-id'); // Obtener el id de la provincia seleccionada
            provinciaId_ = selectedProvinciaId;
  
            // Llamar a la función para cargar las comunas de la provincia seleccionada
            cargarComunas(selectedProvinciaId);
          });
  
            li.appendChild(anchor);
            dropProvincia.appendChild(li);
            provinciaEditar.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error al cargar las provincias desde la API:', error);
      });
}
  
  // Función para cargar las regiones desde la API y llenar el primer dropdown
function cargarRegiones() {
    const url = 'http://localhost:3003/region/';
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const dropRegion = document.getElementById('dropRegion');
        const regionEditar = document.getElementById('regionEditar');
  
        data.forEach(region => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.textContent = capitalize(region.nombre_region);
          anchor.setAttribute('data-id', region.id_region); // Almacenar el id de la región como atributo data-id
  
          // Agregar evento clic para actualizar el texto del botón cuando se seleccione una opción
          anchor.addEventListener('click', function () {
            const btnRegion = document.getElementById('btnRegion');
            const btnRegionEditar = document.getElementById('btnRegionEditar');

            btnRegion.textContent = this.textContent;
            btnRegionEditar.textContent = this.textContent;

            const selectedRegionId = this.getAttribute('data-id'); // Obtener el id de la región seleccionada
            regionId_ = selectedRegionId;
            // Llamar a la función para cargar las provincias de la región seleccionada
            cargarProvincias(selectedRegionId);
          });
  
          li.appendChild(anchor);
          dropRegion.appendChild(li);
          regionEditar.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error al cargar las regiones desde la API:', error);
      });
}

// Función para realizar la búsqueda de comunas
function buscarComunas() {
  const inputComuna = document.getElementById('buscarComuna');
  const comunasList = document.getElementById('comunasList');
  const inputText = inputComuna.value.trim();

  // Limpia la lista desplegable antes de mostrar los resultados
  comunasList.innerHTML = '';

  // Cancela el retraso anterior (si existe) para evitar búsquedas innecesarias
  clearTimeout(searchTimeout);

  // Realizar la búsqueda después de un corto retraso (por ejemplo, 500 ms)
  searchTimeout = setTimeout(() => {
    // Realizar la solicitud a la API para buscar las comunas
    const url = `http://localhost:3003/comuna/buscar/${inputText}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Mostrar la lista desplegable
        comunasList.style.display = 'block';

        // Mostrar las comunas coincidentes en la lista desplegable
        data.comuna.forEach(comuna => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = capitalize(comuna.nombre_comuna);

          // Agregar evento clic para seleccionar una comuna
          listItem.addEventListener('click', function () {
            // Llamar a la función para obtener los datos de la localidad
            cargarDatosLocalidad(comuna.id_comuna);

            // Actualizar el campo de texto con la comuna seleccionada
            inputComuna.value = capitalize(comuna.nombre_comuna);

            // Ocultar la lista desplegable después de seleccionar una comuna
            comunasList.style.display = 'none';
          });

          comunasList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error al buscar comunas:', error);
      });
  }, 500); // Tiempo de retraso en milisegundos (0.5 segundos)
}

// Agregar evento "input" al campo de texto para realizar la búsqueda en tiempo real
inputComuna.addEventListener('input', buscarComunas);

insertarLocalidadForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario

    const nombreLocalidad = document.getElementById('localidad').value;
    let nombreLocalidadMinuscula = nombreLocalidad.toLowerCase();
    
    const regionId = regionId_;
    const provinciaId = provinciaId_;
    const comunaId = comunaId_;

// Crear el objeto de datos para enviar a la API
    const nuevaLocalidad = {
      regionLocalidad:regionId,
      provinciaLocalidad:provinciaId,
      comunaLocalidad:comunaId,
      nombreLocalidad:nombreLocalidadMinuscula
    };

    // Llamar a la función para guardar el usuario en la API
    guardarLocalidad(nuevaLocalidad);
});

document.addEventListener('DOMContentLoaded', cargarRegiones);
