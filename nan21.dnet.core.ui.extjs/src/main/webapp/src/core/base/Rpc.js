Ext.ns("dnet.base");
dnet.base.Rpc = {


	/**
	    @param: rpcCall :Object
			class : class-name as datasource name
			method: method name
			params :
	*/
	 invoke: function(rpcCall) {
	   if (rpcCall.msg) {
           Ext.Msg.progress(rpcCall.msg);
	   }

       Ext.Ajax.request({
			url: Dnet.rpcAPI(rpcCall.class,rpcCall.method, "json")
			,method:"POST"
			,failure: this.onFailure
			,success : function() {Ext.Msg.hide();}
			,params: rpcCall.params
		});
	}
    ,onFailure: function(response , options) {
    	Ext.MessageBox.hide();
		if (response && response.responseText) {
            var msg = response.responseText;
			if (msg && msg.length > 2000) { msg = msg.substr(0,2000);}
	      	Ext.Msg.show({
		          title: 'HTTP:'+response.status+' '+ response.statusText
		         ,msg: msg
		         ,buttons: {ok:'OK'} //, cancel:'Details'
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
		         ,_detailedMessage_:response.responseText

		      });
		} else {
            Ext.Msg.show({
				  msg: 'Server returned error with HTTP-STATUS '+ response.status + ' but no other details. '
		         ,buttons: {ok:'OK'} //, cancel:'Details'
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
		      });
		}
  }
}