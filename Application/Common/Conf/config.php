<?php
return array(
    //数据库设置
    'DB_TYPE'               =>  'mysql',     // 数据库类型
    'DB_HOST'               =>  '120.55.98.138', // 服务器地址
    'DB_NAME'               =>  'heart_music',          // 数据库名
    'DB_USER'               =>  'zdhdqkz',      // 用户名
    'DB_PWD'                =>  'zdhdqkz',          // 密码
    'DB_PORT'               =>  '3306',        // 端口
    'DB_PREFIX'             =>  'tb_',    // 数据库表前缀

    'TMPL_FILE_DEPR'        =>  '.', //模板文件CONTROLLER_NAME与ACTION_NAME之间的分割符

    /* URL设置 */
    'URL_CASE_INSENSITIVE'  =>  true,   // 默认false 表示URL区分大小写 true则表示不区分大小写
    'URL_MODEL'             =>  2,       // URL访问模式,可选参数0、1、2、3,代表以下四种模式： 0 (普通模式); 1 (PATHINFO 模式); 2 (REWRITE  模式); 3 (兼容模式)  默认为PATHINFO 模式
    'URL_HTML_SUFFIX' => 'shtml',

    //默认可访问模块
    'MODULE_ALLOW_LIST'      =>  array('Login','Home'),
    'DEFAULT_MODULE' => 'Home', //默认模块



    //cookie session前缀
    'SESSION_PREFIX' => 'music_',
    'COOKIE_PREFIX' => 'music_',

    /* 设置默认变量过滤规则 */
    'DEFAULT_FILTER' => 'htmlspecialchars',

    /*在线调试*/
    'SHOW_PAGE_TRACE' => false,

    /* 网站安全配置 */
    'TOKEN' => array(
        'login_marked' => 'fm_member',
    ),

    /* 系统数据加密设置 */
    'DATA_AUTH_KEY' => 'dm~%ALZW:8D]@B(,"K>|V^}3ySt&f)Uc+._PNzgFa', //默认数据加密KEY

    'TMPL_PARSE_STRING' => array(
        '__IMG__' => __ROOT__ . "/Public/Images",
        '__CSS__' => __ROOT__ . '/Public/Css',
        '__JS__' => __ROOT__ . '/Public/Js',
        '__PLUGIN__' => __ROOT__ . '/Public/Plugins',
        '__FONTS__' => __ROOT__ . '/Public/Fonts',
        '__MEDIA__' => __ROOT__ . '/Public/Media',
    ),


);