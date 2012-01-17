
Ext.define("dnet.core.dc.AbstractDcvTree", {
	extend:  "Ext.tree.Panel" ,
  
	 _columns_: null
	,_elems_ : null
	,_controller_: null

	,initComponent: function(config) {
        this._elems_ =  new Ext.util.MixedCollection();
        this._columns_ =  new Ext.util.MixedCollection();
		this._startDefine_();
		/* define columns */
        if (this._beforeDefineColumns_()) {
		   this._defineColumns_();
           this._afterDefineColumns_();
		}
		this._defineDefaultElements_();
		this._endDefine_();

		var cfg = {
           rootVisible:true
	      ,lines:false
	      ,autoScroll:true
	      ,useArrows:true
	      ,enableDD: true
	      ,selModel : new  Ext.tree.MultiSelectionModel({})
	      ,root: new Ext.tree.AsyncTreeNode({
	           text:'Hierarchy: Default'
	          ,expanded:false
	        })
	      ,tbar: [{
                   iconCls: 'icon-action-refresh'
                  ,tooltip: this._TEXT_REFRESH
                  ,handler: this.handler_ActionRefresh
                  ,scope: this
              }]
	     ,loader: new Ext.tree.TreeLoader({
          	 preloadChildren: false
          	,nodeParameter: 'parentId'
          	,baseParams:{ hierarchyId : 3116 }
		    ,clearOnLoad: false
		    ,dataUrl: Dnet.dsAPI("OrganizationHierarchyItem","json").read

		    //,directFn: function() {
    	  	//	return dnet.menu.MbMainNavMenu().items;
    	  //	}
		    //,requestMethod: "GET"
   	    })
		}

		Ext.apply(cfg.loader, {
			processResponse : function(response, node, callback, scope){
		        var json = response.responseText;
		        try {
		            var o = response.responseData || Ext.decode(json);
		            o = o.data;
		            node.beginUpdate();
		            for(var i = 0, len = o.length; i < len; i++){
						o[i]["text"] = o[i]["organizationCode"];
	
		                var n = this.createNode(o[i]);
		                if(n){
		                    node.appendChild(n);
		                }
		            }
		            node.endUpdate();
		            this.runCallback(callback, scope || node, [node]);
		        }catch(e){
		            this.handleFailure(response);
		        }
	        }
	        ,requestData : function(node, callback, scope){
		        if(this.fireEvent("beforeload", this, node, callback) !== false){
		            if(this.directFn){
		                var args = this.getParams(node);
		                args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
		                this.directFn.apply(window, args);
		            }else{
						var p = this.getParams(node);
						if (!Ext.isNumber (p[this.nodeParameter]) ) {
                            p[this.nodeParameter] = '';
						}
		                this.transId = Ext.Ajax.request({
		                    method:this.requestMethod,
		                    url: this.dataUrl||this.url,
		                    success: this.handleResponse,
		                    failure: this.handleFailure,
		                    scope: this,
		                    argument: {callback: callback, node: node, scope: scope},
		                    params: {data: Ext.encode( p ) }
		                });
		            }
		        }else{
		            // if the load is cancelled, make sure we notify
		            // the node that we are done
		            this.runCallback(callback, scope || node, []);
		        }
		    }
	    });

		cfg.loader.on('load' , this._onLoad_ , this);
		cfg.loader.on('beforeload' , this._beforeLoad_ , this);
		Ext.apply(cfg,config);
        Ext.apply(this,cfg);
		this.callParent(arguments);
 
	}
    , handler_ActionRefresh : function() {  //this.fireEvent("refreshCatalog", this );
	     var node = this.getRootNode() ;
		 while(node.firstChild){
                node.removeChild(node.firstChild);
            }
		 this.getLoader().load( this.getRootNode() );
	}


    ,_onLoad_: function(loader, node, response ) {
        response = response.data;
	}
    ,_beforeLoad_: function(loader, node, callback ) {
       // response = response.data;
	}

    ,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

    ,_startDefine_: function () {}
    ,_endDefine_: function () {}

    ,_defineColumns_: function () {}
    	,_beforeDefineColumns_: function () {return true;}
    	,_afterDefineColumns_: function () {}

	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

   	,_defineDefaultElements_: function () {
 	}



	,_onStoreLoad_: function(store,records,options) {
         if(!this._noExport_) {
             if( store.getCount()>0) {
	         	this._getElement_("_btnExport_").enable();
			 } else {
				this._getElement_("_btnExport_").disable();
			 }
		 }

		// this._getElement_("_btnSave_").disable();
	}
	,_afterEdit_: function(e) {
         //this._getElement_("_btnSave_").enable();
	}
    	/* get value from resource bundle for the specified key*/
	,_getRBValue_: function(k) {
		if (this._trl_ != null && this._trl_[k]) { return this._trl_[k]; }
		if (this._controller_._trl_ != null && this._controller_._trl_[k]) {
			return  this._controller_._trl_[k];
		} else {
			return k; 
		}
	}

});