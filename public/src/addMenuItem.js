$(document).ready(function() {
  $('#addItemForm').submit(function(e) {
    e.preventDefault();
    
    const data = {
      name: $('#name').val(),
      category: $('#category').val(),
      description: $('#description').val(),
      price: parseFloat($('#price').val())
    };
    
    // Validate
    if (!data.name || !data.category || !data.price) {
      showError('Please fill in all required fields');
      return;
    }
    
    if (data.price <= 0) {
      showError('Price must be greater than 0');
      return;
    }
    
    $.ajax({
      url: '/api/v1/menuItem/new',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function() {
        alert('Menu item added successfully!');
        window.location.href = '/menuItems';
      },
      error: function(xhr) {
        showError(xhr.responseJSON?.error || 'Failed to add menu item');
      }
    });
  });
  
  function showError(message) {
    $('#errorMessage').text(message).removeClass('d-none');
  }
});
