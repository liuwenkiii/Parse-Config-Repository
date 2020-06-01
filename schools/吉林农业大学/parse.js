document.querySelector('#page-wrapper > div.row.border-bottom > nav > div.navbar-header > a').click();
setTimeout(() => {
    document.querySelector('#side-menu > li:nth-child(2) > a').click();
    setTimeout(() => {
        document.querySelector('#side-menu > li.active > ul > li:nth-child(2) > a').click();    
        setTimeout(() => {
            document.querySelector('#side-menu > li.active > ul > li.active > ul > li:nth-child(6) > a').click();
            setTimeout(() => fetchData(), 4000);
        }, 600);
    }, 200);
}, 200);

function fetchData() {
    let doc = document.querySelector('#content-main > iframe:nth-child(2)').contentWindow.document;
    let xhid = doc.querySelector('#xhid').value;
    let http = new XMLHttpRequest();
    http.open("GET", 'http://jlau1.jw.chaoxing.com/admin/pkgl/xskb/sdpkkbList?xnxq=' + xq + '&xhid=' + xhid + '&xqdm=1', true);
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            let data = JSON.parse(http.responseText);
            for (let i in data) {
                let c = data[i];
                let name = c.kcmc;
                let place = c.croommc;
                let teacherName = c.tmc;
                let week = c.zc;
                let weekday = c.xingqi;
                let jc = c.djc;
                let flag = 0;
                try {
                    flag = parseInt(c.zctype);
                } catch (e) {
                    log(e);
                }
                let hasPrev = false;
                for (let j in courses) {
                    if (courses[j].name == name && courses[j].weekday == weekday && courses[j].week == week) {
                        if (Math.abs(courses[j].endJc - jc) == 1) {
                            hasPrev = true;
                            if (jc >= courses[j].endJc) {
                                courses[j].endJc = jc;
                            } else {
                                courses[j].startJc = jc;
                            }
                        }
                        //courses[j].endJc = jc;
                        break;
                    }
                }
                if (!hasPrev) {
                    addCourse(new Course(name, place, teacherName,week, weekday, jc, jc, 0))
                }
            }
            postData();
            //console.log(courses);
        }
    }
}

