<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html>
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	 
	<title>${title}</title>	 
	<script>
		__TYPE__ = "dnet";
		__MODULE__ = "xxx";
		__ITEM__ = "${item}";  	
		__STATIC_RESOURCE_URL__  = "${urlUiStModules}";
		__STATIC_RESOURCE_URL_CORE__  = "${urlUiStCore}";
		__LANGUAGE__ = "${shortLanguage}"; 	
		__THEME__ = "${theme}"; 
	</script>
</head>
<body>
	  

    <script type="text/javascript">
    	if(document &&  document.getElementById('n21-loading-msg')) {
        	document.getElementById('n21-loading-msg').innerHTML = 'Loading...';
        }
	</script> 
        
	<c:if test="${sysCfg_workingMode == 'dev'}">
		<%@ include file="_includes_dev.jspf" %>	
	</c:if>
	<c:if test="${sysCfg_workingMode == 'prod'}">
		<%@ include file="_includes_prod.jspf" %>	
	</c:if>
	
	<%@ include file="_dnet_params.jspf" %> 
	<script type="text/javascript" src="${urlUiStModules}/${bundle}/resources/locale/${shortLanguage}/frame/${itemSimpleName}.js"></script>
	<script type="text/javascript" src="${urlUiStModules}/${bundle}/src/frame/${itemSimpleName}.js"></script>
 
 	<%@ include file="_dnet_params.jspf" %>
 	
    <script type="text/javascript" src="${urlUiStCore}/src/app_frame.js" ></script>   
     
  
</body> 
</html>