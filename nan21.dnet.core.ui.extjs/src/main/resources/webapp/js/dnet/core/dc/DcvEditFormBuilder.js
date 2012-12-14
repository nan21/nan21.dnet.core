/**
 * Builder for edit-form views.
 */

Ext.define("dnet.core.dc.DcvEditFormBuilder", {
	extend : "Ext.util.Observable",

	dcv : null,

	addTextField : function(config) {
		config.xtype = "textfield";
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addTextArea : function(config) {
		config.xtype = "textarea";
		Ext.applyIf(config, {
			selectOnFocus : false
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addBooleanField : function(config) {
		return this.addCheckbox(config);
	},

	addCheckbox : function(config) {
		config.xtype = "checkbox";
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addDateField : function(config) {
		config.xtype = "datefield";
		Ext.applyIf(config, {
			format : Dnet.DATE_FORMAT,
			checkChangeBuffer : 600
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addDateTimeField : function(config) {
		config.xtype = "datefield";
		Ext.applyIf(config, {
			format : Dnet.DATETIME_FORMAT
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addNumberField : function(config) {
		config.xtype = "numberfield";
		config.fieldStyle = (config.fieldStyle) ? config.fieldStyle
				+ ";text-align:right;" : "text-align:right;";

		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addLov : function(config) {
		Ext.applyIf(config, {
			_validateListValue_ : true
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addCombo : function(config) {
		Ext.applyIf(config, {
			xtype : "localcombo"
		});
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addHiddenField : function(config) {
		config.xtype = "hiddenfield";
		Ext.applyIf(config, {
			maxLength : 20
		});
		this.applySharedConfig(config);
		return this;
	},

	addImage : function(config) {
		config.xtype = "image";	
		Ext.applyIf(config, { border:true,
			style:{
				backgroundColor: "#fff",
				border: "1px solid #777"
			}
		});
		if(this.dcv._images_ == null) {
			var imgs = this.dcv._images_ = [];
			imgs[imgs.length] = config.name;
		}
		this.applySharedConfig(config);
		return this;
	},
	
	addDisplayFieldText : function(config) {
		config.xtype = "displayfieldtext";
		Ext.applyIf(config, {
			anchor : "-20",
			fieldCls : "displayfield"

		});
		this.applySharedConfig(config);
		return this;
	},

	addDisplayFieldNumber : function(config) {
		config.xtype = "displayfieldnumber";
		Ext.applyIf(config, {
			anchor : "-20",
			format : Dnet.getNumberFormat(config.decimals || 0),
			fieldCls : "displayfieldnumber"
		});
		this.applySharedConfig(config);
		return this;
	},

	addDisplayFieldDate : function(config) {
		config.xtype = "displayfielddate";
		Ext.applyIf(config, {
			anchor : "-20",
			fieldCls : "displayfield"
		});
		this.applySharedConfig(config);
		return this;
	},

	addDisplayFieldBoolean : function(config) {
		config.xtype = "displayfieldboolean";
		Ext.applyIf(config, {
			// anchor:"-20" ,
			fieldCls : "displayfield"
		});
		this.applySharedConfig(config);
		return this;
	},

	addPanel : function(config) {
		Ext.applyIf(config, this.dcv.defaults);
		Ext.applyIf(config, {
			defaults : this.dcv.defaults,
			xtype : "container",
			id : Ext.id()
		});
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

	applyModelUpdater : function(config) {

		var en = "change";
		var fn = null;

		if (config.xtype == "checkbox") {
			fn = this.createModelUpdaterCheckbox(config);
		} else {
			fn = this.createModelUpdaterField(config);
		}

		if (!config.listeners) {
			config.listeners = {};
		}
		if (!config.listeners[en]) {
			config.listeners[en] = {};
		}
		config.listeners[en]['buffer'] = 500;
		if (fn != null) {
			if (config.listeners[en].fn) {
				config.listeners[en].fn = Ext.Function.createInterceptor(
						config.listeners[en].fn, fn);
			} else {
				config.listeners[en]["fn"] = fn;
			}
		}
	},

	createModelUpdaterCheckbox : function(config) {
		var fn = null;
		if (config.paramIndex) {
			fn = function(f, nv, ov, eopts) {
				var r = f._dcView_._controller_.getParams();
				if (!r)
					return;
				var rv = !!r.get(f.paramIndex);
				if (rv !== nv) {
					r.set(f.paramIndex, nv);
				}
			};
		} else if (config.dataIndex) {
			fn = function(f, nv, ov, eopts) {
				var r = f._dcView_._controller_.getRecord();
				if (!r)
					return;
				var rv = !!r.get(f.dataIndex);
				if (rv !== nv) {
					r.set(f.dataIndex, nv);
				}
			}
		}
		return fn;
	},

	_fld_model_updater_param_ : function(f, nv, ov, eopts) {
		if (!f.isValid()) {
			return;
		}
		var r = f._dcView_._controller_.getParams();
		if (!r)
			return;
		var rv = r.get(f.paramIndex);
		var ctrl = f._dcView_._controller_;
		if (Ext.isDate(rv)) {
			var rd = Ext.Date.parse(Ext.Date.format(rv, f.format), f.format);
			if (!r.isEqual(rd, nv)) {
				ctrl.setParamValue(f.paramIndex, nv);
			}
		} else {
			if (!r.isEqual(rv, nv)) {
				ctrl.setParamValue(f.paramIndex, nv);
			}
		}
	},

	_fld_model_updater_data_ : function(f, nv, ov, eopts) {
		if (!f.isValid()) {
			return;
		}
		var r = f._dcView_._controller_.getRecord();
		if (!r)
			return;
		var rv = r.get(f.dataIndex);
		if (Ext.isDate(rv)) {
			var rd = Ext.Date.parse(Ext.Date.format(rv, f.format), f.format);
			if (!r.isEqual(rd, nv)) {
				r.set(f.dataIndex, nv);
			}
		} else {
			if (!r.isEqual(rv, nv)) {
				// r.beginEdit();
				r.set(f.dataIndex, nv);
				// r.endEdit();
			}
		}
	},

	createModelUpdaterField : function(config) {
		if (config.paramIndex) {
			return this._fld_model_updater_param_;
		} else if (config.dataIndex) {
			return this._fld_model_updater_data_;
		}
	},

	applySharedConfig : function(config) {
		Ext.applyIf(config, {
			id : Ext.id(),
			itemId : config.name,
			selectOnFocus : true,
			// checkChangeBuffer : 700,
			_dcView_ : this.dcv
		});
		if (config.maxLength) {
			config.enforceMaxLength = true;
		}
		if (config.caseRestriction) {
			config.fieldStyle = "text-transform:" + config.caseRestriction
					+ ";";
		}
		if (config.allowBlank === false) {
			config.labelSeparator = "*";
		}
		if (config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._elems_.add(config.name, config);
	}
});
