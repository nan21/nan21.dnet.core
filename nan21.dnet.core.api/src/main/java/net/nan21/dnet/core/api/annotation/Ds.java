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
	 * Defines the default sort to be applied as an array of {@link SortField}.
	 * @return
	 */
	SortField[] sort() default {};
	
	/**
	 * Specifies a default where clause to be appended to the select statement as JPQL fragment.
	 * It is ignored if an expression based query is configured. 
	 * @return
	 */
	String jpqlWhere() default "";
	
	/**
	 * Defines the default sort to be applied. It is an alternative to the {@link SortField} array approach if you prefer to a more compact jpql sort fragment.
	 * It is ignored if the sort property is set. 
	 * It is also ignored if an expression based query is configured. 
	 * 
	 */
	String jpqlSort() default "";
}
 