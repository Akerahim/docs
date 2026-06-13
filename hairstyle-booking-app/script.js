// ========================================
// Global Variables
// ========================================

let userLocation = null;
let selectedStylist = null;
let map = null;
let markers = [];

// ========================================
// Navigation Toggle (Mobile)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Initialize page-specific functionality
    initializePage();
});

// ========================================
// Geolocation Functions
// ========================================

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                resolve(userLocation);
            },
            error => {
                let errorMessage = 'Impossible d\'obtenir votre position';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Vous avez refusé l\'accès à la géolocalisation';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Position non disponible';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Délai d\'attente dépassé';
                        break;
                }
                reject(new Error(errorMessage));
            }
        );
    });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

// ========================================
// Home Page Functions
// ========================================

function initializeHomePage() {
    // Geolocation button
    const geolocateBtn = document.getElementById('geolocateBtn');
    if (geolocateBtn) {
        geolocateBtn.addEventListener('click', async function() {
            try {
                geolocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localisation...';
                const location = await getUserLocation();
                geolocateBtn.innerHTML = '<i class="fas fa-check"></i> Position obtenue';

                // Get address from coordinates (mock - in production use reverse geocoding API)
                setTimeout(() => {
                    geolocateBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Me géolocaliser';
                }, 2000);

                // Redirect to stylists page with location
                window.location.href = `coiffeuses.html?lat=${location.lat}&lng=${location.lng}`;
            } catch (error) {
                alert(error.message);
                geolocateBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Me géolocaliser';
            }
        });
    }

    // Load popular stylists
    loadPopularStylists();

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();
        });
    }
}

function loadPopularStylists() {
    const container = document.getElementById('popularStylists');
    if (!container || typeof stylistsData === 'undefined') return;

    // Get top 3 rated stylists
    const popularStylists = stylistsData
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    container.innerHTML = popularStylists.map(stylist => createStylistCard(stylist)).join('');
}

// ========================================
// Stylists Listing Page Functions
// ========================================

function initializeStylistsPage() {
    // Use my location button
    const useLocationBtn = document.getElementById('useMyLocation');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', async function() {
            try {
                useLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localisation...';
                const location = await getUserLocation();
                useLocationBtn.innerHTML = '<i class="fas fa-check"></i> Position obtenue';

                // Update active location display
                const activeLocation = document.getElementById('activeLocation');
                activeLocation.style.display = 'flex';
                document.getElementById('currentLocationText').textContent = 'Votre position actuelle';

                // Load stylists near location
                loadStylists(location);

                setTimeout(() => {
                    useLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Ma position';
                }, 2000);
            } catch (error) {
                alert(error.message);
                useLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Ma position';
            }
        });
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const location = document.getElementById('searchLocation').value;
            if (location) {
                // In production, geocode the address to get coordinates
                alert('Recherche pour : ' + location);
                loadStylists();
            } else {
                loadStylists();
            }
        });
    }

    // Filters
    const filters = ['serviceFilter', 'locationFilter', 'distanceFilter', 'sortFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', function() {
                loadStylists(userLocation);
            });
        }
    });

    // Check if location passed in URL
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');

    if (lat && lng) {
        userLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
        const activeLocation = document.getElementById('activeLocation');
        if (activeLocation) {
            activeLocation.style.display = 'flex';
            document.getElementById('currentLocationText').textContent = 'Votre position actuelle';
        }
    }

    // Load stylists
    loadStylists(userLocation);
}

function loadStylists(location = null) {
    const container = document.getElementById('stylistsList');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');

    if (!container || typeof stylistsData === 'undefined') return;

    // Show loading
    if (loadingState) loadingState.style.display = 'block';
    container.innerHTML = '';
    if (noResults) noResults.style.display = 'none';

    setTimeout(() => {
        // Apply filters
        let filteredStylists = [...stylistsData];

        // Service filter
        const serviceFilter = document.getElementById('serviceFilter');
        if (serviceFilter && serviceFilter.value) {
            filteredStylists = filteredStylists.filter(s =>
                s.specialties.some(spec => spec.toLowerCase().includes(serviceFilter.value.toLowerCase()))
            );
        }

        // Location type filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter && locationFilter.value) {
            const locType = locationFilter.value;
            if (locType === 'domicile') {
                filteredStylists = filteredStylists.filter(s => s.homeService);
            } else if (locType === 'salon') {
                filteredStylists = filteredStylists.filter(s => s.salonService);
            }
        }

        // Calculate distances if user location is available
        if (location) {
            filteredStylists = filteredStylists.map(stylist => ({
                ...stylist,
                distance: calculateDistance(
                    location.lat,
                    location.lng,
                    stylist.location.lat,
                    stylist.location.lng
                )
            }));

            // Distance filter
            const distanceFilter = document.getElementById('distanceFilter');
            if (distanceFilter) {
                const maxDistance = parseFloat(distanceFilter.value);
                filteredStylists = filteredStylists.filter(s => s.distance <= maxDistance);
            }
        }

        // Sort
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            switch(sortFilter.value) {
                case 'distance':
                    if (location) {
                        filteredStylists.sort((a, b) => a.distance - b.distance);
                    }
                    break;
                case 'rating':
                    filteredStylists.sort((a, b) => b.rating - a.rating);
                    break;
                case 'price':
                    filteredStylists.sort((a, b) => a.priceFrom - b.priceFrom);
                    break;
            }
        }

        // Hide loading
        if (loadingState) loadingState.style.display = 'none';

        // Display results
        if (filteredStylists.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (resultsCount) resultsCount.textContent = '0 résultat';
        } else {
            container.innerHTML = filteredStylists.map(stylist => createStylistCard(stylist)).join('');
            if (resultsCount) resultsCount.textContent = `${filteredStylists.length} résultat${filteredStylists.length > 1 ? 's' : ''}`;
        }
    }, 1000);
}

function createStylistCard(stylist) {
    const distanceHtml = stylist.distance
        ? `<div class="stylist-location">
               <i class="fas fa-map-marker-alt"></i>
               <span>${stylist.distance.toFixed(1)} km</span>
           </div>`
        : `<div class="stylist-location">
               <i class="fas fa-map-marker-alt"></i>
               <span>${stylist.city}</span>
           </div>`;

    const initials = stylist.name.split(' ').map(n => n[0]).join('');

    return `
        <div class="stylist-card" data-stylist-id="${stylist.id}">
            <div class="stylist-image">
                <span>${initials}</span>
            </div>
            <div class="stylist-info">
                <div class="stylist-header">
                    <h3 class="stylist-name">${stylist.name}</h3>
                    <div class="stylist-rating">
                        <i class="fas fa-star"></i>
                        <span>${stylist.rating}</span>
                    </div>
                </div>
                <div class="stylist-specialties">
                    ${stylist.specialties.slice(0, 3).map(spec =>
                        `<span class="specialty-tag">${spec}</span>`
                    ).join('')}
                </div>
                ${distanceHtml}
                <p class="stylist-price">À partir de ${stylist.priceFrom}€</p>
                <div class="stylist-actions">
                    <button class="btn btn-outline" onclick="viewStylistDetails(${stylist.id})">
                        <i class="fas fa-info-circle"></i> Détails
                    </button>
                    <button class="btn btn-primary" onclick="bookStylist(${stylist.id})">
                        <i class="fas fa-calendar"></i> Réserver
                    </button>
                </div>
            </div>
        </div>
    `;
}

function viewStylistDetails(stylistId) {
    if (typeof stylistsData === 'undefined') return;

    const stylist = stylistsData.find(s => s.id === stylistId);
    if (!stylist) return;

    const modal = document.getElementById('stylistModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    const initials = stylist.name.split(' ').map(n => n[0]).join('');

    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div class="stylist-image" style="width: 150px; height: 150px; margin: 0 auto 1.5rem; font-size: 3rem;">
                <span>${initials}</span>
            </div>
            <h2>${stylist.name}</h2>
            <div class="stylist-rating" style="justify-content: center; font-size: 1.2rem; margin-bottom: 1rem;">
                <i class="fas fa-star"></i>
                <span>${stylist.rating}</span>
                <span style="color: #6b7280; margin-left: 0.5rem;">(${stylist.reviews} avis)</span>
            </div>
        </div>

        <div style="margin-top: 2rem;">
            <h3><i class="fas fa-cut"></i> Spécialités</h3>
            <div class="stylist-specialties" style="margin-top: 1rem;">
                ${stylist.specialties.map(spec =>
                    `<span class="specialty-tag">${spec}</span>`
                ).join('')}
            </div>
        </div>

        <div style="margin-top: 2rem;">
            <h3><i class="fas fa-info-circle"></i> Description</h3>
            <p style="margin-top: 1rem;">${stylist.description || 'Coiffeuse professionnelle avec plusieurs années d\'expérience.'}</p>
        </div>

        <div style="margin-top: 2rem;">
            <h3><i class="fas fa-map-marker-alt"></i> Localisation</h3>
            <p style="margin-top: 1rem;">${stylist.address}, ${stylist.city}</p>
            <p style="margin-top: 0.5rem;">
                ${stylist.homeService ? '<i class="fas fa-check" style="color: var(--success-color);"></i> Service à domicile' : ''}
                ${stylist.homeService && stylist.salonService ? ' • ' : ''}
                ${stylist.salonService ? '<i class="fas fa-check" style="color: var(--success-color);"></i> Service en salon' : ''}
            </p>
        </div>

        <div style="margin-top: 2rem;">
            <h3><i class="fas fa-euro-sign"></i> Tarifs</h3>
            <p style="margin-top: 1rem; font-size: 1.2rem; font-weight: bold; color: var(--primary-color);">
                À partir de ${stylist.priceFrom}€
            </p>
        </div>

        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn btn-primary" onclick="bookStylist(${stylist.id})">
                <i class="fas fa-calendar"></i> Réserver maintenant
            </button>
        </div>
    `;

    modal.classList.add('active');

    // Close modal
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}

function bookStylist(stylistId) {
    // Store selected stylist in sessionStorage
    sessionStorage.setItem('selectedStylistId', stylistId);
    // Redirect to booking page
    window.location.href = 'reservation.html';
}

// ========================================
// Page Initialization
// ========================================

function initializePage() {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/' || path === '') {
        initializeHomePage();
    } else if (path.includes('coiffeuses.html')) {
        initializeStylistsPage();
    }
}

// ========================================
// Utility Functions
// ========================================

// Format date to French locale
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Format time
function formatTime(time) {
    return time;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Interactive Map
// ========================================

function toggleMap() {
    const mapContainer = document.getElementById('mapContainer');
    const toggleBtn = document.getElementById('toggleMapBtn');

    if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-list"></i> Masquer la carte';

        if (!map) {
            initializeMap();
        }
    } else {
        mapContainer.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-map"></i> Afficher la carte';
    }
}

function initializeMap() {
    if (typeof L === 'undefined') return;

    const defaultCenter = [48.8566, 2.3522]; // Paris
    const defaultZoom = 12;

    map = L.map('map').setView(defaultCenter, defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add stylists to map
    if (typeof stylistsData !== 'undefined') {
        addStylistsToMap(stylistsData);
    }

    // Add user location if available
    if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map).bindPopup('Votre position');

        map.setView([userLocation.lat, userLocation.lng], 13);
    }
}

function addStylistsToMap(stylists) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    stylists.forEach(stylist => {
        const marker = L.marker([stylist.location.lat, stylist.location.lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);

        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 0.5rem 0;">${stylist.name}</h3>
                <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 0.5rem;">
                    <i class="fas fa-star" style="color: #fbbf24;"></i>
                    <span>${stylist.rating}</span>
                </div>
                <p style="margin: 0.5rem 0; color: #6b7280;">${stylist.specialties.slice(0, 2).join(', ')}</p>
                <p style="margin: 0.5rem 0;"><strong>À partir de ${stylist.priceFrom}€</strong></p>
                <button class="btn btn-primary btn-sm" onclick="bookStylist(${stylist.id})" style="width: 100%; margin-top: 0.5rem;">
                    Réserver
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });
}
