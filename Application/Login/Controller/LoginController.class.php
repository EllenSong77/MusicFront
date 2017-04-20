<?php
namespace Login\Controller;

use Common\Controller\HomeBaseController;
use Think\Controller;
use Think\Verify;

class LoginController extends HomeBaseController
{
    private $_memberModel;

    public function __construct()
    {
        parent::__construct();
        $this->_memberModel = D('Member');
    }

    public function index()
    {
        $redirect = I('get.redirect', '');

        if (empty($redirect)) {
            $redirect = $_SERVER['HTTP_REFERER'];
        } else {
            $redirect = base64_decode($redirect);
        }
        session('login_http_referer', $redirect);

        if (is_user_login()) { //已经登录时直接跳到首页
            redirect(__ROOT__ . "/");
        } else {
            $this->display();
        }
    }

    public function dologin()
    {
        if (IS_POST) {
            $rules = array(
                //array(验证字段,验证规则,错误提示,验证条件,附加规则,验证时间)
                array('username', 'require', '邮箱/用户名不能为空！', 1),
                array('password', 'require', '密码不能为空！', 1),
            );

            if ($this->_memberModel->validate($rules)->create() === false) {
                $this->error($this->_memberModel->getError());
            }
            $this->_do_email_login(); // 用户名或者邮箱登录
        }
    }

    // 处理前台用户登录
    private function _do_email_login()
    {
        $username = I('post.username');
        $password = I('post.password');
        $where['v_user_name'] = $username;
        $result = $this->_memberModel->where($where)->find();
        if (!empty($result)) {
            if ($result["n_status"] == 0) {
                $this->_jsonReturn(0, "帐号被冻结！");
            } elseif ($result["n_status"] == 1) {
                //判断密码是否正确：
                if ($result['v_user_pwd'] == encryptPassword($password, $result['v_salt'])) {
                    session('user', $result);
                    //写入此次登录信息
                    $data = array(
                        'd_last_login_date' => time_format(),
                        'v_last_login_ip' => get_client_ip(0, true),
                    );
                    $this->_memberModel->where("n_id=" . $result["n_id"])->save($data);
                    $session_login_http_referer = session('login_http_referer');
                    $redirect = empty($session_login_http_referer) ? __ROOT__ . "/" : $session_login_http_referer;
                    session('login_http_referer', '');
                    //存取登录标识：
                    session(C('TOKEN.login_marked'), $result);
                    //登录成功
                    $this->_jsonReturn(1, "登录成功！", $redirect);
                } else {
                    $this->_jsonReturn(0, "用户名或密码错误！");
                }
            }
        } else {
            $this->_jsonReturn(0, "用户名或密码错误！");
        }
    }

    /*退出登录*/
    public function logout()
    {
        session(C('TOKEN.login_marked'), null);//只有前台用户退出
        $this->redirect('index');
    }

    /**
     * 生成验证码：
     */
    public function captcha()
    {
        $config = array(
            'imageW' => 400,
            'length' => 4,
            'fontSize' => 20,
        );
        $Verify = new Verify($config);
        $Verify->entry();
    }

    public function register()
    {
        if (is_user_login()) { //已经登录时直接跳到首页
            redirect(__ROOT__ . "/");
        } else {
            $this->display();
        }
    }


    public function doregister()
    {
        if (IS_POST) {
            // 前台用户注册提交
            $this->_do_email_register();
        }
    }

    // 前台用户邮件注册
    private function _do_email_register()
    {

        $rules = array(
            //array(验证字段,验证规则,错误提示,验证条件,附加规则,验证时间)
            array('username', 'require', '用户名不能为空！', 1),
            array('email', 'require', '邮箱不能为空！', 1),
            array('password', 'require', '密码不能为空！', 1),
            array('password', '6,20', "密码长度至少6位，最多20位！", 1, 'length', 3),
            array('repassword', 'require', '重复密码不能为空！', 1),
            array('repassword', 'password', '确认密码不正确', 0, 'confirm'),
            array('email', 'email', '邮箱格式不正确！', 1), // 验证email字段格式是否正确
        );

        if ($this->_memberModel->validate($rules)->create() === false) {
            $this->error($this->_memberModel->getError());
        }


        $password = I('post.password');
        $email = I('post.email');
        $username = I('post.username');
        $salt = salt();

        //用户名需过滤的字符的正则
        $stripChar = '?<*.>\'"';
        if (preg_match('/[' . $stripChar . ']/is', $username) == 1) {
            $this->error('用户名中包含' . $stripChar . '等非法字符！');
        }


        //查找用户名或者邮箱是否已存在
        $where['v_user_name'] = $username;
        $where['v_user_email'] = $email;
        $where['_logic'] = 'OR';
        $result = $this->_memberModel->where($where)->count();

        if ($result) {
            $this->error("用户名或者该邮箱已经存在！");
        } else {



            $data = array(
                'v_user_name' => $username,
                'v_user_email' => $email,
                'v_user_nick' => I('post.nickname',''),
                'v_signature' => I('post.description',''),
                'v_user_telephone' => I('post.phone',''),
                'n_user_age' => I('post.age',''),
                'd_birthday' => I('post.birth',''),
                'v_sex' => I('post.gender',''),
                'v_salt' => $salt,
                'v_user_pwd' => encryptPassword($password, $salt),
                'v_register_ip' => get_client_ip(0, true),
                'd_register_date' => time_format(),
                'd_last_login_date' => time_format(),
                'n_status' =>1,
            );

            $rst = $this->_memberModel->add($data);

            if ($rst) {
                //注册成功页面跳转
                $data['n_id'] = $rst;
                session(C('TOKEN.login_marked'), $data);
                $this->_jsonReturn(1, "注册成功！", U('Home/Index/index'));
            } else {
                $this->_jsonReturn(0, "注册失败！");
            }
        }
    }

}