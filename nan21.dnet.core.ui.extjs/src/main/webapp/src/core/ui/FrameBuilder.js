
Ext.ns("dnet.base");
dnet.base.FrameBuilder = function(config) {		
	this.frame = null; 
	Ext.apply(this,config);	 	
};
 

dnet.base.FrameBuilder.prototype =  {
	 
	addDc: function(name, obj) {
		this.frame._dcs_.add(name, obj);	
		return this;
	}
	
	,linkDc: function(childName, parentName, relation) {
		Ext.applyIf(relation, {fetchMode:"auto", strict: true});
		var c = this.frame._dcs_.get(childName);
		var p = this.frame._dcs_.get(parentName);
		var ctx = new dnet.base.DcContext({
			 childDc:c
			,parentDc:p
			,relation:relation});
		p.addChild(c);c.setDcContext(ctx);
		return this;
	}


	,addDcView: function(dc, config) {	
		Ext.apply(config, {
			_controller_:this.frame._dcs_.get(dc)
			,listeners:{ activate:{scope:this,fn:function(p){p.doLayout(false,true);} } }
		});
		this.applyViewSharedConfig(config);		
		return this;
	}

	,addPanel:function(config) {
		Ext.apply(config, {			 
			listeners:{ activate:{scope:this,fn:function(p){p.doLayout(false,true);} } }
		});
		//this.fireEvent('canvaschange', p); for canvas
		this.applyViewSharedConfig(config);	
		return this;
	}

	,addChildrenTo: function(c,list,regions) {
		var items = this.frame._elems_.get(c)["items"] || [];
		for(var i=0, len=list.length; i<len; i++ ) {
			var cmp = this.frame._elems_.get(list[i]);
			items[items.length] = cmp;
			if (regions){
				cmp.region = regions[i];
			}
		}
		this.frame._elems_.get(c)["items"] = items;
		return this;
	}
	
	,addToolbarTo: function(c,tlb) {
		this.frame._linkToolbar_(tlb, c); 
		return this;
	}
 
	// private

	,applyViewSharedConfig: function(config) {
		Ext.applyIf(config,{
			id:Ext.id()
		});				 
		this.frame._elems_.add(config.name, config);
	}
	
	,beginToolbar: function(name, config) {
		return new dnet.base.ActionBuilder({name:name, frame:this.frame, dc: config.dc});
	}
	
	
	,createBinding: function(dc, views) {
		this.frame._dcs_.get(dc).on('afterCurrentRecordChange', 
				function(evnt) { 
					var newRecord = evnt.newRecord; 
					var oldRecord = evnt.oldRecord; 
					var newIdx = evnt.newIdx;
					if(newRecord) {								 
						Ext.BindMgr.unbind(oldRecord);
						var vids = [];
						for(var i=0;i<views.length;i++){
							vids[i] = this._elems_.get(views[i]).id;
						}
						Ext.BindMgr.bind(newRecord, vids);								 
					} else {								 
						Ext.BindMgr.unbind(oldRecord);								 
					} }, this.frame );	
		return this;
	}
	,addButton: function(config) {
		this.frame._elems_.add(config.name, config);
		return this;
	} 
	
	,add: function(config) {
		this.frame._elems_.add(name, config);
		return this;
	}
	,merge: function(name, config) {
		Ext.applyIf(this.frame._elems_.get(name) , config );
		return this;
	}
	,change: function(name, config) {
		Ext.apply(this.frame._elems_.get(name) , config );
		return this;
	}
	,remove: function(name) {
		this.frame._elems_.remove(name);
		return this;
	}
	
	
};