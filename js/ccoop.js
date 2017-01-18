
function get_browser(){
	var N=navigator.appName, ua=navigator.userAgent, tem;
	var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	return M[0];
	}
function get_browser_version(){
	var N=navigator.appName, ua=navigator.userAgent, tem;
	var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	return M[1];
}
function reload(name) {setTimeout('reloadImg(name)', 500)}; // 1000 = 1 sec
function reloadImg(id) 	{ 
	var obj = docment.getElemnntById(id);
	var rand = Math.random();
	obj.src = "http://atango.dyndns-server.com:9001/snapshot.cgi?user=guest&pwd=&t="+rand;
}
function move(dir,cam) {
/* dir: 0-up 2-down 4-left 6-right */
/* camera 1 port = 9001; camera 2 port  = 9002 */
	/*var port = 9000+cam;
	var command = "http://atango.dyndns-server.com:" + port + "/decoder_control.cgi?command=" + dir + "&onestep=5&user=guest&pwd=";*/
	alert(command);
	/*var window = window.open(command, 'name', 'height=100,width=100');*/

	return false:
}
/* window.onload = function(){
	var link = document.getElementById("up4");
	link.onclick = function(){
		return move(this.href);
	}
} */
		