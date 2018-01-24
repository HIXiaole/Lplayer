/**
 * @author xiaole
 * @createTime 2017-1-20
 * @blog https://axiaole.com
 * @description  
 * 一个简单的轮播图插件  
 * 因为业务不需要swiper 插件那么多的功能 
 * 所以自己简单封装一个 能实现效果就行
 */


(function(global,swiper,util){
	global["LeSwiper"] = swiper(util);
})(window,function(util){
	function Swiper(ele,options){
		this.opt = options;
		/*this.default = {
			loop:false,
			autoplay:2000
		};*/
		this.move = {};
		this.start = {};
		this.index = this.opt.loop ? 1 : 0;
		this.total = 0;
		this.endTime = 0;
		this.startTime = 0;
		this.timeout = null;
		this.ele = document.getElementsByClassName(ele)[0];
		this.pageEl = this.opt.pageation ?  document.getElementsByClassName(this.opt.pageation)[0] : null;
		this.pageChild = [];
		this.init();
	}
	Swiper.prototype = {
		init:function(){
			var loop = this.opt.loop;
			this.elChild = this.ele.children;
			this.el_len = this.elChild.length;
			if(loop){
				var bb = this.elChild[0];
				this.ele.appendChild(this.elChild[0].cloneNode(true));
				this.ele.insertBefore(this.elChild[this.el_len-1].cloneNode(true),this.elChild[0]);
			}
			this.resize();
			this.ele.style.width = this.elChild.length*this.elWidth+"px";
			this.ele.style.height = this.elHeight+"px";
			this.ele.style.transform = "translate3d("+ (loop ? -this.elWidth : 0) +"px,0px,0px)";
			this.ele.parentNode.style.overflow = "hidden";
			this.ele.parentNode.style.position = "relative";
			var cd = this.elChild;
			if(	!!this.opt.pageation){	
				for (var i = 0; i < this.el_len ; i++) {
					var span = document.createElement("span");
					this.pageChild.push(span);
					span.className = ( i == 0 )? "sw_page_item active" : "sw_page_item";;
					this.pageEl.appendChild(span);	
				}
			}
			this.bindEvent();
			this.pageEl && util.addStyleToHead();
			this.opt.autoplay && this.autoplay();
		},
		bindEvent:function(){
			var me = this;
			var moveEven = this.moveEven =  util.isMobile ? "touchmove" : "mousemove" ;
			var startEven = this.startEven = util.isMobile ? "touchstart" : "mousedown" ;
			var endEven = this.endEven = util.isMobile ? "touchend" : "mouseup";
			var touchEventListen = this.touchEventListen = function(e){
				e = e || window.event;
				if(e.type === moveEven){
					me.moveHandle(e);
				}
				else if(e.type === endEven){
					me.endHandle(e);
				}
				else if(e.type === startEven){
					me.startHandle(e);
				}
			}
			window.addEventListener("resize",this.resize.bind(this),false);
			util.isMobile && this.ele.addEventListener(moveEven,touchEventListen,false);
			this.ele.addEventListener(startEven,touchEventListen,false);
			util.isMobile ? this.ele.addEventListener(endEven,touchEventListen,false) : document.addEventListener(endEven,touchEventListen,false);
		},
		resize:function(e){
			this.elWidth = this.ele.parentNode.offsetWidth;
			this.elHeight = this.ele.parentNode.offsetHeight;
			var cd = this.ele.children;
			for (var i = 0; i < this.ele.children.length ; i++) {
				cd[i].style.position = "absolute";
				cd[i].style.width = this.elWidth+"px";
				cd[i].style.height = this.elHeight+"px";
				cd[i].style.left = this.elWidth*i+"px";
				cd[i].style.top = "0px";	
			}
		},
		moveHandle:function(e){
			var clientX = util.isMobile ? e.changedTouches[0].clientX : e.clientX;
			var clientY = util.isMobile ? e.changedTouches[0].clientY : e.clientY;
			this.move.x = clientX;
			this.move.y = clientY;
			this.spanX = this.move.x - this.start.x; //滑动的距离
			this.spanY = this.move.y - this.start.y;
			
			e.stopPropagation();
			e.preventDefault();
			
			this.positionUpdate();
		},
		startHandle:function(e){
			document.addEventListener(this.moveEven,this.touchEventListen,false);
			var startX = util.isMobile ? e.changedTouches[0].clientX : e.clientX;
			var startY = util.isMobile ? e.changedTouches[0].clientY : e.clientY;
			clearTimeout(this.timeout);
			this.startTime = +new Date();
			this.start.x = startX;
			this.start.y = startY;
			this.translateX = util.getTransform(this.ele).translateX;
		},
		endHandle:function(e){
			document.removeEventListener(this.moveEven,this.touchEventListen,false);
			var me = this;
			me.timeout && me.autoplay();
			this.endTime = +new Date();
			var me = this;
			var spanTime = this.endTime - this.startTime;
			//开启 环绕的话 不执行
			if(!this.opt.loop){
				//左碰壁 反弹
				if(this.index == 0 && this.spanX > 0){
					this.moveTo(0,true);
					return
				}
				//右碰壁 反弹
				if(this.index == this.el_len-1 && this.spanX < 0){
					this.moveTo(this.el_len-1,true);
					return
				}
			}
			//触摸时间在 70-150 之间 触摸距离在 20 以内则符合条件 
			if(Math.abs(this.spanX) > 20 && spanTime > 70 && spanTime < 150
				||
				Math.abs(this.spanX) > this.elWidth /3){
				this.moveTo();	
			}
			//不符合条件 则反弹到原地 index 值不做处理
			//但是 index 如果是 0 / 最后 此时触摸会瞬间切换到 第一张/最后一张
			//如果index 在切换的时候不变化 就会反弹到原先那个值 并不是切换过来的这个值 
			else{
				//处理 反弹 不是碰壁反弹 是触摸距离不够 才执行
				this.index = this.index == 0 ? (this.spanX < 0 ? this.index : this.index = this.el_len ) : this.index == this.elChild.length-1 ? (this.spanX > 0 ? this.index : 1 ) : this.index;
				this.moveTo(this.index,true);
			}	
		},
		moveTo:function(index,isFant){
			var me = this;
			!isFant  && (this.spanX < 0 ? this.index ++ : this.index--);
			//如果是反弹 则不执行这里
			if(!isFant && this.opt.loop){
				this.index = this.index < 0 ? this.el_len-1 : this.index == this.elChild.length ?  2 : this.index;
			}
			if(!this.opt.loop){
				this.index = this.index == this.elChild.length ? 0 : this.index;
			}
			this.ele.style.transition = "all 300ms ease";
			this.ele.style.transform = "translate3d("+  (-(isFant ? index : this.index)*this.elWidth) +"px,0px,0px)";
			this.pageEl && this.pageation();
			this.timeout1 = setTimeout(function(){
				me.ele.style.transition = "all 0ms ease";
			},300)
		},
		/**
		 * [positionUpdate description] 
		 * (下面图片个数 不包括拷贝的第一张和最后一张)
		 * 当前 index > 图片个数的时候(确定为拷贝的第一张) 瞬间切换成第一张的 px 值 
		 * 当前 index < 0(确定为拷贝的最后一张) 瞬间切换成最后一张的 px 值 
		 * 实现无缝切换
		 * @return {[type]} [description]
		 */
		positionUpdate:function(){
			var transform;
			if(this.opt.loop){
				if(this.index > this.el_len && this.spanX < 0){
					transform = "translate3d("+  (-this.elWidth+this.spanX) +"px,0px,0px)";	
				}
				else if(this.index < 1 && this.spanX > 0){
					transform = "translate3d("+  (-(this.elWidth*this.el_len)+this.spanX) +"px,0px,0px)";
				}
				else{
					transform = "translate3d("+  (this.translateX+this.spanX) +"px,0px,0px)";
				}
			}
			else{
				transform = "translate3d("+  (this.translateX+this.spanX) +"px,0px,0px)";
			}
			this.ele.style.transform = transform;
			var me = this;
		},
		pageation:function(){
			var index = (this.opt.loop ? this.index-1 : this.index ) == this.pageChild.length ? 0 : (this.opt.loop ? this.index-1 : this.index ) < 0 ? this.pageChild.length-1 : (this.opt.loop ? this.index-1 : this.index );
			this.pageEl.getElementsByClassName("active")[0].className = this.pageEl.getElementsByClassName("active")[0].className.replace(/(^|\s)active($|\s)/,"");
			this.pageChild[index].className = this.pageChild[index].className + " active";
		},
		autoplay:function(){
			var me = this;
			me.timeout = setTimeout(function fn(){
				me.spanX = -1; 
				//之前没写自动播放时是判断触摸距离 >/< 0 来决定index 是++ 还是--
				//写了自动播放后 避免重写代码 给spanX 赋值负数 就是 ++ 如果 -- 则赋值正数
				me.translateX = util.getTransform(me.ele).translateX;
				//重新赋值 当前的 translateX 值，避免调用 positionUpdate 方法时一直为 0 
				//导致每次 切换图片是 都会瞬间跳到 第一张图片 （闪一下）
				me.positionUpdate();
				setTimeout(function(){
					me.moveTo();
				},50)
				//这里用定时器是因为 调用 positionUpdate 方法，如果需要瞬间切换回第一张/最后一张
				//此时如果马上调用 moveTo 则会为元素 加上延时属性 这时用户可以看到 切换的瞬间
				//所以 需要延时调用 等待切换完成在进行调用
				clearTimeout(me.timeout);
				//清除定时器 重新绑定下一个定时器
				me.timeout = null;
				me.timeout = setTimeout(fn,me.opt.autoplay);
			},me.opt.autoplay)
		}
	}
	return Swiper;
},{
	getTransform:function(ele){
		if(window.getComputedStyle){
			return this.transformFormat(document.defaultView.getComputedStyle(ele,null).transform);
		}else{
			return this.transformFormat(ele.currentStyle.transform);
		}
	},
	transformFormat:function(str){
		var arr = /matrix\((.+)\)/.exec(str)[1].split(",");
		return {
			scaleY:Number(arr[0]),
			scaleX:Number(arr[3]),
			translateX:Number(arr[4]),
			translateY:Number(arr[5]),
			skewX:Number(arr[1]),
			skewY:Number(arr[2])
		}
	},
	addStyleToHead:function(){
		var cssStr = ".sw_page_item{display:inline-block;width:10px;height:10px;border-radius:50%;background-color:rgba(135, 94, 94, 0.23);}.sw_page_item.active{background-color:rgba(33, 113, 207, 0.6);}";
		var styleTag = document.createElement("style");
		styleTag.type = "text/css";
		if(styleTag.styleSheet){
			styleTag.styleSheet.cssText = cssStr;
		}else{
			var textNode = document.createTextNode(cssStr);
			styleTag.appendChild(textNode);
		}
		(document.head || document.getElementsByTagName("head")[0]).appendChild(styleTag);
	},
	isMobile:(function(){ return !!navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) })()
})