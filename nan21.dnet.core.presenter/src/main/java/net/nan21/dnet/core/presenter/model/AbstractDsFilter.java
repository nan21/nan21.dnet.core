package net.nan21.dnet.core.presenter.model;

public abstract class AbstractDsFilter {
	
	protected Long _asLong_(Object val) {
		if ( val instanceof Long ) {
			return (Long) val;
		} 
		if ( val instanceof Integer ){
			return Long.valueOf((Integer)val);
		} 
		if ( val instanceof String ){
			return Long.valueOf((String)val);
		}
		return (Long) val;
	}	 
}
