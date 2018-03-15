class Danmaku {
    constructor (options) {
        this.options = options;
        this.container = this.options.container;
        this.danTunnel = {
            right: {},
            top: {},
            bottom: {}
        };
        this.danIndex = 0;
        this.dan = [];
        this.showing = true;
        this._opacity = this.options.opacity;
        this.events = this.options.events;
        this.unlimited = this.options.unlimited;
		this.danmu_list=new Array();
        this._measure('');
        this.load();
		this.shield_list=new Array;
		this.options.danmu_pool.danmaki_add_shield.addEventListener("click", this.add_shield.bind(this));
    }
    load () {
        let apiurl;
        apiurl = `${this.options.api.address}?m=mukio&c=index&a=init&playerID=${this.options.api.id}`;
        const endpoints = (this.options.api.addition || []).slice(0);
        endpoints.push(apiurl);
        this.events && this.events.trigger('danmaku_load_start', endpoints);

        this._readAllEndpoints(endpoints, (results) => {
            this.dan = [].concat.apply([], results).sort((a, b) => a.time - b.time);
            window.requestAnimationFrame(() => {
                this.frame();
            });
			if(this.options.api_callback) {
				this.danmu_list=this.dan;
				this.draw_danmaku_pool();
				document.querySelector("#sort-time").addEventListener("click",this.Time_sorting.bind(this));
				document.querySelector("#sort-crtime").addEventListener("click",this.crTime_sorting.bind(this));
				this.options.api_callback(this.dan);
			}
			
            this.options.callback();
			
            this.events && this.events.trigger('danmaku_load_end');
        });
    }
	
    reload (newAPI) {
        this.options.api = newAPI;
        this.dan = [];
        this.clear();
        this.load();
    }

    /**
    * Asynchronously read danmaku from all API endpoints
    */
    _readAllEndpoints (endpoints, callback) {
        const results = [];
        let readCount = 0;
        const cbk = (i) => (err, data) => {
            ++readCount;
            if (err) {
                if (err.response) {
                    this.options.error(err.response.msg);
                }
                else {
                    this.options.error('Request was unsuccessful: ' + err.status);
                }
                results[i] = [];
            }
            else {
                const typeMap = ['right', 'right', 'top', 'bottom'];
                if (data) {
                    results[i] = data.map((item) => ({
                        time: item[0],
                        type: typeMap[item[1]]||typeMap[1],
                        color: item[2],
                        author: item[3],
                        message: item[4],
						addtime:item[5],
                    }));
                }
                else {
                    results[i] = [];
                }
            }
            if (readCount === endpoints.length) {
                return callback(results);
            }
        };

        for (let i = 0; i < endpoints.length; ++i) {
            this.options.apiBackend.read(endpoints[i], cbk(i));
        }
    }
    send (dan, callback) {
		switch(dan.type){
			case "right":dan.type=1;break;
			case "top":dan.type=2;break;
			case "bottom":dan.type=3;break;
			default:dan.type=1;break;
		}
		var color=dan.color.replace("#","");
        const danmakuData = {
            message: dan.message,
            color: parseInt(color,16),
            stime: this.options.time(),
            addtime:Date.parse(new Date())/1000,
            token: this.options.api.token,
            cid: this.options.api.id,
            mode: dan.type,
			size: 25,
            user: this.options.api.user,
			datatype:"send",
        };
        this.options.apiBackend.send(this.options.api.address + '?m=mukio&c=index&a=post&playerID='+this.options.api.id, danmakuData, callback);
        const danmaku_item = {
            time: danmakuData.stime,
            type: dan.type,
            color: color,
            author: "smith",
            message: dan.message,
            addtime: danmakuData.addtime,
        }
        this.dan.splice(this.danIndex, 0, danmaku_item);
        this.danIndex++;
        if(this.options.api_callback) {
            this.danmu_list=this.dan;
			this.draw_danmaku_pool();
            this.options.api_callback(this.dan);
        }
        const danmaku = {
            message: this.htmlEncode(dan.message),
            color: "#"+color,
            type: danmakuData.type,
            border: `2px solid ${this.options.borderColor}`
        };
        this.draw(danmaku);

        this.events && this.events.trigger('danmaku_send', danmakuData);
    }

    frame () {
        if (this.dan.length && !this.paused && this.showing) {
            let item = this.dan[this.danIndex];
            const dan = [];
            while (item && this.options.time() > parseFloat(item.time)) {
                dan.push(item);
                item = this.dan[++this.danIndex];
            }
            this.draw(dan);
        }
        window.requestAnimationFrame(() => {
            this.frame();
        });
    }

    opacity (percentage) {
        if (percentage !== undefined) {
            const items = this.container.getElementsByClassName('dplayer-danmaku-item');
            for (let i = 0; i < items.length; i++) {
                items[i].style.opacity = percentage;
            }
            this._opacity = percentage;

            this.events && this.events.trigger('danmaku_opacity', this._opacity);
        }
        return this._opacity;
    }

    /**
     * Push a danmaku into DPlayer
     *
     * @param {Object Array} dan - {message, color, type}
     * message - danmaku content
     * color - danmaku color, default: `#fff`
     * type - danmaku type, `right` `top` `bottom`, default: `right`
     */
    draw (dan) {
        if (this.showing) {
            const itemHeight = this.options.height;
            const danWidth = this.container.offsetWidth;
            const danHeight = this.container.offsetHeight;
            const itemY = parseInt(danHeight / itemHeight);

            const danItemRight = (ele) => {
                const eleWidth = ele.offsetWidth || parseInt(ele.style.width);
                const eleRight = ele.getBoundingClientRect().right || this.container.getBoundingClientRect().right + eleWidth;
                return this.container.getBoundingClientRect().right - eleRight;
            };

            const danSpeed = (width) => (danWidth + width) / 5;

            const getTunnel = (ele, type, width) => {
                const tmp = danWidth / danSpeed(width);

                for (let i = 0; this.unlimited || i < itemY; i++) {
                    const item = this.danTunnel[type][i + ''];
                    if (item && item.length) {
                        if (type !== 'right') {
                            continue;
                        }
                        for (let j = 0; j < item.length; j++) {
                            const danRight = danItemRight(item[j]) - 10;
                            if (danRight <= danWidth - tmp * danSpeed(parseInt(item[j].style.width)) || danRight <= 0) {
                                break;
                            }
                            if (j === item.length - 1) {
                                this.danTunnel[type][i + ''].push(ele);
                                ele.addEventListener('animationend', () => {
                                    this.danTunnel[type][i + ''].splice(0, 1);
                                });
                                return i % itemY;
                            }
                        }
                    }
                    else {
                        this.danTunnel[type][i + ''] = [ele];
                        ele.addEventListener('animationend', () => {
                            this.danTunnel[type][i + ''].splice(0, 1);
                        });
                        return i % itemY;
                    }
                }
                return -1;
            };

            if (Object.prototype.toString.call(dan) !== '[object Array]') {
                dan = [dan];
            }

            const docFragment = document.createDocumentFragment();

            for (let i = 0; i < dan.length; i++) {
                if (!dan[i].type) {
                    dan[i].type = 'right';
                }
                if (!dan[i].color) {
                    dan[i].color = '#fff';
                }
                const item = document.createElement(`div`);
                item.classList.add(`dplayer-danmaku-item`);
                item.classList.add(`dplayer-danmaku-${dan[i].type}`);
                if (dan[i].border) {
                    item.innerHTML = `<span style="border:${dan[i].border}">${dan[i].message}</span>`;
                }
                else {
                    item.innerHTML = dan[i].message;
                }
                item.style.opacity = this._opacity;
                item.style.color = dan[i].color;
                item.addEventListener('animationend', () => {
                    this.container.removeChild(item);
                });

                const itemWidth = this._measure(dan[i].message);
                let tunnel;

                // adjust
                switch (dan[i].type) {
                case 'right':
                    tunnel = getTunnel(item, dan[i].type, itemWidth);
                    if (tunnel >= 0) {
                        item.style.width = itemWidth + 1 + 'px';
                        item.style.top = itemHeight * tunnel + 'px';
                        item.style.transform = `translateX(-${danWidth}px)`;
                    }
                    break;
                case 'top':
                    tunnel = getTunnel(item, dan[i].type);
                    if (tunnel >= 0) {
                        item.style.top = itemHeight * tunnel + 'px';
                    }
                    break;
                case 'bottom':
                    tunnel = getTunnel(item, dan[i].type);
                    if (tunnel >= 0) {
                        item.style.bottom = itemHeight * tunnel + 'px';
                    }
                    break;
                default:
                    console.error(`Can't handled danmaku type: ${dan[i].type}`);
                }

                if (tunnel >= 0) {
                    // move
                    item.classList.add(`dplayer-danmaku-move`);

                    // insert
                    docFragment.appendChild(item);
                }
            }

            this.container.appendChild(docFragment);

            return docFragment;
        }
    }

    play () {
        this.paused = false;
    }

    pause () {
        this.paused = true;
    }

    _measure (message) {
        if (!this.context) {
            const measureStyle = getComputedStyle(this.container.getElementsByClassName('dplayer-danmaku-item')[0], null);
            this.context = document.createElement('canvas').getContext('2d');
            this.context.font = measureStyle.getPropertyValue('font');
        }
        return this.context.measureText(message).width;
    }

    seek () {
        this.clear();
        for (let i = 0; i < this.dan.length; i++) {
            if (this.dan[i].time >= this.options.time()) {
                this.danIndex = i;
                break;
            }
            this.danIndex = this.dan.length;
        }
    }

    clear () {
        this.danTunnel = {
            right: {},
            top: {},
            bottom: {}
        };
        this.danIndex = 0;
        this.options.container.innerHTML = '';

        this.events && this.events.trigger('danmaku_clear');
    }

    htmlEncode (str) {
        return str.
            replace(/&/g, "&amp;").
            replace(/</g, "&lt;").
            replace(/>/g, "&gt;").
            replace(/"/g, "&quot;").
            replace(/'/g, "&#x27;").
            replace(/\//g, "&#x2f;");
    }

    resize () {
        const danWidth = this.container.offsetWidth;
        const items = this.container.getElementsByClassName('dplayer-danmaku-item');
        for (let i = 0; i < items.length; i++) {
            items[i].style.transform = `translateX(-${danWidth}px)`;
        }
    }

    hide () {
        this.showing = false;
        this.pause();
        this.clear();

        this.events && this.events.trigger('danmaku_hide');
    }

    show () {
        this.seek();
        this.showing = true;
        this.play();

        this.events && this.events.trigger('danmaku_show');
    }

    unlimit (boolean) {
        this.unlimited = boolean;
    }
/************************************************************************************************
				
				
************************************************************************************************/
	chg_time(date, mat) {
		Date.prototype.format = function (format) {
			var date = {
				"M+": this.getMonth() + 1,
				"d+": this.getDate(),
				"h+": this.getHours(),
				"m+": this.getMinutes(),
				"s+": this.getSeconds(),
				"q+": Math.floor((this.getMonth() + 3) / 3),
				"S+": this.getMilliseconds()
			};
			if (/(y+)/i.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			}
			for (var k in date) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
						date[k] : ("00" + date[k]).substr(("" + date[k]).length));
				}
			}
			return format;
		}
		var newdate = new Date(date * 1000);
		return newdate.format(mat);
	}
	draw_danmaku_pool() {
		var danmu_pool = document.querySelector(".danmu_pool ul.contents");
		danmu_pool.innerHTML = "";
		for (let abc=0;abc<this.danmu_list.length;abc++) {
			var dan_row = document.createElement("li");
			var dan_time = document.createElement("div");
			var dan_text = document.createElement("div");
			var dan_addtime = document.createElement("div");
			dan_row.setAttribute("title", this.danmu_list[abc].message);
			dan_time.innerText = this.chg_time(this.danmu_list[abc].time, "mm:ss");
			dan_text.innerText = this.danmu_list[abc].message;
			dan_addtime.innerText = this.chg_time(this.danmu_list[abc].addtime, 'MM-dd hh:mm');
			dan_row.appendChild(dan_time);
			dan_row.appendChild(dan_text);
			dan_row.appendChild(dan_addtime);
			danmu_pool.appendChild(dan_row);
		}
	}

	Time_sorting() {
		var type = event.target.getAttribute("data-sort");
		switch (type) {
			case "down":
				this.danmu_list.sort(function (a, b) {
					return b["time"] - a["time"];
				});
				this.draw_danmaku_pool(this.danmu_list);
				event.target.setAttribute("data-sort", "up");
				break;
			case "up":
				this.danmu_list.sort(function (a, b) {
					return a["time"] - b["time"];
				});
				this.draw_danmaku_pool(this.danmu_list);
				event.target.setAttribute("data-sort", "down");
				break;
			default:
				this.draw_danmaku_pool(this.danmu_list);
				break;
		}
	}

	crTime_sorting() {
		var type = event.target.getAttribute("data-sort");
		switch (type) {
			case "down":
				this.danmu_list.sort(function (a, b) {
					return b["addtime"] - a["addtime"];
				});
				this.draw_danmaku_pool(this.danmu_list);
				event.target.setAttribute("data-sort", "up");
				break;
			case "up":
				this.danmu_list.sort(function (a, b) {
					return a["addtime"] - b["addtime"];
				});
				this.draw_danmaku_pool(this.danmu_list);
				event.target.setAttribute("data-sort", "down");
				break;
			default:
				this.draw_danmaku_pool(this.danmu_list);
				break;
		}
	}
	
	add_shield() {
		var a = {
			content: document.querySelector("#shield-text").value,
			type: document.querySelector("#shield-type").value
		}
		this.shield_list.push(a);
		document.querySelector(".danmaki-shield-table table tbody").innerHTML = "";
		for (var i = 0; i < this.shield_list.length; i++) {
			var shield_dom = document.createElement("tr");
			shield_dom.innerHTML = `<td class="enabled">启用</td>
		<td class="type">` + this.shield_list[i].type + `</td>
		<td class="contents">` + this.shield_list[i].content + `</td>
		<td class="del">删除</td>`;			
			shield_dom.querySelector(".del").addEventListener("click",this.del_shield_item.bind(this));
			document.querySelector(".danmaki-shield-table table tbody").appendChild(shield_dom);
		}
		this.shield_start();
	}
	del_shield_item() {
		document.querySelector(".danmaki-shield-table table tbody td");
		event.srcElement.parentElement.parentElement.removeChild(event.srcElement.parentElement);
		var content = event.srcElement.parentElement.querySelector(".contents").innerText;
		for (var i = 0; i < this.shield_list.length; i++) {
			if (this.shield_list[i].content == content) {
				this.shield_list.splice(i, 1);
			}
		}
		this.shield_start();
	}
	shield_start() {
		var danmu_lists = [].concat(this.danmu_list);
//		console.log(danmu_lists);
		for (var i = 0; i < danmu_lists.length; i++) {
			for (var j = 0; j < this.shield_list.length; j++) {
				if (this.shield_list[j].type == "文本") {
					if (danmu_lists[i].message == this.shield_list[j].content) {
//						console.log(danmu_lists[i].message);
						danmu_lists.splice(i, 1);
					}
				} else if (this.shield_list[j].type == "正则") {
					var exp = new RegExp(this.shield_list[j].content);
					if (exp.test(danmu_lists[i].message)) {
//						console.log(danmu_lists[i].message);
						danmu_lists.splice(i, 1);
					}
				}
			}
		}
//		console.log(this.danmu_list);
//		console.log(danmu_lists);
		this.dan = danmu_lists;
	}

}

export default Danmaku;
