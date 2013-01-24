Ext.ns("dnet.core.base");
Dnet = {

	name : "DNet",
	version : "0.0.01",
	versionInfo : {
		major : 0,
		minor : 0,
		patch : 0
	},

	logoUrl : "http://nan21.net/logo.png",

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

	/**
	 * Url to user interface.
	 */
	uiUrl : null,

	/**
	 * Session related requests URL
	 */
	sessionUrl : null,

	staticResourceUrlCore : null,
	staticResourceUrlModules : null,

	staticResourceUrlCoreI18n : null,
	staticResourceUrlModulesI18n : null,

	moduleSubpath : "/webapp/js",

	/**
	 * configuration variables
	 */
	config : {

	},

	/**
	 * Default date and time formats. They are overwritten according to the user
	 * locale settings.
	 */
	DATE_FORMAT : Constants.EXTJS_DATE_FORMAT,
	TIME_FORMAT : Constants.EXTJS_TIME_FORMAT,
	DATETIME_FORMAT : Constants.EXTJS_DATETIME_FORMAT,
	DATETIMESEC_FORMAT : Constants.EXTJS_DATETIMESEC_FORMAT,
	MONTH_FORMAT : Constants.EXTJS_MONTH_FORMAT,
	MODEL_DATE_FORMAT : "Y-m-d\\TH:i:s", // Constants.EXTJS_MODEL_DATE_FORMAT,
	DATE_ALTFORMATS : Constants.EXTJS_ALT_FORMATS,

	THOUSAND_SEP : Constants.THOUSAND_SEPARATOR,
	DECIMAL_SEP : Constants.DECIMAL_SEPARATOR,

	numberFormats : null,

	DEFAULT_THEME : "gray",
	DEFAULT_LANGUAGE : "en",

	viewConfig : {
		BOOLEAN_COL_WIDTH : 60,
		DATE_COL_WIDTH : 80
	},

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
		HTML : Constants.DATA_FORMAT_HTML,
		CSV : Constants.DATA_FORMAT_CSV,
		PDF : Constants.DATA_FORMAT_XML,
		XML : Constants.DATA_FORMAT_XML,
		JSON : Constants.DATA_FORMAT_JSON
	},

	/**
	 * Request parameter mappings. These values must be kept in sync with the
	 * mappings at server-side.
	 * 
	 * TODO: Send these mappings in the main html page from the server to keep
	 * them in only one place.
	 */
	requestParam : {
		ACTION : Constants.REQUEST_PARAM_ACTION,
		DATA : Constants.REQUEST_PARAM_DATA,
		FILTER : Constants.REQUEST_PARAM_FILTER,
		PARAMS : Constants.REQUEST_PARAM_PARAMS,
		ADVANCED_FILTER : Constants.REQUEST_PARAM_ADVANCED_FILTER,
		SORT : Constants.REQUEST_PARAM_SORT,
		SENSE : Constants.REQUEST_PARAM_SENSE,
		START : Constants.REQUEST_PARAM_START,
		SIZE : Constants.REQUEST_PARAM_SIZE,
		ORDERBY : Constants.REQUEST_PARAM_ORDERBY,
		SERVICE_NAME_PARAM : Constants.REQUEST_PARAM_SERVICE_NAME_PARAM,
		EXPORT_TITLE : Constants.REQUEST_PARAM_EXPORT_TITLE,
		EXPORT_LAYOUT : Constants.REQUEST_PARAM_EXPORT_LAYOUT,
		EXPORT_COL_NAMES : Constants.REQUEST_PARAM_EXPORT_COL_NAMES,
		EXPORT_COL_TITLES : Constants.REQUEST_PARAM_EXPORT_COL_TITLES,
		EXPORT_COL_WIDTHS : Constants.REQUEST_PARAM_EXPORT_COL_WIDTHS,
		EXPORT_FILTER_NAMES : Constants.REQUEST_PARAM_EXPORT_FILTER_NAMES,
		EXPORT_FILTER_TITLES : Constants.REQUEST_PARAM_EXPORT_FILTER_TITLES
	},

	dsAction : {
		INFO : Constants.DS_INFO,
		QUERY : Constants.DS_QUERY,
		INSERT : Constants.DS_INSERT,
		UPDATE : Constants.DS_UPDATE,
		DELETE : Constants.DS_DELETE,
		SAVE : Constants.DS_SAVE,
		IMPORT : Constants.DS_IMPORT,
		EXPORT : Constants.DS_EXPORT,
		PRINT : Constants.DS_PRINT,
		RPC : Constants.DS_RPC
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
			login : this.sessionUrl + "?action=login",
			logout : this.sessionUrl + "/doLogout",
			lock : this.sessionUrl + "?action=lock",
			unlock : this.sessionUrl + "?action=unlock",
			changePassword : this.sessionUrl + "?action=changePassword",
			userSettings : this.sessionUrl + "?action=userSettings"
		};
	},

	/**
	 * URLs for data-source (DS) related requests.
	 */
	dsAPI : function(resource, format) {
		return {
			info : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.INFO,
			read : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.QUERY,
			load : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.QUERY,
			print : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.PRINT,
			exportdata : this.dsUrl + "/" + resource + "." + format
					+ "?action=" + this.dsAction.EXPORT,
			importdata : this.dsUrl + "/" + resource + "." + format
					+ "?action=" + this.dsAction.IMPORT,
			create : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.INSERT,
			update : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.UPDATE,
			save : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.SAVE,
			destroy : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.DELETE,
			service : this.dsUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=" + this.dsAction.RPC
		};
	},

	/**
	 * URLs for assignment components requests for the available elements.
	 */
	asgnLeftAPI : function(resource, format) {
		return {
			read : this.asgnUrl + "/" + resource + "." + format
					+ "?action=findLeft",
			exportdata : this.asgnUrl + "/" + resource + "." + format
					+ "?action=",
			create : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=",
			update : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=",
			destroy : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "="

		};
	},

	/**
	 * URLs for assignment components requests for the selected elements.
	 */
	asgnRightAPI : function(resource, format) {
		return {
			read : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=findRight",
			exportdata : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=",
			create : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=",
			update : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "=",
			destroy : this.asgnUrl + "/" + resource + "." + format + "?"
					+ this.requestParam.ACTION + "="

		};
	},

	/**
	 * URLs for RPC type requests.
	 */
	rpcAPI : function(resource, fnName, format) {
		return this.rpcUrl + "/" + resource + "." + format + "?"
				+ this.requestParam.ACTION + "=" + fnName
	},

	/**
	 * Workflow api: Process definition
	 */
	wfProcessDefinitionAPI : function(processDefinitionId) {
		return {
			form : this.wfUrl + "/process-definition/" + processDefinitionId
					+ "/form",
			diagram : this.wfUrl + "/process-definition/" + processDefinitionId
					+ "/diagram",
			xml : this.wfUrl + "/process-definition/" + processDefinitionId
					+ "/xml",
			properties : this.wfUrl + "/process-definition/"
					+ processDefinitionId + "/properties"
		};
	},

	/**
	 * Workflow api: Process instance
	 */
	wfProcessInstanceAPI : function(processInstanceId) {
		return {
			start : this.wfUrl + "/process-instance/start",
			diagram : this.wfUrl + "/process-instance/" + processInstanceId
					+ "/diagram"
		};
	},

	/**
	 * Workflow api: Task management
	 */
	wfTaskAPI : function(taskId) {
		return {
			form : this.wfUrl + "/task/" + taskId + "/form",
			complete : this.wfUrl + "/task/" + taskId + "/complete",
			properties : this.wfUrl + "/task/" + taskId + "/properties"
		};
	},

	/**
	 * Workflow api: Deployment management
	 */
	wfDeploymentAPI : function(deploymentId) {
		return {
			destroy : this.wfUrl + "/deployment/delete"
		};
	},

	setDialogPath : function(dialogName, pathname) {
		if (pathname) {
			document.getElementById(dialogName + "_dialogPath").innerHTML = pathname;
			document.getElementById(dialogName + "_dialogNamePathSeparator").innerHTML = "/";
		} else {
			document.getElementById(dialogName + "_dialogPath").innerHTML = "";
			document.getElementById(dialogName + "_dialogNamePathSeparator").innerHTML = "";
		}
	},

	setDialogTitle : function(dialogName, title) {
		document.getElementById(dialogName + "_dialogName").innerHTML = title;
	},

	/**
	 * Translate a group/key pair from the translations pack. Optionally replace
	 * place holders with given values.
	 */
	translate : function(group, key, params) {
		var v = dnet.Translation[group][key] || key;
		if (Ext.isArray(params)) {
			for ( var i = 0, len = params.length; i < len; i++) {
				v = v.replace("{" + i + "}", params[i]);
			}
		}
		return v;
	},

	navigationTreeMenus : {
	/*
	 * ad : { name: "mbMenuAD" , title :"AD: Administration", children: [] }
	 */
	},

	/**
	 * Dynamically import dependencies. Declare the dependencies in any file as
	 * a list of <bundle>/<type>/<name>. The preferred method however is to
	 * declare the dependencies in a standalone .jsdp file to be able to pack
	 * and cache them at runtime.
	 * 
	 */
	doImport : function(resourseList) {
		var list = Ext.Array.unique(resourseList);
		for ( var i = 0; i < list.length; i++) {
			if (!Ext.isEmpty(list[i])) {
				var rd = this.describeResource(list[i]);
				document.write("<" + "scr"
						+ "ipt type=\"text/javascript\" src=\""
						+ Dnet.staticResourceUrlModules + "/" + rd.bundle
						+ this.moduleSubpath + "/" + rd.type + "/" + rd.name
						+ ".js\"></script>");
				if (rd.type == "ds") {
					document.write("<" + "scr"
							+ "ipt type=\"text/javascript\" src=\""
							+ Dnet.staticResourceUrlModulesI18n + "/"
							+ __LANGUAGE__ + "/" + rd.bundle + "/" + rd.type
							+ "/" + rd.name + ".js\"></script>");
				}
			}
		}
	},

	/**
	 * Return an object representation of a resource.
	 */
	describeResource : function(artifact) {
		var rd = {};
		var t = artifact.split("/");
		rd["bundle"] = t[0];
		rd["type"] = t[1];
		rd["name"] = t[2];
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
		// try to translate it from the model"s resource bundle
		if (item.dataIndex != undefined && mrb != null
				&& mrb[item.dataIndex + "__lbl"]) {
			item.fieldLabel = mrb[item.dataIndex + "__lbl"];
			return true;
		}
		if (item.paramIndex != undefined && mrb != null
				&& mrb[item.paramIndex + "__lbl"]) {
			item.fieldLabel = mrb[item.paramIndex + "__lbl"];
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
		// try to translate it from the model"s resource bundle
		if (item.dataIndex != undefined && mrb != null
				&& mrb[item.dataIndex + "__lbl"]) {
			item.header = mrb[item.dataIndex + "__lbl"];
			return true;
		}
		// try to translate from the shared resource-bundle
		item.header = Dnet.translate("ds", item.dataIndex);
	},

	createBooleanStore : function() {
		return Ext.create("Ext.data.Store", {
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
	},

	createFilterModelFromRecordModel : function(cfg) {
		var rm = Ext.create(cfg.recordModelFqn);
		var flds = [];
		var x = rm.fields.items;
		for ( var i = 0; i < x.length; i++) {
			f = {
				name : x[i].name,
				type : x[i].type
			}
			if (f.type.type == "bool" || f.type.type == "int"
					|| f.type.type == "float") {
				f.useNull = true;
			}
			if (f.type.type == "date") {
				f.dateFormat = x[i].dateFormat;
			}
			flds[i] = f;
		}
		if (cfg != null && cfg.fields != null) {
			for ( var j = 0; j < cfg.fields; j++) {
				flds[flds.length + 1] = cfg.fields[j];
			}
		}
		var fmn = cfg.recordModelFqn + "Filter";
		Ext.define(fmn, {
			extend : 'Ext.data.Model',
			fields : flds
		});
	}

};
