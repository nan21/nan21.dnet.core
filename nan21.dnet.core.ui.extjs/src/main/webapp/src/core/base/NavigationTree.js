Ext.define('dnet.base.NavigationTree$Model', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'text',
		type : 'string'
	}, {
		name : '_frame_',
		type : 'string'
	}, {
		name : '_bundle_',
		type : 'string'
	}]
});

Ext.define("dnet.base.NavigationTree", {
	extend : "Ext.tree.Panel",
	alias : "widget.dnetNavigationTree",

	// DNet properties

	_TEXT_EXPAND_ALL : "Expand all",
	_TEXT_COLLAPSE_ALL : "Collapse all",
	_TEXT_FILTER_FIELD : "Filter...",
	_TEXT_REFRESH : "Refresh",
	withStdFilterHeader : false,
	loader_PreloadChildren : true,
	loader_Url : null,

	// defaults

	rootVisible : false,
	lines : false,
	autoScroll : true,
	animate : false,
	border : false,
	useArrows : true,
	bodyBorder : false,

	initComponent : function(config) {

		this.store = Ext.create('Ext.data.TreeStore', {
			model : 'dnet.base.NavigationTree$Model',
			root : {
				text : 'TreeRoot',
				expanded : true,
				leaf : false,
				children : this._data_
			},
			proxy : {
				type : 'memory',
				reader : {
					type : 'json'

				}
			}
		});

		this.hiddenPkgs = [];

		var cfg = {}
		if (this.withStdFilterHeader) { /*
										 * cfg.tbar =
										 * this._createFilterHeader();
										 */
		}

		this.callParent(arguments);

		this.addEvents("openMenuLink", "openMenuLinkInNewTab", "refreshCatalog");
	},

	initEvents : function() {
		this.callParent(arguments);
		this.on("itemclick", this.onMenuClick, this);
	},

	filterTree : function(t, e) {
		var text = t.getValue();
		Ext.each(this.hiddenPkgs, function(n) {
			n.ui.show();
		});
		if (!text) {
			this.filter.clear();
			return;
		}
		this.expandAll();

		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		this.filter.filterBy(function(n) {
			return !n.leaf || (n.leaf && re.test(n.text));
		}, this);

		// hide empty packages that weren't filtered
	this.hiddenPkgs = [];
	this.root.cascade(function(n) {
		if (!n.leaf && n.ui.ctNode.offsetHeight < 3) {
			n.ui.hide();
			this.hiddenPkgs.push(n);
		}
	}, this);
} // end filterTree

	,
	onMenuClick : function(view, model, item, idx, evnt, opts) {
		if (model.data.leaf) {
			this.fireEvent("openMenuLink", model);
		}
	}

	,
	_createFilterHeader : function() {
		return [];
		var t = [ ' ', new Ext.form.TextField( {
			width : 120,
			emptyText : this._TEXT_FILTER_FIELD,
			enableKeyEvents : true,
			listeners : {
				render : function(f) {
					this.filter = new Ext.tree.TreeFilter(this, {
						clearBlank : true,
						autoClear : true
					});
				},
				keydown : {
					fn : this.filterTree,
					buffer : 350,
					scope : this
				},
				scope : this
			}
		}), ' ', '->', {
			iconCls : 'icon-action-expand-all',
			tooltip : this._TEXT_EXPAND_ALL,
			handler : this.handler_ActionExpandAll,
			scope : this
		}, '-', {
			iconCls : 'icon-action-collapse-all',
			tooltip : this._TEXT_COLLAPSE_ALL,
			handler : this.handler_ActionCollapseAll,
			scope : this
		}, '-', {
			iconCls : 'icon-action-refresh',
			tooltip : this._TEXT_REFRESH,
			handler : this.handler_ActionRefresh,
			scope : this
		} ];
		return t;

	},
	handler_ActionExpandAll : function() {
		this.root.expand(true);
	},
	handler_ActionCollapseAll : function() {
		this.root.collapse(true);
	},
	handler_ActionRefresh : function() {
		this.fireEvent("refreshCatalog", this);
	},
	afterRefreshCatalog : function(response, options) {
		Ext.MessageBox.hide();
		this.loader.load(this.root);
	}

});
