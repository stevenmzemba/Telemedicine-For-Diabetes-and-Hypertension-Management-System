function init(document) {
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-calculate age from date of birth
        document.addEventListener('change', function(e) {
            if (e.target.name === 'date_of_birth') {
                const dob = new Date(e.target.value);
                const today = new Date();
                const age = today.getFullYear() - dob.getFullYear();

                // Find the age input field
                const ageInput = e.target.form?.querySelector('input[name="age"]');
                if (ageInput && !isNaN(age)) {
                    ageInput.value = age;
                }
            }
        });

        // Close modal when clicking overlay
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.remove();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.active');
                if (modal) {
                    modal.remove();
                }
            }
        });

        console.log('Telemedicine System initialized');
    });
}

module.exports = init;
