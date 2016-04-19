var my_media=null;
var mediaTimer=null;
var playing = false;

var statusBarHtml='<table width=100%><tr><td width=50><center><img src="img/media_playback_stop.png" onclick="stopAudio();"></img></center></td><td width=30><center><div id="currentTimeDiv" style="color:#33B5E5"></div></center></td><td><div id="progressWrapper" style="width:100%;height:25px;"><progress value=\'0\' max=\'100\'></progress></div></td><td width=30><center><div id="endTimeDiv" style="color:#33B5E5"></div></center></td></tr></table>';

$( document ).bind( "deviceready", function() {
	document.addEventListener("backbutton", backKeyDown, true);
	generateButtons();
});

$(document).on("pageshow", "#splash",function(event){
	setTimeout('$.mobile.changePage( "#home", { transition: "slideup"});',1000);
});

function generateButtons(){
	content='<ul data-role="listview">';
	for(categorie in mediasTab){
		content+='<li data-role="list-divider">'+mediasTab[categorie]['titre']+'</li>';
		for(mp3Title in mediasTab[categorie]){
			if(mp3Title!='titre'){
				content+='<li><a href="#" onclick="playSound(\''+categorie+'\\'+mediasTab[categorie][mp3Title]+'\');return false;">'+mp3Title+'</a></li>';
			}
		}
	}
	content+='</ul>';
	$('#mainDiv').html(content);
}

function backKeyDown() { 
	exitFromApp();
}

function playSound(mp3File) {
	if( my_media != null ){
		my_media.stop();
		my_media.release();
		clearInterval(mediaTimer);
		mediaTimer = null; 
		my_media = null;
		playing = true; 
	}
	
	filePath = '/android_asset/www/sounds/' + mp3File;
	my_media = new Media(filePath,onEnd,
		// success callback
		function () {
			console.log("playAudio():Audio Success");
		},
		// error callback
		function (err) { 
			return true;
			//$('#statusBar').html('PlayAudio error: ' + dump(err));
		}
	);
	
	var duration = 0;
	var counter = 0;
	var timerDur = setInterval( function() {
		counter = counter + 100;
		if (counter > 2000) {
			clearInterval(timerDur);
		}
		var dur = my_media.getDuration();
		if (dur > 0) {
			clearInterval(timerDur);
			duration = dur; 
			$('#endTimeDiv').html(parseInt(duration) + 's');
		}
    }, 100);
	
	// Play audio
	my_media.play();
	
	//
	$('#statusBar').html(statusBarHtml);
	$('#currentTimeDiv').html('0s');
	
	// progress
	mediaTimer = setInterval(function () {
		duration=my_media.getDuration();
		// get media position
		my_media.getCurrentPosition(
			// success callback
			function (position) {
				if (position > -1) {
					if(position==-0.001){
						$('#progressWrapper').html("<progress value='100' max='100'></progress>");
						clearTimer(mediaTimer);
					}else{
						//$('#statusBar').html('Position: ' + parseInt(position) + 's / ' + parseInt(duration) + 's');
						$('#progressWrapper').html("<progress value='"+parseInt(position)+"' max='"+parseInt(duration)+"'></progress>");
						$('#currentTimeDiv').html(parseInt(position) + 's');
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
	
	function onEnd() {
		if( my_media && playing == false ){
			stopAudio();
		}
	}
}

function stopAudio() {
	if (my_media) {
		my_media.stop();
		my_media.release();
	}
	clearInterval(mediaTimer);
	playing = false; 
	mediaTimer = null;
	my_media = null;
	$('#statusBar').html('</br>');
}

function exitFromApp(){
	if (navigator.app) {
	   navigator.app.exitApp();
	}
	else if (navigator.device) {
		navigator.device.exitApp();
	}
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