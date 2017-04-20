

var code ;

$(function(){
    createCode();
})

function createCode(){
    code = "";
    var codeLength = 4;
    var selectChar = new Array(1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
    for(var i=0;i<codeLength;i++) {
        var charIndex = Math.floor(Math.random()*60);
        code +=selectChar[charIndex];
    }
    if(code.length != codeLength){
        createCode();
    }
    showCheck(code);
}

function showCheck(a){
    var checkCode = document.getElementById("checkCode");
    if (checkCode)
    {
        checkCode.className = "code";
        checkCode.innerHTML = code;
    }
}

function validate () {
    var username = $("#username").val();
    var password = $("#password").val();

    if (username == '') {
        showInfo("用户名不能为空",2);
        return false;
    }

    if (password == '') {
        showInfo("密码不能为空",2);
        return false;
    }

    if (username != '' && password != ''){
        var inputCode = document.getElementById("J_codetext").value.toUpperCase();
        var codeToUp=code.toUpperCase();
        if(inputCode.length <=0) {
            document.getElementById("J_codetext").setAttribute("placeholder","输入验证码");
            alert("验证码错误！");
            createCode();
            return false;
        }
        else if(inputCode != codeToUp ){
            document.getElementById("J_codetext").value="";
            document.getElementById("J_codetext").setAttribute("placeholder","验证码错误");
            alert("验证码错误！");
            createCode();
            return false;
        }
        else if(username == "admin" && password == "admin"){
            //ajax提交表单：
            // ajaxSubmit("/Home/Login/index","POST",function(data){
            //     if (data.status == 1) {
            //         showInfo(data.info,1);
            //
            //     }else {
            //         showInfo(data.info,2);
            //         //刷新验证码
            //         $("#captcha").val("");
            //
            //         $("#captchaImg").attr("src", "/Home/Login/captcha/" + Math.random());
            //
            //     }
            //     if (data.url && data.url != '') {
            //         setTimeout(function () {
            //             top.window.location.href = data.url;
            //         }, 2000);
            //     }
            // });
            // e.preventDefault();

            alert("登录成功！");

            // window.open(document.getElementById("J_down").getAttribute("data-link"));
            // document.getElementById("J_codetext").value="";
            // createCode();
            window.location.href="player.html?backurl="+window.location.href;
            return true;
        }
        else {
            alert("填写信息有误！");
            return false;
        }
    }



}