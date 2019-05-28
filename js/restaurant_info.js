let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
});
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {

    if (error) { // Got an error!
      console.error(error);
    } else {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWZhcmciLCJhIjoiY2p1ZDloNmRiMDR3MDN5bXk5ZmUzdTRodiJ9.7Tp8zK2yRKBICT5Ry9q64Q';
        locsMap = new mapboxgl.Map({
            container: 'locsMap',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: restaurant.latlng, // starting position
            zoom: 12// starting zoom
        });
        var el = document.createElement('div');
        el.className = 'marker';
        let mymarker =new mapboxgl.Marker(el, { offset: [0, -23] }).setLngLat(restaurant.latlng).addTo(locsMap);
      fillBreadcrumb();
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
    image.alt=restaurant.name + " restaurant image"
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.className = 'reviews-label';
  title.innerHTML = reviews.length + ' Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'reviewContainer';
  /*reviewer details*/
    const reviewer= document.createElement('div');
    reviewer.className = 'reviewer-details-container';
    li.appendChild(reviewer);

    /*profile picture*/
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    const profile= document.createElement('div');
    profile.className="user-profile-pic";
    profile.setAttribute('style', 'background-color:#'+randomColor+';');
    profile.innerHTML= review.name.charAt(0);
    reviewer.appendChild(profile);

    const reviewdata= document.createElement('div');
    reviewdata.className = 'review-details-container';
    reviewer.appendChild(reviewdata);

    const nameRate =document.createElement('div');
    nameRate.className = 'name-rate-container';
    reviewdata.appendChild(nameRate);

  const name = document.createElement('p');
  name.innerHTML = review.name;
    nameRate.appendChild(name);

    /*draw rating in stars instead of numbers function*/
  const rating = document.createElement('div');
  rating.setAttribute('aria-label', `Rating ${review.rating}`);
  rating.className ="rating-container";
    let ratingContainer= "";
    let yellow= review.rating;
    let white = 5 - yellow;
    while (yellow >= 1) {
        ratingContainer += '<i class="star-yellow" aria-hidden="true">&starf;</i>';
        yellow--;
    }
    while (white >= 1) {
        ratingContainer += '<i class="star-white" aria-hidden="true">&starf;</i>';
        white--;
    }
    rating.innerHTML = ratingContainer;
    nameRate.appendChild(rating);
    /*date*/
    const date = document.createElement('p');
    date.innerHTML = review.date;
    date.setAttribute('aria-label', `Review date`);
    date.className ="review-date";
    reviewdata.appendChild(date);

/*comments*/
  const comments = document.createElement('p');
  comments.innerHTML = '<span class="review-date" aria-label="Review date">'+review.date+'</span>' + review.comments;
    comments.className ="comment";
  li.appendChild(comments);

/*break line*/
    const breakBorder = document.createElement('div');
    breakBorder.className ="break";
    breakBorder.setAttribute('aria-hidden', true);
    li.appendChild(breakBorder);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
/*on scroll change the breadcrumb nav color*/
window.onscroll = () => {
    const nav = document.getElementById('breadcrumb');
    if(this.scrollY <= 12) nav.className = '';
    else nav.className = 'scroll';
};

//;