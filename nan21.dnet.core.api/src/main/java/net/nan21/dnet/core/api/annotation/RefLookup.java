package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface RefLookup {

	/**
	 * Reference entity class .
	 * 
	 * @return
	 */
	Class<?> refClass() default Object.class;

	/**
	 * Name of the DS-field which provides the ID for the reference entity.
	 * 
	 * @return
	 */
	String refId();

	/**
	 * Name of the named query to be used to lookup the reference in case the ID
	 * is not provided. It MUST be a an unique key based query which returns
	 * exactly one result for the given parameters.
	 * 
	 * @return
	 */
	String namedQuery() default "";

	/**
	 * Names of the DS-fields whose values are provided as parameters for the
	 * specified named query. The tenant field should not be specified as it is
	 * added automatically.
	 * 
	 * @return
	 */
	Param[] params() default {};
}
