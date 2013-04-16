// version 2.8.7 match adscale for custom html [*adscale]
// version 2.8.6 added no menu support
// version 2.8.5 added new img tracking
// version 2.8.4 tracking update
// version 2.8.2 update to scale ads on anything but ios

var _gaq = _gaq || [];
_gaq.push(['admaxim_tracking._setAccount', 'UA-37035980-1']);
_gaq.push(['admaxim_tracking._trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


var admaxim_ad_experience;
var admaxim_jquery = "js/jquery-1.9.1.min.js";
var admaxim_additional_js = [];
var admaxim_num_loaded_js = 0;

var admaxim_ad_expanded = false;

var admaxim_ad_device_ios;

function AdMaxim_load_additional_js() {
	for (var i = 0; i < admaxim_additional_js.length; i++) {
		AdMaxim_load_js(admaxim_additional_js[i], AdMaxim_scriptLoaded);
	}
}

function AdMaxim_load_js(file, nextFunction) {
	if (console) console.log("FIRST LOAD: " + file);
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

function AdMaxim_scriptLoaded() {
	admaxim_num_loaded_js += 1;
	if (console) console.log('scriptLoaded ' + admaxim_num_loaded_js);
	if (admaxim_num_loaded_js >= admaxim_additional_js.length) {
		
		admaxim_ad_experience = new AdMaximAdExperience();
		admaxim_ad_experience.adConfig();
	}
}



//(function($){ 


AdMaxim_load_js(admaxim_jquery, AdMaxim_scriptLoaded);


var AdMaximAdExperience = function() {
	
	this.currentPageNum = 0;
	
	var trackingEnabled = false;
	//var startingPage = 0;
	var currentPage = 0;
	var currentMenuBtn = 0;
	var admaxim_ad_page_title = [];
	var assetUrl;
	var trackingUrl;
	var trackingUrl2;

	var ad_width,
		ad_height,
		htmlVideo,
		menuHighlight,
		pageData,
		pageW,
		clickUrl;
		
	var newScale;
		
	var that = this;
		
	var audioTags = [];
	var videoTags = [];
	var trackingDic = {};
	var trackingDic2 = {};	
	var menuNumDic = {};
	var scriptList = [];
	
	/* VIDEO PERCENTAGE TRACKING */
	var playProgressInterval;
	var playTracking = false;
	var vidTrackDic = {};
	var vidTrackArr = [];
	var currentVideoId;
	
	/* AUDIO PERCENTAGE TRACKING */
	var audioPlayProgressInterval;
	var audioPlayTracking = false;
	var audioTrackDic = {};
	var audioTrackArr = [];
	var currentAudioId;
		
	var youtubeApiLoaded = false;
	var useYoutubeApi = false;

	var numOfPages,
		currentLinkMenuContent = "",
		videoEventFired = false,
		firstRun = true;

	var isPageLoaded = [];	
	var youtubePlayers = [];

	var standalone = false;
	

	this.adConfig = function(){
				
		var dataFileName = "data.js?nocache="+new Date().getTime();

		dataPath = dataFileName;
		assetUrl = '';
	
		try {
			if (admaxim_ad) {
				startBuild();
			}
		} catch (e) {
			include_js(dataPath, startBuild);
		}
	}
	
	
	function startBuild() {

		startingpage = (admaxim_ad.resources.startingpage != undefined) ? admaxim_ad.resources.startingpage : currentPage;
		
		trackingDic["firstexpand"] = clickUrl;
		trackingDic2["firstexpand"] = admaxim_ad.resources.additionaltracking.firstexpand2;
		
		var trackString = "";

		bannerStr = "<img id=\"AdMaximTrack\" style=\"display:block; margin:-1px 0 0 -1px; padding:0; width:1px; height:1px\" \/><img id=\"AdMaximTrack2\" style=\"display:block; margin:-1px 0 0 -1px; padding:0; width:1px; height:1px\" \/>";
	
		$('#AdMaximRichMedia').append(bannerStr);
		
		//$('#AdMaximRichMedia').click(function(){ dropBanner(); });
		
		pageData = admaxim_ad.resources.gallery.pages;
		numOfPages = pageData.length;
		
		writeDivs();
		// get URL params
		//var jsonUrl = jQuery.url.param("j");
		//if (jsonUrl === undefined) trc('json string not added in the url');
		
		// load json 
		//$.getJSON(jsonUrl, function(data) { ad = data; writeDivs(); });
		
	}
	
	function writeDivs() {
		var ex="";
		ex += "	<div id=\"ad_wrapper\">";
		ex += "   	<div id=\"mainContentArea\">";
		ex += "     	<div id=\"pageHolder\">";
		
		for(i=0;i < numOfPages; i++){
			ex += "         	<div id=\"page"+i+"\" class=\"page\">";
			ex += "            		<img id=\"page"+i+"-bg\" \/>";
			ex += "       		<\/div>";
			admaxim_ad_page_title.push(pageData[i].title);
			
			trackingDic['page'+i] = pageData[i].track;
			trackingDic2['page'+i] = pageData[i].track2;
		}

		ex += "      	<\/div>";
		ex += "		<\/div>";
		
		if (admaxim_ad.resources.usemenu != "no") {
			ex += "		<div id=\"menuBar\">";
			ex += "  		<img id=\"menuBgImg\">";
			ex += "		<div id=\"menuBtnHolder\"><\/div>";
		}
		ex += "		<\/div>";
		
		ex += "	<\/div>";
		
		$('body').append(ex);
		
		createAd();
	}
	
	
		
	function createAd() {
		var expand = "yes";
		trackingEnabled = (admaxim_ad.resources.enabletracking === "no")? false : true;
		trackingUrl = admaxim_ad.resources.trackingpath;
		trackingUrl2 = admaxim_ad.resources.trackingpath2;
		
		var xtraTrack = admaxim_ad.resources.additionaltracking;
		//trackingDic["firstexpand"] = xtraTrack.firstexpand;
		trackingDic["expand"] = xtraTrack.expand;
		if (xtraTrack.swipeleft) trackingDic["swipeleft"] = xtraTrack.swipeleft;
		if (xtraTrack.swiperight) trackingDic["swiperight"] = xtraTrack.swiperight;
		if (admaxim_ad.resources.arrows) trackingDic["trackleft"] = admaxim_ad.resources.arrows.trackleft;
		if (admaxim_ad.resources.arrows) trackingDic["trackright"] = admaxim_ad.resources.arrows.trackright;
		
		trackingDic2["firstexpand2"] = xtraTrack.firstexpand2;
		trackingDic2["expand2"] = xtraTrack.expand2;
		if (xtraTrack.swipeleft2) trackingDic2["swipeleft2"] = xtraTrack.swipeleft2;
		if (xtraTrack.swiperight2) trackingDic2["swiperight2"] = xtraTrack.swiperight2;
		if (admaxim_ad.resources.arrows) trackingDic2["trackleft2"] = admaxim_ad.resources.arrows.trackleft2;
		if (admaxim_ad.resources.arrows) trackingDic2["trackright2"] = admaxim_ad.resources.arrows.trackright2;
		
		
		/*
		var w;
		var h;
		
		if (PUBLISHER_CONTENT_WIDTH != undefined) {
			w = PUBLISHER_CONTENT_WIDTH;
		} else {
			w = (ADMAXIM_width != undefined) ? ADMAXIM_width : 768;
		}
		
		if (PUBLISHER_CONTENT_HEIGfHT != undefined) {
			h = PUBLISHER_CONTENT_HEIGHT;
		} else {
			h = (ADMAXIM_height != undefined) ? ADMAXIM_height : 1104;
		}
		*/
		

		var isMobile = {
	    	Android: function() {
	        	return navigator.userAgent.match(/Android/i);
	    	},
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i);
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		    }
		};
		
		//var originalDesignW = 320;
		
		ad_width = admaxim_ad.resources.width;
		ad_height = admaxim_ad.resources.height;
		var menuH = admaxim_ad.resources.menuheight;

		var ad_scale = 1;//(320/768);
		
		
		if( isMobile.any() && !isMobile.iOS()){
			admaxim_ad_device_ios = false;
		} else {
			admaxim_ad_device_ios = true;
		}

		if( isMobile.any() ){
			newScale = ($(window).width() / ad_width);
		} else {
			newScale = 1;
		}



		if (console) console.log('newScale ' + newScale);
	
		//var newScale = 1;
	

		//ad_height = 900;
		
		var viewableHeight = ad_height;
		//var viewableHeight = 900;
		
		//var menuH = ad_height*.0933;
		
		var menuW = ad_width;
		
		var menuBtnH = menuH;
		var menuBtnW = ad_width;
			
		var pageH = (admaxim_ad.resources.usemenu != "no") ? ad_height-menuH : ad_height;
		pageW = ad_width;
		
		var divNames = new Array('#ad_wrapper','#pageHolder','#menuLinkDiv', '#menuBar', '#menuBtnHolder', '#mainContentArea', '#mainContentNav');
		for(i=0;i < divNames.length; i++)
		{
			$(divNames[i]).css({'margin':'0px','padding':'0px','position':'absolute'});
		}
		
		//if (expand === 'yes'){
			//ad_wrapperTop = 0;
		//} else {
			ad_wrapperTop = -viewableHeight;
		//}
		
		$('#ad_wrapper').css({
			'width':ad_width+'px',
			'height':viewableHeight+'px',
			'top':ad_wrapperTop+'px',
			'left':'0px','z-index':'9999',
			'overflow':'hidden',
			'color':'#FFF',
			'background':'white',
			'font-family':'Arial',
			'text-align':'center',
			'transform-origin':'0% 0%',
			'-ms-transform-origin':'0% 0%',
			'-webkit-transform-origin':'0% 0%',
			'-moz-transform-origin':'0% 0%',
			'-o-transform-origin':'0% 0%',
			'transform': 'scale('+newScale+','+newScale+')',
			'-ms-transform': 'scale('+newScale+','+newScale+')',
			'-webkit-transform': 'scale('+newScale+','+newScale+')',
			'-o-transform': 'scale('+newScale+','+newScale+')',
			'-moz-transform': 'scale('+newScale+','+newScale+')',
			'-ms-transform': 'scale('+newScale+','+newScale+')'
		});

		$('#AdMaximRichMedia').css({
			'transform-origin':'0% 0%',
			'-ms-transform-origin':'0% 0%',
			'-webkit-transform-origin':'0% 0%',
			'-moz-transform-origin':'0% 0%',
			'-o-transform-origin':'0% 0%',
			'transform': 'scale('+newScale+','+newScale+')',
			'-ms-transform': 'scale('+newScale+','+newScale+')',
			'-webkit-transform': 'scale('+newScale+','+newScale+')',
			'-o-transform': 'scale('+newScale+','+newScale+')',
			'-moz-transform': 'scale('+newScale+','+newScale+')',
			'-ms-transform': 'scale('+newScale+','+newScale+')'
		});
		
		var menuSpace;
		if (admaxim_ad.resources.usemenu != "no") menuSpace = menuH;
			else menuSpace = 0;

		$('#pageHolder')
			.css({'width':pageW +'px','height':pageH +'px','top':menuSpace+'px','left':'0px'});
	
		$('#menuBar')
			.css({'margin':'0','padding':'0','position':'absolute','left':'0px','top':'0px','width':menuW+'px','height':menuH+'px'});
		
		$('#menuBgImg')
			.css({'margin':'0','padding':'0','position':'absolute','left':'0px','top':'0px','width':menuW+'px','height':menuH+'px'});
		
		$('#menuBtnHolder')
			.css({'margin':'0 auto','padding':'0','position':'absolute','left':'0px','top':'0px','width':menuW+'px','height':menuH+'px'});
		
		$('#mainContentArea')
			.css({'margin':'0','padding':'0','position':'absolute','left':'0px','top':'0px','width':ad_width+'px','height':ad_height+'px'});
			
			
	
		///LOOP FOR ALL PAGES BUILD
		for(i = 0;i < pageData.length; i++) {

			isPageLoaded[i] = false;

			//create css
			$('#page' + i)
				.css('width', pageW +'px')
				//.css('height', pageH +'px')
				.css('position','absolute')
				.css('top','0px')
				.css('left', pageW*i + 'px')
				.css('bottom', '0px')
				//.css('border','2px solid red')
				//.css('background-color', 'yellow')
			;
			
			//load one page now and load the rest on dropBanner
			if (i === 0) $('#page' + i + '-bg').attr('src', assetUrl + pageData[i].background);
			
				
			$('#page' + i + '-bg')
				.css('position','absolute')
				.css('top','0px')
				.css('left','0px')
				.css('height', pageH + 'px')
				.css('width', pageW + 'px')
				.css('margin','0px')
				.css('padding','0px');
			
			
			
			//add imagelayers
			if (pageData[i].imagelayer != undefined) {
				
				
				for(var h = 0;h < pageData[i].imagelayer.length; h++) {
					var divName = "page" + i + "imagelayer" + h;
					var linkDiv = "<div id=\""+divName+"\" class=\"imagelayerDiv\"><\/div>";
					$('#page' + i).append(linkDiv);
				}
				
				//add imagelayer positions
				for(var g = 0; g < pageData[i].imagelayer.length; g++) {
					var data = pageData[i].imagelayer[g];
					$('#page' + i + 'imagelayer' + g)
						.css('width', (data.width*ad_scale) + 'px')
						.css('height', (data.height*ad_scale) + 'px')
						.css('top', (data.y*ad_scale) + 'px')
						.css('left', (data.x*ad_scale) + 'px')
						.css('position','absolute');
					
					var bgImage = data.background;
					if (bgImage != undefined) {
						$('#page' + i + 'imagelayer' + g).css('background','url('+ assetUrl + data.background +')')
						.css('background-size',(data.width*ad_scale) + 'px ' + (data.height*ad_scale) + 'px');
					}
				}
			}
			
			//add links
			if (pageData[i].links != undefined) {
				for(var j = 0;j < pageData[i].links.length; j++) {
					
					var linkName = "page"+i+"link"+j;
					var linkDiv = "<div id=\""+linkName+"\" class=\"linkDiv\" ";
					var linkData = pageData[i].links[j];

					if (linkData.url != undefined) {
						var linkUrl;
						if (linkData.type == "fb_share") {
							linkUrl = "http://www.facebook.com/sharer.php?u=" + linkData.url;
						} else if (linkData.type == "twt_share") {
							linkUrl = "https://twitter.com/share?url=" + linkData.url;
						} else {
							linkUrl = linkData.url;
						}
						linkDiv +=  "onclick=\"admaxim_ad_experience.openOutsideLink('"+linkUrl+"','"+linkName+"', '"+linkName+"')\"";
					}
					linkDiv +=  "><\/div>";
	
					$('#page' + i).append(linkDiv);
					//trc('added link #page' + i + 'link' + j);
					trackingDic[linkName] = linkData.track;
					trackingDic2[linkName] = linkData.track2;
				}
				
				//add link positions
				for(var k = 0;k < pageData[i].links.length; k++) {
					$('#page' + i + 'link' + k)
						.css('width', (pageData[i].links[k].width*ad_scale) + 'px')
						.css('height', (pageData[i].links[k].height*ad_scale) + 'px')
						.css('top', (pageData[i].links[k].y*ad_scale) + 'px')
						.css('left', (pageData[i].links[k].x*ad_scale) + 'px')
						.css('position','absolute')
						.css('cursor','pointer');
						//.css('background', '#ffcc00')
						//.css('opacity','.8');
					if (admaxim_ad.resources.showhotspots === "yes"){
						$('#page' + i + 'link' + k)
							.css('border', '5px dotted #66ff00')
							.css('opacity','.6');
					}
					
					var bgImage = pageData[i].links[k].background;
					if (bgImage != undefined) {
						$('#page' + i + 'link' + k).css('background','url('+ assetUrl + pageData[i].links[k].background +')')
						.css('background-size',(pageData[i].links[k].width*ad_scale) + 'px ' + (pageData[i].links[k].height*ad_scale) + 'px');
					}
				}
			}
			
			//add video
			if (pageData[i].video != undefined) {
				for(var v = 0;v < pageData[i].video.length; v++) {		
					var id = "page"+i+"video"+v;
					vidTrackArr.push(id);
					vidTrackDic[id];
					var videoObj = "";
									
					var checkUrl = assetUrl + pageData[i].video[v].url;
					var videoTypeCheck = 0;
					
					if (checkUrl.indexOf("youtube.com") < 0) videoTypeCheck = 2;
						else videoTypeCheck = 1;
					
					if (videoTypeCheck == 1){
						useYoutubeApi = true;
						var linkYouTube = checkUrl;
						
						if (linkYouTube.indexOf('http://www.youtube.com/embed/') > -1) {
							appendValue = linkYouTube.substring(linkYouTube.indexOf('embed/') + 6);

						} else if (linkYouTube.indexOf("http://youtu.be/") > -1) {
							appendValue = linkYouTube.substring(linkYouTube.indexOf('.be/') + 4);

						} else if (linkYouTube.indexOf("http://www.youtube.com/watch?v=") > -1) {
							if (linkYouTube.indexOf('&feature') > -1) {
								appendValue = linkYouTube.substring(linkYouTube.indexOf('?v=') + 3 , linkYouTube.indexOf('&feature'));
							} else {
								appendValue = linkYouTube.substring(linkYouTube.indexOf('?v=') + 3 );
							}		
						}		
						
						videoObj = "<iframe id=\""+id+"\" src='http://www.youtube.com/embed/" + appendValue + "' frameborder='0' scrolling='no' tabindex='0' ></iframe>";
						$('#page' + i).append(videoObj);
					}
					else if (videoTypeCheck == 2) {
						videoObj += "<video id=\""+id+"\" controls=\"controls\" ";
						if (pageData[i].video[v].poster)  videoObj += "poster=\""+ assetUrl + pageData[i].video[v].poster+"\" ";
						videoObj +=">";
						
						var singleFileName = "";
						
						if(assetUrl + pageData[i].video[v].url.indexOf("http://") < 0 && assetUrl + pageData[i].video[v].url.indexOf("https://") < 0){
							singleFileName = assetUrl + pageData[i].video[v].url.split(".")[0];
							videoObj +="<source src=\"" + assetUrl + singleFileName + ".mp4" +"\" type=\"video\/mp4\">";
							videoObj +="<source src=\"" + assetUrl + singleFileName + ".ogg" +"\" type=\"video\/ogg\">";
							videoObj +="<source src=\"" + assetUrl + singleFileName + ".webm" +"\" type=\"video\/webm\">";
						}
						else
						{
							singleFileName = assetUrl + pageData[i].video[v].url.substring(0,assetUrl + pageData[i].video[v].url.lastIndexOf("."));
							videoObj +="<source src=\""+ singleFileName + ".mp4" + "\" type=\"video\/mp4\">";
							videoObj +="<source src=\""+ singleFileName + ".ogg" + "\" type=\"video\/ogg\">";
							videoObj +="<source src=\""+ singleFileName + ".webm" + "\" type=\"video\/webm\">";						
						}
						
						videoObj +="<\/video>";
						$('#page' + i).append(videoObj);

						var videoTag = $('#' + id)[0];
						videoTags.push(videoTag);
						
						//add tracking listeners
						videoTag.addEventListener('play',function(event){
							that.trackEvent(event.target.id+'_play', event.target.id+'_play');
							currentVideoId = event.target.id;
							that.trackPlayProgress();
						},true);
						videoTag.addEventListener('pause',function(event){
							that.trackEvent(event.target.id+'_pause', event.target.id+'_pause');
							that.stopTrackingPlayProgress();
						},true);
						videoTag.addEventListener('ended',function(event){
							//that.trackEvent(event.target.id+'_ended', event.target.id+'_ended');
							that.resetVideoFlags();
						},true);

					}

					trackingDic[id+'_play'] = pageData[i].video[v].track.play;
					trackingDic[id+'_pause'] = pageData[i].video[v].track.pause;
					trackingDic[id+'_25'] = pageData[i].video[v].track.percent25;
					trackingDic[id+'_50'] = pageData[i].video[v].track.percent50;
					trackingDic[id+'_75'] = pageData[i].video[v].track.percent75;
					trackingDic[id+'_ended'] = pageData[i].video[v].track.ended;
					
					trackingDic2[id+'_play'] = pageData[i].video[v].track2.play;
					trackingDic2[id+'_pause'] = pageData[i].video[v].track2.pause;
					trackingDic2[id+'_25'] = pageData[i].video[v].track2.percent25;
					trackingDic2[id+'_50'] = pageData[i].video[v].track2.percent50;
					trackingDic2[id+'_75'] = pageData[i].video[v].track2.percent75;
					trackingDic2[id+'_ended'] = pageData[i].video[v].track2.ended;

				}
				
				//add positions
				for(var o = 0;o < pageData[i].video.length; o++) {
					$("#page"+i+"video"+o)
						.css('width', (pageData[i].video[o].width*ad_scale) + 'px')
						.css('height', (pageData[i].video[o].height*ad_scale) + 'px')
						.css('top', (pageData[i].video[o].y*ad_scale) + 'px')
						.css('left', (pageData[i].video[o].x*ad_scale) + 'px')
						.css('position','absolute');
				}
			
			}
			
			
			//add audio
			if (pageData[i].audio != undefined) {
				
				
				for(var n = 0;n < pageData[i].audio.length; n++)
				{		
					var id = "page"+i+"audio"+n;
		
					audioTrackArr.push(id);
					audioTrackDic[id];
				
	
					var audioObj = "";
					audioObj +=" <audio id=\""+id+"\">";
					audioObj +="   <source src=\""+ assetUrl +pageData[i].audio[n].url+"\" type=\"audio\/mpeg\" \/>";
					audioObj +="   <source src=\""+ assetUrl +pageData[i].audio[n].url+"\" type=\"audio\/ogg\" \/>";
					audioObj +=" <\/audio>";
					audioObj +=" <div id=\""+id+"-bg\">";
					audioObj +="   <div id=\""+id+"-play\"><\/div>";
    				audioObj +="   <div id=\""+id+"-pause\"><\/div>";
    				audioObj +="   <div id=\""+id+"-progress-bg\">";
    				audioObj +="     <div id=\""+id+"-progress\"><\/div>";
					audioObj +="   <\/div>";
					audioObj +=" <\/div>";
					
					$('#page' + i).append(audioObj);
					
					$("#"+id+"-bg")
						.css('width', '679px')
						.css('height', '188px')
						.css('top', pageData[i].audio[n].y + 'px')
						.css('left', pageData[i].audio[n].x + 'px')
						.css('background', 'url('+ assetUrl + pageData[i].audio[n].bg + ') no-repeat')
						.css('position','absolute');
					
					$("#"+id+"-play")
						.css('width', '65px')
						.css('height', '76px')
						.css('top', '50px')
						.css('left', '50px')
						.css('background', 'url('+ assetUrl + pageData[i].audio[n].play + ') no-repeat')
						.css('position','absolute');
						
					$("#"+id+"-play").click(function(){
						$("#"+id)[0].play();
						$("#"+id+"-play").hide();
						$("#"+id+"-pause").show();
					});	
						
					$("#"+id+"-pause")
						.css('width', '65px')
						.css('height', '76px')
						.css('top', '50px')
						.css('left', '50px')
						.css('background', 'url('+ assetUrl + pageData[i].audio[n].pause + ') no-repeat')
						.css('position','absolute');
					$("#"+id+"-pause").hide();
					$("#"+id+"-pause").click(function(){
						$("#"+id)[0].pause();
						$("#"+id+"-play").show();
						$("#"+id+"-pause").hide();
					});
						
					$("#"+id+"-progress-bg")
						.css('width', '480px')
						.css('height', '25px')
						.css('top', '80px')
						.css('left', '150px')
						.css('background', 'url('+ assetUrl + pageData[i].audio[n].progress_bg + ') repeat-x')
						.css('position','absolute')
						.css('overflow','hidden');
						
					$("#"+id+"-progress")
						.css('width', '0%')
						.css('height', '25px')
						.css('top', '0px')
						.css('left', '0px')
						.css('background', 'url('+ assetUrl + pageData[i].audio[n].progress + ') repeat-x')
						.css('position','absolute');						
					
					var audioTag = $('#' + id)[0];
					audioTags.push(audioTag);
					
					//add tracking listeners
					trackingDic[id+'_play'] = pageData[i].audio[n].track.play;
					trackingDic[id+'_pause'] = pageData[i].audio[n].track.pause;
					trackingDic[id+'_25'] = pageData[i].audio[n].track.percent25;
					trackingDic[id+'_50'] = pageData[i].audio[n].track.percent50;
					trackingDic[id+'_75'] = pageData[i].audio[n].track.percent75;
					trackingDic[id+'_ended'] = pageData[i].audio[n].track.ended;
					
					trackingDic2[id+'_play'] = pageData[i].audio[n].track2.play;
					trackingDic2[id+'_pause'] = pageData[i].audio[n].track2.pause;
					trackingDic2[id+'_25'] = pageData[i].audio[n].track2.percent25;
					trackingDic2[id+'_50'] = pageData[i].audio[n].track2.percent50;
					trackingDic2[id+'_75'] = pageData[i].audio[n].track2.percent75;
					trackingDic2[id+'_ended'] = pageData[i].audio[n].track2.ended;
					
					//add tracking listeners
					
					audioTag.addEventListener('play',function(event){
						that.trackEvent(event.target.id+'_play', event.target.id+'_play');
						currentAudioId = event.target.id;
						that.trackPlayProgressAudio();
					},true);
					audioTag.addEventListener('pause',function(event){
						that.trackEvent(event.target.id+'_pause', event.target.id+'_pause');
						that.stopTrackingPlayProgressAudio();
					},true);
					audioTag.addEventListener('ended',function(event){
						//that.trackEvent(event.target.id+'_ended', event.target.id+'_ended');
						that.resetAudioFlags();
					},true);
					
				}
				
				//add positions
				for(var o = 0;o < pageData[i].audio.length; o++){
					$("#page"+i+"audio"+o)
						.css('width', (pageData[i].audio[o].width*ad_scale) + 'px')
						.css('top', (pageData[i].audio[o].y*ad_scale) + 'px')
						.css('left', (pageData[i].audio[o].x*ad_scale) + 'px')
						.css('position','absolute');
				}
			}
			
			
			//add html
			if (pageData[i].html != undefined) {
				// only load 1st page
				
				
				isPageLoaded[0] = true;
				if (i === 0){
					loadHtml(0);
					//for(var r = 0; r < pageData[i].html.length; r++){
					//	var html = pageData[i].html[r].embed;
					//	$('#page' + i).append(html);
					//}
				}
			}
			
			//add scripts
			if (pageData[i].javascripts != undefined) {
				// only load 1st page
				if (i === 0){
					var scriptList = [];
					for(var q = 0; q < pageData[i].javascripts.length; q++){
						var js = pageData[i].javascripts[q].script;
						//load_js(js);
						scriptList.push(js);
					}
					//if (console) console.log(scriptList);
					loadScriptsInOrder(scriptList);
				}
			}
			
			
			
			if (pageData[i].text != undefined) {
				trc('create text');
				for(var l = 0;l < pageData[i].text.length; l++)
				{
					var pName = "page"+i+"text"+l;
					var text = "<p id=\""+pName+"\">" + pageData[i].text[l].copy + "<\/p>";
					
					$('#page' + i).append(text);
				}
				
				for(var m = 0;m < pageData[i].text.length; m++)
				{
					$('#page' + i + 'text' + m)
						.css('width', (pageData[i].text[m].width*ad_scale) + 'px')
						.css('height', (pageData[i].text[m].height*ad_scale) + 'px')
						.css('top', (pageData[i].text[m].y*ad_scale) + 'px')
						.css('left', (pageData[i].text[m].x*ad_scale) + 'px')
						.css('font-size',(pageData[i].text[m].size*ad_scale) + 'px')
						.css('position','absolute');
				}
			}



 

			$('#AdMaximRichMedia').on("selected_page_" + i , selectedPage);


		} //end PAGE BUILD LOOP
		










		$("#pageHolder")
			.css({'width':pageW * numOfPages});
		
		// create menu
		//
		
		
		var menuBtnData = admaxim_ad.resources.menu.buttons;
		var numOfBtns = menuBtnData.length;
		
		for(var q=0;q < numOfBtns; q++) {
			menuNumDic[menuBtnData[q].type] = q;
			
			var menuId = "menuBtn" + q;
			var p="";
			p += "<div id=\""+menuId+"\" onclick=\"admaxim_ad_experience.menuClick('"+menuBtnData[q].type+"','"+menuId+"')\">";
			p += "<div id=\""+menuId+"_highlight\" ></div>";
			p += "<center><img id='menuBtnImg" + q + "' src='" + menuBtnData[q].icon + "' height='"+menuBtnH+"' /></center>";
			p += "</div>";
			$("#menuBtnHolder").append(p);
			//create css
			$('#'+menuId)
				.css('width', menuBtnW/numOfBtns +'px')
				.css('height', menuBtnH +'px')
				.css('float','left')
				.css('cursor','pointer');
				//.css('border','2px solid red')
				//.css('background-color', 'yellow')
			;
			
			$('#'+menuId +"_highlight")
				.css('width', menuBtnW/numOfBtns +'px')
				.css('height', menuBtnH +'px')
				.css('position','absolute')
				.css('cursor','pointer')
				.css('background','url('+admaxim_ad.resources.menu.selected.background+') repeat-x')
				.css('opacity','0')
			;
			

			$("#menuBtnImg" + q)
				.css("position","relative");
	
			if (numOfBtns === 1){
				// only a close button
				$("#menuBtnImg0")
					.css("left", (ad_scale*320)+"px");
			} 
			
			trackingDic[menuId] = menuBtnData[q].track;
			trackingDic2[menuId] = menuBtnData[q].track2;
			//$('#'+id).attr('title', menuBtnData[i].type);
			//$('#'+id).click(function() {
				//menuBtnAction(this.title);
			//});
			


		}  



		$("#menuBtnHolder")
			.css('width', menuBtnW * numOfBtns);		
			
		
		$('#menuBgImg').attr('src', assetUrl + admaxim_ad.resources.menu.menubg);
		
		/*
		$("#pageHolder").touchwipe({
			wipeLeft: function() { goLeft("swipeleft"); },
			wipeRight: function() { goRight("swiperight"); },
			//wipeUp: function() { alert("up"); },
			//wipeDown: function() { raiseBanner(); },
			preventDefaultEvents: false
		});
		*/
		
		if (admaxim_ad.resources.usetouchnav === "yes"){
			$("#pageHolder").swipeLeft(function(){
				goLeft("swipeleft","swipeleft2");									
			});
		
			$("#pageHolder").swipeRight(function(){
				goRight("swiperight", "swiperight2");									
			});
		}
		
		
		if (admaxim_ad.resources.usearrows === "yes"){

			var arrowData = admaxim_ad.resources.arrows;
			var arws = "";
			
			arws += "<img id=\"arrow_left\" src=\"" + arrowData.iconleft + "\" height=\""+arrowData.height*ad_scale+"\" width=\""+arrowData.width*ad_scale+"\" onclick=\"admaxim_ad_experience.arrowClick('left') \" />";
			arws += "<img id=\"arrow_right\" src=\"" + arrowData.iconright + "\" height=\""+arrowData.height*ad_scale+"\" width=\""+arrowData.width*ad_scale+"\" onclick=\"admaxim_ad_experience.arrowClick('right') \" />";
			
			$("#mainContentArea").append(arws);
			
			$('#arrow_left')
				.css("position", "absolute")
				.css("margin", 0)
				.css("padding", 0)
				.css("top", arrowData.top*ad_scale + "px")
				.css("left", arrowData.sidepad*ad_scale + "px")
				.css("cursor", "pointer");
			
			$('#arrow_right')
				.css("position", "absolute")
				.css("margin", 0)
				.css("padding", 0)
				.css("top", arrowData.top*ad_scale + "px")
				.css("right", arrowData.sidepad*ad_scale + "px")
				.css("cursor", "pointer");
				
			updateArrows();
		}
		
		
		if (numOfBtns > 1) updatePage(0);
		
		if (expand === 'yes') {
			//loadRestOfBackgrounds();
			//firstRun = false;
			//that.trackEvent("firstexpand", "firstexpand2");
			if (console) console.log('isStandalone isStandaloneisStandaloneisStandaloneisStandalone ' + isStandalone);
			if (typeof isStandalone != "undefined" && isStandalone){
				$('#ad_wrapper').css({'top':'0px'});
				that.trackEvent("firstexpand", "firstexpand2");
				//if (console) console.log('YES OH YES');
			} else {
				//if (console) console.log('NONOONONON OH NO');
				dropBanner();
			}
		}




		
		setUpVideoTracking();
		setUpAudioTracking();
		
		if (startingpage != 0) updatePage(startingpage);
		
		
		if (useYoutubeApi) include_js('http://www.youtube.com/player_api', loadYoutubeTracking);


	}  // end createAd()
	










	function selectedPage(event){
		//if (console) console.log('captured select page event');
		var eventName = event.type;
		var lastChar = Math.abs(eventName[eventName.length-1]);
		//if (console) console.log("page num" + lastChar);
		
		//only load page if it hasn't been loaded before
		if (!isPageLoaded[lastChar]){
			isPageLoaded[lastChar] = true;
			loadHtml(lastChar);
			loadScripts(lastChar);
			//if (console) console.log('load page');
		} 
	}



	function loadHtml(pageNum){
		if (pageData[pageNum].html != undefined) {
			for(var r = 0; r < pageData[pageNum].html.length; r++){
				var html = pageData[pageNum].html[r].embed;
				$('#page' + pageNum).append(html);
			}
		}		
	}
			
	function loadScripts(pageNum){
		if (pageData[pageNum].javascripts != undefined) {
			var scriptList = [];
			for(var q = 0; q < pageData[pageNum].javascripts.length; q++){
				var js = pageData[pageNum].javascripts[q].script;
				//load_js(js);
				scriptList.push(js);
			}
			//if (console) console.log(scriptList);
			loadScriptsInOrder(scriptList);
		}
	}


	function loadMapOnDemand(){
		if (!mapLoaded){
			mapLoaded = true;
			if (console) console.log('load the map');
			var html = pageData[2].html[0].embed;
			if (console) console.log(html);
			$('#page2').append(html);
		}
	}
	
	function goRight(trackId, trackId2) {
		if (currentPage > 0) {
			var newPage = currentPage - 1;
			updatePage(newPage);
			that.trackEvent(trackId, trackId2);
		}
	}
	
	
	function goLeft(trackId, trackId2) {
		if (currentPage < numOfPages-1) {
			var newPage = currentPage + 1;
			updatePage(newPage);
			that.trackEvent(trackId, trackId2);
		}
	}
	
	function updateArrows(){
		if (admaxim_ad.resources.usearrows === "yes"){
			
			if (currentPage > 0) {
				$('#arrow_left').show();
			} else {
				$('#arrow_left').hide();
			}
			
			if (currentPage < numOfPages-1) {
				$('#arrow_right').show();
			} else {
				$('#arrow_right').hide();
			}
		}
	}
	
	this.menuClick = function(command, trackId){
		
		switch(command) {
			case "close":
				//raiseBanner();
				break;
			
			default:
				updatePage(command);
				break;
		}
		that.trackEvent(trackId, trackId);
	}
	
	this.arrowClick = function(direction, trackId){
		
		switch(direction) {
			case "left":
				goRight("trackleft", "trackleft2");
				break;
			
			case "right":
				goLeft("trackright", "trackright2");
				break;
		}	
	}

	
	function updatePage(pageNum) {
		
		$('#AdMaximRichMedia').trigger({ type: "selected_page_" + pageNum });

		currentPage = parseFloat(pageNum);
		
		that.currentPageNum = currentPage;
		$(document.body).trigger('pageupdate');
		
		updateArrows();
			
		var newPos = -currentPage*pageW;
		
		$("#pageHolder").animate({left: newPos + "px"}, {duration: 300});
		
		if (admaxim_ad.resources.usemenu != "no"){
			var menuBtnNum = menuNumDic[currentPage];
		//if (console) console.log("menuBtnNum "+ menuBtnNum);
			if (menuBtnNum != undefined){
				var oldBtn = 'menuBtn' + currentMenuBtn + '_highlight';
				$('#'+oldBtn).css('opacity','0');
					
				currentMenuBtn = menuBtnNum;
		
				var menuBtnAss = parseFloat(admaxim_ad.resources.menu.buttons[menuBtnNum].type);
				if (menuBtnAss === currentPage){
					$('#menuBtn' + menuBtnNum + '_highlight')
						.css('opacity', admaxim_ad.resources.menu.selected.opacity );
				}
				
			} else {
				if (currentPage < parseFloat(admaxim_ad.resources.menu.buttons[currentMenuBtn].type)){
					//if (console) console.log("menu button to hide " + currentMenuBtn);	
					var oldBtn = 'menuBtn' + currentMenuBtn + '_highlight';
					$('#'+oldBtn).css('opacity','0');
					
					currentMenuBtn -= 1;;
					$('#menuBtn' + currentMenuBtn + '_highlight')
						.css('opacity', admaxim_ad.resources.menu.selected.opacity );
				}
			}
		}
		//$('#menuBtn' + currentPage).css('opacity', admaxim_ad.resources.menu.selected.opacity );
		
		if (!firstRun) that.trackEvent('page'+currentPage, 'page'+currentPage);
	}
	
	
	function raiseBanner() {
		$("#ad_wrapper").animate({top: (-ad_height*newScale) + "px"}, {duration: 500, complete:function(){
			//hideIframe();
		} }); 
		
		for(var i = 0;i < audioTags.length; i++){
			var audioTag = audioTags[i];
			audioTag.pause();		
		}
		
		for(var j = 0;j < videoTags.length; j++){
			var videoTag = videoTags[j];
			videoTag.pause();		
		}
	}
	
	this.showExp = function(){
		dropBanner();
	}
	
	function dropBanner() {

		$('#AdMaximRichMedia').trigger({ type: "expand_ad" });
		admaxim_ad_expanded = true;

		$("#ad_wrapper").animate({top: "0px"}, { duration: 500}); 
		
		if (firstRun) {
			firstRun = false;
			loadRestOfBackgrounds();
			
			that.trackEvent("firstexpand", "firstexpand2");
		} else {
			that.trackEvent("expand", "expand2");	
		}

	}
	
	function loadRestOfBackgrounds(){
		for(i = 1;i < numOfPages; i++) {	
			$('#page' + i + '-bg').attr('src', assetUrl + pageData[i].background);
		}
	}
	
	
	function include_js(file, nextFunction) {
		var html_doc = document.getElementsByTagName('head')[0];
		var js;
		js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', file);
		html_doc.appendChild(js);
	
		js.onload = function () {
			trc(file + " LOADED");
			nextFunction();
		}
		
		//js.onreadystatechange = function () {
		//    if (js.readyState == 'complete') {
		//		trc(file + " readyState == complete");
		//    }
		//}
		return false;
	}
	
	function include_js_in_order(jsList, currentCount) {
		if (console) console.log("loading: " + jsList[currentCount]);
		var count = currentCount;
		var html_doc = document.getElementsByTagName('head')[0];
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', jsList[currentCount]);
		html_doc.appendChild(js);
	
		js.onload = function () {
			trc("done: " + jsList[count]);
			count += 1;
			if (count != jsList.length) include_js_in_order(jsList, count);
		}
		return false;
	}
	
	
	function load_js(url) {
		if (console) console.log("load: " + url);
		if (url.indexOf("http") != 0) url = assetUrl + url;
	
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		head.appendChild(script);
	
		script.onload = function () {
			if (console) console.log("done: " + url);
		}
		return false;
	}
	
	function loadScriptsInOrder(scriptList){
		include_js_in_order(scriptList, 0);
	}
	






	// YOUTUBE VIDEO TRACKING START

	function loadYoutubeTracking(){
		try{
			for (var i = 0; i < vidTrackArr.length; i++) {
				onYouTubePlayerAPIReady(vidTrackArr[i]);
			};
			setUpYoutubeVideoTracking();
			if (console) console.log('youtube api enabled successful');
		} catch (e){
			if (console) console.log(e);
			if (console) console.log('youtube api not accessable yet, trying again...');
			setTimeout(loadYoutubeTracking, 500);
		}
	}

	function onYouTubePlayerAPIReady(iframeId) {
		var player = new YT.Player(iframeId,{
			events:{
				'onStateChange': onPlayerStateChange
			}
		});

		youtubePlayers[iframeId] = player;
		if (console) console.log('youtube onStateChange enabled for '+ iframeId);
	}
	
	function onPlayerStateChange(event) {

		var id = event.target.a.id;
		var player = youtubePlayers[id];
      	//var duration = player.getDuration();
     	
     	switch(event.data){
     		case YT.PlayerState.PLAYING:
     			if (console) console.log('PLAYING');
     			that.trackEvent(id + '_play', id + '_play');
     			startYoutubePercTracking(id);
     			break;

     		case YT.PlayerState.PAUSED:
     			if (console) console.log('PAUSED');
     			that.trackEvent(id + '_pause', id + '_pause');
     			stopYoutubePercTracking(id);
     			break;

     		case YT.PlayerState.ENDED:
     			if (console) console.log('ENDED');
     			that.trackEvent(id+'_ended', id+'_ended');
     			break;
		
		}
    }

	function setUpYoutubeVideoTracking() {
		//trc("setUpVideoTracking");
		for (var i = 0; i < vidTrackArr.length; i++) {
			vidTrackDic[vidTrackArr[i]] = [0, 0, 0];
		}
	}

	function startYoutubePercTracking(id){
		currentVideoId = id;
		if (!playTracking) {
			playProgressInterval = setInterval(checkYoutubePlayProgress, 1000);
			playTracking = true;
		}
    }

    function stopYoutubePercTracking(){
		playTracking = false;
		clearInterval(playProgressInterval);
    }

	function checkYoutubePlayProgress() {
		var player = youtubePlayers[currentVideoId];
		
		
		var perc = ((player.getCurrentTime() / player.getDuration()) * 100);
		//trc("currentTime " + player.getCurrentTime() + " duration " + player.getDuration() + " currentVideoId " + currentVideoId + " perc " + perc);
		
		var flags = vidTrackDic[currentVideoId];
		if (perc > 24 && perc < 50) {
			if (flags[0] != 1) {
				flags[0] = 1;
				that.trackEvent(currentVideoId + "_25", currentVideoId + "_25");
			}
		}
		if (perc > 49 && perc < 75) {
			if (flags[1] != 1) {
				flags[1] = 1;
				that.trackEvent(currentVideoId + "_50", currentVideoId + "_50");
			}
		}
		if (perc > 74 && perc < 100) {
			if (flags[2] != 1) {
				flags[2] = 1;
				that.trackEvent(currentVideoId + "_75", currentVideoId + "_75");
			}
		}
	}

	// YOUTUBE VIDEO TRACKING END









	// ALL OTHER TRACKING BELOW

	this.trackEvent = function(event_description, event_description2) {

		var eventCatigory = admaxim_ad.resources.adid;
		var customTrackTitle = (typeof trackingDic[event_description] != "undefined") ? trackingDic[event_description] : event_description;
		var eventAction = customTrackTitle;
		var	eventLabel = admaxim_ad.resources.adgroupid;
		
		if (trackingEnabled){
			if (console) console.log("TRACK - cat:" + eventCatigory + ", label:" + eventLabel + ", action:" + eventAction);
			_gaq.push(['admaxim_tracking._trackEvent', eventCatigory, eventAction, eventLabel ]);

			var url = "http://track.admaxim.com/adtracker/track/app/event";
			url += "?appId=" + admaxim_appid;
			url += "&clickId=" + admaxim_clickid;
			url += "&pageId=" + "1";
			url += "&pageRId=" + "1";
			url += "&eventType=" + eventAction;
			url += "&eventData=" + "EVENT_DATA";

			$('#AdMaximTrack').attr('src', url);	


		} else {
			if (console) console.log("NOT TRACKING " + eventAction);

			//if (console) console.log("NO track - cat:" + eventCatigory + ", label:" + eventLabel + ", action:" + eventAction);

		}

	}
	
	this.openOutsideLink = function(url, trackId, trackId2) {
		that.trackEvent(trackId, trackId2);
		window.open(url,'_blank');	
	}
	
	
	function trc(str) {
		if (console) console.log(str);
	}



/* VIDEO PERCENTAGE TRACKING */

	function setUpVideoTracking() {
		//trc("setUpVideoTracking");
		for (var i = 0; i < vidTrackArr.length; i++) {
			vidTrackDic[vidTrackArr[i]] = [0, 0, 0];
		}
	}

	this.trackPlayProgress = function() {
		//trc("trackPlayProgress");
		if (!playTracking) {
			playProgressInterval = setInterval(checkPlayProgress, 1000);
			playTracking = true;
		}
	}

	this.stopTrackingPlayProgress = function() {
		trc("stopTrackingPlayProgress");
		playTracking = false;
		clearInterval(playProgressInterval);
	}

	function checkPlayProgress() {
		var video = $('#'+ currentVideoId)[0];
		
		var perc = ((video.currentTime / video.duration) * 100);
		trc("currentTime " + video.currentTime + " duration " + video.duration + " currentVideoId " + currentVideoId + " perc " + perc);
		
		var flags = vidTrackDic[currentVideoId];
		if (perc > 24 && perc < 50) {
			if (flags[0] != 1) {
				flags[0] = 1;
				that.trackEvent(currentVideoId + "_25", currentVideoId + "_25");
			}
		}
		if (perc > 49 && perc < 75) {
			if (flags[1] != 1) {
				flags[1] = 1;
				that.trackEvent(currentVideoId + "_50", currentVideoId + "_50");
			}
		}
		if (perc > 74 && perc < 100) {
			if (flags[2] != 1) {
				flags[2] = 1;
				that.trackEvent(currentVideoId + "_75", currentVideoId + "_75");
			}
		}
	}

	this.resetVideoFlags = function() {
		vidTrackDic[currentVideoId] = [0, 0, 0];
		that.trackEvent(currentVideoId + "_ended", currentVideoId + "_ended");
		that.stopTrackingPlayProgress();
	}
	/* VIDEO PERCENTAGE TRACKING - END */
	
	
	
	
	
	/* AUDIO PERCENTAGE TRACKING */

	function setUpAudioTracking() {
		//trc("setUpAudioTracking");
		for (var i = 0; i < audioTrackArr.length; i++) {
			audioTrackDic[audioTrackArr[i]] = [0, 0, 0];
		}
	}

	this.trackPlayProgressAudio = function() {
		trc("trackPlayProgressAudio");
		if (!audioPlayTracking) {
			audioPlayProgressInterval = setInterval(checkPlayProgressAudio, 1000);
			audioPlayTracking = true;
		}
	}

	this.stopTrackingPlayProgressAudio = function() {
		trc("stopTrackingPlayProgressAudio");
		audioPlayTracking = false;
		clearInterval(audioPlayProgressInterval);
	}

	function checkPlayProgressAudio() {
		var audio = $('#'+ currentAudioId)[0];
		
		var perc = ((audio.currentTime / audio.duration) * 100);
		trc("currentTime " + audio.currentTime + " duration " + audio.duration + " currentAudioId " + currentAudioId + " perc " + perc);
		
		$("#"+currentAudioId+"-progress").css("width",perc+"%");
		
		var flags = audioTrackDic[currentAudioId];
		if (perc > 24 && perc < 50) {
			if (flags[0] != 1) {
				flags[0] = 1;
				that.trackEvent(currentAudioId + "_25", currentAudioId + "_25");
			}
		}
		if (perc > 49 && perc < 75) {
			if (flags[1] != 1) {
				flags[1] = 1;
				that.trackEvent(currentAudioId + "_50", currentAudioId + "_50");
			}
		}
		if (perc > 74 && perc < 100) {
			if (flags[2] != 1) {
				flags[2] = 1;
				that.trackEvent(currentAudioId + "_75", currentAudioId + "_75");
			}
		}
	}


	this.resetAudioFlags = function() {
		audioTrackDic[currentAudioId] = [0, 0, 0];
		that.trackEvent(currentAudioId + "_ended", currentAudioId + "_ended");
		that.stopTrackingPlayProgressAudio();
	}
	/* VIDEO PERCENTAGE TRACKING - END */

}













