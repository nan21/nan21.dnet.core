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
	 * <code>name</code> or <code>department.name</code> or
	 * <code>region.country.name</code> <br>
	 * If it is not specified then the name of the field this annotation is
	 * attached to will be used on base entity.
	 */
	String path() default "";

	/**
	 * Specifies if this field should be included in the fetch.<br>
	 * If it references a transient (not persisted) field, set this flag to
	 * false. <br>
	 * By default is true.
	 * 
	 * @return
	 */
	boolean fetch() default true;

	/**
	 * Used to specify the join type to be used if it is a nested expression.<br>
	 * By default an inner join is used.<br>
	 * For nested expressions a proper fetch-join is appended to the query or a
	 * FETCH/LEFT_FECTH query hint for deep nesting. However, if a
	 * {@link DsQueryHints} is specified at data-source level no hints are
	 * appended. In this case you'll have add in the {@link DsQueryHints} the
	 * hints required for nested fetches. <br>
	 * Possible values: left
	 * 
	 * @return
	 */
	String join() default ""; // left

	/**
	 * Specifies a filter rule to be used when the JPQL where clause is built.
	 * The fragment is appended only when this filter field is not null. It is
	 * ignored if an expression based query is configured.
	 * 
	 * @return
	 */
	String jpqlFilter() default "";

	/**
	 * Specifies the field(s) to be used for sort instead of the current field
	 * mapped. It is useful when the ds-field is mapped to a transient entity
	 * field. Allowed values: comma delimited entity attribute names.
	 * 
	 * @return
	 */
	String orderBy() default "";

	/**
	 * DS-field marked with this flag with true value doesn't update the value
	 * in the corresponding entity field on insert operation.<br>
	 * By default is false.
	 * 
	 * @return
	 */
	boolean noInsert() default false;

	/**
	 * DS-field marked with this flag with true value doesn't update the value
	 * in the corresponding entity field on update operation.<br>
	 * By default is false.
	 * 
	 * @return
	 */
	boolean noUpdate() default false;
}
