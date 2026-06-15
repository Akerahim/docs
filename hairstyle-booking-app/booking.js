// ========================================
// Booking System
// ========================================

let currentStep = 1;
let bookingData = {
    stylist: null,
    serviceType: null,
    address: null,
    services: [],
    date: null,
    time: null,
    totalPrice: 0,
    duration: 0,
    clientInfo: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
});

function initializeBookingPage() {
    if (!window.location.pathname.includes('reservation.html')) return;

    // Load stylists in step 1
    loadStylistsForBooking();

    // Service type radio buttons
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const addressInput = document.getElementById('addressInput');
            if (this.value === 'domicile') {
                addressInput.style.display = 'block';
                bookingData.serviceType = 'domicile';
            } else {
                addressInput.style.display = 'none';
                bookingData.serviceType = 'salon';
            }
            loadServicesForStylist();
        });
    });

    // Address geolocation
    const locateBtn = document.getElementById('locateAddress');
    if (locateBtn) {
        locateBtn.addEventListener('click', async function() {
            try {
                locateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localisation...';
                const location = await getUserLocation();
                // In production, use reverse geocoding to get address
                document.getElementById('clientAddress').value = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
                bookingData.address = document.getElementById('clientAddress').value;
                locateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Utiliser ma position';
            } catch (error) {
                alert(error.message);
                locateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Utiliser ma position';
            }
        });
    }

    // Client address input
    const clientAddressInput = document.getElementById('clientAddress');
    if (clientAddressInput) {
        clientAddressInput.addEventListener('input', function() {
            bookingData.address = this.value;
        });
    }

    // Date picker
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        dateInput.addEventListener('change', function() {
            bookingData.date = this.value;
            generateTimeSlots();
        });
    }

    // Navigation buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', nextStep);
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmBooking();
        });
    }

    // Terms checkbox
    const acceptTerms = document.getElementById('acceptTerms');
    const confirmBtn = document.getElementById('confirmBooking');
    if (acceptTerms && confirmBtn) {
        acceptTerms.addEventListener('change', function() {
            confirmBtn.disabled = !this.checked;
        });
    }

    // Client info inputs
    ['clientName', 'clientPhone', 'clientEmail', 'clientComments'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                bookingData.clientInfo[id] = this.value;
            });
        }
    });
}

// ========================================
// Step 1: Select Stylist
// ========================================

function loadStylistsForBooking() {
    const container = document.getElementById('stylistsSelection');
    if (!container || typeof stylistsData === 'undefined') return;

    // Check if a stylist was pre-selected
    const selectedStylistId = sessionStorage.getItem('selectedStylistId');

    container.innerHTML = stylistsData.map(stylist => {
        const initials = stylist.name.split(' ').map(n => n[0]).join('');
        const isSelected = selectedStylistId && parseInt(selectedStylistId) === stylist.id;

        return `
            <div class="stylist-option ${isSelected ? 'selected' : ''}" data-stylist-id="${stylist.id}" onclick="selectStylist(${stylist.id})">
                <div class="stylist-avatar">${initials}</div>
                <div class="stylist-details">
                    <h3>${stylist.name}</h3>
                    <div class="stylist-rating">
                        <i class="fas fa-star" style="color: #fbbf24;"></i>
                        <span>${stylist.rating}</span>
                        <span style="color: #6b7280;">(${stylist.reviews} avis)</span>
                    </div>
                    <div class="stylist-specialties" style="margin-top: 0.5rem;">
                        ${stylist.specialties.slice(0, 3).map(spec =>
                            `<span class="specialty-tag">${spec}</span>`
                        ).join('')}
                    </div>
                    <p style="margin-top: 0.5rem; color: #6b7280;">
                        <i class="fas fa-map-marker-alt"></i> ${stylist.city}
                        ${stylist.homeService ? ' • <i class="fas fa-home"></i> À domicile' : ''}
                        ${stylist.salonService ? ' • <i class="fas fa-store"></i> En salon' : ''}
                    </p>
                </div>
            </div>
        `;
    }).join('');

    // If pre-selected, auto-select
    if (selectedStylistId) {
        selectStylist(parseInt(selectedStylistId));
    }
}

function selectStylist(stylistId) {
    // Remove previous selection
    document.querySelectorAll('.stylist-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add selection
    const selected = document.querySelector(`.stylist-option[data-stylist-id="${stylistId}"]`);
    if (selected) {
        selected.classList.add('selected');
    }

    // Update booking data
    const stylist = stylistsData.find(s => s.id === stylistId);
    if (stylist) {
        bookingData.stylist = stylist;

        // Enable next button
        const nextBtn = document.getElementById('step1Next');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Clear session storage
        sessionStorage.removeItem('selectedStylistId');
    }
}

// ========================================
// Step 2: Select Services
// ========================================

function loadServicesForStylist() {
    if (!bookingData.stylist) return;

    const container = document.getElementById('servicesSelection');
    const selectedInfo = document.getElementById('selectedStylistInfo');

    if (!container) return;

    // Show selected stylist info
    if (selectedInfo) {
        const initials = bookingData.stylist.name.split(' ').map(n => n[0]).join('');
        selectedInfo.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background: var(--light-color); border-radius: 8px; margin-bottom: 1.5rem;">
                <div class="stylist-avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">${initials}</div>
                <div>
                    <h3 style="margin: 0;">${bookingData.stylist.name}</h3>
                    <p style="margin: 0; color: #6b7280;">
                        <i class="fas fa-star" style="color: #fbbf24;"></i> ${bookingData.stylist.rating}
                        • ${bookingData.stylist.city}
                    </p>
                </div>
            </div>
        `;
    }

    // Load services
    container.innerHTML = bookingData.stylist.services.map(service => `
        <label class="service-checkbox">
            <input type="checkbox" name="service" value="${service.id}" data-price="${service.price}" data-duration="${service.duration}" onchange="toggleService(${service.id}, ${service.price}, ${service.duration})">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0;">${service.name}</h4>
                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">
                    <i class="fas fa-clock"></i> ${service.duration} min
                    <span style="margin-left: 1rem;">
                        <i class="fas fa-euro-sign"></i> ${service.price}€
                    </span>
                </p>
            </div>
        </label>
    `).join('');
}

function toggleService(serviceId, price, duration) {
    const service = bookingData.stylist.services.find(s => s.id === serviceId);
    const checkbox = document.querySelector(`input[value="${serviceId}"]`);

    if (checkbox.checked) {
        // Add service
        if (!bookingData.services.find(s => s.id === serviceId)) {
            bookingData.services.push(service);
        }
    } else {
        // Remove service
        bookingData.services = bookingData.services.filter(s => s.id !== serviceId);
    }

    // Update totals
    updateTotals();

    // Enable/disable next button
    const nextBtn = document.getElementById('step2Next');
    if (nextBtn) {
        nextBtn.disabled = bookingData.services.length === 0 || !bookingData.serviceType;
    }
}

function updateTotals() {
    bookingData.totalPrice = bookingData.services.reduce((sum, s) => sum + s.price, 0);
    bookingData.duration = bookingData.services.reduce((sum, s) => sum + s.duration, 0);

    // Update estimated duration display
    const durationEl = document.getElementById('estimatedDuration');
    if (durationEl) {
        const hours = Math.floor(bookingData.duration / 60);
        const mins = bookingData.duration % 60;
        durationEl.textContent = hours > 0 ? `${hours}h${mins.toString().padStart(2, '0')}` : `${mins} min`;
    }
}

// ========================================
// Step 3: Date & Time
// ========================================

function generateTimeSlots() {
    const container = document.querySelector('.slots-grid');
    if (!container || !bookingData.date) return;

    // Show services summary
    const summary = document.getElementById('selectedServicesSummary');
    if (summary) {
        summary.innerHTML = `
            <div style="padding: 1rem; background: var(--light-color); border-radius: 8px; margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Services sélectionnés :</h4>
                ${bookingData.services.map(s => `
                    <p style="margin: 0.25rem 0;">• ${s.name} - ${s.price}€</p>
                `).join('')}
                <p style="margin-top: 0.5rem; font-weight: bold; color: var(--primary-color);">
                    Total : ${bookingData.totalPrice}€
                </p>
            </div>
        `;
    }

    // Generate time slots (9:00 - 19:00)
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
        for (let min = 0; min < 60; min += 30) {
            if (hour === 19 && min > 0) continue; // Stop at 19:00
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            slots.push(time);
        }
    }

    container.innerHTML = slots.map(slot => {
        // Randomly mark some as unavailable (in production, check real availability)
        const isUnavailable = Math.random() > 0.7;
        return `
            <div class="time-slot ${isUnavailable ? 'unavailable' : ''}" onclick="selectTimeSlot('${slot}', this)">
                ${slot}
            </div>
        `;
    }).join('');
}

function selectTimeSlot(time, element) {
    if (element.classList.contains('unavailable')) return;

    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Select new slot
    element.classList.add('selected');
    bookingData.time = time;

    // Enable next button
    const nextBtn = document.getElementById('step3Next');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// ========================================
// Step 4: Confirmation
// ========================================

function updateConfirmationSummary() {
    // Stylist info
    const confirmStylist = document.getElementById('confirmStylist');
    if (confirmStylist && bookingData.stylist) {
        confirmStylist.innerHTML = `
            <p><strong>${bookingData.stylist.name}</strong></p>
            <p style="color: #6b7280;">
                <i class="fas fa-star" style="color: #fbbf24;"></i> ${bookingData.stylist.rating}
                • ${bookingData.stylist.reviews} avis
            </p>
        `;
    }

    // Services
    const confirmServices = document.getElementById('confirmServices');
    if (confirmServices) {
        confirmServices.innerHTML = bookingData.services.map(s => `
            <p>• ${s.name} - ${s.price}€ (${s.duration} min)</p>
        `).join('');
    }

    // Date & Time
    const confirmDateTime = document.getElementById('confirmDateTime');
    if (confirmDateTime && bookingData.date && bookingData.time) {
        const date = new Date(bookingData.date);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        confirmDateTime.innerHTML = `
            <p><strong>${formattedDate}</strong></p>
            <p>Heure : ${bookingData.time}</p>
            <p>Durée : ${Math.floor(bookingData.duration / 60)}h${(bookingData.duration % 60).toString().padStart(2, '0')}</p>
        `;
    }

    // Location
    const confirmLocation = document.getElementById('confirmLocation');
    if (confirmLocation) {
        if (bookingData.serviceType === 'domicile') {
            confirmLocation.innerHTML = `
                <p><i class="fas fa-home"></i> Service à domicile</p>
                <p>${bookingData.address || 'Adresse à renseigner'}</p>
            `;
        } else {
            confirmLocation.innerHTML = `
                <p><i class="fas fa-store"></i> En salon</p>
                <p>${bookingData.stylist.address}, ${bookingData.stylist.city}</p>
            `;
        }
    }

    // Total price
    const totalPrice = document.getElementById('totalPrice');
    if (totalPrice) {
        totalPrice.textContent = `${bookingData.totalPrice} €`;
    }
}

// ========================================
// Navigation
// ========================================

function nextStep() {
    if (currentStep === 1 && !bookingData.stylist) {
        alert('Veuillez sélectionner une coiffeuse');
        return;
    }

    if (currentStep === 2) {
        if (bookingData.services.length === 0) {
            alert('Veuillez sélectionner au moins un service');
            return;
        }
        if (!bookingData.serviceType) {
            alert('Veuillez choisir le type de service (domicile ou salon)');
            return;
        }
        if (bookingData.serviceType === 'domicile' && !bookingData.address) {
            alert('Veuillez entrer votre adresse');
            return;
        }
    }

    if (currentStep === 3) {
        if (!bookingData.date) {
            alert('Veuillez sélectionner une date');
            return;
        }
        if (!bookingData.time) {
            alert('Veuillez sélectionner un créneau horaire');
            return;
        }
    }

    if (currentStep < 4) {
        currentStep++;
        updateStepDisplay();

        if (currentStep === 4) {
            updateConfirmationSummary();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.booking-steps .step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ========================================
// Confirm Booking
// ========================================

function confirmBooking() {
    // Validate client info
    const requiredFields = ['clientName', 'clientPhone', 'clientEmail'];
    for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
    }

    // Validate terms acceptance
    const acceptTerms = document.getElementById('acceptTerms');
    if (!acceptTerms || !acceptTerms.checked) {
        alert('Veuillez accepter les conditions générales');
        return;
    }

    // Get payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    bookingData.paymentMethod = paymentMethod ? paymentMethod.value : 'cash';

    // In production, send booking data to server
    console.log('Booking confirmed:', bookingData);

    // Show success modal
    showSuccessModal();
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const confirmationDetails = document.getElementById('confirmationDetails');

    if (!modal || !confirmationDetails) return;

    const date = new Date(bookingData.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate confirmation number
    const confirmationNumber = 'BC' + Date.now().toString().slice(-8);

    confirmationDetails.innerHTML = `
        <div style="text-align: left; margin-top: 1.5rem;">
            <p><strong>Numéro de confirmation :</strong> ${confirmationNumber}</p>
            <p><strong>Coiffeuse :</strong> ${bookingData.stylist.name}</p>
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${bookingData.time}</p>
            <p><strong>Services :</strong></p>
            <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                ${bookingData.services.map(s => `<li>${s.name}</li>`).join('')}
            </ul>
            <p><strong>Total :</strong> ${bookingData.totalPrice}€</p>
            <p style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 8px; color: #92400e;">
                <i class="fas fa-info-circle"></i> Un SMS de confirmation a été envoyé à ${bookingData.clientInfo.clientPhone}
            </p>
        </div>
    `;

    modal.classList.add('active');

    // Send confirmation email (in production)
    // sendConfirmationEmail(bookingData);
}

// ========================================
// Helper Functions
// ========================================

// Reuse geolocation function from script.js
if (typeof getUserLocation === 'undefined') {
    function getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('La géolocalisation n\'est pas supportée'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => reject(new Error('Impossible d\'obtenir votre position'))
            );
        });
    }
}
