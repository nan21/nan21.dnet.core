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
	<c:if test="${sysCfg_workingMode == 'dev'}">
		<%@ include file="_includes_dev.jspf" %>	
	</c:if>
	<c:if test="${sysCfg_workingMode == 'prod'}">
		<%@ include file="_includes_prod.jspf" %>	
	</c:if>
	
	<%@ include file="_dnet_params.jspf" %>
	
 	${extensions}
 	
	<script type="text/javascript">
	
  		if(document && document.getElementById('n21-loading-msg')) {
  	  		document.getElementById('n21-loading-msg').innerHTML = Dnet.translate("msg", "initialize")+' ${item}...';
  	  	}
	</script>
    
 	<script>

    Ext.onReady(function(){

    	<%@ include file="_on_ready.jspf" %>

		dnet.core.base.Session.user.code = '${userUsername}';
		dnet.core.base.Session.user.name = '${userDisplayName}';
		dnet.core.base.Session.client.code = '${userClientCode}';
		dnet.core.base.Session.client.id = '${userClientId}';
		dnet.core.base.Session.client.systemClient = ${userSystemClient};
		dnet.core.base.Session.locked = false;
		dnet.core.base.Session.roles = [${userRolesStr}];
		
		${extensionsContent}
        
      	var tr = dnet.core.base.TemplateRepository;

		__application__ = dnet.core.base.Application;
		__application__.type = "dnet";      
		__application__.menu = new dnet.core.base.ApplicationMenu({ region:"north" });
		__application__.view = new Ext.Viewport({
			 layout:'card', activeItem:0
			,forceLayout:true
			,items:[
				  { html:"" } 
			   	 ,{ padding:0
			    	,layout:'border'
				    ,forceLayout:true
				    ,items:[
				   		{	region:"center"
					   		,enableTabScroll : true
					   		,xtype:"tabpanel"
						   	,deferredRender:false
						   	,activeTab:0
						   	,plain:true
						   	,plugins: new Ext.ux.TabCloseMenu()
				   			,id:"dnet-application-view-body"
				    	    ,items:[
								{	xtype:"dnetHomePanel"
								    ,iconCls: "icon-hometab"
									,id:"dnet-application-view-home"
								 }    
							]   
						}				    	        
				    	,__application__.menu 				    	          								    	        
				    ]
				}   
				 
			]			 			  
      	});   
		
		__application__.useIframes = __USE_IFRAMES__;
		__application__.run();      
      
    });

    <%@ include file="_loading_mask_remove.jspf" %> 
    
  </script>
</body> 
</html>