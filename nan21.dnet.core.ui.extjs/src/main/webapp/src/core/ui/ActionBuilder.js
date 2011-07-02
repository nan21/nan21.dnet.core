

Ext.ns("dnet.base");
dnet.base.ActionBuilder = function(config) {		
	this.frame = null; 
	this.name = null;
	this.dc = null;
	this.sepIdx = null;
	//this._tlbitms_ = null;
	Ext.apply(this,config);
	this.setup();
};
 

dnet.base.ActionBuilder.prototype =  {
	setup:function() {
		//this.frame._tlbitms_ = new Ext.util.MixedCollection();
	}
 
	,addQuery: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });		  
		var a = this.frame._getDc_(cfg.dc).actions.doQuery;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	,addNew: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc, tlb:this.name, autoEdit:true });		  
		var a = this.frame._getDc_(cfg.dc).actions.doNew;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)
		if (cfg.autoEdit) {
			this.frame._getDc_(cfg.dc).on('afterDoNew', function() {
				this._invokeTlbItem_("doEdit", cfg.tlb);
			}, this.frame);
		}		
		return this;		
	}
	
	,addCopy: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });		  
		var a = this.frame._getDc_(cfg.dc).actions.doCopy;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	,addDeleteSelected: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });		  
		var a = this.frame._getDc_(cfg.dc).actions.doDeleteSelected;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	,addEdit: function(config) {
		var cfg = config||{};		 
		Ext.applyIf(cfg, { dc: this.dc, tlb:this.name});	
		var fn = function() {
			try {					
				//this._getDc_(cfg.dc).doEdit();
				var ct = (cfg.inContainer )? this._getElement_(cfg.inContainer):this._getElement_(this._mainViewName_);				
				if (cfg.showView ) {
					ct.getLayout().setActiveItem( this._getElementConfig_(cfg.showView).id );				
				} else {
					ct.getLayout().setActiveItem(1);
				}
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doEdit;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);
		
		this.frame._getDc_(cfg.dc).on("onEdit", function() {
			this._invokeTlbItem_("doEdit", cfg.tlb);			
		} , this.frame);
		return this;
	}
	
	,addCancel: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc, tlb:this.name, autoBack:true });		  
		var a = this.frame._getDc_(cfg.dc).actions.doCancel;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a); 
		if (cfg.autoBack) {
			this.frame._getDc_(cfg.dc).on('recordChanged', function(event) {
				if(event.record ==null) {
					this._invokeTlbItem_("doBack", cfg.tlb);
				}				
			}, this.frame);
		}		
		return this;		 
	}
	
	
	,addPrevRec: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });		  
		var a = this.frame._getDc_(cfg.dc).actions.doPrevRec;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	,addNextRec: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });		  
		var a = this.frame._getDc_(cfg.dc).actions.doNextRec;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	 
     
	,addSave: function(config) {
		var cfg = config||{};		
		Ext.applyIf(cfg, { dc: this.dc });	
		var a = this.frame._getDc_(cfg.dc).actions.doSave;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);    
		return this;	
	}
	
	,addSeparator: function() {
		if(this.sepIdx == null) {
			this.sepIdx = 0;
		}
		this.frame._tlbitms_.add(this.name+"___S"+(this.sepIdx++)+"_", "-") ;
		return this;
	}
	,end:function() {
		var n = this.name;
		var t=this.frame._tlbitms_.filterBy( 
				function(o,k) {
					return (k.indexOf(n+"__") != -1); 
				} )
		this.frame._tlbs_.add(this.name , t.getRange() ); 
		return this.frame._getBuilder_();
	} 
	
	,addBack: function(config) {
		var cfg = config||{};
		Ext.applyIf(cfg,{
			 name:"doBack",iconCls: "icon-action-back", disabled: false, id:Ext.id()
       		,text: Dnet.translate("tlbitem", "back__lbl")
   			,tooltip: Dnet.translate("tlbitem", "back__tlp")    			
		});			
		var fn = function() {
			try {					
				var ct = (cfg.inContainer )? this._getElement_(cfg.inContainer):this._getElement_(this._mainViewName_);				
				if (cfg.showView ) {
					ct.getLayout().setActiveItem( this._getElementConfig_(cfg.showView).id );				
				} else {
					ct.getLayout().setActiveItem(0);
				}
				 
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		}
		cfg.handler = fn;
		cfg.scope=this.frame;
		//Ext.applyIf(cfg, { dc: this.dc });	
		var a = new Ext.Action(cfg) ;
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);    
		return this;	
	}
 
	
}