// ========================================
// Dashboard functionality
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    setupLogin();
    setupNavigation();
    setupMenuToggle();
    loadTodayAppointments();
    loadChatConversations();
    renderMiniCalendar();
}

// ========================================
// Login System
// ========================================

function setupLogin() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulate login (in production, this would be an API call)
            if (email && password) {
                // Store session
                sessionStorage.setItem('stylistLoggedIn', 'true');
                sessionStorage.setItem('stylistEmail', email);

                // Show dashboard
                showDashboard();
            }
        });
    }

    // Check if already logged in
    if (sessionStorage.getItem('stylistLoggedIn') === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'flex';
}

function showRegister() {
    alert('Fonctionnalité d\'inscription en cours de développement');
}

function logout() {
    sessionStorage.removeItem('stylistLoggedIn');
    sessionStorage.removeItem('stylistEmail');
    location.reload();
}

// ========================================
// Navigation
// ========================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get page to show
            const page = this.dataset.page;

            // Hide all pages
            document.querySelectorAll('.page-content').forEach(p => {
                p.classList.remove('active');
            });

            // Show selected page
            const pageToShow = document.getElementById(page + 'Page');
            if (pageToShow) {
                pageToShow.classList.add('active');
            }
        });
    });
}

function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// ========================================
// Today's Appointments
// ========================================

function loadTodayAppointments() {
    const container = document.getElementById('todayAppointments');
    if (!container) return;

    // Mock data
    const appointments = [
        { time: '09:00', client: 'Aïcha Diallo', service: 'Tresses collées', duration: '2h' },
        { time: '11:30', client: 'Mariam Soumaré', service: 'Défrisage + soin', duration: '2h' },
        { time: '14:00', client: 'Kadiatou Bah', service: 'Box braids', duration: '3h' },
        { time: '17:30', client: 'Fatoumata Keita', service: 'Coupe + brushing', duration: '1h' }
    ];

    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-time">${apt.time}</div>
            <div class="appointment-details">
                <div class="appointment-client">${apt.client}</div>
                <div class="appointment-service">${apt.service} • ${apt.duration}</div>
            </div>
            <div class="appointment-actions">
                <button class="icon-btn success" title="Marquer comme terminé">
                    <i class="fas fa-check"></i>
                </button>
                <button class="icon-btn danger" title="Annuler">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ========================================
// Chat System
// ========================================

function loadChatConversations() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;

    // Mock data
    const conversations = [
        {
            id: 1,
            name: 'Aïcha Diallo',
            avatar: 'https://ui-avatars.com/api/?name=Aicha+Diallo&background=ff006e&color=fff',
            lastMessage: 'Merci beaucoup ! À demain',
            time: '10:30',
            unread: 2
        },
        {
            id: 2,
            name: 'Mariam Soumaré',
            avatar: 'https://ui-avatars.com/api/?name=Mariam+Soumare&background=fb5607&color=fff',
            lastMessage: 'Est-ce que je peux venir un peu plus tôt ?',
            time: 'Hier',
            unread: 0
        },
        {
            id: 3,
            name: 'Kadiatou Bah',
            avatar: 'https://ui-avatars.com/api/?name=Kadiatou+Bah&background=ffbe0b&color=000',
            lastMessage: 'Parfait, je confirme mon RDV',
            time: '12 juin',
            unread: 0
        }
    ];

    chatList.innerHTML = conversations.map(conv => `
        <div class="chat-item" onclick="openChat(${conv.id})">
            <img src="${conv.avatar}" alt="${conv.name}" class="chat-avatar">
            <div class="chat-info">
                <div class="chat-name">${conv.name}</div>
                <div class="chat-last-message">${conv.lastMessage}</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${conv.time}</div>
                ${conv.unread > 0 ? `<div class="chat-unread">${conv.unread}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function openChat(chatId) {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => item.classList.remove('active'));

    event.currentTarget.classList.add('active');

    const chatMain = document.getElementById('chatMain');
    chatMain.innerHTML = `
        <div class="chat-header" style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 1rem;">
            <img src="https://ui-avatars.com/api/?name=Client&background=ff006e&color=fff" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%;">
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--dark-color);">Cliente</div>
                <div style="font-size: 0.9rem; color: var(--success-color);">En ligne</div>
            </div>
            <button class="icon-btn" style="background: var(--light-color);"><i class="fas fa-phone"></i></button>
            <button class="icon-btn" style="background: var(--light-color);"><i class="fas fa-ellipsis-v"></i></button>
        </div>
        <div class="chat-messages" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem;">
                <img src="https://ui-avatars.com/api/?name=Client&background=ff006e&color=fff" style="width: 35px; height: 35px; border-radius: 50%;">
                <div>
                    <div style="background: var(--light-color); padding: 0.75rem 1rem; border-radius: 12px 12px 12px 0; max-width: 400px;">
                        Bonjour ! Je voudrais prendre rendez-vous pour des tresses
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 4px;">10:25</div>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-direction: row-reverse;">
                <img src="https://ui-avatars.com/api/?name=Fatima+Diallo&background=fb5607&color=fff" style="width: 35px; height: 35px; border-radius: 50%;">
                <div style="text-align: right;">
                    <div style="background: var(--gradient-primary); color: white; padding: 0.75rem 1rem; border-radius: 12px 12px 0 12px; max-width: 400px; display: inline-block;">
                        Bonjour ! Bien sûr, quel type de tresses souhaitez-vous ?
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 4px;">10:26</div>
                </div>
            </div>
        </div>
        <div class="chat-input" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); display: flex; gap: 1rem;">
            <button class="icon-btn" style="background: var(--light-color);"><i class="fas fa-paperclip"></i></button>
            <input type="text" placeholder="Écrivez votre message..." style="flex: 1; padding: 10px 15px; border: 2px solid var(--border-color); border-radius: 25px;">
            <button class="btn btn-primary" style="border-radius: 50%; width: 45px; height: 45px; padding: 0;"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
}

// ========================================
// Calendar (Mini version)
// ========================================

function renderMiniCalendar() {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let calendarHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="margin: 0;">${monthNames[currentMonth]} ${currentYear}</h2>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline"><i class="fas fa-chevron-left"></i></button>
                <button class="btn btn-outline">Aujourd'hui</button>
                <button class="btn btn-outline"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; text-align: center;">
            <div style="font-weight: 600; color: var(--text-light);">Dim</div>
            <div style="font-weight: 600; color: var(--text-light);">Lun</div>
            <div style="font-weight: 600; color: var(--text-light);">Mar</div>
            <div style="font-weight: 600; color: var(--text-light);">Mer</div>
            <div style="font-weight: 600; color: var(--text-light);">Jeu</div>
            <div style="font-weight: 600; color: var(--text-light);">Ven</div>
            <div style="font-weight: 600; color: var(--text-light);">Sam</div>
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        const hasAppointment = Math.random() > 0.7; // Random appointments for demo

        calendarHTML += `
            <div style="
                padding: 1rem;
                border-radius: var(--border-radius);
                background: ${isToday ? 'var(--gradient-primary)' : hasAppointment ? 'var(--light-color)' : 'transparent'};
                color: ${isToday ? 'white' : 'var(--dark-color)'};
                font-weight: ${isToday ? 'bold' : 'normal'};
                cursor: pointer;
                transition: var(--transition);
                position: relative;
                ${hasAppointment && !isToday ? 'border: 2px solid var(--primary-color);' : ''}
            " onmouseover="this.style.background='var(--light-color)'; ${isToday ? 'this.style.color=\'var(--dark-color)\';' : ''}"
               onmouseout="this.style.background='${isToday ? 'var(--gradient-primary)' : hasAppointment ? 'var(--light-color)' : 'transparent'}'; ${isToday ? 'this.style.color=\'white\';' : ''}">
                ${day}
                ${hasAppointment ? '<div style="position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--primary-color); border-radius: 50%;"></div>' : ''}
            </div>
        `;
    }

    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;
}

// ========================================
// Notifications
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    const color = type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)';

    notification.innerHTML = `
        <i class="fas fa-${icon}" style="font-size: 1.5rem; color: ${color};"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
