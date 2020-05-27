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

function formatTime(time) {
    var flag = 0;
    var t = time.split('(周)[');
    if (t.length == 1) {
        var t = time.split('(单周)[');
        flag = 1;
    }
    if (t.length == 1) {
        var t = time.split('(双周)[');
        flag = 2;
    }
    var week = t[0].replace('，', ',');
    
    var jc;
    var startJc = 0;
    var endJc = 0;
    try {
        jc = t[1].replace('节]', '').split('-');
        startJc = jc[0];
        endJc = jc[jc.length - 1];
    } catch (error) {
        log(error);
    }
    return [week, startJc, endJc, flag];
}

var target_xq = xq;
var xnxq = document.getElementById('xnxq01id');
var options = xnxq.getElementsByTagName('option');
var selectedIndex = xnxq.selectedIndex;
if (options[selectedIndex].value != xq) {
    var targetIndex = 0;
    for (var i = 1; i < options.length; i++) {
        if (options[i].value == xq) {
            targetIndex = i;
            break;
        }
    }
    console.log(targetIndex);
    xnxq.selectedIndex = targetIndex;
    document.Form1.submit();
} else {
    for (var rowIndex = 0; rowIndex < 8; rowIndex++) {
        for (var colIndex = 0; colIndex < 8; colIndex++) {
            var courseContainer = document.querySelector('#kbtable > tbody > tr:nth-child(' + rowIndex + ') > td:nth-child(' + colIndex + ')');
            if (courseContainer == null || courseContainer.children[3] == undefined) continue;
            var course = nodeTransform(courseContainer.children[3]);
            if (course == null) continue;
            course = course.filter(e => (e != '<fontcolor="red">&nbsp;O</font>') && (e != '<fontcolor="red">&nbsp;P</font>') && (e != '---------------------'));
            //console.log(course);
            var index = 0;
            var hasNext = true;
            while (hasNext) {
                var i = index;
                if (course[i + 1].search('体育') != -1) {
                    i = index + 1;
                }
                var name = course[i + 1].replace('(', '').replace(')', '');
                var teacherName = course[i + 2];
                var place = course[i + 4];
                var time = formatTime(course[i + 3]);
                var week = time[0];
                var startJc = Number(time[1]);
                var endJc = Number(time[2]);
                var flag = time[3];
                var weekday = colIndex - 1;
                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
                if (course[i + 5] != undefined) {
                    index = 5 + i;
                } else {
                    hasNext = false;
                }
                console.log(name);
                console.log(teacherName);
                console.log(place);
                console.log(week);
                console.log(startJc + '-' + endJc);
                console.log(flag);
                console.log(weekday);
            }
        }
    }
    postData();
}