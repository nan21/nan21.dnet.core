<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	 
	<title>${title}</title>	 
	<script>
		__TYPE__ = "dnet";
		__MODULE__ = "xxx";
		__ITEM__ = "${item}";  	
		__STATIC_RESOURCE_URL__  = "${urlUiExtjs}";
		__STATIC_RESOURCE_URL_CORE__  = "${urlUiExtjsCore}";
		__LANGUAGE__ = "${session.language}"; 	
	</script>
	<script type="text/javascript" src="${ urlUiExtjsCore }/src/core/globals.js" ></script>	
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
        
	<c:if test="${sysCfg_workingMode == 'dev'}">
		<%@ include file="_includes_dev.jspf" %>	
	</c:if>
	<c:if test="${sysCfg_workingMode == 'prod'}">
		<%@ include file="_includes_prod.jspf" %>	
	</c:if>
	
	<%@ include file="_dnet_params.jspf" %> 
	
	<script type="text/javascript" src="${urlUiExtjs}/${bundle}/src/frame/${itemSimpleName}.js"></script>
	
	<script type="text/javascript">
  		if(document && document.getElementById('n21-loading-msg')) {
  	  		document.getElementById('n21-loading-msg').innerHTML = Dnet.translate("msg", "initialize")+' ${item}...';
  	  	}
	</script>
    
 	<script>
	var theFrameInstance = null;
	var __theViewport__ = null;
    Ext.onReady(function(){

    	<%@ include file="_on_ready.jspf" %>
    	
     	var cfg = { layout:"border"	 	     			  
         	    ,items: [{					      	 
         	        xtype:"${item}"	
         	      	,region:"center"
         	        ,layout:"fit"
         	        ,border: false
         	        ,split: true  
         	       ,listeners:{ 
        				afterrender : { fn: function(p) { theFrameInstance = this; } }
        			}  	         
         	      }	]};
    	__theViewport__ = new Ext.Viewport(cfg);
    	//__theViewport__.doLayout(); 
	});

    <%@ include file="_loading_mask_remove.jspf" %>
    
  </script>
</body> 
</html>