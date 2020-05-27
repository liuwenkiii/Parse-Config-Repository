function getSelected(select) {
    var selectedIndex = select.selectedIndex;
    var options = select.getElementsByTagName('option');
    return options[selectedIndex].textContent;
}

function select(select, value) {
    var options = select.getElementsByTagName('option');
    var targetIndex = 0;
    for (var i = 1; i < options.length; i++) {
        if (options[i].textContent == value) {
            targetIndex = i;
            break;
        }
    }
    select.selectedIndex = targetIndex;
}

function parse() {
    log('parse start');
    document.querySelector('#tb > button:nth-child(3)').click();
    setTimeout(() => {
        var rows = document.getElementById('kblist_table').children;
        for (var i = 1; i < rows.length; i++) {
            console.log('for' + i);
            var row = rows[i];
            if (row.style.display == 'none') continue;
            var courses = row.getElementsByClassName('timetable_con text-left');
            var currentJc;
            for (var j = 0; j < courses.length; j++) {
                if (courses[j].parentElement.parentElement.children.length > 1) {
                    currentJc = courses[j].parentElement.parentElement.children[0].textContent;
                }
                var jc = currentJc.split('-');
                var startJc = parseInt(jc[0]);
                var endJc = parseInt(jc[1]);
                var name = courses[j].children[0].textContent;
                var info = courses[j].children[1];
                var week = info.children[0].textContent.replace('周数：', '').replace('周', '');
                var flag = 0;
                if (week.search('(单)') != -1) {
                    flag = 1;
                    week = week.replace('(单)', '');
                }
                if (week.search('(双)') != -1) {
                    flag = 2;
                    week = week.replace('(双)', '');
                }
                var place = info.children[1].textContent.replace('校区：', '').replace('上课地点：', '');
                var teacherName = info.children[2].textContent.replace('教师：', '');
                var weekday = i;
                console.log(name);
                console.log(week);
                console.log(place);
                console.log(teacherName);
                console.log(startJc + '-' + endJc);
                console.log(weekday);
                addCourse(new Course(name, place, teacherName, week, weekday, startJc, endJc, flag));
            }
        }
        postData();
    }, 1000);
}

var txn = xq.slice(0, 9);
var txq = xq.slice(10, 11);
var target = txn + '-' + txq;
var xnm = getSelected(document.querySelector('#xnm'));
var xqm = getSelected(document.querySelector('#xqm'));
var submit = document.querySelector('#search_go');
if ((xnm + '-' + xqm) != target) {
    select(document.querySelector('#xnm'), txn);
    select(document.querySelector('#xqm'), txq);
    submit.click();
    log('is not target');
    setTimeout(function () {
        parse();
    }, 3000);
} else {
    log('is target');
    parse();
}