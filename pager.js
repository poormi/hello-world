/**
 * Created by jingdai on 2015/9/10.
 */

(function($){
    "use strict";
    var pageEvent = function(Pager){
            if(Pager.isLast) return;
            var _op = Pager.options,_max = parseInt(_op.max_page),_cur = parseInt(_op.current_page);
            if(_max <= _cur + 1){
                Pager.isLast = true;
                Pager.$dom.hide();
                _op.current_page = _max;
            }else{
                _op.current_page++;
            }

            _op.paged(_op.current_page);
        },
        Pager = function(elm,options){
            var _self = this;
            _self.isLast = false;
            _self.$elm = $(elm);
            _self.defaultOptions = {
                current_page: 1,
                paged: function () {}
            };
            _self.Init = function(){
                _self.options = $.extend({},_self.defaultOptions,options);
                if(_self.$elm.children(".more").length == 0) {
                    var $_dom = $("<a href=\"javascript:\" class=\"db more tc\">查看更多↓</a>");
                    _self.$dom = $_dom;
                    _self.$elm.append($_dom);

                    _self.EventSet();
                }else{
                    _self.$dom = _self.$elm.children(".more");
                    _self.$dom.show();
                }
            };
            _self.EventSet = function(){
                var _pager = _self;
                _self.$dom.off("click").on("click",function(){pageEvent(_pager);});
                _self.$elm.parent().off("swipe").on("swipe", function (e,t) {
                    var _distance = t.y1- t.y2;
                    if(!_pager.isLast && _distance>0 && $(document).height() <= $("body").scrollTop()+$("body").height()){
                        _pager.$dom.text("加载中...");
                        pageEvent(_pager);
                    }
                });
            };

            _self.Init();
            return _self;
        };
    $.fn.Pager = function(){
        var _self = this,
            args = Array.prototype.slice.call(arguments);
        return new Pager(_self,args[0]);
    };
})(Zepto);
