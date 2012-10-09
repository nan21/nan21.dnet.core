 Ext.define('dnet.core.dc.SortItemSelector', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: ['widget.sortitemselectorfield'],
    buttons: ['top', 'up', 'add', 'remove', 'down', 'bottom', 'desc'],

    buttonsText: {
        top: "Move to Top",
        up: "Move Up",
        add: "Add to Selected",
        remove: "Remove from Selected",
        down: "Move Down",
        bottom: "Move to Bottom",
        desc: "Change sort sense(ASC/DESC)"
    }, 
    
     
    onDescBtnClick : function() {
    	//alert();
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            max = store.getCount(),
            selection,
            index;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            if (selection.data.sense == "DESC") {
            	selection.data.sense = "";
            	selection.data.text2 = selection.data.text;
            } else {
            	selection.data.sense = "DESC";
            	selection.data.text2 = selection.data.text+"-DESC";
            }
            //index = Math.min(max, store.indexOf(selection) + 1);
            //store.remove(selection);
            //store.insert(index, selection);
        }
        store.resumeEvents();
        list.refresh();
    },
    
    onRemoveBtnClick : function() {
        var me = this,i = 0,
            toList = me.toField.boundList,
            selected = this.getSelections(toList),
            len = selected.length;
        for (; i < len; ++i) {
         	selection = selected[i];
         	selection.data.sense = "";
         	selection.data.text2 = selection.data.text;
        }
        toList.getStore().remove(selected);
        this.fromField.boundList.getStore().add(selected);
    } 
    
    
 });
 
 
 
Ext.define("dnet.core.dc.DataSortWindow", {
	extend : "Ext.window.Window",

	/**
	 * 
	 * @type dnet.core.dc.AbstractDcvGrid
	 */
	_grid_ : null,
	_selectorId_ : null,
	
	
	//TODO: optimize this
	
	initComponent : function(config) {

		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("dcvgrid", "sort_run"),
			//iconCls : 'icon-action-sort',
			scope: this,
			handler:this.executeTask
		});

		var avlCol = [];
		this._grid_._columns_.each(function(item, idx,len) {
			avlCol[avlCol.length] = [item.name, item.header, '',item.header+'' ]
		})
		 
	    var selCol = [];
	    this._grid_.store.sorters.each(function(item, idx,len) {
			selCol[selCol.length] = [item.property]
			if (item.direction == "DESC") {
				for (var j=0;j<avlCol.length;j++) {
					var e = avlCol[j];
					if (e[0] == item.property) {
						e[2] = "DESC";
						e[3] = e[1] + "-DESC";
					}
				}
			}
		})
		var ds = Ext.create('Ext.data.ArrayStore', {
	        data: avlCol,
	        fields: ['value','text','sense','text2'],
	        sortInfo: {
	            field: 'text',
	            direction: 'ASC'
	        }
	    });
	    
	    ds.sort();
	    this._selectorId_ = Ext.id();
		var cfg = {
			title : Dnet.translate("dcvgrid", "sort_title"),
			border : true,
			width : 350,
			height:300,
			resizable : true,
			//closeAction : "hide",			 
			closable : true,
			constrain : true,
			buttonAlign : "center",
			modal : true,
			layout:"fit",
			items : [{
	            xtype: 'sortitemselectorfield',
	            //fieldLabel : Dnet.translate("dcvgrid", "exp_columns"),
	            id : this._selectorId_,
	           // width: 300,
	           // height: 300,
	            //imagePath: '../ux/images/',
	            store: ds,
	            displayField: 'text2',
	            valueField: 'value',
	            value: selCol,
	             
	            msgTarget: 'top'
	        }],
			buttons : [ btn ]
		};

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);
	},
	
	getSelector : function() {
		return Ext.getCmp(this._selectorId_);
	},
	executeTask : function() {
		var s = this.getSelector(),
			sorts = s.toField.boundList.store.data.items
			len = sorts.length
			store = this._grid_.store 
			;
		var newsort = []; 
		store.sorters.clear();
		for(var i=0;i<len;i++) {
			newsort.push({
			    property : sorts[i].data.value,
			    direction: sorts[i].data.sense || "ASC"
			})			 
		}	
		this._grid_._controller_.store.sort(newsort);	 
		this.close();
	}

});
