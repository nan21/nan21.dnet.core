/**
 * Builder for edit-form views.
 */
Ext.define("dnet.base.DcvFormBuilder", {
	extend : "Ext.util.Observable",

	dcv : null,

	addTextField : function(config) {
		config.xtype = "textfield";
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		if (config.maxLength != undefined && config.autoCreate == undefined) {
			config.autoCreate = {
				tag : "input",
				type : "text",
				autocomplete : "off",
				size : "20",
				maxlength : config.maxLength
			};
		}
		if (config.caseRestriction != undefined) {
			config.style = "text-transform:uppercase;";
		}
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
		this.applyModelUpdater(config, "check");
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

	addDateTimeField : function(config) {
		config.xtype = "datefield";
		Ext.applyIf(config, {
			format : Ext.DATETIME_FORMAT
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
		this.applyModelUpdater(config);
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
		Ext.applyIf(config, {
			defaults : this.dcv.defaults
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

	applyModelUpdater : function(config, eventName) {

		var en = eventName || "change";
		if (!config.listeners) {
			config.listeners = {};
		}
		if (!config.listeners[en]) {
			config.listeners[en] = {};
		}

		if (config._isParam_ === true) {
			var fn = function(f, nv, ov, eopts) {

			};
		} else {
			var fn = function(f, nv, ov, eopts) {
				var r = this._dcView_._controller_.getRecord();
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
			}
		}
		if (config.listeners[en].fn) {
			config.listeners[en].fn = config.listeners[en].fn
					.createInterceptor(fn);
		} else {
			config.listeners[en]["fn"] = fn;
		}
	},

	applySharedConfig : function(config) {
		Ext.applyIf(config, {
			id : Ext.id(),
			itemId : config.name,
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
