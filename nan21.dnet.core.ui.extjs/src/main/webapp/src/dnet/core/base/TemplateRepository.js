
dnet.core.base.TemplateRepository = {                                                                                                                                                                                  


   HOMEPANEL_FOOTER: "<div style='width:100%;'>"+                                                                                                                                                                           
            "<span style='float:left;'> Powered by  <a href='http://www.dnet-ebusiness-suite.com' target=_blank >DNet eBusiness Suite</a> &copy 2010-2012 Nan21 Electronics s.r.l. </span>"+                                                                 
         		"</div>"

   ,APPLICATION_HOME :
         "<table width='100%' border='0' align=center cellpadding='0' cellspacing='0' style='font-family: arial, sans-serif;line-height: 140%;font-size:10pt;'>"
       // +"<tr><td><img src='resource/images/plane_blue_apps.jpg' width='500px' vspace='0' border='0' alt='top_newsletter' title='Image' /></td></tr>"
        +"<tr><td><h2 style='text-align: left;font-family: arial, sans-serif;font-size:16pt;margin-top: 20px;' > {dnetName} </h2> </td></tr>"
        +"<tr><td><h5 style='text-align: left;font-family: arial, sans-serif;font-size:10pt;margin-top: 5px;' > Version: {dnetVersion} </h5> </td></tr>"
        +"<tr><td ><br>"
       
        +"  <ul>"
        +"  <li> Open source ERP / CRM / HRM</li>"
        +"  </ul>"
        + " <br><a href='http://www.dnet-ebusiness-suite.com' target=_blank>www.dnet-ebusiness-suite.com</a>"
        +"</td></tr>"
        +"</table>"
  ,APPLICATION_ABOUT_BOX:
         "<table width='100%' border='0' align=center cellpadding='0' cellspacing='0' style='font-family: arial, sans-serif;line-height: 140%;font-size:10pt;'>"
       // +"<tr><td><img src='resource/images/plane_blue_apps.jpg' width='500px' vspace='0' border='0' alt='top_newsletter' title='Image' /></td></tr>"
        +"<tr><td><h2 style='text-align: left;font-family: arial, sans-serif;font-size:16pt;margin-top: 20px;' > <br>{dnetName} </h2> </td></tr>"
        +"<tr><td><h5 style='text-align: left;font-family: arial, sans-serif;font-size:10pt;margin-top: 5px;' > Version: {dnetVersion} </h5> </td></tr>"
        +"<tr><td >"
        +"  <br>Open source software with HRM / CRM functionalities."
      	+"  </td></tr>"
		+" <tr><td > <br>Website:  <a href='http://www.dnet-ebusiness-suite.com' target=_blank>www.dnet-ebusiness-suite.com</a> </td> </tr>"
        +"  </td></tr>"
        +"</table>"
  ,ABOUT_DASHBOARD : "" +
  		"<div>Dashboard is currently in a prototype phase. <br> It will allow to include widgets related to features important for each user in his/her daily work.</div>"      
  ,APPLICATION_HOME_CR : "<br><br><br><table width='600' border='0' align=center cellpadding='0' cellspacing='0'><tr><td><h1 style='font-size:16px;'>Welcome to Component Repository</h1></td></tr></table>"
  
  ,get: function(t) { return new Ext.Template(t,{compiled:true} );}
};                                                                                                                                                                                                                            
                                                                                                                                                                                                                               
                                                                                                                                                                                                                               