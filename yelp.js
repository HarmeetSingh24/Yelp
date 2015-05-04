var map;
var geocoder;
var markers = [];
//getting the map to load on loading
function initialize () {
	geocoder=new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(32.75, -97.13);
	var mapProp = {
    zoom: 16,
    center: latlng,
	mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),mapProp);
}
//Sending the request to yelp api for getting the the information
function sendRequest () {
	document.getElementById("output").innerHTML=null;
	deleteMarkers();
	//var label1 ="Review:";
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);
   var bounds=map.getBounds();
   var ne = bounds.getNorthEast(); 
   var sw = bounds.getSouthWest();
   var sw1 = sw.lat();
   var sw2 = sw.lng();
   var ne1 = ne.lat();
   var ne2 = ne.lng();
   //console.log('rec coords: ' + ne1 +',' +sw1 );
	
   xhr.open("GET", "proxy.php?term="+query+"&bounds="+ne1+","+sw2+"|"+sw1+","+ne2+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
		
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		//document.getElementById("output").innerHTML="<pre>"+str+"</pre>";
		for(i=0;i<json.businesses.length;i++)
		{
		
		var name =document.createElement("div");
		var yelpimg = document.createElement("div");
		var snippet_text = document.createElement("div");
		var rating = document.createElement("div");
		document.getElementById("output").appendChild(name);
		document.getElementById("output").appendChild(rating);
		document.getElementById("output").appendChild(yelpimg); 	
		document.getElementById("output").appendChild(snippet_text);
		var label = i+1;
		name.innerHTML='<a href="'+json.businesses[i].url+'">'+label+"."+json.businesses[i].name +'</a>';
		rating.innerHTML='<img src="'+ json.businesses[i].rating_img_url_small + '">';
		yelpimg.innerHTML='<img src="'+ json.businesses[i].image_url + '">';
		snippet_text.innerHTML=json.businesses[i].snippet_text+"<br>";
		var address = json.businesses[i].location.address +","+"\n"+json.businesses[i].location.city +","+"\n"+json.businesses[i].location.state_code +"\t"+ json.businesses[i].location.postal_code;
		codeAddress(address,label);
		yelpimg.setAttribute("style","width:100px;height:100px");
		snippet_text.setAttribute("style","width:200px;height:200px");
		
		}
	   }
   };
   xhr.send(null);
}

// Add a marker to the map and push to the array.
function codeAddress(address,i) {
  //var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
	var flag = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|6A5ACD|000000";
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
		  icon : flag
      });
	markers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}
// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}