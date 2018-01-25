/*
* @author axiaole
* @date 2017/11/05
* @blog axiaole.com
*/

import util from "./util.js";
import svg from "./svg.js";

const [win, doc] = [window, document];

const musicApi = "http://localhost:3000";

var endedListen = null; //全局变量 后续 remove/add event要用到

let onePageLoading = true;

let styleSheet = '@media screen and (max-width:500px){body a:active{-webkit-tap-highlight-color:transparent}body .Lplayer{width:95%}.Lplayer .Laolayer_contorl_lyric,.Lplayer .Lplayer_contorl_volume,body .Lplayer_lyric{display:none}.Lplayer .Lplayer_title{max-width:60%}}*{margin:0;padding:0}body,html{font-family:PingFangSC-Semibold,Microsoft YaHei,sans-serif}li{list-style:none}.Lplayer{position:relative;max-width:500px!important;min-width:300px!important;width:auto;max-height:90px!important;margin:auto}.Lplayer_overflow{overflow:hidden;border-radius:5px;box-shadow:0 0 5px #333}.Lplayer_left{position:relative;float:left;width:90px;height:90px}.Lplayer_left img{width:100%;height:100%}.Lplayer_left .Lplayer_contorl_suspend,.Lplayer_left:before{position:absolute}.Lplayer_left .Lplayer_contorl_suspend{top:29px;left:30px}.Lplayer_right{position:relative;margin-left:90px;border-left:0;height:90px}.Lplayer_contorl_c a,.Lplayer_contorl_volume,.Lplayer_contorl a{display:inline-block;opacity:.5;height:32px;width:32px;margin-right:10px}.Lplayer_contorl_volume{position:relative;cursor:pointer}.Lplayer_contorl_c a,.Lplayer_contorl_volume{height:20px;width:20px;margin-right:0}.Lplayer_contorl_c{position:absolute;top:7px;right:0}.Lplayer_contorl .Lplayer_contorl_setUp{position:absolute;margin-right:0;width:20px;height:20px;right:0;top:6px}.Lplayer_contorl_c a:hover,.Lplayer_contorl_setUp:hover,.Lplayer_contorl_volume:hover,.Lplayer_contorl a:hover{opacity:1}.Lplayer_contorl,.Lplayer_contorl_up{position:relative;width:90%;margin:auto;top:8px}.Lplayer_contorl{top:10px}.Lplayer_info{font-size:12px;height:20px;line-height:20px;overflow:hidden}.Lplayer_time,.Lplayer_title{display:block;height:100%;white-space:nowrap;text-decoration:none;float:left;max-width:200px;overflow:hidden;text-overflow:ellipsis;color:#333}.Lplayer_time{float:right}.Lplayer_bar{position:relative;height:20px;margin:auto}.Lplayer_bar:before{content:"";position:absolute;top:10px;left:0;height:3px;width:100%;background-color:rgba(43,37,37,.19)}.Lplayer_bar_loaded,.Lplayer_bar_progred{position:absolute;height:3px;top:10px;left:0;background-color:rgba(43,37,37,.5);width:0}.Lplayer_bar_loaded{transition:all .3s ease;-webkit-transition:all .3s ease}.Lplayer_bar_c{position:absolute;z-index:1;top:-5px;right:-5px;width:10px;height:10px;border-radius:50%;background-color:#fff;border:1px solid rgba(43,115,224,.68);cursor:pointer}.Lplayer_bar_progred,.Lplayer_volume_progred{background-color:rgba(43,115,224,.68)}.Lplayer_contorl_volume,.Lplayer_contorl_volume:hover .Lplayer_contorl_volume span{display:inline-block}.Lplayer_volume_bar{position:absolute;z-index:1;top:8px;left:15px;width:65px;height:3px;background-color:#333;display:none}.Lplayer_contorl_volume:before{content:"";position:absolute;z-index:1;top:0;left:0;height:100%;width:95px;background-color:#000;display:none}.Lplayer_volume_progred{position:absolute;top:0;left:0;width:0;height:3px;display:none}.Lplayer_volume_c{content:"";position:absolute;top:-5px;right:-7px;width:10px;height:10px;background-color:#fff;border:1px solid rgba(43,115,224,.68);border-radius:50%;display:none}.Lplayer_contorl_volume:hover .Lplayer_volume_bar,.Lplayer_contorl_volume:hover .Lplayer_volume_c,.Lplayer_contorl_volume:hover .Lplayer_volume_progred,.Lplayer_contorl_volume:hover:before{display:block}.Lplayer_lyric{position:fixed;bottom:0;left:0;background-color:rgba(0,0,0,.5);transition:all .3s ease;transform:translateY(50px);-webkit-transition:all .3s ease;-webkit-transform:translateY(50px);overflow:hidden;height:50px;width:100%}.Lplayer_lyric:hover{height:150px}.Lplayer_lyric:hover .Lplayer_lyric_times{margin-top:50px}.Lplayer_lyric.hide{transform:translateY(100%);-webkit-transform:translateY(100%)}.Lplayer_lyric.show{transform:translateY(0);-webkit-transform:translateY(0)}.Lplayer_lyric_time{position:relative;width:100%;line-height:50px;text-align:center;font-size:20px;text-shadow:0 0 5px #333;font-weight:700;color:#000;transition:all .3s ease;transform:scale(.8);-webkit-transform:scale(.8);-webkit-transition:all .3s ease}.Lplayer_lyric .Lplayer_lyric_curtime{color:#fff;transform:scale(1);-webkit-transform:scale(1)}.Lplayer_lyric_time .gradient{position:absolute;overflow:hidden;white-space:nowrap;height:100%;width:0;color:red;top:0;left:0;transition:all .2s ease}.Lplayer_lyric_time .defau,.Lplayer_lyric_time .gradient{opacity:0}.Lplayer_lyric_curtime .defau,.Lplayer_lyric_curtime .gradient{opacity:1}.Lplayer_lyric_time.Lplayer_lyric_left,.Lplayer_lyric_time.Lplayer_lyric_right{position:absolute;width:auto;top:0}.Lplayer_lyric_left{right:53%}.Lplayer_lyric_right{left:53%}.Lplayer_list{max-height:150px;overflow-y:scroll}.Lplayer_list .Lplayer_list_music.current{background-color:#e5e5e5}.Lplayer_list::-webkit-scrollbar{width:5px;border-radius:2px}.Lplayer_list::-webkit-scrollbar-track{background-color:#fff}.Lplayer_list::-webkit-scrollbar-thumb{background-color:#333;border-radius:2px}.Lplayer_list.show{display:block}.Lplayer_list.hide{display:none}.Lplayer_list>ul{position:relative;counter-reset:lplayerList}.Lplayer_list>ul>li{position:relative;counter-increment:lplayerList;line-height:30px;height:30px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;padding-left:40px;border:1px solid #e5e5e5;margin-bottom:-1px}.Lplayer_list>ul>li:hover{cursor:pointer;background-color:#e5e5e5}.Lplayer_list>ul>li:before{content:counter(lplayerList);position:absolute;left:0;top:0;width:40px;line-height:30px;text-align:center;color:#8c8686}';

function lplayerHTML(){
	return `
		<div class="Lplayer_overflow">
			<div class="Lplayer_left">
				<img class="Lplayer_img" src="./img/jing.jpg" alt="">
			</div>
			<div class="Lplayer_right">
				<div class="Lplayer_contorl_up">
					<div class="Lplayer_info">
						<a class="Lplayer_title" href="javascript:;">最美的新娘</a>
						<div class="Lplayer_time">
							<span class="Lplayer_current_time">00:00</span><span>/</span><span class="Lplayer_total_time">00:00</span>
						</div>
					</div>
					<div class="Lplayer_bar">
						<div class="Lplayer_bar_loaded"></div>
						<div class="Lplayer_bar_progred">
							<div class="Lplayer_bar_c"></div>
						</div>
					</div>
				</div>
				<div class="Lplayer_contorl">
					<a href="javascript:;" class="Lplayer_contorl_prev">
						${svg("prev")}
					</a>
					<a href="javascript:;" class="Lplayer_play_btn Lplayer_contorl_play">
						${svg("play")}
					</a>
					<a href="javascript:;" class="Lplayer_contorl_next">
						${svg("next")}
					</a>
					<div class="Lplayer_contorl_c">
						<div  href="javascript:;" class="Lplayer_contorl_volume">
							<span class="Lplayer_volume_bar">
								<span class="Lplayer_volume_progred" style="width:50%">
									<span class="Lplayer_volume_c"></span>
								</span>
							</span>
							${svg("volume")}
						</div>
						<a href="javascript:;" class="Lplayer_contorl_list">
							${svg("list")}
						</a>
						<a href="javascript:;" class="Lplayer_contorl_mode">
							${svg("loop")}
						</a>
						<a href="javascript:;" class="Laolayer_contorl_lyric">
							${svg("lyric")}
						</a>
					</div>
				</div>
			</div>
			<div class="Lplayer_list"></div>
		</div>
	`
}

function addHTML(){
	this.el.innerHTML = lplayerHTML();
	this.el.classList.add(this.name);
}

function addStyle(){
	util.createElement("style",(el)=>{
		el.className = "Lplayer_style";
		el.innerText = styleSheet;
		doc.head.appendChild(el);
	})
}

function BarEvent(thumbel,barel,type,attr){
	let me = this;
	util.on({
		el:thumbel,
		event:"mousedown",
		callback:function(e,this_dom){
			e.preventDefault();
			me.dom["lplayerAudio"].removeEventListener("ended",endedListen); //按下准备拖动的时候取消 播放结束事件 避免拖动到最后 直接切换下一首歌曲
			type == "playerProgred" && UpdateProgredColor();
			util.on({
				el:"body",
				event:"mousemove",
				callback:function(e,this_dom){
					setBarpublic(e);
				}
			}).on({
				el:"body",
				event:"mouseup",
				callback:function(e,this_el){
					me.dom["lplayerAudio"].addEventListener("ended",endedListen);//鼠标弹起 继续绑定结束事件
					util.off("body","mousemove");
				}
			})
		}
	}).on({
		el:barel,
		event:"click",
		callback:function(e,this_el){
			setBarpublic(e);
			type == "playerProgred" && UpdateProgredColor();
		}
	})

	function setBarpublic(e){//鼠标拖动 临时 公共函数
		let barWidth = me.bar[type].parentNode.offsetWidth;
		let barLeftPosition = util.getElPosition(me.bar[type]).left;
		let progredPercent = ((util.getMousePosition(e).left - barLeftPosition) / barWidth) ;//获取当前时间 / 总时间的比例
		progredPercent = contorlRatio(progredPercent);
		updateBar.call(me,type,progredPercent,attr); //修改bar
		type == "playerProgred" && setCurrentTime.call(me,me.dom["lplayerAudio"].duration * progredPercent) //修改当前时间 传比例
		type == "volumeProgred" && me.setVolume(progredPercent);								//总时间 * 比例(拖动width/总width) = 当前时间/拖动的秒数 （200 * 0.5 = 100s 拖动100秒 ）
	}																	
}

function addEvent(){
	let me = this;

	let setLoadedBarTempFun = null;

	let modeIndex = 0;

	endedListen = function(){
		endedFun.call(me);
	}

	setLoadedBarTempFun = function(){
		//buffered: 获取秒数 需要用 end 方法 来获取 
		let bufferPercent = me.dom["lplayerAudio"].buffered.length ? (me.dom["lplayerAudio"].buffered.end(me.dom["lplayerAudio"].buffered.length-1) / me.dom["lplayerAudio"].duration) : 0;
		updateBar.call(me,"playerLoaded",bufferPercent , "width");//设置缓冲条
	}


	BarEvent.call(me,".Lplayer_bar_c",".Lplayer_bar","playerProgred","width");

	BarEvent.call(me,".Lplayer_volume_c",".Lplayer_volume_bar","volumeProgred","width");

	me.dom["lplayerAudio"].addEventListener("canplay",() =>{
		//第三步 
		canplayFun.call(me);
	});

	me.dom["lplayerAudio"].addEventListener("durationchange",()=>{ //当资源长度改变 
		//第二步
		setTotalTime.call(me);//获取资源长度 设置资源时间
		setLoadedBarTempFun(); //兼容性 progress 事件 获取duration 一开始是 0 
	});

	me.dom["lplayerAudio"].addEventListener("timeupdate",()=>{ //当播放时间改变
		//第四步 
		if(me.dom["lplayerAudio"].currentTime > me.dom["lplayerAudio"].duration-1 && me.dom["lplayerAudio"].currentTime < me.dom["lplayerAudio"].duration){
			//单曲播放模式 由于是原生自带的 所以并没有触发ended事件 所以模拟一个
			me.mode == "single" && UpdateProgredColor();//只针对单曲
		}
		setCurrentTime.call(me);//设置当前时间
		setLyricScroll.call(me);
		updateBar.call(me,"playerProgred",me.dom["lplayerAudio"].currentTime / me.dom["lplayerAudio"].duration , "width");//设置进度条
	});															//比例 当前时间 除以 总时间

	me.dom["lplayerAudio"].addEventListener("progress",()=>{
		//第一步
		setLoadedBarTempFun(); //请求数据的时候 获取 buffer 并设置
	})

	me.dom["lplayerAudio"].addEventListener("ended",endedListen)//当播放完成
	
	util.on({
		el:".Lplayer_contorl_next",
		callback:(e,this_el)=>{
			me.next();
		}
	}).on({
		el:".Lplayer_contorl_prev",
		callback:(e,this_el)=>{
			me.prev();
		}
	}).on({
		el:".Lplayer_contorl_mode",
		callback:(e,this_el)=>{
			me.modeIndex ++;
			let mod = me.modeArr;
			me.modeIndex = (me.modeIndex > mod.length-1 ? 0 : me.modeIndex) || 0;
			me.modes(mod[me.modeIndex]);
		}
	}).on({
		el:".Lplayer_contorl_paused",
		callback:(e,this_el)=>{
			me.paused();		
		}
	}).on({
		el:".Lplayer_contorl_play",
		callback:(e,this_el)=>{
			me.play();
		}
	}).on({
		el:".Laolayer_contorl_lyric",
		callback:(e,this_el)=>{
			me.lyricContorl(me.dom["lplayerLyric"].className.indexOf("show") == -1 ? "show" : "hide");
		}
	}).on({
		el:".Lplayer_contorl_list",
		callback:(e,this_el)=>{
			me.listContorl(me.dom["lplayerList"].className.indexOf("show") == -1 ? "show" : "hide");
		}
	}).on({
		el:"li",
		fel:".Lplayer_list",
		callback:(e,this_el)=>{
			let index = this_el.getAttribute("data-index");
			me.musicIndex = index;
			loadMuisc.call(me);
		}
	})
}

function playEffect(){
	util.getEl(".Lplayer_play_btn")[0].innerHTML = svg("paused");
	util.getEl(".Lplayer_play_btn")[0].className = "Lplayer_play_btn Lplayer_contorl_paused";
}

function pausedEffect(){
	util.getEl(".Lplayer_play_btn")[0].innerHTML = svg("play");
	util.getEl(".Lplayer_play_btn")[0].className = "Lplayer_play_btn Lplayer_contorl_play";
}

function modeEffect(mod){
	this.dom["lplayerMode"].innerHTML = svg(mod);
}

function contorlRatio(num){ //控制比例
	num = num < 0 ? 0 : num ;
	num = num > 1 ? 1 : num ;
	return num
}

function canplayFun(){//页面载入 如果autoplay true 就播放 否则不播放
	var me = this;
	if(onePageLoading){
		onePageLoading = false;
		if(this.autoplay && !this.isMobile){
			this.play();
		}
	}else{
		this.play();
	}
}

function updateBar(type,num,attr){
	num = contorlRatio(num);
 	this.bar[type].style[attr] = num * 100 + "%";//设置精度条width *100 化成百分数
}

function endedFun(){
	if(this.mode == "loop"){
		this.next();
	}else if(this.mode == "random"){
		this.random();
	}
}

function jianhuaApi(musicArr){
	let arr = [];
	musicArr.forEach((music,i)=>{
		arr.push({
			id:music["id"],
			title:music["name"] + " - " + music["ar"][0]["name"],
			musicImg:music["al"]["picUrl"],
			musicUrl:"",
			musicLrc:""
		})
	})
	return arr
}


function loadMuisc(){
	let me = this;
	if(me.musictype == "cloud"){
		if(util.objIsEmpty(this.music)){
			util.http({
				url:musicApi + '/playlist/detail?id=' + me.cloudSongSheetId,
				method:"GET",
				contentType:false,
				callback:function(data,err){
					err ? console.error("加载歌单失败")
					    : (
					    	me.music = jianhuaApi(JSON.parse(data).playlist.tracks),
					    	setMusicFun.call(me)
					    	)
				}
			})
		}else{
			setMusicFun.call(me);
		}
	}else{
		setMusicFun.call(me);
	}
}


function setMusicFun(){
	this.dom["lplayerList"].innerHTML || addList.call(this);
	listSetCurrent.call(this);
	setImg.call(this,this.music[this.musicIndex]["musicImg"]);
	setTitle.call(this,this.music[this.musicIndex]["title"]);
	this.music[this.musicIndex]["musicUrl"] ? setAudio.call(this,this.music[this.musicIndex]["musicUrl"]) : getMusicUrl.call(this,setAudio);
	this.music[this.musicIndex]["musicLrc"] ? addLyric.call(this,this.music[this.musicIndex]["musicLrc"]) : loadLyric.call(this) ;
}

function listSetCurrent(){
	util.getEl(".current")[0] && util.getEl(".current")[0].classList.remove("current");
	let currentMusic = document.querySelector("li[data-index='" + this.musicIndex + "']");
	currentMusic.classList.add("current");
	setCurrentMusicScroll.call(this,currentMusic);
	return currentMusic
}

function setCurrentMusicScroll(currentMusic){
    let current = currentMusic;
    current.parentNode.parentNode.scrollTop = current.offsetTop-current.offsetHeight*2;
}

function addList(){
	let listHTML = "<ul>"
	let me = this;
	
	this.music.forEach((music,i)=>{
		listHTML += `<li class="Lplayer_list_music" data-index="${i}">${music["title"]}</li>`
	})
	
	listHTML += "</ul>"
	me.dom["lplayerList"].innerHTML = listHTML;
}

function getMusicUrl(callback){
	let me = this;
	
	util.http({
		url:musicApi + '/music/url?id='+ me.music[this.musicIndex]["id"],
		method:"GET",
		contentType:false,
		callback:function(data,err){
			err ? console.error("加载歌曲失败")
				: (
					callback.call(me,JSON.parse(data).data[0].url)
				)
		}
	})
}

function createLyric(){
	var me = this;
	util.createElement("div", el =>{
		el.className = "Lplayer_lyric";
		document.body.appendChild(el);
	})
}

function loadLyric(){
	getLyric.call(this);
}

function getLyric(){
	var me =this;
	if(me.music[me.musicIndex]["musicLrc"]){
		addLyric.call(me);
		return
	}
	util.http({
		url:musicApi + "/lyric?id=" + me.music[this.musicIndex]["id"],
		method:"GET",
		contentType:false,
		callback:function(data,err){
			err ? console.error("加载歌词失败")
				: (
					me.music[me.musicIndex]["musicLrc"] = (JSON.parse(data).lrc ? JSON.parse(data).lrc.lyric : "[00:00.00]该歌曲没有歌词哟"),
					addLyric.call(me)
				)
		}
	})
}

function parselyric(lyrics){
	const lyricArr = lyrics.split("\n");
	let lrc = [];
	lyricArr.forEach((lrcValue,i)=>{
		const lrcTimes = lrcValue.match(/\[(\d{2}):(\d{2}).(\d{2,3})\]/g);
		const lrcText = lrcValue.replace(/\[(\d{2}):(\d{2}).(\d{2,3})\]/g,"").replace(/^\s+|\s+$/g,"");
		if(lrcTimes != null){
			lrcTimes.forEach((time,i)=>{
				const tempTime = /\[(\d{2}):(\d{2}).(\d{2,3})\]/.exec(time);
				const lrcTime = tempTime[1] * 60 + parseInt(tempTime[2]) + parseInt(tempTime[3]) / (tempTime[3].length === 2 ? 100 : 1000);
				lrcText ? lrc.push({time:lrcTime,lrc:lrcText}) : lrc.push({time:lrcTime,lrc:"。。。。。。。。。"});
			})
		}
	})
	lrc.sort((a,b) => a["time"] - b["time"]);
	return lrc
}

function UpdateProgredColor(){ //播放模式 single 播放完成 歌词颜色复位 当前歌词复位
	for (var i = 0; i < util.getEl(".gradient").length; i++) {
		util.getEl(".gradient")[i].style.transition = "width 0s";
		util.getEl(".gradient")[i].style.webkitTransition = "width 0s";
		util.getEl(".gradient")[i].style.width = "0";
	}
	for (var i = 0; i < util.getEl(".Lplayer_lyric_curtime").length; i++) {
		util.getEl(".Lplayer_lyric_curtime")[i].classList.remove("Lplayer_lyric_curtime");
	}
}

let lyricType = {
	defau:function(){
		let thisLrcElTop = this.thisLrcEl.offsetTop;
		this.thisLrcElParent.style.transform = "translateY(-"+ thisLrcElTop +"px)";
		util.getEl(".Lplayer_lyric_curtime")[0] && util.getEl(".Lplayer_lyric_curtime")[0] != this.thisLrcEl && util.getEl(".Lplayer_lyric_curtime")[0].classList.remove("Lplayer_lyric_curtime");
		this.thisLrcEl.classList.add("Lplayer_lyric_curtime");
	},
	gradient:function(curTime,prevTime,nextTime){
		var me = this;
		let time = nextTime ? (nextTime - curTime) : 10;
		if(time < 3){
			for (var i = 0; i < util.getEl(".Lplayer_lyric_curtime").length; i++) {
				if(util.getEl(".Lplayer_lyric_curtime")[i] == me.thisLrcEl){
					continue
				}
				util.getEl(".Lplayer_lyric_curtime")[i].classList.remove("Lplayer_lyric_curtime");
			}
			me.thisLrcEl.nextElementSibling.className.indexOf("Lplayer_lyric_curtime") == -1 && me.thisLrcEl.nextElementSibling.classList.add("Lplayer_lyric_curtime");
		}
		me.thisLrcEl.classList.add("Lplayer_lyric_curtime");
		me.thisLrcEl.getElementsByClassName("gradient")[0].style.transition = "width " + time + "s" + " ease";
		me.thisLrcEl.getElementsByClassName("gradient")[0].style.webkitTransition = "width " + time + "s" + " ease";
		me.thisLrcEl.getElementsByClassName("gradient")[0].style.width = "100%";
	}
}

let lyricTemplate = {
	defau:function(time,lrc){

		return `<li class="Lplayer_lyric_time t${time}">${lrc}</li>`;

	},
	gradient:function(time,lrc,i){

		return `
			<li class="Lplayer_lyric_time ${i % 2 ? "Lplayer_lyric_right" : "Lplayer_lyric_left"} t${time}">
				<span class="defau">${lrc}</span>
				<span class="gradient">${lrc}</span>
			</li>
		`;

	}
}

function addLyric(){
	let me = this;
	let lyricHTML = "<ul class='Lplayer_lyric_times' style='transition:all 0.3 ease;-webkit-transition: all 0.3s ease;'>";
	this.music[this.musicIndex]["musicLrc"] && parselyric(this.music[this.musicIndex]["musicLrc"]).forEach((v,i)=>{
		lyricHTML += me.lyricMode == "gradient" ? lyricTemplate.gradient(v.time,v.lrc,i) : lyricTemplate.defau(v.time,v.lrc);
	})
	lyricHTML += "</ul>";
	this.dom["lplayerLyric"].innerHTML = lyricHTML;
}

function setLyricScroll(){
	let me = this;
	let curTime = this.dom["lplayerAudio"].currentTime.toFixed(2);
	let addclass = true; //限制 添加class名 执行次数  
	this.music[this.musicIndex]["musicLrc"] && parselyric(this.music[this.musicIndex]["musicLrc"]).forEach((v,i,arr)=>{
		//这里执行循环  if里面的语句应该只执行一次 但是莫名执行了多次 (curtime=32 >= thisTime=32 这里执行一次) 循环下一次 thisTime 就等于 41   curTime=32 不大于 thisTime=41啊  
		//大神帮忙分析下 先强制限制下
		if(curTime >= (v.time - 1) && (arr[i+1] ? curTime <= arr[i+1].time : true)){
			if(addclass){
				addclass = false;
				let thisLrcEl = util.getEl(".t" + v.time)[0];
				let timesEl = thisLrcEl.parentNode.getElementsByTagName("li");
				let thisLrcElParent = thisLrcEl.parentNode;
				let dom = {
					thisLrcEl,
					timesEl,
					thisLrcElParent
				}
				me.lyricMode == "gradient" 
				? lyricType.gradient.call(dom,curTime,v.time,arr[i+1] ? arr[i+1].time : 0)//后一行 false 就证明这首歌没歌词 
				: lyricType.defau.call(dom);
			}
		}
	})
}

function setAudio(src){
	let me = this;
	me.dom["lplayerAudio"].src = src;
}

function setTotalTime(t){
	let time = t || util.timeFormat(this.dom["lplayerAudio"].duration);
	this.dom["lplayerTotalTime"].innerText = time;
}

function setCurrentTime(t){
	let time = (t && util.timeFormat(t)) || util.timeFormat(this.dom["lplayerAudio"].currentTime);
	t ? (
			this.dom["lplayerAudio"].currentTime = t,
			this.dom["lplayerCurrentTime"].innerText = time
		)
	  : this.dom["lplayerCurrentTime"].innerText = time;
}

function setImg(imgsrc){
	this.dom["lplayerImg"].src = imgsrc;
}

function setTitle(title){
	this.dom["lplayerTitle"].innerHTML = title;
	console.log("正在播放 ："+title)
}

function createAudio(){
	let me = this;
	util.createElement("audio",el =>{
		el.className = "Lplayer_audio";
		el.setAttribute("data-mode",me.mode);
		me.dom["lplayerAudio"] = el;
		el = null;
	})
}

class Lplayer{
	constructor(options){
		const defaultOption = {
			element:util.getEl("#Lplayer"),
			mode:"loop", //loop single random
			lyricMode:"defau", //defau：默认 gradient：渐变
			autoplay:true, //自动播放
			listshow:false, //默认不显示歌曲列表
			lyricshow:false, //默认不显示歌词
			musictype:"cloud", // custom:自定义 cloud ：网易云
			cloudSongSheetId:3778678, //网易云 歌单id
			music:[] // 自定义选项是 配置的歌曲
		}
		this.el = options.element || defaultOption.element;
		this.name = "Lplayer";
		this.version = 1.1;
		this.mode = options.mode || defaultOption.mode ;
		this.lyricMode = options.lyricMode || defaultOption.lyricMode;
		this.modeArr = ["single","loop","random"];
		this.autoplay = typeof options.autoplay == "undefined" ? defaultOption.autoplay : options.autoplay;
		this.listshow = options.listshow || defaultOption.listshow;
		this.lyricshow = options.lyricshow || defaultOption.lyricshow;
		this.musictype = options.musictype || defaultOption.musictype;
		this.cloudSongSheetId = options.cloudSongSheetId || defaultOption.cloudSongSheetId;
		this.volume = 0.5;
		this.music = options.music ? (Object.prototype.toString.call(options.music) == "[object Array]" ? options.music : [options.music]) : defaultOption.music;
		this.musicIndex = 0;
		this.modeIndex = 0;
		this.isMobile = /mobile/i.test(win.navigator.userAgent);
		this.init();
		console.log("%c Lplayer %c v"+this.version+" ","line-height:40px;background-color:#333;padding:5px 0;color:#fff;","background-color:#daa340;padding:5px 0;")
	}

	setVolume(num){
		num = contorlRatio(num);
		this.dom["lplayerAudio"].volume = num;
		updateBar.call(this,"volumeProgred",num,"width");
	}

	modes(mod){
		this.modeIndex =  this.modeArr.indexOf(mod);
		this.mode = mod;
		modeEffect.call(this,mod);
		this.dom["lplayerAudio"].setAttribute("data-mode",mod);
		if(mod == "single"){
			this.dom["lplayerAudio"].loop = true;
		}
		else{
			this.dom["lplayerAudio"].loop = false;
		}
	}

	random(){
		this.musicIndex =  parseInt(Math.random() * this.music.length-1);
		loadMuisc.call(this);
	}

	lyricContorl(type){
		this.dom["lplayerLyric"].className = "Lplayer_lyric " + type;
	}

	listContorl(type){
		this.dom["lplayerList"].className = "Lplayer_list " + type;
	}

	play(){ //播放
		if(this.dom["lplayerAudio"].paused){
			playEffect();
			this.lyricshow && this.lyricContorl("show");
			this.dom["lplayerAudio"].play();
		}
	}

	paused(){ //暂停
		if(!this.dom["lplayerAudio"].paused){
			pausedEffect();
			this.lyricshow && this.lyricContorl("hide");
			this.dom["lplayerAudio"].pause();
		}
	}

	prev(){ //上一曲
		if(this.mode == "random"){
			this.random();
			return
		}
		this.musicIndex -- ;
		this.musicIndex = this.musicIndex < 0 ? this.music.length-1 : this.musicIndex;
		loadMuisc.call(this);
	}

	next(){ //下一曲 兼 循环播放
		if(this.mode == "random"){
			this.random();
			return
		}
		this.musicIndex ++ ;
		this.musicIndex = this.musicIndex > this.music.length-1 ? 0 : this.musicIndex;
		loadMuisc.call(this);
	}

	init(){ //初始化
		addHTML.call(this);
		addStyle.call(this);
		createLyric.call(this);
		this.bar = {
			playerThumb:util.getEl(".Lplayer_bar_c")[0],
			player:util.getEl(".Lplayer_bar")[0],
			playerLoaded:util.getEl(".Lplayer_bar_loaded")[0],
			playerProgred:util.getEl(".Lplayer_bar_progred")[0],
			volume:util.getEl(".Lplayer_volume_bar")[0],
			volumeThumb:util.getEl(".Lplayer_volume_c")[0],
			volumeProgred:util.getEl(".Lplayer_volume_progred")[0]
		}
		this.dom = {
			lplayer:util.getEl(".Lplayer")[0],
			lplayerImg:util.getEl(".Lplayer_img")[0],
			lplayerTitle:util.getEl(".Lplayer_title")[0],
			lplayerTime:util.getEl(".Lplayer_time")[0],
			lplayerCurrentTime:util.getEl(".Lplayer_current_time")[0],
			lplayerTotalTime:util.getEl(".Lplayer_total_time")[0],
			lplayerMode:util.getEl(".Lplayer_contorl_mode")[0],
			lplayerLyric:util.getEl(".Lplayer_lyric")[0],
			lplayerList:util.getEl(".Lplayer_list")[0]
		}
		createAudio.call(this);
		this.setVolume(this.volume);
		this.modes(this.mode);
		addEvent.call(this);
		loadMuisc.call(this,loadLyric);
		this.lyricContorl(this.lyricshow ? "show" : "hide");
		this.listContorl(this.listshow ? "show" : "hide");

	}

	destroy(){
		this.paused();
		this.el.innerHTML = "";
		this.el.classList.remove("Lplayer");
		document.body.removeChild(this.dom["lplayerLyric"]);
		for(let k in this){
			delete this[k]
		}
	}
}

window.Lplayer = Lplayer;


