Dnet = {

	 name : "DNet"
	,version : '0.0.01'
    ,versionInfo : {
         major : 0
    	,minor : 0
        ,patch : 0
    }


	// base urls 
	,hostUrl: null
	,url: null
	,dsUrl: null     //  tx/java/ds
	,rpcUrl: null   //  tx/java/rpc
	,asgnUrl: null   //  tx/java/asgn
	,wfUrl: null     //  workflow
	,uiUrl: null
	,sessionUrl : null
	
	,staticResourceUrlCore: null
	,staticResourceUrlModules: null
	
	,staticResourceUrlCoreI18n: null
	,staticResourceUrlModulesI18n: null
	
 
	 // configuration variables
	,config : {

	},

	DATE_FORMAT 		: 'Y-m-d',
	TIME_FORMAT 		: 'H:i',
	DATETIME_FORMAT 	: 'Y-m-d H:i',
	DATETIMESEC_FORMAT 	: 'Y-m-d H:i:s',
	MONTH_FORMAT 		: 'Y-m',
	MODEL_DATE_FORMAT 	: "Y-m-d\\TH:i:s",
	DATE_ALTFORMATS 	: "j|j.n|d|d.m",
	
	THOUSAND_SEP 		: ',',
	DECIMAL_SEP 		: '.',
	 
	numberFormats : null,
	
	initFormats: function() {
		Ext.util.Format.decimalSeparator = this.DECIMAL_SEP;
		Ext.util.Format.thousandSeparator = this.THOUSAND_SEP;
		this.numberFormats = new Ext.util.MixedCollection();
		this.numberFormats.add(0, "0,000");
		for(var i=1; i < 6;i++) {
			this.numberFormats.add(i, "0,000."+Ext.util.Format.leftPad("0",i,"0"));
		}		
	},
	
	getNumberFormat: function(decimals) {
		if (this.numberFormats == null) {
			this.initFormats();
		}
		return this.numberFormats.get(decimals);
	},
	

    dataFormat: {
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
	    ,ORDERBY    : "orderBy"
		        	
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
             ,logout : this.sessionUrl +'/doLogout'
             ,lock : this.sessionUrl +'?action=lock'
             ,unlock : this.sessionUrl +'?action=unlock'
             ,changePassword : this.sessionUrl +'?action=changePassword'
             ,userSettings : this.sessionUrl +'?action=userSettings'
        };
	}
   	
   	,wfProcessDefinitionAPI: function(processDefinitionId) {
   		return {
   			 form : this.wfUrl + '/process-definition/'+processDefinitionId+'/form'
   			,diagram : this.wfUrl + '/process-definition/'+processDefinitionId+'/diagram'
   			,xml : this.wfUrl + '/process-definition/'+processDefinitionId+'/xml'
   			,properties : this.wfUrl + '/process-definition/'+processDefinitionId+'/properties'  
   		};
   	}
   	
	,wfProcessInstanceAPI: function(processInstanceId) {
   		return {
   			 start : this.wfUrl + '/process-instance/start'
   			,diagram : this.wfUrl + '/process-instance/'+processInstanceId+'/diagram'
   		};
   	}
	
	,wfTaskAPI: function(taskId) {
   		return {
   			form : this.wfUrl + '/task/'+taskId+'/form'   
   			,complete : this.wfUrl + '/task/'+taskId+'/complete'
   			,properties : this.wfUrl + '/task/'+taskId+'/properties'   
   		};
   	}
	
	,wfDeploymentAPI: function(deploymentId) {
   		return {
   			destroy : this.wfUrl + '/deployment/delete'   			 
   		};
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
        };
	}
    
    ,asgnLeftAPI: function (resource, format) {
	   return {
	             read : this.asgnUrl +'/'+resource+'.'+format+'?action=findLeft'
	            ,exportdata : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,create : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,update: this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,destroy: this.asgnUrl +'/'+resource+'.'+format+'?action='

	        };
	}
    
    ,asgnRightAPI: function (resource, format) {
	   return {
	            read : this.asgnUrl +'/'+resource+'.'+format+'?action=findRight'
	            ,exportdata : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,create : this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,update: this.asgnUrl +'/'+resource+'.'+format+'?action='
	            ,destroy: this.asgnUrl +'/'+resource+'.'+format+'?action='

	        };
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
	   
	,doImport: function(resourseList) {
		var list = Ext.Array.unique(resourseList);
		for(var i=0; i<list.length;i++) {
			if (!Ext.isEmpty(list[i])) {
				var rd = this.describeResource(list[i]);
				document.write('<'+'scr'+'ipt type="text/javascript" src="'+Dnet.staticResourceUrlModules+'/'+rd.bundle+'/webapp/js/'+rd.type+'/'+rd.name+'.js"></script>');
				if(rd.type=="ds") {
					// old one loading from bundle
					//document.write('<'+'scr'+'ipt type="text/javascript" src="'+Dnet.i18nResourceUrl+'/'+rd.bundle+'/resources/locale/'+__LANGUAGE__+'/'+rd.type+'/'+rd.name+'.js"></script>');
					// new one loading from the i18n project
					document.write('<'+'scr'+'ipt type="text/javascript" src="'+Dnet.staticResourceUrlModulesI18n+'/'+__LANGUAGE__+'/'+rd.bundle+'/'+rd.type+'/'+rd.name+'.js"></script>');
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
		if (item.paramIndex != undefined && mrb != null && mrb[ item.paramIndex+'__lbl']) {				
			item.fieldLabel = mrb[ item.paramIndex+'__lbl'];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.fieldLabel = Dnet.translate("ds",item.dataIndex || item.paramIndex); 
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
	
	,createBooleanStore: function() {
		return Ext.create('Ext.data.Store', {
			fields : [ "bv", "tv" ],
			data : [{
				"bv" : true,
				"tv" : Dnet.translate("msg", "bool_true")
			}, {
				"bv" : false,
				"tv" : Dnet.translate("msg", "bool_false")
			}]
		});
	}
	
	
	, doWithGetResult: function(url, params, fn, scope ) {
		Ext.Ajax
				.request( {
					url : url,
					method : "GET",
					params : params,
					success : function(response, options) {
						var r = Ext.decode( response.responseText );
						fn.call(scope || window, r, response,  options);
					},
					failure : function(response, options) {
						try {
							Ext.Msg.hide();
						}catch(e)  {							
						}
						dnet.core.dc.AbstractDc.prototype.showAjaxErrors(response, options)
					},
					scope : scope 					 
				});
	} 
};


