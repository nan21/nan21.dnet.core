/**
 * Builder for filter-form views.
 */
Ext.define("dnet.base.DcvFilterFormBuilder", {
	extend : "Ext.util.Observable",

	dcv : null,

	addTextField : function(config) {
		config.xtype = "textfield";
		if (config.maxLength) {
			config.enforceMaxLength = true;
		}
		if (config.caseRestriction ) {
			config.fieldStyle = "text-transform:"+config.caseRestriction+";";
		}
		this.applyModelUpdater(config);
		this.applySharedConfig(config);		  
		return this;
	},

	addTextArea : function(config) {
		config.xtype = "textarea";
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addCheckbox : function(config) {
		config.xtype = "checkbox";
		this.applyModelUpdater(config );
		this.applySharedConfig(config);
		return this;
	},

	addBooleanField : function(config) {
		Ext.applyIf(config, {
			forceSelection : false,
			width : 70
		});

		var yesNoStore = Ext.create('Ext.data.Store', {
			fields : [ "bv", "tv" ],
			data : [ {
				"bv" : true,
				"tv" : Dnet.translate("msg", "bool_true")
			}, {
				"bv" : false,
				"tv" : Dnet.translate("msg", "bool_false")
			} ]
		});

		Ext.apply(config, {
			xtype : "combo",
			queryMode : "local",
			valueField : "bv",
			displayField : "tv",
			triggerAction : "all",
			store : yesNoStore
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},
	addDateField : function(config) {
		config.xtype = "datefield";
		Ext.applyIf(config, {
			format : Ext.DATE_FORMAT
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},
	addNumberField : function(config) {
		config.xtype = "numberfield";
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},
	addLov : function(config) {
		//this.applyModelUpdater(config);
	 
		
		this.applySharedConfig(config);
		return this;
	},
	addCombo : function(config) {
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addPanel : function(config) {
		Ext.applyIf(config, this.dcv.defaults);
		if (config.defaults) {
			Ext.applyIf(config.defaults, this.dcv.defaults);
		} else {
			config.defaults = this.dcv.defaults;
		}

		this.dcv._elems_.add(config.name, config);
		return this;
	},

	addChildrenTo : function(c, list) {
		var items = this.dcv._elems_.get(c)["items"] || [];
		for ( var i = 0, len = list.length; i < len; i++) {
			items[items.length] = this.dcv._elems_.get(list[i]);
		}
		this.dcv._elems_.get(c)["items"] = items;
		return this;
	},

	add : function(config) {
		this.applySharedConfig(config);
		return this;
	},

	merge : function(name, config) {
		Ext.applyIf(this.dcv._elems_.get(name), config);
		return this;
	},

	change : function(name, config) {
		Ext.apply(this.dcv._elems_.get(name), config);
		return this;
	},

	remove : function(name) {
		this.dcv._elems_.remove(name);
		return this;
	},

	// private

	applyModelUpdater : function(config, eventName) {
		var en = eventName || "change";
		if (!config.listeners) {
			config.listeners = {};
		}
		if (!config.listeners[en]) {
			config.listeners[en] = {};
		}

		var fn=null;
		if (config.paramIndex) {
			fn = function(f, nv, ov) {
				if (!f.isValid()) {
					return;
				}
				var r = f._dcView_._controller_.getParams();
				if (!r)
					return;
				var rv = r.get(f.paramIndex);
				if (Ext.isDate(rv)) {
					var rd = Ext.Date.parse(Ext.Date.format(rv, f.format),
							f.format);
					if (!r.isEqual(rd, nv)) {
						r.set(f.paramIndex, nv);
					}
				} else {
					if (!r.isEqual(rv, nv)) {
						r.set(f.paramIndex, nv);
					}
				}
//				f._dcView_._controller_.setParamValue(f.paramIndex,
//						f.getValue(), true);
			};
		} else if (config.dataIndex) {
			fn = function(f, nv, ov) {
				
				if (!f.isValid()) {
					return;
				}
				var r = f._dcView_._controller_.getFilter();
				if (!r)
					return;
				var rv = r.get(f.dataIndex);
				if (Ext.isDate(rv)) {
					var rd = Ext.Date.parse(Ext.Date.format(rv, f.format),
							f.format);
					if (!r.isEqual(rd, nv)) {
						r.set(f.dataIndex, nv);
					}
				} else {
					if (!r.isEqual(rv, nv)) {
						r.set(f.dataIndex, nv);
					}
				}
				
				
//				f._dcView_._controller_.getFilter().set(f.dataIndex,
//						f.getValue());
			};
		}
		if(fn!=null) {
			if (config.listeners[en].fn) {
				config.listeners[en].fn = Ext.Function.createInterceptor(config.listeners[en].fn, fn);
			} else {
				config.listeners[en]["fn"] = fn;
			}
		}
		
	},

	applySharedConfig : function(config) {
		Ext.applyIf(config, {
			id : Ext.id(),
			selectOnFocus : true,
			_dcView_ : this.dcv
		});
		if (config.allowBlank === false) {
			config.labelSeparator = "*";
		}
		if (config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._elems_.add(config.name, config);
	}
});
