/**
 * Builder for filter-form views.
 */
Ext.define("dnet.core.dc.DcvFilterFormBuilder", {
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
			data : [ 
//			{
//				"bv" : null,
//				"tv" : "*"
//			},
				{
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
		Ext.applyIf(config, {			 
			xtype:"container",
			id: Ext.id()			
		});
		this.dcv._elems_.add(config.name, config);
		return this;
	},

	addFieldContainer : function(config) {
		Ext.applyIf(config, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			combineErrors: true,
			defaults: {
                    flex: 1,
                    hideLabel: true
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

	addAuditFilter: function() {
		this
			.addDateField({ name:"createdAt_From", dataIndex:"createdAt_From" , emptyText:"From" })
			.addDateField({ name:"createdAt_To", dataIndex:"createdAt_To" , emptyText:"To"  })
			.addTextField({ name:"createdBy", dataIndex:"createdBy" , flex: 2,emptyText:"By"  })
		
			.addDateField({ name:"modifiedAt_From", dataIndex:"modifiedAt_From" , emptyText:"From" })
			.addDateField({ name:"modifiedAt_To", dataIndex:"modifiedAt_To" , emptyText:"To"  })
			.addTextField({ name:"modifiedBy", dataIndex:"modifiedBy" , flex: 2,emptyText:"By"  })
			
			.add({
                xtype: 'fieldcontainer',
                fieldLabel: 'Created',
                name : 'created',
                combineErrors: true,
                msgTarget : 'side',
                layout: 'hbox',margin:0,padding:0, 
                defaults: {
                	flex: 3,padding:0,margin:0,
                    hideLabel: true
                } 
            })
            .add({
                xtype: 'fieldcontainer',
                fieldLabel: 'Modified',
                name : 'modified',
                combineErrors: true,
                msgTarget : 'side',
                layout: 'hbox',
                defaults: {
                	flex: 3,padding: 0, margin:0,
                    hideLabel: true
                } 
            })
            .addPanel({ name:"colAudit", xtype:"fieldset", defaults:{labelWidth:70 }, padding:'0 10 0 0',  margin:'0 0 0 5',   title:"Audit", border:true, collapsible: true, layout:"form"
            //, style:"border:1px solid red !important;"
            ,width:390})
            .addChildrenTo("colAudit",["created", "modified" ])
            .addChildrenTo("created",["createdAt_From", "createdAt_To", "createdBy" ])
			.addChildrenTo("modified",["modifiedAt_From", "modifiedAt_To", "modifiedBy" ])
			.addChildrenTo("main",["colAudit"])
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
		
		if(config.xtype == "checkbox") {			 
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
		config.listeners[en]['buffer'] = 250;
		if(fn!=null) {
			if (config.listeners[en].fn) {
				config.listeners[en].fn = Ext.Function.createInterceptor(config.listeners[en].fn, fn);
			} else {
				config.listeners[en]["fn"] = fn;
			}
		}
	},
	
	createModelUpdaterCheckbox: function(config) {
		var fn = null;
		if (config.paramIndex) {
			fn = function(f, nv, ov, eopts) {				 
				var r = f._dcView_._controller_.getParams();
				if (!r)
					return;
				var rv = !! r.get(f.paramIndex);				 
				if ( rv!==nv ) {
					r.set(f.paramIndex, nv);
				}				
			};
		} else if (config.dataIndex) {
			fn = function(f, nv, ov, eopts) {				 
				var r = f._dcView_._controller_.getFilter();
				if (!r)
					return;
				var rv = !!r.get(f.dataIndex);				 
				if ( rv!==nv ) {
					r.set(f.dataIndex, nv);
				}				 
			}
		}
		return fn;
	},
	createModelUpdaterField: function(config) {
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
		if (config.allowBlank === false) {
			config.labelSeparator = "*";
		}
		if (config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._elems_.add(config.name, config);
	}
});
