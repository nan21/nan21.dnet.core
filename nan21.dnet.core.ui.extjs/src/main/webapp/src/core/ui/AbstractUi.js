Ext.ns("dnet.base");

dnet.base.AbstractUi = Ext.extend( Ext.Panel, {

 	  _elems_: null
 	 ,_configVars_: null
	 ,_tlbs_:  null
	 ,_tlbitms_:  null

	 ,_actions_:  null
	 ,_dcs_ :  null
	 ,_mainViewName_: null

	 ,_name_ : null
	 ,_title_: null
	 ,_statusBar_: null
	 
	 ,_header_: null
	 
	,initComponent: function() {
		 this._mainViewName_= "main";
		 
		 this._elems_ = new Ext.util.MixedCollection();
	 	 this._configVars_= new Ext.util.MixedCollection();
		 this._tlbs_= new Ext.util.MixedCollection();
		 this._tlbitms_= new Ext.util.MixedCollection();
		 this._actions_= new Ext.util.MixedCollection();
		 this._dcs_ = new Ext.util.MixedCollection();
		

		this._statusBar_ = new Ext.ux.StatusBar({
	        id: 'ui-status-bar'
	        ,defaultText: 'Status bar. Watch for messages ... '
	        ,defaultIconCls: 'default-icon'
	 
	        ,text: 'Ready'
	        ,iconCls: 'ready-icon'
	        ,items: [
	                 '-'
	                , this._name_
	          ]	
	    });
		
		this._config_();
        this._startDefine_();

		/* define data-controls */
		if (this._beforeDefineDcs_()) {
		   this._defineDcs_();
           this._afterDefineDcs_();
		}

		/* define model relations */
		if (this._beforeDefineDcRelations_()) {
		   this._defineDcRelations_();
           this._afterDefineDcRelations_();
		}

        /* define toolbars */
        if (this._beforeDefineActions_()) {
		   this._defineActions_();
           this._afterDefineActions_();
		}

        /* define toolbars */
        if (this._beforeDefineToolbars_()) {
		   this._defineToolbars_();
           this._afterDefineToolbars_();
		}

        /* define stand-alone user-interface elements */
		if (this._beforeDefineElements_()) {
		   this._defineElements_();
           this._afterDefineElements_();
		}

        /* build the ui, linking elements */
		if (this._beforeLinkElements_()) {
		   this._linkElements_();
           this._afterLinkElements_();
		}

        /* setup model-view binding behaviour */
		if (this._beforeDefineBindings_()) {
		   this._defineBindings_();
           this._afterDefineBindings_();
		}

        this._endDefine_();

		Ext.apply(this, {
			layout:"fit"
			,bbar: 	this._statusBar_
			,items:[
				this._elems_.get(this._mainViewName_)
			]
		});

		this._title_ = Dnet.translate("ui", this._name_)

    	dnet.base.AbstractUi.superclass.initComponent.apply(this, arguments);
    	this.addListener("afterlayout", this._onReady_, this);
    //	this.addListener("canvaschange", function(p) {this._header_.setCanvas(p.title); } , this);


    }

	,_onReady_: function(p) {
		//this._header_.setTitle(this._title_);

		getApplication().setFrameTabTitle(this._name_, this._title_);
		//getApplication().registerFrameInstance(this._name_,this);
		//getApplication().applyFrameCallback(this._name_,this);
		if (p==this) { this._onReady_(); }

	}

	,_getDc_: function(name) {  return this._dcs_.get(name);  }

    ,_getElement_: function(name) {
    	return  Ext.getCmp( this._elems_.get(name).id );    	 
    }
     
    ,_getElementConfig_: function(name) {  return this._elems_.get(name); }

    ,_getWindow_ : function(name) {
    	var cfg = this._elems_.get(name);
    	var w =  Ext.getCmp( cfg.id);
    	if ( !Ext.isEmpty(w) ) {
    		return w;
    	} else {
    		if (cfg._window_ ) {        		  
        		return new Ext.Window(cfg);
        	} 
    	}
    	throw (name+' is not a window!');     	   
    }
    
    ,_getToolbar_: function(name) {  return Ext.getCmp( this._tlbs_.get(name).id); }
	,_getToolbarConfig_: function(name) {  return this._tlbs_.get(name); }

	,_getToolbarItem_: function(name) {  return Ext.getCmp( this._tlbitms_.get(name).id);  }
	,_getToolbarItemConfig_: function(name) { return this._tlbitms_.get(name);  }

	,_config_: function() {}
    ,_startDefine_: function () {}
    ,_endDefine_: function () {}


    ,_defineDcs_: function () {}
    	,_beforeDefineDcs_: function () {return true;}
    	,_afterDefineDcs_: function () {}

	,_defineElements_: function () {}
    	,_beforeDefineElements_: function () {return true;}
    	,_afterDefineElements_: function () {}

    ,_defineActions_: function () {}
    	,_beforeDefineActions_: function () {return true;}
    	,_afterDefineActions_: function () {}

    ,_defineToolbars_: function () {}
    	,_beforeDefineToolbars_: function () {return true;}
    	,_afterDefineToolbars_: function () {}

	,_linkToolbar_: function(tlbName, viewName) {
        var tlb =  this._tlbs_.get(tlbName);
        var view =  this._elems_.get(viewName);
		view["tbar"] = tlb;
		var keys = [];
		var n, kb =null;
		for (var i=0; i<tlb.length; i++ ) {
			var ic = tlb[i]["initialConfig"];
   			if (ic) {
                n = ic["_name_"];
				kb = dnet.DefaultKeyMap[n];
				if (kb) {
					keys[keys.length] = {
		               	 key: kb.key
				        ,alt:kb.alt
				        ,handler: this._createKeyBindingHandler_(n, tlbName)
				        ,scope: this
				        ,stopEvent :true
				   }
				}
   			}
		}
        view["keys"] = keys;
	}
	,_createKeyBindingHandler_: function(itemName, tlbName ) {
		return function() { this._invokeTlbItem_(itemName, tlbName ); }
	}
    ,_defineDcRelations_: function () {}
    	,_beforeDefineDcRelations_: function () {return true;}
    	,_afterDefineDcRelations_: function () {}

    ,_linkElements_: function () {}
    	,_beforeLinkElements_: function () {return true;}
    	,_afterLinkElements_: function () {}

    ,_defineBindings_: function () {}
    	,_beforeDefineBindings_: function () {return true;}
    	,_afterDefineBindings_: function () {}


	,_invokeTlbItem_: function (name, tlbName) {
		var b=null;
		if (!tlbName) {
        	b = this._tlbitms_.get(name);
		} else {
           b = this._tlbitms_.get(tlbName+"__"+name);
		}
        if (b) {b.execute();}
    }
    ,_showStackedViewElement_: function(svn, idx) {
		if (Ext.isNumber(idx) ) {
    		this._getElement_(svn).getLayout().setActiveItem(idx);
		} else {
			this._getElement_(svn).getLayout().setActiveItem(this._getElement_(idx));
		}
	}
});
/*
	define the key as one of the following:
	  1) string: "l", "a" , ...
	  2) ascii key code 65, 68, ....
	  3) Ext.EventObject.F2 , Ext.EventObject.ENTER , ....
	  	are defined in Ext.EventManager
*/
dnet.DefaultKeyMap = Ext.apply({},{
	 load : { key: "l", alt:true }
	,save : { key: "s", alt:true }
	,save_mr : { key: "s", alt:true }
	,new_sr : { key: "n", alt:true }
	,new_mr : { key: "n", alt:true }
	,copy_sr : { key: "c", alt:true }
	,copy_mr : { key: "c", alt:true }
	,delete_sr : { key: "d", alt:true }
	,delete_mr : { key: "d", alt:true }
	,edit_sr : { key: Ext.EventObject.ENTER, alt:false }
	,rollback_sr: { key: "z", alt:true }
	,rollback_mr: { key: "z", alt:true }
	,back_sr: { key: "q", alt:true }
	,back_mr: { key: "q", alt:true }


});
