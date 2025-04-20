// Variables para el carrusel
let currentSlide = 0;
let carouselInterval = null;
const SLIDE_INTERVAL = 2000; // 2 segundos (constante en mayúsculas)

// Cacheo de elementos del DOM
const domElements = {
    navMenu: document.getElementById('nav-menu'),
    menuToggle: document.querySelector('.menu-toggle'),
    modal: document.getElementById('productModal'),
    modalProductName: document.getElementById('modalProductName'),
    modalProductDescription: document.getElementById('modalProductDescription'),
    carouselInner: document.getElementById('carouselInner'),
    carouselIndicators: document.getElementById('carouselIndicators')
};

// Función para alternar el menú
function toggleMenu() {
    const { navMenu, menuToggle } = domElements;
    const menuItems = navMenu.querySelectorAll('li');
    
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        // Animación para abrir el menú
        menuToggle.style.transform = 'rotate(180deg)';
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 * index);
        });
        
        // Animación de entrada del menú
        navMenu.style.opacity = '0';
        navMenu.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            navMenu.style.opacity = '1';
            navMenu.style.transform = 'translateY(0)';
        }, 50);
    } else {
        // Animación para cerrar el menú
        menuToggle.style.transform = 'rotate(0deg)';
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
        });
    }
}

// Aplicar transiciones CSS una vez (mejor performance)
function applyInitialStyles() {
    const { navMenu, menuToggle } = domElements;
    const menuItems = navMenu.querySelectorAll('li');
    
    // Transiciones CSS
    menuToggle.style.transition = 'transform 0.5s ease';
    navMenu.style.transition = 'all 0.3s ease';
    menuItems.forEach(item => {
        item.style.transition = 'all 0.4s ease';
    });
}

// Funciones del modal
function openModal(name, description, images) {
    const { modal, modalProductName, modalProductDescription, carouselInner, carouselIndicators } = domElements;
    
    // Actualizar contenido del modal
    modalProductName.textContent = name;
    modalProductDescription.textContent = description;
    
    // Limpiar carrusel existente
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    // Crear elementos del carrusel
    images.forEach((imageUrl, index) => {
        // Crear slide
        const item = document.createElement('div');
        item.className = 'carousel-item';
        if (index === 0) item.classList.add('active');
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.loading = 'lazy'; // Mejora de performance
        
        item.appendChild(img);
        carouselInner.appendChild(item);
        
        // Crear indicador
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
        indicator.onclick = () => goToSlide(index);
        carouselIndicators.appendChild(indicator);
    });
    
    // Iniciar carrusel
    currentSlide = 0;
    updateCarousel();
    startCarousel();
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Añadir evento de teclado para navegación
    document.addEventListener('keydown', handleKeyDown);
}

function closeModal() {
    const { modal } = domElements;
    stopCarousel();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleKeyDown);
}

// Manejo de teclado para el modal
function handleKeyDown(e) {
    switch(e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
    }
}

// Funciones del carrusel
function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, SLIDE_INTERVAL);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function nextSlide() {
    const items = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    const items = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide - 1 + items.length) % items.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const { carouselInner } = domElements;
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Actualizar posición del carrusel
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Actualizar clases activas
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
        indicator.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
    });
    
    // Reiniciar el temporizador
    startCarousel();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    applyInitialStyles();
    
    // Cerrar modal al hacer clic fuera del contenido
    domElements.modal.addEventListener('click', (e) => {
        if (e.target === domElements.modal) {
            closeModal();
        }
    });
});
