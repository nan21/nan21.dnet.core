package net.nan21.dnet.core.presenter.service.ds;

import java.util.ArrayList;
import java.util.List;

import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.presenter.converter.AbstractDsConverter;
import net.nan21.dnet.core.presenter.converter.BaseDsConverter;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;
import net.nan21.dnet.core.presenter.model.DsDescriptor;
import net.nan21.dnet.core.presenter.model.ViewModelDescriptorManager;
import net.nan21.dnet.core.presenter.service.AbstractPresenterReadService;

/**
 * Base abstract class for entity based data-source service hierarchy. An
 * entity-data-source(referred to as entity-ds) is a specialized data-source
 * which provides view-model perspective(M) from a given persistence
 * perspective(E). <br>
 * Subclasses implement standard functionality for standard read actions (query,
 * export ), write actions (insert, update, delete, import) and remote procedure
 * call like method invocation (rpc).
 * 
 * Adds to its super-class an entity-type information.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractEntityDsBaseService<M extends AbstractDsModel<E>, F, P, E>
		extends AbstractPresenterReadService<M, F, P> {

	/**
	 * Source entity type it works with.
	 */
	private Class<E> entityClass;

	/**
	 * Converter class to be used for entity-to-ds and ds-to-entity conversions.
	 */
	private Class<? extends AbstractDsConverter<M, E>> converterClass;

	/**
	 * DS descriptor.
	 */
	private DsDescriptor<M> descriptor;

	public DsDescriptor<M> getDescriptor() throws Exception {
		if (this.descriptor == null) {
			this.descriptor = ViewModelDescriptorManager.getDsDescriptor(this
					.getModelClass(), this.getSystemConfig()
					.shouldCacheDescriptor());
		}
		return descriptor;
	}

	public void setDescriptor(DsDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}

	public IDsMarshaller<M, F, P> createMarshaller(String dataFormat)
			throws Exception {
		IDsMarshaller<M, F, P> marshaller = null;
		if (dataFormat.equals(IDsMarshaller.JSON)) {
			marshaller = new JsonMarshaller<M, F, P>(this.getModelClass(),
					this.getFilterClass(), this.getParamClass());
		}
		return marshaller;
	}

	public Class<E> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

	public Class<? extends AbstractDsConverter<M, E>> getConverterClass() {
		return converterClass;
	}

	public void setConverterClass(
			Class<? extends AbstractDsConverter<M, E>> converterClass) {
		this.converterClass = converterClass;
	}

	@SuppressWarnings("unchecked")
	protected IDsConverter<M, E> getConverter() throws Exception {
		AbstractDsConverter<M, E> converter;
		if (this.converterClass != null) {
			converter = this.converterClass.newInstance();
		} else {

			converter = BaseDsConverter.class.newInstance();
		}

		converter.setEntityManager(this.getEntityService().getEntityManager());
		converter.setAppContext(this.getApplicationContext());
		converter.setDescriptor(this.getDescriptor());
		converter.setEntityClass(this.getEntityClass());
		converter.setModelClass(this.getModelClass());
		converter.setServiceLocator(this.getServiceLocator());
		return converter;
	}

	public IEntityService<E> getEntityService() throws Exception {
		// if (this.entityService == null) {
		return this.findEntityService(this.getEntityClass());
		// }
		// return this.entityService;
	}

	// ======================== Helpers ===========================

	protected List<Object> collectIds(List<M> list) {
		List<Object> ids = new ArrayList<Object>();
		for (M ds : list) {
			ids.add(((IModelWithId) ds).getId());
		}
		return ids;
	}
}
