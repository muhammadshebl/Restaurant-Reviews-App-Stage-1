let restaurants,
  neighborhoods,
  cuisines,
loc;
var mymarker;
var locsMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
    initMap();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
     loc = {
       lat:40.722216
     ,
         lng:
             -73.987501};

    mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRzaGVibCIsImEiOiJjanc1Ynd2cXMxbThiNDNwbHhnMTd0ZzVqIn0.FGmRRvVwQSD2lQAV3GqDIA';
    mymap(loc);
    updateRestaurants();
}
mymap = (loc) => {
    locsMap = new mapboxgl.Map({
        container: 'locsMap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: loc, // starting position
        zoom: 11.12// starting zoom
    });
}
/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      loc=restaurants[0].latlng;
        locsMap.flyTo({
            center: loc
        });
        addMarkersToMap(restaurants);
    }
  })

}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
    li.className = 'restaurant-Card';

const imgContainer = document.createElement('div');
    imgContainer.className = 'restaurant-img-container';
    li.append(imgContainer);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name + " image";
    imgContainer.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  name.className = 'restaurant-name';
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.className = 'restaurant-details';
  li.append(neighborhood);

  const address = document.createElement('address');
  address.innerHTML = restaurant.address;
  address.className = 'restaurant-address';
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.className = 'restaurant-page-link';
  more.setAttribute('aria-label', `for more details about ${restaurant.name}'s restaurant click here`);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
         el = document.createElement('div');
        el.className = 'marker';
          mymarker =new mapboxgl.Marker(el, { offset: [0, -23] }).setLngLat(restaurant.latlng).addTo(locsMap);
        el.addEventListener('click', function(e) {
            var activeItem = document.getElementsByClassName('active');
            // 1. Fly to the point
            // 2. Close all other popups and display popup for clicked store
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            e.stopPropagation();
            window.location.href=DBHelper.urlForRestaurant(restaurant);
        });
    });
}
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    ul.className = 'restaurant-Cards-Container';
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
}
