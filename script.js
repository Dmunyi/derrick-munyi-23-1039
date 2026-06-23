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

        // Reset modal classes
        this.modal.className = 'popup-modal show';
        this.modal.classList.add(`popup-${type}`);

        // Handle buttons
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

window.addEventListener('DOMContentLoaded', function() {
    PopupManager.init();

    // Welcome popup
    PopupManager.info('Welcome!', 'Welcome to Exotic Car Dealership! Explore top exotic cars, featured models, and sign up for exclusive updates.');

    const contactSection = document.createElement('section');
    contactSection.id = 'contact-form-section';
    contactSection.innerHTML = `
        <h2>Contact Us</h2>
        <p>Share your details to receive exclusive offers and the latest updates on exotic cars.</p>
        <form id="contact-form">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@gmail.com" required>

            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>

            <label for="gender">Gender</label>
            <select id="gender" name="gender" required>
                <option value="" disabled selected>Select your gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
            </select>

            <button type="submit">Submit</button>
        </form>
    `;

    document.body.appendChild(contactSection);

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        PopupManager.success('Success!', `Thank you, ${name}! Your contact request has been received.`, {
            onConfirm() {
                form.reset();
            }
        });
    });
});
