package net.nan21.dnet.core.presenter.service.asgn;

import net.nan21.dnet.core.api.service.IAsgnService;
import net.nan21.dnet.core.presenter.model.AbstractAsgnModel;

/**
 * Default base class for an assignment service. It can be exposed as an
 * assignment presenter service in case the standard functionality is
 * appropriate.
 * 
 * Consider implementing your own custom service which extends
 * {@link AbstractAsgnService} to customize standard behavior through the
 * provided template methods or necessary overrides.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public class DefaultAsgnService<M extends AbstractAsgnModel<E>, F, P, E>
		extends AbstractAsgnService<M, F, P, E> implements
		IAsgnService<M, F, P> {

}
