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

for (let weekday = 1; weekday < 8; weekday++) {
    for (let jc = 1; jc < 6; jc++) {
        let course = nodeTransform(document.querySelector('body > div > center > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(' + (jc + 2) + ') > td:nth-child(' + (weekday + 2) + ')'));
        course.pop();
        let hasNext = true;
        let i = 0;
        while(hasNext) {
            let name = course[i];
            let teacherName = course[i + 2];
            let place = course[i + 3];
            let week = course[i + 4];
            let startJc = (jc - 1) * 2 + 1;
            let endJc = startJc + 1;
            let flag = 0;
            if (course[i + 1].search('单') != -1) {
                flag = 1;
            } else if (course[i + 1].search('双') != -1) {
                flag = 2;
            }
            addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
            if (course[index + 5] != undefined) {
                index += 5;
            } else {
                hasNext = false;
            }
        }
    }
}

postData();