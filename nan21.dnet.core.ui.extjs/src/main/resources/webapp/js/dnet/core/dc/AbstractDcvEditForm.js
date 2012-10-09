Ext.define("dnet.core.dc.AbstractDcvEditForm", {
	extend : "dnet.core.dc.AbstractDNetDcForm",

	// **************** Properties *****************

	/**
	 * Flag to automatically disable form fields if the data-control is marked as read-only. 
	 * @type Boolean
	 */
	_shouldDisableWhenDcIsReadOnly_ : true,
	
	/**
	 * Specify how to apply the form disable when shouldDisableWhenDcIsReadOnly property is true.
	 * Possible values are : 
	 * fields - call disable on all fields (default value)
	 * panel - disable the form panel
	 * elems - call disable on all elements
	 * 
	 * 
	 * @type String
	 */
	_disableModeWhenDcIsReadOnly_: "fields",
	
	/**
	 * 
	 * Component builder
	 * 
	 * @type dnet.core.dc.DcvEditFormBuilder
	 */
	_builder_ : null,

	/**
	 * Helper property to identify this dc-view type as edit form.
	 * 
	 * @type String
	 */
	_dcViewType_ : "edit-form",

	// **************** Public API *****************

	/**
	 * @public Returns the builder associated with this type of component. Each
	 *         predefined data-control view type has its own builder.
	 *         If it doesn't exist yet attempts to create it.
	 * 
	 * @return {dnet.core.dc.DcvEditFormBuilder}
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvEditFormBuilder({
						dcv : this
					});
		}
		return this._builder_;
	},

	_setShouldDisableWhenDcIsReadOnly_: function(v, immediate) {
		this._shouldDisableWhenDcIsReadOnly_ = v;
		if (immediate && v) {
			this._doDisableWhenDcIsReadOnly_();
		}
	},
	
	
	// **************** Defaults and overrides *****************

	frame : true,
	border : false,
	bodyBorder : false,
	bodyPadding : '5 5 0 0',
	maskOnDisable : false,
	layout : "fit",
	buttonAlign : "left",
	bodyCls : 'dcv-edit-form',
	trackResetOnLoad : false,
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

	initComponent : function() {
		this._runElementBuilder_();
		this.callParent(arguments);
		this._registerListeners_(); 
	},

	/**
	 * After the form is rendered invoke the record binding. This is necessary
	 * as the form may be rendered lazily(delayed) and the data-control may
	 * already have a current record set.
	 */
	afterRender : function() {
		this.callParent(arguments);
		if (this._controller_ && this._controller_.getRecord()) {
			this._onBind_(this._controller_.getRecord());
		} else {
			this._onUnbind_(null);
		}
	},
	
	beforeDestroy : function() {		
		this._elems_.each(function(item,idx,len) {
			delete item._dcView_;
		}, this)
		this.callParent(arguments);
	},
	// **************** Private API *****************

	/**
	 *  Register event listeners
	 */
	_registerListeners_ : function() {

		this.mon(this._controller_.store, "datachanged",
				this._onStore_datachanged_, this);
		this
				.mon(this._controller_.store, "update", this._onStore_update_,
						this);
		this.mon(this._controller_.store, "write", this._onStore_write_, this);

		this.mon(this._controller_, "recordChange",
				this._onController_recordChange_, this);

		this.mon(this._controller_, "readOnlyChanged",
				function() {this._applyStates_(this._controller_.getRecord());} , this); 
		// this.mon(this, "afterrender", this.on_afterrender, this);

		if (this._controller_.commands.doSave) {
			this._controller_.commands.doSave.beforeExecute = Ext.Function
					.createInterceptor(
							this._controller_.commands.doSave.beforeExecute,
							function() {
								if (this._shouldValidate_()
										&& !this.getForm().isValid()) {
									Ext.Msg.show({
										title : "Validation info",
										msg : "Form contains invalid data.<br> Please fix the errors then try again.",
										scope : this,
										icon : Ext.MessageBox.ERROR,
										buttons : Ext.MessageBox.OK
									});
									return false;
								} else {
									return true;
								}
							}, this, -1);
		}
	},

	/**
	 * @private Update the bound record when the store data is changed.
	 * @param {}
	 *            store
	 * @param {}
	 *            eopts
	 */
	_onStore_datachanged_ : function(store, eopts) {
		this._updateBound_(this._controller_.getRecord());
	},

	/**
	 * @private Update the bound record when the store data is updated.
	 * @param {}
	 *            store
	 * @param {}
	 *            rec
	 * @param {}
	 *            op
	 * @param {}
	 *            eopts
	 */
	_onStore_update_ : function(store, rec, op, eopts) {
		if (this.getForm().getRecord() === rec) {
			this._updateBound_(rec);
		}
	},

	/**
	 * @private Update the bound record after a succesful save.
	 * @param {}
	 *            store
	 * @param {}
	 *            operation
	 * @param {}
	 *            eopts
	 */
	_onStore_write_ : function(store, operation, eopts) {
		/**
		 * use the first record from the result list as reference see Store on
		 * write event handler defined in AbstractDc.
		 */
//		if (operation.action == "create") {
//			this._applyContextRules_(operation.resultSet.records[0]);
//		}
	},

	/**
	 * @private When the current record of the data-control is changed bind it
	 *          to the form.
	 * @param {}
	 *            evnt
	 */
	_onController_recordChange_ : function(evnt) {
		var newRecord = evnt.newRecord;
		var oldRecord = evnt.oldRecord;
		var newIdx = evnt.newIdx;
		if (newRecord != oldRecord) {
			this._onUnbind_(oldRecord);
			this._onBind_(newRecord);
		}
	},

	/**
	 * Bind the current record of the data-control to the form.
	 * 
	 * @param {Ext.data.Model}
	 *            record The record to bind
	 */
	_onBind_ : function(record) {
		if (record) {
			var fields = this.getForm().getFields();

			fields.each(function(field) {
						field.suspendEvents();
					});
			var trackResetOnLoad = this.getForm().trackResetOnLoad; 
			fields.each(function(field) {
				if(field.dataIndex) {
					field.setValue(record.get(field.dataIndex));
					if ( trackResetOnLoad) {
	                    field.resetOriginalValue();
	                }
				}					
			});
			this.getForm()._record = record;
			//this.getForm().loadRecord(record);
			fields.each(function(field) {
						field.resumeEvents();
					});
			this._applyStates_(record);
			this.getForm().isValid();
		}
		this._afterBind_(record);
	},

	/**
	 * Un-bind the record from the form.
	 * 
	 * @param {Ext.data.Model}
	 *            record
	 */
	_onUnbind_ : function(record) {
		this.getForm().getFields().each(function(field) {
					if (field.dataIndex) {
						field.setRawValue(null);
						field.clearInvalid();
					}
					field.disable();
				});
		this._afterUnbind_(record);
	},

	/**
	 * When the record has been changed in any way other than user interaction,
	 * update the fields of the form with the changed values from the model.
	 * Such change may happen by custom code snippets updating the model in a
	 * beginEdit-endEdit block, reload record from server, service methods which
	 * returns changed record data from server, etc.
	 * 
	 * @param {Ext.data.Model}
	 *            record
	 */
	_updateBound_ : function(record) {
		var msg = "null";
		if (record) {
			var fields = this.getForm().getFields();
			
			fields.each(function(field) {

						if (field.dataIndex) {
							var nv = record.data[field.dataIndex];
							if (field.getValue() != nv) {
								// field.suspendEvents();
								//this.suspendCheckChange++;
								if ( !(field.hasFocus && field.isDirty)) {
									field.setValue(nv);
								}
								//this.suspendCheckChange--;
								// field.resumeEvents();
							}
						}
					});
			
			
		}
	},

	/**
	 * @protected The edit-form specific state rules. The flow is: If the fields
	 *            are marked with noInsert, noUpdate or noEdit these rules are
	 *            applied and no other option checked If no such constraint, the
	 *            _canSetEnabled_ function is checked for each element.
	 * 
	 * 
	 * @param {Ext.data.Model}
	 *            record
	 */
	_onApplyStates_ : function(record) {
		// the form has been disabled by the (un)bind.
		// Nothing to change
		if (record == null || record == undefined) {
			return;
		}
		if(this._shouldDisableWhenDcIsReadOnly_ && this._controller_.isReadOnly() ) {
			this._doDisableWhenDcIsReadOnly_();
			return;
		}
		if (record.phantom) {
			this.getForm().getFields().each(function(item, index, length) {
						if (item.noEdit === true || item.noInsert === true) {
							item.disable();
						} else {
							item.setDisabled(!this._canSetEnabled_(item.name, record));							 
						}
						item.setVisible( this._canSetVisible_(item.name, record ) );	
					}, this);
		} else {
			this.getForm().getFields().each(function(item, index, length) {
						if (item.noEdit === true || item.noUpdate === true) {
							item.disable();
						} else {
							item.setDisabled(!this._canSetEnabled_(item.name, record));
						}
						item.setVisible( this._canSetVisible_(item.name, record ) );
					}, this);
		}

	},

	/**
	 * @deprecated Replaced by the _applyStates_ method. Kept only for backward
	 *             compatibility but will be removed. Please update your code.
	 * @param {Ext.data.Model}
	 *            record
	 */
	_applyContextRules_ : function(record) {
		this._applyStates_(record);
	},
	
	_doDisableWhenDcIsReadOnly_ : function() {
		if(this._shouldDisableWhenDcIsReadOnly_ && this._controller_.isReadOnly() ) {
			this["_doDisableWhenDcIsReadOnly_"+ this._disableModeWhenDcIsReadOnly_ + "_"]();
		}
	},
	
	_doDisableWhenDcIsReadOnly_fields_ : function() {
		this.getForm().getFields().each(this._disableElement_);
	},
	_doDisableWhenDcIsReadOnly_panel_ : function() {
		this.disable();
	},
	_doDisableWhenDcIsReadOnly_elems_ : function() {
		this._elems_.each(this._disableElement_);
	},
	_disableElement_:function(e) {
		e.disable();
	} 
	

});