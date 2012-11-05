Ext.define('dnet.core.dashboard.Portal', {

	extend : 'Ext.container.Viewport',

	getTools : function() {
		return [{
					xtype : 'tool',
					type : 'gear',
					handler : function(e, target, panelHeader, tool) {
						// var portlet = panelHeader.ownerCt;
						// portlet.setLoading('Loading...');
						// Ext.defer(function() {
						// portlet.setLoading(false);
						// }, 2000);
					}
				}];
	},

	initComponent : function() {
		var content = '<div class="portlet-content">Ext.example.shortBogusMarkup</div>';

		Ext.apply(this, {
			id : 'app-viewport',
			layout : {
				type : 'border',
				padding : '0 5 5 5' // pad the layout from the window edges
			},
			items : [{
						id : 'app-header',
						xtype : 'box',
						region : 'north',
						height : 40,
						html : 'Dashboard'
					}, {
						xtype : 'container',
						region : 'center',
						layout : 'border',
						items : [{
							id : 'app-portal',
							xtype : 'portalpanel',
							region : 'center',
							items : [{
								id : 'col-1',
								items : [
										 

										{
									id : 'portlet-2',
									title : 'About',
									// tools: this.getTools(),

									tpl : dnet.core.base.TemplateRepository.APPLICATION_HOME,
									data : {
										dnetName : Dnet.name,
										dnetVersion : Dnet.version
									},
									listeners : {
										'close' : Ext.bind(this.onPortletClose,
												this)
									}
								}
//										, {
//									id : 'portlet-3',
//									title : 'About Dashboard',
//									tpl : dnet.core.base.TemplateRepository.ABOUT_DASHBOARD,
//									data : {},
//									 
//									// tools: this.getTools(),
//
//									listeners : {
//										'close' : Ext.bind(this.onPortletClose,
//												this)
//									}
//								}
										]
							}, {
								id : 'col-2',

								items : []
							}, {
								id : 'col3',
								items : []
							}

							]
						}]
					}]
		});

		this.callParent(arguments);
	},

	onPortletClose : function(portlet) {
		this.showMsg('"' + portlet.title + '" was removed');
	},

	showMsg : function(msg) {
		var el = Ext.get('app-msg'), msgId = Ext.id();

		this.msgId = msgId;
		el.update(msg).show();

		Ext.defer(this.clearMsg, 3000, this, [msgId]);
	},

	clearMsg : function(msgId) {
		if (msgId === this.msgId) {
			Ext.get('app-msg').hide();
		}
	}
});
