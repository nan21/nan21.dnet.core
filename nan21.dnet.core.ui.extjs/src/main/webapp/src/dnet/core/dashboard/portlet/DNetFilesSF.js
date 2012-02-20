Ext.define('dnet.core.dashboard.portlet.DNetFilesSF', {

    extend: 'Ext.grid.Panel',
    alias: 'widget.DNetFilesSF',
    height: 300,
     
    initComponent: function(){

       var  store = Ext.create('Ext.data.Store', {
                fields: [
	               {name: 'title'},
	               {name: 'pubDate' } 
	               
	            ],
                sortInfo: {
                    property: 'pubDate',
                    direction: 'DESC'
                },
                autoLoad:true,
                proxy: {
                    type: 'jsonp',
                    url: 'http://sourceforge.net/api/file/index/project-id/576404/path/milestone/mtime/desc/rss',
                    reader: {
                        type: 'xml',
                        record: 'item'
                    }
                } 
            });

        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: store,
            stripeRows: true,
            columnLines: true,
            columns: [{
                id       :'title',
                text   : 'title',
                //width: 120,
                flex: 1,
                sortable : false,
                dataIndex: 'title'
            },{
                text   : 'pubDate',
                width    : 75,
                sortable : false,
                
                dataIndex: 'pubDate'
            } ]
        });

        this.callParent(arguments);
    }
});
