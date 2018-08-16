// Helper for getting the `?ID=` part form the URL
var getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var api_key= 'key87Kh1djUSEKJz9';

// Template that generates the HTML for one item in our list view, given the parameters passed in
var listView = function(id, name, image, description) {
  return `
    <div class="card col-sm-4">
      <img src="${image}" class="card-img-top"alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${description}</p>
        <a href="recipe.html?id=${id}" class="btn btn-primary" id="button">Cook Now!</a>
      </div>
    </div>`;
}

// Get and display the data for all items
var getDataForList = function() {
  // 1. Gets the data from the Airtable API
  $.getJSON(`https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Chicken%20Recipes?api_key=${api_key}&view=alpha`, function( data ) {
    // console.log(data.records);
    var html = [];
    html.push(`<div class="row">`);
    // 2. Iterates over every record and uses the list template
    $.each( data.records, function( index, val ) {
      // console.log(val.fields)
      var id = val.id;
      var fields = val.fields;
      var name = fields["Name"];
      var image = val.fields['Image'][0] ? val.fields['Image'][0].url : null;
      var description = fields["Description"];
      var itemHTML = listView(id, name, image, description);
      html.push(itemHTML);
    });
    html.push(`</div>`);
    // 3. Adds HTML for every item to our page
    $(".list-view").append(html.join(""));
  });
}

// Template that generates HTML for one item in our detail view, given the parameters passed in
var detailView = function(id, name, pictureUrl, description, ingredients, recipe, source) {
  return `<div class="col-sm-14">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top" src="${pictureUrl}">
      <div class="card-body">
        <h2>${name}</h2>
        <p class="card-text">${description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted" id="ingredients">${ingredients}</small>
          <small id="recipe">${recipe}</small>
        </div>
         Original Source: ${source ? `<a href="${source}">${source}</a>`: ``}
        <hr/>
        <a class="btn btn-secondary" href="recipe.html" role="button">Cook Some More</a>
      </div>
    </div>
  </div>`;
}


// Get and display the data for one item based on on the ID
var getDataForId = function(id) {
  $.getJSON( `https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Chicken%20Recipes/${id}?api_key=${api_key}`, function( record ) {
    // console.log(data);
    var html = [];
    html.push(`<div class="row">`);
      // console.log(val)
      var id = record.id;
      var fields = record.fields;
      var name = fields["Name"];
      var image = fields["Image"] ? fields["Image"][0].url : '';
      var description = fields["Description"];
      var ingredients = fields["Ingredients"];
      var recipe = fields["Recipe"];
      var source = fields["Source"];

      var itemHTML = detailView(id, name, image, description, ingredients, recipe, source);
      html.push(itemHTML);
      html.push(`</div>`);
     $(".detail-view").append(html.join(""));
  });
}

// Do we have an ID in the URL?
var id = getParameterByName("id");

// If we have an ID, we should only get the data for one item
// Otherwise, we should display the data for all items
if (id) {
  getDataForId(id);
} else {
  getDataForList();
}
