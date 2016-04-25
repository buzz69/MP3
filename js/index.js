var my_media=null;
var mediaTimer=null;
var playing = false;
var mediasCounter=0;
var mediasList=new Array();
var shakeEnabled='off';
var keepAwake='off';
var currentPage='';

var statusBarHtml='<table width=100%><tr><td width=50><center><img src="img/media_playback_stop.png" onclick="stopAudio();"></img></center></td><td width=30><center><div id="currentTimeDiv" style="color:#33B5E5"></div></center></td><td><div id="progressWrapper" style="width:100%;height:25px;"><progress value=\'0\' max=\'100\'></progress></div></td><td width=30><center><div id="endTimeDiv" style="color:#33B5E5"></div></center></td></tr></table>';

$( "#leftpanel" ).on( "panelopen", function( event, ui ) {
	if(shakeEnabled=='on'){
		$('#checkboxShake').off('change').prop("checked", true).checkboxradio('refresh').on("change",shakeFlipChanged);
	}else{
		$('#checkboxShake').off('change').prop("checked", false).checkboxradio('refresh').on("change",shakeFlipChanged);
	}
	if(keepAwake=='on'){
		$('#checkboxSleep').off('change').prop("checked", true).checkboxradio('refresh').on("change",sleepFlipChanged);
	}else{
		$('#checkboxSleep').off('change').prop("checked", false).checkboxradio('refresh').on("change",sleepFlipChanged);
	}
} );

function shakeFlipChanged(e) {
	var isChecked =  $('#checkboxShake').prop("checked");
	if(isChecked){
		shakeEnabled = 'on';
		shake.startWatch(onShake);
	}else{
		shakeEnabled = 'off';
		shake.stopWatch();
	}
	if (storageAvailable('localStorage')) {
		localStorage.setItem('shake',shakeEnabled);
	}
}

function sleepFlipChanged(e) {
	var isChecked =  $('#checkboxSleep').prop("checked");
	if(isChecked){
		keepAwake = 'on';
		window.plugins.insomnia.keepAwake();
	}else{
		keepAwake = 'off';
		window.plugins.insomnia.allowSleepAgain();
	}
	if (storageAvailable('localStorage')) {
		localStorage.setItem('awake',keepAwake);
	}
}

$( document ).bind( "deviceready", function() {
	document.addEventListener("backbutton", backKeyDown, true);
	getSettings();
	getSounds();
	generateButtons('HOME');
	//shake.startWatch(onShake);
	//window.plugins.insomnia.keepAwake();
});

$(document).on("pageshow", "#splash",function(event){
	setTimeout('$.mobile.changePage( "#home", { transition: "slideup"});',1000);
});

var onShake = function () {
  randomIndex=getRandomInt(0,mediasList.length-1);
  playSound(mediasList[randomIndex]);
};

// Stop watching for shake gestures
//shake.stopWatch();

//allow sleep
//window.plugins.insomnia.allowSleepAgain();

function getSettings(){
	shakeEnabled='off';
	keepAwake='off';
	if (storageAvailable('localStorage')) {
		if(!localStorage.getItem('shake')) {
			localStorage.setItem('shake','off');
		}else{
			shakeEnabled=localStorage.getItem('shake');
		}
		if(!localStorage.getItem('awake')) {
			localStorage.setItem('awake','off');
		}else{
			keepAwake=localStorage.getItem('awake');
		}
	}
	if(shakeEnabled=='on'){
		shake.startWatch(onShake);
	}
	if(keepAwake=='on'){
		window.plugins.insomnia.keepAwake();
	}
}

function getSounds(){
	for(categorie in mediasTab){
		for(mp3Title in mediasTab[categorie]){
			if(mp3Title!='titre' && mp3Title!='banner' && mp3Title!='thumbnail'){
				mediasList[mediasCounter]=categorie+'/'+mediasTab[categorie][mp3Title];
				mediasCounter++;
			}
		}
	}
}

function generateButtons(category){
	currentPage=category;
	$('#mainDiv').html('');
	if(category=='HOME'){
		counter=0;
		content='<div class="ui-grid-b">';
		for(categorie in mediasTab){
			counter++;
			if(counter==1 || counter==4 || counter==7 || counter==10 || counter==13 || counter==16 || counter==19 || counter==22 || counter==25 || counter==28 || counter==31 || counter==34 || counter==37 || counter==40){content+='<div class="ui-block-a">';}
			if(counter==2 || counter==5 || counter==8 || counter==11 || counter==14 || counter==17 || counter==20 || counter==23 || counter==26 || counter==29 || counter==32 || counter==35 || counter==38 || counter==41){content+='<div class="ui-block-b">';}
			if(counter==3 || counter==6 || counter==9 || counter==12 || counter==15 || counter==18 || counter==21 || counter==24 || counter==27 || counter==30 || counter==33 || counter==36 || counter==39 || counter==42){content+='<div class="ui-block-c">';}
			content+='<center><img width=100 src="'+mediasTab[categorie]['thumbnail']+'" onclick="generateButtons(\''+categorie+'\');"/><p>'+mediasTab[categorie]['titre']+'</p></center></div>';
		}
		content+='</div>';
		$('#mainDiv').html(content);
	}else{
		for(categorie in mediasTab){
			if(categorie==category){
				$("#mainDiv").append('<div class="ui-grid-solo"><div class="ui-block-a"><img src="'+mediasTab[categorie]['banner']+'"/></div></div>');
				$("#mainDiv").append("<ul id='mp3list' data-role='listview' data-inset='true'></ul>");
				$("#mainDiv").trigger("create");
				for(mp3Title in mediasTab[categorie]){
					if(mp3Title!='titre' && mp3Title!='banner' && mp3Title!='thumbnail'){
						$("#mp3list").append('<li><a href="#" onclick="playSound(\''+categorie+'/'+mediasTab[categorie][mp3Title]+'\');return false;">'+mp3Title+'</a></li>');
						$("#mp3list").listview("refresh");
					}
				}
			}
		}
	}
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
	if(currentPage!='HOME'){
		generateButtons('HOME');
	}else{
		if (navigator.app) {
		   navigator.app.exitApp();
		}
		else if (navigator.device) {
			navigator.device.exitApp();
		}
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}