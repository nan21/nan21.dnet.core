Ext.define('dnet.core.ui.FrameBuilder$TocModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'name',
		type : 'string'
	}, {
		name : 'title',
		type : 'string'
	}]
});
 
Ext.define("dnet.core.ui.FrameBuilder" , {
	
	/**
	 * 
	 * @type dnet.core.ui.AbstractUi
	 */
	frame : null,
	
	constructor : function(config) {
        config = config || {};
        Ext.apply(this, config);
        this.callParent(arguments);
    },

	addDc: function(name, obj) {
		this.frame._dcs_.add(name, obj);
		obj._instanceKey_ = name;
		return this;
	},
	
	linkDc: function(childName, parentName, relation) {
		Ext.applyIf(relation, {fetchMode:"manual", strict: true});
		var c = this.frame._dcs_.get(childName);
		var p = this.frame._dcs_.get(parentName);
		var ctx = new dnet.core.dc.DcContext({
			 childDc:c
			,parentDc:p
			,relation:relation});
		p.addChild(c);c.setDcContext(ctx);
		return this;
	},
	
	addDcFormView: function(dc, config) {	
		this.addDcView(dc, config);	
		var theDc = this.frame._dcs_.get(dc);
		var viewId = config.id;
		return this;
	},
	
	
	addDcFilterFormView: function(dc, config) {	
		var ttlKey = config.name + "__ttl";
		if (config.title && this.frame._trl_ && this.frame._trl_[ttlKey]) {
			config.title = this.frame._trl_[ttlKey];
		}
		this.addDcView(dc, config);	
		var theDc = this.frame._dcs_.get(dc);
		var viewId = config.id;
		return this;
	},
	
	addDcGridView: function(dc, config) {		 
		config.stateId = this.frame.$className + "-"+ config.name;
		if (getApplication().getSession().rememberViewState) {
			config.stateful = true;
		}
		return this.addDcView(dc, config);
	},
	
	addDcEditGridView: function(dc, config) {
		return this.addDcGridView(dc, config);
	},
	
	addDcView: function(dc, config) {	
		Ext.apply(config, {
			_controller_:this.frame._dcs_.get(dc)
			//,listeners:{ activate:{scope:this,fn:function(p){p.doLayout(false,true);} } }
		});
		var ttlKey = config.name + "__ttl";
		if (config.title && this.frame._trl_ && this.frame._trl_[ttlKey]) {
			config.title = this.frame._trl_[ttlKey];
		}
		this.applyViewSharedConfig(config);				
		return this;
	},
	
	
	addPanel:function(config) {
		config.listeners = config.listeners || {};
		if (config.onActivateDoLayoutFor) {
			var onActivateDoLayoutFor = config.onActivateDoLayoutFor;
			delete config.onActivateDoLayoutFor;
			var activate = {
				scope:this.frame,
				fn:function(cmp,opt){ 
					for (var i=0;i<onActivateDoLayoutFor.length;i++) {  
						var e = this._getElement_(onActivateDoLayoutFor[i]);
						// workaround for the dissapearing scrollbars when returning from an editor after a new+ cancel combination  
						if (e instanceof dnet.core.dc.AbstractDcvGrid) {
							//alert(onActivateDoLayoutFor[i] + " instanceof dnet.core.dc.AbstractDcvGrid");
							//e.getView().refresh();
							//e.determineScrollbars( );
							e.getView().refresh();
							e.invalidateScroller();
						} else {
							e.doLayout(); 
						}
						
					} 
				}
			}	
			if (!config.listeners.activate) {
				config.listeners.activate = activate;
			}
		}
		Ext.applyIf(config, {
			 
			id: Ext.id()			
		});
		var ttlKey = config.name + "__ttl";
		  
		if (config.title && this.frame._trl_ && this.frame._trl_[ttlKey]) {
			config.title = this.frame._trl_[ttlKey];
		}
		this.applyViewSharedConfig(config);	
		return this;
	},
	
	
	addChildrenTo: function(c,list,regions) {
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
			id:Ext.id(), itemId: config.name
		});				 
		this.frame._elems_.add(config.name, config);
	}
	
	,beginToolbar: function(name, config) {
		return new dnet.core.ui.ActionBuilder({name:name , frame:this.frame, dc: config.dc});
	}
	
	,addToc: function(canvases) {
		var data = [];
		for(var i=0;i<canvases.length;i++) {
			data[i] = { "name": canvases[i], "title":this.frame._elems_.get(canvases[i]).title } ;			
		}
		var store = Ext.create( 'Ext.data.Store', {
			model: 'dnet.core.ui.FrameBuilder$TocModel',
			data: data			 
		});
		
		var config = {
				name:"_toc_", collapsible: true, layout:"fit", id:Ext.id(),
				region:"west", title: 'Navigation', width: 200, frame:false
				, items:[{
					 name: "_toc_items_", xtype: 'gridpanel',id:Ext.id()
					,hideHeaders:true
					,autoScroll:true
					,viewConfig: {
						stripeRows: false
					}					 					 
					,singleSelect: true
					,forceFit: true
					,store: store			
					,columns: [ {
				        header: 'title',				        
				        dataIndex: 'title'
				    }]
				   , selModel :  {
						mode: "SINGLE",
						listeners : {
							 
							"selectionchange" : {
								scope : this.frame,
								fn : function(sm,selected, options) {
									if(this._getElement_("main").rendered) {
										this._showStackedViewElement_("main", selected[0].data.name);	
									} 									
								}
							}
						}
					},
				    listeners: {scope:this.frame, 
		            	 
						 afterrender: function() {
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
		var ttlKey = config.name + "__ttl";
		var descKey = config.name + "__desc";
		
		if (config.text && this.frame._trl_ && this.frame._trl_[ttlKey]) {
			config.text = this.frame._trl_[ttlKey];
		}
		if (config.tooltip && this.frame._trl_ && this.frame._trl_[descKey]) {
			config.tooltip = this.frame._trl_[descKey];
		}		
		this.frame._elems_.add(config.name, config);
		if (config.stateManager ) {
			var options = {and:config.stateManager.and };
			if (options.and) {
				this.frame._buttonStateRules_[config.name] = options.and;
			}
			dnet.core.ui.FrameButtonStateManager.register(config.name, config.stateManager.name, config.stateManager.dc, this.frame, options );
		}
		return this;
	} 
	
	,addAsgn: function(config) {	 
		Ext.applyIf(config,{ id:Ext.id(), objectIdField: "id"  } );
		this.frame._elems_.add(config.name, config);
		return this;
	},  
	
	addWindow: function(config) {
		Ext.applyIf(config,{ id:Ext.id(),_window_:true} );
		var ttlKey = config.name + "__ttl";
		  
		if (config.title && this.frame._trl_ && this.frame._trl_[ttlKey]) {
			config.title = this.frame._trl_[ttlKey];
		}
		
		this.frame._elems_.add(config.name, config);
		return this;
	}
	,add: function(config) {
		Ext.applyIf(config,{ id:Ext.id()} );
		this.frame._elems_.add(config.name, config);
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
	
	
});