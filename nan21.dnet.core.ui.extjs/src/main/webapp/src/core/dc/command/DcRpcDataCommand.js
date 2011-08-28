Ext.ns("dnet.base");

dnet.base.DcRpcDataCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {

	canExecute: function(dc,serviceName, specs) {
		return !Ext.isEmpty(dc.record);
	}

	/**
	 * Call a service on the data-source. 
	 * @param serviceName: The name of the data-source service to be executed.
	 * @param specs: Specifications regarding the execution of this task.
	 *  Attributes of specs:
	 * 		<li> modal: Boolean flag to show a progress bar during the execution of the request to block user interaction. 
	 * 		<li> context: object with variables you may need in your callbacks
	 * 		<li> callbacks: Object specifying callback functions to be invoked 
	 * 		<li> stream: It is a stream type call  
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
	,execute: function(dc,serviceName, specs) {	
	//	if (dnet.base.DcActionsStateManager.isSaveDisabled(dc)) {	
	//		throw("Creating new record is not allowed.");
	//	}
		if (this.beforeExecute(dc,serviceName, specs) === false) {
			return false;
		}
		
		if (this.needsConfirm(dc,serviceName, specs)) {
			this.confirmExecute(null,dc,serviceName, specs);
			return;
		}
		 
		if (!this.canExecute(dc,serviceName, specs)) {
		       throw("Not allowed to execute "+serviceName );
			}    	
		var s = specs || {};			    	 
		var p = {data: Ext.encode(dc.record.data ) };
		p[Dnet.requestParam.SERVICE_NAME_PARAM]= serviceName;
		p["rpcType"]= "data";
		if (s.modal) {
			Ext.Msg.progress('Working...');
	    }
		Ext.Ajax.request({
			url: Dnet.dsAPI(dc.dsName, ((specs.stream)?"stream":"json")).service, method:"POST", params: p
			,success :this.onAjaxSuccess
			,failure: this.onAjaxFailure	
			,scope: dc
			,options: { action: "doService", serviceName: serviceName, specs: s }
		});
		this.afterExecute(dc, serviceName, specs);    
		
	}

	
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
	,onAjaxSuccess: function(response, options) {
		Ext.Msg.hide(); var o = options.options || {}, serviceName = o.serviceName, s = o.specs;
		if (s.callbacks && s.callbacks.successFn) {
			s.callbacks.successFn.call(s.callbacks.successScope||dc, dc, response, serviceName, specs);
		}		
		if (!(s.callbacks && s.callbacks.silentSuccess === true)) {
			dc.fireEvent("afterDoServiceSuccess", dc, response, serviceName, s);
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
	,onAjaxFailure: function(response, options) {
		Ext.Msg.hide(); var o = options.options || {}, serviceName = o.serviceName, s = o.specs;
		if (s.callbacks && s.callbacks.failureFn) {
			s.callbacks.failureFn.call(s.callbacks.failureScope||dc, dc, response, serviceName, specs);
		}		
		if (!(specs.callbacks && specs.callbacks.silentFailure === true)) {
			dc.fireEvent("afterDoServiceFailure", dc, response, serviceName, specs);
		}		
	}
	

});
 
 