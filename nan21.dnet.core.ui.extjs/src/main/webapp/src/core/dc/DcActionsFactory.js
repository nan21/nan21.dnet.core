dnet.base.DcActionsFactory = function() {	
	return {		
		createActions: function(dc) {		
			return {				 
				doQuery : new Ext.Action({ name:"doQuery",iconCls: "icon-action-fetch", disabled: false
	        		,text: Dnet.translate("tlbitem", "load__lbl"), tooltip: Dnet.translate("tlbitem", "load__tlp")    			
	    			,scope:dc, handler: function() { try { dc.doQuery(); } catch(e) { dnet.base.DcExceptions.showMessage(e);}}
	        	})	
		        ,doNew : new Ext.Action({ name:"doNew",iconCls: "icon-action-new", disabled: false
		       		,text: Dnet.translate("tlbitem", "new__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "new__tlp")   			
		   			,scope:dc, handler: dc.doNew
		       	})
		        ,doSave : new Ext.Action({ name:"doSave",iconCls: "icon-action-save", disabled: true
		       		,text: Dnet.translate("tlbitem", "save__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "save__tlp")   			
		   			,scope:dc, handler: dc.doSave
		       	})
		        ,doCopy : new Ext.Action({ name:"doCopy",iconCls: "icon-action-copy", disabled: true
		       		,text: Dnet.translate("tlbitem", "copy__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "copy__tlp")   			
		   			,scope:dc, handler: dc.doCopy
		       	}) 
		        ,doDeleteSelected : new Ext.Action({ name:"deleteSelected",iconCls: "icon-action-delete", disabled: true
		       		,text: Dnet.translate("tlbitem", "delete_selected__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "delete_selected__tlp")   			
		   			,scope:dc, handler: function() { dc.confirmDeleteSelection(); }
		       	})
		        ,doEdit : new Ext.Action({ name:"doEdit",iconCls: "icon-action-edit", disabled: true
		       		,text: Dnet.translate("tlbitem", "edit__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "edit__tlp")   			
		   			,scope:dc, handler: function() {}
		       	})
		        ,doCancel : new Ext.Action({ name:"doCancel",iconCls: "icon-action-rollback", disabled: true
		       		,text: Dnet.translate("tlbitem", "cancel__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "cancel__tlp")   			
		   			,scope:dc, handler: function() {dc.discardChanges();}
		       	})		        
		        ,doPrevRec : new Ext.Action({ name:"doPrevRec",iconCls: "icon-action-previous", disabled: false
		       		,text: Dnet.translate("tlbitem", "prev_rec__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "prev_rec__tlp")   			
		   			,scope:dc, handler: function() { try { dc.setPreviousAsCurrent();  } catch(e) { dnet.base.DcExceptions.showMessage(e); }}
		       	})
		        ,doNextRec : new Ext.Action({ name:"doNextRec",iconCls: "icon-action-next", disabled: false
		       		,text: Dnet.translate("tlbitem", "next_rec__lbl")
		   			,tooltip: Dnet.translate("tlbitem", "next_rec__tlp")   			
		   			,scope:dc, handler: function() { try { dc.setNextAsCurrent();  } catch(e) { dnet.base.DcExceptions.showMessage(e); }}
		       	})
			}		
		}	
	}	
}();