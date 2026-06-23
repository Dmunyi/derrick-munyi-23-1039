window.addEventListener('DOMContentLoaded', function() {
    alert('Welcome to Exotic Car Dealership! Explore top exotic cars, featured models, and sign up for exclusive updates.');

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
        alert(`Thank you, ${name}! Your contact request has been received.`);
        form.reset();
    });
});
