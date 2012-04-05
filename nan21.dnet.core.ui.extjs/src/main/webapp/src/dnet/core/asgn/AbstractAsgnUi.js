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
				if (this._autoCloseAfterSave_ == true) {
					this._controller_.on("afterDoSaveSuccess", function() {
								this.close();
							}, this);
				}
			},

			// **************** Private API *****************

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
				return [{
							xtype : "button",
							text : 'Cancel',
							tooltip : "Cancel changes and reload initial selection ",
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
							scope : this,
							handler : function() {
								this._controller_.doSave();
							}
						}];

			}
		});