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
  const confirm = document.getElementById('confirmButton');
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
        img.className = 'd-block w-100';
        img.alt = 'Imagen por defecto';

        div.appendChild(img);
        carouselInner.appendChild(div);
    }
    
    buttonAgent.addEventListener('click',function(){
        agents.style.display = "block";
        var button = $(event.relatedTarget);
        var catalogo_id = button.data('catalogoid');
        cargarUsuariosPropiedad(catalogo_id);

    });
    confirm.addEventListener('click',function()
    
          alert('Datos enviados correctamente');
          agents.style.display = "none";
        });

    modalClose.onclick = function () {
        modal.style.display = "none";
    }
    modal.onclick = function (event) {
        if (event.target !== modalImg) {
            modal.style.display = "none";
        }}
$(document).ready(function(){
    function cargarUsuariosPropiedad(catalogo_id) {
      $.get('/cargar_usuarios/' + catalogo_id, function(data){
        $('#usuariosPropiedad').empty();
        data.forEach(function(usuario) {
          $('#usuariosPropiedad').append('<div><label>' + usuario.fullname + ' (' + usuario.correo + ')</label></div>');
        });
      });
    }

     
      
    });



        });
      