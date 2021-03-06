<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>${title}</title>
<script type="text/javascript">
	__LANGUAGE__ = "${shortLanguage}";
	__THEME__ = "${theme}";
	${constantsJsFragment}
</script>
<script type="text/javascript" src="${ urlUiExtjsCore }/js/globals.js"></script>
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

	<!-- Extjs  -->

	<link rel="stylesheet" type="text/css"
		href="${urlUiExtjsThemes}/resources/css/ext-all-${theme}.css" />
	<script type="text/javascript"
		src="${urlUiExtjsLib}/js/ext-all-debug.js"></script>

	<script type="text/javascript" src="${urlUiExtjsCore}/js/Dnet.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/extjs-extend.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/extjs-ux-extend.js"></script>

	<!-- DNet locale -->
	<script type="text/javascript"
		src="${urlUiExtjsCoreI18n}/${shortLanguage}/Dnet.js"></script>


	<!-- DNet framework -->

	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/base/Application.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/base/Session.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/base/TemplateRepository.js"></script>

	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/Portal.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/Portlet.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/PortalPanel.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/PortalDropZone.js"></script>
	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/PortalColumn.js"></script>

	<script type="text/javascript"
		src="${urlUiExtjsCore}/js/dnet/core/dashboard/portlet/DNetFilesSF.js"></script>

	<%@ include file="_dnet_params.jspf"%>

	<script type="text/javascript">
		if (document && document.getElementById('n21-loading-msg')) {
			document.getElementById('n21-loading-msg').innerHTML = Dnet
					.translate("msg", "initialize")
					+ ' ${item}...';
		}
	</script>

	<script>
		Ext.onReady(function() {
			Ext.create('dnet.core.dashboard.Portal');
		});
	<%@ include file="_loading_mask_remove.jspf" %>
		
	</script>
	<span id="app-msg" style="display: none;"></span>
</body>
</html>