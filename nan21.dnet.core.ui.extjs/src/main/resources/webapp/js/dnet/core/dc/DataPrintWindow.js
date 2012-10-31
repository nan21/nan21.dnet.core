Ext.define("dnet.core.dc.DataPrintForm", {
	extend : "Ext.form.Panel",

	actionButton : null,
	_elems_ : null,
	_formats_ : [ "html" ],
	_layouts_ : [ "portrait", "landscape" ],
	
	_grid_ : null,

	initComponent : function(config) {
		this._elems_ = new Ext.util.MixedCollection();

		this.actionButton = this.initialConfig.actionButton;
		this.actionButton.setHandler(this.executeTask, this);

		this._buildItems_();

		var cfg = {
			frame : true,

			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 100,
				msgTarget : 'side'
			},
			defaults : {
				anchor : '-20'
			},
			items : [ this._elems_.get("fld_format"),
					this._elems_.get("fld_layout"),
					this._elems_.get("fld_records") ]
		};
		Ext.apply(this, cfg);
		this.callParent(arguments);
		this.on("afterrender", this._on_format_changed_, this);
	},

	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},

	_getElementConfig_ : function(name) {
		return this._elems_.get(name);
	},

	_on_format_changed_ : function(nv) {

	},

	_buildItems_ : function() {

		this._elems_.add("fld_format", {
			fieldLabel : Dnet.translate("dcvgrid", "exp_format"),
			xtype : "combo",
			allowBlank : false,
			selectOnFocus : true,
			id : Ext.id(),
			triggerAction : "all",
			store : this._formats_,
			value : this._formats_[0],
			listeners : {
				"change" : {
					scope : this,
					fn : function(fld, nv, ov) {
						this._on_format_changed_(nv);
					}
				}
			}
		});

		this._elems_.add("fld_layout", {
			fieldLabel : Dnet.translate("dcvgrid", "exp_layout"),
			xtype : "combo",
			allowBlank : false,
			selectOnFocus : true,
			id : Ext.id(),
			triggerAction : "all",
			store : this._layouts_,
			value : this._layouts_[0]
		});

		this._elems_.add("fld_records_current", {
			boxLabel : Dnet.translate("dcvgrid", "exp_rec_current"),
			inputValue : 's',
			name : "fld_records",
			id : Ext.id(),
			disabled : true
		});

		this._elems_.add("fld_records_allpage", {
			boxLabel : Dnet.translate("dcvgrid", "exp_rec_all"),
			inputValue : 'a',
			name : "fld_records",
			id : Ext.id(),
			checked : true
		});

		this._elems_.add("fld_records", new Ext.form.RadioGroup({
			fieldLabel : Dnet.translate("dcvgrid", "exp_records"),
			xtype : "radiogroup",
			style : "border-top:1px outset",
			columns : 1,
			id : Ext.id(),
			items : [ this._elems_.get("fld_records_current"),
					this._elems_.get("fld_records_allpage") ]
		}));

	},

	executeTask : function() {

		var ctrl = this._grid_._controller_;
		var reportTitle = this._grid_._printTitle_;
		var reportLayout = this._getElement_("fld_layout").getValue();

		var url = Dnet.dsAPI(ctrl.dsName, this._getElement_("fld_format")
				.getValue());

		var filterData = ctrl.filter.data;
		var request = dnet.core.base.RequestParamFactory
				.findRequest(filterData);
		for ( var p in request.data) {
			if (request.data[p] == "") {
				request.data[p] = null;
			}
		}

		var data = Ext.encode(request.data);
		request.data = data;
		var params = {};
		var fcv = "xxx"; // this._getElement_("fld_columns").getValue().fld_columns;

		if (this._getElement_("fld_records").getValue().fld_records == "c") {
			params[Dnet.requestParam.SIZE] = 30;
			params[Dnet.requestParam.START] = 0;
		}

		var sortCols = "";
		var sortDirs = "";
		var first = true;
		ctrl.store.sorters.each(function(item, idx, len) {
			if (!first) {
				sortCols += ",";
				sortDirs += ",";
			}
			sortCols += item.property;
			sortDirs += item.direction || "ASC";
			first = false;
		}, this);

		params[Dnet.requestParam.SORT] = sortCols;
		params[Dnet.requestParam.SENSE] = sortDirs;

		if (fcv != "a") {
			var gridCm = this._grid_.columns;
			var cs = '';
			var cst = '';
			var csw = '';
			var cnt = 0;
			var len = gridCm.length;
			for ( var i = 0; i < len; i++) {
				if (fcv == "l" || !gridCm[i].hidden) {
					cs += (cnt > 0) ? "," : "";
					cs += gridCm[i].dataIndex;
					cst += (cnt > 0) ? "," : "";
					cst += gridCm[i].text.replace(",", " ");
					csw += (cnt > 0) ? "," : "";
					csw += gridCm[i].width;
					cnt++;
				}
			}
			params[Dnet.requestParam.EXPORT_COL_NAMES] = cs;
			params[Dnet.requestParam.EXPORT_COL_TITLES] = cst;
			params[Dnet.requestParam.EXPORT_FILTER_NAMES] = "";
			params[Dnet.requestParam.EXPORT_FILTER_TITLES] = "";

			params[Dnet.requestParam.EXPORT_COL_WIDTHS] = csw;
			params[Dnet.requestParam.EXPORT_TITLE] = reportTitle;
			params[Dnet.requestParam.EXPORT_LAYOUT] = reportLayout;

		}
		var _wv = 720;
		if (this._getElement_("fld_layout").getValue() == "landscape") {
			_wv = 1024;
		}
		var opts = "adress=yes, width=" + _wv + ", height=450,"
				+ "scrollbars=yes, resizable=yes,menubar=yes";
		var v = window.open(url["print"] + "&" + Dnet.requestParam.FILTER + "="
				+ request.data + "&" + Ext.Object.toQueryString(params), 'Print', opts);
		v.focus();
	}
});

Ext.define("dnet.core.dc.DataPrintWindow", {
	extend : "Ext.Window",

	_grid_ : null,

	initComponent : function(config) {

		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("dcvgrid", "print_run"),
			iconCls : 'icon-action-run'
		});

		var cfg = {
			title : Dnet.translate("dcvgrid", "print_title"),
			border : true,
			width : 350,
			resizable : false,
			closeAction : "hide",
			closable : true,
			constrain : true,
			buttonAlign : "center",
			modal : true,
			items : new dnet.core.dc.DataPrintForm({
				actionButton : btn,
				_grid_ : this._grid_
			}),
			buttons : [ btn ]
		};

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);
	}

});
