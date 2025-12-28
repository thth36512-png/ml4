// public/src/truckMenu.js
$(document).ready(function() {
  const truckId = $('#truckId').val();
  
  loadMenu(truckId);
  
  $('#categoryFilter').change(function() {
    const category = $(this).val();
    if (category) {
      loadMenuByCategory(truckId, category);
    } else {
      loadMenu(truckId);
    }
  });
  
  function loadMenu(truckId) {
    $.ajax({
      url: `/api/v1/menuItem/truck/${truckId}`,
      method: 'GET',
      success: function(items) {
        populateCategories(items);
        displayMenu(items);
      },
      error: function() {
        $('#menuContainer').html('<div class="alert alert-danger">Failed to load menu</div>');
      }
    });
  }
  
  function loadMenuByCategory(truckId, category) {
    $.ajax({
      url: `/api/v1/menuItem/truck/${truckId}/category/${category}`,
      method: 'GET',
      success: function(items) {
        displayMenu(items);
      }
    });
  }
  
  function populateCategories(items) {
    const categories = [...new Set(items.map(item => item.category))];
    categories.forEach(function(category) {
      $('#categoryFilter').append(`<option value="${category}">${category}</option>`);
    });
  }
  
  function displayMenu(items) {
    if (items.length === 0) {
      $('#menuContainer').html('<div class="alert alert-info">No items available</div>');
      return;
    }
    
    let html = '';
    items.forEach(function(item) {
      html += `
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="text-center mb-3">
                <i class="glyphicon glyphicon-cutlery" style="font-size: 2rem; color: var(--accent-color);"></i>
              </div>
              <h5 class="card-title text-center font-weight-bold">${item.name}</h5>
              <p class="card-text text-muted text-center small">${item.description || 'No description available.'}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="h5 text-primary mb-0">$${item.price}</span>
                <span class="badge bg-light text-dark border">${item.category}</span>
              </div>
              <div class="input-group mt-3">
                <input type="number" class="form-control" id="qty-${item.itemId}" value="1" min="1">
                <button class="btn btn-primary" onclick="addToCart(${item.itemId}, ${item.price})">
                  <i class="glyphicon glyphicon-plus"></i> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    $('#menuContainer').html(html);
  }
});

function addToCart(itemId, price) {
  const quantity = parseInt($('#qty-' + itemId).val());
  
  $.ajax({
    url: '/api/v1/cart/new',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ itemId, quantity, price }),
    success: function() {
      alert('Item added to cart!');
    },
    error: function(xhr) {
      alert(xhr.responseJSON?.error || 'Failed to add to cart');
    }
  });
}
