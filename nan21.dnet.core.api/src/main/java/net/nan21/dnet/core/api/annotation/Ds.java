package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Ds {
	
	/**
	 * Source entity class. 
	 * @return
	 */
	Class<?> entity();
	
	/**
	 * The data requested through this data-source must be owned by the employee account of the authenticated user.
	 * @return
	 */
	boolean userIsEmployee() default false;
	
	/**
	 * The data requested through this data-source must be owned by the authenticated user.
	 * @return
	 */
	boolean userIsOwner() default false;
	
	/**
	 * Sort criteria. Array of {@link SortField}
	 * @return
	 */
	SortField[] sort() default {};
}
 