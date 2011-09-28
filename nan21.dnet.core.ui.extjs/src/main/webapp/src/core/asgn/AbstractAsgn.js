Ext.define("dnet.base.AbstractAsgn", {
	
	mixins : {
		observable : 'Ext.util.Observable'
	},
 
  	//this.dsName = null
	storeLeft : null,
	storeRight : null,

	/**
	 * Various runtime configuration properties.
	 */
	tuning : {

		/**
		 * Number of milliseconds before execute the query. Used if value>0
		 */
		queryDelay : 150

		/**
		 * Page-size for a query
		 */
		,
		fetchSize : 30
	},
	
	/**
	 * Parameters model instance
	 */
	params : null,
	/**
	 * Filter object instance. Contains the left filter and right filter
	 */
	filter : null,
	
	/**
	 * Data model signature - record constructor.
	 */
	recordModel : null,

	/**
	 * Parameters model signature - record constructor.
	 */
	paramModel : null,
	
	
	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.params = {objectId : 8, selectionId : 0, clientId: null }
		this.filter = {
		      left:{field:null, value:null}
		     ,right:{field:null, value:null}
		}
		if (this.storeLeft == null) {
			this.storeLeft = Ext.create("Ext.data.Store", {
				model : this.recordModel,
				remoteSort : true,
				remoteSort : true,

				autoLoad : false,
				autoSync : false,
				clearOnPageLoad : true,
				pageSize : this.tuning.fetchSize,
				proxy : {
					type : 'ajax',
					api : Dnet.asgnLeftAPI(this.dsName, "json"),
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					},
					reader : {
						type : 'json',
						root : 'data',
						idProperty : 'id',
						totalProperty : 'totalCount',
						messageProperty : 'message'
					},
					writer : {
						type : 'json',
						encode : true,
						allowSingle : false,
						writeAllFields : true
					},
					listeners : {
						"exception" : {
							fn : this.proxyException,
							scope : this
						}
					},
					startParam : Dnet.requestParam.START,
					limitParam : Dnet.requestParam.SIZE,
					sortParam : Dnet.requestParam.SORT,
					directionParam : Dnet.requestParam.SENSE

				}

			});
			
			
		}
		
		if (this.storeRight == null) {
			this.storeRight = Ext.create("Ext.data.Store", {
				model : this.recordModel,
				remoteSort : true,
				remoteSort : true,

				autoLoad : false,
				autoSync : false,
				clearOnPageLoad : true,
				pageSize : this.tuning.fetchSize,
				proxy : {
					type : 'ajax',
					api : Dnet.asgnRightAPI(this.dsName, "json"),
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					},
					reader : {
						type : 'json',
						root : 'data',
						idProperty : 'id',
						totalProperty : 'totalCount',
						messageProperty : 'message'
					},
					writer : {
						type : 'json',
						encode : true,
						allowSingle : false,
						writeAllFields : true
					},
					listeners : {
						"exception" : {
							fn : this.proxyException,
							scope : this
						}
					},
					startParam : Dnet.requestParam.START,
					limitParam : Dnet.requestParam.SIZE,
					sortParam : Dnet.requestParam.SORT,
					directionParam : Dnet.requestParam.SENSE

				}

			});
		}
		
		this.addEvents(  "afterDoSaveSuccess"  );
		this.mixins.observable.constructor.call(this);
	},
	
 

	 initAssignement: function () {	 	 
	 	  this.params.clientId = getApplication().getSession().getClient().id;
		  this.doSetup();  //

	}
	// ***************************************************************************************
  // *************                           API INTERFACE                   ***************
  // ***************************************************************************************
    

	 ,doReset:
		function(){  this.doResetImpl();   }
	,doSetup:
		function(){  this.doSetupImpl();   }

    ,doCleanup:
		function(){  this.doCleanupImpl();   }

	 ,doSave:
		function(){  this.doSaveImpl();   }				    

	 ,doQueryLeft:
		function(){  this.doQueryLeftImpl();   }
	
	 ,doQueryRight:  
		function(){  this.doQueryRightImpl();   }		
	
	,doMoveRightAll:
		function(){  this.doMoveRightAllImpl();   }
	,doMoveLeftAll:  
		function(){  this.doMoveLeftAllImpl();   }
	
	,doMoveRight:  
		function(theLeftGrid, theRightGrid){  this.doMoveRightImpl(theLeftGrid, theRightGrid);   }
	,doMoveLeft:
		function(theLeftGrid, theRightGrid){  this.doMoveLeftImpl(theLeftGrid, theRightGrid);   }
	

	, getStore:function(side){
	   if (side=="left") { return this.storeLeft; }
	      if (side=="right") { return this.storeRight; }
	}

  /****************************************************************************/
  /*************************  IMPLEMENTATION => private functions *************/
  /****************************************************************************/
   ,doMoveRightImpl: function(theLeftGrid, theRightGrid) {
   	  	var selection = theLeftGrid.getSelectionModel().getSelection();
   		if (selection.length == 0 ) {
   			 return;
   		}
   		var p_selected_ids = "";
   		for (var i=0; i< selection.length; i++) {
   			p_selected_ids += (i>0) ? ",":"";
   			p_selected_ids += selection[i].data.id;
   		}
   		var p = Ext.apply({p_selected_ids: p_selected_ids}, this.params );
   		Ext.Ajax.request({
		     params:p
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
				,success:this.afterMoveRightSuccess
		    ,scope:this
		    ,url:Dnet.asgnUrl+"/"+this.dsName+".json?action=moveRight"
		    ,timeout:600000
		    ,options:{
					 action: "moveRight"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});
  }
  ,afterMoveRightSuccess: function(response,options) {
		this.doQueryLeft();this.doQueryRight();
	

		}

  ,doMoveLeftImpl: function(theLeftGrid, theRightGrid) {
  	var selection = theRightGrid.getSelectionModel().getSelection();
   		if (selection.length == 0 ) {
   			 return;
   		}
   		var p_selected_ids = "";
   		for (var i=0; i< selection.length; i++) {
   			p_selected_ids += (i>0) ? ",":"";
   			p_selected_ids += selection[i].data.id;
   		}
   		var p = Ext.apply({p_selected_ids: p_selected_ids}, this.params );
   		Ext.Ajax.request({
		     params:p
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
				,success:this.afterMoveLeftSuccess
		    ,scope:this
		    ,url:Dnet.asgnUrl+"/"+this.dsName+".json?action=moveLeft"
		    ,timeout:600000
		    ,options:{
					 action: "moveLeft"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});
  
  
  }
  ,afterMoveLeftSuccess: function(response,options) {
		this.doQueryLeft();this.doQueryRight();
	 }





  ,doMoveRightAllImpl: function() {

		Ext.Ajax.request({
		     params:this.params
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
			,success:this.afterMoveRightAllSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=moveRightAll"
		    ,timeout:600000
		    ,options:{
					 action: "moveRightAll"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});
		//this.afterDoServiceFilter();
		this.log("end doSelectAllImpl...");  	  
  	}
	,afterMoveRightAllSuccess: function(response,options) {
		this.doQueryLeft();this.doQueryRight();

		}



  ,doMoveLeftAllImpl: function() {


		Ext.Ajax.request({
		     params:this.params
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
			,success:this.afterMoveLeftAllSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=moveLeftAll"
		    ,timeout:600000
		    ,options:{
					 action: "moveLeftAll"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});

  	}
  ,afterMoveLeftAllSuccess: function(response,options) {
		this.doQueryLeft();this.doQueryRight();

		}

   , doSetupImpl: function() {
		Ext.Ajax.request({
		     params:this.params
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
			,success:this.afterDoSetupSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=setup"
		    ,timeout:600000

		});
  	}

   , doCleanupImpl: function() {
		Ext.Ajax.request({
		     params:this.params
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
		//	,success:this.afterDoSetupSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=cleanup"
		    ,timeout:600000
		});
  	}



	,afterDoSetupSuccess: function(response, options) {		 
		 this.params["selectionId"] =  response.responseText; //r;
		 this.doQueryLeft();
	 	 this.doQueryRight();
	}




  , doResetImpl: function() {
		Ext.Ajax.request({
		     params:this.params
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
				,success:this.afterDoResetSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=reset"
		    ,timeout:600000
		    ,options:{
					 action: "doReset"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});
  	}
  	
  , afterDoResetSuccess: function(response, options) {
       this.doQueryLeft(); this.doQueryRight();     
    }

  , doSaveImpl: function() {
  	  
	  //if (!this.beforeDoServiceFilter() ) return false;
		Ext.Ajax.request({
		     params:this.params 
		    ,method:"POST"
		    ,failure:this.afterAjaxFailure
			,success:this.afterDoSaveSuccess
		    ,scope:this
		    ,url: Dnet.asgnUrl+"/"+this.dsName+".json?action=save"
		    ,timeout:600000
		    ,options:{
					 action: "doSave"
					,fnSuccess: null
					,fnSuccessScope:null
					,fnFailure: null
					,fnFailureScope:null
					,serviceName:name
				}
		});
		Ext.Msg.progress('Saving...');
		//this.afterDoServiceFilter();

  	}
  ,afterDoSaveSuccess: function(response,options) { 
	  Ext.Msg.hide();
      this.fireEvent("afterDoSaveSuccess", this);

    }	  	     
  ,doQueryLeftImpl: function() {    		 	  
  		 this.storeLeft.removeAll();	 
       var lp = {};       
       var data = {};        
       if (this.filter.left.field){    	   
    	   data[this.filter.left.field] = this.filter.left.value || '*';
    	}   
       lp.data =  Ext.encode(data);      
       lp[Dnet.requestParam.START] = 0;
       lp[Dnet.requestParam.SIZE] = this.tuning.fetchSize;
       Ext.apply(lp, this.params);
       var theCallback = function(recs,options,success){ //alert("in doQuery Callback");
		       		//if(success&&Ext.isArray(recs)&& recs.length>0){ //alert("in doQuery Callback res.length="+recs.length);
		       		//		this.setCurrentRecord(recs[0]); 
		       		//		this.setSelectedRecords([recs[0]]);
		       		//}
       		}
       		
       this.storeLeft.load({ params:lp,scope:this, callback:theCallback}); 
       return true;
    }
  
   ,doQueryRightImpl: function() { 	//alert("AbstractDc("+this.dsName+").doQueryImpl");  
  		 	  

  		 this.storeRight.removeAll();
       var lp = {};
       var data = {};        
       if (this.filter.right.field){    	   
    	   data[this.filter.right.field] = this.filter.right.value || '*';
    	}   
       lp.data =  Ext.encode(data);        
       lp[Dnet.requestParam.START] = 0;
       lp[Dnet.requestParam.SIZE] = this.tuning.fetchSize;
       Ext.apply(lp, this.params);
       var theCallback = function(recs,options,success){ //alert("in doQuery Callback");
		       		//if(success&&Ext.isArray(recs)&& recs.length>0){ //alert("in doQuery Callback res.length="+recs.length);
		       		//		this.setCurrentRecord(recs[0]); 
		       		//		this.setSelectedRecords([recs[0]]);
		       		//}
       		} 
       		
       this.storeRight.load({ params:lp,scope:this, callback:theCallback}); 
       return true;              
    }
  	/*********************************************************************************/
    /**************************   MISCELLANEOUS HELPERS  *****************************/
    /*********************************************************************************/
    
 , afterAjaxFailure: function(response , options) {
      	Ext.MessageBox.hide();
      	var msg = (response.responseText)?response.responseText.substr(0,2000):"No error message returned from server.";
      	Ext.Msg.show({
	          title: 'HTTP:'+response.status+' '+ response.statusText
	         ,msg: msg
	         ,buttons: Ext.Msg.OK				          
	         ,scope:this
	         ,icon: Ext.MessageBox.ERROR
	      });	 
	  }
	, proxyException: function(dataProxy, type, action , options , response , arg ) {  
				        if(type=="response") {
				        Ext.Msg.show({
				        	   title: 'HTTP:'+response.status+' '+ response.statusText
        												 ,msg: response.responseText.substr(0,1500)
			               ,buttons: Ext.Msg.OK
			               ,icon: Ext.MessageBox.ERROR
				        	});
				        } else {
				           alert(response.message.substr(0,1500));
				        }
		  }
		,log:function(m) {try {if (console) {console.log("Data-control `"+this.dsName+"`: "+m);}}catch(e){}}		
															  
});

