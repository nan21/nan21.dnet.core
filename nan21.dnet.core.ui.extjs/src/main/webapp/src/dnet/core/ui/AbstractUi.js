Ext.define("dnet.core.ui.AbstractUi", {
	extend : "Ext.panel.Panel",

	mixins : {
		elemBuilder : "dnet.core.base.AbstractDNetView"
	},

	// **************** Properties *****************

	/**
	 * Component builder
	 * 
	 * @type dnet.core.ui.FrameBuilder
	 */
	_builder_ : null,

	/**
	 * Data-controls map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_dcs_ : null,

	/**
	 * Toolbar definitions map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_tlbs_ : null,

	/**
	 * Toolbar items definitions map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_tlbitms_ : null,

	/**
	 * Toolbar titles map. Used to retrieve the title element from a toolbar in
	 * a later stage, for example by the FrameInspector
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_tlbtitles_ : null,

	/**
	 * Custom reports attached to this frame. It is an array of configuration
	 * objects with the following attributes: toolbar: the name of toolbar where
	 * the link to this report should be attached report: code of the report
	 * used to lookup the definition and rules to be invoked. title : title of
	 * the report to display in the menu
	 * 
	 * @type
	 */
	_reports_ : null,

	/**
	 * Buttons state rules. Map with functions executed in frame context to
	 * apply enabled/disabled visible/hidden state to a button. Usually the
	 * framework invokes this functions whenever a state change occurs in the
	 * frame like record change in a data-control, save, selection, etc but it
	 * can be called programmatically also whenever is necessary.
	 * 
	 * The function is called with a DC as single argument
	 * 
	 * 
	 * 
	 */
	_buttonStateRules_ : {},

	/**
	 * Frame status bar
	 * @type Ext.ux.StatusBar
	 */
	_statusBar_ : null,
	
	// ************** to be reviewed

	/**
	 * Injected configuration variables map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_configVars_ : null,

	/**
	 * Actions map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_actions_ : null,

	_name_ : null,
	_title_ : null,
	

	_header_ : null,

	// _trl_ : null,

	// **************** Public API *****************

	/**
	 * Get a data-control instance.
	 * 
	 * @param {String}
	 *            name
	 * @return {}
	 */
	_getDc_ : function(name) {
		return this._dcs_.get(name);
	},

	/**
	 * Get a toolbar instance.
	 * 
	 * @param {String}
	 *            name
	 * @return {}
	 */
	_getToolbar_ : function(name) {
		return Ext.getCmp(this._tlbs_.get(name).id);
	},

	/**
	 * Get a toolbar's configuration.
	 * 
	 * @param {String}
	 *            name
	 * @return {Object}
	 */
	_getToolbarConfig_ : function(name) {
		return this._tlbs_.get(name);
	},

	/**
	 * Get a toolbar item instance.
	 * 
	 * @param {String}
	 *            name
	 * @return {}
	 */
	_getToolbarItem_ : function(name) {
		return Ext.getCmp(this._tlbitms_.get(name).id);
	},

	/**
	 * Get a toolbar item's configuration object.
	 * 
	 * @param {String}
	 *            name
	 * @return {Object}
	 */
	_getToolbarItemConfig_ : function(name) {
		return this._tlbitms_.get(name);
	},

	/**
	 * @protected Factory method to create the data-control instances used in
	 *            this frame.
	 */
	_defineDcs_ : function() {
	},

	/**
	 * @protected Template method checked during elements definition flow.
	 *            Return false to skip the _defineDcs_ call.
	 * @return {Boolean}
	 */
	_beforeDefineDcs_ : function() {
		return true;
	},

	/**
	 * @protected Template method invoked after the elements definition flow.
	 *            Used mainly to add overrides to existing components.
	 */
	_afterDefineDcs_ : function() {
	},

	/**
	 * Factory method to create the toolbars
	 */
	_defineToolbars_ : function() {
	},

	/**
	 * Template method checked during toolbarss definition flow. Return false to
	 * skip the _defineToolbars_ call.
	 * 
	 * @return {Boolean}
	 */
	_beforeDefineToolbars_ : function() {
		return true;
	},

	/**
	 * @protected Template method invoked after the toolbar definition.
	 */
	_afterDefineToolbars_ : function() {
	},

	/**
	 * Link toolbars to view components.
	 * 
	 * @param {String}
	 *            tlbName Toolbar name
	 * @param {String}
	 *            viewName View name
	 */
	_linkToolbar_ : function(tlbName, viewName) {
		this._linkToolbarImpl_(tlbName, viewName)
	},
	/**
	 * @public Returns the builder associated with this type of component. If it
	 *         doesn't exist yet attempts to create it.
	 * @return {dnet.core.ui.FrameBuilder}
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.ui.FrameBuilder({
						frame : this
					});
		}
		return this._builder_;
	},

	/**
	 * TOC stands for table of contents. Used when grouping multiple independent
	 * data-controls into one frame.
	 * Activates the canvas associated with the specified TOC element name.
	 * @param {String}
	 *            name TOC element name
	 */
	_showTocElement_ : function(name) {
		if (Ext.isNumber(name)) {
			var theToc = this._getElement_("_toc_").items.items[0];
			var r = theToc.store.getAt(name);
			theToc.getSelectionModel().select(r);
		} else {
			var theToc = this._getElement_("_toc_").items.items[0];
			var r = theToc.store.findRecord("name", name);
			theToc.getSelectionModel().select(r);
		}

	},

	/**
	 * Programmatically invoke a toolbar item action.
	 * @param {String} name Toolbar-item name
	 * @param {String} tlbName Toolbar name
	 */
	_invokeTlbItem_ : function(name, tlbName) {
		var b = null;
		if (!tlbName) {
			b = this._tlbitms_.get(name);
		} else {
			b = this._tlbitms_.get(tlbName + "__" + name);
		}
		if (b) {
			b.execute();
		}
	},
	
	/**
	 * Opens an assignment window component.
	 * @param {String} asgnWdwClass 
	 * @param {Object} cfg Extra configuration to apply
	 */
	_showAsgnWindow_: function(asgnWdwClass, cfg) {
		var objectId = this._dcs_.get(cfg.dc).record.data[cfg.objectIdField];
		var aw = Ext.create(asgnWdwClass, cfg);
		aw.show();
		aw._controller_.params.objectId = objectId;
		aw._controller_.initAssignement();
	}, 
	
	/**
	 * @deprecated Use _showAsgnWindow_ function. 
	 * @param {} asgnWdwClass
	 * @param {} cfg
	 */
	showAsgnWindow : function(asgnWdwClass, cfg) {
		this._showAsgnWindow_(asgnWdwClass, cfg);
	},
	
	// **************** Defaults and overrides *****************

	// **************** Private API *****************

	/**
	 * Show a generic message to user whenever an action cannot be executed because of outstanding changes.
	 * This will be moved to a specialized class with preconfigured messages. 
	 */
	_alert_dirty_ : function() {
		var msg = "Cannot execute the requested action as there are unsaved changes. <br> Save your changes or discard them then try again. ";
		Ext.Msg.show({
					title : "Action not allowed",
					msg : msg,
					scope : this,
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK
				});
		return;
	},
	
	
	
	_linkToolbarImpl_ : function(tlbName, viewName) {
		var tlb = this._tlbs_.get(tlbName);
		if (Ext.isEmpty(tlb)) {
			return;
		}
		var view = this._elems_.get(viewName);
		view["tbar"] = tlb;
//		var keys = [];
//		var n, kb = null;
//		for (var i = 0; i < tlb.length; i++) {
//			var ic = tlb[i]["initialConfig"];
//			if (ic) {
//				n = ic["_name_"];
//				kb = dnet.core.ui.DefaultKeyMap[n];
//				if (kb) {
//					keys[keys.length] = {
//						key : kb.key,
//						alt : kb.alt,
//						handler : this._createKeyBindingHandler_(n, tlbName),
//						scope : this,
//						stopEvent : true
//					}
//				}
//			}
//		}
//		view["keys"] = keys;
	},

	_onReady_ : function(p) {
		getApplication().setFrameTabTitle(this._name_, this._title_);
		// getApplication().registerFrameInstance(this._name_,this);
		getApplication().applyFrameCallback(this._name_, this);
		if (p == this) {
			this._onReady_();
		}
	},

	

	_config_ : function() {
	},

 
	_createKeyBindingHandler_ : function(itemName, tlbName) {
		return function() {
			this._invokeTlbItem_(itemName, tlbName);
		}
	},
 
	_applyStateButton_ : function(btnName) {  
		var btn = this._getElement_(btnName);
		if (btn) {
			var sm = btn.initialConfig.stateManager;
			if (sm) {
				var bsr = this._buttonStateRules_[btnName];
				var theDc = this._getDc_(sm.dc);
				var smstate = dnet.core.ui.FrameButtonStateManager["is_"
						+ sm.name](theDc);
				if (smstate && bsr) {
					smstate = smstate && bsr.call(this, theDc);
				}
				if (smstate) {
					btn.enable();
				} else {
					btn.disable();
				}
			}
		}
	},

	_applyStateButtons_ : function(buttonNames) {
		for (var i = 0, l = buttonNames.length; i < l; i++) {
			this._applyStateButton_(buttonNames[i]);
		}
	},

	_applyStateAllButtons_ : function() {
		this._elems_.filterBy(function(o, k) {
					return o.xtype == "button"
				}).eachKey(function(key, item) {
					this._applyStateButton_(key);
				}, this)
	},
 
 

	initComponent : function() {
		if (getApplication().getSession().rememberViewState) {
			Ext.state.Manager
					.setProvider(new Ext.state.LocalStorageProvider({}));
		}
		this._mainViewName_ = "main";
		try {
			this._trl_ = Ext.create(this.$className + "$Trl");
		} catch (e) {
			Ext.Msg.show({
						title : "Invalid language-pack",
						msg : "No translation file found for "
								+ this.$className
								+ "$Trl <br> Using the default system language.",
						icon : Ext.MessageBox.INFO,
						buttons : Ext.Msg.OK
					});
		}

		this._elems_ = new Ext.util.MixedCollection();
		this._configVars_ = new Ext.util.MixedCollection();
		this._tlbs_ = new Ext.util.MixedCollection();
		this._tlbitms_ = new Ext.util.MixedCollection();
		this._actions_ = new Ext.util.MixedCollection();
		this._dcs_ = new Ext.util.MixedCollection();
		this._buttonStateRules_ = {};

		this._statusBar_ = new Ext.ux.StatusBar({
					id : 'ui-status-bar',
					defaultText : 'Status bar. Watch for messages ... ',
					defaultIconCls : 'default-icon',
					text : 'Ready',
					iconCls : 'ready-icon',
					items : ['-', this._name_]
				});

		this._config_();
		this._startDefine_();

		/* define data-controls */
		if (this._beforeDefineDcs_() !== false) {
			this._defineDcs_();
			this._afterDefineDcs_();
		}
 

		/* define stand-alone user-interface elements */
		if (this._beforeDefineElements_() !== false) {
			this._defineElements_();
			this._afterDefineElements_();
		}

		/* define toolbars */
		if (this._beforeDefineToolbars_() !== false) {
			this._defineToolbars_();
			this._afterDefineToolbars_();
		}

		/* build the ui, linking elements */
		if (this._beforeLinkElements_() !== false) {
			this._linkElements_();
			this._afterLinkElements_();
		}
 
		this._endDefine_();

		Ext.apply(this, {
					layout : "fit",
					bbar : this._statusBar_,
					items : [this._elems_.get(this._mainViewName_)]
				});

		if (this._trl_ && this._trl_.title) {
			this._title_ = this._trl_.title;
		} else {
			this._title_ = Dnet.translate("ui", this._name_
							.substring(this._name_.lastIndexOf(".") + 1));
		}

		this.callParent(arguments);
		this.mon(this, "afterlayout", this._onReady_, this);
 
	},

	beforeDestroy : function() { 
		this._beforeDestroyDNetView_();
		this._elems_.each(this.destroyElement, this);
		this._tlbitms_.each(function(item) {
					try {
						Ext.destroy(item);
					} catch (e) {
						alert(e);
					}
				});
		this._tlbs_.each(function(item) {
					try {
						Ext.destroy(item);
					} catch (e) {
						alert(e);
					}
				});
		this._dcs_.each(function(item) {
					try {
						Ext.destroy(item);
					} catch (e) {
						alert(e);
					}
				});
	},
	//	
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
/*
 * define the key as one of the following: 1) string: "l", "a" , ... 2) ascii
 * key code 65, 68, .... 3) Ext.EventObject.F2 , Ext.EventObject.ENTER , ....
 * are defined in Ext.EventManager
 */
//dnet.core.ui.DefaultKeyMap = Ext.apply({}, {
//			load : {
//				key : "l",
//				alt : true
//			},
//			save : {
//				key : "s",
//				alt : true
//			},
//			save_mr : {
//				key : "s",
//				alt : true
//			},
//			new_sr : {
//				key : "n",
//				alt : true
//			},
//			new_mr : {
//				key : "n",
//				alt : true
//			},
//			copy_sr : {
//				key : "c",
//				alt : true
//			},
//			copy_mr : {
//				key : "c",
//				alt : true
//			},
//			delete_sr : {
//				key : "d",
//				alt : true
//			},
//			delete_mr : {
//				key : "d",
//				alt : true
//			},
//			edit_sr : {
//				key : Ext.EventObject.ENTER,
//				alt : false
//			},
//			rollback_sr : {
//				key : "z",
//				alt : true
//			},
//			rollback_mr : {
//				key : "z",
//				alt : true
//			},
//			back_sr : {
//				key : "q",
//				alt : true
//			},
//			back_mr : {
//				key : "q",
//				alt : true
//			}
//
//		});
