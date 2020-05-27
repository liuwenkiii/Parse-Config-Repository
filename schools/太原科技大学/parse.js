document.querySelector('#headDiv > ul > li:nth-child(6) > ul > li:nth-child(2) > a').click();

setTimeout(() => {
    checkXnxq(document.querySelector('#iframeautoheight'));
}, 1000);

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

function formatTime(time, row, col, span) {
    var weekday = '' + col;

    var start = '' + row;
    var end = row + span - 1;

    var t = time.replace('{', '').replace('}', '').split('第');
    var week;
    var flag = '0'
    if (t.length == 0) {
        return ['' + col, start, '' + end, '1-99', '0'];
    } else if (t.length == 2) {
        week = time.split('|')[0].replace('{', '').replace('第', '').replace('周', '');
    } else {
        week = t[2];
        if (week.search('\\|单周') != -1) {
            week = week.replace('|单周', '');
            flag = '1'
        } else if (week.search('\\|双周') != -1) {
            week = week.replace('|双周', '');
            flag = '2'
        }
        week = week.replace('周', '');
    }

    return [weekday, start, end, week, flag];
}

function checkXnxq(iframe) {
    var d = iframe.contentWindow.document;

    var target_xn = xq.slice(0, 9);
    var target_xq = xq.slice(10, 11);

    var xn_select = d.querySelector('#xnd');
    var xq_select = d.querySelector('#xqd');

    // 验证学期
    var xq_options = xq_select.options;
    var xq_selectedIndex = xq_select.selectedIndex;

    if (xq_options[xq_selectedIndex].value != target_xq) {
        for (var i = 0; i < xq_options.length; i++) {
            //console.log('xq: ' + xq_options[i].value + ', tartget_xq: ' + target_xq);
            if (xq_options[i].value == target_xq) {
                xq_options[i].selected = true;
                xq_select.dispatchEvent(new Event('change'));
                //console.log('change xq');
                break;
            }
        }
    }

    // 验证学年
    var xn_options = xn_select.options;
    var xn_selectedIndex = xn_select.selectedIndex;

    if (xn_options[xn_selectedIndex].value != target_xn) {
        for (var i = 0; i < xn_options.length; i++) {
            //console.log('xn: ' + xn_options[i].value + ', tartget_xn: ' + target_xn);
            if (xn_options[i].value == target_xn) {
                xn_options[i].selected = true;
                xn_select.dispatchEvent(new Event('change'));
                //console.log('change xn');
                break;
            }
        }
    }

    setTimeout(() => {
        parse(document.querySelector('#iframeautoheight').contentWindow.document);
    }, 1000);
    
}

function parse(d) {
    var table = d.querySelector('#Table1');
    for (var r = 3; r <= 12; r++) {
        var row = table.querySelector('#Table1 > tbody > tr:nth-child(' + r + ')');
        var cols = row.getElementsByTagName('td');
        var len = cols.length;
        var offset = 1;
        if (len == 8) {
            offset = 0;
        }
        for (var c = 0; c < len; c++) {
            var col = cols[c];
            if (col.colspan == 2 || col.width == "14%" || col.innerHTML == "&nbsp;" || col.children.length == 0) continue;
            var course = nodeTransform(col);
            var index = 0;
            var hasNext = true;
            while (hasNext) {
                var name = course[index];
                var teacherName = course[index + 2];
                var place = course[index + 3];
                var time = formatTime(course[index + 1], r - 2, c - offset, col.rowSpan);
                var week = time[3];
                var flag = Number(time[4]);
                var startJc = Number(time[1]);
                var endJc = Number(time[2]);
                var weekday = Number(time[0]);
                if (week.split('-')[1] == '99') {
                    name = '该节课程数据无法保证正确\n' + name;
                }
                log(name);
                log(teacherName);
                log(place);
                log(week);
                log(flag);
                log(startJc);
                log(endJc);
                log(weekday);
                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
                if (course[index + 4] != undefined) {
                    index += 4;
                } else {
                    hasNext = false;
                }
            }
        }
    }
    postData();
}
