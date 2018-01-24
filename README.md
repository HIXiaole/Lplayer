> 使用方法

```javascript
<div id="player_1"></div>
<script src="./lplayer.min.js"></script>
<script>
	new Lplayer({
		element:document.getElementById("player_1"), //dom对象
		mode:"loop", //loop single random  默认为loop
		lyricMode:"defau", //{defau:默认 gradient:渐变} 默认为defau
		autoplay:true, //自动播放  默认自动播放
		listshow:false, //默认不显示歌曲列表
		lyricshow:false, //默认不显示歌词
		musictype:"cloud", // {custom:自定义 cloud:网易云} 默认为cloud 但是由于之前用的网易接口失效了 所以这里暂时请改成 custom 自定义模式
		cloudSongSheetId:3778678, //网易云 歌单id
		music:[] // 自定义选项是 配置的歌曲 格式如下：可添加多首歌曲
		/*music:[{
			title:"一个人",
			musicImg:"http://p1.music.126.net/EsPx4aOtnDFewtIXZVH42g==/18625726976227920.jpg?param=200y200",
			musicLrc:"[00:00.00] \u4f5c\u66f2 : \u859b\u4e4b\u8c26\n[00:01.00] \u4f5c\u8bcd : \u859b\u4e4b\u8c26\n[00:03.60]\u522b\u72b9\u8c6b \u522b\u5076\u9047 \u522b\u76f8\u9047\n[00:11.87]\u522b\u4e00\u4e2a\u4eba\u53bb\u770b\u559c\u5267\n[00:19.85]\u522b\u7ee7\u7eed \u522b\u6bd4\u55bb \u522b\u6cbb\u6108\n[00:28.14]\u522b\u8ba9\u4eba\u770b\u51fa\u4f60\u6709\u591a\u59d4\u5c48\n[00:36.14]\u522b\u4e0b\u96e8 \u522b\u4e0b\u53bb \u522b\u591a\u4f59\n[00:44.47]\u522b\u4ee5\u4e3a\u4ed6\u8fd8\u4f1a\u4e3a\u4f60\u6dcb\u96e8\n[00:52.39]\u522b\u51e0\u53e5 \u5c31\u79bb\u53bb \u522b\u79bb\u53bb\n[01:00.50]\u522b\u8ba9\u4ed6\u542c\u89c1\u4f60\u6700\u540e\u4e00\u53e5\n[01:08.12]\n[01:08.76]\u522b\u5766\u767d \u522b\u8ba9\u6545\u4e8b\u7cbe\u5f69\n[01:16.73]\u522b\u4e0d\u5b89 \u53ea\u662f\u8fd8\u6709\u4e60\u60ef\n[01:24.64]\u522b\u559c\u6b22 \u6211\u957f\u671f\u7684\u52c7\u6562\n[01:32.96]\u522b\u63ed\u7a7f \u6211\u552f\u4e00\u7684\u9057\u61be\n[01:40.20]\n[01:41.19]\u522b\u5141\u8bb8 \u522b\u4e5f\u8bb8 \u522b\u53c2\u4e0e\n[01:49.62]\u522b\u81ea\u5df1\u548c\u81ea\u5df1\u8fc7\u4e0d\u53bb\n[01:57.48]\u522b\u4e00\u53e5 \u53c8\u4e00\u53e5 \u522b\u9020\u53e5\n[02:05.80]\u522b\u8ba9\u4eba\u7b11\u8bdd\u4f60\u7684\u906d\u9047\n[02:13.23]\n[02:13.82]\u522b\u5766\u767d \u522b\u8ba9\u6545\u4e8b\u7cbe\u5f69\n[02:21.83]\u522b\u4e0d\u5b89 \u53ea\u662f\u8fd8\u6709\u4e60\u60ef\n[02:29.95]\u522b\u559c\u6b22 \u6211\u957f\u671f\u7684\u52c7\u6562\n[02:38.06]\u522b\u63ed\u7a7f \u6211\u552f\u4e00\u7684\u9057\u61be\n[02:45.02]\n[02:46.27]\u522b\u5784\u65ad \u6211\u60f3\u4f60\u7684\u591c\u665a\n[02:54.41]\u522b\u523a\u7a7f \u6211\u5305\u88f9\u7684\u4e0d\u582a\n[03:02.54]\u522b\u4ea4\u4ee3 \u6211\u7231\u4f60\u7684\u75c5\u6001\n[03:10.64]\u591a\u8349\u7387 \u9664\u4e86\u4f60\u90fd\u4e0d\u7231\n[03:19.48]\n[03:21.28]\u522b\u72b9\u8c6b \u522b\u5076\u9047 \u522b\u76f8\u9047....\n[03:31.13]\n[03:32.27]\u5236\u4f5c\u4eba\uff1a\u90d1\u4f1f\n[03:32.86]\u7f16\u66f2\uff1a\u90d1\u4f1f\n[03:33.20]\u6df7\u97f3\uff1a\u90d1\u4f1f\n[03:33.52]\u5408\u97f3\uff1a\u859b\u4e4b\u8c26\n[03:33.83]\u5f26\u4e50\uff1a\u4e0a\u6d77piao\u97f3\u5f26\u4e50\u56e2\n[03:34.06]\u4eba\u58f0\u5f55\u5236\uff1a\u5434\u8eab\u5b9d\uff08soundhub studio\uff09\n[03:34.29]\u5f26\u4e50\u5f55\u5236\uff1a\u83ab\u5bb6\u4f1f\uff08\u4e0a\u6d77\u5e7f\u64ad\u5927\u53a6200studio\uff09\n[03:34.52]\u6bcd\u5e26\uff1aChris Gehringer\n",
			musicUrl:"https://m8.music.126.net/20171114102538/2708c96ca31c723be4243e13fb427668/ymusic/869c/4971/85cb/b8674a078d737fb6c01922125aa488e1.mp3"
		}]*/
	})
</script>
```
