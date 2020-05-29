let xnxq = xq;

setTimeout(() => {
    let menu = document.querySelector('#leftTD > iframe').contentDocument;
    menu.querySelector('body > ul > li:nth-child(3) > a').click();
    setTimeout(() => {
        menu.querySelector('body > ul > li:nth-child(3) > ul > div > li:nth-child(2) > a').click();
        setTimeout(parse, 5000);
    }, 500);
}, 1000);

function isTargetXnxq(xnSelector, xqSelector, doc = document, onSetTargetXn = null, onSetTargetXq = null) {
    let xnElement = doc.querySelector(xnSelector);
    let xqElement = doc.querySelector(xqSelector);
    let xnxqSplitArr = xnxq.split('-');
    let xn = xnxqSplitArr[0] + '-' + xnxqSplitArr[1];
    let xq = xnxqSplitArr[2];
    if (onSetTargetXn != null) {
        xn = onSetTargetXn(xn);
    }
    if (onSetTargetXq != null) {
        xq = onSetTargetXq(xq);
    }
    return xnElement.options[xnElement.selectedIndex].value == xn && xqElement.options[xqElement.selectedIndex].value == xq;
}

function setTargetXnxq(xnSelector, xqSelector, confirmSelector, doc = document, onSetTargetXn = null, onSetTargetXq = null) {
    let xnElement = doc.querySelector(xnSelector);
    let xqElement = doc.querySelector(xqSelector);
    let xnxqSplitArr = xnxq.split('-');
    let xn = xnxqSplitArr[0] + '-' + xnxqSplitArr[1];
    let xq = xnxqSplitArr[2];
    if (onSetTargetXn != null) {
        xn = onSetTargetXn(xn);
    }
    if (onSetTargetXq != null) {
        xq = onSetTargetXq(xq);
    }
    for (let i = 0; i < xnElement.options.length; i++) {
        if (xnElement.options[i].value == xn) {
            xnElement.selectedIndex = i;
            break;
        }
    }
    for (let i = 0; i < xqElement.options.length; i++) {
        if (xqElement.options[i].value == xq) {
            xqElement.selectedIndex = i;
            break;
        }
    }
    doc.querySelector(confirmSelector).click()
}

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

function parse() {
    let doc = document.querySelector('#main').contentDocument;
    if (isTargetXnxq('#year', '#term', doc)) {
        doc = doc.querySelector('#contentListFrame').contentDocument;
        for (let weekday = 0; weekday < 7; weekday++) {
            let day = doc.querySelector(`body > table.listTable > tbody > tr:nth-child(${weekday + 3})`);
            let len = day.children.length;
            let startJc = 1;
            for (let i = 0; i < len; i++) {
                let c = day.children[i];
                if (c.className != 'infoTitle') continue;
                let course = nodeTransform(c);
                let index = 0;
                let hasNext = true;
                let span = 1;
                if (c.getAttribute('colspan') != null) {
                    span = Number(c.getAttribute('colspan'))
                }
                let name;
                let teacherName;
                let place;
                let week;
                let flag;
                let endJc;
                while (hasNext) {
                    if (course[index].split(' ')[1] != undefined) {
                        name = course[index].split(' ')[1].split('(')[0];
                        teacherName = course[index].split(' ')[0];
                        place = course[index + 1].split(',')[1].replace(')', '');
                        week = course[index + 1].split(',')[0].replace(' ', ',').replace('(', '');
                        endJc = startJc + span - 1;
                    } else {
                        place = course[index].split(',')[1].replace(')', '');
                        week = course[index].split(',')[0].replace(' ', ',').replace('(', '');
                        endJc = startJc + span - 1;
                    }
                    flag = 0;
                    if (week.search('单') != -1) {
                        week = week.replace(/单/g, '');
                        flag = 1;
                    }
                    if (week.search('双') != -1) {
                        week = week.replace(/双/g, '');
                        flag = 2;
                    }
                    console.log(name);
                    console.log(teacherName);
                    console.log(place);
                    console.log(week);
                    console.log(weekday + 1);
                    console.log(`${startJc}-${endJc}`);
                    console.log(flag);
                    console.log('');
                    addCourse(new Course(name, place, teacherName, week, weekday + 1, startJc, endJc, flag));
                    if (course[index + 2] != undefined) {
                        if (course[index].split(' ')[1] == undefined) {
                            index += 1;
                        } else {
                            index += 2;
                        }
                    } else {
                        hasNext = false;
                    }
                }
                if (!hasNext) {
                    startJc += span;
                }
            }
        }
        postData();
    } else {
        setTargetXnxq('#year', '#term', 'body > table.frameTable_title > tbody > tr > td:nth-child(16) > input', doc)
    }
}
