/*prepares a bubble objects to be sent to the map. Color constraints and
radius algorithm were used to lower perceived variance.*/
function formBubblesFromData(data) {
  var prepData = [];
  //the color keys being used. Corresponds to fillKeys in Datamap object.
  var fKeys = ['LOW', 'MIDLOW', 'MID', 'MIDHIGH', 'HIGH'];
  //obtaining upper and lower quartiles for radius and color calculation
  var lowQu = getValueFromPercentile(data, 20)
  var upQu = getValueFromPercentile(data, 99.5);
  var colorConstraints = produceColorConstraints(lowQu, upQu, fKeys);
  for (id in data) {
    sample = data[id];
    var bubble = {
      name: sample.location.loc + ": " + sample.params[0],
      param: sample.params[0],
      radius: changeRadiusDisparity(lowQu, upQu, 3, 15, sample.values),
      value: sample.values,
      country: sample.location.country,
      latitude: sample.location.coords[0],
      longitude: sample.location.coords[1],
      date: sample.date,
      fillKey: getColorFromConstraint(sample.values, colorConstraints)
    }
    prepData.push(bubble);
  }
  return prepData;
}

/* reruns the styling of all belonging to datamaps-bubble class.
Useful for changing display of map or adding back data points */
function restyleBubbles() {
  d3.selectAll(".datamaps-bubble")
   .each(function(d){
     var parent = d3.select(this.parentNode),
         self = d3.select(this);
    self.style('stroke', '#000000');
    self.style('stroke-width', '1px');
    self.style('fill-opacity', '.9');
  });
}

//filters parameters according to select value from user
function remapFilteredBubbles() {
  var elem = document.getElementById("params-select")
  var param = elem.value;

  var bubbles = getParamFilteredBubbles(DATA, param);

  remapBubbles(bubbles);
  restyleBubbles();
}

//reverts display back to all data points
function remapDefaultBubbles() {
  remapBubbles(DATA);
  restyleBubbles();
}

/* remaps bubbles given and reinstantiates their popup template.
Function is always used to map bubbles. */
function remapBubbles(bubbles) {
  map.bubbles(bubbles, {
    popupTemplate: function(geo, data) {
      return ['<div class="hoverinfo">' +  data.name,
          '<br/>Level: ' + data.value,
          '<br/>Latitude: ' + data.latitude,
          '<br/>Longitude: ' + data.longitude,
          '<br/>Date: ' +  data.date + '',
          '</div>'].join('');
    }
  });
}

//returns array of bubbles that are only in agreement with the parameter given
function getParamFilteredBubbles(prepData, param) {
  if (param == 'all') {
    return prepData;
  }
  var newData = [];
  for (id in prepData) {
    var sample = prepData[id];
    if (sample.param === param) {
      newData.push(sample);
    }
  }
  return newData;
}

//Purely mathematical. Used for circle select tool
function getPointsWithinRadius(data, center, radius) {
  var lat = center[0], long = center[1];
  for (id in data) {
    var sample = data[id];
    var dist = Math.sqrt(Math.pow((lat-sample.latitude), 2) + Math.pow((long-sample.longitude), 2) )
    if (dist <= radius) {
      filteredPoints.push(sample);
    }
  }
  return filteredPoints;
}

function getLowHighValues(data) {
  var max = 0;
  var min = Infinity;
  for (id in data) {
    var val = data[id].values;
    if (val > max) {
      max = val;
    }
    if (val < min) {
      min = val;
    }
  }
  return [min, max];
}

//returns the data point closest to the percentile (whole num)
function getValueFromPercentile(data, percentile) {
  var p = percentile/100;
  var sortedValues = [];
  //preparing sortedValues array
  for (id in data) {
    sortedValues.push(data[id].values);
  }
  //getting the element index at portion p
  var pLen = p*sortedValues.length;
  //running selection sort, checking until pLen is reached
  for (var i = 1; i < sortedValues.length; i++) {
    var minInd = null;
    var min = Infinity;
    for (var j = i; j < sortedValues.length; j++) {
      if (sortedValues[j] < min) {
        min = sortedValues[j];
        minInd = j;
      }
    }
    if (min < sortedValues[i-1]) {
      var temp = sortedValues[i-1];
      sortedValues[i-1] = min;
      sortedValues[minInd] = temp;
    }
    if (i-1 >= pLen) {
      return sortedValues[i-1];
    }
  }
  return null;
}

/* scales the value interval from data to the radius interval,
which is then applied to the radius given */
function changeRadiusDisparity(lowVal, highVal, lowRad, highRad, radius) {
  var lenRatio = (highRad-lowRad)/(highVal-lowVal);
  var newRadius;
  if (radius >= lowVal && radius <= highVal) {
    newRadius = radius*lenRatio+lowRad;
  }
  else if (radius > highVal) {
    newRadius = highRad;
  }
  else {
    newRadius = lowRad;
  }
  return newRadius;
}

/* returns a dictionary of value ranges that satisfy the color
gradient, fillKeys */
function produceColorConstraints(low, high, fillKeys) {
  var n = fillKeys.length;
  var constraints = [];
  var interval = (high-low)/n;
  //getting ranges for each color
  for (var i = 0; i < n; i++) {
    var constraint = {
      range: [i*interval, (i+1)*interval],
      key: fillKeys[i]
    }
    constraints.push(constraint);
  }
  return constraints;
}

//applies the color constraint dictionary to a value and returns the color.
function getColorFromConstraint(value, constraints) {
  var len = 0;
  for (id in constraints) {
    len++;
    //checking if value is in range
    if (value >= constraints[id].range[0] && value <= constraints[id].range[1]) {
      return constraints[id].key;
    }
  }
  //forcing values out of range to closest color
  if (value > constraints[len-1].range[1]) {
    return constraints[id].key;
  }
  return null;
}
