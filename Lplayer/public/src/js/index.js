import util from "./util.js";
import "../css/index.css";
import "../index.html";


function getMousePosition(e){
	var ev = window.event || e;
	var mouseLeft = ev.clientX;
	var mouseTop = ev.clientY;
	return {
		top:mouseTop,
		left:mouseLeft
	}
}

function getElLeftPosition(el){
	var Lplayer_bar = util.getDom(el)[0];
	var Lplayer_barLeft = 0;
	while (Lplayer_bar.parentNode) {
		Lplayer_barLeft += Lplayer_bar.offsetLeft;
		Lplayer_bar = Lplayer_bar.parentNode;
	}
	return Lplayer_barLeft
}

function getElWidth(el){
	var Lplayer_bar = util.getDom(el)[0];
	var width = Lplayer_bar.offsetWidth;
	return width;
}

function jindutiao(obj){
	var el = obj.el;
	var barEl = obj.barEl;
	var progredEl = obj.progredEl;
	util.on({
		el:el,
		event:"mousedown",
		callback:function(e,this_dom){
			e.preventDefault();
			var Lplayer_bar_mouseLeft = 0;
			var Lplayer_bar_c = this_dom;
			var Lplayer_barWidth = getElWidth(barEl);
			var Lplayer_barLeft = getElLeftPosition(barEl);
			var Lplayer_bar_progred = Lplayer_bar_c.parentNode;
			util.on({
				el:"body",
				event:"mousemove",
				callback:function(ee,this_dom){
					var progred = ((getMousePosition(e).left - Lplayer_barLeft) / Lplayer_barWidth) * 100;
					if(progred  > 100){
						progred = 100;
					}
					if(progred < 0){
						progred = 0;
					}
					Lplayer_bar_progred.style.width = progred + "%";
				}
			}).on({
				el:"body",
				event:"mouseup",
				callback:function(e,this_el){
					util.off("body","mousemove");
				}
			})
		}
	}).on({
		el:el,
		event:"mouseup",
		callback:function(e,this_el){
			util
			.off("body","mouseup")
			.off("body","mousemove");
		}
	}).on({
		el:barEl,
		event:"click",
		callback:function(e,this_el){
			var Lplayer_bar_mouseLeft = 0;
			var Lplayer_bar = this_el;
			var Lplayer_barWidth = getElWidth(barEl);
			var Lplayer_barLeft = getElLeftPosition(barEl);
			var Lplayer_bar_progred = Lplayer_bar.getElementsByClassName(progredEl)[0];
			var progred = ((getMousePosition(e).left - Lplayer_barLeft) / Lplayer_barWidth) * 100;
			Lplayer_bar_progred.style.width = progred + "%";
		}
	})
}

jindutiao({
	el:".Lplayer_bar_c",
	barEl:".Lplayer_bar",
	progredEl:"Lplayer_bar_progred"
})

jindutiao({
	el:".Lplayer_volume_c",
	barEl:".Lplayer_volume_bar",
	progredEl:"Lplayer_volume_progred"
})

util.on({
	el:".Lplayer_contorl_setUp",
	event:"click",
	callback:function(e,this_el){
		var Lplayer_contorl_c = util.getDom(".Lplayer_contorl_c")[0];
		var Lplayer_contorl_cClassName = Lplayer_contorl_c.className;
		if(Lplayer_contorl_cClassName.indexOf(" show") != -1){
			Lplayer_contorl_c.className = Lplayer_contorl_cClassName.replace(" show"," hide")
		}else{
			Lplayer_contorl_c.className = Lplayer_contorl_cClassName.replace(" hide"," show")
		}
	}
}).on({
	el:".Lplayer_contorl_volume",
	event:"mouseover",
	callback:function(e,this_el){

	}
})
