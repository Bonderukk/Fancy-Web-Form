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
    });

    // Form submission and modal display
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            displaySummary();
            modal.style.display = 'block';
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    confirmBooking.addEventListener('click', function() {
        // Here you would typically send the form data to a server
        alert('Booking confirmed!');
        modal.style.display = 'none';
        form.reset();
    });

    function validateForm() {
        // Add your form validation logic here
        return true; // Return true if form is valid, false otherwise
    }

    function displaySummary() {
        const summary = document.getElementById('summary');
        summary.innerHTML = `
            <p><strong>Name:</strong> ${form.name.value} ${form.surname.value}</p>
            <p><strong>Gender:</strong> ${form.gender.value}</p>
            <p><strong>Date of Birth:</strong> ${form.birthdate.value}</p>
            <p><strong>Age:</strong> ${form.age.value}</p>
            <p><strong>Email:</strong> ${form.email.value}</p>
            <p><strong>Phone:</strong> ${form.phonePrefix.value}${form.phone.value}</p>
            <p><strong>Facility:</strong> ${form.facility.value}</p>
            <p><strong>Sport:</strong> ${form.sport.value}</p>
            <p><strong>Equipment:</strong> ${form.equipment.value}</p>
        `;
    }
});