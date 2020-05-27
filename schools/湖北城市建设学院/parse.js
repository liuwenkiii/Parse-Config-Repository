function convertXnxq(xnxq) {
    var xn = xnxq.split('-')[0] + '-' + xnxq.split('-')[1];
    var _xq = xnxq.split('-')[2];
    var xq;
    switch (_xq) {
        case '1':
            xq = '第一学期';
            break;
        case '2':
            xq = '第二学期';
            break;
        default:
            xq = '第一学期';
    }
    return xn + '学年' + xq;
}

var target_xnxq = convertXnxq(xq);
console.log(target_xnxq);

var semId = '';

var request = new XMLHttpRequest();
request.open('GET', 'http://aic.hbucvc.edu.cn:8080/jedu/edu/core/eduSemester/getAllSem.do?_=' + Date.parse(new Date()), true);
request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
request.send();
request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        var dataList = JSON.parse(request.responseText);
        var length = dataList.length;
        for (var i = 0; i < length; i++) {
            if (dataList[i].name == target_xnxq) {
                semId = dataList[i].semId;
                break;
            }
        }
    }
}

var weekNum = 1;

requestNextWeek(weekNum);

function requestNextWeek(weekNum) {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://aic.hbucvc.edu.cn:8080/jedu/edu/core/eduScheduleInfo/getStudentWeekSchedule.do', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    request.send('week=' + weekNum + '&semId=' + semId);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            parse(weekNum, data);
        }
    }
}

function parse(weekNum, data) {
    log('weekNum = ' + weekNum);

    if (data.success) {
        var schedule = data.data.schedule;
        var length = schedule.length;
        for (var i = 0; i < length; i++) {
            var courseData = schedule[i];
            //console.log(courseData);
            var name = courseData.courseName;
            var teacherName = courseData.teacherName;
            var place = courseData.placeName;
            var week = '' + weekNum;
            var weekday = getWeekday(courseData.weekOfDay);
            var startJc = courseData.eduTimeSchedule.eduLesson.startLesson;
            var endJc = courseData.eduTimeSchedule.eduLesson.endLesson;
            var flag = 0;
            addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
            log(name);
            log(teacherName);
            log(place);
            log(week);
            log(weekday);
            log(startJc);
            log(endJc);
            log(flag);
            log('----------------');
        }
    }

    if (weekNum < 25) {
        weekNum++;
        requestNextWeek(weekNum);
    } else {
        postData();
    }
}

function getWeekday(weekOfDay) {
    var weekday = 1;
    switch (weekOfDay) {
        case 'mon':
            weekday = 1;
            break;
        case 'tue':
            weekday = 2;
            break;
        case 'wed':
            weekday = 3;
            break;
        case 'thu':
            weekday = 4;
            break;
        case 'fri':
            weekday = 5;
            break;
        case 'sat':
            weekday = 6;
            break;
        case 'sun':
            weekday = 7;
            break;
        case 'mon':
            weekday = 1;
            break;
        default:
            break;
    }
    return weekday;
}
