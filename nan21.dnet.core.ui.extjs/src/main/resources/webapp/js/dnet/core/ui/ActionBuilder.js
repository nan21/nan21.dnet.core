
/*
Ext.override(Ext.layout.component.AbstractDock, {
	afterRemove : function(item) {
		this.callParent(arguments);
		if (this.itemCls) {
			item.el.removeCls(this.itemCls + '-' + item.dock);
		}
		var dom = item.el.dom;
		if (!item.destroying && dom) {
			if (dom.parentNode) {
				dom.parentNode.removeChild(dom);
			}			
		}
		this.childrenChanged = true;
	}

});
*/


Ext.define("dnet.core.ui.ActionBuilder", {
	
	/**
	 * 
	 * @type dnet.core.ui.AbstractUi
	 */
	frame : null,
	name : null,
	 
	dc : null,
	sepIdx : null,

	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.callParent(arguments);
	},

	setup : function() {
		// this.frame._tlbitms_ = new Ext.util.MixedCollection();
	},

	addLabel : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc,
					xtype : "label",
					cls : "dnet-toolbar-label"
				});
		this.frame._tlbitms_.add(this.name + "__" + config.name, config);
		return this;
	},

	addTitle : function(config) {
		var cfg = config || {};		
		Ext.applyIf(cfg, {
					dc : this.dc,
					xtype : "label",
					name : "title",	
					height:20,
					cls : "dnet-toolbar-title"
				});
		if (cfg.text && this.frame._trl_ && this.frame._trl_[this.name + "__ttl"]) {
			cfg.text = this.frame._trl_[this.name + "__ttl"];
		}		
		this.frame._tlbitms_.add(this.name + "__" + cfg.name, cfg);
		if (this.frame._tlbtitles_ == null ) {
			this.frame._tlbtitles_ = new Ext.util.MixedCollection();
		}
		this.frame._tlbtitles_.add(this.name, cfg.text);
		 
		return this;
	},
	addQuery : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doQuery;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},
	addNew : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc,
					tlb : this.name,
					autoEdit : true
				});
		var a = this.frame._getDc_(cfg.dc).actions.doNew;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		if (cfg.autoEdit != "false") {
			this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew", function() {
						this._invokeTlbItem_("doEdit", cfg.tlb);
					}, this.frame);
		} else {
			if (!Ext.isEmpty(cfg.showView)) {
				var fn = function() {
					try {
						var ct = (cfg.inContainer) ? this
								._getElement_(cfg.inContainer) : this
								._getElement_("main");
						if (cfg.showView) {
							var cmp = this._get_(cfg.showView);
							if (cmp) {
								ct.getLayout().setActiveItem(cmp);
							} else {
								ct.getLayout().setActiveItem(this
										._getElementConfig_(cfg.showView).id);
							}
						} else {
							ct.getLayout().setActiveItem(1);
						}
					} catch (e) {
						dnet.core.dc.DcExceptions.showMessage(e);
					}
				};
				this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew", fn, this.frame);
			}
		}
		return this;
	},

	
	addCopy : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc,
					tlb : this.name,
					autoEdit : true
				});
		var a = this.frame._getDc_(cfg.dc).actions.doCopy;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		if (cfg.autoEdit != "false") {
			this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew", function() {
						this._invokeTlbItem_("doEdit", cfg.tlb);
					}, this.frame);
		} else {
			if (!Ext.isEmpty(cfg.showView)) {
				var fn = function() {
					try {
						var ct = (cfg.inContainer) ? this
								._getElement_(cfg.inContainer) : this
								._getElement_("main");
						if (cfg.showView) {
							var cmp = this._get_(cfg.showView);
							if (cmp) {
								ct.getLayout().setActiveItem(cmp);
							} else {
								ct.getLayout().setActiveItem(this
										._getElementConfig_(cfg.showView).id);
							}
						} else {
							ct.getLayout().setActiveItem(1);
						}
					} catch (e) {
						dnet.core.dc.DcExceptions.showMessage(e);
					}
				};
				this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew", fn, this.frame);
			}
		}
		return this;
	}
	
	,
	addCopy1 : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doCopy;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},
	addDeleteSelected : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doDelete;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},
	addEdit : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc,
					tlb : this.name
				});
		var fn = function() {
			try {
				var ct = (cfg.inContainer)
						? this._getElement_(cfg.inContainer)
						: this._getElement_("main");
				if (cfg.showView) {
					var cmp = this._get_(cfg.showView);
					if (cmp) {
						ct.getLayout().setActiveItem(cmp);
					} else {
						ct.getLayout().setActiveItem(this
								._getElementConfig_(cfg.showView).id);
					}
				} else {
					ct.getLayout().setActiveItem(1);
				}
			} catch (e) {
				dnet.core.dc.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doEditIn;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);

		this.frame.mon(this.frame._getDc_(cfg.dc), "onEdit", function() {
					this._invokeTlbItem_("doEdit", cfg.tlb);
				}, this.frame);
		return this;
	}

	,
	addCancel : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc,
					tlb : this.name,
					autoBack : true
				});
		var a = this.frame._getDc_(cfg.dc).actions.doCancel;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		if (cfg.autoBack) {
			this.frame.mon(this.frame._getDc_(cfg.dc), 'recordChanged', function(event) {
						if (event.record == null) {
							this._invokeTlbItem_("doBack", cfg.tlb);
						}
					}, this.frame);
		}
		return this;
	},

	addPrevRec : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doPrevRec;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
																				// Ext.Action(cfg)
		return this;
	},
	addNextRec : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doNextRec;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
																				// Ext.Action(cfg)
		return this;
	}

	,
	addAutoLoad : function() {
		var cfg = {
			name : "autoLoad",
			disabled : false,
			enableToggle : true,
			text : "Auto",
			tooltip : "Toogle auto-load mode (Load data automatically when parent record is changed)",
			scope : dc,
			handler : function(btn, evnt) {
				try {
					dc.dcContext.relation.fetchMode = (btn.pressed)
							? "auto"
							: "manual";
				} catch (e) {
					dnet.core.dc.DcExceptions.showMessage(e);
				}
			},
			dc : this.dc
		};

		var dc = this.frame._getDc_(cfg.dc);
		if (dc.dcContext.relation.fetchMode == "auto"
				|| dc.dcContext.relation.fetchMode == undefined) {
			cfg.pressed = true;
		};
		var a = new Ext.Action(cfg);
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
																				// Ext.Action(cfg)
		return this;
	},
	addSave : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
					dc : this.dc
				});
		var a = this.frame._getDc_(cfg.dc).actions.doSave;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	}

	,
	addSeparator : function() {
		if (this.sepIdx == null) {
			this.sepIdx = 0;
		}
		this.frame._tlbitms_.add(this.name + "___S" + (this.sepIdx++) + "_",
				"-");
		return this;
	},
	
	
	addReports: function() {
		if (this.frame._reports_ != null) {
			var r = [],
				rc = this.frame._reports_;
			 	
			for (var i=0, l=rc.length ;i<l;i++) {
				if (rc[i].toolbar == this.name) {
					
					 
//					var title_ = rc[i].title,
//						report_ = rc[i].report,
//						url_ = rc[i].url +  ((rc[i].contextPath) ? '/' + rc[i].contextPath : '' ),						 
//						dcAlias_ = rc[i].dcAlias,
//						params_ = rc[i].params;
						
						 
					var fn = function(item, e) {
						 
						var dcReport = new dnet.core.dc.DcReport();
						var rec = this._getDc_(item.dcAlias).record;
						 
						
						if (!rec) {
							Ext.Msg.show({
								title : "No current record",
								msg:"There is no current record in execution context.<br> Cannot call report `"+item.title+"` without a current record which must provide values for the report parameters.",	
								icon : Ext.MessageBox.INFO,
								buttons : Ext.Msg.OK
							});
							return false;
						}
						dcReport.applyDsFieldValues(item.params, rec.data);
						dcReport.run({
							url: item.url,	
							contextPath: item.contextPath,
							params: item.params								
						});
					};
						
					var rcfg = Ext.apply({
						scope: this.frame, 
						text:rc[i].title, 
						handler:  fn
					}, rc[i]);
					
					r.push(rcfg);
				}
			}
			if (r.length > 0) {
				this.addSeparator();
				this.frame._tlbitms_.add(this.name + "___REPS_",
				{
					text: "Reports",
					menu: r
				});
				 
			}
		}
		return this;
	},
	
	end : function() {
		var n = this.name,
			t = this.frame._tlbitms_.filterBy(function(o, k) {
					return (k.indexOf(n + "__") != -1);
				}),
			tarray = t.getRange()
				;
				 
		this.frame._tlbs_.add(this.name, tarray );
		return this.frame._getBuilder_();
	}

	,
	addBack : function(config) {
		var cfg = config || {};
		var fn = function() {
			try {
				var ct = (cfg.inContainer)
						? this._getElement_(cfg.inContainer)
						: this._getElement_("main");
				if (cfg.showView) {
					var cmp = this._get_(cfg.showView);
					if (cmp) {
						ct.getLayout().setActiveItem(cmp);
					} else {
						ct.getLayout().setActiveItem(this
								._getElementConfig_(cfg.showView).id);
					}
				} else {
					ct.getLayout().setActiveItem(0);
				}

			} catch (e) {
				dnet.core.dc.DcExceptions.showMessage(e);
			}
		}
		Ext.applyIf(cfg, {
					dc : this.dc,
					handler : fn,
					scope : this.frame
				});
		var a = this.frame._getDc_(cfg.dc).actions.doEditOut;
		a.setHandler(cfg.handler, cfg.scope);
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
																				// Ext.Action(cfg)
		return this;
	},
	
	addButton: function(config) {
		var cfg = config || {};
		Ext.applyIf(config , {id:Ext.id(), xtype:"button"  } ); 
		this.frame._tlbitms_.add(this.name + "__" + config.name, config);
		return this;
	},
	
	addButtons: function(btns) {
		if (Ext.isArray(btns)) {
			for(var i=0;i<btns.length; i++) {
				this.addButton(btns[i]);
			}
		}
		return this;
	}
	
	
});









Ext.define("dnet.core.dc.DcReport", {
	run: function(config) {
		//var targetDc = config.dc;
		var params = config.params;
		var serverUrl = config.url;
		if (config.contextPath) {			 
			serverUrl += config.contextPath;
		}
		// config: params, url
		// param : code, name, type, lov, value, mandatory, noEdit
		
		var qs = "";
		for(var i=0,l=params.length; i<l;i++) {
			var p = params[i];
			if(qs != "") {
				qs += "&";
			}
			qs += p.code + "=" + p.value;
		}
		
		//alert(serverUrl + "?" + qs);
		window.open(serverUrl + "?" + qs, "Test-report","width=800,height=600,adressbar=true")
		.focus();
	 
	},
	
	
	
	applyDsFieldValues: function(params, data) {
		for(var i=0,l=params.length; i<l;i++) {
			var p = params[i];
			if (p.dsField) {
				p.value = data[p.dsField];
			}
		}
	},
	/**
	 * Validate the report parameters 
	 * @param {} params
	 */
	isValid: function(params) {
		for(var i=0,l=params.length; i<l;i++) {
			var p = params[i];
			if (!p.value && p.mandatory && !p.noEdit ) {
				return false;
			}
		}
	}
	
});







