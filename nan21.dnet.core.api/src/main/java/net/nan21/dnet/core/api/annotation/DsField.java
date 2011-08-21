package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface DsField {
 
	/**
	 * Reference path to an attribute starting from the base entity.<br>
	 * For example:<br> 
	 *  <code>name</code> or <code>department.name</code> or <code>region.country.name</code> <br>
	 *  If it is not specified then the name of the field this annotation is attached to will be used on base entity.
	 */
	String path() default "" ;
	
	/**
	 * Specifies if this field should be included in the fetch.<br>
	 * If it references a transient (not persisted) field, set this flag to false. <br>
	 * By default is true.
	 * @return
	 */
	boolean fetch() default true;
	
	/**
	 * Used to specify the join type to be used if it is a nested expression.<br>
	 * By default an inner join is used.<br> 
	 * Possible values: left
	 * @return
	 */
	String join() default ""; // left
	
	/**
	 * Specifies a filter rule to be used when the JPQL where clause is built.
	 * The fragment is appended only when this filter field is not null.
	 * It is ignored if an expression based query is configured. 
	 * @return
	 */
	String jpqlFilter() default "";
}
