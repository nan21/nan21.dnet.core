/**
 * Builder for filter-form views.
 */
Ext.define("dnet.core.dc.DcvFilterFormBuilder", {
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
		this.applyModelUpdater(config);
		this.applySharedConfig(config);
		return this;
	},

	addCheckbox : function(config) {
		config.xtype = "checkbox";
		this.applyModelUpdater(config);
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
			format : Dnet.DATE_FORMAT
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
		// this.applyModelUpdater(config);

		this.applySharedConfig(config);
		return this;
	},

	addCombo : function(config) {
		this.applyModelUpdater(config);
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

	addPanel : function(config) {
		Ext.applyIf(config, this.dcv.defaults);
		if (config.defaults) {
			Ext.applyIf(config.defaults, this.dcv.defaults);
		} else {
			config.defaults = this.dcv.defaults;
		}
		Ext.applyIf(config, {
			xtype : "container",
			id : Ext.id()
		});
		this.dcv._elems_.add(config.name, config);
		return this;
	},

	addFieldContainer : function(config) {
		Ext.applyIf(config, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			combineErrors : true,
			defaults : {
				flex : 1,
				hideLabel : true
			}
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

	addAuditFilter : function() {

	},

	addAuditFilter : function() {
		return this.createAuditFilter2();
	},

	createAuditFilter2 : function() {
		this.addDateField({
			name : "createdAt_From",
			dataIndex : "createdAt_From",
			emptyText : "From"
		}).addDateField({
			name : "createdAt_To",
			dataIndex : "createdAt_To",
			emptyText : "To"
		}).addTextField({
			name : "createdBy",
			dataIndex : "createdBy",
			emptyText : "Created"
		})

		.addDateField({
			name : "modifiedAt_From",
			dataIndex : "modifiedAt_From",
			emptyText : "From"
		}).addDateField({
			name : "modifiedAt_To",
			dataIndex : "modifiedAt_To",
			emptyText : "To"
		}).addTextField({
			name : "modifiedBy",
			dataIndex : "modifiedBy",
			emptyText : "Modified"
		})

		.addTextField({
			name : "id",
			dataIndex : "id",
			fieldLabel : "ID",
			emptyText : "ID"
		}).addTextField({
			name : "uuid",
			dataIndex : "uuid",
			fieldLabel : "UUID",
			emptyText : "UUID"
		});
		this.add({
			xtype : 'fieldcontainer',
			fieldLabel : 'Created',
			name : 'created',
			combineErrors : true,
			msgTarget : 'side',
			layout : 'hbox',
			margin : 0,
			padding : 0,
			defaults : {
				flex : 1,
				padding : 0,
				margin : 0,
				hideLabel : true
			}
		}).add({
			xtype : 'fieldcontainer',
			fieldLabel : 'Modified',
			name : 'modified',
			combineErrors : true,
			msgTarget : 'side',
			layout : 'hbox',
			defaults : {
				flex : 1,
				padding : 0,
				margin : 0,
				hideLabel : true
			}
		}).add({
			xtype : 'fieldcontainer',
			fieldLabel : 'By',
			name : 'cre_mod_user',
			combineErrors : true,
			msgTarget : 'side',
			layout : 'hbox',
			defaults : {
				flex : 1,
				padding : 0,
				margin : 0,
				hideLabel : true
			}
		}).add({
			xtype : 'fieldcontainer',
			fieldLabel : 'ID/UUID',
			name : 'id_uuid',
			combineErrors : true,
			msgTarget : 'side',
			layout : 'hbox',
			defaults : {
				flex : 1,
				padding : 0,
				margin : 0,
				hideLabel : true
			}
		});
		this.addPanel({
			name : "colAudit",
			xtype : "fieldset",
			collapsed : true,
			defaults : {
				labelWidth : 70
			},
			padding : '0 10 0 0',
			margin : '0 0 0 5',
			title : "Audit",
			border : true,
			collapsible : true,
			layout : "form",
			width : 280
		}).addChildrenTo("colAudit",
				[ "created", "modified", "cre_mod_user", "id_uuid" ])
				.addChildrenTo("created", [ "createdAt_From", "createdAt_To" ])
				.addChildrenTo("modified",
						[ "modifiedAt_From", "modifiedAt_To" ]).addChildrenTo(
						"cre_mod_user", [ "createdBy", "modifiedBy" ])
				.addChildrenTo("id_uuid", [ "id", "uuid" ]).addChildrenTo(
						"main", [ "colAudit" ])
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
				var r = f._dcView_._controller_.getFilter();
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
	createModelUpdaterField : function(config) {
		var fn = null;
		if (config.paramIndex) {
			fn = function(f, nv, ov, eopts) {
				if (!f.isValid()) {
					return;
				}
				var r = f._dcView_._controller_.getParams();
				if (!r)
					return;
				var rv = r.get(f.paramIndex);
				var ctrl = f._dcView_._controller_;
				if (Ext.isDate(rv)) {
					var rd = Ext.Date.parse(Ext.Date.format(rv, f.format),
							f.format);
					if (!r.isEqual(rd, nv)) {
						ctrl.setParamValue(f.paramIndex, nv);
					}
				} else {
					if (!r.isEqual(rv, nv)) {
						ctrl.setParamValue(f.paramIndex, nv);
					}
				}
			};
		} else if (config.dataIndex) {
			fn = function(f, nv, ov, eopts) {
				if (!f.isValid()) {
					return;
				}
				var r = f._dcView_._controller_.getFilter();
				if (!r)
					return;
				var rv = r.get(f.dataIndex);
				var ctrl = f._dcView_._controller_;
				if (Ext.isDate(rv)) {
					var rd = Ext.Date.parse(Ext.Date.format(rv, f.format),
							f.format);
					if (!r.isEqual(rd, nv)) {
						ctrl.setFilterValue(f.dataIndex, nv);
					}
				} else {
					if (!r.isEqual(rv, nv)) {
						ctrl.setFilterValue(f.dataIndex, nv);
					}
				}
			}
		}
		return fn;
	},

	// ==============================================
	// ==============================================

	applySharedConfig : function(config) {
		Ext.applyIf(config, {
			id : Ext.id(),
			selectOnFocus : true,
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
