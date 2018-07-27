// This urls is from airtable from the Authentication section
var airtable_list_url = 'https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Chicken%20Recipes?api_key=key87Kh1djUSEKJz9';

var cardTemplate = function(name, description, image) {
  return `
    <div class="card col-sm-4">
      <img src="${image}" class="card-img-top"alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${description}</p>
        <a href="#" class="btn btn-primary" id="button">Cook Now!</a>
      </div>
    </div>`;
  }
  
  // This is where we get the JSON data from Airtable!
  $.getJSON( airtable_list_url, function( data ) {
    var items = [];
    $.each( data.records, function( key, val ) {
      console.log(val.fields)
      var name = val.fields['Name'];
      var address = val.fields['Description'];
      var picture = val.fields['Image'][0] ? val.fields['Image'][0].url : null;
      var html = cardTemplate(name, address, picture);
      items.push(html);
    });
    $(".list-view").append(items.join(''));
  });