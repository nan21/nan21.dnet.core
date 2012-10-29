package net.nan21.dnet.core.business.service.entity;

/**
 * Top level abstract class for an entity service. Usually it is extended by
 * custom entity services to inherit all the standard functionality and just
 * customize the non-standard behavior.
 * 
 * See the super-classes for more details.
 * 
 * @author amathe
 * 
 * @param <E>
 */
public abstract class AbstractEntityService<E> extends
		AbstractEntityWriteService<E> {

}
