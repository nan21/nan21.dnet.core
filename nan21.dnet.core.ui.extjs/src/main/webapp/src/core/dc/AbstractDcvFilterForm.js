Ext.ns("dnet.base");

dnet.base.AbstractDcvFilterForm = Ext.extend( Ext.form.FormPanel, {
	
	 _elems_: null
	,_is_filter_: false
	,_controller_: null
    ,_mainViewName_: "main"
    ,_trl_:null
    ,_dcViewType_:"filter-form"
	,initComponent: function(config) {
		this._elems_ =  new Ext.util.MixedCollection();
		this._startDefine_();

		/* define elements */
		if (this._beforeDefineElements_() !== false) {
		   this._defineElements_();
           this._afterDefineElements_();
		}
		this._elems_.each(this._postProcessElem_, this);
		
		/* build the ui, linking elements */
		if (this._beforeLinkElements_() !== false) {
		   this._linkElements_();
           this._afterLinkElements_();
		}

        this._endDefine_();

		var cfg = {
	       layout:"fit"
	      ,frame:true
	      ,border:true
	      ,defaults:{
	      	   labelAlign:"right"
	      	  ,labelWidth:110
	      	  ,border:true
	      	}
	     ,items:[ this._elems_.get(this._mainViewName_) ]
		}
		Ext.apply(cfg,config);
        Ext.apply(this,cfg);
		dnet.base.AbstractDcvFilterForm.superclass.initComponent.call(this);
		
		this.on({ scope: this  ,change: filter_view____change });
	}

    ,_startDefine_: function () {}
    ,_endDefine_: function () {}

    ,_getElement_: function(name) {  return Ext.getCmp( this._elems_.get(name).id); }
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

	,onBind:function(record) { this.updateBound(record); }
	,onUnbind:function(record) { this.updateBound(); }
	,afterEdit:function(record) { this.updateBound(record); }
	,afterReject:function(record) { this.updateBound(record);  }
	,updateBound:function(record) {
		if (!record) {this.disable();this.form.reset();}
		else {
			if(this.disabled) {this.enable();}
			this.form.loadRecord(record);
		}
	}
	
	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

    ,_linkElements_: function () {}
    	,_beforeLinkElements_: function () {return true;}
    	,_afterLinkElements_: function () {}
    	
	,_postProcessElem_ : function(item, idx, len) {
		if (item.fieldLabel == undefined) {
			if (item._rbkey_ != undefined ) {				 
				item.fieldLabel = Dnet.translate("ds",item._rbkey_); 
				return true;				 
			}
			// check if the view has its own resource bundle 
			if (this._trl_ != undefined && this._trl_[item.name]) {				
				item.fieldLabel = this._trl_[item.name];
				return true;
			}
			//try to translate it from the model's resource bundle
			if (item.dataIndex != undefined && this._controller_.ds._trl_ != null && this._controller_.ds._trl_[ item.dataIndex+'__lbl']) {				
				item.fieldLabel = this._controller_.ds._trl_[ item.dataIndex+'__lbl'];
				return true;
			}			
			// nothing found, display the dataIndex
			if (item.dataIndex != undefined ) {		
				item.fieldLabel = "<"+item.dataIndex+">";	
			}
		}
		return true;
	}
	/* get value from resource bundle for the specified key*/
	,_getRBValue_: function(k) {
		if (this._trl_ != null && this._trl_[k]) { return this._trl_[k]; }
		if (this._controller_._trl_ != null && this._controller_._trl_[k]) {
			return  this._controller_._trl_[k];
		} else {
			return k; 
		}
	}
});