

var twtext = require('twitter-text');
//ツイート数のカウント
var twCount = 0;


var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
 
//port: Heroku || AppFog || 3000
var port = process.env.PORT || process.env.VMC_APP_PORT || 3000;
server.listen(port);
 
app.use(express.static(__dirname + '/public'));


var twitter = require('ntwitter');
//var twitter = require('immortal-ntwitter');
var tw = new twitter(require('./config').getKeys());

tw.stream('statuses/filter', {'locations': '-180,-90,180,90'}, function(stream) {
//tw.immortalStream('statuses/filter', {'locations': '-180,-90,180,90'}, function(stream) {
  stream.on('data', function (data) {
    if (data.coordinates) {
      //console.log(data);
      var formatted = twtext.autoLink(twtext.htmlEscape(data.text));
      data.text_formatted = formatted;
      io.sockets.emit('message', {
        'id': data.id_str,
        'text': data.text,
        'lnglat': data.coordinates.coordinates,
        //'place' : data.place,
        'sname': data.user.screen_name,
        'img': data.user.profile_image_url
        //'time': data.create_at
      });
      twCount++;
      if(twCount = 100) {
      	cnosole.log("処理ツイートが100件に達しました");
      }
    }
  });
  stream.on('error', function (response) {
    console.log(response);
    process.exit();
  });
  stream.on('end', function (response) {
    console.log(response);
    process.exit();
  });
  stream.on('destroy', function (response) {
    console.log(response);
    process.exit();
  });
});
