 
Ext.define('dnet.core.dashboard.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',

    layout: 'anchor',
    defaultType: 'portlet',
    cls: 'x-portal-column'

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});