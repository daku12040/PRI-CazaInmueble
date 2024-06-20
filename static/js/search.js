document.addEventListener('DOMContentLoaded', function () {
	const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('filtronav');
    const thumbnails = document.getElementById('thumbnails');
    const footer = document.getElementById('sticker');

    const rutaImagen = document.getElementById('imagen').getAttribute('data-src');//modificar con imagen de publicacion

function redirectToSearch() {
        const filters = getSelectedFilters();
        const searchTerm = searchInput.value.trim();
        const queryParams = new URLSearchParams();

        if (filters.precios.length > 0) {
            queryParams.append('precios', filters.precios.join(','));
        }
        if (filters.tipos.length > 0) {
            queryParams.append('tipos', filters.tipos.join(','));
        }
        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }

        window.location.href = `/search?${queryParams.toString()}`;
    }

    searchButton.addEventListener('click', redirectToSearch);

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            redirectToSearch();
        }
    });
    document.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
	});
	
    function getSelectedFilters() {
        const precioCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="precio"]');
        const tipoCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="tipo"]');

        const selectedPrecios = Array.from(precioCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const selectedTipos = Array.from(tipoCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        return {
            precios: selectedPrecios,
            tipos: selectedTipos
        };
    }

    function crearMiniaturas(publicaciones) {
    
    thumbnails.innerHTML = '';  
    if (publicaciones.length === 0) {
        const col = document.createElement('div');
        col.className = 'col-md-12';

        const h2 = document.createElement('h2');
        h2.textContent = 'Sin resultados, intente un criterio más simple';
        h2.className = 'text-center';

        col.appendChild(h2);
        thumbnails.appendChild(col);
    } else {
    publicaciones.forEach(pub => {
        const col = document.createElement('div');
        col.className = 'col-md-12'; 

        const card = document.createElement('div');
        card.className = 'd-flex flex-row card-thumbnail'; 

        const imgWrapper = document.createElement('div'); 
        imgWrapper.className = 'flex-shrink-0';

        const img = document.createElement('img');
        img.className = 'card-img';
        const imageUrls = pub.image_url ? pub.image_url.split(';') : [];
        img.src = imageUrls.length > 0 ? `/static/images/${imageUrls[0]}` : '/static/images/preview.jpg';
        img.alt = pub.nombre;
        //img.style.width = '150px'; 
        img.style.height = '200px';

        imgWrapper.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.className = 'flex-grow-1 card-body'; 

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = pub.nombre;
        title.addEventListener('click', function() {
            window.location.href = `/propiedad/${pub.id}`;
        });

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = `$${pub.precio}`;

        const type = document.createElement('p');
        type.className = 'card-type';
        type.textContent = pub.tipo;

        const location = document.createElement('p');
        location.className = 'card-location';
        location.textContent = `Ubicación: ${pub.ubicacion}`;

        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(type);
        cardBody.appendChild(location);

        card.appendChild(imgWrapper); 
        card.appendChild(cardBody); 
        col.appendChild(card); 
        thumbnails.appendChild(col); 
    });
}}
	crearMiniaturas(publicaciones);
	});
