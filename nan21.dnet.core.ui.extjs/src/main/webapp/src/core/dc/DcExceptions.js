/**
 * @singleton
 */
Ext.ns("dnet.base");
dnet.base.DcExceptions = function(){

    return {
	     NAVIGATE_BEFORE_FIRST: "I:NAVIGATE_BEFORE_FIRST"
	    ,NAVIGATE_AFTER_LAST: "I:NAVIGATE_AFTER_LAST"

	    ,DCCONTEXT_INVALID_SETUP: "DcContext invalid setup."
	    ,CURRENT_RECORD_DIRTY: "Programmimg error! Error thrown CURRENT_RECORD_DIRTY is deprecated. Use DIRTY_DATA_FOUND instead "
	    ,PARENT_RECORD_NEW : "I:PARENT_RECORD_NEW"

	    //,NO_CURRENT_RECORD_TO_DELETE: "There is no current record selected. Nothing to delete."	
	    //,NO_SELECTED_RECORDS_TO_DELETE: "There are no selected records. Nothing to delete." 	
	    	
	    //,NO_CURRENT_RECORD_TO_EDIT: "Currently there is no record to edit."


	    ,NO_CURRENT_RECORD: "I:NO_CURRENT_RECORD"
	    ,NO_SELECTED_RECORDS: "I:NO_SELECTED_RECORDS"
	    ,DIRTY_DATA_FOUND: "I:DIRTY_DATA_FOUND"

	    ,showError: function(msg) {Ext.Msg.show({msg:msg,buttons:Ext.Msg.OK,scope:this,icon: Ext.MessageBox.ERROR});}
    	,showWarning: function(msg) {Ext.Msg.show({msg:msg,buttons:Ext.Msg.OK,scope:this,icon: Ext.MessageBox.WARNING});}
    	,showInfo: function(msg) {Ext.Msg.show({msg:msg,buttons:Ext.Msg.OK,scope:this,icon: Ext.MessageBox.INFO});}

		,showMessage: function(e) {
			if (Ext.isString(e)) {    //  alert("string: "  + e);
                var t = e.substr(0,1);
				var m = e.substr(2);
				if (!t)  this.showError(m);
				if (t=="I")  this.showInfo(Dnet.translate("exception",m));
				if (t=="E")  this.showError(Dnet.translate("exception",m));
	            if (t=="W")  this.showWarning(Dnet.translate("exception",m));
	            return;
			}
            if (e.message) {  // alert( "object: " + e);
				var m = e.name+": "+e.message + "<br>" + e.fileName + " line " + e.lineNumber;
				this.showError(Dnet.translate("exception",e));
			}

		}
	};
}();