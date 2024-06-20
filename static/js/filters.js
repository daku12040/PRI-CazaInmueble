document.addEventListener('DOMContentLoaded', function() {
    var rangeInput = document.getElementById('customRange');
    var rangeValue = document.getElementById('rangeValue');
    var botonFiltro1 = document.getElementById('boton-filtro1');
    var botonFiltro2 = document.getElementById('boton-filtro2');
    var thumbnails = document.getElementById('thumbnails');
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const rutaImagen = document.getElementById('imagen').getAttribute('data-src');


   rangeValue.textContent = `Max:     $${rangeInput.value}`;


    rangeInput.addEventListener('input', function() {
        rangeValue.textContent = `Max:     $${rangeInput.value}`;

    });

    function crearMiniaturas(publicaciones) {
        thumbnails.innerHTML = '';  
        publicaciones.forEach(pub => {
            const col = document.createElement('div');
            col.className = 'flex-row col-md-6';

            const card = document.createElement('div');
            card.className = 'card-thumbnail';

            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.src = rutaImagen;
            img.alt = pub.titulo;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

              const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = pub.nombre;
            title.addEventListener('click', function() {
                window.location.href = `/propiedad/${pub.id}`;});

            const price = document.createElement('p');
            price.className = 'card-price';
            price.textContent = `$${pub.precio}`;

            const type = document.createElement('p');
            type.className = 'card-type';
            type.textContent = pub.tipo;

            const location = document.createElement('p');
            location.className = 'card-type';
            location.textContent = `Ubicación: ${pub.ubicacion}`;


            cardBody.appendChild(title);
            cardBody.appendChild(price);
            cardBody.appendChild(type);
            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);
            thumbnails.appendChild(col);
        });
    }

    toggleSidebar.addEventListener('click', function (event) {
        event.preventDefault();
        
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            content.classList.remove('collapsed');
            toggleSidebar.textContent = 'Menú';
        } else {
            sidebar.classList.add('collapsed');
            content.classList.add('collapsed');
            toggleSidebar.textContent = '<';
        }
    });

    botonFiltro1.addEventListener('click', aplicarFiltros);
    botonFiltro2.addEventListener('click', aplicarFiltros);
    
    //Funciones de mapa y filtros de ubicacion
    let map; 
    let markers = [];
    function geocodeAndAddMarker(address) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latlng = [data[0].lat, data[0].lon];
                    const marker = L.marker(latlng).addTo(map)
                        .bindPopup(`<b>${address}</b><br>${latlng[0]}, ${latlng[1]}`);
                    
                    marker.on('click', function() {
                        FiltroUbicacion(address);
                    });

                    markers.push(marker);
                } else {
                    alert('Ubicación no encontrada');
                }
            })
            .catch(error => console.error('Error:', error));
    }
    function initMap() {
        map = L.map('map').setView([4, -75], 5)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        
        fetch('/ubicaciones')
            .then(response => response.json())
            .then(data => {
                data.forEach(location => {
                    geocodeAndAddMarker(location);
                });
            })
            .catch(error => console.error('Error fetching ubicaciones:', error));
    }

    function actualizarMarkers(publicaciones) {
        clearMarkers();
        publicaciones.forEach(pub => {
            geocodeAndAddMarker(pub.ubicacion, map);
        });

    }
    function clearMarkers() {
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
    }
    

        function aplicarFiltros() {
        const precio = rangeInput.value;
        const tipoInputs = document.querySelectorAll('input[name="tipoInmueble"]');
        let tipo = '';

        tipoInputs.forEach(input => {
            if (input.checked) {
                tipo = input.value;
            }
        });

        const url = tipo 
            ? `/preview?precio=${precio}&tipo=${tipo}` 
            : `/preview?precio=${precio}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                crearMiniaturas(data);
                actualizarMarkers(data);
            })
            .catch(error => console.error('Error fetching publicaciones:', error));
    }

    function FiltroUbicacion(ubicacion) {
    fetch(`/preview_ubicacion?ubicacion=${encodeURIComponent(ubicacion)}`)
        .then(response => response.json())
        .then(data => {
            crearMiniaturas(data);
        })
        .catch(error => console.error('Error fetching publicaciones:', error));
    }
  
  
    //Creador de thumnbails sin filtro
   initMap();
   fetch('/preview')
        .then(response => response.json())
        .then(data => {
            actualizarMarkers(data);
        })
        .catch(error => console.error('Error fetching publicaciones:', error));
    
    
 });


  

