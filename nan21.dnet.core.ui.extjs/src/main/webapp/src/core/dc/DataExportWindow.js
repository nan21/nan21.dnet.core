Ext.ns('dnet.base');
dnet.base.DataExportWindow = Ext.extend(Ext.Window, {

    _elems_ : new Ext.util.MixedCollection()
   ,_formats_: ["csv", "json", "pdf", "xml"]
   ,_layouts_: ["portrait", "landscape"]
   ,_grid_:null

   ,_on_format_changed_: function(nv) {
       if (nv=="pdf") {
            this._getElement_("fld_columns_listvisible").setValue(true);
			this._getElement_("fld_columns_listall").disable();
			this._getElement_("fld_columns_all").disable();
			this._getElement_("fld_layout").enable();

		} else {
			this._getElement_("fld_columns_listall").enable();
			this._getElement_("fld_columns_all").enable();
			this._getElement_("fld_layout").disable();
		}
   }

   ,initComponent:function() {

     Ext.apply(this, arguments);

     this._elems_.add("fld_format",{fieldLabel: Dnet.translate("dcvgrid", "exp_format"), xtype:"combo", allowBlank:false, selectOnFocus:true, width:100, id: Ext.id()
	 				, triggerAction:"all", store:this._formats_,value:this._formats_[0] 
					,listeners: {
						"change" : {
							scope:this, fn: function(fld, nv,ov) {
								 this._on_format_changed_(nv);
							}
						}
					} });
     this._elems_.add("fld_layout",{fieldLabel: Dnet.translate("dcvgrid", "exp_layout"), xtype:"combo",allowBlank:false, selectOnFocus:true, width:100, id: Ext.id()
	 				, triggerAction:"all", store:this._layouts_,value:this._layouts_[0] });



    this._elems_.add("fld_columns_listvisible",{boxLabel: Dnet.translate("dcvgrid", "exp_col_visible"), inputValue: 'v', name:"fld_columns", id: Ext.id()  });
    this._elems_.add("fld_columns_listall",{boxLabel: Dnet.translate("dcvgrid", "exp_col_all"), inputValue: 'l', name:"fld_columns", id: Ext.id() });
    this._elems_.add("fld_columns_all",{boxLabel: Dnet.translate("dcvgrid", "exp_col_all2"), inputValue: 'a', name:"fld_columns", id: Ext.id(),checked: true} );

	this._elems_.add("fld_columns", {fieldLabel: Dnet.translate("dcvgrid", "exp_columns"), xtype:"radiogroup", itemCls: "x-check-group-alt", columns: 1, id: Ext.id()
			    ,items: [ this._elems_.get("fld_columns_listvisible"),this._elems_.get("fld_columns_listall"),this._elems_.get("fld_columns_all")] });


    this._elems_.add("fld_records_selected", {boxLabel: Dnet.translate("dcvgrid", "exp_rec_sel"), inputValue: 's', name:"fld_records", id: Ext.id(), disabled:true} );
    this._elems_.add("fld_records_currentpage", {boxLabel: Dnet.translate("dcvgrid", "exp_rec_pag"), inputValue: 'c', name:"fld_records", id: Ext.id(), disabled:true} );
    this._elems_.add("fld_records_allpage", {boxLabel: Dnet.translate("dcvgrid", "exp_rec_all"), inputValue: 'a', name:"fld_records", id: Ext.id(), checked: true} );
     this._elems_.add("fld_records",new Ext.form.RadioGroup({fieldLabel: Dnet.translate("dcvgrid", "exp_records"), xtype:"radiogroup", itemCls: "x-check-group-alt", columns: 1, id: Ext.id()
			    ,items: [this._elems_.get("fld_records_selected"),this._elems_.get("fld_records_currentpage"),this._elems_.get("fld_records_allpage")] }));

     Ext.apply(this, {
           items:[this._elems_.get("fld_format"),this._elems_.get("fld_layout"),this._elems_.get("fld_columns") ,this._elems_.get("fld_records") ]
          ,layout:"form"
          ,closable: true
          ,closeAction: 'hide'
          ,bodyStyle:"padding:10 10 8 5;"
          ,title: Dnet.translate("dcvgrid", "exp_title")
          ,width: 300
          ,resizable:false
          ,autoHeight:true
          ,modal: true
          ,labelAlign:"right"
          ,buttonAlign:"center"
          ,labelWidth:100
          ,buttons:[
              {xtype:"button",scope:this, text:Dnet.translate("dcvgrid", "exp_run"), iconCls: 'icon-action-run', handler:function() {this.executeTask()} }
           //  ,{xtype:"button",scope:this, text:"Cancel", iconCls: 'icon-action-reset', handler:function() {this.hide()} }
          ]
       });
	 this.on("show",function() {this._on_format_changed_(this._getElement_("fld_format").getValue() ) ;} , this);
     dnet.base.DataExportWindow.superclass.initComponent.apply(this, arguments);
   }
	,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

   ,executeTask: function() {
		var ctrl = this._grid_._controller_;
		var url = Dnet.dsAPI(ctrl.dsName , this._getElement_("fld_format").getValue() ) ;
		var filterData = ctrl.filter.data;
		var request = dnet.base.RequestParamFactory.findRequest(filterData);
		for(var p in request.data ) {  if(request.data[p] == "") {request.data[p] = null ;} }
		var data = Ext.encode(request.data);
		request.data = data;
		var params = {};

		if (this._getElement_("fld_records").getValue().inputValue == "c") {
		       params["resultSize"] = 30;
			   params["resultStart"] = 0;
		}
		var sortState = ctrl.store.getSortState();
        if (sortState) {
	       params[Dnet.requestParam.SORT] = sortState.field;
	       params[Dnet.requestParam.SENSE] = sortState.direction;
	     }

        if (this._getElement_("fld_columns").getValue().inputValue != "a") {
			var gridCm = this._grid_.getColumnModel();
			var cs = '';  // visible columns
			var cst = '';  // visible columns title
			var csw = ''; //visible columns width
			var cnt=0;
			for(var i=0; i<gridCm.getColumnCount(); i++) {
				if( this._getElement_("fld_columns").getValue().inputValue == "l" || ! gridCm.isHidden(i) ) {
					cs += (cnt>0)?",":"";
					cs += gridCm.getDataIndex(i);
			    	cst += (cnt>0)?",":"";
			        cst += gridCm.getColumnHeader(i).replace(","," ");
			        csw += (cnt>0)?",":"";
			        csw += gridCm.getColumnWidth(i);
			        cnt++;
				}
			}
			params[Dnet.requestParam.EXPORT_COL_NAMES] = cs;
			params[Dnet.requestParam.EXPORT_COL_TITLES] = cst;
			params[Dnet.requestParam.EXPORT_COL_WIDTHS] = csw;

		}

      var v = window.open(url["exportdata"]+"&data="+request.data+"&"+Ext.urlEncode(params), 'Export' ,'adress=yes,width=710,height=450,scrollbars=yes,resizable=yes,menubar=yes');
      v.focus();

   }
});