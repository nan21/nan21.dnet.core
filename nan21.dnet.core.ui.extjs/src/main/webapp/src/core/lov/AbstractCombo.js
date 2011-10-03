 
Ext.define('dnet.base.AbstractRemoteCombo', {
    extend:'Ext.form.field.Picker',
    requires: ['Ext.util.DelayedTask', 
               'Ext.EventObject', 
               'Ext.view.BoundList', 
               'Ext.view.BoundListKeyNav', 
               'Ext.data.StoreManager'],
    alternateClassName: 'Ext.form.ComboBox',
    alias: ['widget.remotecombo' ],
 
    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',
   // multiSelect: false,
 
    delimiter: ', ',

    
    displayField: 'text',

    
    triggerAction: 'all',
 
    allQuery: '',

   
    queryParam: 'query',

    
    queryMode: 'remote',

    queryCaching: true,

   
    pageSize: 0,

    
    autoSelect: true,
 
    typeAhead: false,
 
    typeAheadDelay: 250,

   
    selectOnTab: true,

   
    forceSelection: false,

    defaultListConfig: {
        emptyText: '',
        loadingText: 'Loading...',
        loadingHeight: 70,
        minWidth: 70,
        maxHeight: 300,
        shadow: 'sides'
    },
 

    //private
    ignoreSelection: 0,

    initComponent: function() {
        var me = this,
            isDefined = Ext.isDefined,
            store = me.store,
            transform = me.transform,
            transformSelect, isLocalMode;

        //<debug>
        if (!store && !transform) {
            Ext.Error.raise('Either a valid store, or a HTML select to transform, must be configured on the combo.');
        }
//        if (me.typeAhead && me.multiSelect) {
//            Ext.Error.raise('typeAhead and multiSelect are mutually exclusive options -- please remove one of them.');
//        }
        if (me.typeAhead && !me.editable) {
            Ext.Error.raise('If typeAhead is enabled the combo must be editable: true -- please change one of those settings.');
        }
        if (me.selectOnFocus && !me.editable) {
            Ext.Error.raise('If selectOnFocus is enabled the combo must be editable: true -- please change one of those settings.');
        }
        //</debug>

        this.addEvents(
            // TODO need beforeselect?
 
            'beforequery',
 
            'select'
        );

        // Build store from 'transform' HTML select element's options
        if (!store && transform) {
            transformSelect = Ext.getDom(transform);
            if (transformSelect) {
                store = Ext.Array.map(Ext.Array.from(transformSelect.options), function(option) {
                    return [option.value, option.text];
                });
                if (!me.name) {
                    me.name = transformSelect.name;
                }
                if (!('value' in me)) {
                    me.value = transformSelect.value;
                }
            }
        }

        me.bindStore(store, true);
        store = me.store;
        if (store.autoCreated) {
            me.queryMode = 'local';
            me.valueField = me.displayField = 'field1';
            if (!store.expanded) {
                me.displayField = 'field2';
            }
        }


        if (!isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        isLocalMode = me.queryMode === 'local';
        if (!isDefined(me.queryDelay)) {
            me.queryDelay = isLocalMode ? 10 : 500;
        }
        if (!isDefined(me.minChars)) {
            me.minChars = isLocalMode ? 0 : 4;
        }

        if (!me.displayTpl) {
            me.displayTpl = Ext.create('Ext.XTemplate',
                '<tpl for=".">' +
                    '{[typeof values === "string" ? values : values.' + me.displayField + ']}' +
                    '<tpl if="xindex < xcount">' + me.delimiter + '</tpl>' +
                '</tpl>'
            );
        } else if (Ext.isString(me.displayTpl)) {
            me.displayTpl = Ext.create('Ext.XTemplate', me.displayTpl);
        }

        me.callParent();

        me.doQueryTask = Ext.create('Ext.util.DelayedTask', me.doRawQuery, me);

        // store has already been loaded, setValue
        if (me.store.getCount() > 0) {
            me.setValue(me.value);
        }

        // render in place of 'transform' select
        if (transformSelect) {
            me.render(transformSelect.parentNode, transformSelect);
            Ext.removeNode(transformSelect);
            delete me.renderTo;
        }
    },

    beforeBlur: function() {
        var me = this;
        me.doQueryTask.cancel();
        if (me.forceSelection) {
            me.assertValue();
        } else {
            me.collapse();
        }
    },

    // private
    assertValue: function() {
        var me = this,
            value = me.getRawValue(),
            rec;

//        if (me.multiSelect) {
//            // For multiselect, check that the current displayed value matches the current
//            // selection, if it does not then revert to the most recent selection.
//            if (value !== me.getDisplayValue()) {
//                me.setValue(me.lastSelection);
//            }
//        } else {
            // For single-select, match the displayed value to a record and select it,
            // if it does not match a record then revert to the most recent selection.
            rec = me.findRecordByDisplay(value);
            if (rec) {
                me.select(rec);
            } else {
                me.setValue(me.lastSelection);
            }
        //}
        me.collapse();
    },

    onTypeAhead: function() {
        var me = this,
            displayField = me.displayField,
            record = me.store.findRecord(displayField, me.getRawValue()),
            boundList = me.getPicker(),
            newValue, len, selStart;

        if (record) {
            newValue = record.get(displayField);
            len = newValue.length;
            selStart = me.getRawValue().length;

            boundList.highlightItem(boundList.getNode(record));

            if (selStart !== 0 && selStart !== len) {
                me.setRawValue(newValue);
                me.selectText(selStart, newValue.length);
            }
        }
    },

    // invoked when a different store is bound to this combo
    // than the original
    resetToDefault: function() {

    },

    bindStore: function(store, initial) {
        var me = this,
            oldStore = me.store;

        // this code directly accesses this.picker, bc invoking getPicker
        // would create it when we may be preping to destroy it
        if (oldStore && !initial) {
            if (oldStore !== store && oldStore.autoDestroy) {
                oldStore.destroy();
            } else {
                oldStore.un({
                    scope: me,
                    load: me.onLoad,
                    exception: me.collapse
                });
            }
            if (!store) {
                me.store = null;
                if (me.picker) {
                    me.picker.bindStore(null);
                }
            }
        }
        if (store) {
            if (!initial) {
                me.resetToDefault();
            }

            me.store = Ext.data.StoreManager.lookup(store);
            me.store.on({
                scope: me,
                load: me.onLoad,
                exception: me.collapse
            });

            if (me.picker) {
                me.picker.bindStore(store);
            }
        }
    },

    onLoad: function() {
        var me = this,
            value = me.value;

        me.syncSelection();
        if (me.picker && !me.picker.getSelectionModel().hasSelection()) {
            me.doAutoSelect();
        }
    },

    /**
     * @private
     * Execute the query with the raw contents within the textfield.
     */
    doRawQuery: function() {
        this.doQuery(this.getRawValue());
    },

    /**
     * Executes a query to filter the dropdown list. Fires the {@link #beforequery} event prior to performing the
     * query allowing the query action to be canceled if needed.
     * @param {String} queryString The SQL query to execute
     * @param {Boolean} forceAll <code>true</code> to force the query to execute even if there are currently fewer
     * characters in the field than the minimum specified by the <code>{@link #minChars}</code> config option.  It
     * also clears any filter previously saved in the current store (defaults to <code>false</code>)
     * @return {Boolean} true if the query was permitted to run, false if it was cancelled by a {@link #beforequery} handler.
     */
    doQuery: function(queryString, forceAll) {
        queryString = queryString || '';

        // store in object and pass by reference in 'beforequery'
        // so that client code can modify values.
        var me = this,
            qe = {
                query: queryString,
                forceAll: forceAll,
                combo: me,
                cancel: false
            },
            store = me.store,
            isLocalMode = me.queryMode === 'local';

        if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
            return false;
        }

        // get back out possibly modified values
        queryString = qe.query;
        forceAll = qe.forceAll;

        // query permitted to run
        if (forceAll || (queryString.length >= me.minChars)) {
            // expand before starting query so LoadMask can position itself correctly
            me.expand();

            // make sure they aren't querying the same thing
            if (!me.queryCaching || me.lastQuery !== queryString) {
                me.lastQuery = queryString;

                if (isLocalMode) {
                    // forceAll means no filtering - show whole dataset.
                    if (forceAll) {
                        store.clearFilter();
                    } else {
                        // Clear filter, but supress event so that the BoundList is not immediately updated.
                        store.clearFilter(true);
                        store.filter(me.displayField, queryString);
                    }
                } else {
                    // In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
                    // and these are automatically passed as params with every load call, so we do *not* call clearFilter.
                    store.load({
                        params: me.getParams(queryString)
                    });
                }
            }

            // Clear current selection if it does not match the current value in the field
            if (me.getRawValue() !== me.getDisplayValue()) {
                me.ignoreSelection++;
                me.picker.getSelectionModel().deselectAll();
                me.ignoreSelection--;
            }

            if (isLocalMode) {
                me.doAutoSelect();
            }
            if (me.typeAhead) {
                me.doTypeAhead();
            }
        }
        return true;
    },

    // private
    getParams: function(queryString) {
        var p = {},
            pageSize = this.pageSize,
            param = this.queryParam;

        if (param) {
            p[param] = queryString;
        }

        if (pageSize) {
            p.start = 0;
            p.limit = pageSize;
        }
        return p;
    },

    /**
     * @private
     * If the autoSelect config is true, and the picker is open, highlights the first item.
     */
    doAutoSelect: function() {
        var me = this,
            picker = me.picker,
            lastSelected, itemNode;
        if (picker && me.autoSelect && me.store.getCount() > 0) {
            // Highlight the last selected item and scroll it into view
            lastSelected = picker.getSelectionModel().lastSelected;
            itemNode = picker.getNode(lastSelected || 0);
            if (itemNode) {
                picker.highlightItem(itemNode);
                picker.listEl.scrollChildIntoView(itemNode, false);
            }
        }
    },

    doTypeAhead: function() {
        if (!this.typeAheadTask) {
            this.typeAheadTask = Ext.create('Ext.util.DelayedTask', this.onTypeAhead, this);
        }
        if (this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE) {
            this.typeAheadTask.delay(this.typeAheadDelay);
        }
    },

    onTriggerClick: function() {
        var me = this;
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                me.onFocus({});
                if (me.triggerAction === 'all') {
                    me.doQuery(me.allQuery, true);
                } else {
                    me.doQuery(me.getRawValue());
                }
            }
            me.inputEl.focus();
        }
    },


    // store the last key and doQuery if relevant
    onKeyUp: function(e, t) {
        var me = this,
            key = e.getKey();

        if (!me.readOnly && !me.disabled && me.editable) {
            me.lastKey = key;
            // we put this in a task so that we can cancel it if a user is
            // in and out before the queryDelay elapses

            // perform query w/ any normal key or backspace or delete
            if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
                me.doQueryTask.delay(me.queryDelay);
            }
        }

        if (me.enableKeyEvents) {
            me.callParent(arguments);
        }
    },

    initEvents: function() {
        var me = this;
        me.callParent();

        /*
         * Setup keyboard handling. If enableKeyEvents is true, we already have
         * a listener on the inputEl for keyup, so don't create a second.
         */
        if (!me.enableKeyEvents) {
            me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
        }
    },

    createPicker: function() {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply({
                selModel: {
                   // mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                    mode:  'SINGLE'	
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize,
                tpl: me.tpl
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.create('Ext.view.BoundList', opts);

        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), 'selectionchange', me.onListSelectionChange, me);

        return picker;
    },

    onListRefresh: function() {
        this.alignPicker();
        this.syncSelection();
    },

    onItemClick: function(picker, record){
        /*
         * If we're doing single selection, the selection change events won't fire when
         * clicking on the selected element. Detect it here.
         */
        var me = this,
            lastSelection = me.lastSelection,
            valueField = me.valueField,
            selected;

        //if (!me.multiSelect && lastSelection) {
        if ( lastSelection) {
            selected = lastSelection[0];
            if (selected && (record.get(valueField) === selected.get(valueField))) {
                me.collapse();
            }
        }
    },

    onListSelectionChange: function(list, selectedRecords) {
        var me = this,
            //isMulti = me.multiSelect,
            hasRecords = selectedRecords.length > 0;
        // Only react to selection if it is not called from setValue, and if our list is
        // expanded (ignores changes to the selection model triggered elsewhere)
        if (!me.ignoreSelection && me.isExpanded) {
             
                Ext.defer(me.collapse, 1, me);
            
            /*
             * Only set the value here if we're in multi selection mode or we have
             * a selection. Otherwise setValue will be called with an empty value
             * which will cause the change event to fire twice.
             */
//            if (isMulti || hasRecords) {
//                me.setValue(selectedRecords, false);
//            }
//            if (hasRecords) {
//                me.fireEvent('select', me, selectedRecords);
//            }
            if (hasRecords) {
                me.setValue(selectedRecords, false);
                this._mapReturnFields_(selectedRecords[0]);
                me.fireEvent('select', me, selectedRecords);
            }
             
            me.inputEl.focus();
        }
    },

    /**
     * @private
     * Enables the key nav for the BoundList when it is expanded.
     */
    onExpand: function() {
        var me = this,
            keyNav = me.listKeyNav,
            selectOnTab = me.selectOnTab,
            picker = me.getPicker();

        // Handle BoundList navigation from the input field. Insert a tab listener specially to enable selectOnTab.
        if (keyNav) {
            keyNav.enable();
        } else {
            keyNav = me.listKeyNav = Ext.create('Ext.view.BoundListKeyNav', this.inputEl, {
                boundList: picker,
                forceKeyDown: true,
                tab: function(e) {
                    if (selectOnTab) {
                        this.selectHighlighted(e);
                        me.triggerBlur();
                    }
                    // Tab key event is allowed to propagate to field
                    return true;
                }
            });
        }

        // While list is expanded, stop tab monitoring from Ext.form.field.Trigger so it doesn't short-circuit selectOnTab
        if (selectOnTab) {
            me.ignoreMonitorTab = true;
        }

        Ext.defer(keyNav.enable, 1, keyNav); //wait a bit so it doesn't react to the down arrow opening the picker
        me.inputEl.focus();
    },

    /**
     * @private
     * Disables the key nav for the BoundList when it is collapsed.
     */
    onCollapse: function() {
        var me = this,
            keyNav = me.listKeyNav;
        if (keyNav) {
            keyNav.disable();
            me.ignoreMonitorTab = false;
        }
    },

    /**
     * Selects an item by a {@link Ext.data.Model Model}, or by a key value.
     * @param r
     */
    select: function(r) {
        this.setValue(r, true);
    },

    /**
     * Find the record by searching for a specific field/value combination
     * Returns an Ext.data.Record or false
     * @private
     */
    findRecord: function(field, value) {
        var ds = this.store,
            idx = ds.findExact(field, value);
        return idx !== -1 ? ds.getAt(idx) : false;
    },
    findRecordByValue: function(value) {
        return this.findRecord(this.valueField, value);
    },
    findRecordByDisplay: function(value) {
        return this.findRecord(this.displayField, value);
    },

    /**
     * Sets the specified value(s) into the field. For each value, if a record is found in the {@link #store} that
     * matches based on the {@link #valueField}, then that record's {@link #displayField} will be displayed in the
     * field.  If no match is found, and the {@link #valueNotFoundText} config option is defined, then that will be
     * displayed as the default field text. Otherwise a blank value will be shown, although the value will still be set.
     * @param {String|Array} value The value(s) to be set. Can be either a single String or {@link Ext.data.Model},
     * or an Array of Strings or Models.
     * @return {Ext.form.field.Field} this
     */
    setValue: function(value, doSelect) {
        var me = this,
            valueNotFoundText = me.valueNotFoundText,
            inputEl = me.inputEl,
            i, len, record,
            models = [],
            displayTplData = [],
            processedValue = [];

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            me.value = value;
            return me;
        }

        // This method processes multi-values, so ensure value is an array.
        value = Ext.Array.from(value);

        // Loop through values
        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                record = me.findRecordByValue(record);
            }
            // record found, select it.
            if (record) {
                models.push(record);
                displayTplData.push(record.data);
                processedValue.push(record.get(me.valueField));
            }
            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            else {
                // if valueNotFoundText is defined, display it, otherwise display nothing for this value
                if (me.isExpanded) {
                	if (Ext.isDefined(valueNotFoundText)) {
                        displayTplData.push(valueNotFoundText);
                    }
                } else {
                	displayTplData.push(value[i]);
                }
            	
                processedValue.push(value[i]);
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array.
        //me.value = me.multiSelect ? processedValue : processedValue[0];
        me.value =  processedValue[0];
        if (!Ext.isDefined(me.value)) {
            me.value = null;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method
        me.lastSelection = me.valueModels = models;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
        }

        // Calculate raw value from the collection of Model data
        me.setRawValue(me.getDisplayValue());
        me.checkChange();

        if (doSelect !== false) {
            me.syncSelection();
        }
        me.applyEmptyText();

        return me;
    },

    /**
     * @private Generate the string value to be displayed in the text field for the currently stored value
     */
    getDisplayValue: function() {
        return this.displayTpl.apply(this.displayTplData);
    },

    getValue: function() {
        // If the user has not changed the raw field value since a value was selected from the list,
        // then return the structured value from the selection. If the raw field value is different
        // than what would be displayed due to selection, return that raw value.
        var me = this,
            picker = me.picker,
            rawValue = me.getRawValue(), //current value of text field
            value = me.value; //stored value from last selection or setValue() call

        if (me.getDisplayValue() !== rawValue) {
            value = rawValue;
            me.value = me.displayTplData = me.valueModels = null;
            if (picker) {
                me.ignoreSelection++;
                picker.getSelectionModel().deselectAll();
                me.ignoreSelection--;
            }
        }

        return value;
    },

    getSubmitValue: function() {
        return this.getValue();
    },

    isEqual: function(v1, v2) {
        var fromArray = Ext.Array.from,
            i, len;

        v1 = fromArray(v1);
        v2 = fromArray(v2);
        len = v1.length;

        if (len !== v2.length) {
            return false;
        }

        for(i = 0; i < len; i++) {
            if (v2[i] !== v1[i]) {
                return false;
            }
        }

        return true;
    },

    /**
     * Clears any value currently set in the ComboBox.
     */
    clearValue: function() {
        this.setValue([]);
    },

    /**
     * @private Synchronizes the selection in the picker to match the current value of the combobox.
     */
    syncSelection: function() {
        var me = this,
            ExtArray = Ext.Array,
            picker = me.picker,
            selection, selModel;
        if (picker) {
            // From the value, find the Models that are in the store's current data
            selection = [];
            ExtArray.forEach(me.valueModels || [], function(value) {
                if (value && value.isModel && me.store.indexOf(value) >= 0) {
                    selection.push(value);
                }
            });

            // Update the selection to match
            me.ignoreSelection++;
            selModel = picker.getSelectionModel();
            selModel.deselectAll();
            if (selection.length) {
                selModel.select(selection);
            }
            me.ignoreSelection--;
        }
    }
});

Ext.define("dnet.base.AbstractCombo", {
	extend:  "dnet.base.AbstractRemoteCombo" ,
 	alias: "widget.xcombo",
 
 // DNet properties
 	
 	/**
	 * Example: ,filterFieldMapping: [{lovField:"...lovFieldName", dsField:
	 * "...dsFieldName"} ]
	 * 
	 * Or: ,filterFieldMapping: [{lovField:"...lovFieldName", value:
	 * "...static value"} ]
	 */
 	filterFieldMapping: null , 
	_dataProviderFields_  :null,
	_dataProviderName_ : null,
	_dummyValue_ : null,
	_editDialog_: null	 ,
	openDialog:null,
	retFieldMapping : null,	
	triggerAction :"query",
	matchFieldWidth : false,
	recordModel : null,
	pageSize : 20,
	autoSelect:true,
	minChars:0,	
	queryMode: "remote",
	  
	trigger1Cls: Ext.baseCSSPrefix + 'x-form-trigger',    
    trigger2Cls:  Ext.baseCSSPrefix + 'form-search-trigger',
     
	defaultListConfig: {
		emptyText: "", loadingText: "Loading...", 
		minWidth: 70, 
		width:200,  resizable:true,
		shadow: "sides", autoScroll:true
	},
	 
	autoScroll:true,
	
	initComponent : function(){		 	
		this._createStore_(); 
		if (this.retFieldMapping == null) {
			this.retFieldMapping = [];
		}
		//TODO: handle if it is binded to a parameter
		this.retFieldMapping[this.retFieldMapping.length] = {
				lovField:this.displayField,
				dsField: this.dataIndex
		};		
	    this.callParent(arguments);	
	},	 
	
	onTrigger2Click : function(){
		getApplication().showFrame(this._editDialog_.name,  {
			url: Dnet.buildUiPath(this._editDialog_.bundle, this._editDialog_.name, this._editDialog_.custom ), 
			tocElement:this._editDialog_.tocElement} );		 
    },
	 
	_createStore_: function() {
		this.store = Ext.create("Ext.data.Store", {
			model : this.recordModel,
			remoteSort : true,
			remoteSort : true,
	
			autoLoad : false,
			autoSync : false,
			clearOnPageLoad : true,
			pageSize : this.pageSize,
			proxy : {
				type : 'ajax',
				api : Dnet.dsAPI(this._dataProviderName_, "json"),
				actionMethods : {
					create : 'POST',
					read : 'POST',
					update : 'POST',
					destroy : 'POST'
				},
				reader : {
					type : 'json',
					root : 'data',
					idProperty : 'id',
					totalProperty : 'totalCount',
					messageProperty : 'message'
				},
				listeners : {
					"exception" : {
						fn : this.proxyException,
						scope : this
					}
				},
				startParam : Dnet.requestParam.START,
				limitParam : Dnet.requestParam.SIZE,
				sortParam : Dnet.requestParam.SORT,
				directionParam : Dnet.requestParam.SENSE
			}
		});
	 },
 
	 
 
    _mapReturnFields_: function(crec) {   
		if (this.inEditor) {
           var mrec = this._targetRecord_;
           this._mapReturnFieldsExecute_(crec,mrec);
		} else {
			var dcv = this._dcView_, mrec = null;
			if (dcv._dcViewType_ == "edit-form") {
	           mrec = dcv._controller_.getRecord();
			}
	        if (dcv._dcViewType_ == "filter-form") {
	           mrec = dcv._controller_.getFilter();
			}
           this._mapReturnFieldsExecute_(crec, mrec, dcv._controller_.getParams());
		}
    },
    
    
    /**
     * Params: crec: combo selected record
     */
    _mapReturnFieldsExecute_: function(crec, mrec, prec) {    
		if (!mrec) {return; }
        if (this.retFieldMapping != null) {
				var nv,ov, isParam;
                   for(var i=0, len=this.retFieldMapping.length; i<len; i++ ) {
				   	   isParam  =  !Ext.isEmpty(this.retFieldMapping[i]["dsParam"]);
				     	ov = (isParam) ?
   	 		   			   prec.get( this.retFieldMapping[i]["dsParam"] ):
						   mrec.get( this.retFieldMapping[i]["dsField"] );

					   if (crec && crec.data) {
							nv = crec.data[ this.retFieldMapping[i]["lovField"] ];
					   		if (nv!= ov) {
								if(isParam) {
								   this._dcView_._controller_.setParamValue(this.retFieldMapping[i]["dsParam"], nv);
        						} else {
									mrec.set( this.retFieldMapping[i]["dsField"] ,nv   );
								}
							}
					   } else {
					   		if (ov != null && ov!= "" ) {
								if(isParam) {
								   this._dcView_._controller_.setParamValue(this.retFieldMapping[i]["dsParam"], null);
        						} else {
									 mrec.set( this.retFieldMapping[i]["dsField"] ,null);
								}
							}
					   }
				   }
			}

	 } ,
	 
	 
	 _mapFilterFields_: function(bp) {    
		if (this.inEditor) {
	       var mrec = this._targetRecord_;
           this._mapFilterFieldsExecute_(bp,mrec);
		} else {
			var dcv = this._dcView_, mrec = null;
			if (dcv._dcViewType_ == "edit-form") {
	           mrec = dcv._controller_.getRecord();
			}
	        if (dcv._dcViewType_ == "filter-form") {
	           mrec = dcv._controller_.getFilter();
			}
           this._mapFilterFieldsExecute_(bp, mrec);
		}
    },
    /**
     * Parameters:
     * bp: base params for the store
     */
    _mapFilterFieldsExecute_: function(bp, mrec) {  
		if (!mrec) {return; }
        if (this.filterFieldMapping != null) {
        	for(var i=0, len=this.filterFieldMapping.length; i<len; i++ ) {
			   if (this.filterFieldMapping[i]["value"]) {
			   		bp[this.filterFieldMapping[i]["lovField"]] =  this.filterFieldMapping[i]["value"];
			   	} else {
        			bp[this.filterFieldMapping[i]["lovField"]] =   mrec.get( this.filterFieldMapping[i]["dsField"]);
				}
			}
		 }
	 } ,
	  
    /**
	 * Default proxy-exception handler
	 */
	proxyException : function(proxy, response, operation, eOpts) {
		this.showAjaxErrors(response, eOpts);
	},

	
    
	
    

    
    /**
	 * Show errors to user. TODO: Externalize it as command.
	 */
	showAjaxErrors : function(response, options) {
		// Ext.MessageBox.hide();
		var msg, withDetails = false;
		if (response.responseText) {
			if (response.responseText.length > 2000) {
				msg = response.responseText.substr(0, 2000);
				withDetails = true;
			} else {
				msg = response.responseText;
			}
		} else {
			msg = "No response received from server.";
		}
		var alertCfg = {
			msg : msg,
			scope : this,
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.MessageBox.OK
		}
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = response.responseText;
		}
		Ext.Msg.show(alertCfg);

	},
    
	
	// ****************************************************************
	// *********************** OVERRIDES ******************************
	// ****************************************************************
	
	
    doQuery: function(queryString, forceAll, rawQuery) {		 
        var bp = {}
        bp[this.displayField] = queryString+"*";
        bp["clientId"] = getApplication().getSession().client.id;			 
			if (this.filterFieldMapping != null) {
			   this._mapFilterFields_(bp);
			   /*TODO: check the filter mapping change instead of this brut force stuff*/
			   this.queryCaching = false;
			}
        this.store.proxy.extraParams["data"] =  Ext.encode(bp)
        return this.callParent(arguments);
	 },
	 
 
    
    assertValue: function() {
        var me = this,
            val = me.getRawValue(),
            rec;
        
        rec = this.findRecord(this.displayField, val);
        
        if(!rec && this.forceSelection){
			this.setRawValue("");
			if(val.length > 0 && val != this.emptyText){
				 
                this.applyEmptyText();
            }else{
                this.clearValue();
            }

            this._mapReturnFields_(null);

        }else{
            if(rec){
                
                this._mapReturnFields_(rec);
                if (val == rec.get(this.displayField) && this.value == rec.get(this.valueField)){
				    return;
                }
                val = rec.get(this.valueField || this.displayField);
            } else {
            	if (val != this.value ) {
            		this._mapReturnFields_(null);
            	}			   
			}
			if (this.getValue() != val) {
               this.setValue(val);
			}

        }
        
        me.collapse();
    }

});




Ext.define('dnet.base.LocalCombo', {
	extend: "Ext.form.field.ComboBox",
	alias:"widget.localcombo",
	
	queryMode: "local", 
	 selectOnFocus:true,
	 triggerAction:"query", 
	 forceSelection:true,
	 
	 
	 setValue: function(value, doSelect) {
	    var me = this,
	        valueNotFoundText = me.valueNotFoundText,
	        inputEl = me.inputEl,
	        i, len, record,
	        models = [],
	        displayTplData = [],
	        processedValue = [];
	
	    if (me.store.loading) {
	        // Called while the Store is loading. Ensure it is processed by the onLoad method.
	        me.value = value;
	        return me;
	    }
	
	    // This method processes multi-values, so ensure value is an array.
	    value = Ext.Array.from(value);
	
	    // Loop through values
	    for (i = 0, len = value.length; i < len; i++) {
	        record = value[i];
	        if (!record || !record.isModel) {
	            record = me.findRecordByValue(record);
	        }
	        // record found, select it.
	        if (record) {
	            models.push(record);
	            displayTplData.push(record.data);
	            processedValue.push(record.get(me.valueField));
	        }
	        // record was not found, this could happen because
	        // store is not loaded or they set a value not in the store
	        else {
	            // if valueNotFoundText is defined, display it, otherwise display nothing for this value
	            if (Ext.isDefined(valueNotFoundText)) {
	                displayTplData.push(valueNotFoundText);
	            }
	            processedValue.push(value[i]);
	        }
	    }
	
	    // Set the value of this field. If we are multiselecting, then that is an array.
	    me.value = me.multiSelect ? processedValue : processedValue[0];
	    if (!Ext.isDefined(me.value)) {
	        me.value = null;
	    }
	    me.displayTplData = displayTplData; //store for getDisplayValue method
	    me.lastSelection = me.valueModels = models;
	
	    if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
	        inputEl.removeCls(me.emptyCls);
	    }
	
	    // Calculate raw value from the collection of Model data
	    me.setRawValue(me.getDisplayValue());
	    me.checkChange();
	
	    me._processedValue_ = processedValue;
	    if(processedValue.length > 0) {
	    	var r = this._dcView_._controller_.getRecord();
			if (r) {
				var rv = r.get(me.dataIndex);				  
				if (!r.isEqual(rv, me.value)) {
					r.set(me.dataIndex, me.value);
				}
			}
			 
	    }
	    if (doSelect !== false) {
	        me.syncSelection();
	    }
	    me.applyEmptyText();
	
	    return me;
	}
});
