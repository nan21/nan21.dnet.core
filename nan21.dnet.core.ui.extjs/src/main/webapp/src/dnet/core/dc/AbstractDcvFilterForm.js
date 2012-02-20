Ext.define("dnet.core.dc.AbstractDcvFilterForm", {
	extend : "Ext.form.Panel",

	// DNet properties

	_builder_ : null,
	_elems_ : null,
	_controller_ : null,
	_mainViewName_ : "main",
	_dcViewType_ : "filter-form",
	_trl_ : null,

	// defaults

	frame : true,
	border : false,
	bodyBorder : false,
	maskDisabled : false,
	layout : "fit",
	buttonAlign : "left",
	bodyCls : 'dcv-edit-form',
	bodyPadding : '5 5 0 0',

	fieldDefaults : {
		labelAlign : "right",
		labelWidth : 100
	},

	defaults : {
		frame : false,
		border : false,
		bodyBorder : false,
		bodyStyle : " background:transparent "
	},

	initComponent : function(config) {
		 
		this._elems_ = new Ext.util.MixedCollection();
		this._startDefine_();

		/* define elements */
		if (this._beforeDefineElements_() !== false) {
			this._defineElements_();
			this._afterDefineElements_();
		}
		this._elems_.each(this._postProcessElem_, this);

		/* build the ui, linking elements */
		if (this._beforeLinkElements_() !== false) {
			this._linkElements_();
			this._afterLinkElements_();
		}

		this._endDefine_();

		var cfg = {
			layout : "fit",
			items : [ this._elems_.get(this._mainViewName_) ]
		}
		Ext.apply(cfg, config);
		Ext.apply(this, cfg);

		this.callParent(arguments);

		this.on( {
			scope : this,
			afterrender : function() {
				this.updateBound(this._controller_.getFilter());
			}
		});
		this.mon(this._controller_, "parameterValueChanged", this._onParameterValueChanged_, this);
		this.mon(this._controller_, "filterValueChanged", this._onFilterValueChanged_, this);
		
		if (this._controller_.commands.doQuery ) {
			this._controller_.commands.doQuery.beforeExecute = Ext.Function.createInterceptor(
				this._controller_.commands.doQuery.beforeExecute,
				function() {
					if(!this.getForm().isValid()) {
						Ext.Msg.show({
							title : "Validation info",	
							msg : "Filter contains invalid data.<br> Please fix the errors then try again.",
							scope : this,
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.MessageBox.OK
						});
						return false;
					} else {
						return true;	
					}					
				},this, -1 );
		}
		
	}, 
	
	
	_startDefine_ : function() {
	},
	_endDefine_ : function() {
	},

	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},

	_getElementConfig_ : function(name) {
		return this._elems_.get(name);
	},

	_get_ : function(name) {
		return this._getElement_(name);
	},

	_getConfig_ : function(name) {
		return this._elems_.get(name);
	},

	onBind : function(record) {
		this.updateBound(record);
	},

	onUnbind : function(record) {
		this.updateBound();
	},

	afterEdit : function(record) {
		this.updateBound(record);
	},

	afterReject : function(record) {
		this.updateBound(record);
	},

	updateBound : function(record) {
		if (!record) {
			this.disable();
			this.form.reset();
		} else {
			if (this.disabled) {
				this.enable();
			}
			this.form.loadRecord(record);
		}
	},

	_onParameterValueChanged_: function(dc, paramName, ov, nv) {
		var fld = this._elems_.findBy(function(item) {
			return (item.paramIndex == paramName);
		});
		if (fld) {
			fld = this._getElement_(fld.name);
			if (fld.getValue() != nv) {
				fld.suspendEvents();
				fld.setValue(nv);
				fld.resumeEvents();
			}	
		}			
	},
	
	
	_onFilterValueChanged_: function(ctrl, fieldName, ov, nv) {
		var fld = this._elems_.findBy(function(item) {
			return (item.dataIndex == fieldName);
		});
		if (fld) {
			fld = this._getElement_(fld.name);
			if (fld.getValue() != nv) {
				fld.suspendEvents();
				fld.setValue(nv);
				fld.resumeEvents();
			}	
		}
	},
	
	_defineElements_ : function() {
	},

	
	_beforeDefineElements_ : function() {
		return true;
	},

	
	_afterDefineElements_ : function() {
	},

	
	_linkElements_ : function() {
	},

	
	_beforeLinkElements_ : function() {
		return true;
	},

	
	_afterLinkElements_ : function() {
	},

	_postProcessElem_ : function(item, idx, len) {
		if (item.fieldLabel == undefined) {
			Dnet.translateField(this._trl_, this._controller_._trl_, item);
		}
	},

	/**
	 * Get value from resource bundle for the specified key.
	 */
	_getRBValue_ : function(k) {
		if (this._trl_ != null && this._trl_[k]) {
			return this._trl_[k];
		}
		if (this._controller_._trl_ != null && this._controller_._trl_[k]) {
			return this._controller_._trl_[k];
		} else {
			return k;
		}
	},

	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvFilterFormBuilder( {
				dcv : this
			});
		}
		return this._builder_;
	},
	
	beforeDestroy: function() { 
		this._controller_ = null;
		this.callParent();
		this._elems_.each(this.unlinkElem, this);
		this._elems_.each(this.destroyElement, this);	 
		 
	},
	
	unlinkElem: function(item, index, len) {
		item._dcView_ = null;
	},
 	destroyElement: function(elemCfg) {
		try{			 
			var c =  Ext.getCmp( elemCfg.id );
			if (c) {
				Ext.destroy(c);
			}			
		} catch(e) {
			//alert(e);
		}
	}
	
});