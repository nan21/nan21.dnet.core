
Ext.ns("dnet.base");
dnet.base.FrameBuilder = function(config) {		
	this.frame = null; 
	Ext.apply(this,config);	 	
};
 

dnet.base.FrameBuilder.prototype =  {
	 
	addDc: function(name, obj) {
		this.frame._dcs_.add(name, obj);	
		return this;
	}
	
	,linkDc: function(childName, parentName, relation) {
		Ext.applyIf(relation, {fetchMode:"auto", strict: true});
		var c = this.frame._dcs_.get(childName);
		var p = this.frame._dcs_.get(parentName);
		var ctx = new dnet.base.DcContext({
			 childDc:c
			,parentDc:p
			,relation:relation});
		p.addChild(c);c.setDcContext(ctx);
		return this;
	}


	,addDcFormView: function(dc, config) {	
		this.addDcView(dc, config);	
		var theDc = this.frame._dcs_.get(dc);
		var viewId = config.id;
		theDc.addBindedView(viewId, "edit-form");
		theDc.isRecordValid = theDc.isRecordValid.createInterceptor(function() {
			var c = Ext.getCmp(viewId);
			if (c) {
				return c.getForm().isValid();
			} else return true;			 
		} );
		return this;
	}
	,addDcFilterFormView: function(dc, config) {	
		this.addDcView(dc, config);	
		var theDc = this.frame._dcs_.get(dc);
		var viewId = config.id;
		theDc.addBindedView(config.id, "filter-form");
		theDc.isFilterValid = theDc.isFilterValid.createInterceptor(function() {
			var c = Ext.getCmp(viewId);
			if (c) {
				return c.getForm().isValid();
			} else return true;			
		} );
		return this;
	} 
	,addDcListView: function(dc, config) {	
		return this.addDcView(dc, config);
	} 
	,addDcView: function(dc, config) {	
		Ext.apply(config, {
			_controller_:this.frame._dcs_.get(dc)
			,listeners:{ activate:{scope:this,fn:function(p){p.doLayout(false,true);} } }
		});
		this.applyViewSharedConfig(config);				
		return this;
	} 
 
	,addPanel:function(config) {
		config.listeners = config.listeners || {};
		Ext.applyIf(config.listeners, {			 
			 activate:{scope:this,fn:function(p){p.doLayout(false,true);}  }
		});
		//this.fireEvent('canvaschange', p); for canvas
		this.applyViewSharedConfig(config);	
		return this;
	}

	,addChildrenTo: function(c,list,regions) {
		var isWrapped = this.frame._elems_.get(c)._wrapped_;
		var items = ((isWrapped)? this.frame._elems_.get(c)["items"]["items"]:this.frame._elems_.get(c)["items"] )|| [];
		for(var i=0, len=list.length; i<len; i++ ) {
			var cmp = this.frame._elems_.get(list[i]);
			items[items.length] = cmp;
			if (regions){
				cmp.region = regions[i];
			}
		}
		if(isWrapped) {
			this.frame._elems_.get(c)["items"]["items"] = items;
		} else {
			this.frame._elems_.get(c)["items"] = items;
		}
		
		return this;
	}
	
	,addToolbarTo: function(c,tlb) {
		this.frame._linkToolbar_(tlb, c); 
		return this;
	}
 
	// private

	,applyViewSharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id()
		});				 
		this.frame._elems_.add(config.name, config);
	}
	
	,beginToolbar: function(name, config) {
		return new dnet.base.ActionBuilder({name:name, frame:this.frame, dc: config.dc});
	}
	
	,addToc: function(canvases) {
		var data = [];
		for(var i=0;i<canvases.length;i++) {
			data[i] = [canvases[i], this.frame._elems_.get(canvases[i]).title];			
		}
		var config = {
				name:"_toc_", collapsible: true, layout:"fit", id:Ext.id(),
				region:"west", title: 'Navigation', width: 250, header:true, frame:false
				, items:[{
					 name: "_toc_items_", xtype: 'listview',id:Ext.id()
					,hideHeaders:true
					,autoScroll:true
					,singleSelect: true					 
					,store: new Ext.data.ArrayStore({					    
					    autoDestroy: true,					     
					    idIndex: 0,  
					    fields: [					        
					       {name: 'name', type: 'string'},
					       {name: 'title', type: 'string'},					       
					    ], 
					    data: data
					     
					})				
					,columns: [ {
				        header: 'title',				        
				        dataIndex: 'title'
				    }]				    
				    ,listeners: {scope:this.frame, 
		            	selectionchange: function(view, nodes) {
							this._showStackedViewElement_("main", view.getRecord(nodes[0]).data.name);			 
		            	} 
						,afterrender: function() {
							this._showTocElement_(0);			 
		            	}   
		        	}
				}]
				
			} 
		this.frame._elems_.add(config.name, config);
		return this;
	} 
	
	
	,addButton: function(config) {		
		Ext.applyIf(config , {id:Ext.id(), xtype:"button"} );
		this.frame._elems_.add(config.name, config);
		if (config.stateManager ) {
			var options = {and:config.stateManager.and };
			dnet.base.FrameButtonStateManager.register(config.name, config.stateManager.name, config.stateManager.dc, this.frame, options );
		}
		return this;
	} 
	
	,addAsgn: function(config) {	 
		Ext.applyIf(config,{ id:Ext.id(), objectIdField: "id"  } );
		this.frame._elems_.add(config.name, config);
		return this;
	} 
	,add: function(config) {
		Ext.applyIf(config,{ id:Ext.id()} );
		this.frame._elems_.add(name, config);
		return this;
	}
	,merge: function(name, config) {
		Ext.applyIf(this.frame._elems_.get(name) , config );
		return this;
	}
	,change: function(name, config) {
		Ext.apply(this.frame._elems_.get(name) , config );
		return this;
	}
	,remove: function(name) {
		this.frame._elems_.remove(name);
		return this;
	}
	
	
};