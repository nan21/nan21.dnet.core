Dnet = {

	 name : "DNet"
	,version : '0.0.01'
    ,versionInfo : {
         major : 0
    	,minor : 0
        ,patch : 0
    }


	// base urls
	,hostUrl:null
	,url:null
	,dsUrl:null     //  tx/java/ds
	,rpcUrl: null   //  tx/java/rpc
	,asgnUrl:null   //  tx/java/asgn
	,wfUrl:null     //  workflow
	,uiUrl:null
	,sessionUrl : null
	,staticResourceUrl:null

 
	 // configuration variables
	,config : {

	}


    ,dataFormat: {
         HTML : "html"
		,CSV  : "csv"
		,PDF  : "pdf"
		,XML  : "xml"
		,JSON : "json"
	}
	,requestParam : {
         SORT       : "orderByCol"
        ,SENSE      : "orderBySense"
		,START      : "resultStart"
		,SIZE       : "resultSize"
		
		,SERVICE_NAME_PARAM   : "rpcName"

		,EXPORT_COL_NAMES    : "c[export_col_names]"
		,EXPORT_COL_TITLES   : "c[export_col_titles]"
		,EXPORT_COL_WIDTHS   : "c[export_col_widths]"
		//,EXPORT_GROUPBY      : "_p_export_groupby"
		//	,PRINT_LAYOUT        : "_p_print_layout"
	}

	,buildUiPath: function(uiModule, uiName, isSpecial) {
		if (isSpecial) {
           return this.uiUrl+"/spframe/"+uiModule+"/"+uiName;
		} else {
           return this.uiUrl+"/frame/"+uiModule+"/"+uiName;			 
		}
	}

	,asgnAction: {
		 LOAD :  "find"
		,SELECT : "insert"
		,REMOVE : "update"
		,SELECTALL : "delete"
		,REMOVEALL : "delete"
	}

   	,DEFAULT_THEME : "gray"
    ,DEFAULT_LANGUAGE : "en"

	,sessionAPI: function (format) {
	   return {
              login : this.sessionUrl +'?action=login'
             ,logout : this.sessionUrl +'?action=logout'
             ,lock : this.sessionUrl +'?action=lock'
             ,unlock : this.sessionUrl +'?action=unlock'
             ,changePassword : this.sessionUrl +'?action=changePassword'
        }
	}
   	,wfProcessDefinitionAPI: function(processDefinitionId) {
   		return {
   			 form : this.wfUrl + '/process-definition/'+processDefinitionId+'/form'
   			,diagram : this.wfUrl + '/process-definition/'+processDefinitionId+'/diagram'   			 
   		}
   	}
	,wfProcessInstanceAPI: function(processInstanceId) {
   		return {
   			 start : this.wfUrl + '/process-instance/start'
   			,diagram : this.wfUrl + '/process-instance/'+processInstanceId+'/diagram'
   		}
   	}
	,wfTaskAPI: function(taskId) {
   		return {
   			form : this.wfUrl + '/task/'+taskId+'/form'   
   			,complete : this.wfUrl + '/task/'+taskId+'/complete'   
   		}
   	}
	,wfDeploymentAPI: function(deploymentId) {
   		return {
   			destroy : this.wfUrl + '/deployment/delete'   			 
   		}
   	}
    ,dsAPI: function (resource, format) {
	   return {
             read : this.dsUrl +'/'+resource+'.'+format+'?action=find'
            ,load : this.dsUrl +'/'+resource+'.'+format+'?action=find'
            ,exportdata : this.dsUrl +'/'+resource+'.'+format+'?action=export'
            ,importdata : this.dsUrl +'/'+resource+'.'+format+'?action=import'
            ,create : this.dsUrl +'/'+resource+'.'+format+'?action=insert'
            ,update: this.dsUrl +'/'+resource+'.'+format+'?action=update'
            ,save: this.dsUrl +'/'+resource+'.'+format+'?action=save'
            ,destroy: this.dsUrl +'/'+resource+'.'+format+'?action=delete'
            ,service: this.dsUrl +'/'+resource+'.'+format+'?action=rpc'

        }
	}
    ,asgnLeftAPI: function (resource, format) {
	   return {
	             read : this.asgnUrl +'/'+resource+'.'+format+'?action=findLeft'
	            ,exportdata : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,create : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,update: this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,destroy: this.asgnUrl +'/'+resource+'.'+format+'?action='

	        }
	}
    ,asgnRightAPI: function (resource, format) {
	   return {
	            read : this.asgnUrl +'/'+resource+'.'+format+'?action=findRight'
	            ,exportdata : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,create : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,update: this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,destroy: this.asgnUrl +'/'+resource+'.'+format+'?action='

	        }
	}
    ,rpcAPI: function (resource, fnName, format) {
	   return this.rpcUrl +'/'+resource+'.'+format+'?action='+fnName
	}

	,setDialogPath: function(dialogName, pathname ) {
		if(pathname) {
		    document.getElementById(dialogName +'_dialogPath').innerHTML = pathname;   
		    document.getElementById(dialogName +'_dialogNamePathSeparator').innerHTML = "/";   
		 } else {
		    document.getElementById(dialogName +'_dialogPath').innerHTML = "";
		    document.getElementById(dialogName +'_dialogNamePathSeparator').innerHTML = "";   
		 } 		      
	}

	, setDialogTitle: function (dialogName, title ) { 
		document.getElementById(dialogName+'_dialogName').innerHTML = title;
	}
	, translate: function(t,k) {
		return dnet.Translation[t][k] || k;
	}
	
	,navigationTreeMenus : {
		/* ad : { name: "mbMenuAD" , title :"AD: Administration", children: [] }
		,hr: {name: "mbMenuHR" , title :"HR: Human Resources", children:[]}
		,crm: {name: "mbMenuCRM" , title :"CRM: Customer Relationships", children: []}
		,my : {name: "mbMenuMY" , title :"MY: My DNet", children: []}*/
	}
	   
	,import: function(list) {
		for(var i=0; i<list.length;i++) {
			if (!Ext.isEmpty(list[i])) {
				var rd = this.describeResource(list[i]);
				document.write('<'+'scr'+'ipt type="text/javascript" src="'+Dnet.staticResourceUrl+'/'+rd.bundle+'/src/'+rd.type+'/'+rd.name+'.js"></script>');
				if(rd.type=="ds") {
					document.write('<'+'scr'+'ipt type="text/javascript" src="'+Dnet.staticResourceUrl+'/'+rd.bundle+'/resources/locale/en/'+rd.type+'/'+rd.name+'.js"></script>');
				}
			}
		}
	}
	,describeResource: function(artifact) {
		var rd = {};		 
		var t = artifact.split('/');		 
		rd['bundle'] = t[0];
		rd['type'] = t[1];
		rd['name'] = t[2];
		return rd;	
	}
	
	
	,translateField: function(vrb, mrb, item) {
		// check if the view has its own resource bundle 
		if (vrb != undefined && vrb[item.name]) {				
			item.fieldLabel = vrb[item.name];
			return true;
		}
		//try to translate it from the model's resource bundle
		if (item.dataIndex != undefined && mrb != null && mrb[ item.dataIndex+'__lbl']) {				
			item.fieldLabel = mrb[ item.dataIndex+'__lbl'];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.fieldLabel = Dnet.translate("ds",item.dataIndex); 
	}
	,translateColumn: function(vrb, mrb, item) {
		// check if the view has its own resource bundle 
		if (vrb != undefined && vrb[item.name]) {				
			item.header = vrb[item.name];
			return true;
		}
		//try to translate it from the model's resource bundle
		if (item.dataIndex != undefined && mrb != null && mrb[ item.dataIndex+'__lbl']) {				
			item.header = mrb[ item.dataIndex+'__lbl'];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.header = Dnet.translate("ds",item.dataIndex); 
	}
	
};