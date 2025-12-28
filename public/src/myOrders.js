// public/src/myOrders.js
$(document).ready(function() {
  loadOrders();
  
  function loadOrders() {
    $.ajax({
      url: '/api/v1/order/myOrders',
      method: 'GET',
      success: function(orders) {
        displayOrders(orders);
      },
      error: function() {
        $('#ordersContainer').html('<div class="alert alert-danger">Failed to load orders</div>');
      }
    });
  }
  
  function displayOrders(orders) {
    if (orders.length === 0) {
      $('#ordersContainer').html('<div class="alert alert-info">No orders yet</div>');
      return;
    }
    
    let html = '<table class="table"><thead><tr><th>Order ID</th><th>Truck</th><th>Status</th><th>Total</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
    
    orders.forEach(function(order) {
      const statusClass = getStatusClass(order.orderStatus);
      html += `
        <tr>
          <td>#${order.orderId}</td>
          <td>${order.truckName}</td>
          <td><span class="badge bg-${statusClass}">${order.orderStatus}</span></td>
          <td>$${order.totalPrice}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td><button class="btn btn-sm btn-info" onclick="viewDetails(${order.orderId})" title="View Details"><i class="glyphicon glyphicon-eye-open"></i></button></td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    $('#ordersContainer').html(html);
  }
  
  function getStatusClass(status) {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'completed': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }
});

function viewDetails(orderId) {
  $.ajax({
    url: `/api/v1/order/details/${orderId}`,
    method: 'GET',
    success: function(order) {
      let html = `
        <div class="modal fade" id="orderModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Order #${order.orderId} Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>Truck:</strong> ${order.truckName}</p>
                <p><strong>Status:</strong> ${order.orderStatus}</p>
                <p><strong>Total:</strong> $${order.totalPrice}</p>
                <h6>Items:</h6>
                <ul>
      `;
      
      order.items.forEach(function(item) {
        html += `<li>${item.itemName} x${item.quantity} - $${item.price * item.quantity}</li>`;
      });
      
      html += `
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
      
      $('body').append(html);
      $('#orderModal').modal('show');
    }
  });
}