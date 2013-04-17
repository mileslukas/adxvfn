var admaxim_ad =
{
	"resources":
	{
		"adid"				: "vodafone_admaxim_simonly",
		"adgroupid"			: "vodafone_admaxim",
		"showhotspots"		: "no",
		"enabletracking"	: "yes",
		"startingpage"		: "0",
		"usemenu"			: "no",
		"width"				: "320",
		"height"			: "500",
		"menuheight"		: "50",
		'gallery':
		{
			'pages':
			[	
			 	{
				 	'title':'page1',
				 	'track':'page_1_view',
					'track2'	: ' ',
				 	'background':'media/bg_start3.png',
					"html"   	:
					[
						{
							"embed": "<div id='am_page_wrapper' position:absolute'><canvas id='demoCanvas'></canvas></div><div id='admaxim_form'><div id='admaxim_form_content'></div><div id='admaxim_thank_you'><div id='admaxim_terms_btn'></div></div></div>"
						} 
					],
					"javascripts" :
					[
					 	{ "script": "js/easeljs-0.5.0.min.js"},
						{ "script": "js/tweenjs-0.3.0.min.js"},
						{ "script": "js/preloadjs-0.3.0.min.js"},
						{ "script": "js/AlphaMaskFilter.js"},
						{ "script": "game.js"}
					]	
				}						 
			]
		},
		'menu':
		{
			'buttons':
			[
			  	{
				   	'type':0,
				  	'track':'page1_menu',
					'track2':'',
					'icon':'media/icon_games.png'
				},
				{
				   	'type':1,
				  	'track':'page1_menu',
					'track2':'',
					'icon':'media/icon_music.png'
				},
				{
				   	'type':2,
				  	'track':'page2_menu',
					'track2':'',
					'icon':'media/icon_video.png'
				},
				{
				   	'type':3,
				  	'track':'page3_menu',
					'track2':'',
					'icon':'media/icon_share.png'
				},
				{
				   	'type':'close',
				  	'track':'close_btn',
					'track2':'',
					'icon':'media/icon_close.png'
				}  
			],
			'selected' :
			{
				'opacity':'1',
				'background':'media/menu_highlight.png'
			},
			'menubg':'media/menu_bg.png'
		},
		'additionaltracking':
		{
			'firstexpand'	: 'page_impression',
			'firstexpand2'	: 'page_impression2',
			'expand'		: 'expand_ad',
			'expand2'		: 'expand_ad2',
			'swipeleft'		: 'swipe_left',
			'swipeleft2'	: 'swipe_left2',
			'swiperight'	: 'swipe_right',
			'swiperight2'	: 'swipe_right2'
		}
	}
}