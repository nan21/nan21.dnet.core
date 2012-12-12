<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
  <head>
  	<style>
	    .coltitle {
		    text-align:center;font-weight:bold;padding:4px;font-size:14px;
		}
	    .tabletitle {
		    text-align:center;font-weight:bold;padding:6px;font-size:22px;
		}
	  </style>
  </head>
  <body style="font-family:Arial;font-size:12pt;">

  <div style=" padding:4px">
        <span ><h1>Data-source: <xsl:value-of select="dsDefinition/name"/></h1></span>
  </div>

  <div style=" padding:2px">
        Model-class: <xsl:value-of select="dsDefinition/modelClass"/>
  </div>
   <div style=" padding:2px">
        Filter-class: <xsl:value-of select="dsDefinition/filterClass"/>
  </div>
  <div style=" padding:2px">
        Param-class: <xsl:value-of select="dsDefinition/paramClass"/>
  </div>

  <div style=" padding:10px">
        <table style="width:500px;" border="1" cellspacing="0">
    	     <tr><td colspan="2"  class="tabletitle">Model fields</td></tr>
		    <tr><td class="coltitle">Field Name</td><td class="coltitle">Type</td></tr>
		    <xsl:for-each select="dsDefinition/modelFields/field">
				  <tr><td><xsl:value-of select="name"/></td><td><xsl:value-of select="className"/></td></tr>
		    </xsl:for-each>
	    </table>
  </div>
   <div style=" padding:10px">
       <table style="width:500px;" border="1" cellspacing="0">
    	     <tr><td colspan="2"  class="tabletitle">Filter fields</td></tr>
		    <tr><td class="coltitle">Field Name</td><td class="coltitle">Type</td></tr>
		    <xsl:for-each select="dsDefinition/filterFields/field">
				  <tr><td><xsl:value-of select="name"/></td><td><xsl:value-of select="className"/></td></tr>
		    </xsl:for-each>
	    </table>
  </div>
  <div style=" padding:10px">
       <table style="width:500px;" border="1" cellspacing="0">
    	    <tr><td colspan="2" class="tabletitle">Param fields</td></tr>
		    <tr><td class="coltitle">Field Name</td><td class="coltitle">Type</td></tr>
		    <xsl:for-each select="dsDefinition/paramFields/field">
				  <tr><td><xsl:value-of select="name"/></td><td><xsl:value-of select="className"/></td></tr>
		    </xsl:for-each>
	    </table>
  </div>
  </body>
</html>
