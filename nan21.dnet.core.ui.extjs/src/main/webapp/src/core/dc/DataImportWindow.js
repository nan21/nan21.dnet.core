Ext.ns('dnet.base');
dnet.base.DataImportWindow = Ext.extend(Ext.Window, {

    _elems_ : new Ext.util.MixedCollection()
   ,_formats_: ["csv", "json" ]

   ,_grid_:null

   ,_on_format_changed_: function(nv) {

   }

   ,initComponent:function() {

     Ext.apply(this, arguments);

     this._elems_.add("fld_format",{fieldLabel: Dnet.translate("dcvgrid", "imp_format"), xtype:"combo", allowBlank:false, selectOnFocus:true, width:100, id: Ext.id()
	 				, triggerAction:"all", store:this._formats_,value:this._formats_[0] , disabled: true
					,listeners: {
						"change" : {
							scope:this, fn: function(fld, nv,ov) {
								 this._on_format_changed_(nv);
							}
						}
					} });
      this._elems_.add("fld_file",{  buttonOnly: false, fieldLabel: Dnet.translate("dcvgrid", "imp_file"),
	   xtype:"fileuploadfield",   id: Ext.id() , width:300
 		 });
      this._elems_.add("fld_notes",{  buttonOnly: false, fieldLabel: Dnet.translate("dcvgrid", "imp_notes_lbl"),
	   xtype:"label",  text:Dnet.translate("dcvgrid", "imp_notes")
 		 });
    this._elems_.add("fld_strategy_pos",{boxLabel: Dnet.translate("dcvgrid", "imp_strgy_pos"), inputValue: 'p', name:"fld_strategy", id: Ext.id(),checked:true  });
    this._elems_.add("fld_strategy_bean",{boxLabel: Dnet.translate("dcvgrid", "imp_strgy_bean"), inputValue: 'b', name:"fld_strategy", id: Ext.id() });

	this._elems_.add("fld_strategy", {fieldLabel: Dnet.translate("dcvgrid", "imp_strgy"), xtype:"radiogroup", itemCls: "x-check-group-alt", columns: 1, id: Ext.id()
			    ,items: [ this._elems_.get("fld_strategy_pos"),this._elems_.get("fld_strategy_bean") ] });


     Ext.apply(this, {
           items:[this._elems_.get("fld_format"), this._elems_.get("fld_file"), this._elems_.get("fld_strategy"), this._elems_.get("fld_notes")  ]

          ,layout:"form"

          ,fileUpload: true
          ,closable: true
          ,closeAction: 'hide'
          ,bodyStyle:"padding:10 10 8 5;"
          ,title: Dnet.translate("dcvgrid", "imp_title")
          ,width: 650
          ,resizable:false
          ,autoHeight:true
          ,modal: true
          ,labelAlign:"right"
          ,buttonAlign:"center"
          ,labelWidth:100
          ,buttons:[
              {xtype:"button",scope:this, text:Dnet.translate("dcvgrid", "imp_run"), iconCls: 'icon-action-run', handler:function() {this.executeTask()} }
           //  ,{xtype:"button",scope:this, text:"Cancel", iconCls: 'icon-action-reset', handler:function() {this.hide()} }
          ]
       });
	 this.on("show",function() {this._on_format_changed_(this._getElement_("fld_format").getValue() ) ;} , this);
     dnet.base.DataImportWindow.superclass.initComponent.apply(this, arguments);
   }
	,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

    ,executeTask: function() {
		alert("Temporarily disabled");
		return ;
        var ctrl = this._grid_._controller_;
        var params = {};
		// read column layout
        if ( true ) {
			var gridCm = this._grid_.getColumnModel();
			var cs = '';  // visible columns
			var cst = '';  // visible columns title
			//var csw = ''; //visible columns width
			var cnt=0;
			for(var i=0; i<gridCm.getColumnCount(); i++) {
				if( /*this._getElement_("fld_columns").getValue().inputValue == "l" || */ ! gridCm.isHidden(i) ) {
					cs += (cnt>0)?",":"";
					cs += gridCm.getDataIndex(i);
			    	cst += (cnt>0)?",":"";
			        cst += gridCm.getColumnHeader(i).replace(","," ");
			        //csw += (cnt>0)?",":"";
			        //csw += gridCm.getColumnWidth(i);
			        cnt++;
				}
			}
			params[Dnet.requestParam.EXPORT_COL_NAMES] = cs;
			params[Dnet.requestParam.EXPORT_COL_TITLES] = cst;
			//params[Dnet.requestParam.EXPORT_COL_WIDTHS] = csw;

		}

        Ext.Ajax.request({
             method:"POST"
            ,params:params
            ,scope:this
            //,failure:this.doLoginFailure
		//	,success:this.doLoginSuccess
            ,url: Dnet.dsAPI(ctrl.dsName , "json" ) ["importdata"]
            ,timeout:600000
        });



   }
});