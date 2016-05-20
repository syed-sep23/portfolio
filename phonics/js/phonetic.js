var parentID;
var liIndx = 0;

$(document).ready(function () {
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('autoplay', 'false');
	audioElement.setAttribute('controls', 'false');

	$(document).on('click', '.audioLgImg, .audioSmImg, .audiobtn, .soundContainer h2', function () {
		var audioFileName = 'audio/' + $(this).attr('id') + '.mp3';
		audioElement.setAttribute('src', audioFileName);
		audioElement.load();
		setTimeout(function () {
			audioElement.play();
		}, 150);
	});

	$(document).on('click', ' .letter_word_box_arrow, .letter_word_box_arrowRight', function () {
		if ($('.letter_word_org').is(':visible')) {
			$('.letter_word_box_arrowRight').hide();
			$('.letter_word_box_arrow').show();
		} else {
			$('.letter_word_box_arrow').hide();
			$('.letter_word_box_arrowRight').show();
		}
		$('.letter_word_org').toggle("slide", {direction: "left"}, 1000);
	});

	$(document).on('click', '.phonics_tab .audioSmImg_learn', function () {
		var PID = '#' + $(this).parents('.phonics_tab').attr('id');
		audioFileName = 'audio/' + $(this).attr('id') + '.mp3';
		var audioElmnt = {};
		var audioFileName1 = {};

		$(PID + ' .word_box_item').each(function (inx, i) {
			audioElmnt[inx] = document.createElement('audio');
			audioElmnt[inx].setAttribute('autoplay', 'false');
			audioFileName1[inx] = 'audio/' + $(this).children('h2').attr('id') + '.mp3';
			audioElmnt[inx].setAttribute('src', audioFileName1[inx]);
			audioElmnt[inx].load();

			setTimeout(function () {
				audioElmnt[inx].play();
			}, 200);
		});

		setTimeout(function () {
			audioElement.currentTime = 0;
			audioElement.pause();
			audioElement.setAttribute('src', audioFileName);
			audioElement.load();
			audioElement.play();
		}, 500);
	});


	$(document).on('click', '.letter_word_bt img', function () {
		var keytab = '.' + $(this).attr('id');
		$('.letter_word_org .vowelImgKeyboard').hide();
		$(keytab).show();
	});

	$(document).on('click', '.mcq h2', function () {
		parentID = '#' + $(this).parents('.questions').attr('id');
		$('.validate').removeClass('disableBtn');
		$(this).addClass('disableBtn');
	});

	$(document).on('click', '.mcq .validate', function () {
		var anscnt = 0;
		var disabAnsCnt = $(parentID + ' .ansChoices .disableBtn').length;
		var crtAnsCnt = $(parentID + ' .ansChoices .correctAns').length;

		$(parentID + ' .ansChoices h2').each(function () {
			if ($(this).hasClass('correctAns')) {
				$(this).prev().find('.result').removeClass('wrong');
				$(this).prev().find('.result').addClass('right');
				if ($(this).hasClass('disableBtn')) {
					$(this).removeClass('disableBtn');
					anscnt = anscnt + 1;
				}
			} else {
				$(this).prev().find('.result').removeClass('right');
				$(this).prev().find('.result').addClass('wrong');
				$(this).addClass('disableBtn');
			}
		});
		if ((crtAnsCnt == anscnt) && (disabAnsCnt == anscnt)) {
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('successPage');
		} else {
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('failedPage');
		}
		onPageChange();
	});

	$(document).on('click', '.continueBtn', function () {
		if (currentPgno < questionCnt) {
			$(parentID).hide();
			$("#pageNum li:nth-child(" + currentPgno + ")").removeClass('activePage');
			currentPgno++

			$(parentID).next().fadeIn('slow').delay(500);
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('activePage');
			parentID = '';
		} else {
			$('.validate').addClass('disableBtn');
		}
	});

	$(document).on('click', '.findword_panel .validate', function () {
		var crctAns = '';
		var givenAns = '';
		$(parentID + ' .alphaInpt').each(function () {
			if (this.tagName.toLowerCase() == 'input') {
				crctAns = crctAns + $(this).val();
			} else {
				crctAns = crctAns + $(this).html();
			}
			givenAns = givenAns + $(this).data('ans');

			if (this.tagName.toLowerCase() == 'input') {
				$(this).val($(this).data('ans'));
			} else {
				$(this).html($(this).data('ans'));
			}

		});
		if (crctAns.toUpperCase() == givenAns.toUpperCase()) {
			$(parentID).find('.result').removeClass('wrong');
			$(parentID).find('.result').addClass('right');
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('successPage');
		} else {
			$(parentID).find('.result').removeClass('right');
			$(parentID).find('.result').addClass('wrong');
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('failedPage');
		}
		onPageChange();
	});


	$(document).on('click', '.keybord_panel img', function () {
		var slideIndex = $(this).index();
		$('.keybord_panel ul').each(function (i, elem) {
			if (slideIndex == i) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	});

	$(document).on('click', '.keybord_panel ul>li', function () {
		parentID = '#' + $(this).parents('.questions').attr('id');

		if (liIndx <= ($(parentID + ' .identify_item > ul li').length - 1)) {
			$(parentID + ' .identify_item > ul li').eq(liIndx).html($(this).html());
			liIndx = liIndx + 1;
		} else {
			liIndx = 0;
			$(parentID + ' .identify_item > ul li').eq(liIndx).html($(this).html());
			liIndx = liIndx + 1;
		}

		if (liIndx == $(parentID + ' .identify_item > ul li').length) {
			$('.validate').removeClass('disableBtn');
		}
	});

	$(document).on('click', 'input.alphaInpt', function (e) {
		parentID = '#' + $(this).parents('.questions').attr('id');
		if (e.ctrlKey || e.altKey) { //e.shiftKey || 
			e.preventDefault();
		} else {
			var key = e.keyCode;
			if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
				e.preventDefault();
			}
		}
	});

	$(document).on('keyup', 'input.alphaInpt', function (e) {
		var cnt = 0;
		$(parentID + ' .alphaInpt').each(function () {
			cnt = cnt + $(this).val().length;
		});
		if (cnt >= $(parentID + ' .alphaInpt').length) {
			$('.validate').removeClass('disableBtn');
		} else {
			$('.validate').addClass('disableBtn');
		}

		if (this.value.length == this.maxLength) {
			//$('input[type=text]').focus();
			if ($(parentID).hasClass('iconfilling_panel')) {
				//$('input[type=text]').focus();
			} else {
				$(this).parent().nextAll().children(":not(.readonly):input").eq(0).focus();
			}
		}
	});

	$(document).on('click', '.iconfilling_panel .validate', function () {
		var crctAns = '';
		var givenAns = '';
		$(parentID + ' .alphaInpt').each(function () {
			if (($(this).val() == 0) || ($(this).val() == undefined)) {
				crctAns = crctAns + $(this).html();
			} else {
				crctAns = crctAns + $(this).val();
			}
			givenAns = givenAns + $(this).data('ans');
			$(this).val($(this).data('ans'));
		});

		var givenAnsVal = givenAns.toUpperCase().split("");
		var crctAnsVal = crctAns.toUpperCase().split("");
		var crctansCnt = 0;
		$(parentID + ' .result').each(function (indx, element) {
			if (givenAnsVal[indx] == crctAnsVal[indx]) {
				$(this).removeClass('wrong');
				$(this).addClass('right');
				crctansCnt = crctansCnt + 1;
			} else {
				$(this).removeClass('right');
				$(this).addClass('wrong');
			}
		});
		if (crctansCnt == $(parentID + ' .result').length) {
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('successPage');
		} else {
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('failedPage');
		}
		onPageChange();
	});

	function onPageChange() {
		if (currentPgno < questionCnt) {
			$(parentID + ' .validate').addClass('disableBtn').hide();
			$(parentID + ' .continueBtn').show();
		} else {
			$(parentID + ' .validate').addClass('disableBtn');
		}
	}

	/* Popup Window */
	var appendthis = ("<div class='modal-overlay js-modal-close'></div>");

	$('a[data-modal-id]').click(function (e) {
		e.preventDefault();
		$("body").append(appendthis);
		$(".modal-overlay").fadeTo(500, 0.7);
		var modalBox = $(this).attr('data-modal-id');
		$('#' + modalBox).fadeIn($(this).data());
	});

	$(".js-modal-close, .modal-overlay").click(function () {
		$(".modal-box, .modal-overlay").fadeOut(500, function () {
			$(".modal-overlay").remove();
		});
	});

	$(window).resize(function () {
		$(".modal-box").css({
			top: 55,
			left: ($(window).width() - $(".modal-box").outerWidth()) / 2,
			height: $(window).height() - 110
		});
		//$(window).height() - $(".modal-box").outerHeight()) / 2
	});
	$(window).resize();

});

function popup1() {
	$("#overlayLaunch2").css("display", "none");
	$("#overlayLaunch1").css("display", "flex");
}

function popup2() {
	$("#overlayLaunch1").css("display", "none");
	$("#overlayLaunch2").css("display", "flex");
}

function closePopup() {
	$(".overlay").css("display", "none");
}