package net.nan21.dnet.core.presenter.service.asgn;

import net.nan21.dnet.core.api.service.IAsgnService;
import net.nan21.dnet.core.presenter.model.AbstractAsgnModel;

/**
 * Use {@link DefaultAsgnService}
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
@Deprecated
public class BaseAsgnService<M extends AbstractAsgnModel<E>, F, P, E> extends
		AbstractAsgnService<M, F, P, E> implements IAsgnService<M, F, P> {

}
