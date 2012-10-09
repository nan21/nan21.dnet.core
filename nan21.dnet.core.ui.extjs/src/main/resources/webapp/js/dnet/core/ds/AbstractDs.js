
Ext.define("dnet.core.ds.AbstractDs", {
	extend:  "Ext.util.Observable" ,
 	 
	dsName : "",
	store : null,

	filter : null,

	record : null,
	recordFields : null,
	RecordModel : null,

	params: null,
	paramFields : null,
	paramModel : null,

	fetchSize : 30
 
});