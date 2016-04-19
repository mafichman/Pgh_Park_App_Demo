
/** Find the N closest world bank projects */
function nClosest(point, n) {
  // The SQL in english:
  // SELECT (all data) FROM (the table, world_bank_projects)
  // ORDER BY (distance of these geoms from the provided point)
  // LIMIT (to n cases)
  var sql = 'SELECT * FROM allmeters_merge ORDER BY the_geom <-> ST_setSRID(ST_Point(' + point.lng + ',' + point.lat + '),4326 ) LIMIT ' + n;

  $.ajax('https://mfichman.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log(n +' closest:', results);
    addRecords(results);
  });
}

/** Find all points within the box constructed */
function pointsWithin(rect) {
  // Grab the southwest and northeast points in this rectangle
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM allmeters_merge WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';

  $.ajax('https://mfichman.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log('pointsWithin:', results);
    addRecords(results);
  });
}


/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var location = $('<p></p>')
    .text('Location: ' + rec.location);

  var price = $('<p></p>')
    .text('Price: ' + rec.rate);

  var totTransactions = $('<p></p>')
    .text('Total Transactions, March, 2013: ' + rec.totaltransactions);

  var meterID = $('<p></p>')
    .text('Unique Meter ID: ' + rec.meterID);

  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(location)
    .append(price)
    .append(totTransactions)
    .append(meterID);

  $('#meter-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#meter-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
