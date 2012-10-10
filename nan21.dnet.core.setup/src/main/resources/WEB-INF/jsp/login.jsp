<html>
<title>DNet eBusiness Suite</title>
<head>
  <link rel="stylesheet" type="text/css" href="../webapp/resources/css/style.css"/>
 
</head>
<body>

  <br/><br/><br/>

<table align=center style='vertical-align:middle;align:center'>
<tr>
	<td>
        <a href="ui/extjs"><IMG style="border:0px solid #ccc;"  src="../webapp/resources/images/logo.png" ></a>
	</td>
	<td style='font-family:arial,verdana;font-size:14px;'>
        	Open source ERP / CRM / HRM
	</td>
</tr>
<tr>
	<td style='border-top:1px solid gray;' colspan=2> &nbsp;</td>
</tr>
<tr>
	<td colspan=2 class="text" align="center" > <h2>Please sign-in to configure application components.</h2> </td>
</tr>
<tr>
	<td colspan=2 style='padding:10px;'>
		<table width='100%'  >
            <tr>
			<td align=center class="text">
					<img alt="" src="../webapp/resources/images/key.gif">	 
			</td> 
			<td style='padding-left:20px;font-family:arial,verdana;font-size:11px;'>
				 <form name="login" action="doLogin" method="post">
                    <table cellspacing=5 cellpadding=0 >
                    	   <tr>
						   	   <td class='label'>User</td>
						   	   <td> <input name='user' class='field'></td>
						   </tr>
						   <tr>
						   	   <td class='label'>Password</td>
						   	   <td> <input name='password' class='field' type="password" ></td>
						   </tr>						 
						   <tr>
						   	   <td></td>
						   	   <td> <input name="save" class='button' type="button" value="Sign in" onClick="javascript:doLogin();" ></td>
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
	  Copyright &copy; 2010-2012 Nan21 Electronics SRL. All Rights Reserved.
	</td>
</tr>
</table>
<script>
function doLogin() {
	  if (checkFields()) {
		  document.forms['login'].save.disabled=true;
		  document.forms['login'].submit();
	   }
  }
function checkFields() {
	if (document.forms['login'].user.value == '')
	  {
		alert('Enter your username.');
		document.forms['login'].user.focus();
		return false;
	  }
	if (document.forms['login'].password.value == '')
	  {
		alert('Enter your password.');
		document.forms['login'].password.focus();
		return false;
	  }	 
	return true;
}
</script>
</body>
</html>