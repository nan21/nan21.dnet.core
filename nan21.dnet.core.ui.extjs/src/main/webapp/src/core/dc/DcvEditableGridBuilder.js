/**
 * Builder for edit-grid views.
 */
Ext.define("dnet.base.DcvEditableGridBuilder", {
	extend : "Ext.util.Observable",

	dcv : null,

	addTextColumn : function(config) {
		config.xtype = "gridcolumn";
		this.applySharedConfig(config);
		return this;
	},

	addBooleanColumn : function(config) {

		config.xtype = "booleancolumn";
		Ext.apply(config, {
			trueText : Dnet.translate("msg", "bool_true"),
			falseText : Dnet.translate("msg", "bool_false")
		});
		if (config.editor == undefined && config._noEdit_ !== false) {

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

			config.editor = {
				xtype : 'combo',
				queryMode : 'local',
				selectOnFocus : true,
				valueField : 'bv',
				displayField : 'tv',
				store : yesNoStore,
				triggerAction : 'all',
				forceSelection : true
			};
		}

		this.applySharedConfig(config);
		return this;
	},

	addDateColumn : function(config) {
		config.xtype = "datecolumn";
		Ext.applyIf(config, {
			format : Ext.DATE_FORMAT
		});
		this.applySharedConfig(config);
		return this;
	},

	addNumberColumn : function(config) {
		config.xtype = "numbercolumn";
		Ext.applyIf(config, {
			align : "right"
		});
		this.applySharedConfig(config);
		return this;
	},

	addComboColumn : function(config) {
		config.xtype = "gridcolumn";
		this.applySharedConfig(config);
		return this;
	},

	addLov : function(config) {
		this.applySharedConfig(config);
		return this;
	},

	add : function(config) {
		this.applySharedConfig(config);
		return this;
	},

	merge : function(name, config) {
		Ext.applyIf(this.dcv._columns_.get(name), config);
		return this;
	},

	change : function(name, config) {
		Ext.apply(this.dcv._columns_.get(name), config);
		return this;
	},

	remove : function(name) {
		this.dcv._columns_.remove(name);
		return this;
	},

	// private

	applySharedConfig : function(config) {
		Ext.applyIf(config, {
			id : Ext.id(),
			selectOnFocus : true,
			sortable : true,
			hidden : false,
			_dcView_ : this.dcv
		});
		if (config.editor) {
			Ext.applyIf(config.editor, {
				_dcView_ : this.dcv
			});
		}
		if (config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._columns_.add(config.name, config);
	}
});
