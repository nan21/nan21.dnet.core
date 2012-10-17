Ext.define("dnet.core.base.WfAbstractFormWindowExtjs", {
	extend : "Ext.Window",

	border : true,
	// width: 500,
	// height:300,
	resizable : true,
	closable : true,
	constrain : true,
	layout : "fit",
	modal : true,
	buttonAlign : "center",

	_formProperties_ : null,

	_buildFormFields_ : function(fields) {

		for ( var i = 0, l = this._formProperties_.length; i < l; i++) {
			var p = this._formProperties_[i];
			var f = {
				name : p.id,
				fieldLabel : p.name,
				value : p.value
			}
			if (p.isRequired) {
				f.allowBlank = false;
				f.labelSeparator = "*";
			}
			if (!p.isWritable) {
				f.readOnly = true;
			}
			if (p.type.name == "string") {
				f.xtype = "textfield";
			}
			if (p.type.name == "long") {
				f.xtype = "numberfield";
			}
			if (p.type.name == "date") {
				f.xtype = "datefield";
				f.format = "Y-m-d";

			}
			if (p.type.name == "enum") {
				f.xtype = "combobox";
				f.store = p.type.values;
			}
			fields[fields.length] = f;
		}
	}
});