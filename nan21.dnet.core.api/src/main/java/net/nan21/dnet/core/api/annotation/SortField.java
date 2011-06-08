package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(value={})
public @interface SortField {
	
	/**
	 * Field name to sort.<br>
	 * Not null. 
	 * @return
	 */
	String field() default "";
	
	/**
	 * Descending sort. Default false.
	 * @return
	 */
	boolean desc() default false;
}
