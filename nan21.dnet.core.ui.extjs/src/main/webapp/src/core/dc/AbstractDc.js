Ext.ns("dnet.base");
dnet.base.AbstractDc = function(config) {
	this.ds = null;
	this.dsName = "";
	this.dcContext = null;
	this.multiEdit = false;
	this.afterStoreLoadDoDefaultSelection = true;
	this.bindedViews = null;
	/**
	 *  External control to actions. 
	 *  Actions can be blocked from outside bootstrapping the standard check-flow.
	 *  */
	this.semaphors = {
		 canDoQuery: true
		,canDoSave:true, canDoNew:true, canDoCopy:true, canDoEdit:true
		,canDoDeleteCurrent:true, canDoDeleteSelection:true 				
	};
	
	this.store = null;

	this.filter = null;
	//this.filterFields = null;
	//this.FilterModel = null;

    this.record = null;
	this.recordFields = null;
	this.RecordModel = null;
	
    this.params = null;
	this.paramFields = null;
	this.paramModel = null;

	this.actions = null;
	
    this._trl_ = null;
	this.selectedRecords = [];
	this.children = [];
	this.tuning = {
			 queryDelay: 150 // nr of milliseconds before execute the query. Used if value>0	
			,fetchSize: 30
		};
	

      Ext.apply(this,config);
    	this.addEvents(

			"beforeDoQuery", "afterDoQuery"
			,"afterDoQuerySuccess","afterDoQueryFailure"
			,"beforeDoNew" ,  "afterDoNew"
			,"beforeDoCopy" ,  "afterDoCopy"
			,"beforeDoSave", "afterDoSave"
			,"afterDoSaveSuccess","afterDoSaveFailure"
				
			,"beforeDoDelete", "afterDoDelete"
			,"beforeDoDeleteSelection", "afterDoDeleteSelection"
	
			,"semaphorChanged"
			,"onEdit", "dirtyRecord"

			,"discardChanges"	
	             ,'beforeCurrentRecordChange','afterCurrentRecordChange'
	             ,'initComplete', 'afterSelectedRecordsChanged'
                 ,'inContextOfNewRecord'    ,'inContextOfEditRecord'
              ,'propertyChange' ,'parameterValueChanged'    );
    this.recordFields = this.ds.recordFields;
    this.paramFields = this.ds.paramFields;
    this.store = new Ext.data.Store({			        
        remoteSort:true,pruneModifiedRecords:true
	       ,proxy: new Ext.data.HttpProxy({
			        api: Dnet.dsAPI(this.ds.dsName,"json")
			    })
			,reader: new Ext.data.JsonReader(
			   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
					,Ext.data.Record.create(this.recordFields))
	       , writer: new Ext.data.JsonWriter({ encode: true, writeAllFields: true })  
	       , autoSave: false 
	       , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
	    })
      dnet.base.AbstractDc.superclass.constructor.call(this, config);
      this._setup_();
};

Ext.extend(dnet.base.AbstractDc, Ext.util.Observable, {

	 _setup_: function () {
	 	//this.FilterModel = Ext.data.Record.create( this.recordFields );
	 	this.RecordModel = Ext.data.Record.create( this.recordFields );
	 	this.ParamModel = Ext.data.Record.create( this.paramFields );
        this.setFilter(new this.RecordModel(this.emptyFilterData(this.recordFields ) ));
        this.setParams(new this.RecordModel(this.emptyParamData(this.paramFields ) ));
        if (this.afterStoreLoadDoDefaultSelection) {
        	this.store.on("load",function(store, records, options) {if (this.afterStoreLoadDoDefaultSelection) this._doDefaultSelection_();},this);
        }   
        this.store.on("beforeload", function(store, options) {if(this.isDirty()) {return false;} } , this);
        this.store.on("write",function(store, action, result, tx, records) {
			if (action == Ext.data.Api.actions.update ) {
               this.afterDoSaveSuccess();
			}
			if (action == Ext.data.Api.actions.create ) {
               this.afterDoSaveSuccess();
			}
			if (action == Ext.data.Api.actions.destroy ) {
               this.afterDoSaveSuccess();
			}
			if(!this.isCurrentRecordDirty())  {
				this.actions.doQuery.setDisabled(false);
				this.actions.doCancel.setDisabled(true);
				this.actions.doSave.setDisabled(true);
				this.actions.doNew.setDisabled(false);
				this.actions.doPrevRec.setDisabled(false);
				this.actions.doNextRec.setDisabled(false);
				this.fireEvent("cleanRecord",this);
				this.fireEvent("recordChanged", { dc: this, record: this.record, state: 'clean', status:this.getRecordStatus(), oldRecord: null }); 
			}
		},this);
        this.actions = dnet.base.DcActionsFactory.createActions(this);
	}

	,addChild: function (dc) {
		this.children[this.children.length] = dc;
		dc.on("dirtyRecord", this.dataModified, this);
		dc.on("cleanRecord", function() {  if(!this.isCurrentRecordDirty())  {this.fireEvent("cleanRecord",this);}  }, this);
	}
	,addBindedView: function(id) {
		if (this.bindedViews == null) {
			this.bindedViews=[];
		}
		this.bindedViews[this.bindedViews.length]=id;
		
		this.on('afterCurrentRecordChange', 
				function(evnt) { 
					var newRecord = evnt.newRecord; 
					var oldRecord = evnt.oldRecord; 
					var newIdx = evnt.newIdx;
					if(newRecord) {								 
						Ext.BindMgr.unbind(oldRecord);    						
						Ext.BindMgr.bind(newRecord, this.bindedViews);								 
					} else {								 
						Ext.BindMgr.unbind(oldRecord);								 
					} }, this );
	   
	
	}
	,emptyRecordData: function(fd) {
       var r = {};
       r["clientId"] = getApplication().getSession().client.id;
	   for(var i=0;i<fd.length; i++) {
	   	 if (fd[i]["name"] != "clientId") {
	         if (fd[i]["type"]=="string") {
	          	r[fd[i]["name"]] = "";
			  } else {
			  	if (fd[i]["type"]=="boolean") {
					r[fd[i]["name"]] = false;
				} else {
					r[fd[i]["name"]] = null;
				}
			  }
		 }
	   }
	   return r;
	}
    ,emptyFilterData: function(fd) {
       var r = {};
       r["clientId"] = getApplication().getSession().client.id;
	   for(var i=0;i<fd.length; i++) {
		  if (fd[i]["name"] != "clientId") {
		  	if (fd[i]["type"]=="string") {
	        	r[fd[i]["name"]] = "";
		  	} else {
				r[fd[i]["name"]] = null;
		  	}
		  }
	   }
	   return r;
	}
	,emptyParamData: function(fd) {
       var r = {};
	   for(var i=0;i<fd.length; i++) {
		  	if (fd[i]["type"]=="string") {
	        	r[fd[i]["name"]] = "";
		  	} else {
				r[fd[i]["name"]] = null;
		  	}
	   }
	   return r;
	}
	,beforeCurrentRecordChange: function() {return true;}  
	,isFilterValid: function() { return true;}  
	,isRecordValid: function() {
		return true;
	}
	,getRecordState: function() {
		if(this.record) 
			return (this.isCurrentRecordDirty() )?'dirty':'clean';
		else 
			return null;
	}
	,getRecordStatus: function() {
		if(this.record) 
			return (this.record.phantom)?'insert':'update';
		else 
			return null;
	}
	,dataModified: function() {
		this.actions.doQuery.setDisabled(true);
		this.actions.doCancel.setDisabled(false);
		this.actions.doSave.setDisabled(false);
		this.actions.doCopy.setDisabled(true);
		
		if (this.multiEdit) {
			this.actions.doNew.setDisabled(false);
			this.actions.doPrevRec.setDisabled(false);
			this.actions.doNextRec.setDisabled(false);			
		} else {
			if(!this.isRecordChangeAllowed()) {
				this.actions.doNew.setDisabled(true);
				this.actions.doPrevRec.setDisabled(true);
				this.actions.doNextRec.setDisabled(true);			
			}
		}		 
		this.fireEvent("dirtyRecord",this); /* to be removed in favor of recordStateChanged  */
		this.fireEvent("recordChanged" , { dc: this, record: this.record, state: 'dirty', status:this.getRecordStatus(), oldRecord: null } );		 
	}

	/****************************************************************************/
	/*************************  Public API   *******************************/
	/****************************************************************************/
		 
	/*************************  actions  *******************************/
	  
	,doClearQuery: function(){ this.doClearQueryImpl(); }	  
		,beforeDoClearQuery: function() {this.fireEvent("beforeDoClearQuery",this); return true;}	
		,afterDoClearQuery: function() {this.fireEvent("afterDoClearQuery",this);}
		
	,doQuery: function(){ this.doQueryImpl();  }
		,beforeDoQuery: function() {this.fireEvent("beforeDoQuery",this); return true;}	
		,afterDoQuery: function() {this.fireEvent("afterDoQuery",this);}		
			,afterDoQuerySuccess: function() {this.fireEvent("afterDoQuerySuccess",this);}
			,afterDoQueryFailure: function() {this.fireEvent("afterDoQueryFailure",this);}

    ,doRefreshCurrent: function(){ this.doRefreshCurrentImpl();  }
		,beforeDoRefreshCurrent: function() {this.fireEvent("beforeDoRefreshCurrent",this); return true;}
		,afterDoRefreshCurrent: function() {this.fireEvent("afterDoRefreshCurrent",this);}

	/*
	,doGetSummaries: function(){ this.doGetSummariesImpl(); }	
		,beforeDoGetSummaries: function() {this.fireEvent("beforeDoGetSummaries",this); return true;}	
		,afterDoGetSummaries: function() {this.fireEvent("afterDoGetSummaries",this);}
			,afterDoGetSummariesSuccess: function() {this.fireEvent("afterDoGetSummariesSuccess",this);}
			,afterDoGetSummariesFailure: function() {this.fireEvent("afterDoGetSummariesFailure",this);}
		*/

	,doNew: function(){ this.doNewImpl();}	  
		,beforeDoNew: function() {this.fireEvent("beforeDoNew",this);}	
		,afterDoNew: function() {this.fireEvent("afterDoNew",this); }

	,doCopy: function(){ this.doCopyImpl(); }	  
		,beforeDoCopy: function() {this.fireEvent("beforeDoCopy",this);}	
		,afterDoCopy: function() {this.fireEvent("afterDoCopy",this); }			
		 
		
	,doSave: function(){ this.doSaveImpl();}
		,beforeDoSave: function() {this.fireEvent("beforeDoSave",this);}	
		,afterDoSave: function() {this.fireEvent("afterDoSave",this);}
        	,afterDoSaveSuccess: function() {this.fireEvent("afterDoSaveSuccess",this);this.actions.doQuery.setDisabled(false);}
			,afterDoSaveFailure: function() {this.fireEvent("afterDoSaveFailure",this);}

	,doDelete: function(){ this.doDeleteImpl(); }
		,beforeDoDelete: function() {this.fireEvent("beforeDoDelete", this);}
		,afterDoDelete: function() {this.fireEvent("afterDoDelete",this);}

		
	,doDeleteSelection: function(){ this.doDeleteSelectionImpl(); }
		,beforeDoDeleteSelection: function() {this.fireEvent("beforeDoDeleteSelection", this);}
		,afterDoDeleteSelection: function() {this.fireEvent("afterDoDeleteSelection",this);}	

	,doInitNewRecordLocal: function(){  }
	,doInitNewRecordRemote: function(){  }		
		,afterDoInitNewRecordRemoteSuccess: function() {this.fireEvent("afterDoInitNewRecordRemoteSuccess",this);}
		,afterDoInitNewRecordRemoteFailure: function() {this.fireEvent("afterDoInitNewRecordRemoteFailure",this);}


	,doInitNewFilterLocal: function(){  }
	,doInitNewFilterRemote: function(){  }		
		,afterDoInitNewFilterRemoteSuccess: function() {this.fireEvent("afterDoInitNewFilterRemoteSuccess",this);}
		,afterDoInitNewFilterRemoteFailure: function() {this.fireEvent("afterDoInitNewFilterRemoteFailure",this);}
	

	/*************************************  SERVICE DATA  ******************************************************/
			
	/**
	 * Call a service on the data-source. 
	 * @param serviceName: The name of the data-source service to be executed.
	 * @param specs: Specifications regarding the execution of this task.
	 *  Attributes of specs:
	 * 		<li> modal: Boolean flag to show a progress bar during the execution of the request to block user interaction. 
	 * 		<li> context: object with variables you may need in your callbacks
	 * 		<li> callbacks: Object specifying callback functions to be invoked 
	 * 	Attributes of callbacks :  
	 * 		<li>successFn: Callback to execute on successful execution</li>
	 * 		<li>successScope: scope of the successFn</li>
	 * 		<li>silentSuccess: do not fire the afterDoServiceSuccess event</li>
	 * 		<li>failureFn: callback to execute on failure</li>
	 * 		<li>failureScope: scope of the failureFn</li>
	 * 		<li>silentFailure: do not fire the <code>afterDoServiceFailure</code> event</li>
	 * 	The arguments passed to these functions are described in the afterDoServiceSuccess() 
	 * and afterDoServiceFailure() methods which actually invoke them. 
	 *  
	 */
    ,doService: function(serviceName, specs){     	 
    	if (Ext.isEmpty(this.record)) {
 	       throw(dnet.base.DcExceptions.NO_CURRENT_RECORD );
 		}    	
    	var s = specs || {};
    	if (this.beforeDoService(serviceName, s) === false) {
    		return;
    	}    	
    	var p = {data: Ext.encode(this.record.data ) };
		p[Dnet.requestParam.SERVICE_NAME_PARAM]= serviceName;
		if (s.modal) {
			Ext.Msg.progress('Working...');
	    }
		Ext.Ajax.request({
			url: Dnet.dsAPI(this.dsName, "json").service, method:"POST", params: p
			,success :this.onAjaxRequestSuccess
			,failure: this.onAjaxRequestFailure	
			,scope: this
			,options: { action: "doService", serviceName: serviceName, specs: s }
		});
		this.afterDoService(serviceName, specs);    	    
    }
  
    /**
     * Template method invoked before a service is executed, meant to be overwritten. 
     * Execution can be canceled with a <code>return false</code>. 
     * Parameters are the same as in <code>doService</code>.
     */
	,beforeDoService: function(serviceName, specs) {
		return true;
	}
	
	/**
	 * Template method invoked after a service call is sent to server, meant to be overwritten.
	 * ATTENTION! The result is not available yet, the AJAX request has just been sent to server.
	 * Parameters are the same as in <code>doService</code>.
	 */
	,afterDoService: function(serviceName, specs) {}
    
	/**
     * Method called after a successful execution of the service. 
     * Successful means that server returns a 200 status code and the success attribute in the returning json is set to true.
     * It first invokes the task specific callback then fires the associated event. 
     * Both type of callback methods ( the one specified in callbacks and the handler of the fired event)
	 * will be passed the data-control instance (this) followed by the arguments of this method.
     * If you need a certain callback to be executed each time, attach an event listener to the fired event. 
     * @param response: the server response object as received from the ajax request
     * @param serviceName: the name of service which has been executed.
	 * @param specs: Specifications regarding the execution of this task. @See doService() 
	 * 
     */
	,afterDoServiceSuccess: function(response, serviceName, specs) {
		Ext.Msg.hide();
		var s=specs||{};
		if (s.callbacks && s.callbacks.successFn) {
			s.callbacks.successFn.call(s.callbacks.successScope||this, this, response, serviceName, specs);
		}		
		if (!(s.callbacks && s.callbacks.silentSuccess === true)) {
			this.fireEvent("afterDoServiceSuccess", this, response, serviceName, s);
		}			
	}
	/**
     * Method called when execution of the service fails. 
     * Failure means that server returns anything except a 200 class status code or the success attribute in the returning json is set to false.
     * It first invokes the task specific callback then fires the associated event. 
     * Both type of callback methods ( the one specified in callbacks and the handler of the fired event)
	 * will be passed the data-control instance (this) followed by the arguments of this method.
     * If you need a certain callback to be executed each time, attach an event listener to the fired event. 
     * @param response: the server response object as received from the ajax request
     * @param serviceName: the name of service which has been executed.
	 * @param specs: Specifications regarding the execution of this task. @See doService() 
     */
	,afterDoServiceFailure: function(response, serviceName, specs) {
		var s=specs||{};
		if (s.callbacks && s.callbacks.failureFn) {
			s.callbacks.failureFn.call(s.callbacks.failureScope||this, this, response, serviceName, specs);
		}		
		if (!(specs.callbacks && specs.callbacks.silentFailure === true)) {
			this.fireEvent("afterDoServiceFailure", this, response, serviceName, specs);
		}				
	}

	
	/*************************************  SERVICE FILTER  ******************************************************/
	
	
	/**
	 * Call a service on the data-source filter. 
	 * @param serviceName: The name of the data-source service to be executed.
	 * @param specs: Specifications regarding the execution of this task.
	 *  Attributes of specs:
	 * 		<li> modal: Boolean flag to show a progress bar during the execution of the request to block user interaction. 
	 * 		<li> context: object with variables you may need in your callbacks
	 * 		<li> callbacks: Object specifying callback functions to be invoked 
	 * 	Attributes of callbacks :  
	 * 		<li>successFn: Callback to execute on successful execution</li>
	 * 		<li>successScope: scope of the successFn</li>
	 * 		<li>silentSuccess: do not fire the afterDoServiceFilterSuccess event</li>
	 * 		<li>failureFn: callback to execute on failure</li>
	 * 		<li>failureScope: scope of the failureFn</li>
	 * 		<li>silentFailure: do not fire the <code>afterDoServiceFailure</code> event</li>
	 * 	The arguments passed to these functions are described in the afterDoServiceFilterSuccess() 
	 * and afterDoServiceFilterFailure() methods which actually invoke them. 
	 *  
	 */
    ,doServiceFilter: function(serviceName, specs){     	     	    
    	var s = specs || {};
    	if (this.beforeDoServiceFilter(serviceName, s) === false) {
    		return;
    	}    	
    	var p = {data: Ext.encode(this.filter.data ) };
		p[Dnet.requestParam.SERVICE_NAME_PARAM]= serviceName;
		if (s.modal) {
			Ext.Msg.progress('Working...');
	    }
		Ext.Ajax.request({
			url: Dnet.dsAPI(this.dsName, "json").service, method:"POST", params: p
			,success :this.onAjaxRequestSuccess
			,failure: this.onAjaxRequestFailure	
			,scope: this
			,options: { action: "doServiceFilter", serviceName: serviceName, specs: s }
		});
		this.afterDoServiceFilter(serviceName, specs);    	    
    }
  
    /**
     * Template method invoked before a service is executed, meant to be overwritten. 
     * Execution can be canceled with a <code>return false</code>. 
     * Parameters are the same as in <code>doService</code>.
     */
	,beforeDoServiceFilter: function(serviceName, specs) {
		return true;
	}
	
	/**
	 * Template method invoked after a service call is sent to server, meant to be overwritten.
	 * ATTENTION! The result is not available yet, the AJAX request has just been sent to server.
	 * Parameters are the same as in <code>doService</code>.
	 */
	,afterDoServiceFilter: function(serviceName, specs) {}
    
	/**
     * Method called after a successful execution of the service. 
     * Successful means that server returns a 200 status code and the success attribute in the returning json is set to true.
     * It first invokes the task specific callback then fires the associated event. 
     * Both type of callback methods ( the one specified in callbacks and the handler of the fired event)
	 * will be passed the data-control instance (this) followed by the arguments of this method.
     * If you need a certain callback to be executed each time, attach an event listener to the fired event. 
     * @param response: the server response object as received from the ajax request
     * @param serviceName: the name of service which has been executed.
	 * @param specs: Specifications regarding the execution of this task. @See doService() 
	 * 
     */
	,afterDoServiceFilterSuccess: function(response, serviceName, specs) {
		Ext.Msg.hide();
		var s=specs||{};
		if (s.callbacks && s.callbacks.successFn) {
			s.callbacks.successFn.call(s.callbacks.successScope||this, this, response, serviceName, specs);
		}		
		if (!(s.callbacks && s.callbacks.silentSuccess === true)) {
			this.fireEvent("afterDoServiceFilterSuccess", this, response, serviceName, s);
		}			
	}
	/**
     * Method called when execution of the service fails. 
     * Failure means that server returns anything except a 200 class status code or the success attribute in the returning json is set to false.
     * It first invokes the task specific callback then fires the associated event. 
     * Both type of callback methods ( the one specified in callbacks and the handler of the fired event)
	 * will be passed the data-control instance (this) followed by the arguments of this method.
     * If you need a certain callback to be executed each time, attach an event listener to the fired event. 
     * @param response: the server response object as received from the ajax request
     * @param serviceName: the name of service which has been executed.
	 * @param specs: Specifications regarding the execution of this task. @See doService() 
     */
	,afterDoServiceFilterFailure: function(response, serviceName, specs) {
		var s=specs||{};
		if (s.callbacks && s.callbacks.failureFn) {
			s.callbacks.failureFn.call(s.callbacks.failureScope||this, this, response, serviceName, specs);
		}		
		if (!(specs.callbacks && specs.callbacks.silentFailure === true)) {
			this.fireEvent("afterDoServiceFilterFailure", this, response, serviceName, specs);
		}				
	}
	
	
	
	 /**
	  * Default AJAX request failure handler. 
	  */
	,onAjaxRequestSuccess: function(response , options) {
		Ext.MessageBox.hide(); var o = options.options || {};
     	if (o.action) {
     		if (o.action == "doQuery") {      			
     			this.afterDoQueryFailure();
     		}
     		if (o.action == "doSave") {      			
     			this.afterDoSaveFailure();
     		}
     		if (o.action == "doService") {
     			this.afterDoServiceSuccess(response, o.serviceName, o.specs );
     		}
     		if (o.action == "doServiceFilter") {
     			this.afterDoServiceFilterSuccess(response, o.serviceName, o.specs );
     		}
     	}      	
	  }
	
	
	 /**
	  * Default AJAX request failure handler. 
	  */
	,onAjaxRequestFailure: function(response , options) {
		Ext.MessageBox.hide();
		var msg, withDetails=false;
		if (response.responseText) {
			if (response.responseText.length > 2000) {
				response.responseText.substr(0,2000);
				withDetails = true;
			} else {
				msg = response.responseText ;
			}
		} else {
			msg = "No response received from server.";
		}
		var alertCfg = { msg: msg, scope:this, icon: Ext.MessageBox.ERROR, buttons: {ok:'OK'} }  
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = response.responseText;
		}		  
      	Ext.Msg.show(alertCfg);
      	var o = options.options || {};
      	if (o.action) {
      		if (o.action == "doQuery") {      			
      			this.afterDoQueryFailure();
      		}
      		if (o.action == "doSave") {      			
      			this.afterDoSaveFailure();
      		}
      		if (o.action == "doService") {
      			this.afterDoServiceFailure(response, o.serviceName, o.specs );
      		}
      		if (o.action == "doServiceFilter") {
      			this.afterDoServiceFilterFailure(response, o.serviceName, o.specs );
      		}
      	}      	
	  }
	   
	
	
	
	,_checkCanDoEdit_: function() {
    	if (!this.semaphors.canDoEdit) return false;
    	if (!this.multiEdit && !this.record ) {
    		throw(dnet.base.DcExceptions.NO_CURRENT_RECORD );    		 
    	}    	 
    }
	
	,doEdit: function() {
		this.onEdit();
	}
	,onEdit: function() {
		this._checkCanDoEdit_();
		this.fireEvent("onEdit",this);
	}


	  /****************************************************************************/
	  /*************************  API => getters-setters  *************************/
	  /****************************************************************************/
	
	,setPreviousAsCurrent:
		function(){this.setPreviousAsCurrentImpl();}			

	,setNextAsCurrent:
		function(){ this.setNextAsCurrentImpl(); }
			

 
	,getSelectedRecords : 
		function() { return this.selectedRecords; }
	
	,getRecord: function() { return this.record; }
	,setRecord: function(p) {this.setCurrentRecordImpl(p);}
	,getCurrentRecord: function() { return this.record; }
	,setCurrentRecord: function(p) {this.setCurrentRecordImpl(p);}
	
	,getFilter: function()  { 	return this.filter ;  	}
	,setFilter:	function(v)  { this.filter = v;  }

	,getParams: function()  { 	return this.params ;  	}
	,setParams:	function(v)  { this.params = v;  }

    ,getParamValue: function(n)  { 	return this.params.get(n) ;  	}
	,setParamValue:	function(n,v)  {
	  var ov = this.params.get(n);
	  if (ov != v ) {
	  	 this.params.set(n,v);
	  	 this.fireEvent("parameterValueChanged", this, name, ov,v);
 	  }
    }

	,setSemaphor: function(name, value) {
		this.semaphors[name] = value;
		this.fireEvent("semaphorChanged", this, name, value);
	}
	  	
	,setDcContext: function(dcCtx) {
		this.dcContext = dcCtx;
        this.dcContext.on("dataContextChanged", function(dctx) { 
        	if ( dctx.parentDc.getRecord() == null ) {
        		this.actions.doQuery.setDisabled(true);
				this.actions.doCancel.setDisabled(true);
				this.actions.doSave.setDisabled(true);
				this.actions.doNew.setDisabled(true);
				this.actions.doDeleteSelected.setDisabled(true);  
				return true;
        	}
			if (dctx.parentDc.getRecord() && dctx.parentDc.getRecord().phantom) { 
				this.fireEvent("inContextOfNewRecord", this);
				
				this.actions.doQuery.setDisabled(true);
				this.actions.doCancel.setDisabled(true);
				this.actions.doSave.setDisabled(true);
				this.actions.doNew.setDisabled(true);
				this.actions.doDeleteSelected.setDisabled(true);
				  
			}  else {
                this.fireEvent("inContextOfEditRecord", this);
                this.actions.doQuery.setDisabled(false);
                this.actions.doNew.setDisabled(false);
			}
		}  , this);
	}
  /****************************************************************************/
  /*************************  IMPLEMENTATION => private functions *************/
  /****************************************************************************/

	,_doDefaultSelection_: function() {
		if (this.store.getCount()>0) {
			this.setCurrentRecord(this.store.getAt(0));
			this.setSelectedRecords([this.record]);
		} else {
			this.setCurrentRecord(null);
		}		
	}
	
 
	/**
	 * If new record delete it, otherwise undo changes from last commit 
	 */
	,discardRecordChanges: function () {
		if (this.multiEdit) {
			var s =this.store; s.rejectChanges(); s.each(function(r) {if(r.phantom){s.remove(r);}},s );
		} else {
			if(this.record) {this.record.reject();}
			  if (this.record.phantom ) {
			      this.store.remove(this.record);
			      this.setCurrentRecord(null);
			   }
		}
		/*TODO: remove the cleanRecord in favor of recordChanged */ 
		this.fireEvent("cleanRecord" , this); 
		this.fireEvent("recordChanged" , { dc: this, record: this.record, state: this.getRecordState(), status:this.getRecordStatus(), oldRecord: null  } );
	}
	,discardChildrenChanges: function () {
		var dirty = false, l = this.children.length;
		for(var i=0; i< l; i++) {
			if (this.children[i].isStoreDirty()) {
				this.children[i].discardChanges();
			}
		}
		/* to be removed the cleanRecord event */ 
		//this.fireEvent("cleanRecord" , this); 
		//this.fireEvent("recordStateChanged" , { dc: this, record: this.record, state: 'clean' } );
		//this.fireEvent("recordChanged" , { dc: this, record: this.record, state: this.getRecordState(), status:this.getRecordStatus(), oldRecord: null  } );		
	}
	,discardChanges: function () {
		this.discardChildrenChanges();
		this.discardRecordChanges();
		this.actions.doQuery.setDisabled(false);
		this.actions.doCancel.setDisabled(true);
		this.actions.doSave.setDisabled(true);
		
		this.actions.doNew.setDisabled(false);
		if (this.isRecordChangeAllowed() && this.store.getCount() > 0) {
			this.actions.doPrevRec.setDisabled(false);
			this.actions.doNextRec.setDisabled(false);
		}
		this.actions.doCopy.setDisabled(false);		 
	}

	,setPreviousAsCurrent:
		function(){
			if (this.selectedRecords.length<=1) {
				var crtIdx = this.store.indexOf(this.record);
				if( --crtIdx < 0) {
					throw(dnet.base.DcExceptions.NAVIGATE_BEFORE_FIRST);
				} else {
					this.setRecord( this.store.getAt(crtIdx));						   
				}
			} else {
				var crtIdx = this.selectedRecords.indexOf(this.record);
				if( --crtIdx < 0) {
					throw(dnet.base.DcExceptions.NAVIGATE_BEFORE_FIRST);
				} else {
					this.setRecord( this.selectedRecords[crtIdx]);						   
				}
			}
		}

	,setNextAsCurrentImpl:
		function(){
			if (this.selectedRecords.length<=1) {
				var crtIdx = this.store.indexOf(this.record);
				if( ++crtIdx >= this.store.getCount() ) {
					throw(dnet.base.DcExceptions.NAVIGATE_AFTER_LAST);
				} else {
					this.setRecord( this.store.getAt(crtIdx));						   
				}
			} else {
				var crtIdx = this.selectedRecords.indexOf(this.record); 			 
				if(++crtIdx >= this.selectedRecords.length) {
				    throw(dnet.base.DcExceptions.NAVIGATE_AFTER_LAST);
				} else {
					this.setRecord( this.selectedRecords[crtIdx]);
				 }
			}			
		}

	,isAnyChildDirty: function() {
		var dirty = false, l = this.children.length;		 
		for(var i=0; i< l; i++) {
			if (this.children[i].isCurrentRecordDirty()) {
				dirty=true; i=l;
			}
		} 
		return dirty;
	}
	,isCurrentRecordDirty:function() {
		if (this.record && this.record.dirty) { return true;}		
		return this.isAnyChildDirty();
	}

	,isStoreDirty: function() {
		return this.store.getModifiedRecords().length>0;
	}
	
	,isDirty: function() {
		return this.isStoreDirty() || this.isCurrentRecordDirty();
	}
	,isRecordChangeAllowed: function() {
		return (!( this.isAnyChildDirty() || ( (!this.multiEdit) && this.isCurrentRecordDirty()) ));
	}
	/*********************************************************************************/
    /**************************      QUERY           *********************************/
    /*********************************************************************************/

	/**
	 * Reset all filter fields to null 
	 * If this data-control is a child (is in the context of a parent data-control)
	 * and the relation does not allow records outside of the context, then apply the 
	 * context data as defined in the child-parent relation. 
	 */
	,doClearQueryImpl: function(){		
        for(var p in this.filter.data ) {
			this.filter.set(p, null);
		}
        if (this.dcContext) {
        	this.dcContext._updateChildFilter_();
        }
	}

	 ,_checkCanDoQuery_: function() {
	    	if ( this.isDirty() ) {
	    		throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND);
	    	}
	    }

    ,doQueryImpl: function() {
    	this._checkCanDoQuery_();
	    var request = dnet.base.RequestParamFactory.findRequest(this.filter.data);
        for(var p in request.data ) {  if(request.data[p] === "") {request.data[p] = null ;} }
	    var data = Ext.encode(request.data);
		request.data = data;
		request.params = Ext.encode(this.params.data);
        this.store.load({ params:request,scope:this });
        this.store.baseParams = {data:data};
        this.setCurrentRecord(null);
		//this.store.removeAll(true);  //  why is this necessary ?
    }


	,doRefreshCurrentImpl: function() {
		if (this.beforeDoRefreshCurrent() === false) return false;
        this.store.proxy.doRequest("read", null, {data: Ext.encode({id:this.record.get("id")}) } , this.store.reader , 
		  function(response,options,success) {
		  	        if (success) {
                        this.record.beginEdit();
						for(var p in this.record.data) {
                           this.record.set(p, response.records[0].data[p]);
						}
						this.record.endEdit();
						this.record.commit();
						this.fireEvent("afterDoRefreshCurrentSuccess",this);
					} else {
                        this.fireEvent("afterDoRefreshCurrentFailure",this);
					}
			  } , this);
	}

	

  	/*********************************************************************************/
    /**************************   NEW   **********************************************/
    /*********************************************************************************/

    ,_checkCanDoNew_: function() {
    	if (!this.semaphors.canDoNew) return false;
    	if ( this.multiEdit ) {
    		if (this.isAnyChildDirty()) {
    			throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND); 
	   		}
    	} else {    		 
    		 if ( this.isDirty()) {    		
         		throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND); 
         	}
    	}

    	if (this.dcContext){ 
    		this.dcContext._checkCanDoNew_();
    	}
    }
    
	,doNewImpl: function() {		
		this._checkCanDoNew_();
		if (this.beforeDoNew() === false) return false;	
		var r = new this.RecordModel(this.emptyRecordData(this.recordFields ) );
		//TODO: First level init: Initialize with local static values 
		if (this.dcContext) {this.dcContext._applyContextData_(r); }		
		this.store.add(r);
		this.setRecord(r);
		this.setSelectedRecords([this.record]);
		//TODO: Second level init: Call remote service to initialize
		this.dataModified();
		this.afterDoNew();
	}

	,_checkCanDoCopy_: function() {
		if (!this.semaphors.canDoCopy) return false;
		if (!this.record) {    		    		 
    		throw(dnet.base.DcExceptions.NO_CURRENT_RECORD);
    	}
    	if ( this.multiEdit ) {
    		if (this.isAnyChildDirty()) {
    			throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND); 
	   		}
    	} else {    		 
    		 if ( this.isDirty()) {    		
         		throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND); 
         	}
    	}
    	
    	if (this.dcContext){ 
    		this.dcContext._checkCanDoCopy_();
    	}
    }
	,doCopyImpl: function() {		
		this._checkCanDoCopy_();
		if (this.beforeDoCopy() === false) return false;	 
		var r = new this.RecordModel(this.emptyRecordData(this.recordFields ) );
		Ext.apply(r.data, this.record.data);
		r.data.id=null;  
		if (this.dcContext) {this.dcContext._applyContextData_(r); }					
		this.store.add(r);
		this.setRecord(r);
		
		this.setSelectedRecords([this.record]);
		this.dataModified();
//		var r = this.record.copy();    r.id=null; r.id = null; 		
//		this.store.add(r);
//		if (this.dcContext) {this.dcContext._applyContextData_(r); }		
//		this.setRecord(r);
//		this.setSelectedRecords([this.record]);
		 
	}
	
  	/*********************************************************************************/
    /**************************   SAVE  **********************************************/
    /*********************************************************************************/

	,_checkCanDoSave_: function() {
    	if (!this.semaphors.canDoSave) return false;    	 
    }
   ,doSaveImpl: function() {
	   this._checkCanDoSave_();
	   if (this.beforeDoSave() === false) return false;
	   if (!this.multiEdit) {	   	 
           if ( this.isRecordValid() ) {
	         this.store.save();
		   }
	   } else {
		   this.store.save(); 
	   }
		this.afterDoSave();
    }

    /*********************************************************************************/
    /**************************   DELETE         *********************************/
    /*********************************************************************************/

	,confirmDelete: function (btn) {
		this._checkCanDoDelete_();
		if (!btn) {
        	Ext.Msg.confirm(Dnet.translate("msg", "dc_confirm_action"), Dnet.translate("msg", "dc_confirm_delete_selection")
		         ,this.confirmDelete,this );
		} else { if (btn == "yes" || btn == "ok" ) {this.doDeleteImpl(); }}
	}
	,confirmDeleteSelection: function (btn) {
		this._checkCanDoDeleteSelection_();
		if (!btn) {
        	Ext.Msg.confirm(Dnet.translate("msg", "dc_confirm_action"), Dnet.translate("msg", "dc_confirm_delete_selection")
		         ,this.confirmDeleteSelection,this );
		} else {if (btn == "yes" || btn == "ok" ) {this.doDeleteSelection(); }}
	}

	,_checkCanDoDeleteSelection_: function() {
    	if (!this.semaphors.canDoDeleteSelection) return false;
    	if (!this.selectedRecords || this.selectedRecords.length == 0 ) {    		    		 
    		throw(dnet.base.DcExceptions.NO_SELECTED_RECORDS );
    	}
    }
    ,doDeleteSelectionImpl: function() {
    	this._checkCanDoDeleteSelection_();
		if (this.beforeDoDeleteSelection() === false) return false;				
		this.store.remove(this.getSelectedRecords());
		if (!this.multiEdit) {
			this.store.save();
		} else {
			this.dataModified();
		}
		this._doDefaultSelection_();
		 
		this.afterDoDeleteSelection();
      }

    ,_checkCanDoDelete_: function() {
    	if (!this.semaphors.canDoDeleteCurrent) return false;
    	if (!this.record) {    		    		 
    		throw(dnet.base.DcExceptions.NO_CURRENT_RECORD );
    	}
    }
     ,doDeleteImpl: function() {
    	this._checkCanDoDelete_(); 
		if ( this.beforeDoDelete()  === false ) return false;		 
		this.store.remove(this.record );
		this._doDefaultSelection_(); 	
		this.afterDoDelete();
 	}

 
    
	/*********************************************************************************/
    /**************************   GETTER-SETTER      *********************************/
    /*********************************************************************************/
   ,allSelectedRecordsArePersisted: function() {
   	  var l= this.selectedRecords.length;
		  for( var i=0;i<l;i++) {
			  if (this.selectedRecords[i].phantom) {
			  	 return false;
			  }
		  }
		  return true;
	} 
  /** sm a selection model from a grid which triggered this call 
   *  It is useful when there are several grids displayed to synchronize selections
   */  
  ,setSelectedRecords: function (recArray) {  		 
  		if (this.selectedRecords != recArray) { 
  			this.selectedRecords = recArray;
  			if (Ext.isArray(this.selectedRecords) && this.selectedRecords.length > 0) {
  				this.actions.doDeleteSelected.setDisabled(false);
  	  			this.actions.doEdit.setDisabled(false);
  	  			if( this.selectedRecords.length == 1 && !this.isCurrentRecordDirty() ) {
  	  				this.actions.doCopy.setDisabled(false);
  	  			} else {
  	  				this.actions.doCopy.setDisabled(true);
  	  			}
  			} else {
  				this.actions.doDeleteSelected.setDisabled(true);
  	  			this.actions.doEdit.setDisabled(true);
  	  			this.actions.doCopy.setDisabled(true);
  			}
  			
  			this.fireEvent('afterSelectedRecordsChanged', this ); /* to be removed in favor of the below one*/
  			this.fireEvent('selectionChanged', { dc: this, record: this.record  } );  			
  		};  		
  	}    			
  
  ,_checkCanChangeCurrentRecord_: function() {
	  if (!this.multiEdit) {
		  if (this.isCurrentRecordDirty()) {
			  throw(dnet.base.DcExceptions.DIRTY_DATA_FOUND);
		  }
	  }
	   
  }
  ,setCurrentRecordImpl:
  	function(p)  {
	   this._checkCanChangeCurrentRecord_();
  		p = (p!=undefined)?p:null;
  		if (this.beforeCurrentRecordChange()==false) {return false;}
  		var rec,idx,changed=false,oldrec;
  		if (p!=null) {
  				if (Ext.isNumber(p)) {
		  			idx = p; rec = this.store.getAt(p);
		  			//dont
		  			if(rec && (this.record != rec)) {oldrec=this.record;this.record = rec;changed=true;}  			
		  		} else {
		  			rec = p; idx = this.store.indexOf(p);  	
		  			if(rec && (this.record != rec)) {oldrec=this.record;this.record = rec;changed=true;}  			  		   			
		  		} 
  			} else {
  				 oldrec=this.record;
  				 this.record = rec;
  				 changed=(oldrec!=null);
  			}  		
  		if(changed) { 
  			if ( this.isCurrentRecordDirty() ) {
  				this.actions.doCopy.setDisabled(true);
  			} else {
  				this.actions.doCopy.setDisabled(false);
  			}
  			this.fireEvent('afterCurrentRecordChange', { dc: this, newRecord: rec, oldRecord:oldrec, newIdx:idx , status: this.getRecordStatus() });
  			this.fireEvent("recordChanged" , { dc: this, record: this.record, state: this.getRecordState(), status:this.getRecordStatus(), oldRecord: oldrec, newIdx:idx } );
  			//this.fireEvent('recordStatusChanged', { dc: this, record: rec, status: this.getRecordStatus() });  			
  		}
  		return true;
  	}

  	 
  	/*********************************************************************************/
    /**************************   MISCELLANEOUS HELPERS  *****************************/
    /*********************************************************************************/
 
	 
	, proxyException: function(dataProxy, type, action , options , response , arg ) {
        if(type=="response") {
          this.onAjaxRequestFailure(response , options);
        } else {
           alert(response.message.substr(0,1500));
        }
	  }
	
	,log:function(m) {try {if (console) {console.log("Data-control `"+this.dsName+"`: "+m);}}catch(e){}}
});




 

/*****************************************************************************/
/****************************  DC: filter - view   ***************************/
/*****************************************************************************/

// executed in te context of a filter-view
function filter_view____change (field, oldVal, newVal) {
		this._controller_.getFilter().set(field.dataIndex, field.getValue());
	}




/*****************************************************************************/
/****************************  DC: form - view   ***************************/
/*****************************************************************************/

// executed in te context of a form-view 	
/*
function form_view____change (field, newVal, oldVal) {
		this._controller_.getRecord().set(field.dataIndex, field.getValue());
		this._controller_.dataModified();
	}
*/
function form_view____alertDirty () {
		Ext.Msg.show({
    	   title: 'Warning'
				 ,msg: 'Form data has been changed. <br/>Save your changes or discard them.'
         ,buttons: Ext.Msg.OK
         ,icon: Ext.MessageBox.WARNING
    	});
	}
 	
/*****************************************************************************/
/****************************  DC: grid view   *******************************/
/*****************************************************************************/

// executed in te context of a grid-view 	
function grid_view__sm__rowselect(sm, idx, rec) {  //console.log("grid_view__sm__rowselect: "+idx+" rec: "+rec );
 		if(this._controller_.getRecord() != rec) {this._controller_.setCurrentRecord(idx);}
 	}

function grid_view__sm__rowdeselect(sm, idx, rec) {  //console.log("grid_view__sm__rowdeselect: "+idx+" rec: "+rec );
 		if(this._controller_.getRecord() == rec) {
 		  if (sm.getSelections().length > 0 ) {
 		    this._controller_.setCurrentRecord(sm.getSelections()[0]);
 		  } else {
 		    this._controller_.setCurrentRecord(null);
 		  }
 		}
 	}
 
 