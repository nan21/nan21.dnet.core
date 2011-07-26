dnet.base.FrameButtonStateManager = function() {	
	return {		
		register: function(btnName, state, dcName, frame) {	
			this[state](btnName, state, dcName, frame);
			return;			 
		}
	
		// record state based 
		,record_is_clean: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='clean') {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
	
		,record_is_dirty: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='dirty') {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
	
		// record status based 	
		,record_status_is_new: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.status=='insert') {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
	
		,record_status_is_edit: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.status=='update') {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		
		
		// selection based 
		,selected_zero: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 0) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		,selected_one: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		,selected_one_clean: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1 && !evnt.dc.isCurrentRecordDirty()) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='clean' && evnt.dc.selectedRecords.length == 1) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		,selected_one_dirty: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1 && evnt.dc.isCurrentRecordDirty()) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			frame._getDc_(dcName).on("recordChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='dirty' && evnt.dc.selectedRecords.length == 1) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		,selected_many: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length > 1) {
						btn.enable(); 
					} else {
						btn.disable();
					}
				}
			 }, frame );
		}
		,selected_not_zero: function(btnName, state, dcName, frame) {
			frame._getDc_(dcName).on("selectionChanged", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length >0) {
						btn.enable(); 
					} else {
						btn.disable();
					}
				}			 
			 }, frame );
		}
	}
}();