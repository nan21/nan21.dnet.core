dnet.core.ui.FrameButtonStateManager =  {		
		register: function(btnName, state, dcName, frame, options) {	
			this[state](btnName, state, dcName, frame, options);
			return;			 
		}
	
		// record state based 
		,record_is_clean: function(btnName, state, dcName, frame, options) {			
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.getRecord() && !evnt.dc.isCurrentRecordDirty() && andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			theDc.mon(theDc, "statusChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.getRecord() && !evnt.dc.isCurrentRecordDirty() && andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
	
		,record_is_dirty: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;}
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.getRecord() && evnt.dc.isCurrentRecordDirty() && andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			theDc.mon(theDc, "statusChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.getRecord() && evnt.dc.isCurrentRecordDirty() && andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		
		// record status based 	
		,record_status_is_new: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.status=='insert'&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
	
		,record_status_is_edit: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.status=='update'&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		 
		
		// selection based 
		,selected_zero: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 0&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		,selected_one: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "selectionChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		
		
		
		
		
		,selected_one_clean: function(btnName, state, dcName, frame, options) {
			var hasFn = (options.and != undefined && options.and != null); 
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "selectionChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1 && !evnt.dc.isCurrentRecordDirty()&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='clean' && evnt.dc.selectedRecords.length == 1&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			 
		}
		
		,selected_one_dirty: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "selectionChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length == 1 && evnt.dc.isCurrentRecordDirty()&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
			theDc.mon(theDc, "recordChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.state=='dirty' && evnt.dc.selectedRecords.length == 1&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}					
				}				 
			 }, frame );
		}
		
		
		 
		,selected_many: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "selectionChange", function(evnt) {
				var btn = this._getElement_(btnName); 
				if(btn){
					if (evnt.dc.selectedRecords.length > 1&& andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}
				}
			 }, frame );
		}
		,selected_not_zero: function(btnName, state, dcName, frame, options) {
			var andFn = options.and || function(evnt) {return true;};
			var theDc = frame._getDc_(dcName);
			theDc.mon(theDc, "selectionChange", function(evnt) {
				var btn = this._getElement_(btnName); 				
				if(btn){
					if (evnt.dc.selectedRecords.length >0 && andFn(evnt)) {
						btn.enable(); 
					} else {
						btn.disable();
					}
				}			 
			 }, frame );
		}
		
		
		
		

		
		// helper functions 
		
		
		,is_record_is_clean : function(dc) {
			return dc.getRecord() && dc.isCurrentRecordDirty();
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