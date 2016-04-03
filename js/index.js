
$( document ).bind( "deviceready", function() {
	
});

function getCordovaPath() {
  var absolutePath = window.location.pathname;
  //14 is length of html file name(including .html) 
  actualPath = absolutePath.substr( path, path.length - 14 );
  return 'file://' + actualPath;
}

function playsound(mp3File) {
	filePath = getCordovaPath() + 'res/sounds/' + mp3File;
	$('#statusBar').html('Path: ' + filePath);
	//var audioElement = document.getElementById(id);
	//var url = audioElement.getAttribute('src');
	var my_media = new Media(filePath,
		// success callback
		function () {
			console.log("playAudio():Audio Success");
		},
		// error callback
		function (err) { 
			currentContent=$('#statusBar').html();
			$('#statusBar').html(currentContent + '<br>' + 'PlayAudio error: ' + err);
		}
	);
  // Play audio
  my_media.play();
}