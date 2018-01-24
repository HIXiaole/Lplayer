var eventStack = {};//eventStack

function eventFn(e){  
    var me = this;
	for(let el = e.target; el != document; el = el.parentNode){
        var elArr = [];  
        var classname =  el.className;
        if(typeof classname == "string" && classname.indexOf(" ") != -1 ){
            let elClass = el.className.split(" ");
            elClass.forEach(function(v,i,arr){
                elArr.push("." + v);
            })
            el.id && elArr.push("#" + el.id);
            elArr.push(el.tagName.toLowerCase());
        }else{
            el.className && elArr.push("." + el.className);
            el.id && elArr.push("#" + el.id);
            elArr.push(el.tagName.toLowerCase());
        }
        for(let i = 0; i<elArr.length; i++){
            for(var ev in eventStack){
                if(e.type == ev){
                    if(elArr[i] in eventStack[ev]){
                        if(me == eventStack[ev][elArr[i]]["fel"]){
                            for(var evIndex = 0; evIndex < eventStack[ev][elArr[i]]["callback"].length; evIndex++){
                                eventStack[ev][elArr[i]]["callback"][evIndex](e,el);
                            }
                            return false
                        }
                    }
                }
            }
        }
    }          	               
}

//# . 返回id || class
function returnElType(el){
    if(/^#.+/.test(el)){
        return "id";
    }else if(/^\..+/.test(el)){
        return "class";
    }else{
        return "tag";
    }
}

function jsonp(){
    if(this.method === "GET"){
        var script =  document.createElement("script");
        var jsonpCallbackName = this.jsonpCallbackName || "dataCallbackFun";
        window[jsonpCallbackName] = function(data){
            this.callback && this.callback(data,null);
        };
        script.src = this.url + "?callback="+jsonpCallbackName;
        document.body.appendChild(script);
        script.onload = function(){
            document.body.removeChild(script);
            script = null;
            window[jsonpCallbackName] = null;
        }
    }else if( this.method === "POST"){
        var form = document.createElement("form");
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.name = "iframe_target";
        form.action = this.url;
        form.target = "iframe_target";
        form.method = "post";
        document.body.appendChild(form);
        document.body.appendChild(iframe);
        if(this.data){
            var text = document.createElement("input");
            text.type = "text";
            text.name = "data";
            text.value = this.data;
            form.appendChild(text);
        } 
        form.submit();
        setTimeout(function(){
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            form = null;
            iframe = null;
        },200)
    } 
}

var util = {
    getId:function(name){
        return document.getElementById(name);
    },
    getClass:function(name){
        return document.getElementsByClassName(name);
    },
    getTag:function(name){
        return document.getElementsByTagName(name);
    },
    getEl:function(el){
        var elType = returnElType(el);
        switch(elType) {
            case "class":
                return this.getClass(el.replace(".",""));
                break;
            case "id":
                return this.getId(el.replace("#",""));
                break;
            default :
                return this.getTag(el);
        }
    },
	on:function(param){
		var el = param.el,
            fel = param.fel || null,
            event = param.event || "click",
            callback = param.callback;
            callback || console.error("document 节点 " + el + " 未传入回调函数");
        eventStack[event] = eventStack[event] || {};
        eventStack[event][el] = eventStack[event][el] || {};
        eventStack[event][el]["fel"] = fel ? this.getEl(fel)[0] : document;
        eventStack[event][el]["callback"] = eventStack[event][el]["callback"] || [];
        eventStack[event][el]["callback"].push(callback);
        fel ? ((typeof fel == "string") 
            ? this.getEl(fel)[0].addEventListener(event,eventFn,false)
            : fel.addEventListener(event,eventFn,false))
            : document.addEventListener(event,eventFn,false);

        return this
	},
	off:function(el,event){
		delete eventStack[event][el];
        return this
	},
    createElement:function(elName,callback){
        var el = document.createElement(elName);
        callback && callback(el);
    },
    removeElement:function(delEl){
    	typeof delEl == "string" 
    	?  this.getClass(delEl)[0].parentNode.removeChild(this.getClass(delEl)[0])
    	:  delEl.parentNode.removeChild(delEl) 
    },
	setStyle:function(obj){
        var el = this.getClass(obj.el)[0];
        var k = Object.keys(obj.style);

        for (var i = 0; i < k.length; i++) {
        	el.style[k[i]] = obj.style[k[i]];
        	// console.log(k[i] +"============"+obj.style[k[i]])
        }
    },
    findParent:function(this_el,felClass){
    	var el = this_el;
    	while(el.className != felClass){
    		el = el.parentNode
    	}
    	return el
    },
    findChild:function(this_el,childClass){
        var el = this_el;
        var childs = el.getElementsByClassName(childClass);
        return childs
    },
    findSibling:function(this_el,siblingClass){
        var el = this_el;
        while(el.className != siblingClass){
            el = el.nextElementSibling;
        }
        return el
    },
    getElPosition:function(el){
        var el = typeof el == "string" ? this.getEl(el)[0] : el;
        var elLeft = 0;
        var elTop = 0;
        while (el.parentNode) {
            elLeft += el.offsetLeft;
            elTop += el.offsetTop;
            el = el.parentNode;
        }
        return {
            left:elLeft,
            top:elTop
        }
    },
    getMousePosition:function(e){
        var ev = window.event || e;
        var mouseLeft = ev.clientX;
        var mouseTop = ev.clientY;
        return {
            top:mouseTop,
            left:mouseLeft
        }
    },
    timeFormat:function(time){ //将时间(秒) 格式 00:00
        var timeM = parseInt(time / 60);
        var timeS = parseInt(time % 60);
        timeM = timeM < 10 ? ("0" + timeM) : timeM;
        timeS = timeS < 10 ? ("0" + timeS) : timeS;
        return timeM + ":" + timeS
    },
    objIsEmpty:function(obj){
        if(Object.prototype.toString.call(obj) == "[object Array]"){
            if(obj.length){
                return false
            }
            return true
        }else{
            for(let k in obj){
                return false
            }
            return true
        }
    },
    http:function(obj){
        if(obj.dataType === "jsonp"){
            jsonp.call(obj);
            return
        }
        var url = obj.url;
        var method = obj.method;
        var async = String(obj.async) == "undefined" ? true : obj.async;
        var callback = obj.callback;
        var dataType = obj.dataType || "text";
        var contentType = obj.contentType;
        var processData = obj.processData;
        var data = obj.data;
        typeof processData === "undefined" ? (data = JSON.stringify(data)) : data;
        var ajax;
        if(window.XMLHttpRequest){
            ajax = new XMLHttpRequest();
        }else{
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if(ajax == null){
            console.log("XMLHttpRequest 对象为空！");
            return
        }

        ajax.onreadystatechange = function(){
            
            if(ajax.readyState == 4){
                if(ajax.status >= 200 && ajax.status < 400){
                    var data = ajax.responseText;
                    callback && callback(data,null);
                }else{
                    console.log(ajax.readyState)
                    callback && callback(null,"服务器错误");
                }
            }
            
        }
        ajax.onerror = function(){
            callback && callback(null,"ajax error");
        }

        ajax.open(method,url,async);
        ajax.responseType = dataType;

        typeof contentType === "undefined" ? (method == "POST" 
        ? ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8")
        : ajax.setRequestHeader('Content-Type', 'application/json')) : null
        
        !data ? ajax.send(null) : ajax.send(data);
    }
}
module.exports = util;