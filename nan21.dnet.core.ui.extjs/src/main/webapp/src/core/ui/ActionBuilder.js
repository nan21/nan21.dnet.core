

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
Ext.define("dnet.base.ActionBuilder", {
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
					"name" : "title",
					cls : "dnet-toolbar-title"
				});
		this.frame._tlbitms_.add(this.name + "__" + config.name, config);
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
			this.frame._getDc_(cfg.dc).on('afterDoNew', function() {
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
						dnet.base.DcExceptions.showMessage(e);
					}
				};
				this.frame._getDc_(cfg.dc).on('afterDoNew', fn, this.frame);
			}
		}
		return this;
	}

	,
	addCopy : function(config) {
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
				dnet.base.DcExceptions.showMessage(e);
			}
		};
		var a = this.frame._getDc_(cfg.dc).actions.doEditIn;
		a.setHandler(fn, this.frame);
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);

		this.frame._getDc_(cfg.dc).on("onEdit", function() {
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
			this.frame._getDc_(cfg.dc).on('recordChanged', function(event) {
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
					dnet.base.DcExceptions.showMessage(e);
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
	end : function() {
		var n = this.name;
		var t = this.frame._tlbitms_.filterBy(function(o, k) {
					return (k.indexOf(n + "__") != -1);
				})
		this.frame._tlbs_.add(this.name, t.getRange());
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
				dnet.base.DcExceptions.showMessage(e);
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
	}

});