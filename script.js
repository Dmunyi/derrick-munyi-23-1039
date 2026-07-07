const SUPABASE_URL = 'https://qeiqelutrapktutdbjrl.supabase.co/';
const SUPABASE_ANON_KEY = 'sb_publishable_d1HCyFbGliLNGpS4EMJnsw_92dlch3g';

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const PopupManager = {
    overlay: null,
    modal: null,
    confirmCallback: null,
    cancelCallback: null,

    init() {
        this.overlay = document.getElementById('popup-overlay');
        this.modal = document.getElementById('popup-modal');

        document.getElementById('popup-close-btn').addEventListener('click', () => this.close());
        document.getElementById('popup-confirm-btn').addEventListener('click', () => this.handleConfirm());
        document.getElementById('popup-cancel-btn').addEventListener('click', () => this.handleCancel());
        this.overlay.addEventListener('click', () => this.close());
    },

    show(title, message, type = 'info', options = {}) {
        const titleEl = document.getElementById('popup-title');
        const messageEl = document.getElementById('popup-message');
        const confirmBtn = document.getElementById('popup-confirm-btn');
        const cancelBtn = document.getElementById('popup-cancel-btn');

        titleEl.textContent = title;
        messageEl.textContent = message;

        this.modal.className = 'popup-modal show';
        this.modal.classList.add(`popup-${type}`);

        confirmBtn.textContent = options.confirmText || 'OK';
        if (options.showCancel) {
            cancelBtn.style.display = 'block';
            cancelBtn.textContent = options.cancelText || 'Cancel';
        } else {
            cancelBtn.style.display = 'none';
        }

        this.confirmCallback = options.onConfirm || null;
        this.cancelCallback = options.onCancel || null;

        this.overlay.classList.add('show');
    },

    close() {
        this.modal.classList.add('closing');
        setTimeout(() => {
            this.modal.classList.remove('show', 'closing', 'popup-info', 'popup-success', 'popup-warning', 'popup-error');
            this.overlay.classList.remove('show');
            this.confirmCallback = null;
            this.cancelCallback = null;
        }, 300);
    },

    handleConfirm() {
        if (this.confirmCallback) this.confirmCallback();
        this.close();
    },

    handleCancel() {
        if (this.cancelCallback) this.cancelCallback();
        this.close();
    },

    success(title, message, options = {}) {
        this.show(title, message, 'success', options);
    },

    info(title, message, options = {}) {
        this.show(title, message, 'info', options);
    },

    warning(title, message, options = {}) {
        this.show(title, message, 'warning', options);
    },

    error(title, message, options = {}) {
        this.show(title, message, 'error', options);
    },

    confirm(title, message, options = {}) {
        options.showCancel = true;
        this.show(title, message, 'info', options);
    }
};

function setFormStatus(message, type = 'info') {
    const status = document.getElementById('form-status');
    if (!status) return;
    status.textContent = message;
    status.className = `form-status ${type}`;
}

function renderFallbackCars(container) {
    const fallbackCars = [
        {
            name: 'Lamborghini Aventador',
            description: 'A dramatic V12 supercar with aggressive styling and unmistakable presence.',
            top_speed: '217 mph',
            acceleration: '2.8 sec'
        },
        {
            name: 'Ferrari SF90 Stradale',
            description: 'A plug-in hybrid Ferrari engineered for explosive acceleration and precision.',
            top_speed: '211 mph',
            acceleration: '2.5 sec'
        },
        {
            name: 'McLaren 720S',
            description: 'A lightweight supercar focused on razor-sharp handling and track-ready confidence.',
            top_speed: '212 mph',
            acceleration: '2.8 sec'
        }
    ];

    container.innerHTML = fallbackCars.map((car) => `
        <article class="car-card">
            <h3>${car.name}</h3>
            <p>${car.description}</p>
            <div class="car-meta">
                <span>Top Speed: ${car.top_speed}</span>
                <span>0-60 mph: ${car.acceleration}</span>
            </div>
        </article>
    `).join('');
}

function renderInventory(cars) {
    const container = document.getElementById('cars-grid');
    const status = document.getElementById('inventory-status');

    if (!container) return;

    if (!cars || cars.length === 0) {
        container.innerHTML = '';
        if (status) {
            status.textContent = 'No inventory records are available yet. Add rows to the cars table in Supabase.';
            status.className = 'inventory-status warning';
        }
        renderFallbackCars(container);
        return;
    }

    container.innerHTML = cars.map((car) => `
        <article class="car-card">
            <h3>${car.name}</h3>
            <p>${car.description || 'A remarkable luxury performance model.'}</p>
            <div class="car-meta">
                <span>Top Speed: ${car.top_speed || 'Available on request'}</span>
                <span>0-60 mph: ${car.acceleration || 'Available on request'}</span>
            </div>
        </article>
    `).join('');

    if (status) {
        status.textContent = 'Inventory loaded from Supabase.';
        status.className = 'inventory-status success';
    }
}

async function loadInventory() {
    const container = document.getElementById('cars-grid');
    const status = document.getElementById('inventory-status');

    if (!container || !status) return;

    if (!supabase) {
        status.textContent = 'Supabase is not configured yet. Add your project URL and anon key in script.js.';
        status.className = 'inventory-status warning';
        renderFallbackCars(container);
        return;
    }

    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false }).limit(6);

    if (error) {
        status.textContent = `Unable to load inventory: ${error.message}`;
        status.className = 'inventory-status warning';
        renderFallbackCars(container);
        return;
    }

    renderInventory(data);
}

window.addEventListener('DOMContentLoaded', async function() {
    PopupManager.init();
    PopupManager.info('Welcome!', 'Welcome to Exotic Car Dealership! Explore top exotic cars, featured models, and sign up for exclusive updates.');

    const form = document.getElementById('contact-form');
    const formErrorMessage = document.getElementById('form-error-message');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const inputs = form.querySelectorAll('input, select');
            let isValid = true;

            inputs.forEach((input) => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                formErrorMessage.classList.add('show');
                setFormStatus('Please complete the missing fields.', 'error');
                return;
            }

            formErrorMessage.classList.remove('show');
            setFormStatus('Saving your request to Supabase...', 'info');

            if (!supabase) {
                setFormStatus('Supabase is not configured yet. Add your project URL and anon key in script.js.', 'error');
                return;
            }

            const { error } = await supabase.from('contacts').insert([{
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                gender: document.getElementById('gender').value
            }]);

            if (error) {
                setFormStatus(`Submission failed: ${error.message}`, 'error');
                return;
            }

            setFormStatus('Your request was saved successfully.', 'success');
            const name = document.getElementById('name').value.trim();
            PopupManager.success('Success!', `Thank you, ${name}! Your contact request has been received.`, {
                onConfirm() {
                    form.reset();
                    inputs.forEach((input) => input.classList.remove('error'));
                    setFormStatus('', 'info');
                }
            });
        });
    }

    await loadInventory();
});
