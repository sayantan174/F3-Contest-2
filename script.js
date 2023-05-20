const apiKey = "525fc8f2ffd447ef9bcd910ec1166c44";
const currentLocationDetails = document.getElementById(
  "current-location-details"
);
(function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
})();

async function showPosition(position) {
  const endpoint = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&apiKey=${apiKey}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  currentLocationDetails.innerHTML = `<p>Name Of Time Zone : ${data.results[0].timezone.name}</p>
  <div class="lat-long-container">
    <p>Lat: ${data.results[0].lat}</p>
    <p>Long: ${data.results[0].lon}</p>
  </div>
  <p>Offset STD: ${data.results[0].timezone.offset_STD}</p>
  <p>Offset STD Seconds : ${data.results[0].timezone.offset_STD_seconds}</p>
  <p>Offset DST : ${data.results[0].timezone.offset_DST}</p>
  <p>Offset DST Seconds: ${data.results[0].timezone.offset_DST_seconds}</p>
  <p>Country: ${data.results[0].country}</p>
  <p>Postcode: ${data.results[0].postcode}</p>
  <p>City: ${data.results[0].city}</p>`;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

const searchForm = document.getElementById("search-address");
const searchLocationDetails = document.getElementById(
  "search-location-details"
);
searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const input = searchForm["address"].value;
  if (!validateAddress(input)) {
    alert("Enter a Valid Address");
    searchForm["address"].value = "";
    return;
  }
  const endpoint = `https://api.geoapify.com/v1/geocode/search?text=${input}&apiKey=${apiKey}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  if (data.features.length == 0) {
    searchLocationDetails.innerHTML = `<p style="color:red; font-weight:bold">Timezone could not be found! or Address is not found<p>`;

    searchLocationDetails.style.display = "flex";
    return;
  }
  searchLocationDetails.innerHTML = `<p>Name Of Time Zone : ${data.features[0].properties.timezone.name}</p>
  <div class="lat-long-container">
    <p>Lat: ${data.features[0].properties.lat}</p>
    <p>Long: ${data.features[0].properties.lon}</p>
  </div>
  <p>Offset STD: ${data.features[0].properties.timezone.offset_STD}</p>
  <p>Offset STD Seconds : ${data.features[0].properties.timezone.offset_STD_seconds}</p>
  <p>Offset DST : ${data.features[0].properties.timezone.offset_DST}</p>
  <p>Offset DST Seconds: ${data.features[0].properties.timezone.offset_DST_seconds}</p>
  <p>Country: ${data.features[0].properties.country}</p>
  <p>Postcode: ${data.features[0].properties.postcode}</p>
  <p>City: ${data.features[0].properties.city}</p>`;
  searchLocationDetails.style.display = "flex";
});

function validateAddress(address) {
  var addressPattern = /^[a-zA-Z0-9\s\.,#'-]+$/;
  if (addressPattern.test(address)) {
    return true;
  } else {
    return false;
  }
}
