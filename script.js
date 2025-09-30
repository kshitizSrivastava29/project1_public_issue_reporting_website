// =============================
// Initialize map
// =============================
let map = L.map('map').setView([20.5937, 78.9629], 5); // Default: India center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

// =============================
// Get current location
// =============================
document.getElementById('useLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      document.getElementById('location').value = `${lat}, ${lng}`;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map)
               .bindPopup('Issue Location')
               .openPopup();

      map.setView([lat, lng], 15);
    }, () => alert('Unable to retrieve your location.'));
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// =============================
// Pin location on map click
// =============================
map.on('click', function(e) {
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);
  document.getElementById('location').value = `${lat}, ${lng}`;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng]).addTo(map)
           .bindPopup('Issue Location')
           .openPopup();
});

// =============================
// Handle form submission
// =============================
document.getElementById('issueForm').addEventListener('submit', e => {
  e.preventDefault();

  const issue = {
    type: document.getElementById('issueType').value,
    description: document.getElementById('description').value,
    photo: document.getElementById('photo').files[0] ? document.getElementById('photo').files[0].name : 'No photo',
    location: document.getElementById('location').value,
    timestamp: new Date().toLocaleString(),
    status: "Pending" // Default status
  };

  // Get existing issues or create empty array
  let issues = JSON.parse(localStorage.getItem('issues')) || [];

  // Add new issue
  issues.push(issue);

  // Save back to localStorage
  localStorage.setItem('issues', JSON.stringify(issues));

  alert('Issue submitted successfully!');
  document.getElementById('issueForm').reset();

  if (marker) {
    map.removeLayer(marker);
  }

  // Clear status textarea after new submission
  document.getElementById('statusResult').value = '';
});

// =============================
// Check all reported issues
// =============================
document.getElementById('checkStatus').addEventListener('click', () => {
  const issues = JSON.parse(localStorage.getItem('issues')) || [];
  const statusBox = document.getElementById('statusResult');

  if (issues.length > 0) {
    statusBox.value = issues.map((issue, index) =>
      `Issue #${index + 1}\n` +
      `Type: ${issue.type}\n` +
      `Description: ${issue.description}\n` +
      `Photo: ${issue.photo}\n` +
      `Location: ${issue.location}\n` +
      `Reported At: ${issue.timestamp}\n` +
      `Status: ${issue.status}\n`
    ).join('\n----------------------\n\n');
  } else {
    statusBox.value = 'No issues reported yet.';
  }
});
