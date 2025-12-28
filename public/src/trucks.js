// public/src/trucks.js
$(document).ready(function() {
  loadTrucks();
  
  function loadTrucks() {
    $.ajax({
      url: '/api/v1/trucks/view',
      method: 'GET',
      success: function(trucks) {
        displayTrucks(trucks);
      },
      error: function() {
        $('#trucksContainer').html('<div class="alert alert-danger">Failed to load trucks</div>');
      }
    });
  }
  
  function displayTrucks(trucks) {
    if (trucks.length === 0) {
      $('#trucksContainer').html('<div class="alert alert-info">No trucks available</div>');
      return;
    }
    
    let html = '';
    trucks.forEach(function(truck) {
      html += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 text-center">
            <div class="card-body">
              <i class="glyphicon glyphicon-road" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
              <h5 class="card-title font-weight-bold">${truck.truckName}</h5>
              <p class="card-text mb-3">Status: <span class="badge bg-success">${truck.orderStatus}</span></p>
              <a href="/truckMenu/${truck.truckId}" class="btn btn-primary d-block">View Menu</a>
            </div>
          </div>
        </div>
      `;
    });
    $('#trucksContainer').html(html);
  }
});