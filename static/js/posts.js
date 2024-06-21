document.addEventListener('DOMContentLoaded', function () {
  const linkPublisher = document.getElementById('linkpublisher');
  const getid = linkPublisher.getAttribute('publisherid');
  const imageCharge = document.getElementById('urlcharge');  
  const imageUrlsStr = imageCharge.getAttribute('geturl');
  const imageUrls = imageUrlsStr.split(';').map(url => url.trim()); 
  const carouselInner = document.querySelector('#propertyCarousel .carousel-inner');
  const carouselImages = document.querySelectorAll('.carousel-image');
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalcontent = document.getElementById("imgcontent");
  const buttonAgent = document.getElementById('buttonagendar');
  const agents = document.getElementById('agentesModal');
  const agentsContent = document.getElementById('modalcontent');
  const confirm = document.getElementById('confirmButton');
  const agentesModal = new bootstrap.Modal(document.getElementById('agentesModal'));
  const volverButton = document.querySelector('.button.btn-secondary');
  const deleteButton = document.getElementById('buttondelete');
 

  const modalClose = document.getElementsByClassName("modal-close button")[0];  

      linkPublisher.addEventListener('click', function() {
                window.location.href = `/publisher/${getid}`;
            });

      
      if (imageUrls.length > 0 && imageUrls[0] !== "") {
        imageUrls.forEach((url, index) => {
            const div = document.createElement('div');
            div.className = 'carousel-item' + (index === 0 ? ' active' : '');

            const img = document.createElement('img');
            img.src = `/static/images/${url}`;
            img.className = 'd-block w-100 carousel-image';
            img.alt = `Imagen ${index + 1}`;
            img.style.cursor = "crosshair";

            img.addEventListener('click', function () {
                modal.style.display = "block";
                modalcontent.style.backgroundColor = "#ffffff00";
                modalcontent.style.width = "1000px";
                modalImg.style.width = "1000px";
                modalImg.src = this.src;
            });

            div.appendChild(img);
            carouselInner.appendChild(div);
            
        });
    } else {
        const div = document.createElement('div');
        div.className = 'carousel-item active';

        const img = document.createElement('img');
        img.src = '/static/images/preview.jpg';
        img.className = 'd-block w-100 box-promo';
        img.alt = 'Imagen por defecto';

        div.appendChild(img);
        carouselInner.appendChild(div);
    }
    

    confirm.addEventListener('click',function(){
        event.preventDefault();
        const selectedAgent = document.querySelector('input[name="agentRadio"]:checked');
        if (selectedAgent) {
            const nombreCliente = document.getElementById('nombre').value;
            const telefonoCliente = document.getElementById('telefono').value;
            const selectedUsername = selectedAgent.value;
            const propiedadNombre = confirm.getAttribute('data-propiedad');  

            Swal.fire({
                title: `Estimado ${nombreCliente}`,
                text: 'Datos enviados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            const data = {
                nombreagente: selectedUsername,
                propiedad: propiedadNombre,
                nombrecliente: nombreCliente,
                telcliente: telefonoCliente
            };

            
            fetch('/insertar_solicitud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Solicitud enviada'); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
         else{
            Swal.fire({
                title: 'Estimado Usuario',
                text: 'Seleccione un agente de ventas',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
            agentesModal.show();
        }
    
        });
       
          
        
          
    
    if(deleteButton){
    deleteButton.addEventListener('click', function() {
         
        const getdelete = deleteButton.getAttribute('deleteid');
        const propiedadNombre = confirm.getAttribute('data-propiedad'); 
           const propiedadId = getdelete;

                Swal.fire({
                    title: 'Borrar Publicación',
                    text: `¿Está seguro de que desea borrar la publicación "${propiedadNombre}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetch(`/borrar_propiedad/${propiedadId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire(
                                    'Eliminada',
                                    'La propiedad ha sido eliminada',
                                    'success'
                                ).then(() => {
                                    window.location.href = '/';  
                                });
                            } else {
                                Swal.fire(
                                    'Error',
                                    'error al eliminar la propiedad.',
                                    'error'
                                );
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire(
                                'Error',
                                'error al eliminar la propiedad.',
                                'error'
                            );
                        });
                    }
                });
            });
        }
    modalClose.onclick = function () {
        modal.style.display = "none";
    }
    modal.onclick = function (event) {
        if (event.target !== modalImg) {
            modal.style.display = "none";
        }}

            
    buttonAgent.addEventListener('click', function(event) {

        
        const catalogoId = this.getAttribute('data-catalogoid');
          fetch(`/cargar_agentes/${catalogoId}`)
            .then(response => response.json())
            .then(usuarios => {
                const agentesList = document.getElementById('agentesList');
                agentesList.innerHTML = '';

                if (usuarios.length > 0) {
                    usuarios.forEach((usuario, index) => {
                        const li = document.createElement('li');
                        li.className = "form-input";
                        const radio = document.createElement('input');
                        radio.type = "radio";
                        radio.name = "agentRadio";
                        radio.value = `${usuario.username}`;
                        radio.id = `agentRadio${index}`;

                        const label = document.createElement('label');
                        label.htmlFor = `agentRadio${index}`;
                        label.textContent = `Agente: ${usuario.username} - ${usuario.correo}`;

                        li.appendChild(radio);
                        li.appendChild(label);
                        agentesList.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = 'No hay agentes disponibles Desea contactar directamente con publisher?';
                    agentesList.appendChild(li);
                    const button = document.createElement('button');
                    button.className = "button btn-secondary";
                    button.textContent = "Contacto";
                    button.onclick = function() {
                    window.location.href = '/contacto';
                    };
                        
                    agentsContent.appendChild(button);
                }

               
               
                agentesModal.show();

                agentsContent.style = "width: 150%";
            })
            .catch(error => {
               console.log("No hay datos del publisher");
            });

     
        
    });
    
    volverButton.addEventListener('click', function() {
        agentesModal.hide();
    });
});


        
      