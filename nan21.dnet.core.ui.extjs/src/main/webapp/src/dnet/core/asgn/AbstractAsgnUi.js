Ext.define("dnet.core.asgn.AbstractAsgnUi", {
			extend : "Ext.window.Window",

			mixins : {
				elemBuilder : "dnet.core.base.AbstractDNetView"
			},

			// **************** Properties *****************

			/**
			 * Assignment controller
			 * 
			 * @type dnet.core.asgn.AbstractAsgn
			 */
			_controller_ : null,

			/**
			 * Component builder
			 * 
			 * @type dnet.core.asgn.AsgnUiBuilder
			 */
			_builder_ : null,

			/**
			 * Left grid (available records) id
			 * 
			 * @type String
			 */
			_leftGridId_ : null,

			/**
			 * Right grid (selected records) id
			 * 
			 * @type String
			 */
			_rightGridId_ : null,

			/**
			 * Configuration object for the window
			 * 
			 * @type Object
			 */
			_windowConfig_ : null,

			_filterFields_ : null,
			_defaultFilterField_ : null,

			/**
			 * Flag to switch on/off auto-close mode of the assignment window
			 * upon succesful save.
			 * 
			 * @type Boolean
			 */
			_autoCloseAfterSave_ : true,

			/**
			 * Cancel button id.
			 * 
			 * @type String
			 */
			_btnCancelId_ : null,

			/**
			 * Save button id.
			 * 
			 * @type String
			 */
			_btnSaveId_ : null,

			/**
			 * Move left selection button id.
			 * 
			 * @type String
			 */
			_btnMoveLeftId_ : null,

			/**
			 * Move left all button id.
			 * 
			 * @type String
			 */
			_btnMoveLeftAllId_ : null,

			/**
			 * Move right selection button id.
			 * 
			 * @type String
			 */
			_btnMoveRightId_ : null,

			/**
			 * Move right all button id.
			 * 
			 * @type String
			 */
			_btnMoveRightAllId_ : null,

			// **************** Public API *****************

			/**
			 * Returns the builder.
			 * 
			 * @return {dnet.core.asgn.AsgnUiBuilder}
			 */
			_getBuilder_ : function() {
				if (this._builder_ == null) {
					this._builder_ = new dnet.core.asgn.AsgnUiBuilder({
								asgnUi : this
							});
				}
				return this._builder_;
			},

			_getToolbar_ : function(name) {
				return this._tlbs_.get(name);
			},

			_getToolbarConfig_ : function(name) {
				return this._tlbs_.get(name);
			},

			_getToolbarItem_ : function(tlbn, itmn) {
				return this._tlbs_.get(name);
			},

			_getToolbarItemConfig_ : function(tlbn, itmn) {
				var t = this._tlbs_.get(tlbn);
				var l = t.length;
				for (var i = 0; i < l; i++) {
					if (t[i]["name"] && t[i]["name"] == itmn)
						return t[i];
				}
			},

			/**
			 * Execute query for the left list which shows the available
			 * elements.
			 */
			_doQueryLeft_ : function() {
				this._doQueryLeftImpl_();
			},

			_doQueryRight_ : function() {
				this._doQueryRightImpl_();
			},

			/**
			 * Get left grid instance
			 * 
			 * @return {dnet.core.asgn.AbstractAsgnGrid}
			 */
			_getLeftGrid_ : function() {
				return Ext.getCmp(this._leftGridId_);
			},

			/**
			 * Get right grid instance
			 * 
			 * @return {dnet.core.asgn.AbstractAsgnGrid}
			 */
			_getRightGrid_ : function() {
				return Ext.getCmp(this._rightGridId_);
			},

			/**
			 * Get move left button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnMoveLeft_ : function() {
				return Ext.getCmp(this._btnMoveLeftId_);
			},

			/**
			 * Get move left all button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnMoveLeftAll_ : function() {
				return Ext.getCmp(this._btnMoveLeftAllId_);
			},

			/**
			 * Get move right button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnMoveRight_ : function() {
				return Ext.getCmp(this._btnMoveRightId_);
			},

			/**
			 * Get move right all button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnMoveRightAll_ : function() {
				return Ext.getCmp(this._btnMoveRightAllId_);
			},

			/**
			 * Get save button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnSave_ : function() {
				return Ext.getCmp(this._btnSaveId_);
			},

			/**
			 * Get cancel button
			 * 
			 * @return {Ext.button.Button}
			 */
			_getBtnCancel_ : function() {
				return Ext.getCmp(this._btnCancelId_);
			},

			/**
			 * @private Apply state rules to enable/disable or show/hide
			 *          components.
			 * 
			 */
			_applyStates_ : function() {
				if (this._beforeApplyStates_() !== false) {
					this._onApplyStates_();
				}
				this._afterApplyStates_();
			},

			/**
			 * @protected Template method checked before applying states.
			 * 
			 * @return {Boolean}
			 */
			_beforeApplyStates_ : function() {
				return true;
			},

			/**
			 * @protected Template method invoked after the state rules are
			 *            applied.
			 */
			_afterApplyStates_ : function() {
			},

			/**
			 * @protected Implement the state control logic in subclasses.
			 * 
			 */
			_onApplyStates_ : function() {
				if(this._getLeftGrid_().getSelectionModel().getSelection().length == 0) {
					this._getBtnMoveRight_().disable();
				} else {
					this._getBtnMoveRight_().enable();
				}
				if(this._getRightGrid_().getSelectionModel().getSelection().length == 0) {
					this._getBtnMoveLeft_().disable();
				} else {
					this._getBtnMoveLeft_().enable();
				}
			},

			// **************** Defaults and overrides *****************

			layout : "fit",
			closable : true,
			closeAction : "hide",
			modal : true,

			initComponent : function() {

				this._elems_ = new Ext.util.MixedCollection();
				this._tlbs_ = new Ext.util.MixedCollection();
				this._tlbitms_ = new Ext.util.MixedCollection();
				this._controller_ = Ext.create(this._controller_, {});

				this._leftGridId_ = Ext.id()
				this._rightGridId_ = Ext.id()

				this._startDefine_();
				this._defineDefaultElements_();

				if (this._beforeDefineElements_() !== false) {
					this._defineElements_();
				}
				this._afterDefineElements_();

				if (this._beforeLinkElements_() !== false) {
					this._linkElements_();
				}
				this._afterLinkElements_();

				this._endDefine_();

				Ext.apply(this, {
							items : [{
								xtype : "container",
								layout : {
									type : "hbox",
									align : "stretch"
								},
								items : [{
									frame : true,
									flex : 10,
									xtype : "container",
									layout : {
										type : "vbox",
										align : "stretch"
									},
									items : [this._elems_.get("leftFilter"),
											this._elems_.get("leftList")]
								}, {
									width : 80,
									frame : true,
									xtype : "container",
									layout : {
										type : "vbox",
										align : "stretch",
										pack : "center"
									},
									items : this._buildToolbarItems_()
								}, {
									frame : true,
									flex : 10,
									xtype : "container",
									layout : {
										type : "vbox",
										align : "stretch"
									},
									items : [this._elems_.get("rightFilter"),
											this._elems_.get("rightList")]
								}]
							}]
						});
				this.callParent(arguments);
				this._registerListeners_();
			},

			/**
			 * Register event listeners
			 */
			_registerListeners_ : function() {
				if (this._autoCloseAfterSave_ == true) {
					this._controller_.on("afterDoSaveSuccess", function() {
								this.close();
							}, this);
				}
				var _lg = this._getLeftGrid_();
				if (_lg) {
					this.mon(_lg, "itemdblclick", this._onLeftGrid_dblclick_,
							this);
					this.mon(_lg.getSelectionModel(), "selectionchange",
							this._applyStates_, this);
				}
				var _rg = this._getRightGrid_();
				if (_rg) {
					this.mon(_rg, "itemdblclick", this._onRightGrid_dblclick_,
							this);
					this.mon(_rg.getSelectionModel(), "selectionchange",
							this._applyStates_, this);
				}
				this.mon(this._controller_.storeLeft, "load", function(store, recs, success, eOpts) {
					if (store.totalCount == 0) {
						this._getBtnMoveRightAll_().disable();
					} else {
						this._getBtnMoveRightAll_().enable();
					}
				}, this);
				this.mon(this._controller_.storeRight, "load", function(store, recs, success, eOpts) {
					if (store.totalCount == 0) {
						this._getBtnMoveLeftAll_().disable();
					} else {
						this._getBtnMoveLeftAll_().enable();
					}
				}, this);
			},

			// **************** Private API *****************

			/**
			 * When double-click a row automatically move it.
			 */
			_onLeftGrid_dblclick_ : function() {
				var btn = this._getBtnMoveRight_();
				if (btn && !btn.disabled) {
					btn.handler.call(btn.scope);
				}
			},

			/**
			 * When double-click a row automatically move it.
			 */
			_onRightGrid_dblclick_ : function() {
				var btn = this._getBtnMoveLeft_();
				if (btn && !btn.disabled) {
					btn.handler.call(btn.scope);
				}
			},

			/**
			 * Execute query for the left list which shows the available
			 * elements. Private implementation code.
			 */
			_doQueryLeftImpl_ : function() {
				var f = this._controller_.filter.left;
				f.field = this._getElement_("leftFilterCombo").getValue();
				f.value = this._getElement_("leftFilterField").getValue();
				if (Ext.isEmpty(f.field) && !Ext.isEmpty(f.value)) {
					Ext.Msg.show({
								icon : Ext.MessageBox.ERROR,
								msg : "Select the field to filter.",
								buttons : Ext.Msg.OK
							});
					return;
				}
				this._controller_.doQueryLeft();
			},

			/**
			 * Execute query for the right list which shows the selected
			 * elements. Private implementation code.
			 */
			_doQueryRightImpl_ : function() {
				var f = this._controller_.filter.right;
				f.field = this._getElement_("rightFilterCombo").getValue();
				f.value = this._getElement_("rightFilterField").getValue();
				if (Ext.isEmpty(f.field) && !Ext.isEmpty(f.value)) {
					Ext.Msg.show({
								icon : Ext.MessageBox.ERROR,
								msg : "Select the field to filter ",
								buttons : Ext.Msg.OK
							});
					return;
				}
				this._controller_.doQueryRight();
			},

			/**
			 * Define the default filter elements for the assignment window.
			 */
			_defineDefaultElements_ : function() {

				this._elems_.add("leftFilterField", {
							xtype : "textfield",
							width : 80,
							emptyText : "Filter...",
							id : Ext.id()
						});

				this._elems_.add("leftFilterBtn", {
							xtype : "button",
							text : "Ok",
							scope : this,
							handler : function() {
								this._doQueryLeft_();
							}
						});

				this._elems_.add("rightFilterField", {
							xtype : "textfield",
							width : 80,
							emptyText : "Filter...",
							id : Ext.id()
						});

				this._elems_.add("rightFilterBtn", {
							xtype : "button",
							text : "Ok",
							scope : this,
							handler : function() {
								this._doQueryRight_();
							}
						});

				this._elems_.add("leftFilterCombo", {
							xtype : "combo",
							value : "",
							width : 100,
							selectOnFocus : true,
							forceSelection : true,
							triggerAction : "all",
							id : Ext.id(),
							store : this._filterFields_,
							value : this._defaultFilterField_
						});

				this._controller_.filter.left.field = "code";

				this._elems_.add("rightFilterCombo", {
							xtype : "combo",
							value : "",
							width : 100,
							selectOnFocus : true,
							forceSelection : true,
							triggerAction : "all",
							id : Ext.id(),
							store : this._filterFields_,
							value : this._defaultFilterField_
						});

				this._elems_.add("leftFilter", {
							fieldLabel : "Filter",
							xtype : "fieldcontainer",
							layout : 'hbox',
							preventMark : true,
							labelAlign : "right",
							labelWidth : 70,
							items : [this._elems_.get("leftFilterField"),
									this._elems_.get("leftFilterCombo"),
									this._elems_.get("leftFilterBtn")]
						});

				this._elems_.add("rightFilter", {
							fieldLabel : "Filter",
							xtype : "fieldcontainer",
							layout : 'hbox',
							preventMark : true,
							labelAlign : "right",
							labelWidth : 70,
							items : [this._elems_.get("rightFilterField"),
									this._elems_.get("rightFilterCombo"),
									this._elems_.get("rightFilterBtn")]
						});

			},

			/**
			 * Define the buttons for the assignment windows. Selection buttons,
			 * save and initialize.
			 */
			_buildToolbarItems_ : function() {
				this._btnCancelId_ = Ext.id();
				this._btnSaveId_ = Ext.id();
				this._btnMoveLeftId_ = Ext.id();
				this._btnMoveLeftAllId_ = Ext.id();
				this._btnMoveRightId_ = Ext.id();
				this._btnMoveRightAllId_ = Ext.id();
				return [{
							xtype : "button",
							text : 'Cancel',
							tooltip : "Cancel changes and reload initial selection ",
							id : this._btnCancelId_,
							scope : this,
							handler : function() {
								this._controller_.doReset();
							}
						}, {
							xtype : "tbspacer",
							height : 25
						}, {
							xtype : "button",
							// iconCls : 'icon-action-assign_moveright',
							text : ">",
							tooltip : "Add selected",
							id : this._btnMoveRightId_,
							scope : this,
							handler : function() {
								this._controller_.doMoveRight(Ext
												.getCmp(this._leftGridId_), Ext
												.getCmp(this._rightGridId_));
							}
						}, {
							xtype : "tbspacer",
							height : 5
						}, {
							xtype : "button",
							// iconCls : 'icon-action-assign_moveleft',
							text : "<",
							tooltip : "Remove selected",
							id : this._btnMoveLeftId_,
							scope : this,
							handler : function() {
								this._controller_.doMoveLeft(Ext
												.getCmp(this._leftGridId_), Ext
												.getCmp(this._rightGridId_));
							}
						}, {
							xtype : "tbspacer",
							height : 25
						}, {
							xtype : "button",
							// iconCls : 'icon-action-assign_moverightall',
							text : ">>",
							tooltip : "Add all",
							id : this._btnMoveRightAllId_,
							scope : this,
							handler : function() {
								this._controller_.doMoveRightAll();
							}
						}, {
							xtype : "tbspacer",
							height : 5
						}, {
							xtype : "button",
							// iconCls : 'icon-action-assign_moveleftall',
							text : "<<",
							tooltip : "Remove all",
							id : this._btnMoveLeftAllId_,
							scope : this,
							handler : function() {
								this._controller_.doMoveLeftAll();
							}
						}, {
							xtype : "tbspacer",
							height : 25
						}, {
							xtype : "button",
							text : 'Save',
							tooltip : "Save changes",
							id : this._btnSaveId_,
							scope : this,
							handler : function() {
								this._controller_.doSave();
							}
						}];

			}
		});