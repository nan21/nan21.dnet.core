Ext.ns("dnet.base");
dnet.base.AbstractComboListView = Ext.extend(Ext.form.ComboBox, {

	  _dataProviderFields_ : null
	 ,_dataProviderName_: null
     ,triggerClass: 'x-form-search-trigger'
     ,initComponent : function(){
        dnet.base.AbstractComboListView.superclass.initComponent.call(this);
     }

	 ,_createStore_: function() {

		this.store = new Ext.data.Store({
	        remoteSort:true
	       ,proxy: new Ext.data.HttpProxy({
			        api: getProtocolAPI(this._dataProviderName_,"json")
			    })
	       ,reader: new Ext.data.JsonReader(
	   		 {totalProperty: 'totalCount',idProperty: 'id',root: 'data',messageProperty: 'message'}
				,Ext.data.Record.create(this._dataProviderFields_))
	      //, listeners: { "exception":{ fn:  this.proxyException, scope:this }}
		})

	 }
	, initList : function(){
        if(!this.list){
            var cls = 'x-combo-list',
                listParent = Ext.getDom(this.getListParent() || Ext.getBody()),
                zindex = parseInt(Ext.fly(listParent).getStyle('z-index'), 10);

            if (!zindex) {
                zindex = this.getParentZIndex();
            }

            this.list = new Ext.Layer({
                parentEl: listParent,
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain:false,
                zindex: (zindex || 12000) + 5
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if(this.syncFont !== false){
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(this.pageSize){
                this.footer = this.list.createChild({cls:cls+'-ft'});
                this.pageTb = new Ext.PagingToolbar({
                    store: this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            //if(!this.tpl){this.tpl = '{' + this.displayField + '}';}


/**
            * The {@link Ext.DataView DataView} used to display the ComboBox's options.
            * @type Ext.DataView
            */

            this.view = new Ext.list.ListView({
                applyTo: this.innerList
               // tpl: this.tpl,
               , singleSelect: true
               // selectedClass: this.selectedClass,
                //itemSelector: this.itemSelector || '.' + cls + '-item',
               // emptyText: this.listEmptyText,
               // deferEmptyText: false
				,store:this.store
			//	,reserveScrollOffset: true
                //,store: this.store
				,columns: [

				{ header:"Code" ,dataIndex:'code' }
				

				,{ header:"Name" ,dataIndex:'name' }]
            });
			 /*
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText,
                deferEmptyText: false
            });
               */



            this.mon(this.view, {
                containerclick : this.onViewClick,
                click : this.onViewClick,
                scope :this
            });
            this.bindStore(this.store, true);

            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);

                this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
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
            if(this.lastQuery !== q){
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
    
    // private
   , onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0],
            s = this.store,
            r = s.getAt(index);
        if(r && r.get(this.displayField).indexOf(this.getRawValue()) >=0 ){
            this.onSelect(r, index);
        }else {
            this.collapse();
        }
        if(doFocus !== false){
            this.el.focus();
        }
    }

});
Ext.reg('xcombolist', dnet.base.AbstractComboListView );