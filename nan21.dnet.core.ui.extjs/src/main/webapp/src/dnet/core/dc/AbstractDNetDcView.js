/**
 * Mixin which provides DC-view support.
 */
Ext.define("dnet.core.dc.AbstractDNetDcView", {

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
			 * @private Apply state rules to enable/disable or show/hide
			 *          components.
			 * 
			 * @param model
			 *            Is either the current record or current filter bound
			 *            to this form-view.
			 * 
			 */
			_applyStates_ : function(model) {
				if (this._beforeApplyStates_(model) !== false) {
					this._onApplyStates_(model);
				}
				this._afterApplyStates_(model);
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
			 * @protected Template method invoked after the state rules are
			 *            applied.
			 */
			_afterApplyStates_ : function(model) {
			},

			/**
			 * @protected Implement the state control logic in subclasses.
			 * 
			 */
			_onApplyStates_ : function(model) {

			},

			/**
			 * @protected Template method called after a new model is bound to
			 *            the form. Add custom logic in subclasses if necessary.
			 * @param {Ext.data.Model}
			 *            model Current record or current filter depending on
			 *            the DC view type
			 */
			_afterBind_ : function(model) {
			},

			/**
			 * @protected Template method called after a model is un-bound from
			 *            the form. Add custom logic in subclasses if necessary.
			 * @param {Ext.data.Model}
			 *            model Current record or current filter depending on
			 *            the DC view type
			 */
			_afterUnbind_ : function(model) {
			},

			// **************** Private methods *****************

			/**
			 * The filter model is not part of a store, so we have listen to
			 * changes made to the model through the `filterValueChanged` event
			 * raised by the data-control. So changes to the filter model should
			 * be done through the setFilterValue method of the data-control in
			 * order to be listened and picked-up to refresh the correcponding
			 * filter-form fields.
			 * 
			 * @param {dnet.core.dc.AbstractDc}
			 *            dc The controller
			 * @param {String}
			 *            property The filter property which has been changed
			 * @param {Object}
			 *            ov Old value
			 * @param {Object}
			 *            nv New value
			 */
			_onFilterValueChanged_ : function(dc, property, ov, nv) {
				var fld = this._elems_.findBy(function(item) {
							return (item.dataIndex == property);
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
			 * @private The parameters model is not part of a store, so we have
			 *          listen to changes made to the model through the
			 *          `parameterValueChanged` event raised by the
			 *          data-control. Changes to the parameters model should be
			 *          done through the setParamValue method of the
			 *          data-control in order to be listened and picked-up to
			 *          refresh the correcponding form fields.
			 * 
			 * @param {dnet.core.dc.AbstractDc}
			 *            dc The controller
			 * @param {String}
			 *            property The parameters property which has been
			 *            changed
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
			 * Get the translation from the resource bundle for the specified
			 * key.
			 * 
			 * @param {String}
			 *            k Key to be translated
			 * @return {String} Translation of the key or the key itself if not
			 *         translation found.
			 */
			_getRBValue_ : function(k) {
				if (this._trl_ != null && this._trl_[k]) {
					return this._trl_[k];
				}
				if (this._controller_._trl_ != null
						&& this._controller_._trl_[k]) {
					return this._controller_._trl_[k];
				} else {
					return k;
				}
			},
			
			_beforeDestroyDNetDcView_ : function() {
				this._controller_ = null;
				if(this._builder_) {
					this._builder_.dcv = null;	
				} 		
			}

			
		});