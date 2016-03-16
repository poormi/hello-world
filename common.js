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
