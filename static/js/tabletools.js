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
