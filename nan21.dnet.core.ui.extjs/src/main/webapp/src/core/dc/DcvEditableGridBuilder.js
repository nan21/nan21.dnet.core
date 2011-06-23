
Ext.ns("dnet.base");

dnet.base.DcvEditableGridBuilder = function(config) {		
	this.dcv = null; 
	Ext.apply(this,config);	 
	dnet.base.DcvEditableGridBuilder.superclass.constructor.call(this, config);
};

Ext.extend(dnet.base.DcvEditableGridBuilder, Ext.util.Observable, {
	
	addTextColumn: function(config) {
		config.xtype="gridcolumn";		
		this.applySharedConfig(config);		
		return this;
	}	
	,addBooleanColumn: function(config) {
		config.xtype="booleancolumn";
		Ext.apply(config,{trueText:Dnet.translate("msg", "bool_true"), falseText:Dnet.translate("msg", "bool_false")});	
		if(config.editor == undefined && config._noEdit_ !== false) {
			config.editor =  {xtype: 'combo', mode: 'local', selectOnFocus:true, valueField: 'bv', displayField: 'tv', 
			store:new Ext.data.ArrayStore({idIndex:0,fields: [ 'bv', 'tv' ], 
							data: [[true,Dnet.translate("msg", "bool_true")],[false,Dnet.translate("msg", "bool_false")]] }),
							triggerAction:'all', forceSelection:true }
		}
		this.applySharedConfig(config);
		return this;
	}
	,addDateColumn: function(config) {
		config.xtype="datecolumn";
		Ext.applyIf(config,{format:Ext.DATE_FORMAT});
		this.applySharedConfig(config);
		return this;
	}
	,addNumberColumn: function(config) {
		config.xtype="numbercolumn";
		Ext.applyIf(config,{align:"right"});
		this.applySharedConfig(config);
		return this;
	}
	,addComboColumn: function(config) {
		config.xtype="gridcolumn";		
		this.applySharedConfig(config);		
		return this;
	}
	,addLov: function(config) {		 
		this.applySharedConfig(config);
		return this;
	}
	//private
	
	,applySharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id(),selectOnFocus:true,sortable:true, hidden:false
		});
		if(config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._columns_.add(config.name, config);
	}
});
