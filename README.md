# Parse-Config-Repository
纯粹课表的解析配置仓库 

## 简介
纯粹课表使用一个 Json 格式的文件，以及至少一个 JavaScript 解析脚本来进行课程数据的解析&导入。 

以下是各文件的解释:
|文件名|作用|是否必须包含|
|:------:|:------:|:------:|
|config.json|登录配置、各页面的 url 配置等等|是|
|parse.js|当页面为课程表页面时调用，用于解析课程表数据|是|
|afterLogin.js|当页面为登录后跳转的页面时调用|否|
|login.js|当页面为登录页面时调用|否| 

## 解析流程
主要原理是模拟用户操作，在不同的页面执行对应的脚本，最后将得到的数据返回再保存即可。 

当用户选择从教务系统导入时，会根据用户的选择下载对应解析配置。  

纯粹课表会打开一个不可见的 WebView，并加载 config.json 中设置的 loginUrl，根据 config.json 中的 accountSelector、passwordSelector 等字段通过 selector 表达式找到对应的输入框元素，之后会将用户事先保存的教务系统账号、密码自动填入，最后点击登录按钮以完成登录。 

登录之后一般情况下会跳转到另一个页面，这个页面的 url 即是 afterLoginUrl，纯粹课表根据是否到达这个页面来判断登录是否成功，如果登录成功，会自动跳转到课程表页面，如果不想自动跳转可以在 config.json 中设置 autoJump 为 false。

如果课程表页面和登录后跳转的页面是同一个，则不会执行自动跳转，而是直接执行 parse.js 脚本。这种情况下需要在 parse.js 中编写使页面加载课程表界面的逻辑，具体可以参考已经写好的配置。 

在课程表页面会执行 parse.js 脚本，这个脚本中预置的方法和变量已经在模版中注释了，直接调用即可，无需声明。

当 parse.js 调用了 postData() 之后，所有通过 addCourse() 添加的课程数据将会被传递到纯粹课表中，到这里就完成了课程数据的导入。

## Config.json 字段解释
```json
{ 
    "提示": "带有 * 号的是必填项，这一行可以删掉，具体使用可以参照已经写好的配置", 
    "name": "配置名称",
    "host": "* 教务系统的 Host",
    "loginUrl": "* 登录教务系统的页面链接",
    "afterLoginUrl": "* 登录教务系统后跳转的页面链接",
    "courseTableUrl": "* 课程表的页面链接",
    "accountSelector": "* 登录页面账号输入框 [input 元素] 的 selector 表达式",
    "passwordSelector": "* 登录页面密码输入框 [input 元素] 的 selector 表达式",
    "loginBtnSelector": "* 登录页面登录按钮 [任意元素] 的 selector 表达式",
    "verifyCodeSelector": "登录页面验证码图片 [img 元素] 的 selector 表达式",
    "verifyCodeInputSelector": "登录页面验证码输入框 [input 元素] 的 selector 表达式",
    "webVpnLoginUrl": "登录 WebVpn 的页面链接",
    "afterWebVpnLoginUrl": "登录 WebVpn 后跳转的页面链接",
    "webVpnAccountSelector": "登录 WebVpn 页面账号输入框 [input 元素] 的 selector 表达式",
    "webVpnPasswordSelector": "登录 WebVpn 页面密码输入框 [input 元素] 的 selector 表达式",
    "webVpnLoginBtnSelector": "登录 WebVpn 页面登录按钮 [任意元素] 的 selector 表达式",
    "⬇waitVerifyCode 字段解释": "有时候验证码不是即时加载的，需要等待一会儿才能加载出来，可以通过设置 waitVerifyCode 字段来设置等待验证码加载的时间，注意单位为 ms，这是 Int 型字段",
    "waitVerifyCode": 0,
    "⬇setTimeOut 字段解释": "登录成功后进行解析课表的操作时间被限制在 5 秒之内，超过这个时间会显示解析失败，如果 5 秒之内无法完成解析，请设置 setTimeOut 为 false，这样就不会有时间上的限制了",
    "setTimeOut": true,
    "⬇autoJump 字段解释": "在 afterLogin 页面是否自动跳转至 courseTable 页面，默认为 true",
    "autoJump": true    
}
```

## 脚本预置参数
这些参数所有脚本都可以调用。
```JavaScript
// 当前页面的 url
var currentUrl = 'url';
//教务系统的 host
var host = '_host';
// 教务系统的账号
var account = 'account';
// 教务系统的密码
var password = 'password';
// 登录页面的 url
var loginUrl = 'loginUrl';
// 登录后跳转页面的 url
var afterLoginUrl = 'afterLoginUrl';
// 课程表页面的 url
var courseTableUrl = 'courseTableUrl';
// 学期，格式为 YYYY-YYYY-N，例：2019-2020-1 表示2019-2020 第一学期
var xq = 'xq';
// 这个方法会输出信息到导入界面的调试信息中
function log(msg) {
    Log.postMessage(msg);
}
// 这个方法用来加载指定页面
function loadUrl(url) {
    LoadUrl.postMessage(url);
}
```