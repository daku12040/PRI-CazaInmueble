document.addEventListener('DOMContentLoaded', function() {
    const precioInput = document.getElementById('precio');
    const buscarUbicacion = document.getElementById('buscarUbicacion');
    const locationModal = document.getElementById('locationModal');
    const confirmLocation = document.getElementById('confirmLocation');
    const span = document.getElementsByClassName('close')[0];
    const spandesc = document.getElementsByClassName('close')[1];
    const ubicacionInput = document.getElementById('ubicacion');
    const publicarButton = document.getElementById('publicar');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const getPublisher = document.getElementById('publisher');

    const opendesc = document.getElementById('opendesc');
    const descripcionModal = document.getElementById('descripcionModal');
    const saveDescription = document.getElementById('saveDescription');
    const textDescription = document.getElementById('textdescription');
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

    spandesc.onclick = function() {
     descripcionModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == locationModal) {
            locationModal.style.display = "none";
        }
        if (event.target == descripcionModal) {
            descripcionModal.style.display = "none";
        }
    };
    const iduser = parseInt(document.getElementById('getpublisher').innerText.trim(), 10);
    getPublisher.value = iduser ;


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

        opendesc.addEventListener('focus', function() {
        descripcionModal.style.display = "block";
        textDescription.style = "width: 150%";
        
        

        });

        saveDescription.addEventListener('click', function() {
            opendesc.style.backgroundColor = "#cbcbcb";
            descripcionModal.style.display = "none";
        });
    
    //Carga de imagen y prueba de submit
    
   document.getElementById("publicacionForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const formData = new FormData();
    const files = imageUpload.files;
    
    
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }
    
    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const tipo = document.getElementById("tipo").value;
    const publisher = document.getElementById("publisher").value;
    const ubicacion = locationQuery;
    const descripcion = document.getElementById("descripcion").value; 
    const image = document.getElementById("imageUpload").files[0];
    console.log(image.name);
    
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('tipo', tipo);
    formData.append('publisher', publisher);
    formData.append('ubicacion', ubicacion);
    formData.append('descripcion', descripcion);
    
    fetch('/insertar', {
    
        method: 'POST',
        body: formData
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
