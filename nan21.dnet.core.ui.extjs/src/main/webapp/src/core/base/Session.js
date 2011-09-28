 
dnet.base.Session = {

	 user: { id: null, code: null, name: null}
	,client: { id: null, code: null }
	,locked: false
	
	,sysParams : {}
	
	,getUser: function() {
		return this.user;
	}
	,getClient: function() {
		return this.client;
	}
	,getClientId: function() {
		return this.client.id*1;
	}
	,getClientCode: function() {
		return this.client.code;
	}
	,isAuthenticated: function() {  
		return (!Ext.isEmpty(this.user.name));
	} 
	
	
};
 