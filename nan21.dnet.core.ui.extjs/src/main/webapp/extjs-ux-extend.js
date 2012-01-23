  /*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/

Ext.util.MD5 = function(s,raw,hexcase,chrsz) {
	raw = raw || false;	
	hexcase = hexcase || false;
	chrsz = chrsz || 8;

	function safe_add(x, y){
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function bit_rol(num, cnt){
		return (num << cnt) | (num >>> (32 - cnt));
	}
	function md5_cmn(q, a, b, x, s, t){
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t){
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t){
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t){
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t){
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function core_md5(x, len){
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;
		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;
		for(var i = 0; i < x.length; i += 16){
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
			d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
			d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
			d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
			d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
			a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
			d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
			c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
			d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
			c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
			d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
			c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
			d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
			c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
			a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
			d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
			d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
			d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
			d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
			a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
			d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
			d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
			d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
			d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}
	function str2binl(str){
		var bin = [];
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
		}
		return bin;
	}
	function binl2str(bin){
		var str = "";
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < bin.length * 32; i += chrsz) {
			str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
		}
		return str;
	}
	
	function binl2hex(binarray){
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
		}
		return str;
	}
	return (raw ? binl2str(core_md5(str2binl(s), s.length * chrsz)) : binl2hex(core_md5(str2binl(s), s.length * chrsz))	);
};
 
/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.StatusBar
 * <p>Basic status bar component that can be used as the bottom toolbar of any {@link Ext.Panel}.  In addition to
 * supporting the standard {@link Ext.toolbar.Toolbar} interface for adding buttons, menus and other items, the StatusBar
 * provides a greedy status element that can be aligned to either side and has convenient methods for setting the
 * status text and icon.  You can also indicate that something is processing using the {@link #showBusy} method.</p>
 * <pre><code>
Ext.create('Ext.Panel', {
    title: 'StatusBar',
    // etc.
    bbar: Ext.create('Ext.ux.StatusBar', {
        id: 'my-status',

        // defaults to use when the status is cleared:
        defaultText: 'Default status text',
        defaultIconCls: 'default-icon',

        // values to set initially:
        text: 'Ready',
        iconCls: 'ready-icon',

        // any standard Toolbar items:
        items: [{
            text: 'A Button'
        }, '-', 'Plain Text']
    })
});

// Update the status bar later in code:
var sb = Ext.getCmp('my-status');
sb.setStatus({
    text: 'OK',
    iconCls: 'ok-icon',
    clear: true // auto-clear after a set interval
});

// Set the status bar to show that something is processing:
sb.showBusy();

// processing....

sb.clearStatus(); // once completeed
</code></pre>
 * @extends Ext.toolbar.Toolbar
 * @constructor
 * Creates a new StatusBar
 * @param {Object/Array} config A config object
 */
Ext.define('Ext.ux.statusbar.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    /**
     * @cfg {String} statusAlign
     * The alignment of the status element within the overall StatusBar layout.  When the StatusBar is rendered,
     * it creates an internal div containing the status text and icon.  Any additional Toolbar items added in the
     * StatusBar's {@link #items} config, or added via {@link #add} or any of the supported add* methods, will be
     * rendered, in added order, to the opposite side.  The status element is greedy, so it will automatically
     * expand to take up all sapce left over by any other items.  Example usage:
     * <pre><code>
// Create a left-aligned status bar containing a button,
// separator and text item that will be right-aligned (default):
Ext.create('Ext.Panel', {
    title: 'StatusBar',
    // etc.
    bbar: Ext.create('Ext.ux.StatusBar', {
        defaultText: 'Default status text',
        id: 'status-id',
        items: [{
            text: 'A Button'
        }, '-', 'Plain Text']
    })
});

// By adding the statusAlign config, this will create the
// exact same toolbar, except the status and toolbar item
// layout will be reversed from the previous example:
Ext.create('Ext.Panel', {
    title: 'StatusBar',
    // etc.
    bbar: Ext.create('Ext.ux.StatusBar', {
        defaultText: 'Default status text',
        id: 'status-id',
        statusAlign: 'right',
        items: [{
            text: 'A Button'
        }, '-', 'Plain Text']
    })
});
</code></pre>
     */
    /**
     * @cfg {String} defaultText
     * The default {@link #text} value.  This will be used anytime the status bar is cleared with the
     * <tt>useDefaults:true</tt> option (defaults to '').
     */
    /**
     * @cfg {String} defaultIconCls
     * The default {@link #iconCls} value (see the iconCls docs for additional details about customizing the icon).
     * This will be used anytime the status bar is cleared with the <tt>useDefaults:true</tt> option (defaults to '').
     */
    /**
     * @cfg {String} text
     * A string that will be <b>initially</b> set as the status message.  This string
     * will be set as innerHTML (html tags are accepted) for the toolbar item.
     * If not specified, the value set for <code>{@link #defaultText}</code>
     * will be used.
     */
    /**
     * @cfg {String} iconCls
     * A CSS class that will be <b>initially</b> set as the status bar icon and is
     * expected to provide a background image (defaults to '').
     * Example usage:<pre><code>
// Example CSS rule:
.x-statusbar .x-status-custom {
    padding-left: 25px;
    background: transparent url(images/custom-icon.gif) no-repeat 3px 2px;
}

// Setting a default icon:
var sb = Ext.create('Ext.ux.StatusBar', {
    defaultIconCls: 'x-status-custom'
});

// Changing the icon:
sb.setStatus({
    text: 'New status',
    iconCls: 'x-status-custom'
});
</code></pre>
     */

    /**
     * @cfg {String} cls
     * The base class applied to the containing element for this component on render (defaults to 'x-statusbar')
     */
    cls : 'x-statusbar',
    /**
     * @cfg {String} busyIconCls
     * The default <code>{@link #iconCls}</code> applied when calling
     * <code>{@link #showBusy}</code> (defaults to <tt>'x-status-busy'</tt>).
     * It can be overridden at any time by passing the <code>iconCls</code>
     * argument into <code>{@link #showBusy}</code>.
     */
    busyIconCls : 'x-status-busy',
    /**
     * @cfg {String} busyText
     * The default <code>{@link #text}</code> applied when calling
     * <code>{@link #showBusy}</code> (defaults to <tt>'Loading...'</tt>).
     * It can be overridden at any time by passing the <code>text</code>
     * argument into <code>{@link #showBusy}</code>.
     */
    busyText : 'Loading...',
    /**
     * @cfg {Number} autoClear
     * The number of milliseconds to wait after setting the status via
     * <code>{@link #setStatus}</code> before automatically clearing the status
     * text and icon (defaults to <tt>5000</tt>).  Note that this only applies
     * when passing the <tt>clear</tt> argument to <code>{@link #setStatus}</code>
     * since that is the only way to defer clearing the status.  This can
     * be overridden by specifying a different <tt>wait</tt> value in
     * <code>{@link #setStatus}</code>. Calls to <code>{@link #clearStatus}</code>
     * always clear the status bar immediately and ignore this value.
     */
    autoClear : 5000,

    /**
     * @cfg {String} emptyText
     * The text string to use if no text has been set.  Defaults to
     * <tt>'&nbsp;'</tt>).  If there are no other items in the toolbar using
     * an empty string (<tt>''</tt>) for this value would end up in the toolbar
     * height collapsing since the empty string will not maintain the toolbar
     * height.  Use <tt>''</tt> if the toolbar should collapse in height
     * vertically when no text is specified and there are no other items in
     * the toolbar.
     */
    emptyText : '&nbsp;',

    // private
    activeThreadId : 0,

    // private
    initComponent : function(){
        if (this.statusAlign === 'right') {
            this.cls += ' x-status-right';
        }
        this.callParent(arguments);
    },

    // private
    afterRender : function(){
        this.callParent(arguments);

        var right = this.statusAlign === 'right';
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });

        if (right) {
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }
        this.height = 27;
        this.doLayout();
    },

    /**
     * Sets the status {@link #text} and/or {@link #iconCls}. Also supports automatically clearing the
     * status that was set after a specified interval.
     * @param {Object/String} config A config object specifying what status to set, or a string assumed
     * to be the status text (and all other options are defaulted as explained below). A config
     * object containing any or all of the following properties can be passed:<ul>
     * <li><tt>text</tt> {String} : (optional) The status text to display.  If not specified, any current
     * status text will remain unchanged.</li>
     * <li><tt>iconCls</tt> {String} : (optional) The CSS class used to customize the status icon (see
     * {@link #iconCls} for details). If not specified, any current iconCls will remain unchanged.</li>
     * <li><tt>clear</tt> {Boolean/Number/Object} : (optional) Allows you to set an internal callback that will
     * automatically clear the status text and iconCls after a specified amount of time has passed. If clear is not
     * specified, the new status will not be auto-cleared and will stay until updated again or cleared using
     * {@link #clearStatus}. If <tt>true</tt> is passed, the status will be cleared using {@link #autoClear},
     * {@link #defaultText} and {@link #defaultIconCls} via a fade out animation. If a numeric value is passed,
     * it will be used as the callback interval (in milliseconds), overriding the {@link #autoClear} value.
     * All other options will be defaulted as with the boolean option.  To customize any other options,
     * you can pass an object in the format:<ul>
     *    <li><tt>wait</tt> {Number} : (optional) The number of milliseconds to wait before clearing
     *    (defaults to {@link #autoClear}).</li>
     *    <li><tt>anim</tt> {Number} : (optional) False to clear the status immediately once the callback
     *    executes (defaults to true which fades the status out).</li>
     *    <li><tt>useDefaults</tt> {Number} : (optional) False to completely clear the status text and iconCls
     *    (defaults to true which uses {@link #defaultText} and {@link #defaultIconCls}).</li>
     * </ul></li></ul>
     * Example usage:<pre><code>
// Simple call to update the text
statusBar.setStatus('New status');

// Set the status and icon, auto-clearing with default options:
statusBar.setStatus({
    text: 'New status',
    iconCls: 'x-status-custom',
    clear: true
});

// Auto-clear with custom options:
statusBar.setStatus({
    text: 'New status',
    iconCls: 'x-status-custom',
    clear: {
        wait: 8000,
        anim: false,
        useDefaults: false
    }
});
</code></pre>
     * @return {Ext.ux.StatusBar} this
     */
    setStatus : function(o) {
        o = o || {};

        if (Ext.isString(o)) {
            o = {text:o};
        }
        if (o.text !== undefined) {
            this.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            this.setIcon(o.iconCls);
        }

        if (o.clear) {
            var c = o.clear,
                wait = this.autoClear,
                defaults = {useDefaults: true, anim: true};

            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }

            c.threadId = this.activeThreadId;
            Ext.defer(this.clearStatus, wait, this, [c]);
        }
        this.doLayout();
        return this;
    },

    /**
     * Clears the status {@link #text} and {@link #iconCls}. Also supports clearing via an optional fade out animation.
     * @param {Object} config (optional) A config object containing any or all of the following properties.  If this
     * object is not specified the status will be cleared using the defaults below:<ul>
     * <li><tt>anim</tt> {Boolean} : (optional) True to clear the status by fading out the status element (defaults
     * to false which clears immediately).</li>
     * <li><tt>useDefaults</tt> {Boolean} : (optional) True to reset the text and icon using {@link #defaultText} and
     * {@link #defaultIconCls} (defaults to false which sets the text to '' and removes any existing icon class).</li>
     * </ul>
     * @return {Ext.ux.StatusBar} this
     */
    clearStatus : function(o) {
        o = o || {};

        if (o.threadId && o.threadId !== this.activeThreadId) {
            // this means the current call was made internally, but a newer
            // thread has set a message since this call was deferred.  Since
            // we don't want to overwrite a newer message just ignore.
            return this;
        }

        var text = o.useDefaults ? this.defaultText : this.emptyText,
            iconCls = o.useDefaults ? (this.defaultIconCls ? this.defaultIconCls : '') : '';

        if (o.anim) {
            // animate the statusEl Ext.core.Element
            this.statusEl.el.puff({
                remove: false,
                useDisplay: true,
                scope: this,
                callback: function(){
                    this.setStatus({
                     text: text,
                     iconCls: iconCls
                 });

                    this.statusEl.el.show();
                }
            });
        } else {
            // hide/show the el to avoid jumpy text or icon
             this.statusEl.hide();
             this.setStatus({
                 text: text,
                 iconCls: iconCls
             });
             this.statusEl.show();
        }
        this.doLayout();
        return this;
    },

    /**
     * Convenience method for setting the status text directly.  For more flexible options see {@link #setStatus}.
     * @param {String} text (optional) The text to set (defaults to '')
     * @return {Ext.ux.StatusBar} this
     */
    setText : function(text){
        this.activeThreadId++;
        this.text = text || '';
        if (this.rendered) {
            this.statusEl.setText(this.text);
        }
        return this;
    },

    /**
     * Returns the current status text.
     * @return {String} The status text
     */
    getText : function(){
        return this.text;
    },

    /**
     * Convenience method for setting the status icon directly.  For more flexible options see {@link #setStatus}.
     * See {@link #iconCls} for complete details about customizing the icon.
     * @param {String} iconCls (optional) The icon class to set (defaults to '', and any current icon class is removed)
     * @return {Ext.ux.StatusBar} this
     */
    setIcon : function(cls){
        this.activeThreadId++;
        cls = cls || '';

        if (this.rendered) {
         if (this.currIconCls) {
             this.statusEl.removeCls(this.currIconCls);
             this.currIconCls = null;
         }
         if (cls.length > 0) {
             this.statusEl.addCls(cls);
             this.currIconCls = cls;
         }
        } else {
            this.currIconCls = cls;
        }
        return this;
    },

    /**
     * Convenience method for setting the status text and icon to special values that are pre-configured to indicate
     * a "busy" state, usually for loading or processing activities.
     * @param {Object/String} config (optional) A config object in the same format supported by {@link #setStatus}, or a
     * string to use as the status text (in which case all other options for setStatus will be defaulted).  Use the
     * <tt>text</tt> and/or <tt>iconCls</tt> properties on the config to override the default {@link #busyText}
     * and {@link #busyIconCls} settings. If the config argument is not specified, {@link #busyText} and
     * {@link #busyIconCls} will be used in conjunction with all of the default options for {@link #setStatus}.
     * @return {Ext.ux.StatusBar} this
     */
    showBusy : function(o){
        if (Ext.isString(o)) {
            o = { text: o };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    }
});

 


/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.TabCloseMenu
 * Plugin (ptype = 'tabclosemenu') for adding a close context menu to tabs. Note that the menu respects
 * the closable configuration on the tab. As such, commands like remove others and remove all will not
 * remove items that are not closable.
 *
 * @constructor
 * @param {Object} config The configuration options
 * @ptype tabclosemenu
 */
Ext.define('Ext.tab.TabCloseMenu', {
    alias: 'plugin.tabclosemenu',
    alternateClassName: 'Ext.ux.TabCloseMenu',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',

    /**
     * @cfg {Boolean} showCloseOthers
     * Indicates whether to show the 'Close Others' option. Defaults to <tt>true</tt>.
     */
    showCloseOthers: true,

    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOthersTabsText: 'Close Other Tabs',

    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>.
     */
    showCloseAll: true,

    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
    closeAllTabsText: 'Close All Tabs',

    /**
     * @cfg {Array} extraItemsHead
     * An array of additional context menu items to add to the front of the context menu.
     */
    extraItemsHead: null,

    /**
     * @cfg {Array} extraItemsTail
     * An array of additional context menu items to add to the end of the context menu.
     */
    extraItemsTail: null,

    //public
    constructor: function (config) {
        this.addEvents(
            'aftermenu',
            'beforemenu');

        this.mixins.observable.constructor.call(this, config);
    },

    init : function(tabpanel){
        this.tabPanel = tabpanel;
        this.tabBar = tabpanel.down("tabbar");

        this.mon(this.tabPanel, {
            scope: this,
            afterlayout: this.onAfterLayout,
            single: true
        });
    },

    onAfterLayout: function() {
        this.mon(this.tabBar.el, {
            scope: this,
            contextmenu: this.onContextMenu,
            delegate: 'div.x-tab'
        });
    },

    onBeforeDestroy : function(){
        Ext.destroy(this.menu);
        this.callParent(arguments);
    },

    // private
    onContextMenu : function(event, target){
        var me = this,
            menu = me.createMenu(),
            disableAll = true,
            disableOthers = true,
            tab = me.tabBar.getChildByElement(target),
            index = me.tabBar.items.indexOf(tab);

        me.item = me.tabPanel.getComponent(index);
        menu.child('*[text="' + me.closeTabText + '"]').setDisabled(!me.item.closable);

        if (me.showCloseAll || me.showCloseOthers) {
            me.tabPanel.items.each(function(item) {
                if (item.closable) {
                    disableAll = false;
                    if (item != me.item) {
                        disableOthers = false;
                        return false;
                    }
                }
                return true;
            });

            if (me.showCloseAll) {
                menu.child('*[text="' + me.closeAllTabsText + '"]').setDisabled(disableAll);
            }

            if (me.showCloseOthers) {
                menu.child('*[text="' + me.closeOthersTabsText + '"]').setDisabled(disableOthers);
            }
        }

        event.preventDefault();
        me.fireEvent('beforemenu', menu, me.item, me);

        menu.showAt(event.getXY());
    },

    createMenu : function() {
        var me = this;

        if (!me.menu) {
            var items = [{
                text: me.closeTabText,
                scope: me,
                handler: me.onClose
            }];

            if (me.showCloseAll || me.showCloseOthers) {
                items.push('-');
            }

            if (me.showCloseOthers) {
                items.push({
                    text: me.closeOthersTabsText,
                    scope: me,
                    handler: me.onCloseOthers
                });
            }

            if (me.showCloseAll) {
                items.push({
                    text: me.closeAllTabsText,
                    scope: me,
                    handler: me.onCloseAll
                });
            }

            if (me.extraItemsHead) {
                items = me.extraItemsHead.concat(items);
            }

            if (me.extraItemsTail) {
                items = items.concat(me.extraItemsTail);
            }

            me.menu = Ext.create('Ext.menu.Menu', {
                items: items,
                listeners: {
                    hide: me.onHideMenu,
                    scope: me
                }
            });
        }

        return me.menu;
    },

    onHideMenu: function () {
        var me = this;

        me.item = null;
        me.fireEvent('aftermenu', me.menu, me);
    },

    onClose : function(){
        this.tabPanel.remove(this.item);
    },

    onCloseOthers : function(){
        this.doClose(true);
    },

    onCloseAll : function(){
        this.doClose(false);
    },

    doClose : function(excludeActive){
        var items = [];

        this.tabPanel.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.item){
                    items.push(item);
                }
            }
        }, this);

        Ext.each(items, function(item){
            this.tabPanel.remove(item);
        }, this);
    }
});


/**
 * @private
 * @class Ext.ux.layout.component.form.MultiSelect
 * @extends Ext.layout.component.field.Field
 * Layout class for {@link Ext.ux.form.MultiSelect} fields.
 * @private
 */
Ext.define('Ext.ux.layout.component.form.MultiSelect', {
    extend: 'Ext.layout.component.field.Field',
    alias: ['layout.multiselectfield'],

    type: 'multiselectfield',

    /**
     * @cfg {Number} height The height of the field. Defaults to 200.
     */
    defaultHeight: 200,

    sizeBodyContents: function(width, height) {
        var me = this;

        if (!Ext.isNumber(height)) {
            height = me.defaultHeight;
        }

        me.owner.panel.setSize(width, height);
    }
});

/**
 * @private
 * @class Ext.ux.layout.component.form.ItemSelector
 * @extends Ext.layout.component.field.Field
 * Layout class for {@link Ext.ux.form.ItemSelector} fields.
 * @private
 */
Ext.define('Ext.ux.layout.component.form.ItemSelector', {
    extend: 'Ext.layout.component.field.Field',
    alias: ['layout.itemselectorfield'],

    type: 'itemselectorfield',

    /**
     * @cfg {Number} height The height of the field. Defaults to 200.
     */
    defaultHeight: 200,

    sizeBodyContents: function(width, height) {
        var me = this;

        if (!Ext.isNumber(height)) {
            height = me.defaultHeight;
        }

        me.owner.innerCt.setSize(width, height);
    }
});


/**
 * @class Ext.ux.form.MultiSelect
 * @extends Ext.form.field.Base
 * A control that allows selection and form submission of multiple list items.
 *
 *  @history
 *    2008-06-19 bpm Original code contributed by Toby Stuart (with contributions from Robert Williams)
 *    2008-06-19 bpm Docs and demo code clean up
 *
 * @constructor
 * Create a new MultiSelect
 * @param {Object} config Configuration options
 * @xtype multiselect
 */
Ext.define('Ext.ux.form.MultiSelect', {
    extend: 'Ext.form.field.Base',
    alternateClassName: 'Ext.ux.Multiselect',
    alias: ['widget.multiselect', 'widget.multiselectfield'],
    uses: [
        'Ext.view.BoundList',
        'Ext.form.FieldSet',
        'Ext.ux.layout.component.form.MultiSelect',
        'Ext.view.DragZone',
        'Ext.view.DropZone'
    ],

    /**
     * @cfg {String} listTitle An optional title to be displayed at the top of the selection list.
     */

    /**
     * @cfg {String/Array} dragGroup The ddgroup name(s) for the MultiSelect DragZone (defaults to undefined).
     */

    /**
     * @cfg {String/Array} dropGroup The ddgroup name(s) for the MultiSelect DropZone (defaults to undefined).
     */

    /**
     * @cfg {Boolean} ddReorder Whether the items in the MultiSelect list are drag/drop reorderable (defaults to false).
     */
    ddReorder: false,

    /**
     * @cfg {Object/Array} tbar An optional toolbar to be inserted at the top of the control's selection list.
     * This can be a {@link Ext.toolbar.Toolbar} object, a toolbar config, or an array of buttons/button configs
     * to be added to the toolbar. See {@link Ext.panel.Panel#tbar}.
     */

    /**
     * @cfg {String} appendOnly True if the list should only allow append drops when drag/drop is enabled
     * (use for lists which are sorted, defaults to false).
     */
    appendOnly: false,

    /**
     * @cfg {String} displayField Name of the desired display field in the dataset (defaults to 'text').
     */
    displayField: 'text',

    /**
     * @cfg {String} valueField Name of the desired value field in the dataset (defaults to the
     * value of {@link #displayField}).
     */

    /**
     * @cfg {Boolean} allowBlank False to require at least one item in the list to be selected, true to allow no
     * selection (defaults to true).
     */
    allowBlank: true,

    /**
     * @cfg {Number} minSelections Minimum number of selections allowed (defaults to 0).
     */
    minSelections: 0,

    /**
     * @cfg {Number} maxSelections Maximum number of selections allowed (defaults to Number.MAX_VALUE).
     */
    maxSelections: Number.MAX_VALUE,

    /**
     * @cfg {String} blankText Default text displayed when the control contains no items (defaults to 'This field is required')
     */
    blankText: 'This field is required',

    /**
     * @cfg {String} minSelectionsText Validation message displayed when {@link #minSelections} is not met (defaults to 'Minimum {0}
     * item(s) required').  The {0} token will be replaced by the value of {@link #minSelections}.
     */
    minSelectionsText: 'Minimum {0} item(s) required',

    /**
     * @cfg {String} maxSelectionsText Validation message displayed when {@link #maxSelections} is not met (defaults to 'Maximum {0}
     * item(s) allowed').  The {0} token will be replaced by the value of {@link #maxSelections}.
     */
    maxSelectionsText: 'Maximum {0} item(s) allowed',

    /**
     * @cfg {String} delimiter The string used to delimit the selected values when {@link #getSubmitValue submitting}
     * the field as part of a form. Defaults to ','. If you wish to have the selected values submitted as separate
     * parameters rather than a single delimited parameter, set this to <tt>null</tt>.
     */
    delimiter: ',',

    /**
     * @cfg {Ext.data.Store/Array} store The data source to which this MultiSelect is bound (defaults to <tt>undefined</tt>).
     * Acceptable values for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b>any {@link Ext.data.Store Store} subclass</b></li>
     * <li><b>an Array</b> : Arrays will be converted to a {@link Ext.data.ArrayStore} internally.
     * <div class="mdetail-params"><ul>
     * <li><b>1-dimensional array</b> : (e.g., <tt>['Foo','Bar']</tt>)<div class="sub-desc">
     * A 1-dimensional array will automatically be expanded (each array item will be the combo
     * {@link #valueField value} and {@link #displayField text})</div></li>
     * <li><b>2-dimensional array</b> : (e.g., <tt>[['f','Foo'],['b','Bar']]</tt>)<div class="sub-desc">
     * For a multi-dimensional array, the value in index 0 of each item will be assumed to be the combo
     * {@link #valueField value}, while the value at index 1 is assumed to be the combo {@link #displayField text}.
     * </div></li></ul></div></li></ul></div>
     */

    componentLayout: 'multiselectfield',

    fieldBodyCls: Ext.baseCSSPrefix + 'form-multiselect-body',


    // private
    initComponent: function(){
        var me = this;

        me.bindStore(me.store, true);
        if (me.store.autoCreated) {
            me.valueField = me.displayField = 'field1';
            if (!me.store.expanded) {
                me.displayField = 'field2';
            }
        }

        if (!Ext.isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        me.callParent();
    },

    bindStore: function(store, initial) {
        var me = this,
            oldStore = me.store,
            boundList = me.boundList;

        if (oldStore && !initial && oldStore !== store && oldStore.autoDestroy) {
            oldStore.destroyStore();
        }

        me.store = store ? Ext.data.StoreManager.lookup(store) : null;
        if (boundList) {
            boundList.bindStore(store || null);
        }
    },


    // private
    onRender: function(ct, position) {
        var me = this,
            panel, boundList, selModel;

        me.callParent(arguments);

        boundList = me.boundList = Ext.create('Ext.view.BoundList', {
            deferInitialRefresh: false,
            multiSelect: true,
            store: me.store,
            displayField: me.displayField,
            border: false,
            disabled: me.disabled
        });

        selModel = boundList.getSelectionModel();
        me.mon(selModel, {
            selectionChange: me.onSelectionChange,
            scope: me
        });

        panel = me.panel = Ext.create('Ext.panel.Panel', {
            title: me.listTitle,
            tbar: me.tbar,
            items: [boundList],
            renderTo: me.bodyEl,
            layout: 'fit'
        });

        // Must set upward link after first render
        panel.ownerCt = me;

        // Set selection to current value
        me.setRawValue(me.rawValue);
    },

    // No content generated via template, it's all added components
    getSubTplMarkup: function() {
        return '';
    },

    // private
    afterRender: function() {
        var me = this;
        me.callParent();

        if (me.ddReorder && !me.dragGroup && !me.dropGroup){
            me.dragGroup = me.dropGroup = 'MultiselectDD-' + Ext.id();
        }

        if (me.draggable || me.dragGroup){
            me.dragZone = Ext.create('Ext.view.DragZone', {
                view: me.boundList,
                ddGroup: me.dragGroup,
                dragText: '{0} Item{1}'
            });
        }
        if (me.droppable || me.dropGroup){
            me.dropZone = Ext.create('Ext.view.DropZone', {
                view: me.boundList,
                ddGroup: me.dropGroup,
                handleNodeDrop: function(data, dropRecord, position) {
                    var view = this.view,
                        store = view.getStore(),
                        records = data.records,
                        index;

                    // remove the Models from the source Store
                    data.view.store.remove(records);

                    index = store.indexOf(dropRecord);
                    if (position === 'after') {
                        index++;
                    }
                    store.insert(index, records);
                    view.getSelectionModel().select(records);
                }
            });
        }
    },

    onSelectionChange: function() {
        this.checkChange();
    },

    /**
     * Clears any values currently selected.
     */
    clearValue: function() {
        this.setValue([]);
    },

    /**
     * Return the value(s) to be submitted for this field. The returned value depends on the {@link #delimiter}
     * config: If it is set to a String value (like the default ',') then this will return the selected values
     * joined by the delimiter. If it is set to <tt>null</tt> then the values will be returned as an Array.
     */
    getSubmitValue: function() {
        var me = this,
            delimiter = me.delimiter,
            val = me.getValue();
        return Ext.isString(delimiter) ? val.join(delimiter) : val;
    },

    // inherit docs
    getRawValue: function() {
        var me = this,
            boundList = me.boundList;
        if (boundList) {
            me.rawValue = Ext.Array.map(boundList.getSelectionModel().getSelection(), function(model) {
                return model.get(me.valueField);
            });
        }
        return me.rawValue;
    },

    // inherit docs
    setRawValue: function(value) {
        var me = this,
            boundList = me.boundList,
            models;

        value = Ext.Array.from(value);
        me.rawValue = value;

        if (boundList) {
            models = [];
            Ext.Array.forEach(value, function(val) {
                var undef,
                    model = me.store.findRecord(me.valueField, val, undef, undef, true, true);
                if (model) {
                    models.push(model);
                }
            });
            boundList.getSelectionModel().select(models, false, true);
        }

        return value;
    },

    // no conversion
    valueToRaw: function(value) {
        return value;
    },

    // compare array values
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

    getErrors : function(value) {
        var me = this,
            format = Ext.String.format,
            errors = me.callParent(arguments),
            numSelected;

        value = Ext.Array.from(value || me.getValue());
        numSelected = value.length;

        if (!me.allowBlank && numSelected < 1) {
            errors.push(me.blankText);
        }
        if (numSelected < this.minSelections) {
            errors.push(format(me.minSelectionsText, me.minSelections));
        }
        if (numSelected > this.maxSelections) {
            errors.push(format(me.maxSelectionsText, me.maxSelections));
        }

        return errors;
    },

    onDisable: function() {
        var me = this;
        
        me.callParent();
        me.updateReadOnly();
        if (me.boundList) {
            me.boundList.disable();
        }
    },

    onEnable: function() {
        var me = this;
        
        me.callParent();
        me.updateReadOnly();
        if (me.boundList) {
            me.boundList.enable();
        }
    },

    setReadOnly: function(readOnly) {
        this.readOnly = readOnly;
        this.updateReadOnly();
    },

    /**
     * @private Lock or unlock the BoundList's selection model to match the current disabled/readonly state
     */
    updateReadOnly: function() {
        var me = this,
            boundList = me.boundList,
            readOnly = me.readOnly || me.disabled;
        if (boundList) {
            boundList.getSelectionModel().setLocked(readOnly);
        }
    },

    onDestroy: function(){
        Ext.destroyMembers(this, 'panel', 'boundList', 'dragZone', 'dropZone');
        this.callParent();
    }
});



 

/**
 * @class Ext.ux.form.ItemSelector
 * @extends Ext.form.field.Base
 * A control that allows selection of between two Ext.ux.form.MultiSelect controls.
 *
 *  @history
 *    2008-06-19 bpm Original code contributed by Toby Stuart (with contributions from Robert Williams)
 *
 * @constructor
 * Create a new ItemSelector
 * @param {Object} config Configuration options
 * @xtype itemselector 
 */
Ext.define('Ext.ux.form.ItemSelector', {
    extend: 'Ext.ux.form.MultiSelect',
    alias: ['widget.itemselectorfield', 'widget.itemselector'],
    alternateClassName: ['Ext.ux.ItemSelector'],
    requires: ['Ext.ux.layout.component.form.ItemSelector', 'Ext.button.Button'],
    
    hideNavIcons:false,

    /**
     * @cfg {Array} buttons Defines the set of buttons that should be displayed in between the ItemSelector
     * fields. Defaults to <tt>['top', 'up', 'add', 'remove', 'down', 'bottom']</tt>. These names are used
     * to build the button CSS class names, and to look up the button text labels in {@link #buttonsText}.
     * This can be overridden with a custom Array to change which buttons are displayed or their order.
     */
    buttons: ['top', 'up', 'add', 'remove', 'down', 'bottom'],

    buttonsText: {
        top: "Move to Top",
        up: "Move Up",
        add: "Add to Selected",
        remove: "Remove from Selected",
        down: "Move Down",
        bottom: "Move to Bottom"
    },

    /**
     * @cfg {Array} multiselects An optional array of {@link Ext.ux.form.MultiSelect} config objects, containing
     * additional configuration to be applied to the internal MultiSelect fields.
     */
    multiselects: [],

    componentLayout: 'itemselectorfield',

    fieldBodyCls: Ext.baseCSSPrefix + 'form-itemselector-body',


    bindStore: function(store, initial) {
        var me = this,
            toField = me.toField,
            fromField = me.fromField,
            models;

        me.callParent(arguments);

        if (toField) {
            // Clear both field stores
            toField.store.removeAll();
            fromField.store.removeAll();

            // Clone the contents of the main store into the fromField
            models = [];
            me.store.each(function(model) {
                models.push(model.copy(model.getId()));
            });
            fromField.store.add(models);
        }
    },

    onRender: function(ct, position) {
        var me = this,
            baseCSSPrefix = Ext.baseCSSPrefix,
            ddGroup = 'ItemSelectorDD-' + Ext.id(),
            commonConfig = {
                displayField: me.displayField,
                valueField: me.valueField,
                dragGroup: ddGroup,
                dropGroup: ddGroup,
                flex: 1,
                hideLabel: true,
                disabled: me.disabled
            },
            fromConfig = Ext.apply({
                listTitle: 'Available',
                store: Ext.create('Ext.data.Store', {model: me.store.model}), //blank store to begin
                listeners: {
                    boundList: {
                        itemdblclick: me.onItemDblClick,
                        scope: me
                    }
                }
            }, me.multiselects[0], commonConfig),
            toConfig = Ext.apply({
                listTitle: 'Selected',
                store: Ext.create('Ext.data.Store', {model: me.store.model}), //blank store to begin
                listeners: {
                    boundList: {
                        itemdblclick: me.onItemDblClick,
                        scope: me
                    },
                    change: me.onToFieldChange,
                    scope: me
                }
            }, me.multiselects[1], commonConfig),
            fromField = Ext.widget('multiselect', fromConfig),
            toField = Ext.widget('multiselect', toConfig),
            innerCt,
            buttons = [];

        // Skip MultiSelect's onRender as we don't want its content
        Ext.ux.form.MultiSelect.superclass.onRender.call(me, ct, position);

        me.fromField = fromField;
        me.toField = toField;

        if (!me.hideNavIcons) {
            Ext.Array.forEach(me.buttons, function(name) {
                buttons.push({
                    xtype: 'button',
                    tooltip: me.buttonsText[name],
                    handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                    cls: baseCSSPrefix + 'form-itemselector-btn',
                    iconCls: baseCSSPrefix + 'form-itemselector-' + name,
                    scope: me
                });
                //div separator to force vertical stacking
                buttons.push({xtype: 'component', height: 3, width: 1, style: 'font-size:0;line-height:0'});
            });
        }

        innerCt = me.innerCt = Ext.widget('container', {
            renderTo: me.bodyEl,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                me.fromField,
                {
                    xtype: 'container',
                    margins: '0 4',
                    items: buttons
                },
                me.toField
            ]
        });

        // Must set upward link after first render
        innerCt.ownerCt = me;

        // Rebind the store so it gets cloned to the fromField
        me.bindStore(me.store);

        // Set the initial value
        me.setRawValue(me.rawValue);
    },
    
    onToFieldChange: function() {
        this.checkChange();
    },
    
    getSelections: function(list){
        var store = list.getStore(),
            selections = list.getSelectionModel().getSelection(),
            i = 0,
            len = selections.length;
            
        return Ext.Array.sort(selections, function(a, b){
            a = store.indexOf(a);
            b = store.indexOf(b);
            
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        });
    },

    onTopBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = selected.length - 1,
            selection;
        
        
        store.suspendEvents();
        for (; i > -1; --i) {
            selection = selected[i];
            store.remove(selected);
            store.insert(0, selected);
        }
        store.resumeEvents();
        list.refresh();    
    },

    onBottomBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            selection;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            store.remove(selection);
            store.add(selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onUpBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            selection,
            index;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            index = Math.max(0, store.indexOf(selection) - 1);
            store.remove(selection);
            store.insert(index, selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onDownBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            max = store.getCount(),
            selection,
            index;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            index = Math.min(max, store.indexOf(selection) + 1);
            store.remove(selection);
            store.insert(index, selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onAddBtnClick : function() {
        var me = this,
            fromList = me.fromField.boundList,
            selected = this.getSelections(fromList);
            
        fromList.getStore().remove(selected);
        this.toField.boundList.getStore().add(selected);
    },

    onRemoveBtnClick : function() {
        var me = this,
            toList = me.toField.boundList,
            selected = this.getSelections(toList);
            
        toList.getStore().remove(selected);
        this.fromField.boundList.getStore().add(selected);
    },

    onItemDblClick : function(view) {
        var me = this;
        if (view == me.toField.boundList){
            me.onRemoveBtnClick();
        }
        else if (view == me.fromField.boundList) {
            me.onAddBtnClick();
        }
    },

    setRawValue: function(value) {
        var me = this,
            Array = Ext.Array,
            toStore, fromStore, models;

        value = Array.from(value);
        me.rawValue = value;

        if (me.toField) {
            toStore = me.toField.boundList.getStore();
            fromStore = me.fromField.boundList.getStore();

            // Move any selected values back to the fromField
            fromStore.add(toStore.getRange());
            toStore.removeAll();

            // Move the new values over to the toField
            models = [];
            Ext.Array.forEach(value, function(val) {
                var undef,
                    model = fromStore.findRecord(me.valueField, val, undef, undef, true, true);
                if (model) {
                    models.push(model);
                }
            });
            fromStore.remove(models);
            toStore.add(models);
        }

        return value;
    },

    getRawValue: function() {
        var me = this,
            toField = me.toField,
            rawValue = me.rawValue;

        if (toField) {
            rawValue = Ext.Array.map(toField.boundList.getStore().getRange(), function(model) {
                return model.get(me.valueField);
            });
        }

        me.rawValue = rawValue;
        return rawValue;
    },

    /**
     * @private Cascade readOnly/disabled state to the sub-fields and buttons
     */
    updateReadOnly: function() {
        var me = this,
            readOnly = me.readOnly || me.disabled;

        if (me.rendered) {
            me.toField.setReadOnly(readOnly);
            me.fromField.setReadOnly(readOnly);
            Ext.Array.forEach(me.innerCt.query('button'), function(button) {
                button.setDisabled(readOnly);
            });
        }
    },
    
    onDisable: function(){
        this.callParent();
        var fromField = this.fromField;
        
        // if we have one, we have both, they get created at the same time    
        if (fromField) {
            fromField.disable();
            this.toField.disable();
        }
    },
    
    onEnable: function(){
        this.callParent();
        var fromField = this.fromField;
        
        // if we have one, we have both, they get created at the same time    
        if (fromField) {
            fromField.enable();
            this.toField.enable();
        }
    },

    onDestroy: function() {
        Ext.destroyMembers(this, 'innerCt');
        this.callParent();
    }

});

