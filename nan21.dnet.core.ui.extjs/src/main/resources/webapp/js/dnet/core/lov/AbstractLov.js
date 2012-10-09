 
Ext.define("dnet.core.lov.AbstractLov", {
	extend:  "Ext.form.TriggerField" ,
 	alias: "xlovfield",
 	 
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
        dnet.core.lov.AbstractLov.superclass.initComponent.call(this);
    } 

    ,initEvents: function() {
     dnet.core.lov.AbstractLov.superclass.initEvents.call(this);

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

	, onTriggerClick: function() {
    	if (!this.disabled) this._showLov_();
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
	   //this.el.focus();
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

 