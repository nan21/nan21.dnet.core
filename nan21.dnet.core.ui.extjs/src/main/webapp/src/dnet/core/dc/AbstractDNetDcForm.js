/**
 * Base panel used for data-control views. It serves as base class for
 * edit-forms and filter-forms.
 */
Ext.define("dnet.core.dc.AbstractDNetDcForm", {
	extend : "Ext.form.Panel",

	mixins: {
		elemBuilder: "dnet.core.base.AbstractDNetView",
		dcViewSupport: "dnet.core.dc.AbstractDNetDcView"
	},
	
	// **************** Properties *****************

	
	
	// **************** Public API *****************
	 
	
	/**
	 * @public Helper method to disable all fields.
	 */
	_disableAllFields_ : function() {
		this.getForm().getFields().each(function(item, index, length) {
					item.disable();
				});
	},
 
 
	/**
	 * There may be situations when a form should not validate. For example a
	 * data-control may have one form for insert and another one to edit an
	 * existing record. These forms may have different rules to validate (for
	 * example some fields are mandatory on insert but not on update others on
	 * update but not on insert). Override this function to implement the
	 * decision rules when to invoke the form validation.
	 * 
	 * @return {Boolean}
	 */
	_shouldValidate_ : function() {
		return true;
	},
	
 
	_setFieldsEnabledState_: function(names, model) {
		if(!model) return;
		for(var i=0,l=names.length; i<l; i++) {
			var n = names[i];
			this._getElement_(n).setDisabled( !this._canSetEnabled_(n, model ) );			 
		}
	},

	_setFieldsVisibleState_: function(names, model) {
		if(!model) return;
		var fields = this.getForm().getFields();
		for(var i=0,l=names.length; i<l; i++) {
			var n = names[i];
			this._getElement_(n).setVisible( this._canSetVisible_(n, model ) );	
		}
	},
	
	_canSetEnabled_ : function(name, model) {
		var fn = this._elems_.get(name)._enableFn_;
		if (fn) {
			return fn.call(this, this._controller_, model);
		} else {
			return true;
		}
	},

	_canSetVisible_ : function(name, model) {
		var fn = this._elems_.get(name)._visibleFn_;
		if (fn) {
			return fn.call(this, this._controller_, model);
		} else {
			return true;
		}
	},

 
	/**
	 * @public Helper method to disable the specified fields.
	 * 
	 * @param {Array}
	 *            fldNamesArray Array of field names
	 */
	_disableFields_ : function(fldNamesArray) {
		for (var i = 0, l = fldNamesArray.length; i < l; i++) {
			this._get_(fldNamesArray[i]).disable();
		}
	},

	/**
	 * Generic validation method which displays an message box for the user.
	 * 
	 * @return {Boolean}
	 */
	_isValid_ : function() {
		if (this.getForm().isValid()) {
			return true;
		} else {
			Ext.Msg.show({
				title : 'Invalid data',
				msg : 'Form contains invalid data.<br>Please correct values then try again. ',
				buttons : Ext.MessageBox.OK,
				scope : this,
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
	},
	
	
	// **************** Defaults and overrides *****************
	
	
	beforeDestroy : function() {
		// call the contributed helpers from mixins
		this._beforeDestroyDNetDcView_();
		this._beforeDestroyDNetView_();
		this.callParent(arguments);
	},
	
	// **************** Private methods *****************
	
	 
	/**
	 * Postprocessor run to inject framework specific settings into the
	 * elements.
	 * 
	 * @param {}
	 *            item
	 * @param {}
	 *            idx
	 * @param {}
	 *            len
	 * @return {Boolean}
	 */
	_postProcessElem_ : function(item, idx, len) {
		item["_dcView_"] = this;
		if (item.fieldLabel == undefined) {
			Dnet.translateField(this._trl_, this._controller_._trl_, item);
		}
		return true;
	}
	
 
 
	
	
});