
Ext.ns("dnet.core.asgn");

dnet.core.asgn.AsgnGridBuilder = function(config) {		
	this.asgnGrid = null; 
	Ext.apply(this,config);	 	 
	dnet.core.asgn.AsgnGridBuilder.superclass.constructor.call(this, config);
};

Ext.extend(dnet.core.asgn.AsgnGridBuilder, Object, {
	
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
	,add: function(config) {
		this.applySharedConfig(config);
		return this;
	}
	,merge: function(name, config) {
		Ext.applyIf(this.asgnGrid._columns_.get(name) , config );
		return this;
	}
	,change: function(name, config) {
		Ext.apply(this.asgnGrid._columns_.get(name) , config );
		return this;
	}
	,remove: function(name) {
		this.asgnGrid._columns_.remove(name);
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
		this.asgnGrid._columns_.add(config.name, config);
	}
	
	,addAllFromDataSource: function() {
		
		var f = this.asgnGrid._controller_.ds.recordFields;
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
