let http = new XMLHttpRequest();
http.open('POST', '/admin/login');
http.send('username=' + account + '&password=' + password);
http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
        loadUrl(afterLoginUrl);
    }
}