let http = new XMLHttpRequest();
http.open('GET', 'http://222.171.247.92:9801/datacenter/user/login.do?username=' + account + '&password=' + password + '&verificationCode=&isRememberLoginInfo=false&webUrl=%2Flogin.html');
http.send();
http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
        loadUrl('http://222.171.247.92:9801/portal/index.html');
    }
}