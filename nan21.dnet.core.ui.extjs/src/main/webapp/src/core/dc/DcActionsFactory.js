Ext.ns("dnet.base");
dnet.base.DcActionsFactory = function() {	
	return {
		
		actionNames : function() {
			return ["Query", "ClearQuery", 
			        "New", "Copy", "Save", "Delete", "Cancel",
			        "EditIn", "EditOut",  
			        "PrevRec", "NextRec", "ReloadRec" ];
		}
	
		/**
		 * Create an object of actions for the given data-control and list of action names.
		 */
		,createActions: function(dc, names) {
			//this.logger.info("dnet.base.DcActionsFactory: Creating DC actions... ");
			var result = {};
			for(var i=0,l=names.length;i<l;i++) {	
				var n = names[i];
				//this.logger.debug("dnet.base.DcActionsFactory: Creating action "+n);
				result["do"+n] = this["create"+n+"Action"](dc);
			}
			return result;			 
		}	
	
		
		,createQueryAction: function(dc) {
			return new Ext.Action({ name:"doQuery",iconCls: "icon-action-fetch", disabled: false
        		,text: Dnet.translate("tlbitem", "load__lbl"), tooltip: Dnet.translate("tlbitem", "load__tlp")    			
    			,scope:dc, handler: function() { try { dc.doQuery(); } catch(e) { dnet.base.DcExceptions.showMessage(e);}}
        	});	
		}
		
		
		,createClearQueryAction: function(dc) {
			return new Ext.Action({ name:"doClearQuery",iconCls: "icon-action-fetch", disabled: false
        		,text: Dnet.translate("tlbitem", "clearquery__lbl"), tooltip: Dnet.translate("tlbitem", "clearquery__tlp")    			
    			,scope:dc, handler: function() { try { dc.doClearQuery(); } catch(e) { dnet.base.DcExceptions.showMessage(e);}}
        	});	
		}
		
		
		,createNewAction: function(dc) {
			return new Ext.Action({ name:"doNew",iconCls: "icon-action-new", disabled: false
	       		,text: Dnet.translate("tlbitem", "new__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "new__tlp")   			
	   			,scope:dc, handler: dc.doNew
	       	});
		}
		
		
		,createCopyAction: function(dc) {
			return new Ext.Action({ name:"doCopy",iconCls: "icon-action-copy", disabled: true
	       		,text: Dnet.translate("tlbitem", "copy__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "copy__tlp")   			
	   			,scope:dc, handler: dc.doCopy
	       	}); 
		}
		
		
		,createSaveAction: function(dc) {
			return new Ext.Action({ name:"doSave",iconCls: "icon-action-save", disabled: true
	       		,text: Dnet.translate("tlbitem", "save__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "save__tlp")   			
	   			,scope:dc, handler: dc.doSave
	       	});
		}
		
		
		,createDeleteAction: function(dc) {
			return new Ext.Action({ name:"deleteSelected",iconCls: "icon-action-delete", disabled: true
	       		,text: Dnet.translate("tlbitem", "delete_selected__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "delete_selected__tlp")   			
	   			,scope:dc, handler: function() { dc.doDelete(); }
	       	});
		}
		
		
		,createCancelAction: function(dc) {
			return new Ext.Action({ name:"doCancel",iconCls: "icon-action-rollback", disabled: true
	       		,text: Dnet.translate("tlbitem", "cancel__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "cancel__tlp")   			
	   			,scope:dc, handler: function() {dc.doCancel();}
	       	});	     
		}
		
		
		,createEditInAction: function(dc) {
			return new Ext.Action({ name:"doEdit",iconCls: "icon-action-edit", disabled: true
	       		,text: Dnet.translate("tlbitem", "edit__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "edit__tlp")   			
	   			,scope:dc, handler: function() {}
	       	});
		}
		
		
		,createEditOutAction: function(dc) {
			return new Ext.Action({ name:"doLeaveEditor",iconCls: "icon-action-back", disabled: false
	       		,text: Dnet.translate("tlbitem", "back__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "back__tlp")   			
	   			,scope:dc, handler: function() {}
	       	});
		}
		
		 
		,createPrevRecAction: function(dc) {
			return new Ext.Action({ name:"doPrevRec",iconCls: "icon-action-previous", disabled: false
	       		,text: Dnet.translate("tlbitem", "prev_rec__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "prev_rec__tlp")   			
	   			,scope:dc, handler: function() { try { dc.setPreviousAsCurrent();  } catch(e) { dnet.base.DcExceptions.showMessage(e); }}
	       	});
		}
		
		
		,createNextRecAction: function(dc) {
			return new Ext.Action({ name:"doNextRec",iconCls: "icon-action-next", disabled: false
	       		,text: Dnet.translate("tlbitem", "next_rec__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "next_rec__tlp")   			
	   			,scope:dc, handler: function() { try { dc.setNextAsCurrent();  } catch(e) { dnet.base.DcExceptions.showMessage(e); }}
	       	});
		}
		 
		
		,createReloadRecAction: function(dc) {
			return new Ext.Action({ name:"doReloadRec",iconCls: "icon-action-refresh", disabled: false
	       		,text: Dnet.translate("tlbitem", "reload_rec__lbl")
	   			,tooltip: Dnet.translate("tlbitem", "reload_rec__tlp")   			
	   			,scope:dc, handler: function() { try { dc.reloadCurrentRecord();  } catch(e) { dnet.base.DcExceptions.showMessage(e); }}
	       	});
		}
		
		,logger: dnet.base.Logger
	};	
}();