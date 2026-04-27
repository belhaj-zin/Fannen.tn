document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('login-form');
    
    // Quick mock for tabs (just visual for now)
    const loginTab = document.getElementById('btn-show-login');
    const registerTab = document.getElementById('btn-show-register');
    const formTitle = document.querySelector('.auth-box h3');
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            if (formTitle) formTitle.textContent = 'Sign In';
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            if (formTitle) formTitle.textContent = 'Register';
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const roleInput = document.querySelector('input[name="role"]:checked');
            // If no radio is checked, default to artisan for demonstration if email contains 'artisan'
            let role = 'user';
            if (roleInput) {
                role = roleInput.value;
            } else {
                const email = document.getElementById('email').value;
                if (email.includes('artisan')) role = 'artisan';
            }
            
            const authState = {
                isLoggedIn: true,
                role: role,
                userId: 'user-' + Math.floor(Math.random() * 1000)
            };
            
            localStorage.setItem('fannen_auth_state', JSON.stringify(authState));
            
            if (role === 'artisan') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = '../index.html';
            }
        });
    }
});
