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

function formatTime(time, jc) {
    var flag = 0;
    var week = time.replace('周', '');
    if (week.search('单') != -1) {
        flag = 1;
        week.replace('单', '');
    }
    if (week.search('双') != -1) {
        flag = 2;
        week.replace('双', '');
    }
    var startJc = jc;
    var endJc = jc + 1;
    return [week, startJc, endJc, flag];
}

function parse() {
    var targetUrl = host + '/tkglAction.do?method=goListKbByXs&istsxx=no&xnxqh=' + xq;
    if (currentUrl != targetUrl) {
        loadUrl(targetUrl);
    } else {
        var jc = 1;
        for (var rowIndex = 1; rowIndex < 7; rowIndex++) {
            if (rowIndex == 1) continue;
            for (var colIndex = 1; colIndex < 9; colIndex++) {
                if (colIndex == 1) continue;
                var courseContainer = document.querySelector('#kbtable > tbody > tr:nth-child(' + rowIndex + ') > td:nth-child(' + colIndex + ')');
                if (courseContainer == undefined) continue;
                if (courseContainer.children[0].textContent == '&nbsp;') continue;
                var course = nodeTransform(courseContainer.children[1]);
                if (course == null) continue;
                var startRecord = new Array();
                for (var i = 0; i < course.length; i++) {
                    if (course[i] == '★') {
                        startRecord.push(i);
                    }
                    course[i] = course[i].replace('<fontcolor="red">★</font>', '★');
                }
                for (var i = 0; i < startRecord.length; i++) {
                    course[startRecord[i - 1]] = course[startRecord[i - 1]] + '★';
                    course.splice(startRecord[i], 1);
                }
                var index = 0;
                var hasNext = true;
                while (hasNext) {
                    var name = course[index].replace(' ', '');
                    var teacherName = course[index + 1];
                    var place = course[index + 3];
                    var time = formatTime(course[index + 2], jc);
                    var week = time[0];
                    var startJc = time[1];
                    var endJc =time[2];
                    var flag = time[3];
                    var weekday = colIndex - 1;
                    addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
                    if (course[index + 4] != undefined) {
                        index += 4;
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
            jc += 2;
        }
        postData();
    }
}

parse();