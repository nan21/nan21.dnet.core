
Ext.define("dnet.core.dc.GridLayoutManager", {
	extend:  "Ext.Window" ,
 	
 
    _elems_ : new Ext.util.MixedCollection()

   ,_grid_:null



   ,initComponent:function() {

     Ext.apply(this, arguments);

     this._elems_.add("fld_mylayouts",{fieldLabel: Dnet.translate("dcvgrid", "layout_mylayouts"), xtype:"combo", allowBlank:false
	 					, selectOnFocus:true, width:150, id: Ext.id(), triggerAction:"all" });
	this._elems_.add("fld_name",{fieldLabel: Dnet.translate("dcvgrid", "layout_name"), xtype:"textfield", allowBlank:false
					, selectOnFocus:true, width:150, id: Ext.id()
					  });


     Ext.apply(this, {
           items:[this._elems_.get("fld_mylayouts"), this._elems_.get("fld_name")  ]

          ,layout:"form"

          ,fileUpload: true
          ,closable: true
          ,closeAction: 'hide'
          ,bodyStyle:"padding:10 10 8 5;"
          ,title: Dnet.translate("dcvgrid", "layout_title")
          ,width: 350
          ,resizable:false
          ,autoHeight:true
          ,modal: true
          ,labelAlign:"right"
          ,buttonAlign:"center"
          ,labelWidth:150
          ,buttons:[
              {xtype:"button",scope:this, text:Dnet.translate("dcvgrid", "layout_applySelected"), iconCls: 'icon-action-customlayout', handler:function() {this._doApplySelected_()} }
              ,{xtype:"button",scope:this, text:Dnet.translate("dcvgrid", "layout_saveCurrent"), iconCls: 'icon-action-save', handler:function() {this._doSaveCurrent_()} }

          ]
       });

     dnet.core.dc.GridLayoutManager.superclass.initComponent.apply(this, arguments);
   }
	,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

    ,_doApplySelected_: function() {
		alert("Temporarily disabled");
   }
   ,_doSaveCurrent_: function() {
		alert("Temporarily disabled");
   }
});