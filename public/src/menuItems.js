$(document).ready(function() {
  loadMenuItems();
  
  function loadMenuItems() {
    $.ajax({
      url: '/api/v1/menuItem/view',
      method: 'GET',
      success: function(items) {
        displayMenuItems(items);
      },
      error: function() {
        $('#menuContainer').html('<div class="alert alert-danger">Failed to load menu items</div>');
      }
    });
  }
  
  function displayMenuItems(items) {
    if (items.length === 0) {
      $('#menuContainer').html('<div class="alert alert-info">No menu items yet. <a href="/addMenuItem">Add one now</a></div>');
      return;
    }
    
    let html = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    items.forEach(function(item) {
      html += `
        <tr>
          <td>${item.itemId}</td>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.description || '-'}</td>
          <td>$${parseFloat(item.price).toFixed(2)}</td>
          <td><span class="badge bg-success">${item.status}</span></td>
          <td>
            <button class="btn btn-sm btn-info" onclick="viewItem(${item.itemId})" title="View Details"><i class="glyphicon glyphicon-eye-open"></i></button>
            <button class="btn btn-sm btn-warning" onclick="editItem(${item.itemId})" title="Edit Item"><i class="glyphicon glyphicon-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.itemId})" title="Delete Item"><i class="glyphicon glyphicon-trash"></i></button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    $('#menuContainer').html(html);
  }
  
  // Edit form submission
  $('#editForm').submit(function(e) {
    e.preventDefault();
    
    const itemId = $('#editItemId').val();
    const data = {
      name: $('#editName').val(),
      category: $('#editCategory').val(),
      description: $('#editDescription').val(),
      price: parseFloat($('#editPrice').val())
    };
    
    $.ajax({
      url: `/api/v1/menuItem/edit/${itemId}`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function() {
        $('#editModal').modal('hide');
        alert('Item updated successfully!');
        loadMenuItems();
      },
      error: function() {
        alert('Failed to update item');
      }
    });
  });
});

function viewItem(itemId) {
  $.ajax({
    url: `/api/v1/menuItem/view/${itemId}`,
    method: 'GET',
    success: function(item) {
      let message = `Name: ${item.name}\n`;
      message += `Category: ${item.category}\n`;
      message += `Price: $${parseFloat(item.price).toFixed(2)}\n`;
      message += `Description: ${item.description || 'N/A'}\n`;
      message += `Status: ${item.status}`;
      alert(message);
    }
  });
}

function editItem(itemId) {
  $.ajax({
    url: `/api/v1/menuItem/view/${itemId}`,
    method: 'GET',
    success: function(item) {
      $('#editItemId').val(item.itemId);
      $('#editName').val(item.name);
      $('#editCategory').val(item.category);
      $('#editDescription').val(item.description);
      $('#editPrice').val(item.price);
      $('#editModal').modal('show');
    }
  });
}

function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  $.ajax({
    url: `/api/v1/menuItem/delete/${itemId}`,
    method: 'DELETE',
    success: function() {
      alert('Item deleted successfully!');
      location.reload();
    },
    error: function() {
      alert('Failed to delete item');
    }
  });
}