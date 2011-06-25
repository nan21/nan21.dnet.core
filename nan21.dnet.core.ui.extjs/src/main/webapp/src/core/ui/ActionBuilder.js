

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
	
	
	
	
	
	,addEditSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "edit_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: true
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-edit"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc)._checkCanDoEdit_();
					var cv = this._configVars_.get(cfg.tlb+"__"+cfg.name); 
					if (cv) {
						this._showStackedViewElement_(cv.container,cv.item);
					}else { 
						this._getElement_("main").getLayout().setActiveItem(1);
					} 
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		this.frame._getDc_(cfg.dc).on("onEdit", function() {
				this._invokeTlbItem_(cfg.tlb+"__"+name);
				} , this.frame);
		return this;
		
	}
	
	,addCopySr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "copy_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: true
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-copy"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc).doCopy();
					this._invokeTlbItem_(cfg.tlb+"__edit_sr");
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
			
			
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		return this;
		
	}
 
	,addDeleteSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "delete_selected_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: true
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-delete"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc).confirmDeleteSelection(); 
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
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
		
		
		this.frame._getDc_(cfg.dc).on("inContextOfNewRecord" , function() {
			 var t = this._tlbitms_.filterBy(  function(o,k) {return (k.indexOf(cfg.tlb+"__") != -1); }  );
			 t.eachKey( function(k) { try {this._tlbitms_.get(k).disable();} catch(e) {} } ,this);
		  } , this.frame );

		this.frame._getDc_("region").on("inContextOfEditRecord" , function() {
            if(this._tlbitms_.get(cfg.tlb+"__load")) this._tlbitms_.get(cfg.tlb+"__load").enable();
            if(this._tlbitms_.get(cfg.tlb+"__new_sr"))this._tlbitms_.get(cfg.tlb+"__new_sr").enable();
            if(this._tlbitms_.get(cfg.tlb+"__new_mr"))this._tlbitms_.get(cfg.tlb+"__new_mr").enable();
		  } , this.frame );
		  

		this.frame._getDc_("region").on("dirtyRecord" , function() {
	  			if(this._tlbitms_.get(cfg.tlb+"__back_sr")) this._tlbitms_.get(cfg.tlb+"__back_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__save")) this._tlbitms_.get(cfg.tlb+"__save").enable();
               if(this._tlbitms_.get(cfg.tlb+"__new_sr")) this._tlbitms_.get(cfg.tlb+"__new_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__copy_sr")) this._tlbitms_.get(cfg.tlb+"__copy_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__rollback_record_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_record_sr").enable();
               if(this._tlbitms_.get(cfg.tlb+"__rollback_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_sr").enable();

               if(this._tlbitms_.get(cfg.tlb+"__prev_rec_sr")) this._tlbitms_.get(cfg.tlb+"__prev_rec_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__next_rec_sr")) this._tlbitms_.get(cfg.tlb+"__next_rec_sr").disable();
		  } , this.frame );

		this.frame._getDc_("region").on("cleanRecord" , function() {
	  		  if (this._getDc_("region").isDirty() ) {
               if(this._tlbitms_.get(cfg.tlb+"__back_sr")) this._tlbitms_.get(cfg.tlb+"__back_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__save")) this._tlbitms_.get(cfg.tlb+"__save").enable();
               if(this._tlbitms_.get(cfg.tlb+"__new_sr")) this._tlbitms_.get(cfg.tlb+"__new_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__copy_sr")) this._tlbitms_.get(cfg.tlb+"__copy_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__rollback_record_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_record_sr").enable();
               if(this._tlbitms_.get(cfg.tlb+"__rollback_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_sr").enable();
               if(this._tlbitms_.get(cfg.tlb+"__prev_rec_sr")) this._tlbitms_.get(cfg.tlb+"__prev_rec_sr").disable();
               if(this._tlbitms_.get(cfg.tlb+"__next_rec_sr")) this._tlbitms_.get(cfg.tlb+"__next_rec_sr").disable();
			  }  else {
             	if(this._tlbitms_.get(cfg.tlb+"__back_sr")) this._tlbitms_.get(cfg.tlb+"__back_sr").enable();
             	if(this._tlbitms_.get(cfg.tlb+"__save")) this._tlbitms_.get(cfg.tlb+"__save").disable();
             	if(this._tlbitms_.get(cfg.tlb+"__new_sr")) this._tlbitms_.get(cfg.tlb+"__new_sr").enable();
             	if(this._tlbitms_.get(cfg.tlb+"__copy_sr")) this._tlbitms_.get(cfg.tlb+"__copy_sr").enable();
             	if(this._tlbitms_.get(cfg.tlb+"__rollback_record_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_record_sr").disable();
             	if(this._tlbitms_.get(cfg.tlb+"__rollback_sr")) this._tlbitms_.get(cfg.tlb+"__rollback_sr").disable();
             	if(this._tlbitms_.get(cfg.tlb+"__prev_rec_sr")) this._tlbitms_.get(cfg.tlb+"__prev_rec_sr").enable();
               if(this._tlbitms_.get(cfg.tlb+"__next_rec_sr")) this._tlbitms_.get(cfg.tlb+"__next_rec_sr").enable();
			  }
			   } , this.frame );
		this.frame._getDc_("region").on("afterCurrentRecordChange" , function() {
             	if(this._tlbitms_.get(cfg.tlb+"__copy_sr")) this._tlbitms_.get(cfg.tlb+"__copy_sr").enable();
			   } , this.frame );
		
		
		
		return this;	
	}
	
	
	,addRollbackSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "rollback_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: true
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-rollback"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {										 
					if(this._getDc_(cfg.dc).getCurrentRecord().phantom) {
						this._getDc_(cfg.dc).discardChanges();
						this._invokeTlbItem_(cfg.tlb+"__back_sr");
					} else  {
						this._getDc_(cfg.dc).discardChanges();
					} 				 
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		return this;	
	}
 
	
	,addPrevSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "prev_rec_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: false
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-previous"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc).setPreviousAsCurrent();					 			
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		return this;	
	}
 
	,addNextSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "next_rec_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: false
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-next"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc).setNextAsCurrent();					 			
				} catch(e) { 
					dnet.base.DcExceptions.showMessage(e);
				}
			};
			cfg.handler = fn;	
		this.frame._tlbitms_.add(this.name+"__"+cfg.name, new Ext.Action(cfg)); 
		return this;	
	}
	
	,addBackSr: function(config) {
		var cfg = config||{};
		var name = cfg.name || "back_sr";
		Ext.applyIf(cfg, { id:Ext.id(), _name_:name, name:name, disabled: false
			,text:Dnet.translate("tlbitem", name+"__lbl")
			,tooltip: Dnet.translate("tlbitem", name+"__tlp")
			,iconCls: "icon-action-back"
			,scope:	this.frame
			,dc: this.dc
			,tlb: this.name
		});
		var fn = function() {
				try {
					this._getDc_(cfg.dc)._checkCanChangeCurrentRecord_();
					var cv = this._configVars_.get(cfg.tlb+"__back_sr"); 
					if (cv) {
						this._showStackedViewElement_(cv.container,cv.item);
					}else {
						this._getElement_("main").getLayout().setActiveItem(0);
					}				 			
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