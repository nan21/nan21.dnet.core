Ext.ns("dnet.base");

dnet.base.AbstractDcvForm = Ext.extend( Ext.form.FormPanel, {
	
	 _elems_: null
	,_is_filter_: false
	,_controller_: null
    ,_mainViewName_: "main"
    ,_resourceBundle_:{}
    ,_noInsert_ : null
    ,_noUpdate_ : null
    ,_noEdit_ : null
    ,_builder_: null
	,_dcViewType_:"edit-form"
	,_bindable_: true	
		
	,initComponent: function(config) {
		if (this._noInsert_ == null) this._noInsert_ = [];
		if (this._noUpdate_ == null) this._noUpdate_ = [];
		if (this._noEdit_ == null) this._noEdit_ = [];

		this._elems_ =  new Ext.util.MixedCollection();
		this._startDefine_();

		/* define elements */
		if (this._beforeDefineElements_()  !== false ) {
		   this._defineElements_();
           this._afterDefineElements_();
		}
		this._elems_.each(this._postProcessElem_, this);
		/* build the ui, linking elements */
		if (this._beforeLinkElements_()  !== false) {
		   this._linkElements_();
           this._afterLinkElements_();
		}
		this._setupHelpers_();
        this._endDefine_();

		var cfg = {
	       layout:"fit"
	      ,frame:true
	      ,border:true
	      ,trackResetOnLoad: true
	      ,buttonAlign:"left"	     
	      ,defaults:{
	      	   labelAlign:"right"
	      	  ,labelWidth:90
	      	  ,border:true
	      	  ,buttonAlign:"left"
	      	}

	     ,items:[ this._elems_.get(this._mainViewName_) ]
		}
		Ext.apply(cfg,config);
        Ext.apply(this,cfg);
		dnet.base.AbstractDcvForm.superclass.initComponent.call(this);

		this._controller_.store.on("write", function(store, action, result, txResult, rs) {
				this.updateBound(this._controller_.getRecord());
			} , this);
		this.on({  scope: this ,afterrender: function() { 
			this.updateBound(this._controller_.getRecord()); 
		}   });
		this._controller_.addBindedView(this.id,this._dcViewType_);	 
	}

    ,_startDefine_: function () {}
    ,_endDefine_: function () {}
    ,_getController_: function() { return this._controller_;}
    ,_getElement_: function(name) {
		try { 
			return Ext.getCmp( this._elems_.get(name).id);
		} catch(e) { if (console) { console.log(name+':'+ e.message);} }
		}
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }
    
    ,_get_: function(name) { return this._getElement_(name);} 
    ,_getConfig_: function(name) {  return this._elems_.get(name); }
    
	,onBind:function(record) {
		this.form.items.each(function(f){
			f.enable();
		});
		this._applyContextRules_(record);
		this.updateBound(record); 
	}
	,onUnbind:function(record) { 
		this.form.items.each(function(f){
			f.disable();
		}); 
		this.updateBound(); 
	}
	,afterEdit:function(record) { this.updateBound(record); }
	,afterReject:function(record) { this.updateBound(record);  }
	 
	,updateBound:function(record) {
		dnet.base.Logger.debug("dnet.base.AbstractDcvForm.updateBound");
		if (!record) {
				dnet.base.Logger.debug("dnet.base.AbstractDcvForm.updateBound record is null");
				//this.disable();
				 this.form.items.each(function(f){
			            f.setRawValue(null);
			        });
				//this.form.reset();
				}
		else {
			//dnet.base.Logger.debug("dnet.base.AbstractDcvForm.updateBound record is not null");			 
			this.form.loadRecord(record);			
		}
	}

	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

    ,_linkElements_: function () {}
    	,_beforeLinkElements_: function () {return true;}
    	,_afterLinkElements_: function () {}


	,_setupHelpers_: function() {
		this._elems_.each(function(item, idx, len) {
				if (item["disabled"] === true) { this._noEdit_[this._noEdit_.length] = item.name;}
			} , this);
	}

	,_applyContextRules_: function(record) {
		var c = null; // component might not be rendered yet
		if (record.data._p_record_status == "insert") {
			 for(var i=0; i< this._noUpdate_.length; i++) {
			 	 c= this._getElement_(this._noUpdate_[i]); if (c) c.enable();
			 }
			 for(var i=0; i< this._noInsert_.length; i++) {
			 	 c=this._getElement_(this._noInsert_[i]); if (c) c.disable();
			 }
			 for(var i=0; i< this._noEdit_.length; i++) {
			 	 c=this._getElement_(this._noEdit_[i]); if (c) c.disable();
			 }
		} else {
			 for(var i=0; i< this._noInsert_.length; i++) {
			 	c=this._getElement_(this._noInsert_[i]); if (c) c.enable();
			 }
			 for(var i=0; i< this._noUpdate_.length; i++) {
			 	 c=this._getElement_(this._noUpdate_[i]); if (c) c.disable();
			 }
			 for(var i=0; i< this._noEdit_.length; i++) {
			 	 c=this._getElement_(this._noEdit_[i]); if (c) c.disable();
			 }
		}

	}
	
	,_postProcessElem_ : function(item, idx, len) {
		item["_dcView_"] = this;
		if (item.fieldLabel == undefined) {
			Dnet.translateField(this._trl_, this._controller_.ds._trl_,item);
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
 
	,_isValid_: function() { 

		if (this.getForm().isValid()) {
			return true;
		} else {
			Ext.Msg.show({
	          title: 'Invalid data'
	         ,msg: 'Form contains invalid data.<br>Please correct values then try again. '
	         ,buttons: {ok:'OK'} //, cancel:'Details'
	         ,scope:this
	         ,icon: Ext.MessageBox.ERROR
	      });
	      return false;
		}
	}
	,_getBuilder_: function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.base.DcvFormBuilder({dcv: this});
		}	
		return this._builder_;
	}
});