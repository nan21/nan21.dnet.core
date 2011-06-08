Ext.ns("dnet.base");

dnet.base.AbstractAsgnGrid = Ext.extend( Ext.grid.GridPanel, {

	 _columns_: new Ext.util.MixedCollection()
	,_elems_ : new Ext.util.MixedCollection()
	,_controller_: null
	,_side_:null

	,initComponent: function(config) {
		this._startDefine_();
		/* define columns */
        if (this._beforeDefineColumns_()) {
		   this._defineColumns_();
           this._afterDefineColumns_();
		}
		this._defineDefaultElements_();
		this._endDefine_();

		var cfg = {
			 columns: this._columns_.getRange()
		    ,forceFit: true, loadMask:true, stripeRows:true, border:true,frame:true
		    ,viewConfig: {emptyText:"No records found to match the specified selection criteria."}
		    ,bbar:{xtype:"paging", store: this._controller_.getStore(this._side_), displayInfo:true, pageSize:30
					 }
			,sm: new Ext.grid.RowSelectionModel({singleSelect: false

			 })
			,store: this._controller_.getStore(this._side_)

		}
		Ext.apply(cfg,config);
        Ext.apply(this,cfg);
		dnet.base.AbstractAsgnGrid.superclass.initComponent.call(this);

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

	}


	,_onStoreLoad_: function(store,records,options) {

	}
	,_afterEdit_: function(e) {

	}


});