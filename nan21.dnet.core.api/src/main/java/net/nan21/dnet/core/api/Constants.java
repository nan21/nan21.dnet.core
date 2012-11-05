package net.nan21.dnet.core.api;

public class Constants {

	public static final String ENCODING = "UTF-8";
	public static final String DEFAULT_LANGUAGE = "en";
	public static final String DEFAULT_THEME_EXTJS = "gray";
	public static final String DEFAULT_THEME_STOUCH = "gray";

	/* Data format */

	public static final String DATA_FORMAT_CSV = "csv";
	public static final String DATA_FORMAT_JSON = "json";
	public static final String DATA_FORMAT_XML = "xml";
	public static final String DATA_FORMAT_HTML = "html";
	public static final String DATA_FORMAT_PDF = "pdf";

	/* DS actions */

	public static final String DS_QUERY = "find";
	public static final String DS_INSERT = "insert";
	public static final String DS_UPDATE = "update";
	public static final String DS_DELETE = "delete";
	public static final String DS_SAVE = "save";
	public static final String DS_IMPORT = "import";
	public static final String DS_EXPORT = "export";
	public static final String DS_PRINT = "print";
	public static final String DS_RPC = "rpc";

	/* Request parameters */

	public static final String REQUEST_PARAM_THEME = "theme";
	public static final String REQUEST_PARAM_LANG = "lang";

	public static final String REQUEST_PARAM_ACTION = "action";
	public static final String REQUEST_PARAM_DATA = "data";
	public static final String REQUEST_PARAM_FILTER = "data";
	public static final String REQUEST_PARAM_ADVANCED_FILTER = "filter";
	public static final String REQUEST_PARAM_PARAMS = "params";
	public static final String REQUEST_PARAM_SORT = "orderByCol";
	public static final String REQUEST_PARAM_SENSE = "orderBySense";
	public static final String REQUEST_PARAM_START = "resultStart";
	public static final String REQUEST_PARAM_SIZE = "resultSize";
	public static final String REQUEST_PARAM_ORDERBY = "orderBy";
	public static final String REQUEST_PARAM_EXPORT_TITLE = "export_title";
	public static final String REQUEST_PARAM_EXPORT_LAYOUT = "export_layout";
	public static final String REQUEST_PARAM_EXPORT_COL_NAMES = "export_col_names";
	public static final String REQUEST_PARAM_EXPORT_COL_TITLES = "export_col_titles";
	public static final String REQUEST_PARAM_EXPORT_COL_WIDTHS = "export_col_widths";
	public static final String REQUEST_PARAM_EXPORT_FILTER_NAMES = "export_filter_names";
	public static final String REQUEST_PARAM_EXPORT_FILTER_TITLES = "export_filter_titles";
	public static final String REQUEST_PARAM_SERVICE_NAME_PARAM = "rpcName";

	/* Cookie names */

	public static final String COOKIE_NAME_THEME = "dnet-theme";
	public static final String COOKIE_NAME_LANG = "dnet-lang";

	/* Default formats: DATE/TIME */

	public static final String EXTJS_DATE_FORMAT = "Y-m-d";
	public static final String EXTJS_TIME_FORMAT = "H:i";
	public static final String EXTJS_DATETIME_FORMAT = "Y-m-d H:i";
	public static final String EXTJS_DATETIMESEC_FORMAT = "Y-m-d H:i:s";
	public static final String EXTJS_MONTH_FORMAT = "Y-m";
	public static final String EXTJS_MODEL_DATE_FORMAT = "Y-m-d\\TH:i:s";
	public static final String EXTJS_ALT_FORMATS = "j|j.n|d|d.m";

	public static final String JAVA_DATE_FORMAT = "yyyy-MM-dd";
	public static final String JAVA_TIME_FORMAT = "kk:mm";
	public static final String JAVA_DATETIME_FORMAT = "yyyy-MM-dd kk:mm";

	/* Default formats: NUMBER */

	public static final String DECIMAL_SEPARATOR = ".";
	public static final String THOUSAND_SEPARATOR = ",";

	/* CSV settings */

	public static final char CSV_SEPARATOR = ';';
	public static final char CSV_QUOTECHAR = '"';
	public static final char CSV_ESCAPECHAR = '"';
	public static final String CSV_LINE_END = "\n";

}
