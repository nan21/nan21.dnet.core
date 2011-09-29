Ext.define("dnet.base.AbstractAsgnUi", {
	extend : "Ext.window.Window",

	// DNet properties

	_elems_ : null,
	_controller_ : null,
	_leftGridId_ : null,
	_rightGridId_ : null,
	_windowConfig_ : null,
	_filterFields_ : null,
	_defaultFilterField_ : null,
	_autoCloseAfterSave_ : true,

	// defaults

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
			items : [ {
				layout : {
					type : "hbox",
					align : "stretch"
				},
				items : [
						{
							frame : true,
							flex : 10,
							layout : {
								type : "vbox",
								align : "stretch"
							},
							items : [ this._elems_.get("leftFilter"),
									this._elems_.get("leftList") ]
						},
						{
							width : 80,
							frame : true,
							layout : {
								type : "vbox",
								align : "stretch",
								pack : "center"
							},
							items : this._buildToolbarItems_()
						},
						{
							frame : true,
							flex : 10,
							layout : {
								type : "vbox",
								align : "stretch"
							},
							items : [ this._elems_.get("rightFilter"),
									this._elems_.get("rightList") ]
						} ]
			} ]
		});
		this.callParent(arguments);

		if (this._autoCloseAfterSave_ == true) {
			this._controller_.on("afterDoSaveSuccess", function() {
				this.close();
			}, this);
		}
	},

	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},

	_getElementConfig_ : function(name) {
		return this._elems_.get(name);
	},

	_startDefine_ : function() {
	},

	_endDefine_ : function() {
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
		for ( var i = 0; i < l; i++) {
			if (t[i]["name"] && t[i]["name"] == itmn)
				return t[i];
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

	/**
	 * Execute query for the left list which shows the available elements.
	 */
	_doQueryLeft_ : function() {
		var f = this._controller_.filter.left;
		f.field = this._getElement_("leftFilterCombo").getValue();
		f.value = this._getElement_("leftFilterField").getValue();
		if (Ext.isEmpty(f.field) && !Ext.isEmpty(f.value)) {
			Ext.Msg.show( {
				icon : Ext.MessageBox.ERROR,
				msg : "Select the field to filter.",
				buttons : Ext.Msg.OK
			});
			return;
		}
		this._controller_.doQueryLeft();
	},

	/**
	 * Execute query for the right list which shows the selected elements.
	 */
	_doQueryRight_ : function() {
		var f = this._controller_.filter.right;
		f.field = this._getElement_("rightFilterCombo").getValue();
		f.value = this._getElement_("rightFilterField").getValue();
		if (Ext.isEmpty(f.field) && !Ext.isEmpty(f.value)) {
			Ext.Msg.show( {
				icon : Ext.MessageBox.ERROR,
				msg : "Select the field to filter ",
				buttons : Ext.Msg.OK
			});
			return;
		}
		this._controller_.doQueryRight();
	},

	/**
	 * Returns the builder.
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.base.AsgnUiBuilder( {
				asgnUi : this
			});
		}
		return this._builder_;
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
			items : [ this._elems_.get("leftFilterField"),
					this._elems_.get("leftFilterCombo"),
					this._elems_.get("leftFilterBtn") ]
		});

		this._elems_.add("rightFilter", {
			fieldLabel : "Filter",
			xtype : "fieldcontainer",
			layout : 'hbox',
			preventMark : true,
			labelAlign : "right",
			labelWidth : 70,
			items : [ this._elems_.get("rightFilterField"),
					this._elems_.get("rightFilterCombo"),
					this._elems_.get("rightFilterBtn") ]
		});

	},

	/**
	 * Define the buttons for the assignment windows. Selection buttons, save
	 * and initialize.
	 */
	_buildToolbarItems_ : function() {
		return [
				{
					xtype : "button",
					text : 'Cancel',
					tooltip : "Cancel changes and reload initial selection ",
					scope : this,
					handler : function() {
						this._controller_.doReset();
					}
				},
				{
					xtype : "tbspacer",
					height : 25
				},
				{
					xtype : "button",
					iconCls : 'icon-action-assign_moveright',
					text : ">",
					tooltip : "Add selected",
					scope : this,
					handler : function() {
						this._controller_.doMoveRight(Ext
								.getCmp(this._leftGridId_), Ext
								.getCmp(this._rightGridId_));
					}
				},
				{
					xtype : "tbspacer",
					height : 5
				},
				{
					xtype : "button",
					iconCls : 'icon-action-assign_moveleft',
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
					iconCls : 'icon-action-assign_moverightall',
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
					iconCls : 'icon-action-assign_moveleftall',
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
				} ];

	}

});