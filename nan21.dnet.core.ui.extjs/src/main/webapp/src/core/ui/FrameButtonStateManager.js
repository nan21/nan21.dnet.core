dnet.base.FrameButtonStateManager = function() {	
	return {		
		register: function(btnName, state, dcName, frame) {		
			if ( state == "record_is_clean") {
				this.record_is_clean(btnName, state, dcName, frame);return;
			} 			
			if ( state == "record_is_dirty") {
				this.record_is_dirty(btnName, state, dcName, frame);return;
			} 
			if ( state == "record_status_is_new") {
				this.record_status_is_new(btnName, state, dcName, frame);return;
			} 
			if ( state == "record_status_is_edit") {
				this.record_status_is_edit(btnName, state, dcName, frame);return;
			} 
			
			if ( state == "selected_zero") {
				this.selected_zero(btnName, state, dcName, frame);return;
			} 
			if ( state == "selected_one") {
				this.selected_one(btnName, state, dcName, frame);return;
			} 
			if ( state == "selected_many") {
				this.selected_many(btnName, state, dcName, frame);return;
			} 
			if ( state == "selected_not_zero") {
				this.selected_not_zero(btnName, state, dcName, frame);return;
			} 
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