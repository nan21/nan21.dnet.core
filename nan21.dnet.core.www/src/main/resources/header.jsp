<%@ page session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="snaps" uri="http://www.eclipse.org/virgo/snaps" %>
<html>
<head>
	<title>DNet eBusiness Suite</title>
	<link rel="shortcut icon" href="<c:url value="/images/favicon.ico"/>" />

	<link rel="stylesheet" href="<c:url value="/resources/css/main.css"   />" type="text/css" />
	<link rel="stylesheet" href="<c:url value="/styles/local.css"  />" type="text/css" />
	<link rel="stylesheet" href="<c:url value="/styles/print.css"  />" type="text/css" media="print" />
	
	<script src="http://www.dnet-ebusiness-suite.com/www/pub/skins/dnet/js/jquery-1.4.2.js" type="text/javascript"></script>
	<script type="text/javascript" src="http://www.dnet-ebusiness-suite.com/www/pub/skins/dnet/js/jquery.nivo.slider.pack.js"></script>
	<script type="text/javascript" src="http://www.dnet-ebusiness-suite.com/www/pub/skins/dnet/js/jquery.easing.1.3.js"></script>
 		 
</head>

<body>
 
<div class="main">
 
 <div id="wrapper-header"> <!-- #wrapper-header -->

	<div class="nav"><!-- top nav -->
		<div class="menu">
			<ul>
				<li><a href="/nan21.dnet.core.www">Home</a></li>
				<li><a href="#">Company</a></li>
				<li><a href="#">Contact Us</a></li>
				<li><a href="#">Help</a></li>
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
  