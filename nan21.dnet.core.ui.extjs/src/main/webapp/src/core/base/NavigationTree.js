/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

Ext.ns("dnet.base");
dnet.base.NavigationTree = Ext.extend(Ext.tree.TreePanel , {

    // localizable properties
     _TEXT_EXPAND_ALL : "Expand all"
    ,_TEXT_COLLAPSE_ALL : "Collapse all"
    ,_TEXT_FILTER_FIELD : "Filter..."
    ,_TEXT_REFRESH : "Refresh"

    ,withStdFilterHeader:false
    
	,loader_PreloadChildren: true
    ,loader_Url: null

   ,initComponent:function(config) {

    this.hiddenPkgs = [];

    var cfg = {
       rootVisible:false
      ,lines:false
      ,autoScroll:true
      ,animCollapse:false
      ,animate: false
      ,border:false
      ,margins:'0 0 0 5'
      ,layout:'fit'
      ,autoScroll:true
      ,useArrows:true
      ,collapseFirst:false
      ,collapseMode:'mini'
      ,loader: new Ext.tree.TreeLoader({
          	 preloadChildren: true		  
   	    })
      
    }
    if (this.withStdFilterHeader ) {
       cfg.tbar = this._createFilterHeader();
    }

    Ext.apply(this, cfg);
    dnet.base.NavigationTree.superclass.initComponent.apply(this, arguments);
    this.addEvents('openMenuLink','openMenuLinkInNewTab', 'refreshCatalog');
  }

  ,initEvents: function() {
    dnet.base.NavigationTree.superclass.initEvents.call(this);
    this.on("click", this.onMenuClick, this );
  }


 , filterTree: function(t, e){
        		var text = t.getValue();
        		Ext.each(this.hiddenPkgs, function(n){
        			n.ui.show();
        		});
        		if(!text){
        			this.filter.clear();
        			return;
        		}
        		this.expandAll();

        		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
        		this.filter.filterBy(function(n){
        			return !n.leaf || (n.leaf && re.test(n.text));
        		},this);

        		// hide empty packages that weren't filtered
        		this.hiddenPkgs = [];
        		this.root.cascade(function(n){
        			if(!n.leaf && n.ui.ctNode.offsetHeight < 3){
        				n.ui.hide();
        				this.hiddenPkgs.push(n);
        			}
        		},this);
        	} // end filterTree


  ,onMenuClick: function(node, e) {
    if (node.leaf) {
       var params = new Object();
       this.fireEvent("openMenuLink", node );
    }
  }


  ,_createFilterHeader: function() {
     var t  = [' ', new Ext.form.TextField({
        				 width: 120
        				,emptyText:this._TEXT_FILTER_FIELD
                ,enableKeyEvents: true
          			,listeners:{
          					render: function(f){
                              	this.filter = new Ext.tree.TreeFilter(this, {
                              		clearBlank: true,
                              		autoClear: true
                              	});
          					}
                    ,keydown: {
                         fn: this.filterTree
                        ,buffer: 350
                        ,scope: this
                    }
                    ,scope: this
          				}
          			}) , ' ','->'
               ,{
                   iconCls: 'icon-action-expand-all'
  				        ,tooltip: this._TEXT_EXPAND_ALL
                  ,handler: this.handler_ActionExpandAll
                  ,scope: this
              }, '-', {
                   iconCls: 'icon-action-collapse-all'
                  ,tooltip: this._TEXT_COLLAPSE_ALL
                  ,handler: this.handler_ActionCollapseAll
                  ,scope: this
              } , '-', {
                   iconCls: 'icon-action-refresh'
                  ,tooltip: this._TEXT_REFRESH
                  ,handler: this.handler_ActionRefresh
                  ,scope: this
              } ];
      return t;

   }
  , handler_ActionExpandAll : function() {this.root.expand(true);}
  , handler_ActionCollapseAll : function() {this.root.collapse(true);}
  , handler_ActionRefresh : function() {  this.fireEvent("refreshCatalog", this ); }
 
 	,afterRefreshCatalog:function(response, options) {
	    Ext.MessageBox.hide();
	    this.loader.load(this.root);    	                  
 	}
 
});
Ext.reg("dnetNavigationTree", dnet.base.NavigationTree);