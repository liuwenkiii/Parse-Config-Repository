function nodeTransform(course) {
    var newNodes = new Array();
    var nodes = course.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].innerHTML == undefined) {
            newNodes.push(nodes[i].textContent.replace('  ', ''));
        } else {
            var node = nodes[i].innerHTML;
            var nodeList = node.split('<br>');
            for (var j = 0; j < nodeList.length; j++) {
                if (nodeList[j] == '') continue;
                newNodes.push(nodeList[j].replace(/\s+/g, ''));
            }
        }
    }
    if (newNodes.length == 1) return null;
    return newNodes;
}

function getJc(r) {
    var result = [0, 0, 1, 3, 5, 7, 9, 11];
    return [result[r], result[r] + 1];
}

function getWeek(time) {
    var list = time.split(' ');
    var flag = 0;
    if (list.length > 2) {
        if (list[2] == '单周') {
            flag = 1;
        }
        if (list[2] == '双周') {
            flag = 2;
        }
    }
    var week = list[1].replace('周', '');

    return [week, '' + flag];
}

var target_xn = xq.split('-')[0];
var target_xq = xq.split('-')[2];
var xn_select = document.querySelector('#ctl00_MainContentPlaceHolder_School_Year');
var xq_select = document.querySelector('#ctl00_MainContentPlaceHolder_School_Term');

var isThisXnxq = true;  // 是当前学年学期

// 验证学期
var xq_options = xq_select.getElementsByTagName('option');
var xq_selectedIndex = xq_select.selectedIndex;

if (xq_options[xq_selectedIndex].value != target_xq) {
    for (var i = 1; i < xq_options.length; i++) {
        console.log('xq' + xq_options[i].value);
        if (xq_options[i].value == target_xq) {
            xq_options[i].selected = true;
            break;
        }
    }
    isThisXnxq = false;
}

// 验证学年
var xn_options = xn_select.getElementsByTagName('option');
var xn_selectedIndex = xn_select.selectedIndex;

if (xn_options[xn_selectedIndex].value != target_xn) {
    for (var i = 1; i < xn_options.length; i++) {
        console.log('xn' + xn_options[i].value);
        if (xn_options[i].value == target_xn) {
            xn_options[i].selected = true;
            break;
        }
    }
    isThisXnxq = false;
}

// 如果不是当前学年学期则重新选择且切换
if (!isThisXnxq) {
    document.querySelector('#ctl00_MainContentPlaceHolder_BtnSearch').click();
} else {
    var table = document.querySelector('#ctl00_MainContentPlaceHolder_GridScore > tbody');
    for (var r = 2; r < 8; r++) {
        for (var c = 2; c < 9; c++) {
            var courseContainer = table.querySelector('tr:nth-child(' + r + ') > td:nth-child(' + c + ')');
            var course = nodeTransform(courseContainer);
            if (course == null) continue;

            var index = 0;
            var hasNext = true;
            while (hasNext) {
                var name = course[index];
                var teacherName = course[index + 2];
                var place = course[index + 1].split(' ')[0].replace('  ', '');

                var time = getWeek(course[index + 1]);
                var week = time[0];
                var flag = Number(time[1]);

                var jc = getJc(r);
                var startJc = jc[0];
                var endJc = jc[1];
                

                var weekday = c - 1;

                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));

                if (course[index + 3] != undefined) {
                    index += 3;
                } else {
                    hasNext = false;
                }
                log(name);
                log(teacherName);
                log(place);
                log(week);
                log(startJc + '-' + endJc);
                log(flag);
                log(weekday);
            }
        }
    }
    postData();
}