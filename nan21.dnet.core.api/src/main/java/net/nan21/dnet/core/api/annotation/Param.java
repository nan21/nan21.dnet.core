package net.nan21.dnet.core.api.annotation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * Annotation for a parameter definition. It is used within an {@link RefLookup}
 * to specify parameters for the named query which is used to lookup a reference
 * entity.
 * 
 * @author amathe
 * 
 */
@Target({ METHOD, FIELD, TYPE })
@Retention(RUNTIME)
public @interface Param {

	/**
	 * Parameter name as defined in the named-query.
	 */
	String name();

	/**
	 * Name of the DS-field whose value is used.
	 */
	String field();

}
