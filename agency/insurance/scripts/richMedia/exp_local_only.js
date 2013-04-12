// version 2.1

var admaxim_ad_local_test = true;

var CDN_URL = "https://s3.amazonaws.com/cdn2.admaxim";

var ADMAXIM_adBanner,
	ADMAXIM_assetRoot,  
	ADMAXIM_trackingBaseUrl, 
	ADMAXIM_appId,
	ADMAXIM_clickId,
	ADMAXIM_clickUrl,
	ADMAXIM_device,
	ADMAXIM_width,
	ADMAXIM_height,
	ADMAXIM_useYouTube,
	ADMAXIM_BannerWidth,
	ADMAXIM_BannerHeight,
	ADMAXIM_campaignId;
	
var PUBLISHER_CONTENT_WIDTH,
	PUBLISHER_CONTENT_HEIGHT;

// load server variables first
if (admaxim_ad_local_test) {
	AM_adReady();
} else {
	AM_include_js(PATH + '/getInteractiveAds?fmt=html' + '&siteId=' + SITE + "&country=" + COUNTRY + "&ts=" + (new Date()).getTime() + "&size=" + SIZE, AM_adReady);
}

// then load experience
function AM_adReady(){
	if (admaxim_ad_local_test){
		AM_include_js("scripts/richMedia/exp_build.2.js", AM_expDone);	
	} else {
		AM_include_js(CDN_URL + "/" + ADMAXIM_appId + "/scripts/richMedia/exp_build.2.js", AM_expDone);
	}
}

function AM_include_js(file, nextFunction) {
	var html_doc = document.getElementsByTagName('head')[0];
	var js = document.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', file);
	html_doc.appendChild(js);

	js.onload = function () {
		nextFunction();
	}
	return false;
}

function AM_expDone(){
	//console.log("exp.js complete");
}

