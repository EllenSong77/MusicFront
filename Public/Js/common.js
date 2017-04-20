/*项目公共JS函数库*/
/**
 * 弹框提示
 * @param info 提示信息
 * @param icon 提示图标
 */
function showInfo(info,icon){

    layer.alert(
        info,
        {icon: icon,
            title: '随心音乐FM',
            area: ['300px', ''],
            offset:[($(window).height()-150)/2],
            time:2000
        }
    );
}

/**
 * ajax提交数据
 * @param url
 * @param type
 * @param response
 */
function ajaxSubmit(url,type,response){
    $.ajax({
        url:url,
        data:$("form").serialize(),
        type:type,
        dataType:"json",
        success:response,
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            showInfo("ajax请求出错了",2);
        },
    });
}

/**
 * ajax删除数据、改变状态
 * @param url
 * @param type
 * @param data
 * @param response
 */
function ajaxDeal(url,type,data,response){
    $.ajax({
        url:url,
        data:data,
        type:type,
        dataType:"json",
        success:response,
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            showInfo("ajax请求出错了",2);
        },
    });
}

