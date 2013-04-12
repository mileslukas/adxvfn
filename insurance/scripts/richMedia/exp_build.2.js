



var Exp_Shell = function(){



	var ADMAXIM_BANNER_W = 320;
	var ADMAXIM_BANNER_H = 50;

	var ADMAXIM_RICHMEDIA_W = 320;
	var ADMAXIM_RICHMEDIA_H = 500;

	var adBannerW = (ADMAXIM_BannerWidth != undefined) ? ADMAXIM_BannerWidth : ADMAXIM_BANNER_W;
	var adBannerH = (ADMAXIM_BannerHeight != undefined) ? ADMAXIM_BannerHeight : ADMAXIM_BANNER_H;

	var adExpandW = ADMAXIM_RICHMEDIA_W;
	var adExpandH = ADMAXIM_RICHMEDIA_H;


	var clickUrl = (ADMAXIM_clickUrl != undefined) ? ADMAXIM_clickUrl  : "";
	var clickId = (ADMAXIM_clickId != undefined) ? ADMAXIM_clickId  : "";

	var appId = (ADMAXIM_appId != undefined) ? ADMAXIM_appId : "";


	var standalone = getUrlVar('standalone');

	var expanded = (typeof standalone_from_url != "undefined" && standalone_from_url === "yes" || typeof standalone != "undefined" && standalone === "yes") ? true : false;


	function getUrlVar(key){
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
		return (result && unescape(result[1]) || undefined);
	}	


	//var assetRoot = (ADMAXIM_assetRoot != undefined) ? ADMAXIM_assetRoot : undefined;
	var assetRoot = "http://cdnuk.admaxim.com.s3.amazonaws.com/";

	var assetUrl;
	if (appId != "") {
		assetUrl = assetRoot + appId + '/';
	} else {
		assetUrl = '';
	}
	console.log("assetUrl:" + assetUrl);

	var iframeUrl = assetUrl + "scripts/richMedia/expanded.html?clickid=" + clickId + "&appid=" + appId + "&standalone=" + standalone;


	var adBanner = (ADMAXIM_adBanner != undefined) ? ADMAXIM_adBanner : "scripts/richMedia/media/vodafoneinsurancebanner.gif";

	//var closeBtnUrl = assetUrl + "btnClose.png";

	var AdMaximBanner = document.getElementById('AdMaximBanner');

	var adLoaded = false;

	var bannerStr = "";
	if (!expanded) bannerStr += "<img id=\"adBanner\" onclick='exp_shell.bannerClick()' src=\""+adBanner+"\" style=\"display:block; width:"+adBannerW+"px; height:"+adBannerH+"px; \" \/>";
	bannerStr += "<img id=\"AdMaximTrack\" style=\"display:block; margin:-1px 0 0 -1px; padding:0; width:1px; height:1px\" \/>";
	var iframeStr = "<iframe id='adFrame' scrolling='no' src='' width='0' height='0' style='border:none; position:absolute; top:0; left:0;'></iframe>";
	var expandedExp;
	var trackImg;
	var expandedIframe;


	function buildAd(){

		AdMaximBanner.innerHTML = bannerStr;


		var ex = document.createElement('div');
		ex.setAttribute('id', 'adExpand');
		ex.style.width = "1px";
		ex.style.height = "1px";
		ex.style.left = "-1px";
		ex.style.top = "-1px";
		ex.style.position = "absolute";
		ex.style.overflow = "hidden";
		ex.innerHTML = iframeStr;
		document.body.appendChild(ex);

		trackImg = document.getElementById("AdMaximTrack");
		expandedExp = document.getElementById("adExpand");
		expandedIframe = document.getElementById("adFrame");


		
		if (!expanded){
			var closeBtn = document.createElement('div');
			closeBtn.setAttribute('onclick', 'exp_shell.closeBtnClick()');
			closeBtn.style.width = adBannerH + "px";
			closeBtn.style.height = adBannerH + "px";
			closeBtn.style.right = "0px";
			closeBtn.style.top = "0px";
			closeBtn.style.position = "absolute";
			ex.appendChild(closeBtn);
		} else {
			expandExp();
		}


	}

	function closeExpand(){
		//expandedExp.style.display = "none";
		expandedExp.style.width = "1px";
		expandedExp.style.height = "1px";
		expandedExp.style.left = "-1px";
		expandedExp.style.top = "-1px";
		expandedIframe.width = 0;
		expandedIframe.height = 0;

		expandedIframe.src = "";
	}

	function expandExp(){
		if (!adLoaded){
			trackImg.src = clickUrl;
			adLoaded = true;
		}

		//setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
		
		expandedExp.style.width = adExpandW + "px";
		expandedExp.style.height = adExpandH + "px";
		expandedExp.style.left = "0px";
		expandedExp.style.top = "0px";

		expandedIframe.width = adExpandW;
		expandedIframe.height = adExpandH;
		expandedIframe.src = iframeUrl;
	}


	this.closeBtnClick = function(){
		if (useMraid()){	
			mraid.close();
		} else {
			closeExpand();
		}
	}

	this.bannerClick = function(){
		if (useMraid()){	
			mraid.expand();
		} else {
			expandExp();
		}
	}

	function useMraid(){
		var use;
		if (typeof mraid === "object") {
			use = true;
		} else {
			use = false;
		}
		return use;
	}





	function createAd() {

		registerMraidHandlers(mraid);

		mraid.setExpandProperties({
			width : adExpandW,
			height : adExpandH,
			useCustomClose : true
		});

		buildAd();
	};

	/*
	 * Add a listener to the stateChange event to figure out what state the client
	 * listener is in and whether to render the rich functionality or not
	 */
	function registerMraidHandlers(mraid, basePath) {
		
		mraid.addEventListener("stateChange", function(state) {
			switch (state) {
				case "hidden":
					closeExpand();
					break;

				case "expanded":
					expandExp();
					break;
				
				case "default":
					closeExpand();
					break;
			}
		});
	}


	this.init = function (){

		if (useMraid()){
			if (mraid.getState() === 'loading') {
			  	mraid.addEventListener('ready', showAd);
			} else {
			   	createAd();
			}
		} else {
			buildAd();
		}

	}



}

var exp_shell = new Exp_Shell();
exp_shell.init();












