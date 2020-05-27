var target_xq = xq;
var xnxq = document.getElementById('xnxq01id');
var options = xnxq.getElementsByTagName('option');
var selectedIndex = xnxq.selectedIndex;
if (options[selectedIndex].value != xq) {
    var targetIndex = 0;
    for (var i = 1; i < options.length; i++) {
        if (options[i].value == xq) {
            targetIndex = i + 1;
            break;
        }
    }
    console.log(targetIndex);
    xnxq.selectedIndex = targetIndex;
    document.Form1.submit();
} else {
    for (var rowIndex = 0; rowIndex < 8; rowIndex++) {
        for (var colIndex = 0; colIndex < 8; colIndex++) {
            var courseContainer = document.querySelector('#kbtable > tbody > tr:nth-child(' + rowIndex + ') > td:nth-child(' + colIndex + ')');
            if (courseContainer == null) continue;
            var course = courseContainer.children[3];
            if (course.innerHTML == '&nbsp;') continue;
            var index = 0;
            var hasNext = true;
            while (hasNext) {
                var name = course.childNodes[index].textContent;
                var teacherName = course.childNodes[index + 2].textContent;
                var weekFormatResult = weekFormat(course.childNodes[index + 4].textContent);
                var week = weekFormatResult[0];
                var flag = weekFormatResult[1];
                var place = course.childNodes[index + 6].textContent;
                var jcFormatResult = jcFormat(course.childNodes[index + 8].textContent);
                var startJc = jcFormatResult[0];
                var endJc = jcFormatResult[1];
                var weekday = colIndex - 1;
                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
                if (course.childNodes[index + 13] != undefined) {
                    index += 14;
                } else {
                    hasNext = false;
                }
                console.log(name);
                console.log(teacherName);
                console.log(week);
                console.log(flag);
                console.log(place);
                console.log(startJc + '-' + endJc);
                console.log(weekday);
            }
        }
    }
    postData();
}

function weekFormat(week) {
    var flag = 0;
    if (week.search('单') != -1) {
        flag = 1;
    }
    if (week.search('双') != -1) {
        flag = 2;
    }
    return [week.replace('(周)', '').replace('(单周)', '').replace('(双周)', ''), flag];
}

function jcFormat(jc) {
    var jcList = jc.replace('[', '').replace(']节', '').split('-');
    return [Number(jcList[0]), Number(jcList[jcList.length - 1])];
}