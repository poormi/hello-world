/**
 * Created by admin on 2015/10/15.
 */
(function($){

    "use strict";
    var tab = function(elm,options){
        var _self = this;
        _self.$elm = $(elm);
        _self.options = {
            isLink: false,
            items:[],
            click: function () {}
        };
        _self.Init = function(){
            _self.options = $.extend({},_self.options,options);
            if(_self.$elm.children().length == 0) {
                var rnode = _self.$elm;
                if(_self.$elm[0].tagName.toUpperCase() != "UL"){
                    rnode = $(document.createElement("ul"));
                    _self.$elm.append(rnode);
                    _self.$elm = rnode;
                }
                var _o =_self.options,_l = _o.isLink;
                $.each(_self.options.items,function(i,item){
                    var _node = document.createElement("li");
                    _node.className = "ell";
                    if(!!_l){
                        var l = document.createElement("a");
                        l.innerText = item.text;
                        l.href = !!item.url?item.url:"javascript:";
                        $(_node).append(l);
                    }else{
                        _node.innerText = item.text;
                        _node.setAttribute("data-range",item.value);
                    }
                    if(i==0)
                        $(_node).addClass("selected");
                    rnode.append(_node);
                });
                if(_self.$elm[0].offsetWidth < _self.$elm.parent().width()){
                    _self.$elm.css("display","block");
                    _self.$elm.find("li").css({"width":(100/_o.items.length)+"%","padding":"1.5rem 0"});
                }
                _self.EventSet();
            }
        };
        _self.SetSelected = function(i){
            var _curLi = _self.$elm.find("li").eq(i),$wrap = _self.$elm.parent();
            if(_curLi.length > 0 && !_curLi.hasClass("selected")) {
                _self.$elm.find("li.selected").removeClass("selected");
                _curLi.addClass("selected");
                if (_curLi[0].offsetLeft + _curLi.width() > $wrap.width() - 10) {
                    if (_curLi.next().length > 0)//右边有tab项
                        $wrap.scrollLeft(_curLi.next()[0].offsetLeft + _curLi.next().width() - $wrap.width());
                    else $wrap.scrollLeft(_curLi[0].offsetLeft - _self.$elm[0].offsetLeft); //右边没有tab项
                }
                else if (_curLi.prev().length > 0 && _curLi.prev()[0].offsetLeft - $wrap.scrollLeft() <= 0)
                    $wrap.scrollLeft(_curLi.prev()[0].offsetLeft - _self.$elm[0].offsetLeft);
            }
        };
        _self.EventSet = function(){
            _self.$elm.find("li").off("click").on("click",function(e){
                if(!$(this).hasClass("selected")){
                    _self.$elm.find(".selected").removeClass("selected");
                    $(this).toggleClass("selected");
                    var $wrap = _self.$elm.parent();
                    if (this.offsetLeft + this.clientWidth > $wrap.width() - 10) {//屏幕外tab还有内容未显示完，10为冗余宽度
                        if ($(this).next().length > 0) $wrap.scrollLeft($(this).next()[0].offsetLeft + $(this).next().width() - $wrap.width());
                        else $wrap.scrollLeft(this.offsetLeft - _self.$elm[0].offsetLeft);
                    }
                    else if ($(this).prev().length > 0 && $(this).prev()[0].offsetLeft - $wrap.scrollLeft() <= 0)//左边tab项在滚动条外
                        $wrap.scrollLeft($(this).prev()[0].offsetLeft - _self.$elm[0].offsetLeft);
                    _self.options.click(this);
                }
                e.stopPropagation();
            });
            _self.$elm.find("li").off("swipe",function(e,t){
                var _distance = t.x1- t.x2,i = 0,
                    $wrap = _self.$elm.parent(),
                    scrollLength = $wrap[0].scrollWidth-$wrap[0].clientWidth,
                    start = $wrap.scrollLeft();
                var animate = setInterval(function(){
                    if(i < _distance && _distance>0 && start+i < scrollLength) {
                        i=i+5;
                        $wrap.scrollLeft(start+i);
                    }
                    else if(i > _distance && _distance<0 && start+i > 0){
                        i=i-5;
                        $wrap.scrollLeft(start+i);
                    }
                    else{
                        clearInterval(animate);
                    }
                },0);
                e.stopPropagation();
            });
            $("body").off("swipe").on("swipe",function(e,t){
                var _distance = t.x1- t.x2,_cur = parseInt(_self.$elm.find(".selected").attr("data-range"));
                if(_distance>0){
                    _cur++;
                }else if(_distance<0){
                    _cur--;
                }else
                    return;
                if(_cur < _self.$elm.find("li").length && _cur>=0){
                    _self.SetSelected(_cur);
                    _self.options.click(_self.$elm.find("li").eq(_cur));
                }
            });
            $("body").off("click").on("click",function(e){
                var x1=e.pageX,
                    x2=document.body.clientWidth;
                var _distance = x2-x1,_cur = parseInt(_self.$elm.find(".selected").attr("data-range"));
                if(_distance<30){
                    _cur++;
                }else if(x1<20){
                    _cur--;
                }else
                    return;
                if(_cur < _self.$elm.find("li").length && _cur>=0){
                    _self.SetSelected(_cur);
                    _self.options.click(_self.$elm.find("li").eq(_cur));
                }
                e.stopPropagation();
            });
        };
        _self.callback = function(handler){
            handler && handler(_self);
            return _self;
        };
        _self.Init();
        return _self;
    };
    $.fn.tab = function(){
        var _self = this,
            args = Array.prototype.slice.call(arguments);
        if(_self.length == 0){
            _self = $(document.createElement("header"));
            _self.attr("id","menu");
            $("body").append(_self);
        }
        _self.addClass("tab-wrap tc");
        return new tab(_self, args[0]);
    };
})(Zepto);
