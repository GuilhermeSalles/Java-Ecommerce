// ====================================
// AUTH PAGES FUNCTIONALITY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Password Toggle Functionality
    initPasswordToggle();

    // Password Requirements Validation (for signup page)
    initPasswordValidation();

    // Phone Mask
    initPhoneMask();
});

// Password Toggle Functionality
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password Requirements Validation
function initPasswordValidation() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const requirements = document.getElementById('password-requirements');
    
    if (!passwordField || !requirements) return;
    
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        
        // Check length
        validateRequirement(reqLength, password.length >= 8);
        
        // Check uppercase
        validateRequirement(reqUppercase, /[A-Z]/.test(password));
        
        // Check number
        validateRequirement(reqNumber, /\d/.test(password));
        
        // Check special character
        validateRequirement(reqSpecial, /[!@#$%^&*(),.?":{}|<>]/.test(password));
        
        // Validate confirm password if it has value
        if (confirmPasswordField && confirmPasswordField.value) {
            validatePasswordMatch();
        }
    });
    
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', validatePasswordMatch);
    }
    
    function validateRequirement(element, isValid) {
        const icon = element.querySelector('i');
        if (isValid) {
            element.classList.add('valid');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-check');
        } else {
            element.classList.remove('valid');
            icon.classList.remove('fa-check');
            icon.classList.add('fa-times');
        }
    }
    
    function validatePasswordMatch() {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        
        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordField.setCustomValidity('As senhas não coincidem');
            confirmPasswordField.classList.add('error');
        } else {
            confirmPasswordField.setCustomValidity('');
            confirmPasswordField.classList.remove('error');
        }
    }
}

// Phone Mask
function initPhoneMask() {
    const phoneField = document.getElementById('phone');
    if (!phoneField) return;

    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        if (value.length >= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length >= 1) {
            value = value.replace(/(\d{0,2})/, '($1');
        }

        e.target.value = value;
    });
}
