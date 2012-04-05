Ext.define("dnet.core.asgn.AbstractAsgn", {

	mixins : {
		observable : 'Ext.util.Observable'
	},

	/**
	 * Store for available records
	 * 
	 * @type Ext.data.Store
	 */
	storeLeft : null,

	/**
	 * Store for selected records
	 * 
	 * @type Ext.data.Store
	 */
	storeRight : null,

	/**
	 * Various runtime configuration properties.
	 */
	tuning : {

		/**
		 * Number of milliseconds before execute the query. Used if value>0
		 */
		queryDelay : 150

		/**
		 * Page-size for a query
		 */
		,
		fetchSize : 30
	},

	/**
	 * Parameters model instance
	 */
	params : null,
	/**
	 * Filter object instance. Contains the left filter and right filter
	 */
	filter : null,

	/**
	 * Data model signature - record constructor.
	 */
	recordModel : null,

	/**
	 * Parameters model signature - record constructor.
	 */
	paramModel : null,

	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.params = {
			objectId : 8,
			selectionId : 0,
			clientId : null
		}
		this.filter = {
			left : {
				field : null,
				value : null
			},
			right : {
				field : null,
				value : null
			}
		}
		if (this.storeLeft == null) {
			this.storeLeft = this.createStore("Left");
		}

		if (this.storeRight == null) {
			this.storeRight = this.createStore("Right");
		}

		this.addEvents("afterDoSaveSuccess");
		this.mixins.observable.constructor.call(this);
	},

	// **************** Public API *****************

	initAssignement : function() {
		this.params.clientId = getApplication().getSession().getClient().id;
		this.doSetup();
	},

	doReset : function() {
		this.doResetImpl();
	},

	/**
	 * Call the setup server-side procedure which prepares a temporary data with
	 * the existing selections for this context.
	 */
	doSetup : function() {
		this.doSetupImpl();
	},

	doCleanup : function() {
		this.doCleanupImpl();
	},

	/**
	 * Save changes.
	 */
	doSave : function() {
		this.doSaveImpl();
	},

	/**
	 * Load the available records.
	 */
	doQueryLeft : function() {
		this.doQueryLeftImpl();
	},

	/**
	 * Query the selected records.
	 */
	doQueryRight : function() {
		this.doQueryRightImpl();
	},

	/**
	 * Select all available.
	 */
	doMoveRightAll : function() {
		this.doMoveRightAllImpl();
	},

	/**
	 * Remove all selected
	 */
	doMoveLeftAll : function() {
		this.doMoveLeftAllImpl();
	},

	/**
	 * Select those records which are selected by the user in the available options list. 
	 * @param {Ext.grid.Panel} theLeftGrid
	 * @param {Ext.grid.Panel} theRightGrid
	 */
	doMoveRight : function(theLeftGrid, theRightGrid) {
		this.doMoveRightImpl(theLeftGrid, theRightGrid);
	},

	/**
	 * Remove those records which are selected by the user in the selected options list. 
	 * @param {} theLeftGrid
	 * @param {} theRightGrid
	 */
	doMoveLeft : function(theLeftGrid, theRightGrid) {
		this.doMoveLeftImpl(theLeftGrid, theRightGrid);
	},

	/**
	 * Return the store for the specified side.
	 * @param {String} side 
	 * @return {Ext.data.Store}
	 */
	getStore : function(side) {
		if (side == "left") {
			return this.storeLeft;
		}
		if (side == "right") {
			return this.storeRight;
		}
	},

	afterMoveLeftSuccess : function(response, options) {
		this.doQueryLeft();
		this.doQueryRight();
	},

	afterMoveRightSuccess : function(response, options) {
		this.doQueryLeft();
		this.doQueryRight();

	},

	afterMoveLeftAllSuccess : function(response, options) {
		this.doQueryLeft();
		this.doQueryRight();

	},

	afterMoveRightAllSuccess : function(response, options) {
		this.doQueryLeft();
		this.doQueryRight();
	},

	afterDoSetupSuccess : function(response, options) {
		this.params["selectionId"] = response.responseText;
		this.doQueryLeft();
		this.doQueryRight();
	},

	afterDoResetSuccess : function(response, options) {
		this.doQueryLeft();
		this.doQueryRight();
	},

	afterDoSaveSuccess : function(response, options) {
		Ext.Msg.hide();
		this.fireEvent("afterDoSaveSuccess", this);
	},

	// **************** Private API *****************

	doSetupImpl : function() {
		Ext.Ajax.request({
					params : this.params,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterDoSetupSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=setup",
					timeout : 600000

				});
	},

	doMoveLeftImpl : function(theLeftGrid, theRightGrid) {
		var selection = theRightGrid.getSelectionModel().getSelection();
		if (selection.length == 0) {
			return;
		}
		var p_selected_ids = "";
		for (var i = 0; i < selection.length; i++) {
			p_selected_ids += (i > 0) ? "," : "";
			p_selected_ids += selection[i].data.id;
		}
		var p = Ext.apply({
					p_selected_ids : p_selected_ids
				}, this.params);
		Ext.Ajax.request({
					params : p,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterMoveLeftSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=moveLeft",
					timeout : 600000,
					options : {
						action : "moveLeft",
						fnSuccess : null,
						fnSuccessScope : null,
						fnFailure : null,
						fnFailureScope : null,
						serviceName : name
					}
				});

	},

	doMoveRightImpl : function(theLeftGrid, theRightGrid) {
		var selection = theLeftGrid.getSelectionModel().getSelection();
		if (selection.length == 0) {
			return;
		}
		var p_selected_ids = "";
		for (var i = 0; i < selection.length; i++) {
			p_selected_ids += (i > 0) ? "," : "";
			p_selected_ids += selection[i].data.id;
		}
		var p = Ext.apply({
					p_selected_ids : p_selected_ids
				}, this.params);
		Ext.Ajax.request({
					params : p,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterMoveRightSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=moveRight",
					timeout : 600000,
					options : {
						action : "moveRight",
						fnSuccess : null,
						fnSuccessScope : null,
						fnFailure : null,
						fnFailureScope : null,
						serviceName : name
					}
				});
	},

	doMoveLeftAllImpl : function() {
		Ext.Ajax.request({
			params : this.params,
			method : "POST",
			failure : this.afterAjaxFailure,
			success : this.afterMoveLeftAllSuccess,
			scope : this,
			url : Dnet.asgnUrl + "/" + this.dsName + ".json?action=moveLeftAll",
			timeout : 600000,
			options : {
				action : "moveLeftAll",
				fnSuccess : null,
				fnSuccessScope : null,
				fnFailure : null,
				fnFailureScope : null,
				serviceName : name
			}
		});

	},

	doMoveRightAllImpl : function() {

		Ext.Ajax.request({
					params : this.params,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterMoveRightAllSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=moveRightAll",
					timeout : 600000,
					options : {
						action : "moveRightAll",
						fnSuccess : null,
						fnSuccessScope : null,
						fnFailure : null,
						fnFailureScope : null,
						serviceName : name
					}
				});
	},

	doQueryLeftImpl : function() {
		this.storeLeft.removeAll();
		var lp = {};
		var data = {};

		this.storeLeft.proxy.extraParams = this.params;
		this.storeLeft.currentPage = 1;

		if (this.filter.left.field) {
			data[this.filter.left.field] = this.filter.left.value || '*';
			this.storeLeft.proxy.extraParams.data = Ext.encode(data);
		}

		lp[Dnet.requestParam.START] = 0;
		lp[Dnet.requestParam.SIZE] = this.tuning.fetchSize;

		Ext.apply(lp, this.params);
		var theCallback = function(recs, options, success) {
		}

		this.storeLeft.load({
					params : lp,
					scope : this,
					callback : theCallback
				});
		return true;
	},

	doQueryRightImpl : function() { // alert("AbstractDc("+this.dsName+").doQueryImpl");

		this.storeRight.removeAll();
		var lp = {};
		var data = {};

		this.storeRight.proxy.extraParams = this.params;
		this.storeRight.currentPage = 1;

		if (this.filter.right.field) {
			data[this.filter.right.field] = this.filter.right.value || '*';
			this.storeRight.proxy.extraParams["data"] = Ext.encode(data);
		}

		lp[Dnet.requestParam.START] = 0;
		lp[Dnet.requestParam.SIZE] = this.tuning.fetchSize;
		Ext.apply(lp, this.params);
		var theCallback = function(recs, options, success) {
		}

		this.storeRight.load({
					params : lp,
					scope : this,
					callback : theCallback
				});
		return true;
	},

	doSaveImpl : function() {
		Ext.Ajax.request({
					params : this.params,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterDoSaveSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=save",
					timeout : 600000,
					options : {
						action : "doSave",
						fnSuccess : null,
						fnSuccessScope : null,
						fnFailure : null,
						fnFailureScope : null,
						serviceName : name
					}
				});
		Ext.Msg.progress('Saving...');
	},

	doResetImpl : function() {
		Ext.Ajax.request({
					params : this.params,
					method : "POST",
					failure : this.afterAjaxFailure,
					success : this.afterDoResetSuccess,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=reset",
					timeout : 600000,
					options : {
						action : "doReset",
						fnSuccess : null,
						fnSuccessScope : null,
						fnFailure : null,
						fnFailureScope : null,
						serviceName : name
					}
				});
	},

	doCleanupImpl : function() {
		Ext.Ajax.request({
					params : this.params,
					method : "POST",
					failure : this.afterAjaxFailure
					// ,success:this.afterDoSetupSuccess
					,
					scope : this,
					url : Dnet.asgnUrl + "/" + this.dsName
							+ ".json?action=cleanup",
					timeout : 600000
				});
	},

	createStore : function(side) {

		return Ext.create("Ext.data.Store", {
					model : this.recordModel,
					remoteSort : true,
					remoteSort : true,
					autoLoad : false,
					autoSync : false,
					clearOnPageLoad : true,
					pageSize : this.tuning.fetchSize,
					proxy : {
						type : 'ajax',
						api : Dnet["asgn" + side + "API"](this.dsName, "json"),
						model : this.recordModel,
						extraParams : {
							params : {}
						},
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
						writer : {
							type : 'json',
							encode : true,
							allowSingle : false,
							writeAllFields : true
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

	/** ********************************************** */
	/** *********** MISCELLANEOUS HELPERS ************* */
	/** ********************************************** */

	afterAjaxFailure : function(response, options) {
		// Ext.MessageBox.hide();
		// Ext.Msg.hide();
		var msg = (response.responseText) ? response.responseText.substr(0,
				2000) : "No error message returned from server.";
		Ext.Msg.show({
					title : 'HTTP:' + response.status + ' '
							+ response.statusText,
					msg : msg,
					buttons : Ext.Msg.OK,
					scope : this,
					icon : Ext.MessageBox.ERROR
				});
	},

	proxyException : function(dataProxy, response, operation, eopts) {

		Ext.Msg.show({
					title : 'HTTP:' + response.status + ' '
							+ response.statusText,
					msg : response.responseText.substr(0, 1500),
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.ERROR
				});

	}

});
