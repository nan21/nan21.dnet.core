<%@ page session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="snaps" uri="http://www.eclipse.org/virgo/snaps"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<title>DNet eBusiness Suite</title>
	</head>
<body>

<div style="width: 600px; margin: 0 auto;">

<div style="margin-top: 200px auto; padding: 50px;"><snaps:snaps
	var="snaps">
	<c:forEach var="snap" items="${snaps}">
		<c:if test="${snap.contextPath ne '/styles'}">
			<table cellpadding=0 cellspacing=0>
				<tr>
					<td valign="middle"><img
						src="resources/images/${snap.properties['link.icon']}" /></td>
					<td><a
						href="<c:url value="${snap.contextPath}${snap.properties['link.path']}"/>">
					<h3
						style="color: #333; font-family: tahoma, helvetica; font-size: 16px font-weight : bold; padding: 0 0 0 10px;">${snap.properties['link.text']}</h3>
					</a>
					<p
						style="font-family: helvetica, tahoma; color: #333; font-size: 13px; padding-left: 10px;">${snap.properties['link.description']}</p>
					</td>
				</tr>

			</table>
		</c:if>
	</c:forEach>
</snaps:snaps></div>

</div>
<!-- end of top nav -->


</body>
</html>