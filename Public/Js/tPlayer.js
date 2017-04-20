/*
* 接口调用
* 获得推荐列表: method: getPlayList, type: 1, data: userName
* 获得猜你喜欢: methed: getPlayList, type: 2, data: userName
* 获得全部歌曲: methed: getPlayList, type: 3, data: userName
* 发送推荐列表点击事件: methed: playSong, type: 1, data: position
* 发送猜你喜欢点击事件: methed: playSong, type: 2, data: position
* 发送全部歌曲点击事件: methed: playSong, type: 3, data: position
*/

var all_song_list = [];
var history_list = [];
var music_list_arr = [];
var normal_rec_list;
var normal_rec_list_arr = [];
var relative_rec_list;
var relative_rec_list_arr = [];
var music_now;
var user_name;

$(function(){

    user_name = $(".user-center a")[0].text;
    var user_data = {userName:user_name}

    //所有音乐,用于检索查询
    $.ajax({
        type:"post",
        url:"http://192.168.31.129:8080/GetAllSongsServlet",
        dataType:"json",
        complete:function (data) {
            var jsonData = eval("(" + data.responseText + ")");
            all_song_list = jsonData.data;
            console.log("all_song_list");
            console.log(all_song_list);
            // console.log(normal_rec_list);
            if (jsonData.status = "6")
                $("#hhh").text("连接成功")
            else
                $("#hhh").innerHTML = "连接失败";
        }
    })

    //服务器推荐列表
    $.ajax({
        type:"post",
        url:"http://192.168.31.129:8080/RecommendServlet",
        dataType:"json",
        data:user_data,
        complete:function (data) {
            var jsonData = eval("(" + data.responseText + ")");
            normal_rec_list = jsonData.data;
            console.log("normal_rec_list");
            console.log(normal_rec_list);
            if (jsonData.status = "6")
                $("#hhh").text("连接成功")
            else
                $("#hhh").innerHTML = "连接失败";

            //生成推荐列表
            rec_section($("#Section1 ul"));

        }
    })

    //服务器猜你喜欢
    $.ajax({
        type:"post",
        url:"http://192.168.31.129:8080/MayLikeServlet",
        dataType:"json",
        data:user_data,
        complete:function (data) {
            var jsonData = eval("(" + data.responseText + ")");
            relative_rec_list = jsonData.data;
            console.log("relative_rec_list");
            console.log(relative_rec_list);
            if (jsonData.status = "6")
                $("#hhh").text("连接成功")
            else
                $("#hhh").innerHTML = "连接失败";

            //生成推荐列表
            guess_section($("#Section2 ul"));

        }
    })

    // 获取红心音乐列表
    $.ajax({
        type: "GET",
        url: "/Api/Json/Music.json",
        dataType: "json",
        success: function(data){
            all_song_list = data;
            history_list = data;
            for ( var  i in history_list ){
                heart_section(history_list[i],i);
            }
        }
    });
})

var styleChange = {pause: {}, play: {}, plsbutton: {}};

styleChange.play.change = function () {
    $('#play').addClass('hidden');
    $('#pause').removeClass('hidden');
};

styleChange.pause.change = function () {
    $('#pause').addClass('hidden');
    $('#play').removeClass('hidden');
};

styleChange.plsbutton.change = function () {
    $('#t_pls_show').addClass('selectpls');
    $('#t_pls_show').removeClass('noselectpls');
};

styleChange.plsbutton.recovery = function () {
    $('#t_pls_show').addClass('noselectpls');
    $('#t_pls_show').removeClass('selectpls');
};

function initAudio(elem) {
    var title = elem.attr('t_name');
    var cover = elem.attr('t_cover');
    var artist = elem.attr('t_artist');

    $('.title').text(' - ' + title);
    $('.artist').text(artist);
    $('#t_cover').html('<img src=' + cover + '>');
}

$(document).ready(function () {
    var dur, durM, val, mus, elem, prog;
    var Pl = 0;
    var history_list_count = 0;

    //点击播放历史列表歌曲
    $(document).on("click",".history_list > a",function(e){
        $('#t_title_info').animate({top: "-1.5em", opacity: "hide"}, 0);
        initAudio($(this).parent("li"));
        $('#error').text('');
        $('#t_title_info').animate({top: "0em", opacity: "show"}, 500);
        styleChange.play.change();
        if (mus && mus.length != 0) {
            mus[0].pause();
            mus[0].currentTime = 0;
            $('li').removeClass('active');
        }
        mus = $(this).next("audio");
        $(this).parent("li").addClass('active');
        mus[0].play();
    });

    //点击推荐歌曲，内容加入历史列表
    $(document).on("click",".recommendation_cover",function(e){
        history_list_count = history_list_count + 1;
        if($(this).closest("div").attr("id") == "Section1"){
            for ( var  i in normal_rec_list ){
                if( normal_rec_list[i].songCover == this.src){
                    var post_data = {
                        "method":"playSong",
                        "songList":"1",
                        "songPosition":i
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://192.168.31.129:8080/RecommendServlet",
                        dataType: "json",
                        data:post_data,
                        success: function(data){
                            // console.log("NOR_COMMIT: " + i);
                        }
                    });
                    music_now = normal_rec_list[i];
                    append_history_list(history_list_count,music_now);
                    var sim_btn = "#history_item_" + history_list_count + " > a";
                    $(sim_btn).trigger("click");
                    break;
                }
            }
        } else if($(this).closest("div").attr("id") == "Section2"){
            for ( var  i in relative_rec_list ){
                if( relative_rec_list[i].songCover == this.src){
                    var post_data = {
                        "method":"playSong",
                        "songList":"2",
                        "songPosition":i
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://192.168.31.129:8080/RecommendServlet",
                        dataType: "json",
                        data:post_data,
                        success: function(data){
                            // console.log("REL_COMMIT: " + i);
                        }
                    });
                    music_now = relative_rec_list[i];
                    append_history_list(history_list_count,music_now);
                    var sim_btn = "#history_item_" + history_list_count + " > a";
                    $(sim_btn).trigger("click");
                    break;
                }
            }
        }
    });
    $(document).on("click",".heart_list",function(e){
        history_list_count = history_list_count + 1;
        if($(this).closest("div").attr("id") == "Section3"){
            for ( var  i in history_list ){
                if( history_list[i].songName == $(this).attr("t_name")){
                    var post_data = {
                        "method":"playSong",
                        "songList":"3",
                        "songPosition":i
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://192.168.31.129:8080/RecommendServlet",
                        dataType: "json",
                        data:post_data,
                        success: function(data){
                            // console.log("HEART_COMMIT: " + i);
                        }
                    });
                    music_now = history_list[i];
                    append_history_list(history_list_count,music_now);
                    var sim_btn = "#history_item_" + history_list_count + " > a";
                    $(sim_btn).trigger("click");
                    break;
                }
            }
        }
    });


    //搜索歌曲，播放
    $(document).on("click",".search-box li",function(e){
        history_list_count = history_list_count + 1;
        for ( var  i in all_song_list ){

            if( all_song_list[i].songName == this.textContent.split(" - ")[0]){
                var music_now = all_song_list[i];
                append_history_list(history_list_count,music_now);
                var sim_btn = "#history_item_" + history_list_count + " > a";
                $(sim_btn).trigger("click");
                $(".search-box ul").children().remove();
                break;
            }
        }
    });

    $(".search-input").bind('keydown',function(e){
        if (e.keyCode == 13){
            var input = $(".search-input").val();
            var search_result = [];
            var $li = $("<li></li>");

            for(var i in all_song_list){
                if(all_song_list[i].songName == input){
                    search_result.push(all_song_list[i]);
                    var $li = $("<li id='search_result_item" + search_result.length + "'>"
                        + all_song_list[i].songName + " - " + all_song_list[i].songArtist + "</li>");
                    $(".search-box ul").append($li);
                }
                if(all_song_list[i].songArtist == input){
                    search_result.push(all_song_list[i]);
                    var $li = $("<li id='search_result_item" + search_result.length + "'>"
                        + all_song_list[i].songName + " - " + all_song_list[i].songArtist + "</li>");
                    $(".search-box ul").append($li);
                }
            }
            if(search_result.length == 0){
                var $li = $("<li>查无结果</li>");
                $(".search-box ul").append($li);
                setTimeout(function () {
                    $(".search-box ul").children().remove();
                }, 1000);

            }
            // console.log(search_result);
        }
});

    $('#t_progress').slider({
        value: 0,
        orientation: "horizontal",
        range: "min",
        animate: true,
        step: 1
    });

    $('audio').on("timeupdate", function () {
        // mus[0].volume = val/100;
        d = this.duration;
        c = this.currentTime;
        curM = Math.floor(c / 60);
        curS = Math.round(c - curM * 60);
        $('#current').text(curM + ':' + curS);
        $('#t_progress').slider({
            max: d,
            min: 0,
            value: c
        });
    });

    $('audio').on("playing", function () {
        dur = this.duration;
        durM = Math.floor(dur / 60) + ':' + Math.round((dur - Math.floor(dur / 60)) / 10);
        $('#duration').text(durM);
        $(this).parent("li").addClass('active');
        $('#t_title_info').animate({top: "0em", opacity: "show"}, 500);
    });

    $('audio').on("ended", function () {
        var next = $('li.active').next();
        mus = $(this).parent('li').next('li').first();
        mus = mus.children('audio');
        $('li').removeClass('active');
        mus.parent('li').addClass('active');
        if (mus[0]) {
            initAudio(next);
            mus[0].play();
        }
        else {
            $('#error').text('最后一首歌！');
            $('#t_cover').html('<img src="/Public/Images/logo.png">');
        }
    });

    //play button
    $('#play').click(function () {
        if (mus && mus.length != 0) {
            mus[0].play();
            styleChange.play.change();
            $('#error').text('');
        }
        else {
            $('#error').text('请先选择要播放的歌曲！');
        }

    });

    // pause button
    $('#pause').click(function () {

        if (mus && mus.length != 0) {
            mus[0].pause();
            styleChange.pause.change();
        }
        else {
            $('#error').text('请先选择要播放的歌曲！');
        }

    });

    //next button
    $('#next').click(function () {
        mus[0].pause();
        mus[0].currentTime = 0;
        mus = mus.parent('li').next('li').first();
        mus = mus.children('audio');
        var next = $('li.active').next();
        $('#t_title_info').animate({top: "-1.25em", opacity: "hide"}, 0);
        $('li').removeClass('active');
        next.addClass('active');
        if (mus[0]) {
            initAudio(next);
            mus[0].play();
        }
        else {
            $('#error').text('已经到底啦，请选择歌曲！');
            mus = null;
            $('#t_title_info').animate({top: "-1.5em", opacity: "hide"}, 0);
            initAudio($('.history_list:last-child a').parent("li"));
            $('#error').text('');
            styleChange.play.change();
            if (mus && mus.length != 0) {
                mus[0].pause();
                mus[0].currentTime = 0;
                $('li').removeClass('active');
            }
            mus = $('.history_list:last-child a').next("audio");
            $('.history_list:last-child a').parent("li").addClass('active');
            mus[0].play();
        }
        for ( var i in history_list ){
            if( history_list[i].name == $(mus[0]).parent('li').find($('a')).text().split(" - ")[0]){
                music_now = history_list[i];
                break;
            }
        }
    });

    //prev button
    $('#prev').click(function () {
        mus[0].pause();
        mus[0].currentTime = 0;
        mus = mus.parent('li').prev('li').last();
        mus = mus.children('audio');
        var prev = $('li.active').prev();
        $('li').removeClass('active');
        $('#t_title_info').animate({top: "-1.25em", opacity: "hide"}, 0);
        prev.addClass('active');
        if (mus[0]) {
            initAudio(prev);
            mus[0].play();
        }
        else {
            $('#error').text('已经到顶啦，请选择歌曲！');
            mus = null;
            $('#t_title_info').animate({top: "-1.5em", opacity: "hide"}, 0);
            initAudio($('.history_list:first-child a').parent("li"));
            $('#error').text('');
            styleChange.play.change();
            if (mus && mus.length != 0) {
                mus[0].pause();
                mus[0].currentTime = 0;
                $('li').removeClass('active');
            }
            mus = $('.history_list:first-child a').next("audio");
            $('.history_list:first-child a').parent("li").addClass('active');
            mus[0].play();
        }
        for ( var i in history_list ){
            if( history_list[i].name == $(mus[0]).parent('li').find($('a')).text().split(" - ")[0]){
                music_now = history_list[i];
                break;
            }
        }
    });

    //volume www.datouwang.com
    $('#rangeVal').slider({
        value: 60,
        orientation: "horizontal",
        range: "min",
        animate: true,
        step: 1
    });

    // volume text
    val = $('#rangeVal').slider("value");
    $('#val').text(val);

    var tooltip = $('#val');
    tooltip.hide();

    $('#rangeVal').slider({
        start: function (event, ui) {
            tooltip.fadeIn('fast');
        },
        stop: function (event, ui) {
            tooltip.fadeOut('fast');
        },
        slide: function (event, ui) {
            val = ui.value;
            tooltip.css('left', val - 30).text(ui.value);
            $('#val').text(val);

            if (mus && mus.length != 0) {
                mus[0].volume = val / 100;
            }
            else {
                $('#error').text('请先选择要播放的歌曲！');
            }
        }
    });

    // progress
    $('#t_progress').slider({
        start: function (event, ui) {
            mus[0].pause();
        },
        stop: function (event, ui) {
            prog = ui.value;
            mus[0].currentTime = prog;
            mus[0].play();
            styleChange.play.change();
        }
    });

    //playlist button
    $('#t_pls_show').click(function () {
        if (Pl == 0) {
            styleChange.plsbutton.change();
            Pl = 1;
        }
        else {
            styleChange.plsbutton.recovery();
            Pl = 0;
        }
        $('#playlist').slideToggle();
    });

    //红心功能
    $('#heart_button').click(function () {
        if(mus && mus.length != 0){
            alert("成功添加红心音乐"+ mus.parent().attr("t_name"));
            for ( var  i in all_song_list ){
                if(mus.parent().attr("t_name") == all_song_list[i].songName){
                    heart_section(all_song_list[i],0);
                    break;
                }
            }
        } else {
            alert("没有可添加的歌曲");
        }
    });

    //垃圾桶功能
    // $('#rubbish_button').click(function () {
    //     alert("垃圾桶功能");
    // });

    //生成历史列表
    function append_history_list(id,music_data){
        var id = "history_item_"+id;
        var $li = $("<li></li>");
        var $a = $("<a>");
        var $audio = $("<audio></audio>");
        var $source = $("<source>");
        $li.attr({"id":id, "class":"history_list", "t_name":music_data.songName,
            "t_artist":music_data.songArtist, "t_cover":music_data.songCover});
        $a.attr({"href":"#"}).text(music_data.songName + " - " + music_data.songArtist);
        $audio.attr({"preload":"none"});
        $source.attr({"src":music_data.songURL,"type":"audio/mp4"});
        $li.append($a);

        $audio.append($source);
        audio_callback($audio);
        $li.append($audio);
        // initAudio($li);
        $("#playlist ul").append($li);
    }
});

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?9d2f00b533f9cca146f784443e5bfc96";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

function onLogOff() {
    alert("您已成功退出！");
}

function random_list(n,min,max){
    var arr=[];
    for(i=0;i<n;i++){
        arr[i]=parseInt(Math.random()*(max-min)+min);
        for(j=0;j<i;j++){
            if(arr[i]==arr[j]){
                i=i-1;
                break;
            }
        }
    }
    return arr;
}

function rec_section($section){
    var count = 0;
    for(var i in normal_rec_list){
        if(count == 10){
            return;
        }
        var rec_music_data = normal_rec_list[i];
        var $li = $("<li></li>").attr({"class":"recommendation_item","id":"rec_item_"+i});
        var $img = $("<img>");
        var $div = $("<div>" +
            "<a class='song_name'>" + rec_music_data.songName + "</a>" +
            "<p class='song_singer'>" + rec_music_data.songArtist + "</p>" +
            "</div>");
        $img.addClass("recommendation_cover").attr("src",rec_music_data.songCover);
        $li.append($img);
        $li.append($div);
        $section.append($li);
        count++;
    }
}

//猜你喜欢
function guess_section($section){
    var count = 0;
    for(var i in relative_rec_list){
        if(count == 10){
            return;
        }
        var rec_music_data = relative_rec_list[i];
        var $li = $("<li></li>").attr({"class":"recommendation_item","id":"rec_item_"+i});
        var $img = $("<img>");
        var $div = $("<div>" +
            "<a class='song_name'>" + rec_music_data.songName + "</a>" +
            "<p class='song_singer'>" + rec_music_data.songArtist + "</p>" +
            "</div>");
        $img.addClass("recommendation_cover").attr("src",rec_music_data.songCover);
        $li.append($img);
        $li.append($div);
        $section.append($li);
        count++;
    }
}

//红心列表
function heart_section(song_info,id){
    var music_data = song_info;
    var id = "heart_list_"+id;
    var $li = $("<li></li>");
    var $a = $("<a>");
    var $source = $("<source>");
    $li.attr({"id":id, "class":"heart_list", "t_name":music_data.songName,
        "t_artist":music_data.songArtist, "t_cover":music_data.songCover});
    $a.attr({"href":"#"}).text(music_data.songName + " - " + music_data.songArtist);
    $li.append($a);
    $("#Section3 ul").append($li);
}

function audio_callback($audio){
    $audio.on("timeupdate", function () {
        // mus[0].volume = val/100;
        d = this.duration;
        c = this.currentTime;
        curM = Math.floor(c / 60);
        curS = Math.round(c - curM * 60);
        $('#current').text(curM + ':' + curS);
        $('#t_progress').slider({
            max: d,
            min: 0,
            value: c
        });
    });

    $audio.on("playing", function () {
        dur = this.duration;
        durM = Math.floor(dur / 60) + ':' + Math.round((dur - Math.floor(dur / 60)) / 10);
        $('#duration').text(durM);
        $(this).parent("li").addClass('active');
        $('#t_title_info').animate({top: "0em", opacity: "show"}, 500);
    });

    $audio.on("ended", function () {
        var next = $('li.active').next();
        mus = $(this).parent('li').next('li').first();
        mus = mus.children('audio');
        $('li').removeClass('active');
        mus.parent('li').addClass('active');
        if (mus[0]) {
            initAudio(next);
            mus[0].play();
        }
        else {
            $('#error').text('最后一首歌！');
            $('#t_cover').html('<img src="/Public/Images/logo.png">');
        }
    });
}