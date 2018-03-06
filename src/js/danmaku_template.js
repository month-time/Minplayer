class Danmaku_Template {
	constructor(options) {
		this.container = options.container;
		this.options = options.options;
		this.index = options.index;
		this.tran = options.tran;
		this.icons = options.icons;
		this.init();
	}

	init() {
		this.container.innerHTML = this.tpl(this.options, this.index, this.tran, this.icons);
		document.querySelector("#tab-filter").addEventListener("click",this.change_tab);
		/************************************************************************************************
				
				
		************************************************************************************************/
        this.danmaki_add_shield = this.container.querySelector('.danmaki_add_shield');
        this.loop = this.container.querySelector('.danmaki-option .dplayer-setting-loop');
        this.loopToggle = this.container.querySelector('.danmaki-option .dplayer-setting-loop .dplayer-toggle-setting-input');
        this.showDanmaku = this.container.querySelector('.danmaki-option .dplayer-setting-showdan');
        this.showDanmakuToggle = this.container.querySelector('.danmaki-option .dplayer-showdan-setting-input');
        this.unlimitDanmaku = this.container.querySelector('.danmaki-option .dplayer-setting-danunlimit');
        this.unlimitDanmakuToggle = this.container.querySelector('.danmaki-option .dplayer-danunlimit-setting-input');
	}

	tpl(options, index, tran, icons) {
		return `
   	   		<div style="width: 100%;padding: 0.5rem 0; border-bottom: 1px solid #e8e8e8;">
   	   		咸鱼牌弹幕播放器 <br>弹幕池
   	   		</div>
   	   		<div  class="filter" id="tab-filter">
   	   			<div class="active" data-type="0">弹幕</div>
   	   			<div  data-type="1">屏蔽</div>
   	   			<div data-type="2">设置</div>
   	   		</div>
   	   		<div class="danmaki-list flipIn" style="display: block;">
    	   		<ul class="title" style="margin: 5px 0;margin-right:8px;">
    				<li>
    					<div data-sort="down" id="sort-time">时间</div>
    					<div>弹幕内容</div>
						<div data-sort="down" id="sort-crtime">发送时间</div>
    				</li>
    			</ul>
    			<div class='scroll scroll--simple'>
   		    	<ul class="contents">
    				<li class="contents;">	</li>
    			</ul>
    			<div style="height: 3rem;width: 100%;"></div>
  				</div>
  			</div>
  			<div class="danmaki-shield flipIn" style="display: none;">
  				<div class="danmaki-shield-textbox">
  					<select id="shield-type">
  						<option value="文本">按内容屏蔽</option>
  						<option value="正则">正则匹配</option>
  					</select>
  					<input type="text" class="shield-text" id="shield-text" placeholder="请输入关键词" value="">
  				</div>
  				<div class="danmaki-shield-butbox">
  				<p>屏蔽列表</p>
  				<input class="danmaki_add_shield" type="button" value="添加">
  				</div>
				<div class="danmaki-shield-table">
				<table>
					<thead>	
						<tr>
						<th>状态</th>
						<th>类别</th>
						<th class="contents">内容</th>
						<th>操作</th>
						</tr>
					</thead>
					<tbody>	

					</tbody>
				</table>
				</div>
  			</div>
  			<div class="danmaki-option flipIn" style="display: none;">


<div class="dplayer-setting-box dplayer-setting-box-open">
                        <div class="dplayer-setting-origin-panel">
                            <div class="dplayer-setting-item dplayer-setting-speed">
                                <span class="dplayer-label">速度</span>
  								<select id="shield-type">
                                <option >0.5</option>
                                <option >0.75</option>
                                <option selected>正常</option>
                                <option >1.25</option>
                                <option >1.5</option>
                                <option >2</option>
  								</select>
                            </div>
                            <div class="dplayer-setting-item dplayer-setting-danmaku">
                                <span class="dplayer-label">弹幕透明度</span>
                                <div class="dplayer-danmaku-bar-wrap">
                                    <div class="dplayer-danmaku-bar">
                                        <div class="dplayer-danmaku-bar-inner" style="width: 52.3077%;">
                                            <span class="dplayer-thumb"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dplayer-setting-item-line dplayer-setting-loop">
                                <span class="dplayer-label">洗脑循环</span>
                                <div class="dplayer-toggle">
                                    <input class="dplayer-toggle-setting-input" type="checkbox" name="dplayer-toggle">
                                    <label for="dplayer-toggle"></label>
                                </div>
                            </div>
                            <div class="dplayer-setting-item-line dplayer-setting-showdan">
                                <span class="dplayer-label">显示弹幕</span>
                                <div class="dplayer-toggle">
                                    <input class="dplayer-showdan-setting-input" type="checkbox" name="dplayer-toggle-dan">
                                    <label for="dplayer-toggle-dan"></label>
                                </div>
                            </div>
                            <div class="dplayer-setting-item-line dplayer-setting-danunlimit">
                                <span class="dplayer-label">海量弹幕</span>
                                <div class="dplayer-toggle">
                                    <input class="dplayer-danunlimit-setting-input" type="checkbox" name="dplayer-toggle-danunlimit">
                                    <label for="dplayer-toggle-danunlimit"></label>
                                </div>
                            </div>
                        </div>
                    </div>
  			</div>
   	<div style="position: absolute;bottom: 0;background: #fff;font-size:12px;padding: 10px 0;width: 100%;border-top: 1px solid  #e8e8e8;color: #d8d8d8;">查看历史弹幕</div>
	<div style="display:none;">${icons.get('comment')}</div>
`;
	}
	change_tab() {
		var qte = event.srcElement.getAttribute("data-type");
		switch (qte) {
			case "0":
				document.querySelector(".danmaki-shield").style.display = "none";
				document.querySelector(".danmaki-option").style.display = "none";
				document.querySelector(".danmaki-list").style.display = "block";
				break;
			case "1":
				document.querySelector(".danmaki-list").style.display = "none";
				document.querySelector(".danmaki-option").style.display = "none";
				document.querySelector(".danmaki-shield").style.display = "block";
				break;
			case "2":
				document.querySelector(".danmaki-list").style.display = "none";
				document.querySelector(".danmaki-shield").style.display = "none";
				document.querySelector(".danmaki-option").style.display = "block";
				break;
			default:
				document.querySelector(".danmaki-list").style.display = "block";
				document.querySelector(".danmaki-shield").style.display = "none";
				document.querySelector(".danmaki-option").style.display = "none";
				break;
		}
		for (let i=0;i<document.querySelector("#tab-filter").getElementsByTagName("div").length;i++) {
			document.querySelector("#tab-filter").getElementsByTagName("div")[i].className = "";
		}
		event.srcElement.className = "active";
	}
}

export default Danmaku_Template;
