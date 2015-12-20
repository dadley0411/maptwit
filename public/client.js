

$(document).ready(function() {
  var infowindows = [];
  var markers = [];
  var markerCount = 0;
  var infowindowMax = 3;
  var map = new google.maps.Map(document.getElementById("map_canvas"), {
    zoom : 2,
    center : new google.maps.LatLng(20, 180),
    mapTypeId : google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    panControl: false,
    //streetViewControl: false,
    //zoomControl: false
    zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
    }

  });

  //var fluster = new Fluster2(map);

  function Cluster() {
    new MarkerClusterer(map, markers, {
      gridSize : 70
    });
  }

  function Cluster2() {
    fluster.addMarker(marker);
    fluster.initialize();

  }

  var socket = io.connect();
  socket.on('message', function(data) {
    $('#img').attr('src', data.img);
    $('#id').text(data.id);
    $('#name').text(data.sname);
    $('#text').text(data.text);
    //$('#time').text(data.create_at);

    var lng = data.lnglat[0];
    var lat = data.lnglat[1];

    //tweetの絵文字を変換する
    //var tweet = twemoji.parse(data.text_formatted, {size: 16});

    var marker = new google.maps.Marker({
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      //icon: data.img,
      position: new google.maps.LatLng(lat, lng)

      
    });
    markers.push(marker); 
    //fluster.addMarker(marker);

    //Cluster();
    //Cluster2();




   




    //地図マーカーの吹き出し
    
    var infowindow = new google.maps.InfoWindow({
      content: data.text,
      maxWidth: 200,
      disableAutoPan: true
    });

    

    //マーカーがクリックされた際の処理
    marker.addListener('click', function() {
      infowindow.open(map, marker);
      //this.infowindow.open(map, this);
    });

    infowindows.push(infowindow);
    infowindow.open(map, marker);

    if(markerCount >= infowindowMax) {
      var cls = markerCount - infowindowMax;
      infowindows[cls].close();
    }

    markerCount++;







       
  });
});
