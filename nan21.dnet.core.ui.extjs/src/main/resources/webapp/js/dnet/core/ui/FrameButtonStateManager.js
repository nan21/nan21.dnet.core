dnet.core.ui.FrameButtonStateManager =  {		
		register: function(btnName, state, dcName, frame, options) {	
			this[state](btnName, state, dcName, frame, options);
			return;			 
		}
	
		// record state based 
		,record_is_clean: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "statusChange" );
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
			this.registerForDcStoreEvent(btnName, frame, theDc, "update" ); 
		}
	
		,record_is_dirty: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "statusChange" );
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
			this.registerForDcStoreEvent(btnName, frame, theDc, "update" ); 
		}
		
		// record status based 	
		,record_status_is_new: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
		}
	
		,record_status_is_edit: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
		}
		 
		
		// selection based 
		,selected_zero: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" );
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
		}
		
		,selected_one: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" );
		}
		
 		
		,selected_one_clean: function(btnName, state, dcName, frame, options) { 
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" );
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
			this.registerForDcStoreEvent(btnName, frame, theDc, "update" );
		}
		
		,selected_one_dirty: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" );
			this.registerForDcEvent(btnName, frame, theDc, "recordChange" );
			this.registerForDcStoreEvent(btnName, frame, theDc, "update" );
			 
		}
		
		
		 
		,selected_many: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" );			 
		}
		
		
		
		,selected_not_zero: function(btnName, state, dcName, frame, options) {
			var theDc = frame._getDc_(dcName);			
			this.registerForDcEvent(btnName, frame, theDc, "selectionChange" ); 
		}
		
		
		
		 
		,registerForDcEvent: function(btnName, frame, dc, eventName) {
			dc.mon(dc, eventName, function(evnt) {
				this._applyStateButton_(btnName);
			 }, frame, { buffer:200 } );
		}
		
		,registerForDcStoreEvent: function(btnName, frame, dc, eventName) {			 
			dc.mon(dc.store, eventName, function(evnt) {
				this._applyStateButton_(btnName);
			 }, frame, { buffer:200 } );
		}
		
		// helper functions 
		
		
		,is_record_is_clean : function(dc) {
			return dc.getRecord() && !dc.isCurrentRecordDirty();
		}
		,is_record_is_dirty : function(dc) {
			return dc.getRecord() && dc.isCurrentRecordDirty() ;
		}
		
		,is_record_status_is_new : function(dc) {
			return dc.getRecordStatus()=='insert'
		}
		,is_record_status_is_edit : function(dc) {
			return dc.getRecordStatus()=='update'
		}
		
		,is_selected_zero : function(dc) {
			return dc.selectedRecords.length == 0;
		}
		
		,is_selected_one : function(dc) {
			return dc.selectedRecords.length == 1;
		}
		
		,is_selected_one_clean : function(dc) {
			return dc.selectedRecords.length >0;
		}
		
		,is_selected_one_dirty : function(dc) {
			return dc.selectedRecords.length >0;
		}		
		
		,is_selected_one_clean : function(dc) {
			return dc.selectedRecords.length == 1 && !dc.isCurrentRecordDirty();
		}
		
		,is_selected_one_dirty : function(dc) {
			return dc.selectedRecords.length == 1 && dc.isCurrentRecordDirty();
		}
				
		,is_selected_many : function(dc) {
			return dc.selectedRecords.length > 1;
		}
		
		,is_selected_not_zero : function(dc) {
			return dc.selectedRecords.length >0;
		}
		
	};