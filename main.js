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
