
Ext.ns("dnet.base");

dnet.base.DcvGridBuilder = function(config) {		
	this.dcv = null; 
	Ext.apply(this,config);	 
	dnet.base.DcvGridBuilder.superclass.constructor.call(this, config);
};

Ext.extend(dnet.base.DcvGridBuilder, Ext.util.Observable, {
	
	addTextColumn: function(config) {
		config.xtype="gridcolumn";		
		this.applySharedConfig(config);		
		return this;
	}	
	,addBooleanColumn: function(config) {
		config.xtype="booleancolumn";
		Ext.apply(config,{trueText:Dnet.translate("msg", "bool_true"), falseText:Dnet.translate("msg", "bool_false")});		
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
	//private
	,applySharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id(),sortable:true, hidden:false
		});
		if(config._sharedLabel_) {
			config._rbkey_ = config.name;
		}
		this.dcv._columns_.add(config.name, config);
	}
	
	,addAllFromDataSource: function() {
		
		var f = this.dcv._controller_.ds.recordFields;
		for(var i=0,len=f.length;i<len; i++) {
			var name = f[i]["name"];
			var type = f[i]["type"];
 			var cfg = {name:name,dataIndex:name};
 			
 			// try to guess something 
			if ( name == "id" || name == "createdAt" || name == "createdBy" || name == "version"|| name == "clientId"  ) {
				cfg.hidden = true;
			}
			
			if (type == "string") {
				this.addTextColumn(cfg);
			}
			if (type == "date") {
				this.addDateColumn(cfg);
			}
			if (type == "boolean") {
				this.addBooleanColumn(cfg);
			}
			if (type == "int") {
				this.addNumberColumn(cfg);
			}
			
		}
	}
});
