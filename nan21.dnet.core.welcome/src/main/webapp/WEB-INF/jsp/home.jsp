<html>
<title>DNet eBusiness Suite</title>
<head>


<style>
  .label{ font-family:arial,verdana;font-size:12px; border-bottom:1px solid gray; }
  .field{ font-family:arial,verdana; font-size:12px; padding:2px; border:1px solid gray; width:130px; }
</style>

</head>
<body>

  <br/><br/><br/>

<table align=center style='vertical-align:middle;align:center'>
<tr>
	<td>
        <a href="ui/extjs"><IMG style="border:0px solid #ccc;"  src="resources/images/logo.png" ></a>
	</td>
	<td style='font-family:arial,verdana;font-size:14px;'>
        	Open source Human Resources & Customer Relationships Management software
	</td>
</tr>
<tr>
	<td style='border-top:1px solid gray;' colspan=2> &nbsp;</td>
</tr>
<tr>
	<td colspan=2 style='padding:10px;'>
		<table width='100%'  >
            <tr>
			<td align=center>

		       	<IMG style="border:0px solid #ccc;"  src="resources/images/key.gif" >
			</td>
			<td style='padding-left:20px;font-family:arial,verdana;font-size:11px;'>
				 <form name="login">
                    <table cellspacing=5 cellpadding=0 >
                    	   <tr>
						   	   <td class='label'>User</td>
						   	   <td> <input name='user' class='field' disabled value="admin"></td>
						   </tr>
						   <tr>
						   	   <td class='label'>Password</td>
						   	   <td> <input name='password' class='field' disabled type="password" value="admin"></td>
						   </tr>
						   <tr>
						   	   <td class='label'>Client</td>
						   	   <td> <input name='client' class='field' disabled value="SYS"></td>
						   </tr>
						   <tr>
						   	   <td class='label'></td>
						   	   <td> <input name="save" class='button' type="button" value="Sign in" onClick="javascript:DoLogin();" ></td>
						   </tr>
                    </table>
				 </form>
			</td>
		</tr>
		</table>


	</td>

</tr>
<tr>
	<td colspan=2> &nbsp;</td>
</tr>
<tr>
	<td style='border-top:1px solid gray;font-family:arial,verdana;font-size:11px;' colspan=2><br>
	  Copyright &copy; 2010-2011 Nan21 Electronics SRL. All Rights Reserved.
	</td>
</tr>
</table>
<script>
function DoLogin() {
	  if (checkFields()) {
		 window.location.href='/nan21.dnet.core.web';
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
	if (document.forms['login'].client.value == '')
	  {
		alert('Enter client code.');
		document.forms['login'].client.focus();
		return false;
	  }
	return true;
}
</script>
</body>
</html>