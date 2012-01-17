
Ext.ns("dnet.core.asgn");

dnet.core.asgn.AsgnUiBuilder = function(config) {		
	this.asgnUi = null; 
	Ext.apply(this,config);	 
	dnet.core.asgn.AsgnUiBuilder.superclass.constructor.call(this, config);
};

Ext.extend(dnet.core.asgn.AsgnUiBuilder, Object, {
	
	addLeftGrid: function(config) {	
		Ext.apply(config||{}, {name:"leftList",id:this.asgnUi._leftGridId_, _side_:"left", flex:100, _controller_: this.asgnUi._controller_});
		this.applySharedConfig(config);		
		return this;
	}	
	,addRightGrid: function(config) {	
		Ext.apply(config||{}, {name:"rightList",id:this.asgnUi._rightGridId_, _side_:"right", flex:100,_controller_: this.asgnUi._controller_});
		this.applySharedConfig(config);		
		return this;
	}	 
	 
	,add: function(config) {
		this.applySharedConfig(config);
		return this;
	}
	,merge: function(name, config) {
		Ext.applyIf(this.asgnUi._elems_.get(name) , config );
		return this;
	}
	,change: function(name, config) {
		Ext.apply(this.asgnUi._elems_.get(name) , config );
		return this;
	}
	,remove: function(name) {
		this.asgnUi._elems_.remove(name);
		return this;
	}
	//private
	,applySharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id() 
		});		 
		this.asgnUi._elems_.add(config.name, config);
	}
	
	 
});
