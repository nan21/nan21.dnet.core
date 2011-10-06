


Ext.define("dnet.base.AbstractCombo", {
	extend:  "dnet.base.AbstractRemoteCombo" ,
 	alias: "widget.xcombo",
 
 // DNet properties
 	
 	/**
	 * Example: ,filterFieldMapping: [{lovField:"...lovFieldName", dsField:
	 * "...dsFieldName"} ]
	 * 
	 * Or: ,filterFieldMapping: [{lovField:"...lovFieldName", value:
	 * "...static value"} ]
	 */
 	filterFieldMapping: null , 
	_dataProviderFields_  :null,
	_dataProviderName_ : null,
	_dummyValue_ : null,
	_editDialog_: null	 ,
	openDialog:null,
	retFieldMapping : null,	
	triggerAction :"query",
	matchFieldWidth : false,
	recordModel : null,
	pageSize : 20,
	autoSelect:true,
	minChars:0,	
	queryMode: "remote",
	  
	trigger1Cls: Ext.baseCSSPrefix + 'x-form-trigger',    
    trigger2Cls:  Ext.baseCSSPrefix + 'form-search-trigger',
     
	defaultListConfig: {
		emptyText: "", loadingText: "Loading...", 
		minWidth: 70, 
		width:200,  resizable:true,
		shadow: "sides", autoScroll:true
	},
	 
	autoScroll:true,
	
	initComponent : function(){		 	
		this._createStore_(); 
		if (this.retFieldMapping == null) {
			this.retFieldMapping = [];
		}
		//TODO: handle if it is binded to a parameter
		this.retFieldMapping[this.retFieldMapping.length] = {
				lovField:this.displayField,
				dsField: this.dataIndex
		};		
	    this.callParent(arguments);	
	},	 
	
	onTrigger2Click : function(){
		getApplication().showFrame(this._editDialog_.name,  {
			url: Dnet.buildUiPath(this._editDialog_.bundle, this._editDialog_.name, this._editDialog_.custom ), 
			tocElement:this._editDialog_.tocElement} );		 
    },
	 
	_createStore_: function() {
		this.store = Ext.create("Ext.data.Store", {
			model : this.recordModel,
			remoteSort : true,
			remoteSort : true,
	
			autoLoad : false,
			autoSync : false,
			clearOnPageLoad : true,
			pageSize : this.pageSize,
			proxy : {
				type : 'ajax',
				api : Dnet.dsAPI(this._dataProviderName_, "json"),
				actionMethods : {
					create : 'POST',
					read : 'POST',
					update : 'POST',
					destroy : 'POST'
				},
				reader : {
					type : 'json',
					root : 'data',
					idProperty : 'id',
					totalProperty : 'totalCount',
					messageProperty : 'message'
				},
				listeners : {
					"exception" : {
						fn : this.proxyException,
						scope : this
					}
				},
				startParam : Dnet.requestParam.START,
				limitParam : Dnet.requestParam.SIZE,
				sortParam : Dnet.requestParam.SORT,
				directionParam : Dnet.requestParam.SENSE
			}
		});
	 },
 
	 
 
    _mapReturnFields_: function(crec) {   
		if (this.inEditor) {
           var mrec = this._targetRecord_;
           this._mapReturnFieldsExecute_(crec,mrec);
		} else {
			var dcv = this._dcView_, mrec = null;
			if (dcv._dcViewType_ == "edit-form") {
	           mrec = dcv._controller_.getRecord();
			}
	        if (dcv._dcViewType_ == "filter-form") {
	           mrec = dcv._controller_.getFilter();
			}
           this._mapReturnFieldsExecute_(crec, mrec, dcv._controller_.getParams());
		}
    },
    
    
    /**
     * Params: crec: combo selected record
     */
    _mapReturnFieldsExecute_: function(crec, mrec, prec) {    
		if (!mrec) {return; }
        if (this.retFieldMapping != null) {
				var nv,ov, isParam, rawv= this.getRawValue();
				 
                   for(var i=this.retFieldMapping.length-1; i>=0; i-- ) {
				  // for(var i=0,len = this.retFieldMapping.length; i<len; i++ ) {
                	   var retDataIndex = null;
				   	   isParam  =  !Ext.isEmpty(this.retFieldMapping[i]["dsParam"]);
				   	   if (isParam) {				   		   
					   		retDataIndex = this.retFieldMapping[i]["dsParam"];
					   		ov = prec.get( retDataIndex );
				   	   } else {
				   		   retDataIndex = this.retFieldMapping[i]["dsField"];
				   		   ov = mrec.get(retDataIndex);
				   	   }
				   	    
					   if (crec && crec.data) {
							nv = crec.data[ this.retFieldMapping[i]["lovField"] ];
					   		if (nv!= ov) {
								if(isParam) {
								   this._dcView_._controller_.setParamValue(retDataIndex, nv);
        						} else {
									mrec.set( retDataIndex ,nv   );
								}
							}
					   } else {	
						    
						   if (retDataIndex==this.dataIndex ) {							   
							   if (this._validateListValue_ && rawv != ov) {
								   rawv = null;
								   this.setRawValue(rawv);
							   }
							   if (rawv!= ov) {
								   if(isParam) {
									   this._dcView_._controller_.setParamValue(retDataIndex,rawv );
									} else {
										 mrec.set(retDataIndex, rawv );
									}
							   }
								
							} else {
								if ((ov != null && ov!= "" && Ext.isEmpty(rawv))) {
									if(isParam) {
									   this._dcView_._controller_.setParamValue(retDataIndex, null);
	        						} else {
										 mrec.set(retDataIndex ,null);
									}
								}
							}
						    
					   }
				   }
			}

	 } ,
	 
	 
	 _mapFilterFields_: function(bp) {    
		if (this.inEditor) {
	       var mrec = this._targetRecord_;
           this._mapFilterFieldsExecute_(bp,mrec);
		} else {
			var dcv = this._dcView_, mrec = null;
			if (dcv._dcViewType_ == "edit-form") {
	           mrec = dcv._controller_.getRecord();
			}
	        if (dcv._dcViewType_ == "filter-form") {
	           mrec = dcv._controller_.getFilter();
			}
           this._mapFilterFieldsExecute_(bp, mrec);
		}
    },
    /**
     * Parameters:
     * bp: base params for the store
     */
    _mapFilterFieldsExecute_: function(bp, mrec) {  
		if (!mrec) {return; }
        if (this.filterFieldMapping != null) {
        	for(var i=0, len=this.filterFieldMapping.length; i<len; i++ ) {
			   if (this.filterFieldMapping[i]["value"]) {
			   		bp[this.filterFieldMapping[i]["lovField"]] =  this.filterFieldMapping[i]["value"];
			   	} else {
        			bp[this.filterFieldMapping[i]["lovField"]] =   mrec.get( this.filterFieldMapping[i]["dsField"]);
				}
			}
		 }
	 } ,
	  
    /**
	 * Default proxy-exception handler
	 */
	proxyException : function(proxy, response, operation, eOpts) {
		this.showAjaxErrors(response, eOpts);
	},

	
    
	
    

    
    /**
	 * Show errors to user. TODO: Externalize it as command.
	 */
	showAjaxErrors : function(response, options) {
		// Ext.MessageBox.hide();
		var msg, withDetails = false;
		if (response.responseText) {
			if (response.responseText.length > 2000) {
				msg = response.responseText.substr(0, 2000);
				withDetails = true;
			} else {
				msg = response.responseText;
			}
		} else {
			msg = "No response received from server.";
		}
		var alertCfg = {
			msg : msg,
			scope : this,
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.MessageBox.OK
		}
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = response.responseText;
		}
		Ext.Msg.show(alertCfg);

	},
    
	
	// ****************************************************************
	// *********************** OVERRIDES ******************************
	// ****************************************************************
	
	
    doQuery: function(queryString, forceAll, rawQuery) {		 
        var bp = {}
        bp[this.displayField] = queryString+"*";
        bp["clientId"] = getApplication().getSession().client.id;			 
			if (this.filterFieldMapping != null) {
			   this._mapFilterFields_(bp);
			   /*TODO: check the filter mapping change instead of this brut force stuff*/
			   this.queryCaching = false;
			}
        this.store.proxy.extraParams["data"] =  Ext.encode(bp)
        return this.callParent(arguments);
	 },
	 
 
    
    assertValue: function() {
        var me = this,
            val = me.getRawValue(),
            rec;
        
        rec = this.findRecord(this.displayField, val);
        
        if(!rec && this.forceSelection){
			this.setRawValue("");
			if(val.length > 0 && val != this.emptyText){
				 
                this.applyEmptyText();
            }else{
                this.clearValue();
            }

            this._mapReturnFields_(null);

        }else{
            if(rec){
                
                this._mapReturnFields_(rec);
                if (val == rec.get(this.displayField) && this.value == rec.get(this.valueField)){
				    return;
                }
                val = rec.get(this.valueField || this.displayField);
            } else {
            	if (val != this.value ) {
            		this._mapReturnFields_(null);
            	}			   
			}
			if (this.getValue() != val) {
               this.setValue(val);
			}

        }
        
        me.collapse();
    }

});





Ext.define('dnet.base.LocalCombo', {
	extend: "Ext.form.field.ComboBox",
	alias:"widget.localcombo",
	
	queryMode: "local", 
	 selectOnFocus:true,
	 triggerAction:"query", 
	 forceSelection:true,
	 
	 
	 setValue: function(value, doSelect) {
	    var me = this,
	        valueNotFoundText = me.valueNotFoundText,
	        inputEl = me.inputEl,
	        i, len, record,
	        models = [],
	        displayTplData = [],
	        processedValue = [];
	
	    if (me.store.loading) {
	        // Called while the Store is loading. Ensure it is processed by the onLoad method.
	        me.value = value;
	        return me;
	    }
	
	    // This method processes multi-values, so ensure value is an array.
	    value = Ext.Array.from(value);
	
	    // Loop through values
	    for (i = 0, len = value.length; i < len; i++) {
	        record = value[i];
	        if (!record || !record.isModel) {
	            record = me.findRecordByValue(record);
	        }
	        // record found, select it.
	        if (record) {
	            models.push(record);
	            displayTplData.push(record.data);
	            processedValue.push(record.get(me.valueField));
	        }
	        // record was not found, this could happen because
	        // store is not loaded or they set a value not in the store
	        else {
	            // if valueNotFoundText is defined, display it, otherwise display nothing for this value
	            if (Ext.isDefined(valueNotFoundText)) {
	                displayTplData.push(valueNotFoundText);
	            }
	            processedValue.push(value[i]);
	        }
	    }
	
	    // Set the value of this field. If we are multiselecting, then that is an array.
	    me.value = me.multiSelect ? processedValue : processedValue[0];
	    if (!Ext.isDefined(me.value)) {
	        me.value = null;
	    }
	    me.displayTplData = displayTplData; //store for getDisplayValue method
	    me.lastSelection = me.valueModels = models;
	
	    if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
	        inputEl.removeCls(me.emptyCls);
	    }
	
	    // Calculate raw value from the collection of Model data
	    me.setRawValue(me.getDisplayValue());
	    me.checkChange();
	
	    me._processedValue_ = processedValue;
	    if(processedValue.length > 0) {
	    	var r = this._dcView_._controller_.getRecord();
			if (r) {
				var rv = r.get(me.dataIndex);				  
				if (!r.isEqual(rv, me.value)) {
					r.set(me.dataIndex, me.value);
				}
			} 
			 
	    }
	    if (doSelect !== false) {
	        me.syncSelection();
	    }
	    me.applyEmptyText();
	
	    return me;
	}
});



