var isInView = function (el) {
	if (typeof el == "undefined") {
		return false;
	}
	if (typeof el === "object") {
		el = el[0];
	}
	var rect = el.getBoundingClientRect();
	return rect.bottom > 0 &&
		rect.right > 0 &&
		rect.left < (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ &&
		rect.top < (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */ ;
};

var timer;

$(document).ready(function () {

	$("a[href*='#']").on("click", function (e) {
		e.preventDefault();

		var target = $($(this).attr("href")),
			position = target.offset().top;

		$("html, body").animate({ scrollTop: position });
	});

	$(".goto").on("click", function () {
		if ($(".dropdown").hasClass("show")) {
			$(".dropdown").removeClass("show");
		} else {
			$(".dropdown").addClass("show");
		}
	});

	$(".dropdown a").on("click", function () {
		$(".dropdown").removeClass("show");
	});

	$(window).on("scroll", function (e) { //"scroll" is a reserved word that starts something on every pixel

		//Obviously, any previously showing sidebars should be removed prior to showing the new sidebar
		if (isInView($(".thebar"))) {
			$(".privacybar").addClass("active");
		} else {
			$(".privacybar").removeClass("active");
		}

		if (!(isInView($("#header")))) {
			$(".nav").addClass("active");
		} else {
			$(".nav").removeClass("active");
		}

	});

	$("input[type='radio']").on("click", function () {
		var price = 0;
		var percent = 0;

		$("input[type='radio']:checked").each(function () {
			var chosen = $(this)
			var value = parseFloat(chosen.data("price"));
			var rating = parseInt(chosen.data("rating"));

			price = (price + value);
			percent = percent + rating;

			$(".price").text("$" + price.toFixed(2));
			$(".totalpercent").width(percent + "%");

			if (percent <= 30) {
				$(".totalpercent").css("background-color", "#CD5C5C")
			}
			if (percent > 30 && percent < 60) {
				$(".totalpercent").css("background-color", "#F4A460")
			}
			if (percent >= 60) {
				$(".totalpercent").css("background-color", "#90EE90")
			}

		});
	});
});

//YouTube video

var videos = [];
var apiReady = false;
var CUNY_YT = function (ele) {
	var self = this,
		width = ele.width(),
		height = width * .5625,
		sticky = ele.hasClass("stickyEnabled"); //sticky will equal false if ele does not have this class
	isPlaying = false; //because a video's default is that it's not playing
	if (typeof window.player_counter === "undefined") {
		window.player_counter = 0;
	}
	window.player_counter++; //increases the counter by one
	var player_id = "cuny_player_" + window.player_counter, //so you know it's unique
		wrapper = "<div class='video'></div>"; //this wrapper makes it so that you can talk to your video even though YouTube will replace the div with an iFrame
	if (ele.hasClass("stickyEnabled")) {
		wrapper = "<div class='stickyWrapper'><div class='stickyEnabled'>" + wrapper + "</div></div>";
	}
	ele.wrap(wrapper);
	ele.attr("id", player_id);
	ele.removeClass("stickyEnabled");
	var container = ele.closest(".video");
	var stickyContainer = ele.closest(".stickyEnabled");
	var stickyWrapper = ele.closest(".stickyWrapper");
	this.ready = false;
	var onPlayerReady = function (event) {
		//method that gets called when the YouTube player is set up on the page and ready to go
		console.log("The player is ready"); //player ready stuff
		self.ready = true;
	};
	var onPlayerStateChange = function (event) {
		//gets fired every time the YouTube state change
		console.log("The state has changed");
		if (event.data == YT.PlayerState.PLAYING) {
			isPlaying = true;
		} else {
			isPlaying = false;
			if (sticky === true) {
				stickyContainer.removeClass("sticky");
			}
		} //play pause event stuff
	};
	this.player = new YT.Player(player_id, {
		//establishes the player and its parameters
		height: height,
		width: width,
		videoId: ele.data("id"),
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange
		}
	});
	this.done = false; //abstraction methods in case the YouTube API ever changes
	this.stop = function () {
		self.player.stopVideo();
	}
	this.play = function () {
		self.player.playVideo();
	}
	this.pause = function () {
		self.player.pauseVideo();
	}
	this.mute = function () {
		self.player.mute();
	};
	this.unMute = function () {
		self.player.unMute();
	};
	$(window).on("scroll", function () {
		if (apiReady === true && self.ready === true) {
			console.log("Sticky", sticky);
			console.log("isPlaying", isPlaying);
			console.log("Container", isInView(container));
			if (sticky && isPlaying && !isInView(stickyWrapper)) {
				//if it's the element that's designated to be sticky, it's playing, and it's not in view, add the "sticky" class
				stickyContainer.addClass("sticky");
			} else {
				stickyContainer.removeClass("sticky");
			}
			if (isInView(container)) {
				//isInView is boolean so it's true or false
				self.mute();
				self.play();
			} else {
				self.pause();
			}
		}
	});
}

;
var isInView = function (el) {
	if (typeof el == "undefined") {
		return false;
	}
	if (typeof el === "object") {
		el = el[0];
	}
	var rect = el.getBoundingClientRect();
	return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ &&
		rect.top < (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */ ;
}

;

function onYouTubeIframeAPIReady() {
	apiReady = true;
	$(".youtube").each(function () {
		videos.push(new CUNY_YT($(this)));
	});
}
