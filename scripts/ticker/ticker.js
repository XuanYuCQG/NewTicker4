//current array will save the current symbols and prices state
// the prices will be compared every time new prices updated
var current=[];

function runTicker() {

    var tickerData = "";
    for(var i = 0; i < rowcount; i++){
        tickerData +=  "\""+contract_symbols[i+1].replace(".US.","_")+"\":[\"" + real_price[i+1] +"\",\"" + real_price[i+1] +"\"],";
    }
    tickerData = tickerData.substring(0, tickerData.length-1);
    tickerData = "{" + tickerData + "}";

    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(tickerData);

	$.getJSON( url, function( data ) {
		  var items = [];
		  $.each( data, function( key, val ) {
			  	ask = parseFloat(val[0]);
          bid = parseFloat(val[1]);
			  	b = (Math.floor(Math.random()*2-1))?"bR":"bG";
		      items.push( "<span class='pair'>" + key + "&nbsp;&nbsp;= <span id='" + key + "bid' class='"+b+"'>  " + bid + " </span></span>");
      });
      $("#lst").html(" <a class='pair' href='http://www.cqg.com/' target='_blank'>CQG.COM</a>" + items.join( " " ));
		  current = data;
		  $("#lst").jStockTicker({interval: 45,speed:1});
		  setInterval(updateRates, 5000);
		});
}


function updateRates() {
    var tickerData = "";
    for(var i = 0; i < rowcount; i++){
        tickerData +=  "\""+contract_symbols[i+1].replace(".US.","_")+"\":[\"" + real_price[i+1] +"\",\"" + real_price[i+1] +"\"],";
    }
    tickerData = tickerData.substring(0, tickerData.length-1);
    tickerData = "{" + tickerData + "}";

    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(tickerData);

	$.getJSON(url, function( data ) {
		var items = [];
		var txt='';
		  $.each( data, function( key, val ) {
          ask = parseFloat(val[0]);
			  	bid = parseFloat(val[1]);

			  	$("#"+key+"bid").removeClass();

				if (current[key][1]>val[1]) $("#"+key+"bid").html(bid + " &#9660; " ).addClass("bR");
				if (current[key][1]<val[1]) $("#"+key+"bid").html(bid + " &#9650; " ).addClass("bG");
				if (current[key][1]==val[1]) $("#"+key+"bid").html(bid).addClass("eq");
		  });
		  current = data;
	});
}

( function($) {

	$.fn.jStockTicker = function(options) {

		if (typeof (options) == 'undefined') {
			options = {};
		}

		var settings = $.extend( {}, $.fn.jStockTicker.defaults, options);

		var $ticker = $(this);

		settings.tickerID = $ticker[0].id;

		$.fn.jStockTicker.settings[settings.tickerID] = {};

		var $wrap = null;

		if ($ticker.parent().get(0).className != 'wrap') {
			$wrap = $ticker.wrap("<div class='wrap'></div>");
		}

		var $tickerContainer = null;

		if ($ticker.parent().parent().get(0).className != 'container') {
			$tickerContainer = $ticker.parent().wrap(
					"<div class='container'></div>");
		}

		var node = $ticker[0].firstChild;
		var next;

		while(node) {
			next = node.nextSibling;
			if(node.nodeType == 3) {
				$ticker[0].removeChild(node);
			}
			node = next;
		}

		var shiftLeftAt = $($ticker.children().get(0)).outerWidth(true);

		$.fn.jStockTicker.settings[settings.tickerID].shiftLeftAt = shiftLeftAt;
		$.fn.jStockTicker.settings[settings.tickerID].left = 0;
		$.fn.jStockTicker.settings[settings.tickerID].runid = null;

		$ticker.width(2 * screen.availWidth);

		function startTicker() {
			stopTicker();

			var params = $.fn.jStockTicker.settings[settings.tickerID];
			params.left -= settings.speed;
			if(params.left <= params.shiftLeftAt * -1) {
				params.left = 0;
				$ticker.append($ticker.children().get(0));
				params.shiftLeftAt = $($ticker.children().get(0)).outerWidth(true);
			}

			$ticker.css('left', params.left + 'px');
			params.runId = setTimeout(arguments.callee, settings.interval);

			$.fn.jStockTicker.settings[settings.tickerID] = params;
		}

		function stopTicker() {
			var params = $.fn.jStockTicker.settings[settings.tickerID];
			if (params.runId)
			    clearTimeout(params.runId);

			params.runId = null;

			$.fn.jStockTicker.settings[settings.tickerID] = params;
		}

		function updateTicker() {

			stopTicker();
			startTicker();
		}

		$ticker.hover(stopTicker,startTicker);

		startTicker();
	};

	$.fn.jStockTicker.settings = {};

	$.fn.jStockTicker.defaults = {
		tickerID :null,
		url :null,
		speed :1,
		interval :20
	};
})(jQuery);

    $(function() {

    });
