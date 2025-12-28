// public/src/login.js
$(document).ready(function() {
  $('#loginForm').submit(function(e) {
    e.preventDefault();
    
    const email = $('#email').val();
    const password = $('#password').val();
    
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }
    
    $.ajax({
      url: '/api/v1/user/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function(response) {
        console.log('Login response received:', response);
        console.log('User role:', response.user ? response.user.role : 'User undefined');
        
        if (response.user && response.user.role === 'customer') {
          console.log('Redirecting to customer dashboard...');
          window.location.href = '/dashboard';
        } else if (response.user && response.user.role === 'truckOwner') {
          console.log('Redirecting to owner dashboard...');
          window.location.href = '/ownerDashboard';
        } else {
          console.error('Unknown role or invalid response structure:', response);
          showError('Login successful but role is unknown.');
        }
      },
      error: function(xhr) {
        console.error('Login error:', xhr);
        showError(xhr.responseJSON?.error || 'Login failed');
      }
    });
  });
  
  function showError(message) {
    $('#errorMessage').text(message).removeClass('d-none');
  }
});

// public/src/register.js
$(document).ready(function() {
  $('#role').change(function() {
    if ($(this).val() === 'truckOwner') {
      $('#truckFields').removeClass('d-none');
    } else {
      $('#truckFields').addClass('d-none');
    }
  });
  
  $('#registerForm').submit(function(e) {
    e.preventDefault();
    
    const data = {
      name: $('#name').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      birthDate: $('#birthDate').val(),
      role: $('#role').val()
    };
    
    if (data.role === 'truckOwner') {
      data.truckName = $('#truckName').val();
    }
    
    $.ajax({
      url: '/api/v1/user',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function() {
        alert('Registration successful! Please login.');
        window.location.href = '/';
      },
      error: function(xhr) {
        showError(xhr.responseJSON?.error || 'Registration failed');
      }
    });
  });
  
  function showError(message) {
    $('#errorMessage').text(message).removeClass('d-none');
  }
});