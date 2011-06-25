

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
		Ext.applyIf(cfg, { dc: this.dc});	
		var fn = function() {
			try {					
				this._getDc_(cfg.dc).doNew(); 
				//this._invokeTlbItem_(cfg.tlb+"__edit_sr");
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doNew;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name , a);  //new Ext.Action(cfg)	
		return this;
	}
	
	,addCopy: function(config) {
		var cfg = config||{};		 
		Ext.applyIf(cfg, { dc: this.dc});	
		var fn = function() {
			try {					
				this._getDc_(cfg.dc).doCopy(); 
				//this._invokeTlbItem_(cfg.tlb+"__edit_sr");
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doCopy;
		a.setHandler(fn, this.frame);
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
		Ext.applyIf(cfg, { dc: this.dc});	
		var fn = function() {
			try {					
				//this._getDc_(cfg.dc).doEdit(); 
				//this._invokeTlbItem_(cfg.tlb+"__edit_sr");
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doEdit;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
		return this;
	}
	
	,addCancel: function(config) {
		var cfg = config||{};		 
		Ext.applyIf(cfg, { dc: this.dc});	
		var fn = function() {
			try {					
				//this._getDc_(cfg.dc).doEdit(); 
				//this._invokeTlbItem_(cfg.tlb+"__edit_sr");
			} catch(e) { 
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doCancel;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name+"__"+a.initialConfig.name, a);  //new Ext.Action(cfg)	
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
		var name = cfg.name || "save";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: true
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-save"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {										 
					this._getDc_(cfg.dc).doSave(); 					 
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		 
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
	} 
	
	
	
	
	
	
	
	
	
	
}