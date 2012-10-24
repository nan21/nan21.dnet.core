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
	},

	addSeparator : function() {
		if (this.sepIdx == null) {
			this.sepIdx = 0;
		}
		this.frame._tlbitms_.add(this.name + "___S" + (this.sepIdx++) + "_",
				"-");
		return this;
	},

	/**
	 * Add a generic button.
	 */
	addButton : function(config) {
		var cfg = config || {};
		Ext.applyIf(config, {
			id : Ext.id(),
			xtype : "button"
		});
		this.frame._tlbitms_.add(this.name + "__" + config.name, config);
		return this;
	},

	/**
	 * Add generic buttons.
	 */
	addButtons : function(btns) {
		if (Ext.isArray(btns)) {
			for ( var i = 0; i < btns.length; i++) {
				this.addButton(btns[i]);
			}
		}
		return this;
	},

	/**
	 * Add a label element
	 */
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

	/**
	 * Add title for toolbar.
	 */
	addTitle : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc,
			xtype : "label",
			name : "title",
			height : 20,
			cls : "dnet-toolbar-title"
		});
		if (cfg.text && this.frame._trl_
				&& this.frame._trl_[this.name + "__ttl"]) {
			cfg.text = this.frame._trl_[this.name + "__ttl"];
		}
		this.frame._tlbitms_.add(this.name + "__" + cfg.name, cfg);
		if (this.frame._tlbtitles_ == null) {
			this.frame._tlbtitles_ = new Ext.util.MixedCollection();
		}
		this.frame._tlbtitles_.add(this.name, cfg.text);

		return this;
	},

	/**
	 * Add do-query action.
	 */
	addQuery : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc
		});
		var a = this.frame._getDc_(cfg.dc).actions.doQuery;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},

	/**
	 * Add next record action
	 */
	addNextRec : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc
		});
		var a = this.frame._getDc_(cfg.dc).actions.doNextRec;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
		return this;
	},

	/**
	 * Add previous record action
	 */
	addPrevRec : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc
		});
		var a = this.frame._getDc_(cfg.dc).actions.doPrevRec;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
		return this;
	},

	/**
	 * Add cancel changes action
	 */
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
			this.frame.mon(this.frame._getDc_(cfg.dc), 'recordChanged',
					function(event) {
						if (event.record == null) {
							this._invokeTlbItem_("doBack", cfg.tlb);
						}
					}, this.frame);
		}
		return this;
	},

	/**
	 * Add delete selected records action.
	 */
	addDeleteSelected : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc
		});
		var a = this.frame._getDc_(cfg.dc).actions.doDelete;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},

	/**
	 * Add save action.
	 */
	addSave : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc
		});
		var a = this.frame._getDc_(cfg.dc).actions.doSave;
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a);
		return this;
	},

	/**
	 * End toolbar creation.
	 */
	end : function() {
		var n = this.name, t = this.frame._tlbitms_.filterBy(function(o, k) {
			return (k.indexOf(n + "__") != -1);
		}), tarray = t.getRange();

		this.frame._tlbs_.add(this.name, tarray);
		return this.frame._getBuilder_();
	},

	/**
	 * Add edit action
	 */
	addEdit : function(config) {
		var cfg = config || {};
		Ext.applyIf(cfg, {
			dc : this.dc,
			tlb : this.name
		});
		var fn = function() {
			try {
				var ct = (cfg.inContainer) ? this._getElement_(cfg.inContainer)
						: this._getElement_("main");
				if (cfg.showView) {
					var cmp = this._get_(cfg.showView);
					if (cmp) {
						ct.getLayout().setActiveItem(cmp);
					} else {
						ct.getLayout().setActiveItem(
								this._getElementConfig_(cfg.showView).id);
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
	},

	/**
	 * Add action for auto-load. When toggled, the child data is automatically
	 * loaded on parent change.
	 */
	addAutoLoad : function() {
		var cfg = {
			name : "autoLoad",
			disabled : false,
			enableToggle : true,
			text : Dnet.translate("tlbitem", "autoload__lbl"),
			tooltip : Dnet.translate("tlbitem", "autoload__tlp"),
			scope : dc,
			handler : function(btn, evnt) {
				try {
					dc.dcContext.relation.fetchMode = (btn.pressed) ? "auto"
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
		}
		;
		var a = new Ext.Action(cfg);
		this.frame._tlbitms_.add(this.name + "__" + a.initialConfig.name, a); // new
		// Ext.Action(cfg)
		return this;
	},

	/**
	 * Add reports contributed by the extension providers.
	 */
	addReports : function() {
		if (this.frame._reports_ != null) {
			var r = [], rc = this.frame._reports_;

			for ( var i = 0, l = rc.length; i < l; i++) {
				if (rc[i].toolbar == this.name) {
					var fn = function(item, e) {
						var dcReport = new dnet.core.dc.DcReport();
						var rec = this._getDc_(item.dcAlias).record;
						if (!rec) {
							var _msg = Dnet.translate("msg",
									"no_current_record_for_report",
									[ item.title ]);

							Ext.Msg.show({
								title : Dnet.translate("msg",
										"no_current_record"),
								msg : _msg,
								icon : Ext.MessageBox.INFO,
								buttons : Ext.Msg.OK
							});
							return false;
						}
						dcReport.applyDsFieldValues(item.params, rec.data);
						dcReport.run({
							url : item.url,
							contextPath : item.contextPath,
							params : item.params
						});
					};
					var rcfg = Ext.apply({
						scope : this.frame,
						text : rc[i].title,
						handler : fn
					}, rc[i]);

					r.push(rcfg);
				}
			}
			if (r.length > 0) {
				this.addSeparator();
				this.frame._tlbitms_.add(this.name + "___REPS_", {
					text : "Reports",
					menu : r
				});

			}
		}
		return this;
	},

	/**
	 * Add back button. Move to a different canvas/stacked view.
	 */
	addBack : function(config) {
		var cfg = config || {};
		var fn = function() {
			try {
				var ct = (cfg.inContainer) ? this._getElement_(cfg.inContainer)
						: this._getElement_("main");
				if (cfg.showView) {
					var cmp = this._get_(cfg.showView);
					if (cmp) {
						ct.getLayout().setActiveItem(cmp);
					} else {
						ct.getLayout().setActiveItem(
								this._getElementConfig_(cfg.showView).id);
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
			this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew",
					function() {
						this._invokeTlbItem_("doEdit", cfg.tlb);
					}, this.frame);

		} else {
			if (!Ext.isEmpty(cfg.showView)) {

				var fn = function() {
					try {
						var ct = (cfg.inContainer) ? this._getElement_(cfg.inContainer)
								: this._getElement_("main");
						if (cfg.showView) {
							var cmp = this._get_(cfg.showView);
							if (cmp) {
								ct.getLayout().setActiveItem(cmp);
							} else {
								ct.getLayout().setActiveItem(
										this._getElementConfig_(cfg.showView).id);
							}
						} else {
							ct.getLayout().setActiveItem(1);
						}
					} catch (e) {
						dnet.core.dc.DcExceptions.showMessage(e);
					}
				};
				
				this.frame.mon(this.frame._getDc_(cfg.dc), "afterDoNew", fn,
						this.frame);
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
});

Ext.define("dnet.core.dc.DcReport", {
	run : function(config) {

		var params = config.params;
		var serverUrl = config.url;
		if (config.contextPath) {
			serverUrl += config.contextPath;
		}

		var qs = "";
		for ( var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (qs != "") {
				qs += "&";
			}
			qs += p.code + "=" + p.value;
		}
		window.open(serverUrl + "?" + qs, "Test-report",
				"width=800,height=600,adressbar=true").focus();

	},

	applyDsFieldValues : function(params, data) {
		for ( var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (p.dsField) {
				p.value = data[p.dsField];
			}
		}
	},
	/**
	 * Validate the report parameters
	 * 
	 * @param {}
	 *            params
	 */
	isValid : function(params) {
		for ( var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (!p.value && p.mandatory && !p.noEdit) {
				return false;
			}
		}
	}

});
