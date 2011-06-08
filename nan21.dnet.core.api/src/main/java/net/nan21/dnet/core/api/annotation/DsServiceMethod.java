package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface DsServiceMethod {
	/**
	 * Type of service method:<br>
	 * Possible values:
	 * <li>data: service method on a data object</li>
	 * <li>filter: service method on a filter object</li>
	 * <li>selection: service method on a list of data object id's</li>
	 * @return
	 */
	String type() default "data" ; // filter,selection 	 
}
