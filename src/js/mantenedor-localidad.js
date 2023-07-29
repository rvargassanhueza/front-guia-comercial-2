// Función para cargar los datos de la localidad desde la API y llenar la tabla
function cargarDatosLocalidad(idComuna) {
    const url = `http://localhost:3003/localidad/${idComuna}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Llenar la tabla con los datos de la localidad
        // const tablaLocalidad = document.getElementById('tablaLocalidad').getElementsByTagName('tbody')[0];
        const tablaLocalidad = document.getElementById('tablaLocalidad');
            const tbody = tablaLocalidad.getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Limpiar el contenido del tbody antes de agregar los usuarios
        data.forEach(lc => {
            const row = tbody.insertRow();
    
            row.insertCell().textContent = lc.id_localidad;
            row.insertCell().textContent = lc.nombre_localidad;
            row.insertCell().textContent = lc.region_localidad;
            row.insertCell().textContent = lc.provincia_localidad;
            row.insertCell().textContent = lc.nombre_comuna;
            // row.insertCell().textContent = usuario.nombre_tipo_usuario;
    
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
        // tablaLocalidad.innerHTML = `
        //   <tr>
        //     <td>${data.id_localidad}</td>
        //     <td>${data.nombre_localidad}</td>
        //     <td>${data.region_localidad}</td>
        //     <td>${data.provincia_localidad}</td>
        //     <td>${data.comuna_localidad}</td>
        //   </tr>
        // `;
      })
      .catch(error => {
        console.error('Error al cargar los datos de la localidad desde la API:', error);
      });
  }

// Función para cargar las comunas de una provincia seleccionada
function cargarComunas(idProvincia) {
    const url = `http://localhost:3003/comuna/${idProvincia}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const dropComuna = document.getElementById('dropComuna');
        dropComuna.innerHTML = ''; // Limpiar el dropdown antes de llenarlo con las comunas
  
        data.comuna.forEach(cm => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.href = '#';
          anchor.textContent = cm.nombre_comuna;
          anchor.setAttribute('data-id', cm.id_comuna);

        // Agregar el evento de clic para las opciones del dropdown de comuna
      const opcionesComuna = dropComuna.querySelectorAll('.dropdown-item');
      opcionesComuna.forEach(opcion => {
        opcion.addEventListener('click', function(event) {
          event.preventDefault();
          const idComuna = opcion.getAttribute('data-id'); // Obtener el id de la comuna seleccionada

          // Llamar a la función para cargar los datos de la localidad asociada a la comuna seleccionada
          cargarDatosLocalidad(idComuna);
        });
      });

  
          li.appendChild(anchor);
          dropComuna.appendChild(li);
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
        dropProvincia.innerHTML = ''; // Limpiar el dropdown antes de llenarlo con las provincias
  
        data.provincia.forEach(pv => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.href = '#';
          anchor.textContent = pv.nombre_provincia;
          anchor.setAttribute('data-id', pv.id_provincia); // Almacenar el id de la provincia como atributo data-id
  
          // Agregar evento clic para actualizar el texto del botón cuando se seleccione una opción
          anchor.addEventListener('click', function () {
            const btnProvincia = document.getElementById('btnProvincia');
            btnProvincia.textContent = this.textContent;
            const selectedProvinciaId = this.getAttribute('data-id'); // Obtener el id de la provincia seleccionada
  
            // Llamar a la función para cargar las comunas de la provincia seleccionada
            cargarComunas(selectedProvinciaId);
          });
  
          li.appendChild(anchor);
          dropProvincia.appendChild(li);
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
  
        data.forEach(region => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.classList.add('dropdown-item');
          anchor.href = '#';
          anchor.textContent = region.nombre_region;
          anchor.setAttribute('data-id', region.id_region); // Almacenar el id de la región como atributo data-id
  
          // Agregar evento clic para actualizar el texto del botón cuando se seleccione una opción
          anchor.addEventListener('click', function () {
            const btnRegion = document.getElementById('btnRegion');
            btnRegion.textContent = this.textContent;
            const selectedRegionId = this.getAttribute('data-id'); // Obtener el id de la región seleccionada
  
            // Llamar a la función para cargar las provincias de la región seleccionada
            cargarProvincias(selectedRegionId);
          });
  
          li.appendChild(anchor);
          dropRegion.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error al cargar las regiones desde la API:', error);
      });
  }
  
  // Llamar a la función para cargar las regiones al cargar la página
  document.addEventListener('DOMContentLoaded', cargarRegiones);
  