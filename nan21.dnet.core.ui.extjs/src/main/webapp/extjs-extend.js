
session_decimalSeparator = ".";
session_groupSeparator = ",";

Ext.DATE_FORMAT = 'd.m.Y';
Ext.TIME_FORMAT = 'H:i';
Ext.DATETIME_FORMAT = 'd.m.Y H:i';
Ext.MONTH_FORMAT = 'm.Y';
Ext.form.DateField.prototype.altFormats = "j|j.n|d|d.m";
Ext.form.TimeField.prototype.altFormats = "G|H|G:i"; 

Ext.NUMBER_FORMAT_DEC = "0,000.00";
Ext.NUMBER_FORMAT_INT = "0,000";


Ext.MODEL_DATE_FORMAT = "Y-m-d\\TH:i:s.uO";



Ext.urlEncode = function(o, pre){
    var undef, buf = [], key, e = encodeURIComponent;
	  for(key in o){
	    undef = typeof o[key] == 'undefined';
	    Ext.each(undef ? key : (( o[key] instanceof Date)? o[key].format(Ext.DATE_FORMAT) : o[key]), function(val, i){
          buf.push("&", e(key), "=", (val != key || !undef) ? e(val) : "");
	      });
    }
	  if(!pre){
	    buf.shift();
	    pre = "";
	  }
	  return pre + buf.join('');
  }


 
String.prototype.replaceAll = function(s,r){
  var h = this;
  var i = h.indexOf( s );
  while (i != -1){
    h = h.replace( s, r )
    i = h.indexOf( s );
  }
  return( h );
}


Ext.PagingToolbar.prototype.paramNames =   {
		start : Dnet.requestParam.START,
		limit : Dnet.requestParam.SIZE
	}

Ext.data.Store.prototype.paramNames =   {
		start : Dnet.requestParam.START,
		limit : Dnet.requestParam.SIZE,
		sort : Dnet.requestParam.SORT,
		dir : Dnet.requestParam.SENSE
	}


Ext.override(Ext.form.Field, {
    //  Add functionality to Field's initComponent to enable the change event to bubble
    initComponent : Ext.form.Field.prototype.initComponent.createSequence(function() {
       // this.enableBubble('change');this.enableBubble('check');
    })
	,_controller_: null
	,_getController_: function() {
		   if (this._controller_ == null) {
                var p = this.findParentBy(function(p){
	                return p._controller_ != undefined;
	            })
                 this._controller_ = p._controller_;
		   }
		   return this._controller_;
	}

    ,_dcView_: null
	,_getDcView_: function() {
		   if (this._dcView_ == null) {
                var p = this.findParentBy(function(p){
	                return (p._controller_ != undefined);
	            }) ;
                 this._dcView_ = p;
		   }
		   return this._dcView_ ;
	}

    //  We know that we want Field's events to bubble directly to the FormPanel.
   , getBubbleTarget : function() { 
        if (!this.formPanel) {
            this.formPanel = this.findParentBy(function(p){
                return p._controller_ != undefined;
            })
        }
        return this.formPanel;
    }

    // return case restricted value
   , getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        if (this.initialConfig["caseRestriction"] == "uppercase")v=v.toUpperCase()
        return v;
    }
    ,getRawValue : function(){
        var v = this.rendered ? this.el.getValue() : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        if (this.initialConfig["caseRestriction"] == "uppercase")v=v.toUpperCase()
        return v;
    }
});


Ext.data.Types.INT = {
	convert: function(v){
	return v !== undefined && v !== null && v !== '' ?
	parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : ''; /* replaced the default 0*/
	},
	sortType: Ext.data.SortTypes.none,
	type: 'int'
	} 

Ext.data.Types.FLOAT = {
            convert: function(v){  
                return v !== undefined && v !== null && v !== '' ?
                    parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';/* replaced the default 0*/
            },
            sortType: Ext.data.SortTypes.none,
            type: 'float'
        }        
        
Ext.override(Ext.grid.PropertyStore, {

     setSource : function(o){
        this.source = o;
        this.store.removeAll();
        var data = [];
        for(var k in o){
            if(this.isEditableValue(o[k]) || o[k] == null){
                data.push(new Ext.grid.PropertyRecord({name: k, value: o[k]}, k));
            }
        }
        this.store.loadRecords({records: data}, {}, true);
    }
});




























Ext.util.JSON = new (function(){
    var useHasOwn = !!{}.hasOwnProperty,
        isNative = function() {
            var useNative = null;

            return function() {
                if (useNative === null) {
                    useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
                }        
                return useNative;
            };
        }(),
        pad = function(n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function(json){
            return eval("(" + json + ')');    
        },
        doEncode = function(o){
            if(!Ext.isDefined(o) || o === null || ""+o == ""){
                return "null";
            }else if(Ext.isArray(o)){
                return encodeArray(o);
            }else if(Ext.isDate(o)){
                return Ext.util.JSON.encodeDate(o);
            }else if(Ext.isString(o)){
                return encodeString(o);
            }else if(typeof o == "number"){
                //don't use isNumber here, since finite checks happen inside isNumber
                return isFinite(o) ? String(o) : "null";
            }else if(Ext.isBoolean(o)){
                return String(o);
            }else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    // don't encode DOM objects
                    if(!o.getElementsByTagName){
                        if(!useHasOwn || o.hasOwnProperty(i)) {
                            v = o[i];
                            switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if(b){
                                    a.push(',');
                                }
                                a.push(doEncode(i), ":",
                                        v === null ? "null" : doEncode(v));
                                b = true;
                            }
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }    
        },
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        },
        encodeString = function(s){
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c){
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + s + '"';
        },
        encodeArray = function(o){
            var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(v === null ? "null" : Ext.util.JSON.encode(v));
                            b = true;
                    }
                }
                a.push("]");
                return a.join("");
        };


    this.encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };


    this.encode = function() {
        var ec;
        return function(o) {
            if (!ec) {
                // setup encoding function on first access
                ec = isNative() ? JSON.stringify : doEncode;
            }
            return ec(o);
        };
    }();


    this.decode = function() {
        var dc;
        return function(json) {
            if (!dc) {
                // setup decoding function on first access
                dc = isNative() ? JSON.parse : doDecode;
            }
            return dc(json);
        };
    }();

})();

Ext.encode = Ext.util.JSON.encode;
Ext.decode = Ext.util.JSON.decode;
Ext.util.JSON.encodeDate = function(d) {
    return d.format('"'+Ext.MODEL_DATE_FORMAT +'"');
};

