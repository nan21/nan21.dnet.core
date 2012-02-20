Ext.define("dnet.core.dc.AbstractDcvForm", {
	extend:  "Ext.form.Panel",
 
	// DNet properties
	
	_builder_: null,
	_elems_: null,
	
	/**
	 * 
	 * @type dnet.core.dc.AbstractDc
	 */
	_controller_: null,
    _mainViewName_: "main",
    _dcViewType_: "edit-form",	
    
    // defaults
    
    frame:true,
	border:false,
	bodyBorder:false,
	bodyPadding: '5 5 0 0',
	maskOnDisable: false,
	layout:"fit",
  	buttonAlign:"left",
  	bodyCls: 'dcv-edit-form',
  	
    fieldDefaults:{
  	   labelAlign:"right",
  	   labelWidth:100  
  	},
  	
    defaults: {
   	 	frame:false
       ,border:false
       ,bodyBorder:false
       ,bodyStyle: " background:transparent "
    },
     
    // deprecated
    
	 _is_filter_: false  
    ,_resourceBundle_:{}     
	,_bindable_: true	
	 
	,initComponent: function() {
    	 
    	this.maskOnDisable = false; 
 
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
		 
		this._endDefine_();

		this.items = [ this._elems_.get(this._mainViewName_) ];
  
		this.initialConfig.trackResetOnLoad = false;
	 	 
		this.callParent(arguments);
		
		
		this.mon(this._controller_.store, "update", this.onStore_update, this);		 
		this.mon(this._controller_.store, "write", this.onStore_write, this);		
		this.mon(this._controller_.store, "datachanged", this.onStore_datachanged, this);		 
		this.mon(this._controller_, "recordChange", this.onController_recordChange, this);	 
		 
		this.mon(this, "afterrender", this.on_afterrender, this);
		
		if (this._controller_.commands.doSave ) {
			this._controller_.commands.doSave.beforeExecute = Ext.Function.createInterceptor(
				this._controller_.commands.doSave.beforeExecute,
				function() {
					if( this._shouldValidate_() && !this.getForm().isValid()) {
						Ext.Msg.show({
							title : "Validation info",	
							msg : "Form contains invalid data.<br> Please fix the errors then try again.",
							scope : this,
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.MessageBox.OK
						});
						return false;
					} else {
						return true;	
					}					
				},this, -1 );
		}
//		this.getForm().on("validitychange", function(form, isValid, eopts) {
//			this._controller_.commands["doSave"].locked = !isValid;
//		}, this);
	},
 
	_shouldValidate_: function() {
		return true;
	},
	
	// *********** event handlers ************************
	
	on_afterrender: function() { 
		if ( this._controller_&& this._controller_.getRecord()) { 
			this.onBind(this._controller_.getRecord()); 
		} else { 
			this.onUnbind(null);
		}
		this._afterRender_();
	},
	
	onController_recordChange: function(evnt) {				 
		var newRecord = evnt.newRecord;
		var oldRecord = evnt.oldRecord;
		var newIdx = evnt.newIdx;
		if (newRecord != oldRecord) {
			this.onUnbind(oldRecord);
			this.onBind(newRecord);		
		} 
	},
		
		
	onStore_datachanged: function(store, eopts) { 
		//if(this.getForm().getRecord()) {
			this.updateBound(this._controller_.getRecord());
		//}	
	},
	
	onStore_write: function(store, operation, eopts) {
		/**
		 * use the first record from the result list as reference 
		 * see Store on write event handler defined in AbstractDc.
		 */
		if (operation.action == "create") {
			this._applyContextRules_(operation.resultSet.records[0]);
		}
	},
	
	onStore_update: function(store, rec, op, eopts) {			 
		this.updateBound(rec);		 
	},
	
	
	
	// ****************  API   *****************
	
	_afterRender_: function() {
	},
	
	_startDefine_: function () {},
	
	_endDefine_: function () {},
	
	_getController_: function() { return this._controller_;},
	
	_getElement_: function(name) {
		try { 
			return Ext.getCmp( this._elems_.get(name).id);
		} catch(e) { /*if (console) { console.log(name+':'+ e.message);}*/ }
		}
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }
    
    ,_get_: function(name) { return this._getElement_(name);} 
    ,_getConfig_: function(name) {  return this._elems_.get(name); }
    
 
	,onBind:function(record) {		
		if (record) {
//			this.getForm().getFields().each(function(field) {
//				if (field.dataIndex) {
//					field._setRawValue_(record.data[field.dataIndex]);
//				}						
//				}); 			
			var fields = this.getForm().getFields();
			
			fields.each(function(field){
                field.suspendEvents();
            });
            this.getForm().loadRecord(record);
            fields.each(function(field){
                field.resumeEvents();
            });
			this._applyContextRules_(record);
			this.getForm().isValid();			
		}
		this._afterBind_(record);		
	}
	,onUnbind:function(record) {

		this.getForm().getFields().each(function(field) {
			if (field.dataIndex) {
				field.setRawValue(null);
				field.clearInvalid();				
			}
			field.disable();
			}); 
  		//???
  		//this.getForm().record = null;
		this._afterUnbind_(record);	
	}
	
	,_afterBind_: function(record) {}
	,_afterUnbind_: function(record) {}
	,afterEdit:function(record) { 
		this.updateBound(record); 
	}
	,afterReject:function(record) { 
		this.updateBound(record);  
	}
	 
	,updateBound:function(record) {
		var msg = "null";
		if (record) {
			var fields = this.getForm().getFields();
			fields.each(function(field){
               
				if (field.dataIndex) {
					var nv = record.data[field.dataIndex];
					if (field.getValue() != nv) {
						field.suspendEvents();
						field.setValue(nv);
						field.resumeEvents();
					}					
				}
            });
		}		
	}

	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

    ,_linkElements_: function () {}
    	,_beforeLinkElements_: function () {return true;}
    	,_afterLinkElements_: function () {}
 
	,_applyContextRules_: function(record) {
		if(record == null || record == undefined) {
			return ;
		}
		var c = null; // component might not be rendered yet
		if (record.phantom) {
			this.getForm().getFields().each(function(item, index, length) {
				if (item.noEdit === true || item.noInsert  === true ) {
					item.disable();
				} else {
					item.enable();
				}
			});			 
		} else {
			this.getForm().getFields().each(function(item, index, length) {
				if (item.noEdit === true || item.noUpdate === true ) {
					item.disable();
				} else {
					item.enable();
				}
			});
		}
	}
	
	,_postProcessElem_ : function(item, idx, len) {
		item["_dcView_"] = this;
		if (item.fieldLabel == undefined) {
			Dnet.translateField(this._trl_, this._controller_._trl_,item);
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

	 ,_showStackedViewElement_: function(svn, idx) {
		if (Ext.isNumber(idx) ) {
    		this._getElement_(svn).getLayout().setActiveItem(idx);
		} else {
			var ct = this._getElement_(svn);
			var cmp = this._getElement_(idx);
			if(cmp) {
				ct.getLayout().setActiveItem(cmp);
			} else {				
				ct.getLayout().setActiveItem( ct.items.indexOfKey(idx));
			}
			  
		}
	}
	
	,_isValid_: function() { 

		if (this.getForm().isValid()) {
			return true;
		} else {
			Ext.Msg.show({
	          title: 'Invalid data'
	         ,msg: 'Form contains invalid data.<br>Please correct values then try again. '
	         ,buttons: Ext.MessageBox.OK
	         ,scope:this
	         ,icon: Ext.MessageBox.ERROR
	      });
	      return false;
		}
	}
	
	
	,_getBuilder_: function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvFormBuilder({dcv: this});
		}	
		return this._builder_;
	},
	
	beforeDestroy: function() { 
		//console.log("AbstractDcvFilterForm.beforeDestroy");
		this._controller_ = null;
		this.callParent();
		this._elems_.each(this.unlinkElem, this);
		this._elems_.each(this.destroyElement, this);		 
	},
	
	unlinkElem: function(item, index, len) {
		item._dcView_ = null;
	},
	
 	destroyElement: function(elemCfg) {
		try{			 
			var c =  Ext.getCmp( elemCfg.id );
			if (c) {
				Ext.destroy(c);
			}			
		} catch(e) {
			//alert(e);
		}
	}
	
});