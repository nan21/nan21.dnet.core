Ext.ns("dnet.base");
dnet.base.AbstractCombo = Ext.extend(Ext.form.ComboBox, {

	  _dataProviderFields_  :null
	 ,_dataProviderName_ : null
	 ,_editDialog_: null
	 ,retFieldMapping : null
	 ,filterFieldMapping: null    // ex: ,filterFieldMapping: [{lovField:"...lovFieldName", dsField: "...dsFieldName"} ]
	 			// or ,filterFieldMapping: [{lovField:"...lovFieldName", value: "...static value"} ]

	 ,_createStore_: function() {

		this.store = new Ext.data.Store({
	        remoteSort:true
	       ,proxy: new Ext.data.HttpProxy({
			        api: Dnet.dsAPI(this._dataProviderName_,"json")
			    })
	       ,reader: new Ext.data.JsonReader(
	   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
				,Ext.data.Record.create(this._dataProviderFields_))
	      , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
		})
	    this.store.proxy.getConnection().async = false;
	 }

    ,doQuery : function(q, forceAll){
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
                    //this.store.baseParams[this.queryParam] = q;
                    var bp = {}
                    bp[this.displayField] = q+"*";
                    bp["clientId"] = getApplication().getSession().client.id;
					// read the other filter params
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
    }
    ,getParams : function(q){
        var p = {};
        //p[this.queryParam] = q;
        if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    }

	,assertValue  : function(){
        var val = this.getRawValue(),
            rec = this.findRecord(this.displayField, val);

        if(!rec && this.forceSelection){
			this.setRawValue("");
			if(val.length > 0 && val != this.emptyText){
				//this.el.dom.value = Ext.value(this.lastSelectionText, '');
                this.applyEmptyText();
            }else{
                this.clearValue();
            }

            this._mapReturnFields_(null);

        }else{
            if(rec){
                // onSelect may have already set the value and by doing so
                // set the display field properly.  Let's not wipe out the
                // valueField here by just sending the displayField.
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
    }

    ,onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.data[this.valueField || this.displayField]);
            this.collapse();

            this.fireEvent('select', this, record, index);
        }
    }
    ,_mapReturnFields_: function(crec) {   // crec combo selected record
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
    }

    ,_mapReturnFieldsExecute_: function(crec, mrec, prec) {   // crec combo selected record
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

	 }
    ,_mapFilterFields_: function(bp) {   // empty object which is added to store.baseParams
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
    }
    ,_mapFilterFieldsExecute_: function(bp, mrec) {   // bp base prams for combo query
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
	 }

    ,getValue : function(){
		var v = null;
        if(this.valueField){
            v= Ext.isDefined(this.value) ? this.value : '';
        }else{
            v= Ext.form.ComboBox.superclass.getValue.call(this);
        }
        if (this.initialConfig["caseRestriction"] == "uppercase" && !Ext.isEmpty(v) )v=v.toUpperCase();
        return v;
    }
    , proxyException: function(dataProxy, type, action , options , response , arg ) {
        if(type=="response") {
          this.afterAjaxFailure(response , options);
        } else {
           alert(response.message.substr(0,1500));
        }
	  }
    , afterAjaxFailure: function(response , options) {
      	dc____ajaxfailure(response , options);

	  }


	,initEvents : function(){
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
                //if(this.isExpanded()){
                	e.stopEvent();
                	e.stopPropagation();
                	e.preventDefault();
				//}
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
                        // call Combo#fireKey() for browsers which use keydown event (except IE)
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
    }

    ,openDialog:null
	,onRender : function(ct, position){
		dnet.base.AbstractCombo.superclass.onRender.call(this, ct, position);

		if( !this.gridEditor && this._editDialog_ != null && this.wrap){
			this.openDialog = this.wrap.createChild(
			{tag: "img", src: Ext.BLANK_IMAGE_URL, title: "Open dialog to edit values", 
				style:"border-bottom: none; margin-left:18px;", cls: "x-form-trigger " + "x-tbar-page-next" });
            this.openDialog.on('click', function(e) {
				getApplication().showFrame(this._editDialog_.name,  {url: Dnet.buildUiPath(this._editDialog_.module, this._editDialog_.name, this._editDialog_.custom )} );
				e.stopEvent();
			} , this);
            //this.openDialog.alignTo(this.wrap, 'tl-tr', [2, 0]);
        }
//		 this.wrap.createChild({tag: "img", src: Ext.BLANK_IMAGE_URL, title: "Open dialog to edit values", cls: "x-form-trigger " + "x-tbar-page-next" , onClick:"javascript: getApplication().showFrame('CountryMD_UI',  {url: Dnet.buildUiPath('bd', 'CountryMD_UI', false)} ); return false;"  });
	}
});
Ext.reg('xcombo', dnet.base.AbstractCombo );