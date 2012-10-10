<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" %><%-- 
--%><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><%-- 
--%><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %><%-- 
--%><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %><%-- 
--%>
<html>
	<title>DNet eBusiness Suite</title>
	
<head>
	<link rel="stylesheet" type="text/css" href="../resources/css/style.css"/>
</head>
<body> 

  <br/><br/><br/> 

<table align=center style='vertical-align:middle;align:center'>
<tr>
	<td colspan=2 style='padding:10px;'>
	</td>
</tr>
<tr>
	<td colspan=2 style='padding:10px;width:800px;'>
		You have successfully configured the application components.
		<br> 
		<a href="doLogout">Go to application</a> 
	</td>
</tr>
<tr>
	<td colspan=2 style="text-align:center;color:red;"> &nbsp; ${error } &nbsp;</td>
</tr>
 
</table>
</body>
 

</html>
