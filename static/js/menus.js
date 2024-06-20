document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const menuItems = document.getElementById('menuItems');
    const content = document.getElementById('content');
    const thumbnails = document.getElementById('thumbnails');
    const rutaImagen = document.getElementById('imagen').getAttribute('data-src');
    const filtro1 = document.getElementById('filtro1');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('filtronav');

    toggleSidebar.addEventListener('click', function (event) {
        event.preventDefault();
        
        if (sidebar.style.width === '80px') {
            sidebar.style.width = '300px'; 
            sidebar.style.borderRight = '0px';            
            toggleSidebar.textContent = 'Menu <';
            menuItems.style.display = 'block';

        } else {
            sidebar.style.width = '80px';
            sidebar.style.borderRight = '2px solid #000'; 
            toggleSidebar.textContent = '<';
             menuItems.style.display = 'none';
        }
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
            title.id = `titlefor${pub.id}`;
            title.textContent = pub.nombre;
            title.addEventListener('click', function() {
                window.location.href = `/propiedad/${pub.id}`;});

            //Agregar url/propiedad/pub.id

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

    function filterItems() {
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

        fetch(`/preview?${queryParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                crearMiniaturasFiltradas(data);
            })
            .catch(error => console.error('Error fetching filtered items:', error));
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

    fetch('/preview')
        .then(response => response.json())
        .then(data => {
            crearMiniaturas(data);
        })
        .catch(error => console.error('Error fetching publicaciones:', error));

    
        });
    