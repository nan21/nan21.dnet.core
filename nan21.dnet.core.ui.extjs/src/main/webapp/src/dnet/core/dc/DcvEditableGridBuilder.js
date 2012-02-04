/**
 * Builder for edit-grid views.
 */
Ext.define("dnet.core.dc.DcvEditableGridBuilder", {
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
			falseText : Dnet.translate("msg", "bool_false"),
			autoSelect: true
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
			format : Dnet.DATE_FORMAT
		});
		this.applySharedConfig(config);
		return this;
	},

	addNumberColumn : function(config) {
		config.xtype = "numbercolumn";
		config.format = Dnet.getNumberFormat(config.decimals || 0 );
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

	addDefaults: function() {
		var r =  Ext.create(this.dcv._controller_.recordModel, {});
		r.fields.each(function(f,idx,len) {
			if(f.name=="id") {
				this.addNumberColumn({ name:"id", dataIndex:"id", hidden:true,format:"0",width:70 }) ;
			}
			if(f.name=="uuid") {
				this.addTextColumn({ name:"uuid", dataIndex:"uuid", hidden:true,width:100 })   	
			}
			if(f.name=="createdAt") {
				this.addDateColumn({ name:"createdAt", dataIndex:"createdAt", hidden:true,format:Dnet.DATETIME_FORMAT})   
			}
			if(f.name=="modifiedAt") {
				this.addDateColumn({ name:"modifiedAt", dataIndex:"modifiedAt", hidden:true,format:Dnet.DATETIME_FORMAT}) 
			}
			if(f.name=="createdBy") {
				this.addTextColumn({ name:"createdBy", dataIndex:"createdBy", hidden:true,width:100 })   	
			}
			if(f.name=="modifiedBy") {
				this.addTextColumn({ name:"modifiedBy", dataIndex:"modifiedBy", hidden:true,width:100 })  
			}
			
		}, this);
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
