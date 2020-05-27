getTargetTable();

function parseDom(str) {
    var obj = document.createElement("div");
    obj.innerHTML = str
    return obj;
};

function getTargetTable() {
    var target_xnxq = xq + '-1';
    var request = new XMLHttpRequest();
    request.open('POST', '/lnkbcxAction.do');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader('Cache-Control', 'max-age=0');
    request.setRequestHeader('Upgrade-Insecure-Requests', '1');
    request.send('zxjxjhh=' + target_xnxq);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            parse(parseDom(request.responseText));
        }
    }
}

function parse(d) {
    var courses = d.querySelector('#user > tbody').getElementsByTagName('tr');
    //console.log('courses = ' + courses);
    var length = courses.length;
    //console.log('courses.length = ' + courses.length);
    var lastCourse;
    for (var i = 0; i < length; i++) {
        var c = courses[i].getElementsByTagName('td');
        //console.log('c.length = ' + c.length);
        if (c == undefined) continue;
        var name, teacherName, week, weekday, startJc, endJc, place;
        if (c.length == 7 && lastCourse != undefined) {
            name = lastCourse[2].textContent.replace(/\s*/g, '');
            teacherName = lastCourse[7].textContent.replace(/\s*/g, '');
            week = c[0].textContent.replace('周上', '').replace(/\s*/g, '');
            weekday = Number(c[1].textContent);
            startJc = Number(c[2].textContent);
            endJc = startJc + Number(c[3].textContent) - 1;
            place = c[4].textContent.replace(/\s*/g, '') + c[5].textContent.replace(/\s*/g, '') + c[6].textContent.replace(/\s*/g, '');
        } else {
            name = c[2].textContent.replace(/\s*/g, '');
            teacherName = c[7].textContent.replace(/\s*/g, '');
            week = c[10].textContent.replace('周上', '').replace(/\s*/g, '');
            weekday = Number(c[11].textContent);
            startJc = Number(c[12].textContent);
            endJc = startJc + Number(c[13].textContent) - 1;
            place = c[14].textContent.replace(/\s*/g, '') + c[15].textContent.replace(/\s*/g, '') + c[16].textContent.replace(/\s*/g, '');
            lastCourse = c;
        }
        var flag = 0;
        addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
        log(name);
        log(teacherName);
        log(place);
        log(week);
        log(startJc + '-' + endJc);
        log(flag);
        log(weekday);
    }
    postData();
}