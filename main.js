define(function (require, exports, module) {
	"use strict";
	
	var KeyBindingManager   = brackets.getModule('command/KeyBindingManager'),
		CommandManager = brackets.getModule("command/CommandManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		AppInit = brackets.getModule('utils/AppInit'),
		lastcm = '',
		lasttxt = '',
		nothigh = ['','cm-tab','cm-string','cm-number','CodeMirror-matchingbracket','cm-comment','cm-builtin','cm-keyword','cm-operator'],
		both = ['cm-variable-2','cm-def','cm-variable'],
		words,
		word;
	
	function highlight(txt,cm) {
		if ($.inArray(cm,nothigh) > -1 || txt == '' || txt == '$') {
			return false;
		}
		if ($.inArray(cm,both) == -1) {
			$('.'+cm).each(function(i) {
				if ($(this).html() == txt) {
					$(this).addClass('ext-highlighted');
				}
			});
		} else {
			$.each(both, function() {
				$('.'+this).each(function(i) {
					if ($(this).html() == txt) {
						$(this).addClass('ext-highlighted');
					}
				});
			});
		}
		lasttxt = txt;
		lastcm = cm;
	}
	
	function checkcursor() {
			if (lastcm != '') {
				if ($.inArray(lastcm,both) > -1) {
					$.each(both, function() {
						$('.'+this).removeClass('ext-highlighted');
					});
				} else {
					$('.'+lastcm).removeClass('ext-highlighted');
				}
			}
			words = $('.pane-content .CodeMirror:not([style*="display: none;"]) .CodeMirror-activeline .CodeMirror-line span span');
			for (var i = 0; i < words.length; i++) {
				word = $('.pane-content .CodeMirror:not([style*="display: none;"]) .CodeMirror-activeline .CodeMirror-line span span:nth-child('+(i+1)+')');
				if (word.position()['left'] <= $('.pane-content .CodeMirror:not([style*="display: none;"]) .CodeMirror-cursors .CodeMirror-cursor').position()['left']
					&& word.position()['left']+word.width() >=  $('.pane-content .CodeMirror:not([style*="display: none;"]) .CodeMirror-cursors .CodeMirror-cursor').position()['left']) {
					highlight($.trim(word.html()), $.trim(word.attr('class')));
				}
			}
	}
	AppInit.appReady(function () {
		$(document).on("mousedown", function () {checkcursor();});
		$(document).on("keydown", function () {checkcursor();});
	});
	ExtensionUtils.loadStyleSheet(module, "main.css");
});
