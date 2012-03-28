/**
 * Base panel used for data-control views. It serves as base class for
 * edit-forms and filter-forms.
 */
Ext.define("dnet.core.dc.AbstractDNetDcForm", {
	extend : "Ext.form.Panel",

	mixins: {
		factoryElems: "dnet.core.base.AbstractDNetView"
	},
	
	// **************** Properties *****************
	
	/**
	 * 
	 * @type dnet.core.dc.AbstractDc
	 */
	_controller_ : null,

	
	// **************** Public API *****************
	
	
	
	/**
	 * @public Returns the controller of this view
	 * 
	 * @return {@type dnet.core.dc.AbstractDc}
	 */
	_getController_ : function() {
		return this._controller_;
	},
	
	
		/**
	 * @public Helper method to disable all fields.
	 */
	_disableAllFields_ : function() {
		this.getForm().getFields().each(function(item, index, length) {
					item.disable();
				});
	},
 
	/**
	 * @public Template method called after a new model is bound to the form.
	 *         Add custom logic in subclasses if necessary.
	 * @param {}
	 *            record
	 */
	_afterBind_ : function(record) {
	},

	/**
	 * @public Template method called after a model is un-bound from the form.
	 *         Add custom logic in subclasses if necessary.
	 * @param {}
	 *            record
	 */
	_afterUnbind_ : function(record) {
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
	
		/**
	 * @protected Implement the state control logic in subclasses.
	 * 
	 */
	_onApplyStates_ : function(model) {

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
	 * @protected Template method checked before applying states.
	 * 
	 * @return {Boolean}
	 */
	_beforeApplyStates_ : function(model) {
		return true;
	},

	/**
	 * @protected Template method invoked after the state rules are applied.
	 */
	_afterApplyStates_ : function(model) {
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
	
	
	// **************** Private methods *****************
	
	
	
	/**
	 * @private Apply state rules to enable/disable or show/hide components.
	 * 
	 * @param model
	 *            Is either the current record or current filter bound to this
	 *            form-view.
	 * 
	 */
	_applyStates_ : function(model) {
		if (this._beforeApplyStates_(model) !== false) {
			this._onApplyStates_(model);
		}
		this._afterApplyStates_(model);
	},

	/**
	 * @private The parameters model is not part of a store, so we have listen to changes
	 * made to the model through the `parameterValueChanged` event raised by the
	 * data-control. Changes to the parameters model should be done through the
	 * setParamValue method of the data-control in order to be listened and
	 * picked-up to refresh the correcponding form fields.
	 * 
	 * @param {dnet.core.dc.AbstractDc}
	 *            dc The controller
	 * @param {String}
	 *            property The parameters property which has been changed
	 * @param {Object}
	 *            ov Old value
	 * @param {Object}
	 *            nv New value
	 */
	_onParameterValueChanged_ : function(dc, property, ov, nv) {
		var fld = this._elems_.findBy(function(item) {
					return (item.paramIndex == property);
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
	},
	
	
	

	/**
	 * Get the translation from the resource bundle for the specified key.
	 * 
	 * @param {}
	 *            k
	 * @return {}
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
	
	
	
	// **************** destroy component *****************

	// TODO: to be reviewed!!

	beforeDestroy : function() {
		this._controller_ = null;
		this.callParent();
		try {
			this._unlinkElemRefs_();
		} catch (e) {
		
		}
		this._elems_.each(this.unlinkElem, this);
		this._elems_.each(this.destroyElement, this);
	},

	unlinkElem : function(item, index, len) {
		item._dcView_ = null;
	},

	destroyElement : function(elemCfg) {
		try {
			var c = Ext.getCmp(elemCfg.id);
			if (c) {
				Ext.destroy(c);
			}
		} catch (e) {
			// alert(e);
		}
	}
	
	
});