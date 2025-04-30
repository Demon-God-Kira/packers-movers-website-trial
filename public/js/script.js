// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Form Validation (Example: Phone Number Format)
document.querySelector('form').addEventListener('submit', function(e) {
  const phoneInput = document.querySelector('input[name="phone"]');
  const phoneRegex = /^[0-9]{10}$/;

  if (phoneInput && !phoneRegex.test(phoneInput.value)) {
    e.preventDefault(); // Stop form submission
    alert('Please enter a valid 10-digit phone number.');
  }
});

// AOS (Animate On Scroll) Initialization
AOS.init({
  duration: 1000, // Animation duration
  easing: 'ease-in-out', // Animation easing
  once: true, // Whether animation should happen only once
});

// Example of Show/Hide Content on Click
document.querySelector('.toggle-btn')?.addEventListener('click', function() {
  const content = document.querySelector('.toggle-content');
  if (content) {
    content.classList.toggle('hidden');
  }
});

// Dynamic Update of Order Status (Example)
const statusButtons = document.querySelectorAll('.order-status-btn');
if (statusButtons) {
  statusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      const newStatus = this.getAttribute('data-status');

      // Simulate an API call to update status
      console.log(`Updating order #${orderId} status to: ${newStatus}`);
      // Here you would send the new status to the server
      // e.g., using fetch or axios
    });
  });
}

// Sticky Navbar on Scroll (Optional)
window.onscroll = function() {
  const navbar = document.querySelector('header');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }
};

// Example of Dynamic Pricing Calculation (Optional)
const weightInput = document.querySelector('input[name="weight"]');
const priceOutput = document.querySelector('#price-output');
if (weightInput && priceOutput) {
  weightInput.addEventListener('input', function() {
    const weight = parseFloat(weightInput.value);
    if (weight > 0) {
      // Calculate price based on weight
      const price = weight * 10; // Example pricing model
      priceOutput.textContent = `Estimated Price: $${price.toFixed(2)}`;
    } else {
      priceOutput.textContent = 'Enter a valid weight';
    }
  });
}
