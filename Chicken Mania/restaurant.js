// Helper for getting the `?ID=` part form the URL
var getParameterByName = function (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var api_key = 'key87Kh1djUSEKJz9';

// Template that generates the HTML for one item in our list view, given the parameters passed in
var listView = function(id, name, pictureUrl, rating, pricerange) {
  return `<div class="col-sm-6">
    <div class="card mb-4 box-shadow">
      <a href="restaurant.html?id=${id}"><img class="card-img-top" src="${pictureUrl}"></a>
      <div class="card-body">
        <h4><a href="restaurant.html?id=${id}">${name}</a></h4>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${rating}</small>
          <small class="text-muted" id="price">${pricerange}</small>
          </div>
      </div>
    </div>
  </div>`;
};

// Get and display the data for all items
var getDataForList = function() {
  // 1. Gets the data from the Airtable API
  $.getJSON(
    `https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Chicken%20Places?api_key=${api_key}`,
    function(data) {
      // console.log(data);
      var html = [];
      html.push(`<div class="row">`);
      // 2. Iterates over every record and uses the list template
      $.each(data.records, function(index, record) {
        // console.log(record)
        var id = record.id;
        var fields = record.fields;
        var name = fields["Name"];
        var image = fields["Image"] ? fields["Image"][0].url : "";
        var pricerange = fields["Price Range"];
        var rating = fields["Rating"];
        // Pass all fields into the List Template
        var itemHTML = listView(id, name, image, rating, pricerange);
        html.push(itemHTML);
      });
      html.push(`</div>`);
      // 3. Adds HTML for every item to our page
      $(".list-view").append(html.join(""));
    },
  );
};

// Template that generates HTML for one item in our detail view, given the parameters passed in
var detailView = function(id, name, pictureUrl, rating, pricerange, address, website, description, number) {
  return `<div class="col-sm-12">
    <div class="card mb-6 box-shadow">
      <img class="card-img-top" src="${pictureUrl}">
      <div class="card-body">
        <h2>${name}</h2>
        <p class="card-text">${rating}</p>
        <p class="card-text">${pricerange}</p>
        <p class="card-text">${address}</p>
        ${description ? `<p class="card-text">${description}</p>` : ``}
        <div class="d-flex justify-content-between align-items-center">
        </div>
        ${website ? `<a href="${website}">${website}</a>` : ``}
        <hr />
        <a href="https://www.google.com/maps/search/${name}"> Find Location </a>
      </div>
    </div>
  </div>`;
};

// Get and display the data for one item based on on the ID
var getDataForId = function(id) {
  $.getJSON(`https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Chicken%20Places/${id}?api_key=${api_key}`,
    function(record) {
      // console.log(data);
      var html = [];
      html.push(`<div class="row">`);
      // console.log(record)
      var id = record.id;
      var fields = record.fields;

      var name = fields["Name"];
      var image = fields["Image"] ? fields["Image"][0].url : "";
      var pricerange = fields["Price Range"];
      var rating = fields["Rating"];
      var description = fields["Description"];
      var website = fields["Website"];
      var number = fields["Number"];
      var address = fields["address"];

      // Pass all fields into the Detail Template
      var itemHTML = detailView(id, name, image, pricerange, rating, description, website, number, address);
      html.push(itemHTML);
      html.push(`</div>`);
      $(".detail-view").append(html.join(""));
    },
  );
};

// Do we have an ID in the URL?
var id = getParameterByName("id");

// If we have an ID, we should only get the data for one item
// Otherwise, we should display the data for all items
if (id) {
  getDataForId(id);
} else {
  getDataForList();
}