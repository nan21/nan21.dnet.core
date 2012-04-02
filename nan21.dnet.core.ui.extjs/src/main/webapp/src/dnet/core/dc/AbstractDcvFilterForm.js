Ext.define("dnet.core.dc.AbstractDcvFilterForm", {
	extend : "dnet.core.dc.AbstractDNetDcForm",

	// **************** Properties *****************
	/**
	 * Component builder
	 * 
	 * @type dnet.core.dc.DcvFilterFormBuilder
	 */
	_builder_ : null,

	/**
	 * Helper property to identify this dc-view type as filter-form.
	 * 
	 * @type String
	 */
	_dcViewType_ : "filter-form",

	// **************** Public API *****************

	/**
	 * @public Returns the builder associated with this type of component. Each
	 *         predefined data-control view type has its own builder. If it
	 *         doesn't exist yet attempts to create it.
	 * 
	 * @return {dnet.core.dc.DcvFilterFormBuilder}
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvFilterFormBuilder({
						dcv : this
					});
		}
		return this._builder_;
	},

	// **************** Defaults and overrides *****************

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
		if (this._controller_ && this._controller_.getFilter()) {
			this._onBind_(this._controller_.getFilter());
		} else {
			this._onUnbind_(null);
		}
	},

	// **************** Private API *****************

	/**
	 * Register event listeners
	 */
	_registerListeners_ : function() {
		// this.mon(this, "afterrender", this.on_afterrender, this);
		this.mon(this._controller_, "parameterValueChanged",
				this._onParameterValueChanged_, this);
		this.mon(this._controller_, "filterValueChanged",
				this._onFilterValueChanged_, this);

		if (this._controller_.commands.doQuery) {
			this._controller_.commands.doQuery.beforeExecute = Ext.Function
					.createInterceptor(
							this._controller_.commands.doQuery.beforeExecute,
							function() {
								if (this._shouldValidate_()
										&& !this.getForm().isValid()) {
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
							}, this, -1);
		}
	},

	/**
	 * Bind the current filter model of the data-control to the form.
	 * 
	 * @param {Ext.data.Model}
	 *            record The record to bind
	 */
	_onBind_ : function(filter) {
		this._updateBound_(filter);
		this._applyStates_(filter);
		this._afterBind_(filter);
	},

	/**
	 * Un-bind the filter from the form.
	 * 
	 * @param {Ext.data.Model}
	 *            record
	 */
	_onUnbind_ : function(filter) {
		this._updateBound_(filter);
		this._afterUnbind_(filter);
	},

	/**
	 * When the filter has been changed in any way other than user interaction,
	 * update the fields of the form with the changed values from the model.
	 * Such change may happen by custom code snippets updating the model in a
	 * beginEdit-endEdit block, filter-service methods which returns changed
	 * data from server, etc.
	 * 
	 * @param {Ext.data.Model}
	 *            filter
	 */
	_updateBound_ : function(filter) {
		if (!filter) {
			this.disable();
			this.form.reset();
		} else {
			if (this.disabled) {
				this.enable();
			}
			this.form.loadRecord(filter);
		}
	}

 
});