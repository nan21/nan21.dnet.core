
Ext.ns("dnet.base");
dnet.base.DcvFilterFormBuilder = function(config) {		
	this.dcv = null; 
	Ext.apply(this,config);	 
	dnet.base.DcvFilterFormBuilder.superclass.constructor.call(this, config);
};

Ext.extend(dnet.base.DcvFilterFormBuilder, Ext.util.Observable, {
	
	addTextField: function(config) {
		config.xtype="textfield";		
		this.applySharedConfig(config);
		if(config.maxLength != undefined && config.autoCreate == undefined) {
			config.autoCreate = {tag: "input", type: "text", autocomplete: "off", size: "20", maxlength: config.maxLength} ;
		}
		if(config.caseRestriction!= undefined) {
			config.style = "text-transform:uppercase;";
		}
		return this;
	}
	,addTextArea: function(config) {
		config.xtype="textarea";
		this.applySharedConfig(config);
		return this;
	}
	,addCheckbox: function(config) {
		config.xtype="checkbox";
		this.applySharedConfig(config);
		return this;
	}
	,addBooleanField: function(config) {
		Ext.applyIf(config, {forceSelection:true, width:70});
		Ext.apply(config,{ 
				xtype:"combo", mode: "local", valueField: "bv", displayField: "tv", triggerAction:"all", 
				store:new Ext.data.ArrayStore({
						idIndex:0, fields: [ "bv", "tv" ], 
						data: [[true,Dnet.translate("msg", "bool_true")],[false,Dnet.translate("msg", "bool_false")]] 
						}) 
		});		
		this.applySharedConfig(config);
		return this;
	}
	,addDateField: function(config) {
		config.xtype="datefield";
		Ext.applyIf(config,{format:Ext.DATE_FORMAT});
		this.applySharedConfig(config);
		return this;
	}
	,addNumberField: function(config) {
		config.xtype="numberfield";
		this.applySharedConfig(config);
		return this;
	}
	,addLov: function(config) {		 
		this.applySharedConfig(config);
		return this;
	}
	,addCombo: function(config) {		 
		this.applySharedConfig(config);
		return this;
	}
	
	,addPanel: function(config) {
		Ext.applyIf(config,{
			id:Ext.id() 
		});
		this.dcv._elems_.add(config.name, config); 		 
		return this;
	}
	
	,addChildrenTo: function(c,list) {
		var items = this.dcv._elems_.get(c)["items"] || [];
		for(var i=0, len=list.length; i<len; i++ ) {
			items[items.length] = this.dcv._elems_.get(list[i]);
		}
		this.dcv._elems_.get(c)["items"] = items;
		return this;
	}
	//private
	
	,applySharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id(),selectOnFocus:true
		});
		if (config.allowBlank === false) {
			config.labelSeparator="*";
		}
		if(config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._elems_.add(config.name, config);
	}
});
