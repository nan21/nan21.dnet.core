<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	 
	<title>${title}</title>	 
	<script>
		__TYPE__ = "dnet";
		//__MODULE__ = "xxx";
		//__ITEM__ = "";  	
		__STATIC_RESOURCE_URL__  = "${urlUiExtjs}";
		__STATIC_RESOURCE_URL_CORE__  = "${urlUiExtjsCore}";
		__LANGUAGE__ = "${shortLanguage}";
		__THEME__ = "${theme}"; 		
	</script>
	<script type="text/javascript" src="${ urlUiExtjsCore }/src/globals.js" ></script>	
	<script type="text/javascript" src="${ urlUiExtjsCore }/config.js"></script>
	<script type="text/javascript">
	  checkAndStart(); 
	  __checkAuthToken();
	</script>
  
	<link rel="stylesheet" type="text/css" href="${ urlUiExtjsCore }/resources/css/dnet.css"/>
</head>
<body>
	
	<%@ include file="_loading_mask.jspf" %> 

    <script type="text/javascript">
    
    	if(document &&  document.getElementById('n21-loading-msg')) {
        	document.getElementById('n21-loading-msg').innerHTML = 'Loading...';
        }
	</script> 
	  
	 <!-- Extjs  --> 
     
    <link rel="stylesheet" type="text/css" href="${urlUiExtjsLibExtjs}/resources/css/ext-all-${theme}.css"/> 
    <script type="text/javascript" src="${urlUiExtjsLibExtjs}/ext-all-debug.js"></script>
     
    <script type="text/javascript" src="${urlUiExtjsCore}/src/Dnet.js" ></script>    
    <script type="text/javascript" src="${urlUiExtjsCore}/extjs-extend.js"></script>     
    <script type="text/javascript" src="${urlUiExtjsCore}/extjs-ux-extend.js"></script> 
   
    <!-- DNet locale -->            
    <script type="text/javascript" src="${urlUiExtjsCore}/resources/locale/${shortLanguage}/Dnet.js"></script>  
	
	
	<!-- DNet framework --> 
    
    
    <script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/base/Application.js"></script>
    <script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/base/Session.js"></script>
    <script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/base/TemplateRepository.js"></script>
    
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/Portal.js"></script>
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/Portlet.js"></script>    
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/PortalPanel.js"></script>
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/PortalDropZone.js"></script>   
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/PortalColumn.js"></script>     
	   
	<script type="text/javascript" src="${urlUiExtjsCore}/src/dnet/core/dashboard/portlet/DNetFilesSF.js"></script>     
	   
	<%@ include file="_dnet_params.jspf" %>   
	   
	<script type="text/javascript">
	
  		if(document && document.getElementById('n21-loading-msg')) {
  	  		document.getElementById('n21-loading-msg').innerHTML = Dnet.translate("msg", "initialize")+' ${item}...';
  	  	}
	</script>
    
 	<script>

    Ext.onReady(function(){

    	Ext.create('dnet.core.dashboard.Portal');    
      
    });

    <%@ include file="_loading_mask_remove.jspf" %> 
    
  </script>
  <span id="app-msg" style="display:none;"></span>
</body> 
</html>