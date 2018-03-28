/*
 * xhr.status ---> fail
 * response.code === 0 ---> success
 * response.code !== 0 ---> error
 * */

const SendXMLHttpRequest = (url, data, success, error, fail) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				try {
                    if(xhr.responseText=="ok"){
                        var response = {
                            code: 0,
                            danmaku: xhr.responseText
                        };
                    }else{
                       response = JSON.parse(xhr.responseText);
                    }
				} catch (err) {
                    response = {
                        code : 0,
                        danmaku: xhr.responseXML
                    };
				}
                if (response.code !== 0) {
                    return error(xhr, response);
                }
                return success(xhr, response);
            }

            fail(xhr);
        }
    };

    xhr.open(data !== null ? 'POST' : 'GET', url, true);
	if(data){
		if(data.datatype=="send"){
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			var data_s="";
			for(let abcd in data){data_s=data_s+abcd+"="+data[abcd]+"&";}
			data=data_s;
		}
	}
    xhr.send(data !== null ? data : null);
//    xhr.send(data !== null ? JSON.stringify(data) : null);
};

//	Hex format
function chg_color(col){
	var num=parseInt(col);
	num=num.toString(16);
    while (num.length < 6) {
		num="0"+num;
     }
	return "#"+num;
}

export default {
    send: (endpoint, danmakuData, callback) => {
        SendXMLHttpRequest(endpoint, danmakuData, (xhr, response) => {
            console.log('Post danmaku: ', response.danmaku);
            if (callback) {
                callback();
            }
        }, (xhr, response) => {
            alert(response.msg);
        }, (xhr) => {
            console.log('Request was unsuccessful: ' + xhr.status);
        });
    },
    read: (endpoint, callback) => {
        SendXMLHttpRequest(endpoint, null, (xhr, response) => {
			var d_list=response.danmaku.querySelectorAll("d");
			var danmaku_pool=new Array();
			for(let d=0;d<d_list.length;d++){
				let strs=d_list[d].getAttribute("p").split(",");
				strs[3]=chg_color(strs[3]);
				strs[4]=strs[4];
				strs.push(d_list[d].innerHTML);
                let apha={
                    time:strs[0],
                    type:strs[1],
                    font_size:strs[2],
                    color:strs[3],
                    addtime:strs[4],
                    text:strs[5],
                }
                let dan=[apha.time,apha.type,apha.color,"smith",apha.text,apha.addtime];
                danmaku_pool.push(dan);
			}
//			console.log(danmaku_pool);
            callback(null, danmaku_pool);
        }, (xhr, response) => {
//			console.log(response);
            callback({ status: xhr.status, response });
        }, (xhr) => {
            callback({ status: xhr.status, response: null });
        });
    }
};