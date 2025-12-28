// public/src/ownerDashboard.js
$(document).ready(function() {
  loadDashboard();
  
  function loadDashboard() {
    // Load truck info
    $.ajax({
      url: '/api/v1/trucks/myTruck',
      method: 'GET',
      success: function(truck) {
        $('#truckName').text(truck.truckName);
        $('#truckStatus').text(truck.orderStatus);
      }
    });
    
    // Load statistics
    $.ajax({
      url: '/api/v1/order/truckOrders',
      method: 'GET',
      success: function(orders) {
        const pending = orders.filter(o => o.orderStatus === 'pending').length;
        const completed = orders.filter(o => o.orderStatus === 'completed').length;
        
        $('#pendingOrders').text(pending);
        $('#completedOrders').text(completed);
      }
    });
  }
  
  $('#orderStatusToggle').change(function() {
    const status = $(this).is(':checked') ? 'available' : 'unavailable';
    
    $.ajax({
      url: '/api/v1/trucks/updateOrderStatus',
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ orderStatus: status }),
      success: function() {
        alert('Status updated successfully!');
      }
    });
  });
});