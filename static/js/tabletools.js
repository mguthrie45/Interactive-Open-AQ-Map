var paramFilterApplied = false;
var nameFilterApplied = false;
var latitudeFilterApplied = false;
var longitudeFilterApplied = false;

function filterParameters() {
  var selectTool = document.getElementById('filter-param');
  var param = selectTool.value;
  var elems = document.getElementsByClassName('data-row');
  for (var i = 0; i < elems.length; i++) {
    var paramElem = elems[i].getElementsByTagName('td')[1];
    if (paramElem) {
      var elemParam = paramElem.textContent;
      if (elemParam == param || param == 'all') {
        elems[i].style.display = '';
      }
      else {
        elems[i].style.display = 'none';
      }
    }
  }
  if (param == 'all') {
    paramFilterApplied = false;
  }
  else {
    paramFilterApplied = true;
  }
}

function filterNamesBySearch() {
  var search = document.getElementById('name-search').value.toUpperCase();
  var elems = document.getElementsByClassName('data-row');
  for (var i = 0; i < elems.length; i++) {
    var nameElem = elems[i].getElementsByTagName('td')[0];
    if (nameElem) {
      var elemName = nameElem.textContent.toUpperCase();
      if (elemName.indexOf(search) > -1) {
        elems[i].style.display = '';
      }
      else {
        elems[i].style.display = 'none';
      }
    }
  }
  if (search == '') {
    nameFilterApplied = false;
  }
  else {
    nameFilterApplied = true;
  }
}

function filterCoordinates() {
  var latLowSelectTool = document.getElementById('latitude-low');
  var latHighSelectTool = document.getElementById('latitude-high');
  var longLowSelectTool = document.getElementById('longitude-low');
  var longHighSelectTool = document.getElementById('longitude-high');
  var latLow = latLowSelectTool.value;
  var latHigh = latHighSelectTool.value;
  var longLow = longLowSelectTool.value;
  var longHigh = longHighSelectTool.value;

  console.log(latLow);

  var elems = document.getElementsByClassName('data-row');
  for (var i = 0; i < elems.length; i++) {
    elems[i].style.display = '';

    var latitude = elems[i].getElementsByTagName('td')[2].textContent;
    var longitude = elems[i].getElementsByTagName('td')[3].textContent;

    if (latLow != '' && latitude < parseInt(latLow)) {
        elems[i].style.display = 'none';
    }
    if (latHigh != '' && latitude > parseInt(latHigh)) {
      elems[i].style.display = 'none';
    }
    if (longLow != '' && longitude < parseInt(longLow)) {
      elems[i].style.display = 'none';
    }
    if (longHigh != '' && longitude > parseInt(longHigh)) {
      elems[i].style.display = 'none';
    }
  }
}

function formBubblesFromData(data) {
  var prepData = [];
  for (id in data) {
    sample = data[id];
    var bubble = {
      name: sample.location.loc + ": " + sample.params[0],
      param: sample.params[0],
      value: sample.values,
    }
    prepData.push(bubble);
  }
  return prepData;
}

function getDataPoints() {
  //cleaning json content
  var data = JSON.parse('{{ jsoncontent | tojson | safe }}');
  return formBubblesFromData(data);
}
