function nodeTransform(course) {
    let newNodes = new Array();
    let nodes = course.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].innerHTML == undefined) {
            newNodes.push(nodes[i].textContent.replace('  ', ''));
        } else {
            let node = nodes[i].innerHTML;
            let nodeList = node.split('<br>');
            for (let j = 0; j < nodeList.length; j++) {
                if (nodeList[j] == '') continue;
                newNodes.push(nodeList[j].replace(/\\s+/g, ''));
            }
        }
    }
    if (newNodes.length == 1) return null;
    return newNodes;
}

function formatTime(time) {
    let flag = 0;
    log('time: ' + time);
    let t = time.split('周[');
    let week = t[0].replace('，', ',');
    if (week.search('单') != -1) {
        flag = 1;
        week = week.replace('单', '');
    }
    if (week.search('双') != -1) {
        flag = 2;
        week = week.replace('双', '');
    }
    let jc;
    let startJc = 0;
    let endJc = 0;
    try {
        jc = t[1].replace('节]', '').split('-');
        startJc = jc[0];
        endJc = jc[jc.length - 1];
    } catch (error) {
        log(error);
    }
    return [week, startJc, endJc, flag];
}

let targetUrl = host + '/tkglAction.do?method=goListKbByXs&istsxx=no&xnxqh=' + xq;
//log('targetUrl = ' + targetUrl);
if (currentUrl != targetUrl) {
    log('load target url');
    loadUrl(targetUrl);
} else {
    log('load target url success');
    for (let rowIndex = 1; rowIndex < 7; rowIndex++) {
        if (rowIndex == 1) continue;
        for (let colIndex = 1; colIndex < 9; colIndex++) {
            if (colIndex == 1) continue;
            let courseContainer = document.querySelector('#kbtable > tbody > tr:nth-child(' + rowIndex + ') > td:nth-child(' + colIndex + ')');
            if (courseContainer == undefined) continue;
            if (courseContainer.children[0].textContent == '&nbsp;') continue;
            //console.log(rowIndex + ', ' + colIndex);
            let course = nodeTransform(courseContainer.children[1]);
            if (course == null) continue;
            let index = 0;
            let hasNext = true;
            while (hasNext) {
                let name = course[index].replace(' ', '').replace(' ', '');
                let teacherName = course[index + 2];
                let place = course[index + 4]
                    .replace('（', '')
                    .replace('）', '')
                    .replace('(', '')
                    .replace(')', '')
                    .replace('多媒体', '')
                    .replace('录播室', '');
                let time = formatTime(course[index + 3]);
                let week = time[0];
                let startJc = Number(time[1]);
                let endJc = Number(time[2]);
                let flag = time[3];
                let weekday = colIndex - 1;
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