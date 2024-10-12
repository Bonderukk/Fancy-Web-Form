document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const confirmBooking = document.getElementById('confirmBooking');
    const birthdateInput = document.getElementById('birthdate');
    const ageInput = document.getElementById('age');
    const facilitySelect = document.getElementById('facility');
    const sportSelect = document.getElementById('sport');
    const equipmentSelect = document.getElementById('equipment');
    const otherCheckbox = document.getElementById('other');
    const otherServiceInput = document.getElementById('otherService');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const phoneInput = document.getElementById('phone');
    const commentsTextarea = document.getElementById('comments');

    // Calculate age based on birthdate
    birthdateInput.addEventListener('change', function() {
        const birthdate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }
        
        ageInput.value = age >= 0 ? age : '';
    });

    // Cascading dropdowns
    const sportOptions = {
        indoor: ['Basketball', 'Volleyball', 'Badminton'],
        outdoor: ['Football', 'Tennis', 'Athletics']
    };

    const equipmentOptions = {
        Basketball: ['Basketball', 'Hoop'],
        Volleyball: ['Volleyball', 'Net'],
        Badminton: ['Racket', 'Shuttlecock'],
        Football: ['Football', 'Goal'],
        Tennis: ['Tennis Racket', 'Tennis Ball'],
        Athletics: ['Javelin', 'Shot Put']
    };

    facilitySelect.addEventListener('change', function() {
        sportSelect.innerHTML = '<option value="">Select Sport</option>';
        equipmentSelect.innerHTML = '<option value="">Select Equipment</option>';
        if (this.value) {
            sportOptions[this.value].forEach(sport => {
                const option = document.createElement('option');
                option.value = sport;
                option.textContent = sport;
                sportSelect.appendChild(option);
            });
        }
    });

    sportSelect.addEventListener('change', function() {
        equipmentSelect.innerHTML = '<option value="">Select Equipment</option>';
        if (this.value) {
            equipmentOptions[this.value].forEach(equipment => {
                const option = document.createElement('option');
                option.value = equipment;
                option.textContent = equipment;
                equipmentSelect.appendChild(option);
            });
        }
    });

    // Show/hide other service input
    otherCheckbox.addEventListener('change', function() {
        otherServiceInput.style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            updateCharCount(otherServiceInput);
        }
    });

    // Form submission and modal display
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        if (validateForm()) {
            console.log('Form is valid');
            displaySummary();
            modal.style.display = 'block';
            console.log('Modal should be visible now');
        } else {
            console.log('Form is invalid');
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    confirmBooking.addEventListener('click', function() {
        // ... existing confirmation logic ...

        // After successful booking confirmation
        alert('Booking confirmed!');
        modal.style.display = 'none';
        document.getElementById('bookingForm').reset(); // Reset the form
        
        // Reset character counters
        resetCharCounters();
        
        // Additional reset for checkboxes and their associated inputs
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const associatedInput = document.getElementById(checkbox.id + 'Price');
            if (associatedInput) {
                associatedInput.value = '';
                associatedInput.disabled = true;
            }
        });

        // Reset other dynamic elements (e.g., age, price)
        document.getElementById('age').value = '';
        document.getElementById('price').value = '';

        // Hide the 'Other' service input if it was visible
        document.getElementById('otherService').style.display = 'none';
    });

    emailInput.addEventListener('input', validateEmail);

    phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
        
        // Truncate to 9 digits if longer
        if (this.value.length > 9) {
            this.value = this.value.slice(0, 9);
        }
        
        // Validate phone number
        if (this.value.length !== 9) {
            phoneError.textContent = 'Phone number must be exactly 9 digits.';
            this.setCustomValidity('Invalid phone number');
        } else {
            phoneError.textContent = '';
            this.setCustomValidity('');
        }
    });

    function validateEmail() {
        const email = emailInput.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address (e.g., user@example.com)';
            emailInput.setCustomValidity('Invalid email format');
        } else {
            emailError.textContent = '';
            emailInput.setCustomValidity('');
        }
    }

    function validatePhone() {
        const phone = phoneInput.value;
        const phoneError = document.getElementById('phoneError');
        
        if (phone.length !== 9) {
            phoneError.textContent = 'Phone number must be exactly 9 digits.';
            phoneInput.setCustomValidity('Invalid phone number');
        } else {
            phoneError.textContent = '';
            phoneInput.setCustomValidity('');
        }
    }

    // Update the validateForm function
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, 'This field is required.');
                isValid = false;
            } else {
                clearError(input);
            }

            // Add specific validations for each field
            switch(input.id) {
                case 'email':
                    validateEmail();
                    break;
                case 'phone':
                    validatePhone();
                    break;
                // Add more cases for other fields that need specific validation
            }
        });

        return isValid;
    }

    function displaySummary() {
        console.log('Displaying summary');
        const summary = document.getElementById('summary');
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(service => service.value);
        
        let servicesText = selectedServices.length > 0 ? selectedServices.filter(service => service !== 'other').join(', ') : 'None';
        
        if (otherCheckbox.checked && otherServiceInput.value) {
            servicesText += servicesText !== 'None' ? ', ' : '';
            servicesText += `Other: ${otherServiceInput.value}`;
        }

        // Function to truncate text
        function truncateText(text, maxLength) {
            if (text.length > maxLength) {
                return text.substring(0, maxLength);
            }
            return text;
        }

        // Truncate long texts
        const truncatedServices = truncateText(servicesText, 100);
        const truncatedComments = truncateText(form.comments.value || 'None', 100);

        summary.innerHTML = `
            <p><strong>Name:</strong><span>${form.name.value} ${form.surname.value}</span></p>
            <p><strong>Gender:</strong><span>${form.gender.value}</span></p>
            <p><strong>Date of Birth:</strong><span>${form.birthdate.value}</span></p>
            <p><strong>Age:</strong><span>${form.age.value}</span></p>
            <p><strong>Email:</strong><span>${form.email.value}</span></p>
            <p><strong>Phone:</strong><span>${form.phonePrefix.value}${form.phone.value}</span></p>
            <p><strong>Facility:</strong><span>${form.facility.value}</span></p>
            <p><strong>Sport:</strong><span>${form.sport.value}</span></p>
            <p><strong>Equipment:</strong><span>${form.equipment.value}</span></p>
            <p><strong>Additional Services:</strong><span>${truncatedServices}</span></p>
            <p><strong>Comments:</strong><span>${truncatedComments}</span></p>
        `;
    }

    // Add this to your existing JavaScript file

    const revealNameBtn = document.getElementById('revealNameBtn');
    const hiddenNameInput = document.getElementById('hiddenName');

    revealNameBtn.addEventListener('click', function() {
        if (hiddenNameInput.style.display === 'none') {
            hiddenNameInput.style.display = 'inline-block';
            revealNameBtn.textContent = 'Hide Name';
        } else {
            hiddenNameInput.style.display = 'none';
            revealNameBtn.textContent = 'Reveal Hidden Name';
        }
    });

    // Initialize character counts using existing spans
    const inputsWithCharCount = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    inputsWithCharCount.forEach(input => {
        const charCountSpan = input.parentElement.querySelector('.char-count');
        const maxLength = input.getAttribute('maxlength');

        if (charCountSpan && maxLength) {
            // Initialize the character count on page load
            charCountSpan.textContent = `${input.value.length} / ${maxLength}`;

            // Update character count on input
            input.addEventListener('input', function() {
                charCountSpan.textContent = `${this.value.length} / ${maxLength}`;
            });
        }
    });

    // Enable/disable price inputs based on checkbox state
    const serviceCheckboxes = document.querySelectorAll('input[type="checkbox"][name="services"]');
    serviceCheckboxes.forEach(checkbox => {
        const priceInput = document.getElementById(`${checkbox.id}Price`);
        checkbox.addEventListener('change', function() {
            priceInput.disabled = !this.checked;
            if (!this.checked) {
                priceInput.value = '';
            }
        });
    });

    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.className === 'error') {
            errorElement.textContent = message;
        }
        input.style.borderColor = 'red';
    }

    function clearError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.className === 'error') {
            errorElement.textContent = '';
        }
        input.style.borderColor = '';
    }

    function validatePhone(phone) {
        const re = /^\d{9}$/;  // Assumes 9-digit phone number
        return re.test(phone);
    }

    const durationInput = document.getElementById('duration');
    const priceInput = document.getElementById('price');
    const peopleCountInput = document.getElementById('peopleCount');

    // Function to calculate price
    function calculatePrice() {
        const duration = parseInt(durationInput.value) || 0;
        const peopleCount = parseInt(peopleCountInput.value) || 1;
        const basePrice = 10; // Base price per hour
        const price = duration * basePrice * peopleCount;
        priceInput.value = price.toFixed(2);
    }

    // Add event listeners to recalculate price when duration or people count changes
    durationInput.addEventListener('input', calculatePrice);
    peopleCountInput.addEventListener('input', calculatePrice);

    function updateCharCount(input) {
        const maxLength = input.getAttribute('maxlength');
        const currentLength = input.value.length;
        const charCountSpan = input.parentElement.querySelector('.char-count');
        
        if (charCountSpan && maxLength) {
            charCountSpan.textContent = `${currentLength} / ${maxLength}`;
        }
    }

    // Initialize character counts using existing spans
    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
        const charCountSpan = input.parentElement.querySelector('.char-count');
        if (charCountSpan && input.getAttribute('maxlength')) {
            input.addEventListener('input', function() {
                updateCharCount(this);
            });
            // Initialize character count on page load
            updateCharCount(input);
        }
    });

    // Function to reset char count for phone input (if needed)
    function removePhoneCharCount() {
        const phoneInput = document.getElementById('phone');
        const phoneInputContainer = phoneInput.closest('.form-group');
        const charCount = phoneInputContainer.querySelector('.char-count');
        if (charCount) {
            charCount.remove();
        }
    }

    // Call this function after the DOM is loaded
    removePhoneCharCount();

    // Function to reset character counters
    function resetCharCounters() {
        const inputsWithCharCount = document.querySelectorAll('input[maxlength], textarea[maxlength]');
        inputsWithCharCount.forEach(input => {
            const charCountSpan = input.parentElement.querySelector('.char-count');
            if (charCountSpan && input.getAttribute('maxlength')) {
                charCountSpan.textContent = `0 / ${input.getAttribute('maxlength')}`;
            }
        });
    }

    // Add event listeners for character count updates (redundant if already handled above)
    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
        input.addEventListener('input', function() {
            updateCharCount(this);
        });
    });

    // ... rest of your existing code ...
});