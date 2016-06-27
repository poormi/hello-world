(function(w,$) {
    "use strict";
    /*private methods*/
    var initSettings= function(params){
            var _params = {};
            if(params.length>0 && params[0].indexOf(".")>0)
                _params.url = params[0];
            if(params.length>1){
                if($.isArray(params[1])){
                    _params.data = params[1].concat();
                }
                else
                    _params.data = [params[1]];
            }
            if(params.length>2 && typeof(params[2])=="function")
                _params.success = params[2];
            if(params.length>3 && typeof(params[2])=="function")
                _params.error = params[3];
            if(params.length>4)
                _params.dataType = params[4];

            return $.extend({},api.settings,_params);
        },
        request = function(params){
            var result = {};
            this.args = initSettings(params);
            if(this.args.url.indexOf('.')>0){
                var ar = [],_i = this.args.url.indexOf('.')+ 1,_callback = "callback";
                ar.push(this.args.url.split(".")[0]);
                ar.push(this.args.url.substr(_i));
                $(".more-wrap").find(".more").each(function(i,node){
                    if($(node).text()=="加载中...")
                        $(node).text("查看更多↓");
                });
                _callback += new Date().getTime();
                ar.push("api."+_callback);
                this.args.callerName = _callback;
                api[_callback] =  (function(args){
                    var _args = args;
                    return function(data){
                        console.log(data);
                        if($.isArray(_args.data)&&_args.data.length>0 && $.inArray("voice",_args.data)>=0)
                            _args.data.shift();
                        if(!!data && !!data.flag && data.flag =="1" && !!data.result &&JSON.stringify(data.result)!="{}") {
                            _args.success(data.result);
                        }else{
                            //todo error
                            _args.error();
                        }
                    };
                })(this.args);
                //判断是否是语音入口的请求
                var voice = api.GetQueryString("voice");
                if(!!voice){
                    this.args.data.unshift("voice");//加上语音的参数
                }
                var message = "iflytek:" + api.stringify(ar),
                    defaultValue = api.stringify(this.args.data);
                result = $.extend({},result,prompt(message,defaultValue));
                if(!!result.code && result.code == "Error"){
                    this.args.error(result);
                }
            }
            else{
                console.log("arguments error");
            }
            return this;
        },
        error = function(){
            console.log('error');
            if($("body").find(".error-wrap").length==0)
            $("body").append(api.$error);
        };
    /*public client request api*/
    var api = {
        settings: {
            url:"",
            data: [],
            success: function(){
            },
            error: function(){
                error();
            },
            dataType: "json"
        },
        ajax: function(){
            if(arguments.length > 0 && arguments[0].constructor == Object){
                new request($.extend({},api.settings,arguments[0]));
            }
        },
        get: function(){
            if(arguments.length > 0){
                var args = Array.prototype.slice.call(arguments,0);
                if(typeof(args[1]) == "function")
                    args.splice(1,0,[]);
                new request(args);
            }
        },
        post: function(){
            if(arguments.length > 0){
                new request(arguments);
            }
        },
        eval: function(str){
            return eval("("+str+")");
        },
        //transform json object to String
        stringify: function(args) {
            if (typeof JSON === "undefined") {
                console.log("JSON is not supported");
                return "";
            } else {
                return JSON.stringify(args);
            }
        },
        getInfo: function(){
            console.log("devicePixelRatio:"+window.devicePixelRatio);
            console.log(""+navigator.userAgent);
            console.log(""+navigator.appVersion);
        },
        call: function(number){
            this.post("homeComponents.call",[number]);
        }
    };
    w.api = api; 
})(window,Zepto);
