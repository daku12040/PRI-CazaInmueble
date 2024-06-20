document.addEventListener('DOMContentLoaded', function() {
    const precioInput = document.getElementById('precio');
    const buscarUbicacion = document.getElementById('buscarUbicacion');
    const locationModal = document.getElementById('locationModal');
    const confirmLocation = document.getElementById('confirmLocation');
    const span = document.getElementsByClassName('close')[0];
    const ubicacionInput = document.getElementById('ubicacion');
    const publicarButton = document.getElementById('publicar');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const imageUpload = document.getElementById('imageUpload');
    const gallery = document.getElementById('gallery');
    
    let tooltipTimeout;
    let selectedLocation = null;
    let searchMap; 
    let locationQuery;


    $('[data-toggle="tooltip"]').tooltip();
    precioInput.addEventListener('input', function() {
    const precioValue = precioInput.value;
    const isValidInput = /^\d+$/.test(precioValue);

    if (!isValidInput) {
        precioInput.style.backgroundColor = 'rgb(255, 205, 190)';
        const tooltipMessage = 'Digite un valor valido!';
        precioInput.setAttribute('title', tooltipMessage);
        $('[data-toggle="tooltip"]').tooltip('show');
    } else {
        precioInput.style.backgroundColor = ''; 
    }
    });

    precioInput.addEventListener('mouseover', function() {
    tooltipTimeout = setTimeout(() => {
        const precioValue = precioInput.value;
        const isValidInput = /^\d+$/.test(precioValue);

        if (isValidInput) {
            let digitsShow = 3; 
            if (precioValue >= 1000000000) {
                digitsShow = 4;
            } else if (precioValue < 100000000) {
                digitsShow = 2;
            }

            const firstDigits = precioInput.value.substring(0, digitsShow);
            const tooltipMessage = ` ${firstDigits} Millones $`;

            precioInput.setAttribute('title', tooltipMessage);
            $('[data-toggle="tooltip"]').tooltip('show');
        }
    }, 2000);
});

precioInput.addEventListener('mouseout', function() {
    clearTimeout(tooltipTimeout);
    $('[data-toggle="tooltip"]').tooltip('hide');
});

    buscarUbicacion.addEventListener('click', function() {
        locationModal.style.display = "block";
        searchBar.style = "width: 80%";
        searchBar.src = "https://nominatim.openstreetmap.org/ui/search.html?q=";
        initSearchMap();
    });

    span.onclick = function() {
        locationModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == locationModal) {
            locationModal.style.display = "none";
        }
    };

    publicarButton.addEventListener('click', function() {  
    console.log(locationQuery);
    });

    confirmLocation.addEventListener('click', function() {
        if(selectedLocation){
            locationQuery = searchBar.value;
        
            ubicacionInput.style.backgroundColor = "rgb(190,255,190,50%)";
            locationModal.style.display = "none";
            ubicacionInput.value = "Seleccionada ✔️";
            ubicacionInput.setAttribute("value", locationQuery);
            

        } else{
                alert('!Seleccione una ubicacion valida');


        }
    });
    imageUpload.addEventListener('change', chargeImg);
   
        
    function initSearchMap() {
        searchMap = L.map('map').setView([4, -75], 5); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(searchMap);

       
    }
    function findLocation(){
            
        const query = searchBar.value;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;  
        
                
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latlng = [data[0].lat, data[0].lon];
                    if (selectedLocation) {
                        searchMap.removeLayer(selectedLocation);
                }
                searchMap.setView(latlng, 19); 
                selectedLocation = L.marker(latlng).addTo(searchMap)
                    .bindPopup(data[0].display_name)
                    .openPopup();
            } else {
                alert('Ubicacion no encontrada');
                selectedLocation = null; 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('!Seleccione una ubicacion valida');
            selectedLocation = null;
        });
}
    function chargeImg(){
        const files = imageUpload.files;
        
            const col = document.createElement('div');
            col.classList.add('col-sm-6'); 
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.classList.add('figure-card');
            
            
            col.appendChild(img);
            
          
                gallery.appendChild(col);
                }
          
          reader.readAsDataURL(file);
        });

  }

    searchButton.addEventListener('click', function() {
        findLocation();
    });
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            findLocation();
        }
    });
    document.getElementById("publicacionForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const tipo = document.getElementById("tipo").value;
    const publisher = document.getElementById("publisher").value;
    const ubicacion = locationQuery;
    
    const data = {
        nombre: nombre,
        precio: precio,
        tipo: tipo,
        publisher: publisher,
        ubicacion: ubicacion
    };
    
    fetch('/insertar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Error:', error); 
    });
});


});
