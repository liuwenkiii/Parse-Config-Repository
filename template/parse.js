/* 
 * 当页面 url 为 courseTableUrl 时会执行该脚本。
 * 解析课程表的逻辑写在这里。
 * 该脚本是必须的，如果没有会报错。


 * 以下是预置的类和方法，已经提前声明好，可以在需要时调用


 // 课程的类，众所周知 JavaScript 里 class 就是一个语法糖
function Course(name, place, teacherName, week, weekday, startJc, endJc, flag) {

    // 课程名称 String
    this.name = name;

    // 上课地点 String
    this.place = place;

    // 任课老师 String
    this.teacherName = teacherName;

    // 上课周次 String
    // 开始周次与结束周次之间请使用 "-" 分隔，这代表一个周次区间
    // 也可以将所有周次一一罗列，用半角英文逗号 "," 分隔
    // 以上两种格式可以同时使用，举个栗子：
    // 1,3,5-12,16 这种格式是可以的
    // 1,2,3,4,5,10,12,17 这种格式也是可以的
    this.week = week;

    // 单双周的标志 int
    // 0 -> 默认
    // 1 -> 单周
    // 2 -> 双周
    this.flag = flag;

    // 上课的星期 int
    // 1 -> 星期一 ，以此类推
    this.weekday = weekday;

    // 开始节次 int，大于等于 1
    this.startJc = startJc;

    // 结束节次 int，大于等于开始节次
    this.endJc = endJc;
}

// 课程列表
var courses = new Array();

// 将课程添加至课程列表中
function addCourse(course) {
    courses.splice(-1, 0, course);
}

// 调用该方法提交解析完成的课程数据
function postData() {
    Parser.postMessage(JSON.stringify(courses));
}

// 跳转到指定页面
function loadUrl(url) {
    LoadUrl.postMessage(url);
}

// 该方法会输出到导入界面的调试信息上
function log(msg) {
    console.log(msg);
    Log.postMessage(msg);
}

 */