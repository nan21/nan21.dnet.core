
Ext.ns("dnet.base");
dnet.base.AbstractAsgn = function(config) {

  	//this.dsName = null
	this.storeLeft = null
	this.storeRight = null
	//this.recordFields = null;

	this.tuning = {
			 queryDelay: 150 // nr of milliseconds before execute the query. Used if value>0	
			,fetchSize: 30
		};

	this.params = {objectId : 8, selectionId : 0, clientId: null }
	this.filter = {
	      left:{field:null, value:null}
	     ,right:{field:null, value:null}
	}

	Ext.apply(this,config);

	if (this.storeLeft == null) {
		this.storeLeft = new Ext.data.Store({
	        remoteSort:true,pruneModifiedRecords:true
	       ,proxy: new Ext.data.HttpProxy({
			        api: Dnet.asgnLeftAPI(this.dsName,"json")
			    })
 			,reader: new Ext.data.JsonReader(
			   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
					,Ext.data.Record.create(this.recordFields))
	       , writer: new Ext.data.JsonWriter({ encode: true, writeAllFields: true })  
	       , autoSave: false
	       , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
	    });		
	}
	
	if (this.storeRight == null) {
		this.storeRight = new Ext.data.Store({
	        remoteSort:true,pruneModifiedRecords:true
	       ,proxy: new Ext.data.HttpProxy({
			        api: Dnet.asgnRightAPI(this.dsName,"json")
			    })
 			,reader: new Ext.data.JsonReader(
			   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
					,Ext.data.Record.create( this.recordFields ))
	       , writer: new Ext.data.JsonWriter({ encode: true, writeAllFields: true })  
	       , autoSave: false
	       , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
	    });
	}
	
	this.addEvents(  "afterDoSaveSuccess"  );
	dnet.base.AbstractAsgn.superclass.constructor.call(this, config);

   // dnet.base.AbstractAsgn.superclass.constructor.call(this, config);

   // this._setup_();

}


Ext.extend(dnet.base.AbstractAsgn, Ext.util.Observable, {
	//constructor: function(config) {

	//}   

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
   	  	var selection = theLeftGrid.getSelectionModel().getSelections();
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
  	var selection = theRightGrid.getSelectionModel().getSelections();
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
		 //var r = Ext.util.JSON.decode(response.responseText);
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
		//this.afterDoServiceFilter();

  	}
  ,afterDoSaveSuccess: function(response,options) { return;
      var r = Ext.util.JSON.decode(response.responseText);
          if( !Ext.isEmpty(r.message) ) {
          	Ext.Msg.show({title:'Server message'
				         ,msg: r.message.substr(0,1000)
				         ,buttons: Ext.Msg.OK				          
				         ,scope:this
				         ,icon: ( r.success )?Ext.MessageBox.INFO:Ext.MessageBox.WARNING
				      });
          }
        if(r.success) {
        	var rr = Ext.util.JSON.decode(response.responseText);        	   
        	 var pp = rr["params"];
        	 for(var p in pp) {
        	 	 this.params[p] = pp[p];
        	 }
        }
      this.fireEvent("afterDoSaveSuccess", this);

    }	  	     
  ,doQueryLeftImpl: function() {    		 	  
  		 this.storeLeft.removeAll();	 
       var lp = {};       
       var data = {};        
       if (this.filter.left.field){    	   
    	   data[this.filter.left.field] = this.filter.left.value;
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
    	   data[this.filter.right.field] = this.filter.right.value;
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
      	Ext.Msg.show({
	          title: 'HTTP:'+response.status+' '+ response.statusText
	         ,msg: response.responseText.substr(0,2000)
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

