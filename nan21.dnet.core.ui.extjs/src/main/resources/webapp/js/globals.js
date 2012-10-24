// global constants:

__COOKIE_AUTH_TOKEN__ = "dnet_at";
__COOKIE_LOGIN_NAME__ = "dnet_lu";
__COOKIE_REMEMBER_USER__ = "dnet_ru";
__COOKIE_SESSION_CLIENT_MNDNO__ = "dnet_scmno";
__COOKIE_SESSION_CLIENT_ID__ = "dnet_sci";
__COOKIE_SESSION_CLIENT_CD__ = "dnet_scd";

__COOKIE_CURRENT_THEME__ = "dnet_th";

__DEFAULT_THEME__ = "gray";
__CURRENT_THEME__ = null;
__DEFAULT_LANGUAGE__ = "en";

// __SERVER_DOMAIN_URL__ = null;

__SSO_URL__ = null;
__REPORTSERVER_URL__ = null;
__HELPSERVER_URL__ = null;

__PATH_FOR_LOV__ = null;
__PATH_FOR_DC__ = null;

__MAX_OPEN_TABS__ = null;
__USE_IFRAMES__ = true;

// global variables:
__application__ = null;

__CmpId__ = {
	APP_VIEW_HOME : "dnet-application-view-home",
	APP_VIEW_HEADER : "dnet-application-view-header",
	APP_VIEW_FOOTER : "dnet-application-view-footer",
	APP_VIEW_BODY : "dnet-application-view-body"

	,
	FRAME_TAB_PREFIX : "view-body-tab-" // id of the tabPanel in which the frame
										// is opened
	,
	FRAME_IFRAME_PREFIX : "view-body-iframe-" // id of the html iframe in
												// which the frame is opened in
												// TabPanel
}

function checkAndStart() {
	__checkConfig();
	__prepare();

}

function __checkConfig() {
	if (__COOKIE_AUTH_TOKEN__ == null)
		__alertUndefinedConfigVar("__COOKIE_AUTH_TOKEN__");
	if (__COOKIE_LOGIN_NAME__ == null)
		__alertUndefinedConfigVar("__COOKIE_LOGIN_NAME__");
	if (__COOKIE_CURRENT_THEME__ == null)
		__alertUndefinedConfigVar("__COOKIE_CURRENT_THEME__");

	if (__DEFAULT_THEME__ == null)
		__alertUndefinedConfigVar("__DEFAULT_THEME__");
	if (__DEFAULT_LANGUAGE__ == null)
		__alertUndefinedConfigVar("__DEFAULT_LANGUAGE__");
}

function __alertUndefinedConfigVar(p) {
	alert("Invalid configuration. No value set for " + p);
}

function __prepare() {
	__CURRENT_THEME__ = readCookie(__COOKIE_CURRENT_THEME__);
	if (!__CURRENT_THEME__) {
		__CURRENT_THEME__ = __DEFAULT_THEME__;
		createCookie(__COOKIE_CURRENT_THEME__, __CURRENT_THEME__, 100);
	}

}

function __checkAuthToken() { // alert(readCookie(__COOKIE_AUTH_TOKEN__));
	if (!readCookie(__COOKIE_AUTH_TOKEN__)) {
		// window.location.href=__SSO_URL__;
	}
}

function global_after_ajax_failure(response, options) {
	Ext.MessageBox.hide();
	Ext.Msg.show({
		title : 'HTTP:' + response.status + ' ' + response.statusText,
		msg : response.responseText.substr(0, 1500),
		buttons : Ext.Msg.OK,
		scope : this,
		icon : Ext.MessageBox.ERROR
	});
}

// createCookie, readCookie, eraseCookie had been taken from a web-site
// unfortunately i don't remember from where

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) { // alert("reading cookie: "+name);
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) { /*
										 * alert("value =
										 * "+c.substring(nameEQ.length,c.length));
										 */
			return c.substring(nameEQ.length, c.length);
		}
	}
	// alert("value = null");
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

function urldecode(str) {
	if (str == undefined || str == null) {
		return "";
	} else {
		var ret = str;
		try {
			ret = str.replace(/\+/g, "%20");
			ret = decodeURIComponent(ret);
			ret = ret.toString();
			return ret;
		} catch (e) {
			alert('urldecode of <' + str + '> failed: ' + e.message);
			return str;
		}
	}
}