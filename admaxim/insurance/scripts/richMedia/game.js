


var AM_Game = function(){

	var ADMAXIM_GAME_WIDTH = 320;
	var ADMAXIM_GAME_HEIGHT = 500;

	//var FINAL_URL = "http://m.vodafone.hu/mobiltarifak/red";
	// CPM
	var FINAL_URL = "http://huomdgde.hit.gemius.pl/hitredir/id=pzM1j7s6XZKBsTrsqNGWiKbjXoygPGNaC_sMchWJQdH.k7/fastid=lpksbnrketcqzjnnewkqlfrgnmma/stparam=rljmgmrfeh/url=http://m.vodafone.hu/aktualis-ajanlatok/valts/vodafone-red?ecmp=mob-aaaa0065aaaa0172-aaaa0144";
	// CPC
	//var FINAL_URL = "http://huomdgde.hit.gemius.pl/hitredir/id=pzM1j7s6XZKBsTrsqNGWiKbjXoygPGNaC_sMchWJQdH.k7/fastid=ntazyxifttpqqdmvfkftrrpfqfno/stparam=ninsixjtat/url=http://m.vodafone.hu/aktualis-ajanlatok/valts/vodafone-red?ecmp=mob-aaaa0065aaaa0172-aaaa0148";


	var newScale = 2.4;
	var oldScale = .417;

	var mycanvas,
		stage;

	var imgLib = {};

	var loadBar;
	var loadBarHolder;
	var gameHolder;	
	var startBtnContainer;

	var moduleLoaded = false;
	var crackHolder;

 	var MANIFEST = [
 		{src:"media/game/close_btn_white.png", id:"close_btn_white"},
		{src:"media/game/logo_white.png", id:"logo_white"},
		{src:"media/game/view_tap_hg.png", id:"view_tap"},
		{src:"media/game/view_end_hg.png", id:"view_end"},
		{src:"media/game/crack1.png", id:"crack1"},
		{src:"media/game/crack2.png", id:"crack2"},
		{src:"media/game/crack3.png", id:"crack3"},
		{src:"media/game/btn_fix_hg.png", id:"btn_fix"}
	];


	var audioTimer;
	var trackDic = {};
	var trackPlaying = false;
	var audioLoaded = false;
	var MP3_URL = "media/game/glass_track2.mp3";
	var TRACKS = [
		{name:'crack1', start:0, end:.9},
		{name:'crack2', start:1, end:1.9},
		{name:'crack3', start:2, end:2.9}
	];

	var firstTouch = true;


	this.init = function(){
		if (console) console.log('init - game');
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
			if (console) console.log('createjs ready');
			mycanvas = document.getElementById('demoCanvas');
			stage = new createjs.Stage(mycanvas);
			
			createjs.Ticker.addListener(stage);
			createjs.Ticker.setFPS(16);
		
			buildStartBtn();
			//setUpGame();
		} else {
			setTimeout(function(){
				setUpCanvas();
			},500);
			
			if (console) console.log('createjs undefined');
		}
	}

	function buildStartBtn(){

		var startBtnContainer = new createjs.Container();

		var action_txt_img = new Image();
		action_txt_img.src = "media/game/txt_touch_here.png";
        var action_txt_bmp = new createjs.Bitmap(action_txt_img);
        imgLib["action_txt"] = action_txt_bmp;
        imgLib["action_txt"].y = 283;
        startBtnContainer.addChild(imgLib["action_txt"]);

        if (!isStandalone){
	        var close_btn_red_img = new Image();
			close_btn_red_img.src = "media/game/close_btn_red.png";
	        var close_btn_red_bmp = new createjs.Bitmap(close_btn_red_img);
	        imgLib["close_btn_red"] = close_btn_red_bmp;
	        imgLib["close_btn_red"].x = 661;
	        startBtnContainer.addChild(imgLib["close_btn_red"]);
    	}

		var startGraphic = new createjs.Graphics();
		startGraphic.beginFill('green');
		startGraphic.drawRect(0, 0, 768, 1200);
		var startBtn = new createjs.Shape(startGraphic);
		startBtn.alpha = 0.01;
		startBtn.onPress = setUpGame;
		startBtnContainer.addChild(startBtn);
		
		stage.addChild(startBtnContainer);

		createjs.Touch.enable(stage);

		

		/*
		startBtn = new createjs.Shape();
		startBtn.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#f00").drawRect(0,0,768,1200));
		startBtn.onPress = setUpGame;
		*/
	}

	
	function setUpGame(e){
		preloadAudio(e);
		stage.removeChild(startBtnContainer);

		admaxim_ad_experience.trackEvent('game_load_start');

		buildPreloader();

	    //var preload = new createjs.PreloadJS();
	    var preload = new createjs.LoadQueue(false);
	    	
	    preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", allImagesLoaded);
        preload.addEventListener("fileload", singleImageLoaded);
        preload.loadManifest(MANIFEST);

		stage.onTick = function() {
			//if (console) console.log('tick');
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
		whitebox2.beginStroke('#E2231A');
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
		lb.beginFill('#E2231A');
		lb.drawRect(lX, lY, lWidth, lHeight);
		loadBar = new createjs.Shape(lb);
		loadBarHolder.addChild(loadBar);

		var m = new createjs.Graphics();
		m.drawRect(lX, lY, lWidth, lHeight);
		var loadMask = new createjs.Shape(m);
		loadBarHolder.addChild(loadMask);

		loadTxt = new createjs.Text("Loading 0%", "19px Arial", "E2231A");
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
    	//if (console) console.log(event.loaded * 100);
        loadBar.scaleX = event.loaded;
 		loadTxt.text = "Loading " + Math.round(event.loaded * 100) + "%";
        
        if (event.loaded === 1) {
         	loadBarHolder.visible = false;
         	
         	//createjs.Tween.get(loadBarHolder).to({alpha:0},1000);
			//createjs.Tween.get(gameHolder).to({alpha:1},500);
        }
    }

    function singleImageLoaded(event) {
    	if (console) console.log('image loaded ' + event.item.id);
        var img = new Image();
        img.src = event.item.src;
        var bmp = new createjs.Bitmap(img);
        bmp.id = event.item.id;
        bmp.active = true;
        imgLib[event.item.id] = bmp;
         
    }

	function allImagesLoaded(){
		if (console) console.log('allImagesLoaded');
		gameHolder.alpha = 1;
		buildGame();
	}


	function buildGame(){
		if (console) console.log('buildGame');

		admaxim_ad_experience.trackEvent('game_load_complete');

		if (console) console.log(imgLib);
		//createjs.Touch.enable(stage);








		crackHolder = new createjs.Container();
		//imgLib['view_tap'].alpha = 0;
		crackHolder.addChild(imgLib['view_tap']);

		imgLib['logo_white'].y = 500;
		crackHolder.addChild(imgLib['logo_white']);

		crackHolder.onPress = makeCrack;
		gameHolder.addChild(crackHolder);	

		imgLib['btn_fix'].onPress = gameOver;
		imgLib['btn_fix'].y = 530;
		imgLib['btn_fix'].x = 80;
		imgLib['btn_fix'].visible = false;
		gameHolder.addChild(imgLib['btn_fix']);


		//imgLib['view_start'].onPress = startGame;
		//gameHolder.addChild(imgLib['view_start']);
		

		//imgLib['logo'].y = 500;
		//gameHolder.addChild(imgLib['logo']);


		imgLib['view_end'].visible = false;
		imgLib['view_end'].alpha = 0;
		imgLib['view_end'].onPress = openFinalLink;
		gameHolder.addChild(imgLib['view_end']);



		imgLib['close_btn_white'].x = 661;

		if (!isStandalone) gameHolder.addChild(imgLib['close_btn_white']);



		//gameHolder.addChild(imgLib['cloud3']);
		//imgLib['cloud3'].onPress = cloudPress;
		//imgLib['btn_terms'].onPress = function(){window.open(BRAND_TERMS_URL)};


		//createjs.Touch.enable(stage);

		stage.addChild(gameHolder);
	}

	/*
	function startGame(e){
		//preloadAudio(e);

		createjs.Tween.get(imgLib['view_start']).to({alpha:0},400)
			.call(function(){
				gameHolder.removeChild(imgLib['view_start']);
			});
		createjs.Tween.get(imgLib['logo']).to({alpha:0},400)
			.call(function(){
				gameHolder.removeChild(imgLib['logo']);
			});

		createjs.Tween.get(imgLib['view_tap']).to({alpha:1},1000);
		createjs.Tween.get(imgLib['logo_white']).to({alpha:1},1000);
		
	}*/


	var currentCrackSound = 1;

	function makeCrack(evt){
		admaxim_ad_experience.trackEvent('screen_crack');
		
		var x = evt.stageX;
		var y = evt.stageY;
		if (console) console.log(evt);

		playEffect("crack" + randomNumberBetween(1,3));
		var newCrack = imgLib['crack' + randomNumberBetween(1,3)].clone();

		if (currentCrackSound > 2) currentCrackSound = 1;
			else currentCrackSound += 1;

		newCrack.x = x;
		newCrack.y = y;
		newCrack.regX = 440;
		newCrack.regY = 440;
		newCrack.rotation = randomNumberBetween(0, 360);
		crackHolder.addChild(newCrack);

		if (!imgLib['btn_fix'].visible){
			imgLib['btn_fix'].visible = true;
			imgLib['logo_white'].visible = false;
		}
	}


	function randomNumberBetween(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	function gameOver(){

		admaxim_ad_experience.trackEvent('game_over');

		createjs.Tween.get(crackHolder)
			.to({alpha:0},400)
			.call(function(){
				crackHolder.visible = false;
			});


		imgLib['view_end'].visible = true;
		//createjs.Tween.get(imgLib['view_end']).to({alpha:1},0);
		imgLib['view_end'].alpha = 1;

		setTimeout(function(){
			openFinalLink();
		}, 3000);
	}

	function openFinalLink(){
		admaxim_ad_experience.trackEvent('click_to_vodafone');
		if (console) console.log('openFinalLink');
		window.open(FINAL_URL);
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
				if (console) console.log('sound effect done');
			}
			
		}
	}
	
	function playEffect(effectName){
		if (audioLoaded){
			if (audioTimer) window.clearInterval(audioTimer);
			
			var audioTag = document.getElementById('track1');
			audioTag.pause();
			var track = trackDic[effectName];
			//if (console) console.log();
			if (console) console.log('play effect ' + effectName + ' time:' + track.start);
			
			audioTag.currentTime = track.start;
			audioTag.play();
			
			trackPlaying = true;
			audioTimer = setInterval(function(){monitorTrack(effectName);}, 1);
		}
	}
			
	function preloadAudio(userEvent){
		if (!audioLoaded){
			for (var i = 0; i < TRACKS.length; i++){
				var trackObj = {};
				trackObj.start = TRACKS[i].start;
				trackObj.end = TRACKS[i].end;
				trackDic[TRACKS[i].name] = trackObj;
				if (console) console.log('added effect: ' + TRACKS[i].name);
			}
			
			var tag = "<audio id='track1'><source src='" + MP3_URL + "'></audio>";
			$('#am_page_wrapper').append(tag);
			var audioTag = document.getElementById('track1');
			
			//audioTag.addEventListener('ended',function(){audioTagEnded(e);},true);
			//audioTag.addEventListener('progress',function(e){audioTagProgress(e, userEvent);},true);
			
			audioTag.addEventListener('canplaythrough',function(e){	
				if (console) console.log('canplaythrough');
				audioLoaded = true;
				//startLevel(4000, 3500);
				//imgLib['loading'].holder.visible = false;
				//if (console) console.log(TRACKS);
			},true);
			
			audioTag.play();
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
	if (console) console.log('no ADMAXIM_assetRoot, must be local build');
}

var am_game;
$(document).ready(function(){
	am_game = new AM_Game();
	am_game.init();
});

