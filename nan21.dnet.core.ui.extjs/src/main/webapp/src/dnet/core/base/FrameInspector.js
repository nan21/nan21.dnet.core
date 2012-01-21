Ext.define("dnet.core.base.FrameInspector", {

	extend : "Ext.Window",

	title : Dnet.translate("appmenuitem", "frameInspector__lbl"),
	border : true,
	height : 300,
	width : 500,
	layout : 'fit',
	resizable : true,
	 
	bodyPadding : 20,
	closable : true,
	constrain : true,
	buttonAlign : "center",
	modal : true,
	autoScroll: true,
	initComponent : function() {

		this.tpl = new Ext.XTemplate('<p><h3>Data-controls:</h3> ',
				'<tpl for="dc">', '<p>{#}. {name}</p>',
				'<p style="padding-left:20px;">    Data-source: {ds}</p>', '</tpl></p>');

		var frame = getApplication().getActiveFrameInstance();
		if (frame) {
			var dc = null;
			var dcs = [];
			frame._dcs_.each(function(item, idx, length) {
						dc = {
							name : item.$className,
							ds : item.recordModel
						};
						dcs[dcs.length] = dc;
					}, this);
			this.data = {
				dc : dcs
			};
		} else {
			this.html = "<br><br>Frame inspector works only for application frames not for the home panel !";
		}

		this.callParent(arguments);

	}
});