Ext.ns('dnet.core.base');
Dnet = {

	name : "DNet",
	version : '0.0.01',
	versionInfo : {
		major : 0,
		minor : 0,
		patch : 0
	},

	/*
	 * Base URLs amd fragments:
	 * 
	 * These are provided by the server when constructing the main entry point
	 * html file.
	 * 
	 */

	hostUrl : null,
	url : null,

	/**
	 * Sub-path for a DS action. Default is tx/java/ds
	 */
	dsUrl : null,

	/**
	 * Sub-path for an RPC action. Default is tx/java/rpc
	 */
	rpcUrl : null,

	/**
	 * Sub-path for an assignment actions. Default is tx/java/asgn
	 */
	asgnUrl : null,

	/**
	 * Url to workflow rest api.
	 */
	wfUrl : null,
	uiUrl : null,

	/**
	 * Session related requests URL
	 */
	sessionUrl : null,

	staticResourceUrlCore : null,
	staticResourceUrlModules : null,

	staticResourceUrlCoreI18n : null,
	staticResourceUrlModulesI18n : null,

	moduleSubpath : '/webapp/js',

	// configuration variables
	config : {

	},

	/**
	 * Default date and time formats. They are overwritten according to the user
	 * locale settings.
	 */
	DATE_FORMAT : 'Y-m-d',
	TIME_FORMAT : 'H:i',
	DATETIME_FORMAT : 'Y-m-d H:i',
	DATETIMESEC_FORMAT : 'Y-m-d H:i:s',
	MONTH_FORMAT : 'Y-m',
	MODEL_DATE_FORMAT : "Y-m-d\\TH:i:s",
	DATE_ALTFORMATS : "j|j.n|d|d.m",

	THOUSAND_SEP : ',',
	DECIMAL_SEP : '.',

	numberFormats : null,

	DEFAULT_THEME : "gray",
	DEFAULT_LANGUAGE : "en",

	/**
	 * Creates a set of number formats up to 6 decimals according to the user
	 * locale.
	 */
	initFormats : function() {
		Ext.util.Format.decimalSeparator = this.DECIMAL_SEP;
		Ext.util.Format.thousandSeparator = this.THOUSAND_SEP;
		this.numberFormats = new Ext.util.MixedCollection();
		this.numberFormats.add(0, "0,000");
		for ( var i = 1; i < 6; i++) {
			this.numberFormats.add(i, "0,000."
					+ Ext.util.Format.leftPad("0", i, "0"));
		}
	},

	/**
	 * Creates a number format string based on the provided decimals number and
	 * the user locale.
	 */
	getNumberFormat : function(decimals) {
		if (this.numberFormats == null) {
			this.initFormats();
		}
		return this.numberFormats.get(decimals);
	},

	dataFormat : {
		HTML : "html",
		CSV : "csv",
		PDF : "pdf",
		XML : "xml",
		JSON : "json"
	},

	/**
	 * Request parameter mappings. These values must be kept in sync with the
	 * mappings at server-side.
	 * 
	 * TODO: Send these mappings in the main html page from the server to keep
	 * them in only one place.
	 */
	requestParam : {
		SORT : "orderByCol",
		SENSE : "orderBySense",
		START : "resultStart",
		SIZE : "resultSize",
		ORDERBY : "orderBy",

		SERVICE_NAME_PARAM : "rpcName",

		EXPORT_COL_NAMES : "c[export_col_names]",
		EXPORT_COL_TITLES : "c[export_col_titles]",
		EXPORT_COL_WIDTHS : "c[export_col_widths]"
	},

	asgnAction : {
		LOAD : "find",
		SELECT : "insert",
		REMOVE : "update",
		SELECTALL : "delete",
		REMOVEALL : "delete"
	},

	/**
	 * Creates the URL to load a frame.
	 */
	buildUiPath : function(uiModule, uiName, isSpecial) {
		if (isSpecial) {
			return this.uiUrl + "/spframe/" + uiModule + "/" + uiName;
		} else {
			return this.uiUrl + "/frame/" + uiModule + "/" + uiName;
		}
	},

	/**
	 * URLs for session management related requests.
	 */
	sessionAPI : function(format) {
		return {
			login : this.sessionUrl + '?action=login',
			logout : this.sessionUrl + '/doLogout',
			lock : this.sessionUrl + '?action=lock',
			unlock : this.sessionUrl + '?action=unlock',
			changePassword : this.sessionUrl + '?action=changePassword',
			userSettings : this.sessionUrl + '?action=userSettings'
		};
	},

	/**
	 * URLs for data-source (DS) related requests.
	 */
	dsAPI : function(resource, format) {
		return {
			read : this.dsUrl + '/' + resource + '.' + format + '?action=find',
			load : this.dsUrl + '/' + resource + '.' + format + '?action=find',
			exportdata : this.dsUrl + '/' + resource + '.' + format
					+ '?action=export',
			importdata : this.dsUrl + '/' + resource + '.' + format
					+ '?action=import',
			create : this.dsUrl + '/' + resource + '.' + format
					+ '?action=insert',
			update : this.dsUrl + '/' + resource + '.' + format
					+ '?action=update',
			save : this.dsUrl + '/' + resource + '.' + format + '?action=save',
			destroy : this.dsUrl + '/' + resource + '.' + format
					+ '?action=delete',
			service : this.dsUrl + '/' + resource + '.' + format
					+ '?action=rpc'
		};
	},

	/**
	 * URLs for assignment components requests for the available elements.
	 */
	asgnLeftAPI : function(resource, format) {
		return {
			read : this.asgnUrl + '/' + resource + '.' + format
					+ '?action=findLeft',
			exportdata : this.asgnUrl + '/' + resource + '.' + format
					+ '?action=',
			create : this.asgnUrl + '/' + resource + '.' + format + '?action=',
			update : this.asgnUrl + '/' + resource + '.' + format + '?action=',
			destroy : this.asgnUrl + '/' + resource + '.' + format + '?action='

		};
	},

	/**
	 * URLs for assignment components requests for the selected elements.
	 */
	asgnRightAPI : function(resource, format) {
		return {
			read : this.asgnUrl + '/' + resource + '.' + format
					+ '?action=findRight',
			exportdata : this.asgnUrl + '/' + resource + '.' + format
					+ '?action=',
			create : this.asgnUrl + '/' + resource + '.' + format + '?action=',
			update : this.asgnUrl + '/' + resource + '.' + format + '?action=',
			destroy : this.asgnUrl + '/' + resource + '.' + format + '?action='

		};
	},

	/**
	 * URLs for RPC type requests.
	 */
	rpcAPI : function(resource, fnName, format) {
		return this.rpcUrl + '/' + resource + '.' + format + '?action='
				+ fnName
	},

	/**
	 * Workflow api: Process definition
	 */
	wfProcessDefinitionAPI : function(processDefinitionId) {
		return {
			form : this.wfUrl + '/process-definition/' + processDefinitionId
					+ '/form',
			diagram : this.wfUrl + '/process-definition/' + processDefinitionId
					+ '/diagram',
			xml : this.wfUrl + '/process-definition/' + processDefinitionId
					+ '/xml',
			properties : this.wfUrl + '/process-definition/'
					+ processDefinitionId + '/properties'
		};
	},

	/**
	 * Workflow api: Process instance
	 */
	wfProcessInstanceAPI : function(processInstanceId) {
		return {
			start : this.wfUrl + '/process-instance/start',
			diagram : this.wfUrl + '/process-instance/' + processInstanceId
					+ '/diagram'
		};
	},

	/**
	 * Workflow api: Task management
	 */
	wfTaskAPI : function(taskId) {
		return {
			form : this.wfUrl + '/task/' + taskId + '/form',
			complete : this.wfUrl + '/task/' + taskId + '/complete',
			properties : this.wfUrl + '/task/' + taskId + '/properties'
		};
	},

	/**
	 * Workflow api: Deployment management
	 */
	wfDeploymentAPI : function(deploymentId) {
		return {
			destroy : this.wfUrl + '/deployment/delete'
		};
	},

	setDialogPath : function(dialogName, pathname) {
		if (pathname) {
			document.getElementById(dialogName + '_dialogPath').innerHTML = pathname;
			document.getElementById(dialogName + '_dialogNamePathSeparator').innerHTML = "/";
		} else {
			document.getElementById(dialogName + '_dialogPath').innerHTML = "";
			document.getElementById(dialogName + '_dialogNamePathSeparator').innerHTML = "";
		}
	},

	setDialogTitle : function(dialogName, title) {
		document.getElementById(dialogName + '_dialogName').innerHTML = title;
	},

	translate : function(t, k) {
		return dnet.Translation[t][k] || k;
	},

	navigationTreeMenus : {
	/*
	 * ad : { name: "mbMenuAD" , title :"AD: Administration", children: [] }
	 */
	},

	doImport : function(resourseList) {
		var list = Ext.Array.unique(resourseList);
		for ( var i = 0; i < list.length; i++) {
			if (!Ext.isEmpty(list[i])) {
				var rd = this.describeResource(list[i]);
				document.write('<' + 'scr' + 'ipt type="text/javascript" src="'
						+ Dnet.staticResourceUrlModules + '/' + rd.bundle
						+ this.moduleSubpath + '/' + rd.type + '/' + rd.name
						+ '.js"></script>');
				if (rd.type == "ds") {
					document.write('<' + 'scr'
							+ 'ipt type="text/javascript" src="'
							+ Dnet.staticResourceUrlModulesI18n + '/'
							+ __LANGUAGE__ + '/' + rd.bundle + '/' + rd.type
							+ '/' + rd.name + '.js"></script>');
				}
			}
		}
	},

	describeResource : function(artifact) {
		var rd = {};
		var t = artifact.split('/');
		rd['bundle'] = t[0];
		rd['type'] = t[1];
		rd['name'] = t[2];
		return rd;
	},

	/**
	 * Translation for a field
	 */
	translateField : function(vrb, mrb, item) {
		// check if the view has its own resource bundle
		if (vrb != undefined && vrb[item.name]) {
			item.fieldLabel = vrb[item.name];
			return true;
		}
		// try to translate it from the model's resource bundle
		if (item.dataIndex != undefined && mrb != null
				&& mrb[item.dataIndex + '__lbl']) {
			item.fieldLabel = mrb[item.dataIndex + '__lbl'];
			return true;
		}
		if (item.paramIndex != undefined && mrb != null
				&& mrb[item.paramIndex + '__lbl']) {
			item.fieldLabel = mrb[item.paramIndex + '__lbl'];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.fieldLabel = Dnet.translate("ds", item.dataIndex
				|| item.paramIndex);
	},

	/**
	 * Translation for a grid column
	 */
	translateColumn : function(vrb, mrb, item) {
		// check if the view has its own resource bundle
		if (vrb != undefined && vrb[item.name]) {
			item.header = vrb[item.name];
			return true;
		}
		// try to translate it from the model's resource bundle
		if (item.dataIndex != undefined && mrb != null
				&& mrb[item.dataIndex + '__lbl']) {
			item.header = mrb[item.dataIndex + '__lbl'];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.header = Dnet.translate("ds", item.dataIndex);
	},

	createBooleanStore : function() {
		return Ext.create('Ext.data.Store', {
			fields : [ "bv", "tv" ],
			data : [ {
				"bv" : true,
				"tv" : Dnet.translate("msg", "bool_true")
			}, {
				"bv" : false,
				"tv" : Dnet.translate("msg", "bool_false")
			} ]
		});
	},

	doWithGetResult : function(url, params, fn, scope) {
		Ext.Ajax.request({
			url : url,
			method : "GET",
			params : params,
			success : function(response, options) {
				var r = Ext.decode(response.responseText);
				fn.call(scope || window, r, response, options);
			},
			failure : function(response, options) {
				try {
					Ext.Msg.hide();
				} catch (e) {
				}
				dnet.core.dc.AbstractDc.prototype.showAjaxErrors(response,
						options)
			},
			scope : scope
		});
	}
};
