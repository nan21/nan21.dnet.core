 

Ext.define("dnet.base.AbstractCombo", {
	extend:  "Ext.form.field.ComboBox" ,
 	alias: "widget.xcombo",
 
	 _dataProviderFields_  :null,
	 _dataProviderName_ : null,
	_editDialog_: null	 ,
	recordModel : null,
	 fetchSize : 30,
	 retFieldMapping : null,
	 
	 /**
		 * Example: ,filterFieldMapping: [{lovField:"...lovFieldName", dsField:
		 * "...dsFieldName"} ]
		 * 
		 * Or: ,filterFieldMapping: [{lovField:"...lovFieldName", value:
		 * "...static value"} ]
		 */
	filterFieldMapping: null ,    
	initComponent : function(){		 	
		this._createStore_(); 
	    this.callParent(arguments);	
	},	 
	_createStore_: function() {
		this.store = new Ext.data.Store( {
			model : this.recordModel,
			remoteSort : true,
			remoteSort : true,
	
			autoLoad : false,
			autoSync : false,
			clearOnPageLoad : true,
			pageSize : this.fetchSize,
			proxy : {
				type : 'ajax',
				api : Dnet.dsAPI(this.dsName, "json"),
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

    doQuery : function(q, forceAll){
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };

        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if( (this.lastQuery !== q) || (this.filterFieldMapping != null && this.filterFieldMapping.length>0) ){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }else{
                     
                    var bp = {}
                    bp[this.displayField] = q+"*";
                    bp["clientId"] = getApplication().getSession().client.id;
					 
					if (this.filterFieldMapping != null) {
					   this._mapFilterFields_(bp);
					}
                    this.store.baseParams["data"] =  Ext.encode(bp)
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();
            }
        }
    },
    
    getParams : function(q){
        var p = {};
         
        if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },
    
    assertValue  : function(){
        var val = this.getRawValue(),
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
    },
    
    onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.data[this.valueField || this.displayField]);
            this.collapse();

            this.fireEvent('select', this, record, index);
        }
    },
    
    _mapReturnFields_: function(crec) {   
		if (this.gridEditor) {
           var mrec = this.gridEditor.record;
           this._mapReturnFieldsExecute_(crec,mrec);
		} else {
			var dcv = this._getDcView_(), mrec = null;
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
				var nv,ov, isParam;
                   for(var i=0, len=this.retFieldMapping.length; i<len; i++ ) {
				   	   isParam  =  !Ext.isEmpty(this.retFieldMapping[i]["dsParam"]);
				     	ov = (isParam) ?
   	 		   			   prec.get( this.retFieldMapping[i]["dsParam"] ):
						   mrec.get( this.retFieldMapping[i]["dsField"] );

					   if (crec && crec.data) {
							nv = crec.data[ this.retFieldMapping[i]["lovField"] ];
					   		if (nv!= ov) {
								if(isParam) {
								   this._getDcView_()._controller_.setParamValue(this.retFieldMapping[i]["dsParam"], nv);
        						} else {
									mrec.set( this.retFieldMapping[i]["dsField"] ,nv   );
								}
							}
					   } else {
					   		if (ov != null && ov!= "" ) {
								if(isParam) {
								   this._getDcView_()._controller_.setParamValue(this.retFieldMapping[i]["dsParam"], null);
        						} else {
									 mrec.set( this.retFieldMapping[i]["dsField"] ,null);
								}
							}
					   }
				   }
			}

	 } ,
	 
	 
	 _mapFilterFields_: function(bp) {    
		if (this.gridEditor) {
           var mrec = this.gridEditor.record;
           this._mapFilterFieldsExecute_(bp,mrec);
		} else {
			var dcv = this._getDcView_(), mrec = null;
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
	 
	 getValue : function(){
		var v = null;
        if(this.valueField){
            v= Ext.isDefined(this.value) ? this.value : '';
        }else{
            v= Ext.form.ComboBox.superclass.getValue.call(this);
        }
        if (this.initialConfig["caseRestriction"] == "uppercase" && !Ext.isEmpty(v) )v=v.toUpperCase();
        return v;
    },
    
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


	initEvents : function(){
        Ext.form.ComboBox.superclass.initEvents.call(this);



        this.keyNav = new Ext.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                if(!this.isExpanded()){
                    this.onTriggerClick();
                }else{
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e){
                this.onViewClick(true);
                	e.stopEvent();
                	e.stopPropagation();
                	e.preventDefault();
				return false;
            },

            "esc" : function(e){
                this.collapse();
            },

            "tab" : function(e){
                if (this.forceSelection === true) {
                    this.collapse();
                } else {
                    this.onViewClick(false);
                }
                return true;
            },

            scope : this,

            doRelay : function(e, h, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                    // this MUST be called before ComboBox#fireKey()
                    var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if(!Ext.isIE && Ext.EventManager.useKeydown){
                        // call Combo#fireKey() for browsers which use keydown
						// event (except IE)
                        this.scope.fireKey(e);
                    }
                    return relay;
                }
                return true;
            },

            forceKeyDown : true,
            defaultEventAction: 'stopEvent'
        });
        this.queryDelay = Math.max(this.queryDelay || 10,
                this.mode == 'local' ? 10 : 250);
        this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
        if(this.typeAhead){
            this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
        }
        if(!this.enableKeyEvents){
            this.mon(this.el, 'keyup', this.onKeyUp, this);
        }
    }  ,
    
    openDialog:null,
	
	
	onRender : function(ct, position){
		dnet.base.AbstractCombo.superclass.onRender.call(this, ct, position);

		if( !this.gridEditor && this._editDialog_ != null && this.wrap){
			this.openDialog = this.wrap.createChild(
			{tag: "img", src: Ext.BLANK_IMAGE_URL, title: "Open dialog to edit values", 
				style:"border-bottom: none; margin-left:18px;", cls: "x-form-trigger " + "x-tbar-page-next" });
            this.openDialog.on('click', function(e) {
				getApplication().showFrame(this._editDialog_.name,  {url: Dnet.buildUiPath(this._editDialog_.bundle, this._editDialog_.name, this._editDialog_.custom ), tocElement:this._editDialog_.tocElement} );
				e.stopEvent();
			} , this);
        }
 
	}
});
 