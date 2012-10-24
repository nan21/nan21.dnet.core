package net.nan21.dnet.core.presenter.service.ds;

import net.nan21.dnet.core.presenter.model.AbstractDsModel;

/**
 * Top level abstract class for an entity-ds. Usually it is extended by custom
 * entity-ds services to inherit all the standard functionality and just
 * customize the non-standard behavior.
 * 
 * See the super-classes for more details.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractEntityDsService<M extends AbstractDsModel<E>, F, P, E>
		extends AbstractEntityDsRpcService<M, F, P, E> {

}
