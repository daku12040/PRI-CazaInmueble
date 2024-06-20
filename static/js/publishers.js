document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const thumbnails = document.getElementById('thumbnails');
    const publisherId = window.location.pathname.split('/').pop();
    const getImagen = document.getElementById('imagenprueba').getAttribute('data-src');
    //const imgPreview = "{{url_for('static', filename='images/preview.jpg') }}";
    

  function loadCatalogo() {
        fetch('/inmuebles')
            .then(response => response.json())
            .then(publicaciones => {
                const filteredPublicaciones = publicaciones.filter(publicacion => publicacion.publisher_id === parseInt(publisherId));
                catalogoPublisher(filteredPublicaciones);
            })
            .catch(error => {
                console.error('Error al cargar catálogos:', error);
            });
    }

    function catalogoPublisher(publicaciones) {
        thumbnails.innerHTML = ''; 

        publicaciones.forEach(pub => {
            const col = document.createElement('div');
            col.className = 'col-md-6';

            const card = document.createElement('div');
            card.className = 'card-thumbnail';

            const img = document.createElement('img');
            img.className = 'card-img-top';
            const imageUrls = pub.image_url ? pub.image_url.split(';') : [];
            img.src = imageUrls.length > 0 ? `/static/images/${imageUrls[0]}` : '/static/images/preview.jpg';
            img.alt = pub.titulo;
            console.log(img.src);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.id = `titlefor${pub.id}`;
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
   

    loadCatalogo();
});