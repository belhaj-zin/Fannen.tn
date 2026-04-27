document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('signin-form');
    const requestedRole = new URLSearchParams(window.location.search).get('role');

    if (requestedRole === 'artisan' || requestedRole === 'user') {
        const roleRadio = document.querySelector(`input[name="role"][value="${requestedRole}"]`);
        if (roleRadio) roleRadio.checked = true;
    }

    if (!signInForm) return;

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!signInForm.checkValidity()) {
            signInForm.reportValidity();
            return;
        }

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