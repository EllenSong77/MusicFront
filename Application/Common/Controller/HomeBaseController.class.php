<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/15
 * Time: 21:32
 */
namespace Common\Controller;
use Think\Controller;
class HomeBaseController extends Controller
{
    /**
    +----------------------------------------------------------
     * 构造json返回数组
    +----------------------------------------------------------
     * @param $status 返回状态
     * @param $msg 返回信息
     * @param $url 返回url
    +----------------------------------------------------------
     */
    protected function _jsonReturn($status,$msg,$url=''){
        $result = array();
        $result['status'] = $status;
        $result['info'] = $msg;
        if(!empty($url)){
            $result['url'] = $url;
        }
        $this->ajaxReturn($result);
    }

    /**
    +----------------------------------------------------------
     * 构造json返回数组
    +----------------------------------------------------------
     * @param $status 返回状态
     * @param $msg 返回信息
     * @param $data 返回数据
    +----------------------------------------------------------
     */
    protected function _jsonReturnData($status,$msg,$data=''){
        $result = array();
        $result['status'] = $status;
        $result['info'] = $msg;
        if(!empty($data)){
            $result['data'] = $data;
        }
        $this->ajaxReturn($result);
    }

    /**
     * 检查用户登录
     */
    protected function check_login()
    {
        $session_user = session(C('TOKEN.login_marked'));
        if (empty($session_user)) {
            $this->error('您还没有登录！', U('Login/Login/index'));

        }

    }
}