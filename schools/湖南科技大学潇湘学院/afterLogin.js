var http = new XMLHttpRequest();
http.open("POST", host + '/Logon.do?method=logonBySSO', true);
http.send();