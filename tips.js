(function($, w) {
	"use strict";
	var def = {
			type: 'title',
			message: ''
		},
		tips = function(selector, options) {
			if (typeof options === 'string')
				options = {
					type: options
				};
			this.selector = selector;
			this.options = $.extend({}, def, options);
			this.init();
		},
		B = $('<div></div>').appendTo($('body'));
	tips.prototype = {
		constructor: tips,
		init: function() {
			var $s = this.selector,
				op = this.options,
				msg;
			if ($.trim(op.message) !== '') {

			} else {
				if ($s.length > 1)
					$s.each(function(i, s) {
						_i($(s));
					});
				else _i($s);
			}

			function _i($s) {
				var msg = $s.attr('title');
				if (!!msg && $.trim(msg) !== '') {
					_r($s, msg);
				} else {
					$.each($s.children(), function(i, elm) {
						_i($(elm));
					});
				}
			}

			function _r(elm, msg) {
				var $t = $('<div></div>'),
					_id = ($(elm).attr('id') ? $(elm).attr('id') : $(elm)[0].tagName.toLowerCase()) + '-tips-' + ++$('.t-' + op.type).length;
				$t.attr('id', _id);
				$(elm).attr('data-rel', '#' + _id);
				$t.addClass('t-' + op.type);
				$t.css('display', 'none');
				if (op.type === 'tips') $t.html('<b class=\'t-arrow-tb\'><i class=\'t-arrow-c\'></i><i class=\'t-arrow\'></i></b>');
				_c(msg);
				$t.append(msg);
				B.append($t);
				$(elm).removeAttr('title');

				$(elm).on('mouseover', function() {
					var that = $(this),
						_pos = that.offset(),
						$tip = $(that.attr('data-rel'));
					$tip.css({
						'top': _pos.top - ($tip.outerHeight() - that.height()) / 2,
						'left': _pos.left + that.width()
					});
					$tip.show();
				}).on('mouseout', function() {
					$($(this).attr('data-rel')).hide();
				});


				function _c() {
					var _n = ['\n', '&#10;', '&#13;'];
					$.each(_n, function(i, _) {
						if (msg.indexOf(_) >= 0)
							var _reg = new RegExp(_, 'g');
						msg = msg.replace(_reg, '<br>');
					});
				}
			}

		}
	}
	$.fn.tips = function() {
		var _self = this,
			args = Array.prototype.slice.call(arguments);
		return new tips(_self, args[0]);
	}
})(jQuery, window);