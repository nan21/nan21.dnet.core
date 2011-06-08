/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

Ext.ns("dnet.base");
dnet.base.Session = Ext.apply({}, {

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
	,isAuthenticated: function() {  
		return (!Ext.isEmpty(this.user.name));
	} 
	
	
});
 