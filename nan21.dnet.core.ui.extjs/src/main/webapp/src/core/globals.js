/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

	// global constants:

    // set values in config.js for the constants below

  
	__COOKIE_AUTH_TOKEN__ = null;
    __COOKIE_LOGIN_NAME__ = null;
    __COOKIE_CURRENT_THEME__ = null;
    __COOKIE_REMEMBER_USER__ = null;


	__DEFAULT_THEME__ = "gray";
    __CURRENT_THEME__ = null;
    __DEFAULT_LANGUAGE__ = "en";
    
	//__SERVER_DOMAIN_URL__ = null;

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
    	 APP_VIEW_HOME:"dnet-application-view-home"
    	,APP_VIEW_HEADER:"dnet-application-view-header"
		,APP_VIEW_FOOTER:"dnet-application-view-footer"
		,APP_VIEW_BODY :"dnet-application-view-body"

		,FRAME_TAB_PREFIX: "view-body-tab-" // id of the tabPanel in which the frame is opened
		,FRAME_IFRAME_PREFIX :"view-body-iframe-" // id of the html iframe in which the frame is opened in TabPanel
    }


	// http request constants
	/*
	__Http__ = {

   		 RESOURCE_TYPE_LOV	:"lov"
		,RESOURCE_TYPE_DC	:"dc"
        ,REQUEST_PARAM_RESOURCE_TYPE	: "_p_resource_type"
		,REQUEST_PARAM_RESOURCE_NAME	: "_p_resource_name"
        ,REQUEST_PARAM_ACTION			: "s[method]"
        ,REQUEST_PARAM_CUSTOM_ACTION 	: "s[service]"
        ,REQUEST_PARAM_TRANSPORT      	: "c[transport]"
		,REQUEST_PARAM_CLIENT_SESSION   : "c[session]"
		,REQUEST_PARAM_CONTROL          : "s[control]"
		,REQUEST_PARAM_DATA_FORMAT      : "_p_data_format"

    	,REQUEST_PARAM_FETCH_SORT       : "orderByCol"
		,REQUEST_PARAM_FETCH_SENSE      : "orderBySense"
		,REQUEST_PARAM_FETCH_START      : "resultStart"
		,REQUEST_PARAM_FETCH_SIZE       : "resultSize"

		,REQUEST_PARAM_EXPORT_COL_NAMES    : "c[export_col_names]"
		,REQUEST_PARAM_EXPORT_COL_TITLES   : "c[export_col_titles]"
		,REQUEST_PARAM_EXPORT_COL_WIDTHS   : "c[export_col_widths]"
		,REQUEST_PARAM_EXPORT_GROUPBY      : "_p_export_groupby"
		,REQUEST_PARAM_PRINT_LAYOUT        : "_p_print_layout"

        //Request parameter values: Actions

		,REQUEST_PARAM_ACTION_FETCH         : "fetch"
		,REQUEST_PARAM_ACTION_FETCH_RECORD  : "fetch"
		,REQUEST_PARAM_ACTION_INSERT        : "insert"
		,REQUEST_PARAM_ACTION_UPDATE        : "update"
		,REQUEST_PARAM_ACTION_DELETE        : "delete"
		,REQUEST_PARAM_ACTION_EXPORT        : "export"
		,REQUEST_PARAM_ACTION_CUSTOM        : "service"
		,REQUEST_PARAM_ACTION_LOGIN         : "login"
		,REQUEST_PARAM_ACTION_INIT_RECORD   : "initRecord"
		 
		,REQUEST_PARAM_REP_ACTION_RUN   	: "show"

        //Request parameter values: Data formats
	

		,DATA_FORMAT_HTML : "html"
		,DATA_FORMAT_CSV  : "csv"
		,DATA_FORMAT_PDF  : "pdf"
		,DATA_FORMAT_XML  : "xml"
		,DATA_FORMAT_JSON : "json"

		,PRINT_LAYOUT_H : "Landscape"
		,PRINT_LAYOUT_V : "Portrait"

		// Miscellaneous

		,RECORD_XML_ROOT_TAG       : "record" 
		,RECORD_JSON_ROOT_TAG      : "data"
		,RECORDS_XML_ROOT_TAG      : "records" 
		,RECORDS_JSON_ROOT_TAG     : "data"
		,TRANSPORT_TAG             : "transport" 
		,COLLECTION_RECORD_ID_TAG  : "storeRecordId" 
		,SESSION_TAB_ID           : "sessionTabId" 
	};
	*/
 
//	function query_field_alias(v){return v;};



	function checkAndStart() {
		__checkConfig();
		__prepare();
		
	}

	function __checkConfig() {
	   if (__COOKIE_AUTH_TOKEN__ == null) __alertUndefinedConfigVar("__COOKIE_AUTH_TOKEN__");
	   if (__COOKIE_LOGIN_NAME__ == null) __alertUndefinedConfigVar("__COOKIE_LOGIN_NAME__");
	   if (__COOKIE_CURRENT_THEME__ == null) __alertUndefinedConfigVar("__COOKIE_CURRENT_THEME__");

       //if (__PATH_FOR_LOV__ == null) __alertUndefinedConfigVar("__PATH_FOR_LOV__");
      // if (__PATH_FOR_DC__ == null) __alertUndefinedConfigVar("__PATH_FOR_DC__");

	   if (__DEFAULT_THEME__ == null) __alertUndefinedConfigVar("__DEFAULT_THEME__");
	   if (__DEFAULT_LANGUAGE__== null) __alertUndefinedConfigVar("__DEFAULT_LANGUAGE__");
	}


	function __alertUndefinedConfigVar(p) {
		alert("Invalid configuration. No value set for "+p);
	}
 

    function __prepare() {
        __CURRENT_THEME__ = readCookie(__COOKIE_CURRENT_THEME__); 
    	if(!__CURRENT_THEME__) {__CURRENT_THEME__ = __DEFAULT_THEME__; createCookie(__COOKIE_CURRENT_THEME__, __CURRENT_THEME__, 100);}
	   // __SERVER_DOMAIN_URL__ = __resolveServerDomain();
	}

  function __checkAuthToken() {  //alert(readCookie(__COOKIE_AUTH_TOKEN__));
     if(! readCookie(__COOKIE_AUTH_TOKEN__)) {
       //window.location.href=__SSO_URL__;
     }
  }

      function onContentPanelClose(clientSession) { return;
        var baseUrlCfg = {};
        baseUrlCfg[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_CUSTOM;
        baseUrlCfg[__Http__.REQUEST_PARAM_CUSTOM_ACTION] =  "logout";
        baseUrlCfg[__Http__.REQUEST_PARAM_CLIENT_SESSION] =  clientSession;
        baseUrlCfg[__Http__.REQUEST_PARAM_DC] = "_SessionManager_";
				baseUrlCfg[__Http__.REQUEST_PARAM_FETCH_DATA_FORMAT] = __Http__.DATA_FORMAT_JSON;
				
        Ext.Ajax.request({
             url: buildUrl(baseUrlCfg)
            ,scope:this
          });

      }


      function global_after_ajax_failure(response , options) {
    	Ext.MessageBox.hide();
    	Ext.Msg.show({
		          title: 'HTTP:'+response.status+' '+ response.statusText
		         ,msg: response.responseText.substr(0,1500)
		         ,buttons: Ext.Msg.OK				          
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
		      });
	  }


	// createCookie, readCookie, eraseCookie had been taken from a web-site
	// unfortunately i don't remember from where

	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else {
			var expires = "";
		}
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) { //alert("reading cookie: "+name);
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) { /*alert("value = "+c.substring(nameEQ.length,c.length)); */return c.substring(nameEQ.length,c.length); }
		}
		// alert("value = null");
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}


function urldecode ( str ) {
    if (str==undefined || str == null ) {
       return "";
    } else {
      var ret = str;
      try{
        ret = str.replace(/\+/g, "%20");
        ret = decodeURIComponent(ret);
        ret = ret.toString();
        return ret;
      }
      catch(e) {
        alert('urldecode of <'+str+'> failed: '+e.message);
        return str;
      }
    }
}