let termId = '';
let courseTableData;

getTermId();

function getTermId() {
    let http = new XMLHttpRequest();
    http.open('GET', 'http://222.171.247.92:9801/school-obe-kbgl/courseTable/getAdjustCourseTermInfo.do?webUrl=%2Fkb%2Ftimetable.html');
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            let dataList = JSON.parse(http.responseText).data.dataList;
            for (let i in dataList) {
                let data = dataList[i];
                if (data.termName.replace('学年', '-') == xq) {
                    termId = data.termId;
                    break;
                }
            }
            getCourseTableId();
        }
    }
}

function getCourseTableId() {
    let http = new XMLHttpRequest();
    http.open('GET', 'http://222.171.247.92:9801/school-obe-kbgl/courseTable/v2/getAdjustCourseTimeInfo.do?termId=' + termId + '&webUrl=%2Fkb%2Ftimetable.html');
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            courseTableData = JSON.parse(http.responseText).data.dataList;
            console.log(courseTableData.length);
            parse(1);
        }
    }
}

function parse(week) {
    if (week > courseTableData.length) {
        postData();
        return;
    }
    let _courses = new Array();
    let tableId = courseTableData[week - 1].courseTableId;
    let sTime = courseTableData[week - 1].startTime;
    let eTime = courseTableData[week - 1].endTime;
    let http = new XMLHttpRequest();
    http.open('GET', 'http://222.171.247.92:9801/school-obe-kbgl/courseTable/v2/getStuCourseTableInfo.do?termId=' + termId + '&weekId=' + week + '&tableId=' + tableId + '&startTime=' + sTime + '&endTime=' + eTime + '&stuId=&webUrl=%2Fkb%2Ftimetable.html');
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            // 这个学校的后端应该拉出去斩了，字段设计太糟糕了
            let timeTableInfoList = JSON.parse(http.responseText).data.timeTableInfoList;
            for (let i = 0; i < 3; i++) {
                let list = timeTableInfoList[i];
                for (let a in list) {
                    for (let j in list[a]) {
                        let l = list[a][j].list;
                        //console.log(l);
                        for (let b in l) {
                            console.log(l[b]);
                            if (l[b].courseList.length > 0) {
                                let courseList = l[b].courseList;
                                for (let index in courseList) {
                                    let course = courseList[index];
                                    //console.log(course);
                                    let name = course.courseName;
                                    let place = course.room;
                                    let teacherName = course.teacherName;
                                    let w = '' + week;
                                    let wkd = parseInt(l[b].weekId);
                                    let flag = 0;
                                    let startJc = i * 4 + parseInt(j) + 1;
                                    let endJc = startJc;
                                    let hasPrev = false;
                                    for (let k in _courses) {
                                        let c = _courses[k];
                                        if (c.name == name && c.weekday == wkd) {
                                            hasPrev = true;
                                            if (Math.abs(c.endJc - startJc) == 1) {
                                                if (startJc >= c.endJc) {
                                                    c.endJc = startJc;
                                                } else {
                                                    c.startJc = startJc;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    if (!hasPrev) {
                                        _courses.splice(-1, 0, new Course(name, place, teacherName, w, wkd, startJc, endJc, flag));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let recordList = new Array();
            for (let i in courses) {
                for (let j  in _courses) {
                    let c1 = courses[i];
                    let c2 = _courses[j];
                    if (c1.name == c2.name && c1.weekday == c2.weekday && c1.startJc == c2.startJc && c1.endJc == c2.endJc) {
                        courses[i].week += ',' + c2.week;
                        recordList.push(j);
                    }
                }
            }
            for (let i in recordList) {
                _courses.splice(recordList[i], 1);
            }
            courses = courses.concat(_courses);
            parse(week + 1);
        }
    }
}
