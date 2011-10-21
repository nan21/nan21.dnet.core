Ext.ns("dnet.base");
dnet.base.GridMenu = Ext.extend(Ext.menu.Menu, {

    enableScrolling : false,
    hideOnClick : true,
    pickerId : null,
    cls : 'x-date-menu',
    initComponent : function(){
        this.on('beforeshow', this.onBeforeShow, this);
        if(this.strict = (Ext.isIE7 && Ext.isStrict)){
            this.on('show', this.onShow, this, {single: true, delay: 20});
        }
        Ext.apply(this, {
            plain: true,
            showSeparator: false,
            /*
            items: this.picker = new Ext.DatePicker(Ext.applyIf({
                internalRender: this.strict || !Ext.isIE,
                ctCls: 'x-menu-date-item',
                id: this.pickerId
            }, this.initialConfig))
            */
            items: this.picker = new Ext.grid.GridPanel(Ext.applyIf({
                internalRender: this.strict || !Ext.isIE,
                ctCls: 'x-menu-date-item',
                id: this.pickerId
            }, this.initialConfig.viewConfig))

        });
        this.picker.purgeListeners();
        dnet.base.GridMenu.superclass.initComponent.call(this);

        this.relayEvents(this.picker, ['select']);
        this.on('show', this.picker.focus, this.picker);
        this.on('select', this.menuHide, this);
        if(this.handler){
            this.on('select', this.handler, this.scope || this);
        }
    },

    menuHide : function() {
        if(this.hideOnClick){
            this.hide(true);
        }
    },

    onBeforeShow : function(){
        //if(this.picker){
            //this.picker.hideMonthPicker(true);
        //}
    },

    onShow : function(){
        var el = this.picker.getEl();
        el.setWidth(el.getWidth()); //nasty hack for IE7 strict mode
    }
 });
 Ext.reg('gridmenu', 'dnet.base.GridMenu');



Ext.ns("dnet.base");
dnet.base.AbstractLov2 = Ext.extend(Ext.form.TriggerField, {
    
	 defaultAutoCreate : {tag: "input", type: "text", size: "16",style:"cursor:default;", autocomplete: "off"}
    ,triggerClass: 'x-form-search-trigger'

    ,lovName: null
    ,fieldMapping:null
	,viewColumns: null
	,windowConfig:null
    ,_view_: null
    ,_window_:null
	,resultPageSize:50
	,_filterField_: null
    ,_dataProviderFields_ : null
	,_dataProviderName_: null

    , initComponent: function(){
        Ext.apply(this,arguments);
        //this._dummyDefaults();
        dnet.base.AbstractLov2.superclass.initComponent.call(this);
    } 

    ,initEvents: function() {
     dnet.base.AbstractLov.superclass.initEvents.call(this);

     this.keyNav = new Ext.KeyNav(this.el, {
            "down" : function(e){
				e.stopEvent();
                this.onTriggerClick();
            }
            ,scope : this
            //,forceKeyDown : true
            ,defaultEventAction: 'stopEvent'
        });

    //this._view_.on('keypress', this.onViewKeypress , this);
    //this._view_.on('dblclick', this.onDoSelect, this);
    //this._view_.getStore().proxy.on('loadexception', this.onLoadException, this);

  }


    , onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this._view_ == null){
            this._view_ = new dnet.base.GridMenu({
                hideOnClick: false
               , focusOnSelect: false
                 ,width:300
               ,height:300
               , viewConfig: this._createViewConfig_()
            });
        }
        this.onFocus();



        /*
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.disabledDatesRE,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            showToday : this.showToday,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.picker.setValue(this.getValue() || new Date());
        */
        this._view_.show(this.el, "tl-bl?");
       // this.menuEvents('on');

    }
//	, onTriggerClick: function() {
   // 	if (!this.disabled) this._showLov_();
//	}

	,_createViewConfig_: function() {
		var store =  new Ext.data.Store({
			        remoteSort:true
			       ,proxy: new Ext.data.HttpProxy({
					        api: getProtocolAPI(this._dataProviderName_,"json")
					    })
           			,reader: new Ext.data.JsonReader(
					   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
							,Ext.data.Record.create(this._dataProviderFields_))
			       , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
			    });
		return {
			 store:store
			 ,height:270
             //,columns: [new Ext.grid.RowNumberer(),{id:"code",header:"Code",width:100,dataIndex:'code',sortable:true,hidden:false},{id:"name",header:"Name",width:200,dataIndex:'name',sortable:true,hidden:false} ]
            ,columns: this.viewColumns
			//,forceFit: true
		    ,loadMask:true
		    ,bbar:{xtype:"paging", store: store, displayInfo:true, pageSize:this.resultPageSize }
		    /*
			,tbar:[ this._filterField_
                ,new Ext.Action({ id:Ext.id(), text: "Select", tooltip: 'Apply selection (Double click record in list)', iconCls: "icon-action-confirm", scope:this
					, handler: this.onDoSelect   })
				, new Ext.Action({ id:Ext.id(), text: "Cancel", tooltip: 'Close window', iconCls: "icon-action-reset", scope:this
					, handler: this.onDoCancel   })
            ]
            */
           };
	}

	,_showLov_: function() {
    	if ( this._window_ == null) {
           this._createLov_();
		}
		this._window_.show();

	}
	,_defaultFocusElement_:function() {
        this._filterField_.el.focus();
	}
	,_hideLov_: function() {
	   this._window_.hide();
	   this.el.focus();
	}
	,_createLov_: function() {
		this._createFilter_();
        this._createView_();
		this._createWindow_();
	}

    ,_createWindow_: function() {
		if (this._window_ != null ) return;
		if (this.windowConfig == null) {
          this.windowConfig = {
                title:"List of Values ("+this.lovName+")"
               ,width:300
               ,height:300
		  }
		}
        this.windowConfig = Ext.apply(this.windowConfig, {
           //  modal: true
             autoScroll: true
            ,closable: true
            ,closeAction: 'hide'
            ,layout: 'fit'
            ,items: this._view_
		});
        this._window_ = new Ext.Window(this.windowConfig);
        this._window_.on("hide", this._hideLov_, this);
        this._window_.on("show", this._defaultFocusElement_, this);

	}
	,_createFilter_:function() {
		this._filterField_ = new Ext.form.TextField({
			selectOnFocus:true
		   ,width:100
		});
	}
    ,_createView_: function() {
		var store =  new Ext.data.Store({
			        remoteSort:true
			       ,proxy: new Ext.data.HttpProxy({
					        api: getProtocolAPI(this._dataProviderName_,"json")
					    })
           			,reader: new Ext.data.JsonReader(
					   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
							,Ext.data.Record.create(this._dataProviderFields_))
			       , listeners: { "exception":{ fn:  this.proxyException, scope:this }}
			    });
		this._view_ = new Ext.grid.GridPanel({
			 store:store
             //,columns: [new Ext.grid.RowNumberer(),{id:"code",header:"Code",width:100,dataIndex:'code',sortable:true,hidden:false},{id:"name",header:"Name",width:200,dataIndex:'name',sortable:true,hidden:false} ]
            ,columns: this.viewColumns
			,forceFit: true
		    ,loadMask:true
		    ,bbar:{xtype:"paging", store: store, displayInfo:true, pageSize:this.resultPageSize }
		    ,tbar:[ this._filterField_
                ,new Ext.Action({ id:Ext.id(), text: "Select", tooltip: 'Apply selection (Double click record in list)', iconCls: "icon-action-confirm", scope:this
					, handler: this.onDoSelect   })
				, new Ext.Action({ id:Ext.id(), text: "Cancel", tooltip: 'Close window', iconCls: "icon-action-reset", scope:this
					, handler: this.onDoCancel   })
            ]
           })
	}
   , proxyException: function(dataProxy, type, action , options , response , arg ) {
        if(type=="response") {
          this.afterAjaxFailure(response , options);
        } else {
           alert(response.message.substr(0,1500));
        }
	  }
});

Ext.reg('xlovfield2', 'dnet.base.AbstractLov2');