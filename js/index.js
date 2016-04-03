var my_media=null;
var mediaTimer=null;

$( document ).bind( "deviceready", function() {
	
});

function playSound(mp3File) {
	filePath = '/android_asset/www/sounds/' + mp3File;
	//var audioElement = document.getElementById(id);
	//var url = audioElement.getAttribute('src');
	var my_media = new Media(filePath,
		// success callback
		function () {
			console.log("playAudio():Audio Success");
		},
		// error callback
		function (err) { 
			$('#statusBar').html('PlayAudio error: ' + dump(err));
		}
	);
	// Play audio
	my_media.play();
	var mediaTimer = setInterval(function () {
		duration=my_media.getDuration();
		// get media position
		my_media.getCurrentPosition(
			// success callback
			function (position) {
				if (position > -1) {
					if(position==-0.001){
						clearTimer(mediaTimer);
					}else{
						$('#statusBar').html('Position: ' + position + 's / ' + duration + 's');
					}
				}
			},
			// error callback
			function (e) {
				console.log("Error getting pos=" + e);
				clearTimer(mediaTimer);
			}
		);
	}, 1000);
}

function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}