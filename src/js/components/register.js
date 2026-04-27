document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const phoneInput = document.getElementById('phone');
    const termsInput = document.getElementById('terms');
    const message = document.getElementById('register-form-message');

    if (!registerForm) return;

    if (phoneInput) {
        // Keep only digits while typing.
        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, '');
        });
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (message) message.textContent = '';

        const isPhoneValid = phoneInput ? /^\d+$/.test(phoneInput.value.trim()) : true;
        const isTermsChecked = termsInput ? termsInput.checked : false;

        if (!registerForm.checkValidity() || !isPhoneValid || !isTermsChecked) {
            if (message) message.textContent = 'All the terms should be filled.';
            if (phoneInput && !isPhoneValid) {
                phoneInput.setCustomValidity('Phone number should contain only numbers.');
            } else if (phoneInput) {
                phoneInput.setCustomValidity('');
            }
            registerForm.reportValidity();
            return;
        }

        if (phoneInput) phoneInput.setCustomValidity('');

        const roleInput = document.querySelector('input[name="role"]:checked');
        const role = roleInput ? roleInput.value : 'user';

        const authState = {
            isLoggedIn: true,
            role,
            userId: 'user-' + Math.floor(Math.random() * 1000)
        };

        localStorage.setItem('fannen_auth_state', JSON.stringify(authState));
        window.location.href = '../index.html';
    });
});