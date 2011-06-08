Ext.ns("dnet.base");

dnet.base.AbstractDcvGrid = Ext.extend( Ext.grid.GridPanel, {

	 _columns_: null
	,_elems_ : null
	,_controller_: null
	,_noExport_: false
	,_noImport_: false
	,_noLayoutCfg_: false
	,_exportWindow_: null
	,_importWindow_: null
	,_layoutWindow_: null

	,initComponent: function(config) {
        this._elems_ =  new Ext.util.MixedCollection();
        this._columns_ =  new Ext.util.MixedCollection();
		this._startDefine_();
		/* define columns */
        if (this._beforeDefineColumns_()) {
		   this._defineColumns_();
           this._afterDefineColumns_();
		}
		this._defineDefaultElements_();
		this._endDefine_();
		// disable default selection handler in controller 
		// let it be triggered from here
		this._controller_.afterStoreLoadDoDefaultSelection = false;
		var cfg = {
			 columns: this._columns_.getRange()
			,buttonAlign:"left"
		    ,forceFit: true, loadMask:true, stripeRows:true, border:true,frame:true
		    ,viewConfig: {emptyText: Dnet.translate("msg", "grid_emptytext") }
		    ,bbar:{xtype:"paging", store: this._controller_.store, displayInfo:true, pageSize:this._controller_.tuning.fetchSize }
			,sm: new Ext.grid.RowSelectionModel({singleSelect: false
				,listeners: {
		             "rowselect": {scope: this,fn: grid_view__sm__rowselect, buffer:100 }
		            ,"rowdeselect": {scope: this,fn: grid_view__sm__rowdeselect, buffer:100 }
		            ,"selectionchange": {scope: this,fn:function(sm) { this._controller_.setSelectedRecords( sm.getSelections() );} , buffer:200 }
		          }
			 })
			,store: this._controller_.store
			,listeners:{
		      "rowdblclick" : {scope: this,fn: function(grid,rIdx,e) {
			  	this._controller_.onEdit(); 
				  }  
				  }
		    }
		}
		var bbitems = [];
		if (!this._noLayoutCfg_) {
		  bbitems = [ "-",this._elems_.get("_btnLayout_")];
		}

		if (!this._noImport_) {
          if (bbitems.length == 0 ) { bbitems[0] = "-"; }
		  bbitems[bbitems.length]= [ this._elems_.get("_btnImport_")];
		}
        if (!this._noExport_) {
          if (bbitems.length == 0 ) { bbitems[0] = "-"; }
		  bbitems[bbitems.length]= [ this._elems_.get("_btnExport_")];
		}

		if (bbitems.length > 0 ) {
			cfg["bbar"]["items"] = bbitems;
        }

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);
		dnet.base.AbstractDcvGrid.superclass.initComponent.call(this);
		this._controller_.store.on("load", function(store,records,options) { 
			 this._onStoreLoad_(store,records,options);}, this);
	}

    ,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

    ,_startDefine_: function () {}
    ,_endDefine_: function () {}

    ,_defineColumns_: function () {}
    	,_beforeDefineColumns_: function () {return true;}
    	,_afterDefineColumns_: function () {}

	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

   	,_defineDefaultElements_: function () {
        this._elems_.add("_btnExport_",{xtype:"button", id:Ext.id(), disabled: true,
			text:Dnet.translate("dcvgrid", "exp_btn"), tooltip: Dnet.translate("dcvgrid", "exp_title"), iconCls: 'icon-action-export', handler: this._doExport_, scope:this } );
		this._elems_.add("_btnImport_",{xtype:"button", id:Ext.id(),
			text:Dnet.translate("dcvgrid", "imp_btn"), tooltip: Dnet.translate("dcvgrid", "imp_title"), iconCls: 'icon-action-import', handler: this._doImport_, scope:this } );
		this._elems_.add("_btnLayout_",{xtype:"button", id:Ext.id(),
			text:Dnet.translate("dcvgrid", "btn_perspective_txt"), tooltip: Dnet.translate("dcvgrid", "btn_perspective_tlp"), iconCls: 'icon-action-customlayout', handler: this._doLayoutManager_, scope:this } );
	}


    ,_doImport_: function() {
	   if(this._importWindow_ == null)  {
          this._importWindow_ = new dnet.base.DataImportWindow();
          this._importWindow_._grid_ = this;
	   }
       this._importWindow_.show();
	}
	,_doExport_: function() {
	   if(this._exportWindow_ == null)  {
          this._exportWindow_ = new dnet.base.DataExportWindow();
          this._exportWindow_._grid_ = this;
	   }
       this._exportWindow_.show();
	}
	
	,_doLayoutManager_: function() {
	   if(this._layoutWindow_ == null)  {
          this._layoutWindow_ = new dnet.base.GridLayoutManager();
          this._layoutWindow_._grid_ = this;
	   }
       this._layoutWindow_.show();
	}

	,_onStoreLoad_: function(store,records,options) {
         if(!this._noExport_) {
             if( store.getCount()>0) {
	         	this._getElement_("_btnExport_").enable();
			 } else {
				this._getElement_("_btnExport_").disable();
			 }
		 }
         if(store.getCount()>0) {
        	 if (this.selModel.getCount() == 0 ) {
            	 this.selModel.selectFirstRow();
             } else {
            	 this._controller_.setCurrentRecord(this.selModel.getSelected());
            	 this._controller_.setSelectedRecords(this.selModel.getSelections());
             }
         }         
	}
	,_afterEdit_: function(e) {          
	}
    	/* get value from resource bundle for the specified key*/
	,_getRBValue_: function(k) {
		if (this._trl_ != null && this._trl_[k]) { return this._trl_[k]; }
		if (this._controller_._trl_ != null && this._controller_._trl_[k]) {
			return  this._controller_._trl_[k];
		} else {
			return k; 
		}
	}

});