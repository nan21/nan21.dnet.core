
//TODO: clean-up here !!!

//function getProtocolAPI(resource, format) {
//   return {
//            read :'tx/java/ds/'+resource+'.'+format+'?action=find',
//            export1 : 'tx/java/ds/'+resource+'.'+format+'?action=export',
//            create : 'tx/java/ds/'+resource+'.'+format+'?action=insert',
//            update: 'tx/java/ds/'+resource+'.'+format+'?action=update',
//            destroy: 'tx/java/ds/'+resource+'.'+format+'?action=delete'
//
//        }
//}
//
//function getProtocolAPI_AsgnLeft(resource, format) {
//   return {
//            read : 'tx/java/asgn/'+resource+'.'+format+'?action=findLeft',
//            export1 : 'tx/java/asgn/'+resource+'.'+format+'?action=export',
//            create : 'tx/java/asgn/'+resource+'.'+format+'?action=insert',
//            update: 'tx/java/asgn/'+resource+'.'+format+'?action=update',
//            destroy: 'tx/java/asgn/'+resource+'.'+format+'?action=delete'
//        }
//}
//
//function getProtocolAPI_AsgnRight(resource, format) {
//   return {
//            read : 'tx/java/asgn/'+resource+'.'+format+'?action=findRight',
//            export1 : 'tx/java/asgn/'+resource+'.'+format+'?action=export',
//            create : 'tx/java/asgn/'+resource+'.'+format+'?action=insert',
//            update: 'tx/java/asgn/'+resource+'.'+format+'?action=update',
//            destroy: 'tx/java/asgn/'+resource+'.'+format+'?action=delete'
//        }
//}

dnet.core.base.RequestParamFactory = {

	findRequest : function(filter) {
		var p = {};
		p[Dnet.requestParam.START] = 0;
		p[Dnet.requestParam.SIZE] = 30;
		p[Dnet.requestParam.FILTER] = filter || {};
		return p;
	}
};

dnet.core.base.UrlBuilder = {

	baseUrl : function(pDc, pFormat) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl_(o);
	}

	// private
	,
	_buildUrl_ : function(o) {
		if (!(o[__Http__.REQUEST_PARAM_RESOURCE_TYPE]
				&& o[__Http__.REQUEST_PARAM_RESOURCE_NAME] && o[__Http__.REQUEST_PARAM_DATA_FORMAT])) {
			alert("Invalid URL builder request! Missing one of: resource-type, resource-name, data-format");
			return;
		}
		var url = __SERVER_DOMAIN_URL__ + "/dnet";
		if (o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] == __Http__.RESOURCE_TYPE_LOV) {
			url += __PATH_FOR_LOV__;
		}
		if (o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] == __Http__.RESOURCE_TYPE_DC) {
			url += __PATH_FOR_DC__;
		}
		url += "/" + o[__Http__.REQUEST_PARAM_RESOURCE_NAME] + "."
				+ o[__Http__.REQUEST_PARAM_DATA_FORMAT] + "?";

		var i = 0;
		for ( var p in o) {
			if (p != __Http__.REQUEST_PARAM_RESOURCE_TYPE
					&& p != __Http__.REQUEST_PARAM_RESOURCE_NAME
					&& p != __Http__.REQUEST_PARAM_DATA_FORMAT) {
				url += (i > 0) ? "&" : "";
				url += p + "=" + o[p];
				i++;
			}
		}

		return url;
	}

	,
	urlFetch : function(pDc, pFormat) {
		return this.urlFetchDc(pDc, pFormat);
	},
	urlFetchDc : function(pDc, pFormat) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_FETCH;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl(o);
	},
	urlFetchLov : function(pLov, pFormat) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_LOV;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pLov;
		o[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_FETCH;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl(o);
	}

	,
	urlExport : function(pDc, pFormat, pOptions) {
		return this.urlExportDc(pDc, pFormat, pOptions);
	}

	,
	urlExportDc : function(pDc, pFormat, pOptions) {
		var o = pOptions || {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_EXPORT;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl(o);
	}

	,
	urlInsert : function(pDc, pFormat) {
		return this.urlSave(pDc, pFormat, true);
	},
	urlUpdate : function(pDc, pFormat) {
		return this.urlSave(pDc, pFormat, false);
	},
	urlSave : function(pDc, pFormat, pIsInsert) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_ACTION] = (pIsInsert) ? __Http__.REQUEST_PARAM_ACTION_INSERT
				: __Http__.REQUEST_PARAM_ACTION_UPDATE;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl(o);
	}

	,
	urlDelete : function(pDc, pFormat, pIsInsert) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_DELETE;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		return this._buildUrl(o);
	}

	,
	urlService : function(pDc, pFormat, pServiceType, pServiceName) {
		var o = {};
		o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] = __Http__.RESOURCE_TYPE_DC;
		o[__Http__.REQUEST_PARAM_RESOURCE_NAME] = pDc;
		o[__Http__.REQUEST_PARAM_ACTION] = __Http__.REQUEST_PARAM_ACTION_CUSTOM;
		o[__Http__.REQUEST_PARAM_CUSTOM_ACTION] = pServiceName;
		o[__Http__.REQUEST_PARAM_DATA_FORMAT] = pFormat;
		o[__Http__.REQUEST_PARAM_CONTROL] = pServiceType;

		return this._buildUrl(o);
	}

	// private
	,
	_buildUrl : function(o) {
		if (!(o[__Http__.REQUEST_PARAM_RESOURCE_TYPE]
				&& o[__Http__.REQUEST_PARAM_RESOURCE_NAME] && o[__Http__.REQUEST_PARAM_DATA_FORMAT])) {
			alert("Invalid URL builder request! Missing one of: resource-type, resource-name, data-format");
			return;
		}
		var url = __SERVER_DOMAIN_URL__;
		if (o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] == __Http__.RESOURCE_TYPE_LOV) {
			url += __PATH_FOR_LOV__;
		}
		if (o[__Http__.REQUEST_PARAM_RESOURCE_TYPE] == __Http__.RESOURCE_TYPE_DC) {
			url += __PATH_FOR_DC__;
		}
		url += "/" + o[__Http__.REQUEST_PARAM_RESOURCE_NAME] + "."
				+ o[__Http__.REQUEST_PARAM_DATA_FORMAT] + "?";

		var i = 0;
		for ( var p in o) {
			if (p != __Http__.REQUEST_PARAM_RESOURCE_TYPE
					&& p != __Http__.REQUEST_PARAM_RESOURCE_NAME
					&& p != __Http__.REQUEST_PARAM_DATA_FORMAT) {
				url += (i > 0) ? "&" : "";
				url += p + "=" + o[p];
				i++;
			}
		}

		return url;
	}

};
