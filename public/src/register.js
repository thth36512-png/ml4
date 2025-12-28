$(document).ready(function() {
  $('#role').change(function() {
    if ($(this).val() === 'truckOwner') {
      $('#truckFields').removeClass('d-none');
      $('#truckName').attr('required', true);
    } else {
      $('#truckFields').addClass('d-none');
      $('#truckName').attr('required', false);
    }
  });
  
  $('#registerForm').submit(function(e) {
    e.preventDefault();
    
    const data = {
      name: $('#name').val().trim(),
      email: $('#email').val().trim(),
      password: $('#password').val(),
      birthDate: $('#birthDate').val(),
      role: $('#role').val()
    };
    
    // Validation
    if (!data.name || !data.email || !data.password || !data.birthDate) {
      showError('Please fill in all required fields');
      return;
    }
    
    if (data.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    if (!isValidEmail(data.email)) {
      showError('Please enter a valid email address');
      return;
    }
    
    if (data.role === 'truckOwner') {
      data.truckName = $('#truckName').val().trim();
      if (!data.truckName) {
        showError('Please enter a truck name');
        return;
      }
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
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
