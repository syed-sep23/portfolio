var currentPage, questionid, wordId, buttonID, wordsound, levelCount;
var questionCnt = 0;
var currentPgno = 1;
var currentlevel = 'null';
var colors = ["red", "pineapple", "arctic", "cantaloupe", "lime", "lilac", "purple", "chartreuse", "watermelon", "tiger"]

$(document).ready(function () {
	$('#quiz, #learn, #headContainer').hide();

	$('.learn_bt').click(function () {
		$('#quiz').hide();
		$('#learn').show();
	});

	$('.quiz_bt').click(function () {
		if (currentPgno == 0) {
			currentPgno = 1;
		}
		$('#quiz').show();
		$('#learn').hide();
		$("#pageNum li").removeClass('activePage');
		$("#pageNum li:nth-child(" + currentPgno + ")").addClass('activePage');
	});

	$.getJSON("json/learn/level.json", function (levellength) {
		levelCount = $(levellength.levelList).length;
		for (LC = 0; LC <= levelCount - 1; LC++) {
			listname = parseInt(LC + 1);
			$('#asset_Selector').append('<option value="' + LC + '">LEVEL ' + listname + '</option>');
			$('#levelSelector').append('<option value="' + LC + '">LEVEL ' + listname + '</option>');
		}
	});

	$(document).on('click', '.get_started_bt img', function () {
		currentlevel = $('#asset_Selector').find('option:selected').val();
		if (currentlevel != 'null') {
			$('.assets_01, .footer').hide();
			$('#learn, #headContainer').show();
		}
	});

	$(document).on('change', '#levelSelector, #asset_Selector', function () {
		if (($(this).find('option:selected').val() == "null") && ($(this).find('option:selected').val() == currentlevel)) {
			//Level is not changed
		} else {
			questionCnt = 0;
			currentPgno = 1;
			$("#quiz .questions").remove();
			$('#levelSelector option').eq(parseInt(currentlevel)).removeAttr("selected", "selected");
			currentlevel = $(this).find('option:selected').val();
			$('#levelSelector option').eq(parseInt(currentlevel)).attr("selected", "selected");
			$('.phonics_tab_box div').remove();
			getLevel();
		}
	});

	$('#learn .letter_word_box article h3').click(function () {
		currentlevel = $('#levelSelector').find('option:selected').val();
		buttonID = $(this).attr('id');
		$('#learn .phonics_tab_box div').remove();
		$.getJSON("json/learn/level.json", function (learnlevel) {
			wordId = learnlevel.levelList[currentlevel].wordList;
			getword();
		});
	});

	/* Code for Learn start here */
	function getword() {
		$.getJSON("json/learn/content_db.json", function (contentJSON) {
			var wdId = [];
			$(wordId).each(function (i, wdval) {
				$(contentJSON.wordList).each(function (wordCnt, thisWord) {
					if ((wdId.indexOf(wdval) > -1) && (wdId.length > 0)) {
						//alert(wdId.indexOf(wdval));
						return;
					}
					wordTxt = "";
					wordAudio = "";
					wordImage = "";
					wordsound = "";
					if (wdval == thisWord.wordid) {
						$(thisWord.sound).each(function (Sndno, Sndval) {
							if (Sndval == buttonID) {
								wdId.push(thisWord.wordid);
								wordTxt = thisWord.text;
								wordAudio = thisWord.word_audio;
								wordImage = thisWord.image;
								wordsound = thisWord.sound;
								return;
							}
						});
					}
				});
				generateHTML();
				getsound(wordsound);
			});
		});
	};

	function getsound(wordsound) {
		//$.getJSON("json/learn/sound_db.json", function (soundJSON) {
		$.ajax({
			async: false,
			type: 'GET',
			url: 'json/learn/sound_db.json',
			dataType: 'json',
			success: function (soundJSON) {

				$(wordsound).each(function (ltrCnt, ltr) {
					$(soundJSON.soundList).each(function (soundCnt, ltrsound) {
						if (ltr == ltrsound.soundid) {
							if (ltr == buttonID) {
								$('#' + wordTxt + 'Img .soundContainer').append('<div class="word_box_item"><h2 id="' + ltrsound.sound_audio + '" class="' + colors[ltrCnt] + '"><span>' + ltrsound.text + '</span></h2></div>');
							} else {
								$('#' + wordTxt + 'Img .soundContainer').append('<div class="word_box_item"><h2 id="' + ltrsound.sound_audio + '" class="disabledSound ' + colors[ltrCnt] + '"><span>' + ltrsound.text + '</span></h2></div>');
							}
							//soundImage.push(ltrsound.image);
							return;
						}
					});
				});
			}
		});
	};

	function generateHTML() {
		if (wordImage != "") {
			$('#learn .phonics_tab_box').append('<div class="phonics_tab" id="' + wordTxt + 'Img"><img src="' + wordImage + '" width="189" height="151"><div class="soundContainer"></div><div class="img_label">' + '<img id="' + wordAudio + '" class="audioSmImg_learn">' + wordTxt.toUpperCase() + '</div>');
		}
	};

	/* Code for Quiz start here */
	function getLevel() {
		$.getJSON("json/quiz/level.json", function (quizlevel) {
			// $(quizlevel.levelList[currentlevel]).each(function () {
			questionid = quizlevel.levelList[currentlevel].questionList;
			// });
			getquestion();
		});
	};

	function getquestion() {
		$.getJSON("json/quiz/quiz.json", function (thisquestion) {
			$('#pageNum li').remove();
			$(questionid).each(function (i, val) {
				$(thisquestion.questionList).each(function (indx, obj) {
					if (thisquestion.questionList[indx].quesid == questionid[i]) {
						questionCnt = questionCnt + 1;
						var currentquesId = thisquestion.questionList[indx].quesid;
						var currentquestype = thisquestion.questionList[indx].questiontype;
						$currentques = thisquestion.questionList[indx];

						if (currentquestype == "mcq") {
							generateMCQ();
						} else if (currentquestype == "findword_panel") {
							generatefindword();
						} else if (currentquestype == "iconfilling_panel") {
							generateiconfilling();
						}
						$('#pageNum').append('<li>' + questionCnt + '</li>');

						if ($currentques.attachment == "keyboard") {
							$('#que' + questionCnt + " .btnblock").before(thisquestion.keyboard);
						}
					}
				});
			});
			currentPage = '#que' + currentPgno;
			$('#quiz .questions').hide();
			$(currentPage).show();
			$('.validate').addClass('disableBtn');
			$("#pageNum li:nth-child(" + currentPgno + ")").addClass('activePage');
		});
	};

	function generateMCQ() {
		$('#quiz #pagenav').before('<div id="que' + questionCnt + '" class="questions ' + $currentques.questiontype + '"><div class="rhymes_word_sound_box"><h1></h1><div id="' + $currentques.media + '" class="audioLgImg"></div><p class="sound_box_text">' + $currentques.question + '</p></div><div class="ansChoices word_box_panel"></div><div class="btnblock"><div class="validate">Submit</div><div class="continueBtn">Continue</div></div></div>');

		if (!$currentques.image) {
			//no Image available
		} else {
			$('#que' + questionCnt).prepend('<div class="rhymes_word_imgbox"><img src="' + $currentques.image + '"></div>');
		}
		if (!$currentques.questiontext) {
			//no Image available
		} else {
			$('#que' + questionCnt + ' #' + $currentques.media).after('<h2>' + $currentques.questiontext + '</h2>');
		}

		$($currentques.interaction_data).each(function (choiceCnt, val) {
			var correctAns = '';
			if ($currentques.interaction_data[choiceCnt].score == 1) {
				correctAns = 'correctAns';
			} else {
				correctAns = '';
			}
			$('#que' + questionCnt + " .ansChoices").append('<div class="word_box_item"><h1><span class="result"></span></h1><h2 class="' + colors[choiceCnt] + ' ' + correctAns + '"><span>' + $currentques.interaction_data[choiceCnt].data + '</span></h2></div>');
		});
	};

	function generatefindword() {
		$('#quiz #pagenav').before('<div id="que' + questionCnt + '" class="questions ' + $currentques.questiontype + '"><div class="rhymes_word_sound_box"><h1></h1><div id="' + $currentques.media + '" class="audioLgImg"></div><p class="sound_box_text">' + $currentques.question + '</p></div><div class="identify_item"><h1><span class="result"></span></h1><ul></ul></div><div class="btnblock"><div class="validate">Submit</div><div class="continueBtn">Continue</div></div></div>');

		var blankCount = 0;
		$($currentques.interaction_data).each(function (i, val) {
			if ($currentques.interaction_data[i].data == "#") {
				blankCount = blankCount + 1;
			}
		});

		if (blankCount == $currentques.interaction_data.length) {
			for (choiceCnt = 1; choiceCnt <= $currentques.interaction_data.length; choiceCnt++) {
				var correctAns = '';
				if ($currentques.interaction_data[choiceCnt - 1].score == 1) {
					correctAns = $currentques.interaction_data[choiceCnt - 1].dataVal;
				} else {
					correctAns = '';
				}
				$('#que' + questionCnt + " .identify_item ul").append('<li data-ans="' + correctAns + '" class="alphaInpt"></li>');
			}
		} else {
			$($currentques.interaction_data).each(function (choiceCnt, val) {
				var correctAns = '';
				if ($currentques.interaction_data[choiceCnt].score == 1) {
					correctAns = $currentques.interaction_data[choiceCnt].dataVal;
				} else {
					correctAns = '';
				}
				if ($currentques.interaction_data[choiceCnt].data == "#") {
					$('#que' + questionCnt + " .identify_item ul").append('<li class="text_box"><input data-ans="' + correctAns + '" class="alphaInpt" value="" type="text" maxlength="1" pattern="[A-Za-z]" /></li>');
				} else {
					$('#que' + questionCnt + " .identify_item ul").append('<li>' + $currentques.interaction_data[choiceCnt].data + '</li>');
				}
			});
		}
	};

	function generateiconfilling() {
		$('#quiz #pagenav').before('<div id="que' + questionCnt + '" class="questions ' + $currentques.questiontype + '"><div class="rhymes_word_sound_box"><h1></h1><img src="images/audio_i_sq.png" width="103" height="103"><p>' + $currentques.question + '</p></div><div class="iconfilling_type_panel"></div><div class="btnblock"><div class="validate">Submit</div><div class="continueBtn">Continue</div></div></div>');

		if (!$currentques.image) {
			//no Image available
		} else {
			$('#que' + questionCnt).prepend('<div class="rhymes_word_imgbox"><img src="' + $currentques.image + '"></div>');
		}

		$($currentques.interaction_data).each(function (choiceCnt, val) {
			var correctAns = '';
			if ($currentques.interaction_data[choiceCnt].score == 1) {
				correctAns = 'correctAns';
			} else {
				correctAns = '';
			}

			$('#que' + questionCnt + ' .iconfilling_type_panel').append('<div class="iconfilling_type_item"><div class="iconfilling_img_box"><img src="' + $currentques.interaction_data[choiceCnt].image + '" ></div><div class="iconfilling_text_box"><img id="' + $currentques.interaction_data[choiceCnt].media + '"  class="audioSmImg" /><ul></ul></div><h2><span class="result"></span></h2></div>');

			var Qtext = $currentques.interaction_data[choiceCnt].data.split('');
			choiceText = '';
			$(Qtext).each(function (i, val) {
				appendCnt = choiceCnt + 1;
				appendpath = '#que' + questionCnt + ' .iconfilling_type_panel .iconfilling_type_item:nth-child(' + appendCnt + ') .iconfilling_text_box ul';

				if (Qtext[i] == "#") {
					$(appendpath).append('<li class="text_box"><input data-ans="' + $currentques.interaction_data[choiceCnt].dataVal + '" class="alphaInpt" value="" type="text" maxlength="1" pattern="[A-Za-z]" /></li>');
				} else {
					$(appendpath).append('<li>' + Qtext[i] + '</li>');
				}
			});

		});
	};
});