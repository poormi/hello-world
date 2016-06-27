/* 字符串替换 
用法：
var dateStr = "{0}年{1}月{2}日";
dateStr.replaceAt([2016,3,16]);
*/
String.prototype.replaceAt = function(){
  if(arguments.length==0) return this;
  for(var s= this, i=0; i<arguments.length; i++){
      if($.isArray(arguments[0])){
          var _ar = arguments[0];
          $.each(_ar,function(i,item){
              s=s.replace(new RegExp("\\{"+i+"\\}"), item);
          });
      }else
          s=s.replace(new RegExp("\\{"+i+"\\}"), arguments[i]);
  }
  return s;
};
