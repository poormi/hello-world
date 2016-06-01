(function($, w) {
	"use strict";
	var defaults = {
			split: '/',
			url: '',
			data: [],
			onLoad: function() {

			},
			onSelect: function() {

			},
			onClose: function() {

			}
		},
		areaSelect = function(selector, context) {
			this.init.call(this, selector, context); //替换this对象
			return this;
		},
		_sClass = 'area-select';
	areaSelect.prototype = {
		constructor: areaSelect,
		init: function(selector, context) {
			var that = this,
				options = that.options = $.extend({}, defaults, context);
			that.selector = selector;
			that.selectedCodes = [];
			//优先使用设置的data属性
			if (options.data.length) {
				_init(selector, options.data);
				_bindEvents.call(that);
				options.onLoad();
			} else {
				if ($.trim(options.url) != '') {
					$.when(_request.call(that, selector)).done(function() {
						_bindEvents.call(that);
						options.onLoad();
					});
				} else console.log('Data error: there is no data here.');
			}
			return that;
		},
		getSelectedCodes: function() {
			return this.selectedCodes;
		}
	}
	$.fn.areaSelect = function() {
		var _self = this,
			args = Array.prototype.slice.call(arguments);
		_self.addClass(_sClass);
		return new areaSelect(_self, args[0]);
	};

	function _init(selector, source) {
		var $v = $('<div class="select-data">'),
			data = source;
		selector.append($v);
		if (data.length) {
			var $w = $.create('div', 'select-wrap clear'),
				$u = $.create('ul', 'select-tabs');
			selector.append($w.append($u));

			//初始化结果区域（默认第一条数据）
			var def = data[0];
			_initDefault($v, $u, def);
			//默认首个选项激活状态
			$u.children().eq(0).addClass('active');

			//初始化展开的选择区域
			var $c = $.create('div', 'select-content clear');
			$w.append($c);
			_initContent($c, source);
			//默认显示首个选择区域
			$c.children().eq(0).show();
		}
		$v.append('<i class="triangle"></i>');

		function _initDefault(child1, child2, def) {
			var $s = $('<span>'),
				$li = $('<li>'),
				_h = ['<a href="javascript:"><span>', def.name, '</span><i class="triangle"> </i>', '</a>'];
			$s.html(def.name);
			$s.data('code', def.code);
			child1.append($s);
			$li.data('code', def.code);
			$li.data('index', child2.children().length);
			child2.append($li.append(_h.join('')));
			if (!!def.data && def.data.length) {
				child1.append(defaults.split);
				_initDefault(child1, child2, def.data[0]);
			}
		}

		function _initContent(selector, source) {
			var $ul = $.create('ul');
			$ul.data('index', selector.children().length);
			$.each(source, function(i, item) {
				var $li = $.create('li'),
					_h = ['<a href="javascript:">', item.name, '</a>'];
				$li.append(_h.join(''));
				if (i == 0) $li.addClass('selected');
				$li.data('code', item.code);
				$ul.append($li);
			});
			selector.append($ul);
			if (!!source[0].data && source[0].data.length) {
				_initContent(selector, source[0].data);
			}
		}
	}

	function _request(selector) {
		var dtd = $.Deferred(),
			options = this.options;
		$.get(options.url).done(function(data) {
			if (typeof data == "string") data = eval("(" + data + ")");
			if (data.flag != void 0 && (data.flag == "true" || data.flag == true)) {
				options.data = data.data;
				_init(selector, options.data);
			} else
				console.log('Request error:please check the network and make sure the url is correct.')
			dtd.resolve();
		});
		return dtd.promise();
	}

	function _bindEvents(selector) {
		//点击弹出(隐藏)选择部分
		var _self = this,
			_click = 'click',
			_expand = 'expand',
			$head = _self.selector.children();
		_eventHandler($head.eq(0), _click, _ctrlClick);
		//点击切换区域选项
		var $ctrl = $head.eq(1).children();
		_eventHandler($ctrl.eq(0).find('li'), _click, _tabsClick);
		//点击选择具体的区域
		var $lis = $ctrl.eq(1).find('li');
		_eventHandler($lis, _click, _liClick)

		function _ctrlClick() {
			var $e = $('.' + _expand + '.' + _sClass),
				$p = $(this).parent();
			if ($p.hasClass(_expand)) {
				$p.removeClass(_expand);
			} else {
				if ($e.length)
					$e.removeClass(_expand);
				$p.addClass(_expand);
			}
		}

		function _tabsClick() {
			$ctrl.find('li.active').removeClass('active');
			var _index = $(this).data('index'),
				$all = $(this).parent().next().find('ul');
			$(this).toggleClass('active');
			$all.hide();
			$all.eq(_index).show();
		}

		function _liClick() {
			var $parent = $(this).parent(),
				_index = $parent.data('index'),
				_len = _self.selectedCodes.length,
				_currentCode = $(this).data('code');
			$parent.children().removeClass('selected');
			$(this).addClass('selected');

			//保存当前选择区域编码
			if (_len > _index)
				_self.selectedCodes[_index] = _currentCode;
			else {
				if (_len < _index)
					for (var i = _index; i > _len; i--) {
						_self.selectedCodes.push(null);
					}
				_self.selectedCodes.push(_currentCode);
			}

			//回调自定义点击事件
			_self.options.onSelect(_currentCode);

			//切换至下一个选项
			var $tab = $parent.parent().prev().children().eq(_index);
			$tab.find('span').text($(this).text());
			if ($tab.next().length) $tab.next().click();
			else {
				var vArr = $.trim($ctrl.eq(0).text()).split(' ');
				$.each($head.eq(0).find('span'), function(i, elm) {
					$(elm).text(vArr[i]);
				});
				//末个选项点击后触发关闭
				$head.click();
				//回调自定义关闭事件
				_self.options.onClose(_self.selectedCodes);
			}
		};
	}

	function _eventHandler(selector, type, fn) {
		selector.on(type, fn);
	}

	$.create = function(elm, className) {
		return $(document.createElement(elm)).addClass(className);
	}
})(jQuery, window);