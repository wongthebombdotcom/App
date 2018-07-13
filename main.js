    //This is from airtable authenticaiton
    var airtable_list_url = 'https://api.airtable.com/v0/appzuVq4QVRYlpDfV/Table%201?api_key=key45t6DMFSUQleHA'

    //This is where we get the JSON data from airtable
    $.getJSON( airtable_list_url, function( data ) {
        var items = [];
        $.each( data.records, function( key, val ) {
          console.log(val.fields)
          items.push(`<h2>${val.fields['Name']}</h2>`);
        });
        $(".list-view").append(items.join(''));
      });