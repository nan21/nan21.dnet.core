package net.nan21.dnet.core.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.persistence.QueryHint;
/**
 * List of hints to be supplied to the query
 * @author amathe
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface DsQueryHints {

	/**
	 * Array of hints to be supplied to the query
	 * @return
	 */
	QueryHint[] value() default {};
}
