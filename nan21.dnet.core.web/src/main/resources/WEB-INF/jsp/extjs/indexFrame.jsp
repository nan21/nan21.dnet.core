<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>${title}</title>
<script type="text/javascript">
	__ITEM__ = "${item}";
	__LANGUAGE__ = "${shortLanguage}";
	__THEME__ = "${theme}";
	${constantsJsFragment}
</script>
<script type="text/javascript" src="${urlUiExtjsCore}/js/globals.js"></script>
<script type="text/javascript">
	checkAndStart();
	__checkAuthToken();
</script>

<link rel="stylesheet" type="text/css"
	href="${ urlUiExtjsThemes }/resources/css/dnet.css" />
</head>
<body>

	<%@ include file="_loading_mask.jspf"%>

	<script type="text/javascript">
		if (document && document.getElementById('n21-loading-msg')) {
			document.getElementById('n21-loading-msg').innerHTML = 'Loading...';
		}
	</script>

	<c:if test="${sysCfg_workingMode == 'dev'}">
		<%@ include file="_includes_dev.jspf"%>
	</c:if>
	<c:if test="${sysCfg_workingMode == 'prod'}">
		<%@ include file="_includes_prod.jspf"%>
	</c:if>

	<%@ include file="_dnet_params.jspf"%>

	<c:if test="${sysCfg_workingMode == 'dev'}">
		<c:forEach var="_include" items="${frameDependenciesTrl}">
			<script type="text/javascript" src="${_include}"></script>
		</c:forEach>
		<c:forEach var="_include" items="${frameDependenciesCmp}">
			<script type="text/javascript" src="${_include}"></script>
		</c:forEach>
	</c:if>
	<c:if test="${sysCfg_workingMode == 'prod'}">
		<script type="text/javascript"
			src="${deploymentUrl}/ui/extjs/frame/${bundle}/${shortLanguage}/${itemSimpleName}.js"></script>
		<script type="text/javascript"
			src="${deploymentUrl}/ui/extjs/frame/${bundle}/${itemSimpleName}.js"></script>	
	</c:if>

	${extensions}

	<script type="text/javascript">
		if (document && document.getElementById('n21-loading-msg')) {
			document.getElementById('n21-loading-msg').innerHTML = Dnet
					.translate("msg", "initialize")
					+ ' ${item}...';
		}
	</script>

	<script>
		var theFrameInstance = null;
		var __theViewport__ = null;
		Ext.onReady(function() {
			if (getApplication().getSession().useFocusManager) {
				Ext.FocusManager.enable(true);
			}
	<%@ include file="_on_ready.jspf" %>
		var frameReports = [];

			${extensionsContent}

			var cfg = {
				layout : "fit",
				xtype : "container",
				items : [ {
					xtype : "${item}",
					border : false,
					_reports_ : frameReports,
					listeners : {
						afterrender : {
							fn : function(p) {
								theFrameInstance = this;
							}
						}
					}
				} ]
			};
			__theViewport__ = new Ext.Viewport(cfg);
		});
	<%@ include file="_loading_mask_remove.jspf" %>
		
	</script>
</body>
</html>