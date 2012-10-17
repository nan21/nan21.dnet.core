Ext.define("dnet.core.base.WfStartFormWindowExtjs", {
	extend : "dnet.core.base.WfAbstractFormWindowExtjs",

	_processDefinitionId_ : null,
	_processDefinitionKey_ : null,
	_businessKey_ : null,

	initComponent : function() {
		this.items = this._buildItems_();
		this.callParent(arguments);
	},

	_buildItems_ : function() {
		return {
			xtype : "form",
			url : Dnet.wfProcessInstanceAPI(null).start,
			bodyPadding : 10,
			layout : 'anchor',
			fieldDefaults : {
				labelAlign : "right",
				labelWidth : 130
			},
			frame : true,
			defaults : {
				anchor : '100%'
			},
			items : this._buildForm_(),
			buttons : this._buildButtons_()
		};
	},

	_buildButtons_ : function() {
		var buttons = [];
		buttons[0] = {

			text : 'Submit',
			formBind : true,
			disabled : true,

			handler : function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
					Ext.Msg.wait("Working...");
					form.submit({
						success : function(form, action) {
							try {
								Ext.Msg.hide();
							} catch (e) {

							}
							Ext.Msg.alert('Success',
									"Process started successfully");
							this.up('window').close();
						},

						failure : function(form, action) {
							try {
								Ext.Msg.hide();
							} catch (e) {

							}
							var w = Ext.Msg.alert('Failed',
									action.response.responseText);
							this.up('window').close();
						},
						scope : this
					});
				}
			}
		}

		buttons[1] = {
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
			}

		}

		return buttons;

	},

	_buildForm_ : function() {

		var fields = [];

		fields[0] = {
			xtype : "hidden",
			name : "processDefinitionId",
			value : this._processDefinitionId_
		}
		fields[1] = {
			xtype : "hidden",
			name : "processDefinitionKey",
			value : this._processDefinitionKey_
		}
		fields[2] = {
			xtype : "hidden",
			name : "businessKey",
			value : this._businessKey_
		}
		this._buildFormFields_(fields);
		return fields;
	}
});