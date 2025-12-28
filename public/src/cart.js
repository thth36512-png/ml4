// public/src/cart.js
$(document).ready(function() {
  loadCart();
  
  function loadCart() {
    $.ajax({
      url: '/api/v1/cart/view',
      method: 'GET',
      success: function(items) {
        displayCart(items);
      },
      error: function() {
        $('#emptyCart').removeClass('d-none');
      }
    });
  }
  
  function displayCart(items) {
    if (items.length === 0) {
      $('#emptyCart').removeClass('d-none');
      $('#orderSection').addClass('d-none');
      return;
    }
    
    let html = '<table class="table"><thead><tr><th>Item</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Actions</th></tr></thead><tbody>';
    let total = 0;
    
    items.forEach(function(item) {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      
      html += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <i class="glyphicon glyphicon-cutlery me-2 text-muted"></i>
              ${item.itemName}
            </div>
          </td>
          <td>$${item.price}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.cartId}, ${item.quantity - 1})"><i class="glyphicon glyphicon-minus"></i></button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.cartId}, ${item.quantity + 1})"><i class="glyphicon glyphicon-plus"></i></button>
          </td>
          <td>$${subtotal.toFixed(2)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="removeItem(${item.cartId})"><i class="glyphicon glyphicon-trash"></i></button></td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    $('#cartContainer').html(html);
    $('#totalPrice').text(total.toFixed(2));
    $('#orderSection').removeClass('d-none');
  }
});

function updateQuantity(cartId, quantity) {
  if (quantity < 1) return;
  
  $.ajax({
    url: `/api/v1/cart/edit/${cartId}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({ quantity }),
    success: function() {
      location.reload();
    }
  });
}

function removeItem(cartId) {
  $.ajax({
    url: `/api/v1/cart/delete/${cartId}`,
    method: 'DELETE',
    success: function() {
      location.reload();
    }
  });
}

function placeOrder() {
  const pickupTime = $('#pickupTime').val();
  
  if (!pickupTime) {
    alert('Please select a pickup time');
    return;
  }
  
  $.ajax({
    url: '/api/v1/order/new',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ scheduledPickupTime: pickupTime }),
    success: function() {
      alert('Order placed successfully!');
      window.location.href = '/myOrders';
    },
    error: function(xhr) {
      alert(xhr.responseJSON?.error || 'Failed to place order');
    }
  });
}
