


var AM_Game = function(){

	var ADMAXIM_GAME_WIDTH = 320;
	var ADMAXIM_GAME_HEIGHT = 500;

	var FINAL_URL = "http://m.vodafone.hu/aktualis-ajanlatok/valts/vodafone-red";

	var newScale = 2.4;
	var oldScale = .417;

	var mycanvas,
		stage;

	var imgLib = {};

	var loadBar;
	var loadBarHolder;
	var gameHolder;	

	var moduleLoaded = false;
	var crackHolder;

 	var MANIFEST = [
 		{src:"media/game/close_btn_white.png", id:"close_btn_white"},
		{src:"media/game/close_btn_red.png", id:"close_btn_red"},
		{src:"media/game/logo.png", id:"logo_red"},
		{src:"media/game/logo_white.png", id:"logo_white"},
		{src:"media/game/sim.png", id:"sim"},
		{src:"media/game/sim_holder.png", id:"sim_holder"},
		{src:"media/game/txt_drag_sim_hg.png", id:"txt_drag_sim"},
		{src:"media/game/phone_red2.png", id:"phone_red"},
		{src:"media/game/view_phone_hg.jpg", id:"view_phone"},
		{src:"media/game/view_end_hg.png", id:"view_end"}
	];



	var audioTimer;
	var trackDic = {};
	var trackPlaying = false;
	var audioLoaded = false;
	var MP3_URL = "media/game/sim_track3.mp3";
	var TRACKS = [
		{name:'press_sim', start:0, end:.9},
		{name:'release_sim', start:1, end:1.9},
		{name:'win', start:2, end:5}
	];

	var firstTouch = true;


	this.init = function(){
		console.log('init - game');
		shrinkCanvasForHighRes({w:ADMAXIM_GAME_WIDTH, h:ADMAXIM_GAME_HEIGHT})
		readyToLoadModule();
	}

	function readyToLoadModule(e) {
		if (!moduleLoaded){
			moduleLoaded = true;
			setUpCanvas();
		}
	}
	
	function setUpCanvas(){
		if (typeof(createjs) != 'undefined'){
			console.log('createjs ready');
			mycanvas = document.getElementById('demoCanvas');
			stage = new createjs.Stage(mycanvas);
			
			createjs.Ticker.addListener(stage);
			createjs.Ticker.setFPS(16);
		
			//setUpGame();

			buildStartBtn();
		} else {
			setTimeout(function(){
				setUpCanvas();
			},500);
			
			console.log('createjs undefined');
		}
	}

	function buildStartBtn(){
		var startGraphic = new createjs.Graphics();
		startGraphic.beginFill('green');
		startGraphic.drawRect(0, 0, 768, 1200);
		startBtn = new createjs.Shape(startGraphic);
		startBtn.alpha = 0.01;
		startBtn.onPress = setUpGame;
		stage.addChild(startBtn);
		
		createjs.Touch.enable(stage);
	}
	
	function setUpGame(e){

		//createjs.Touch.enable(stage);

		stage.removeChild(startBtn);
		preloadAudio(e);

		admaxim_ad_experience.trackEvent('game_load_start');
		buildPreloader();

	    //var preload = new createjs.PreloadJS();
	    var preload = new createjs.LoadQueue(false);
	    	
	    preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", allImagesLoaded);
        preload.addEventListener("fileload", singleImageLoaded);
        preload.loadManifest(MANIFEST);

		stage.onTick = function() {
			//console.log('tick');
		}
	}

	function buildPreloader(){
		var lX = 9;
		var lY = 34;
		var lWidth = 122;
		var lHeight = 5;

		loadBarHolder = new createjs.Container();
		gameHolder = new createjs.Container();
		gameHolder.alpha = 0;

		var whitebox = new createjs.Graphics();
		whitebox.beginFill('white');
		whitebox.drawRoundRect(-8, -8, 156, 66, 6);
		var whiteboxShape = new createjs.Shape(whitebox);
		

		var shadow = new createjs.Shadow("#000000", 0, 0, 6);
		whiteboxShape.shadow = shadow;

		loadBarHolder.addChild(whiteboxShape);

		var whitebox2 = new createjs.Graphics();
		whitebox2.setStrokeStyle(4);
		whitebox2.beginStroke('#e60000');
		whitebox2.beginFill('white');
		whitebox2.drawRoundRect(0, 0, 140, 50, 3);
		var whiteboxShape2 = new createjs.Shape(whitebox2);
		loadBarHolder.addChild(whiteboxShape2);
		
		var bg = new createjs.Graphics();
		//bg.setStrokeStyle(1);
		//bg.beginStroke('black');
		bg.beginFill('#575757');
		bg.drawRect(lX, lY, lWidth, lHeight);
		var bgShape = new createjs.Shape(bg);
		loadBarHolder.addChild(bgShape);

		var lb = new createjs.Graphics();
		lb.beginFill('#e60000');
		lb.drawRect(lX, lY, lWidth, lHeight);
		loadBar = new createjs.Shape(lb);
		loadBarHolder.addChild(loadBar);

		var m = new createjs.Graphics();
		m.drawRect(lX, lY, lWidth, lHeight);
		var loadMask = new createjs.Shape(m);
		loadBarHolder.addChild(loadMask);

		loadTxt = new createjs.Text("Loading 0%", "19px Arial", "e60000");
		loadTxt.textAlign = "center";
		loadTxt.x = 70;
		loadTxt.y = 8;
		//txt.outline = true;
		loadBarHolder.addChild(loadTxt);


		loadBar.mask = loadMask;
		loadBar.scaleX = 0;
		
		loadBarHolder.x = 90 * newScale;
		loadBarHolder.y = 260;
		loadBarHolder.scaleX = loadBarHolder.scaleY = newScale;


		stage.addChild(loadBarHolder);
	}

    function handleProgress(event) {
    	//console.log(event.loaded * 100);
        loadBar.scaleX = event.loaded;
 		loadTxt.text =  "Loading" + Math.round(event.loaded * 100) + "%";
        
        if (event.loaded === 1) {
         	loadBarHolder.visible = false;
         	
         	//createjs.Tween.get(loadBarHolder).to({alpha:0},1000);
			//createjs.Tween.get(gameHolder).to({alpha:1},500);
        }
    }

    function singleImageLoaded(event) {
    	console.log('image loaded ' + event.item.id);
        var img = new Image();
        img.src = event.item.src;
        var bmp = new createjs.Bitmap(img);
        bmp.id = event.item.id;
        bmp.active = true;
        imgLib[event.item.id] = bmp;
         
    }

	function allImagesLoaded(){
		console.log('allImagesLoaded');
		gameHolder.alpha = 1;
		admaxim_ad_experience.trackEvent('game_load_complete');
		buildGame();
	}

	var introPage;
	var phonePage;
	var phoneRedMask;

	function buildGame(){
		console.log('buildGame');
		console.log(imgLib);


		phonePage = new createjs.Container();
		phonePage.addChild(imgLib['view_phone']);
		imgLib['txt_drag_sim'].x = 310;
		imgLib['txt_drag_sim'].y = 90;
		phonePage.addChild(imgLib['txt_drag_sim']);
		imgLib['sim_holder'].x = 200;
		imgLib['sim_holder'].y = 605;
		phonePage.addChild(imgLib['sim_holder']);		
		imgLib['sim'].x = 30;
		imgLib['sim'].y = 76;
		imgLib['sim'].onPress = dragSim;
		var shadow = new createjs.Shadow("#000000", 0, 0, 10);
		imgLib['sim'].shadow = shadow;
		phonePage.addChild(imgLib['sim']);
		
		phonePage.addChild(imgLib['phone_red']);

		var circle = new createjs.Graphics(); 
		//circle.beginFill("green");
		circle.drawCircle(0, 0, 90); 
		phoneRedMask = new createjs.Shape(circle);
		phoneRedMask.onPress = dragMe;
		phoneRedMask.x = 302;
		phoneRedMask.y = 682;
		phonePage.addChild(phoneRedMask);

		imgLib['phone_red'].mask = phoneRedMask;
	

		gameHolder.addChild(phonePage);






		//introPage = new createjs.Container();
		//introPage.addChild(imgLib['view_start']);
		//imgLib['logo_white'].y = 500;
		//introPage.addChild(imgLib['logo_white']);
		//introPage.onPress = startGame;
		//gameHolder.addChild(introPage);












		//gameHolder.addChild(imgLib['cloud3']);
		//imgLib['cloud3'].onPress = cloudPress;
		//imgLib['btn_terms'].onPress = function(){window.open(BRAND_TERMS_URL)};


		//createjs.Touch.enable(stage);

		stage.addChild(gameHolder);
	}

	function startGame(e){
		//preloadAudio(e);

		createjs.Tween.get(introPage).to({alpha:0},400)
			.call(function(){
				gameHolder.removeChild(introPage);
			});
		
	}





	function randomNumberBetween(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}




	function openFinalLink(){
		console.log('openFinalLink');
		admaxim_ad_experience.trackEvent('click_to_vodafone');
		window.open(FINAL_URL);
	}

	function dragMe(evt){
		var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
		evt.onMouseMove = function(ev) {
			var offsetX = ev.stageX+offset.x;
			var offsetY = ev.stageY+offset.y;
			ev.target.x = offsetX;
			ev.target.y = offsetY;
			console.log("evt.target.id:" + evt.target.id + ", x:" +  offsetX + ", y:" + offsetY);
		}
	}

	var won = false;

	function dragSim(evt){
		if (!won){
			admaxim_ad_experience.trackEvent('click_sim');
			playEffect('press_sim');
			var shadow = new createjs.Shadow("#000000", 0, 0, 20);
			imgLib['sim'].shadow = shadow;

			var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
			evt.onMouseMove = function(ev) {
				var offsetX = ev.stageX+offset.x;
				var offsetY = ev.stageY+offset.y;
				console.log(offsetX);

				var winRangeX = 75;
				var winRangeY = 30;
				var winX = 265;
				var winY = 619;
				if (offsetX < (winX + winRangeX) && offsetX > (winX - winRangeX) && offsetY < (winY + winRangeY) && offsetY > (winY - winRangeY) && !won){
					won = true;
					admaxim_ad_experience.trackEvent('game_over');
					imgLib['sim'].onPress = null;

					createjs.Tween.get(imgLib['txt_drag_sim'])
						.to({alpha:0},500)
					;

					createjs.Tween.get(imgLib['sim'])
						.to({x:338,y:winY},500,createjs.Ease.quadInOut)
						.call(function(){
							phonePage.removeChild(imgLib['sim_holder']);
							phonePage.addChild(imgLib['sim_holder']);
							playEffect('win');
						})
						.wait(400)
						.to({x:338-136},700,createjs.Ease.quadInOut)
						.call(function(){
							var newMaskScale = 6;
							createjs.Tween.get(phoneRedMask).to({scaleX:newMaskScale,scaleY:newMaskScale},2000, createjs.Ease.quadInOut);
							//createjs.Tween.get(phonePage).to({y:-200},200, createjs.Ease.quadInOut);
						})
						.wait(2000)
						.call(gameOver)
					;
				} 

				ev.target.x = offsetX;
				ev.target.y = offsetY;
				//console.log("evt.target.id:" + evt.target.id + ", x:" +  offsetX + ", y:" + offsetY);
			}

			evt.onMouseUp = function(ev) {
				if (!won){
					//imgLib['sim'].shadow = null;
					var shadow = new createjs.Shadow("#000000", 0, 0, 10);
					imgLib['sim'].shadow = shadow;
					playEffect('release_sim');
				}

			}
		}
	}


	function gameOver(){
		admaxim_ad_experience.trackEvent('show_last_page');
		console.log('gameOver');
		//imgLib['view_end'].alpha = 0;
		imgLib['view_end'].onPress = openFinalLink;

		gameHolder.addChild(imgLib['view_end']);
		imgLib['close_btn_white'].x = 661;
		gameHolder.addChild(imgLib['close_btn_white']);

		//createjs.Tween.get(imgLib['view_end']).to({alpha:1},1000);
		imgLib['view_end'].alpha = 1;
	
	}
	
































	
	function monitorTrack(effectName){
		if (trackPlaying) {
			var end = trackDic[effectName].end;
			var audioTag = document.getElementById('track1');
			var currentTime = audioTag.currentTime;
			
			if (currentTime >= end){
				window.clearInterval(audioTimer);
				audioTag.pause();
				trackPlaying = false;
				console.log('sound effect done');
			}
			
		}
	}
	
	function playEffect(effectName){
		if (audioTimer) window.clearInterval(audioTimer);
		
		var audioTag = document.getElementById('track1');
		audioTag.pause();
		var track = trackDic[effectName];
		//console.log();
		console.log('play effect ' + effectName + ' time:' + track.start);
		
		audioTag.currentTime = track.start;
		audioTag.play();
		
		trackPlaying = true;
		audioTimer = setInterval(function(){monitorTrack(effectName);}, 1);
	}
			
	function preloadAudio(){
		if (!audioLoaded){
			audioLoaded = true;
			for (var i = 0; i < TRACKS.length; i++){
				var trackObj = {};
				trackObj.start = TRACKS[i].start;
				trackObj.end = TRACKS[i].end;
				trackDic[TRACKS[i].name] = trackObj;
				console.log('added effect: ' + TRACKS[i].name);
			}
			
			var tag = "<audio id='track1'><source src='" + MP3_URL + "'></audio>";
			$('#am_page_wrapper').append(tag);
			var audioTag = document.getElementById('track1');
			
			//audioTag.addEventListener('ended',function(){audioTagEnded(e);},true);
			//audioTag.addEventListener('progress',function(e){audioTagProgress(e, userEvent);},true);
			
			audioTag.addEventListener('canplaythrough',function(e){	
				console.log('canplaythrough');
				//startLevel(4000, 3500);
				//imgLib['loading'].holder.visible = false;
				//console.log(TRACKS);
			},true);
			$('#track1').get(0).play();
			//audioTag.play();
			audioTag.pause();
		} else {
			//imgLib['loading'].holder.visible = false;
			//startLevel(4000, 3500);
		}
	}




	function shrinkCanvasForHighRes(dimentions){
		var page_scale = (dimentions.w/768);
		$('#demoCanvas').attr({'width':'768px', 'height':'1200px'});
		//$('#demoCanvas').css({'position':'absolute', 'width':'768px', 'height':'1100px'});
		$('#am_page_wrapper').css({'position':'absolute', 'width':'768px', 'height':'1200px',
			'transform-origin':'0% 0%',
			'-ms-transform-origin':'0% 0%',
			'-webkit-transform-origin':'0% 0%',
			'-moz-transform-origin':'0% 0%',
			'-o-transform-origin':'0% 0%',
			'transform': 'scale('+page_scale+','+page_scale+')',
			'-ms-transform': 'scale('+page_scale+','+page_scale+')',
			'-webkit-transform': 'scale('+page_scale+','+page_scale+')',
			'-o-transform': 'scale('+page_scale+','+page_scale+')',
			'-moz-transform': 'scale('+page_scale+','+page_scale+')',
			'-ms-transform': 'scale('+page_scale+','+page_scale+')'
		});
	}


} //end AM_Game













var cdnurl = '';
try{
	if (ADMAXIM_assetRoot != undefined) cdnurl += ADMAXIM_assetRoot + ADMAXIM_appId;
} catch(e){
	console.log('no ADMAXIM_assetRoot, must be local build');
}

var am_game;
$(document).ready(function(){
	am_game = new AM_Game();
	am_game.init();
});

