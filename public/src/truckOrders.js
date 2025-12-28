let allOrders = [];

$(document).ready(function() {
  loadOrders();
});

function loadOrders() {
  $.ajax({
    url: '/api/v1/order/truckOrders',
    method: 'GET',
    success: function(orders) {
      allOrders = orders;
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
  
  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Total</th>
          <th>Pickup Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  orders.forEach(function(order) {
    const statusClass = getStatusClass(order.orderStatus);
    const pickupTime = order.scheduledPickupTime ? 
      new Date(order.scheduledPickupTime).toLocaleString() : 'Not specified';
    
    html += `
      <tr>
        <td>#${order.orderId}</td>
        <td>${order.customerName}</td>
        <td><span class="badge bg-${statusClass}">${order.orderStatus}</span></td>
        <td>$${parseFloat(order.totalPrice).toFixed(2)}</td>
        <td>${pickupTime}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${order.orderId})" title="View Details"><i class="glyphicon glyphicon-eye-open"></i></button>
          <select class="form-select form-select-sm d-inline-block w-auto ms-2" 
                  onchange="updateOrderStatus(${order.orderId}, this.value)">
            <option value="">Update Status</option>
            <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="preparing" ${order.orderStatus === 'preparing' ? 'selected' : ''}>Preparing</option>
            <option value="ready" ${order.orderStatus === 'ready' ? 'selected' : ''}>Ready</option>
            <option value="completed" ${order.orderStatus === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  $('#ordersContainer').html(html);
}

function filterOrders(status) {
  // Update active tab
  $('#orderTabs .nav-link').removeClass('active');
  $(`#orderTabs .nav-link[data-filter="${status}"]`).addClass('active');
  
  if (status === 'all') {
    displayOrders(allOrders);
  } else {
    const filtered = allOrders.filter(o => o.orderStatus === status);
    displayOrders(filtered);
  }
}

function getStatusClass(status) {
  const statusMap = {
    'pending': 'warning',
    'preparing': 'info',
    'ready': 'success',
    'completed': 'secondary',
    'cancelled': 'danger'
  };
  return statusMap[status] || 'secondary';
}

function viewOrderDetails(orderId) {
  $.ajax({
    url: `/api/v1/order/truckOwner/${orderId}`,
    method: 'GET',
    success: function(order) {
      let html = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Order #${order.orderId} Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>Status:</strong> <span class="badge bg-${getStatusClass(order.orderStatus)}">${order.orderStatus}</span></p>
                <p><strong>Total:</strong> $${parseFloat(order.totalPrice).toFixed(2)}</p>
                <p><strong>Pickup Time:</strong> ${new Date(order.scheduledPickupTime).toLocaleString()}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <h6 class="mt-3">Items:</h6>
                <ul class="list-group">
      `;
      
      order.items.forEach(function(item) {
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.itemName} x${item.quantity}
            <span class="badge bg-primary rounded-pill">$${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        `;
      });
      
      html += `
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Remove existing modal if any
      $('#orderDetailsModal').remove();
      
      // Add modal to body and show
      $('body').append(html);
      const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
      modal.show();
    },
    error: function() {
      alert('Failed to load order details');
    }
  });
}

function updateOrderStatus(orderId, newStatus) {
  if (!newStatus) return;
  
  // Find current status to avoid unnecessary updates
  const order = allOrders.find(o => o.orderId === orderId);
  if (order && order.orderStatus === newStatus) {
    return;
  }
  
  if (!confirm(`Update order #${orderId} status to "${newStatus}"?`)) {
    // Reset select to current value
    location.reload();
    return;
  }
  
  $.ajax({
    url: `/api/v1/order/updateStatus/${orderId}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({ orderStatus: newStatus }),
    success: function() {
      alert('Order status updated successfully!');
      loadOrders();
    },
    error: function(xhr) {
      alert(xhr.responseJSON?.error || 'Failed to update order status');
      location.reload();
    }
  });
}