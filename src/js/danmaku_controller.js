class danmaku_controller {
    constructor(options) {
        this.options = options;
        this.danmu_pool = this.options.options.danmu_pool;
        this.player = this.danmu_pool.player;

        // this.load();
        this.danmu_list = this.options.dan;
        this.danmu_pool.sort_time.addEventListener("click", this.Time_sorting.bind(this));
        this.danmu_pool.sort_crtime.addEventListener("click", this.crTime_sorting.bind(this));
        this.danmu_pool.loop.addEventListener("click", this.control_loop.bind(this));
        this.danmu_pool.showDanmaku.addEventListener("click", this.control_showdanmaku.bind(this));
        this.danmu_pool.unlimitDanmaku.addEventListener("click", this.control_unlimitdanmaku.bind(this));

        this.danmu_pool.loopToggle.checked = this.player.options.loop;
        if (!this.player.user.get('danmaku')) {this.player.danmaku && this.player.danmaku.hide();}
        this.danmu_pool.showDanmakuToggle.checked = this.player.user.get('danmaku');
        this.danmu_pool.unlimitDanmakuToggle.checked = this.player.user.get('unlimited');

        // this.get_dan(this.options.dan);
    }

    get_dan() {
        // this.danmu_list=this.options.dan;
        this.format_dan()
        this.draw_danmaku_pool();
        // this.dan = this.observe(dan)
    }
    format_dan() {
        this.danmu_list = [];
        for (var i = 0; i < this.options.dan.length; i++) {
            var danmu_item = {};
            danmu_item = this.options.dan[i];
            // 
            danmu_item["message"] = danmu_item.text;
            if (!danmu_item["addtime"]) {
                danmu_item["addtime"] = new Date().getTime().toString().substr(0, new Date().getTime().toString().length - 3);
            }
            this.danmu_list.push(danmu_item);
        }
    }
    /*
     **
     ***********************************************************************
     **
     */
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
        if (new RegExp("[dMy]").test(mat)) {
            var newdate = new Date(date * 1000);
        } else {
            newdate = new Date((date * 1000) + (57600 * 1000));
        }
        return newdate.format(mat);
    }
    draw_danmaku_pool() {
        var danmu_pool = document.querySelector(".danmu_pool ul.contents");
        danmu_pool.innerHTML = "";
        for (let abc = 0; abc < this.danmu_list.length; abc++) {
            var dan_row = document.createElement("li");
            var dan_time = document.createElement("div");
            var dan_text = document.createElement("div");
            var dan_addtime = document.createElement("div");
            dan_row.setAttribute("title", this.danmu_list[abc].message);
            dan_time.innerText = this.chg_time(this.danmu_list[abc].time, "hh:mm:ss");
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
            shield_dom.querySelector(".del").addEventListener("click", this.del_shield_item.bind(this));
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
    /*
     * control loop 
     * 控制器 循环播放
     */
    control_loop() {
        this.player.template.loopToggle.checked = !this.player.template.loopToggle.checked;
        this.danmu_pool.loopToggle.checked = !this.danmu_pool.loopToggle.checked;

        if (this.player.template.loopToggle.checked) {
            this.loop = true;
        } else {
            this.loop = false;
        }
        this.hide();
    }
    /*
     * control show danmaku 
     * 控制器 显示弹幕
     */
    control_showdanmaku() {
        this.player.template.showDanmakuToggle.checked = !this.player.template.showDanmakuToggle.checked;
        this.danmu_pool.showDanmakuToggle.checked = !this.danmu_pool.showDanmakuToggle.checked;

        if (this.player.template.showDanmakuToggle.checked) {
            this.player.setting.showDanmaku = true;
            this.player.danmaku.show();
        } else {
            this.player.setting.showDanmaku = false;
            this.player.danmaku.hide();
        }
        this.player.user.set('danmaku', this.player.setting.showDanmaku ? 1 : 0);
        this.hide();
    }
    /*
     * control loop 
     * 控制器 解除弹幕数量限制
     */
    control_unlimitdanmaku() {
        this.player.template.unlimitDanmakuToggle.checked = !this.player.template.unlimitDanmakuToggle.checked;
        this.danmu_pool.unlimitDanmakuToggle.checked = !this.danmu_pool.unlimitDanmakuToggle.checked;

        if (this.player.template.unlimitDanmakuToggle.checked) {
            this.player.setting.unlimitDanmaku = true;
            this.player.danmaku.unlimit(true);
        } else {
            this.player.setting.unlimitDanmaku = false;
            this.player.danmaku.unlimit(false);
        }
        this.player.user.set('unlimited', this.unlimitDanmaku ? 1 : 0);
        this.hide();
    }

    hide() {
        this.player.template.settingBox.classList.remove('dplayer-setting-box-open');
        this.player.template.mask.classList.remove('dplayer-mask-show');
        setTimeout(() => {
            this.player.template.settingBox.classList.remove('dplayer-setting-box-narrow');
            this.player.template.settingBox.classList.remove('dplayer-setting-box-speed');
        }, 300);

        this.player.controller.disableAutoHide = false;
    }

    show() {
        this.player.template.settingBox.classList.add('dplayer-setting-box-open');
        this.player.template.mask.classList.add('dplayer-mask-show');
        this.player.controller.disableAutoHide = true;
    }
}







export default danmaku_controller;