<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="snaps" uri="http://www.eclipse.org/virgo/snaps" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<head>
	<title>DNet eBusiness Suite</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="shortcut icon" href="<c:url value="/images/favicon.ico"/>" />

	<link rel="stylesheet" href="<c:url value="/resources/css/main.css"   />" type="text/css" />
	
	<script src="http://cdn.jquerytools.org/1.2.6/full/jquery.tools.min.js"></script>
	 
	<script src="/nan21.dnet.core.www/resources/jquery-lightbox/js/jquery.lightbox-0.5.min.js" type="text/javascript"></script>
	<link  href="/nan21.dnet.core.www/resources/jquery-lightbox/css/jquery.lightbox-0.5.css"  rel="stylesheet" type="text/css"  media="screen" />
	<!-- <script src="/nan21.dnet.core.www/resources/jquery/jquery.js" type="text/javascript"></script>
	 
	 -->
	 
	<script>
	function loadFragment( selector, url, callback) {
		$(selector).load(url, callback);
	}
	</script> 
	 
</head>

<body>


<div class="main">
 	
 <div id="wrapper-header"> <!-- #wrapper-header -->

	<div class="nav"><!-- top nav -->
		<div class="menu">
			<ul>
				<li><a href="/nan21.dnet.core.www">Home</a></li>
				<li><a href="/nan21.dnet.core.www/aboutUs.jsp">About us</a></li>
				<li><a href="/nan21.dnet.core.www/contactUs.jsp">Contact us</a></li>
				<li><a href="/nan21.dnet.core.www/help.jsp">Help</a></li>
			</ul>
		</div>
	</div><!-- end of top nav -->
	
	<div class="header"><!-- header -->
		<h1><a href="#">My Store</a></h1>
		<h4>My store description</h4>
		<!-- header image <img src="images/headerimg.jpg" width="940" height="200" alt="">-->
	</div><!-- end of header -->
	
	<div class="nav"><!-- contributions nav -->
		<div class="menu2"> 
			<ul>				
				<snaps:snaps var="snaps">
					<c:forEach var="snap" items="${snaps}">
						<c:if test="${snap.contextPath ne '/styles'}">
							<li><a href="<c:url value="${snap.contextPath}${snap.properties['link.path']}"/>">
								${snap.properties['link.text']}</a>
							</li>
						</c:if>
					</c:forEach>
				</snaps:snaps>
			</ul>
		</div>
	</div><!-- end of top nav -->  
 </div>
  <div id="wrapper-content">
 