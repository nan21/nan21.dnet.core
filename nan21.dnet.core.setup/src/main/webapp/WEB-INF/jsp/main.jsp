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
	<td style='border-top:1px solid gray;' colspan=2> &nbsp;</td>
</tr>
<tr>
	<td colspan=2 style='padding:10px;width:800px;'>
		 
		<table width='100%'  >
          <tr>
			<td class="title" >
				<b><u>Current step:</u></b> ${current_title}
			</td> 
			<td class="text">
				<b><u>Target:</u></b><br> ${current_bundle}
			</td> 
		  </tr>
		   <tr>
			<td class="text" colspan=2 >
				<br><b><u>Description:</u></b> ${current_description}
			</td> 
		  </tr>
		  <tr>
		   	   <td class='label' colspan=2 >&nbsp;</td>		   	    
		   </tr>	
		  <tr>
			<td style='padding-left:20px;font-family:arial,verdana;font-size:11px;' colspan=2>
				 
				 
				 <form name="frm" action="doSetup" method="post">
				 <input type="hidden" name="taskId" value="${taskId}"> 
				 <input type="hidden" name="bundleId" value="${bundleId}"> 
                    <table cellspacing=5 cellpadding=0 width="100%" >
                    <c:forEach items="${currentTask.params}" var="item" > 
				 
						<tr>
					   	   <td class='label' >  <c:out value='${item.title }'/> : <br>${item.description}</td>
					   	   
					   	   <td width=150  style="vertical-align:bottom;">
					   	   <c:if test="${item.fieldType=='textfield'}">
					   	   	<input name='${paramPrefix}${item.name}' class='field' value="${item.value}" >
					   	   </c:if>
					   	   <c:if test="${item.fieldType=='checkbox'}">
					   	   	<input type="checkbox" name='${paramPrefix}${item.name}'   >
					   	   </c:if> 
					   	   </td>
					   	   <td class='text' ><c:if test="${item.required==true}">Required </c:if></td>					   	   
					   </tr>
				</c:forEach>
				  
					    <tr>
					   	   <td class='label' colspan=3 >&nbsp;</td>		   	    
					   </tr>						 
					   <tr>					   	  
					   	   <td colspan=3> <input name="save" class='button' type="button" onclick="javascript:doSave();" value="Continue"></td>
					   </tr>
                    </table>
				 </form>
			</td>
			
		  </tr>
		   
		</table>
	</td>
</tr>
<tr>
	<td colspan=2 style="text-align:center;color:red;"> &nbsp; ${error } &nbsp;</td>
</tr>
<tr>
	<td style='border-top:1px solid gray;font-family:arial,verdana;font-size:11px;' colspan=2><br>
	  Copyright &copy; 2010-2011 Nan21 Electronics SRL. All Rights Reserved.
	</td>
</tr>
</table>
</body>
<script>
function doSave() {
	  if (checkFields()) {
		  document.forms['frm'].save.disabled=true;
		  document.forms['frm'].submit();
	   }
  }
function checkFields() {
	<c:forEach items="${currentTask.params}" var="item" > 
	if (document.forms['frm'].${paramPrefix}${item.name}.value == '')
	  {
		alert('Enter value for ${item.title}.');
		document.forms['frm'].${paramPrefix}${item.name}.focus();
		return false;
	  }
  
</c:forEach>
	return true;
}
</script>

</html>
