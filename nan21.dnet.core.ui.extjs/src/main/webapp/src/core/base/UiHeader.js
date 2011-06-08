Ext.ns("dnet.base");
dnet.base.UiHeader = Ext.extend(Ext.Toolbar , {
	 
	initComponent: function(config) {
		var items =   [

			 {xtype:"spacer", width:10}
			,{xtype:"tbtext" , text:this.headerTitle || "Title", style:"font-weight:bold;font-size:12px;"  }

			//, "-"
			//,{xtype:"tbtext" , text:"-", style:"font-weight:bold;" , id: this.clientTxtID  }
			//, "->"
			//,{xtype:"tbtext" , html:"<span style='align:right'><span style='font-weight:bold'>DNet Enterprise Suite </span><br><span>Version: "+Dnet.version+"</span></span>", cls:"app-header-text" }

		];

		if (! (this["showSubpath"] === false ) ) {
            items[2]  = "-";
            items[3]  = {xtype:"tbtext" , text:"List", style:"font-weight:bold;" , id: this.clientTxtID  };
		}
		var cfg = {
			border: false, frame: false, width:1000, height:25
			,items: items
		}
		Ext.apply(cfg,config);
	    Ext.apply(this,cfg);
		 
		dnet.base.UiHeader.superclass.initComponent.call(this);
 
	}

	,setTitle: function(v) {
		this.items.itemAt(1).setText(v);
	}
	,setCanvas: function(v) {
		this.items.itemAt(3).setText(v);
	}
});