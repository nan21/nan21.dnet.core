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
	autoScroll : true,
	initComponent : function() {

		this.tpl = new Ext.XTemplate(
				'<h1 style="padding-top: 10px;padding-bottom: 10px;">Frame: {frameName}</h1> ',
				'<p style=" padding-bottom: 5px;"> Class: {frameFqn} </p>',
				'<h3 style="padding-top: 10px;padding-bottom: 10px;"><u>Data-controls</u></h3> ',
				'<tpl for="dc">',
				'<p style=" padding-bottom: 5px;">{#}. <i>Key:</i> {alias} <br> <i>Class:</i> {name} <br> <i>Data-source: </i> <a href="#" onclick="javascript:var w=window.open( Dnet.dsAPI(\'{dsAlias}\',\'html\').info ,\'DataSourceInfo\',\'width=600,height=500,scrollbars=yes\');w.focus();" >{ds}</a> </p></tpl>',
				'<h3 style="padding-top: 10px;padding-bottom: 10px;"><u>Toolbars</u></h3> ',
				'<tpl for="tlb">',
				'<p style=" padding-bottom: 5px;">{#}.  <i>Key:</i>  {alias}, <i>Title:</i> `{title}`</p></tpl>');

		var frame = getApplication().getActiveFrameInstance();
		if (frame) {
			var dc = null, dcs = [], tlb = null, tlbs = [];
			frame._dcs_.each(function(item, idx, length) {
						dc = {
							name : item.$className,
							alias : item._instanceKey_,
							ds : item.recordModel,
							dsAlias : item.recordModel.substring(item.recordModel.lastIndexOf('.')+1,item.recordModel.length)
						};
						dcs[dcs.length] = dc;
					}, this);
			frame._tlbs_.eachKey(function(key, item) {

						tlb = {
							alias : key,
							title : ((frame._tlbtitles_) ? frame._tlbtitles_
									.get(key)
									|| "-" : "-")
						};
						tlbs[tlbs.length] = tlb;
					}, this);
			this.data = {
				frameFqn : frame.$className,
				frameName : frame.$className.substring(frame.$className.lastIndexOf('.')+1,frame.$className.length),	
				dc : dcs,
				tlb : tlbs
			};
		} else {
			this.html = "<br><br>Frame inspector works only for application frames not for the home panel !";
		}

		this.callParent(arguments);

	}
});