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
    log('time: ' + time);
    var t = time.split('周[');
    var week = t[0].replace('，', ',');
    if (week.search('单') != -1) {
        flag = 1;
        week = week.replace('单', '');
    }
    if (week.search('双') != -1) {
        flag = 2;
        week = week.replace('双', '');
    }
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

var targetUrl = host + '/tkglAction.do?method=goListKbByXs&istsxx=no&xnxqh=' + xq;
//log('targetUrl = ' + targetUrl);
if (currentUrl != targetUrl) {
    log('load target url');
    loadUrl(targetUrl);
} else {
    log('load target url success');
    for (var rowIndex = 1; rowIndex < 7; rowIndex++) {
        if (rowIndex == 1) continue;
        for (var colIndex = 1; colIndex < 9; colIndex++) {
            if (colIndex == 1) continue;
            var courseContainer = document.querySelector('#kbtable > tbody > tr:nth-child(' + rowIndex + ') > td:nth-child(' + colIndex + ')');
            if (courseContainer == undefined) continue;
            if (courseContainer.children[0].textContent == '&nbsp;') continue;
            //console.log(rowIndex + ', ' + colIndex);
            var course = nodeTransform(courseContainer.children[1]);
            if (course == null) continue;
            var index = 0;
            var hasNext = true;
            while (hasNext) {
                var name = course[index].replace(' ','').replace(' ','');
                var teacherName = course[index + 2];
                var place = course[index + 4]
                    .replace('（', '')
                    .replace('）', '')
                    .replace('(', '')
                    .replace(')', '')
                    .replace('多媒体', '')
                    .replace('录播室', '');
                var time = formatTime(course[index + 3]);
                var week = time[0];
                var startJc = Number(time[1]);
                var endJc = Number(time[2]);
                var flag = time[3];
                var weekday = colIndex - 1;
                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
                if (course[index + 5] != undefined) {
                    index += 5;
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