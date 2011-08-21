dnet.base.DcActionsStateManager = function() {	
return {		
	applyStatesOnRecordChange: function(evnt) {
		var dc = evnt.dc;
		if (evnt.state == "dirty") {
			dnet.base.DcActionsStateManager._onDirtyRecord(evnt);
		} else {
			if (evnt.state == "clean") {
				dnet.base.DcActionsStateManager._onCleanRecord(evnt);
			} else { /* record is null */
				dnet.base.DcActionsStateManager._disableAll(dc);
				dc.actions.doQuery.setDisabled(false);
				dc.actions.doNew.setDisabled(false);
				return;
			}
		}
		 
		if(evnt.status=="insert") {
			var l = dc.children.length;		 
			for(var i=0; i< l; i++) {
				dnet.base.DcActionsStateManager._disableAll(dc.children[i]);
			} 
		}
		if (dc.getRecord() ) {
			dc.actions.doEdit.setDisabled(false);
		} else {
			dc.actions.doEdit.setDisabled(true);
		}
		if (dc.getSelectedRecords().length > 0)  {
			dc.actions.doDeleteSelected.setDisabled(false);
		} else {
			dc.actions.doDeleteSelected.setDisabled(true);
		}
	} 

 	,applyStatesOnDataContextChanged: function(evnt) {
 		var dc = evnt.dc, ctx=evnt.ctx;
 		dnet.base.DcActionsStateManager._disableAll(dc); 		 
		if (ctx.parentDc.getRecord() && !ctx.parentDc.getRecord().phantom) { 			   		           
			dc.actions.doQuery.setDisabled(false);
			dc.actions.doNew.setDisabled(false);
		}
	} 
 	
 	,onCleanDc: function(evnt) {
 		var dc = evnt.dc;
 		dc.actions.doQuery.setDisabled(false);
		dc.actions.doCancel.setDisabled(true);
		dc.actions.doSave.setDisabled(true);		
		dc.actions.doNew.setDisabled(false);
		if (dc.isRecordChangeAllowed() && dc.store.getCount() > 0) {
			dc.actions.doPrevRec.setDisabled(false);
			dc.actions.doNextRec.setDisabled(false);
		} else {
			dc.actions.doPrevRec.setDisabled(true);
			dc.actions.doNextRec.setDisabled(true);			
		}
		if (dc.isRecordChangeAllowed() ) {
			dc.actions.doLeaveEditor.setDisabled(false);
		} else {
			dc.actions.doLeaveEditor.setDisabled(true);	
		}
		
		if(dc.getRecord()) {
			dc.actions.doCopy.setDisabled(false);
			dc.actions.doEdit.setDisabled(false);
		} else {
			dc.actions.doCopy.setDisabled(true);
			dc.actions.doEdit.setDisabled(true);
		}
		if (dc.getSelectedRecords().length > 0)  {
			dc.actions.doDeleteSelected.setDisabled(false);
		} else {
			dc.actions.doDeleteSelected.setDisabled(true);
		}	
		
 	}
/*doQuery
doNew
,doSave
,doCopy
,doCancel 
,doPrevRec
,doNextRec
doEdit
doLeaveEditor
,doDeleteSelected*/
 
	// private 
 	,_disableAll: function(dc) {
 		dc.actions.doQuery.setDisabled(true);
		dc.actions.doCancel.setDisabled(true);
		dc.actions.doSave.setDisabled(true);
		dc.actions.doNew.setDisabled(true);
		dc.actions.doEdit.setDisabled(true);
		dc.actions.doCopy.setDisabled(true);
		dc.actions.doPrevRec.setDisabled(true);
		dc.actions.doNextRec.setDisabled(true);
		dc.actions.doDeleteSelected.setDisabled(true);  
		dc.actions.doLeaveEditor.setDisabled(true);
 	}
	,_onDirtyRecord:  function(evnt) {
		var dc = evnt.dc;
		dc.actions.doQuery.setDisabled(true);
		dc.actions.doCancel.setDisabled(false);
		dc.actions.doSave.setDisabled(false);
		dc.actions.doCopy.setDisabled(true);	
		if( dc.isRecordChangeAllowed()) {
			dc.actions.doNew.setDisabled(false);
			dc.actions.doCopy.setDisabled(false);
			dc.actions.doPrevRec.setDisabled(false);
			dc.actions.doNextRec.setDisabled(false);
			dc.actions.doLeaveEditor.setDisabled(false);
		} else {
			dc.actions.doNew.setDisabled(true);
			dc.actions.doCopy.setDisabled(true);
			dc.actions.doPrevRec.setDisabled(true);
			dc.actions.doNextRec.setDisabled(true);
			dc.actions.doLeaveEditor.setDisabled(true);			
		}
		/*if (dc.multiEdit) {
			dc.actions.doNew.setDisabled(false);
			dc.actions.doPrevRec.setDisabled(false);
			dc.actions.doNextRec.setDisabled(false);	
			dc.actions.doLeaveEditor.setDisabled(false);
		} else {
			if(!dc.isRecordChangeAllowed()) {
				dc.actions.doNew.setDisabled(true);
				dc.actions.doPrevRec.setDisabled(true);
				dc.actions.doNextRec.setDisabled(true);
				dc.actions.doLeaveEditor.setDisabled(true);
			}
		}	*/
	}
	,_onCleanRecord:  function(evnt) {
		var dc = evnt.dc;
		if( dc.isRecordChangeAllowed()) {
			dc.actions.doNew.setDisabled(false);
			dc.actions.doCopy.setDisabled(false);
			dc.actions.doPrevRec.setDisabled(false);
			dc.actions.doNextRec.setDisabled(false);
			dc.actions.doLeaveEditor.setDisabled(false);
		} else {
			dc.actions.doNew.setDisabled(true);
			dc.actions.doCopy.setDisabled(true);
			dc.actions.doPrevRec.setDisabled(true);
			dc.actions.doNextRec.setDisabled(true);
			dc.actions.doLeaveEditor.setDisabled(true);			
		}
		if (dc.isDirty()) {			 
			dc.actions.doQuery.setDisabled(true);
			dc.actions.doCancel.setDisabled(false);
		} else {
			dc.actions.doQuery.setDisabled(false);
			dc.actions.doCancel.setDisabled(true);
		}
		if (dc.isStoreDirty()) {
			dc.actions.doSave.setDisabled(false);
		} else {
			dc.actions.doSave.setDisabled(true);
		} 
	}
	
	
}	
}();