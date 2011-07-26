package net.nan21.dnet.core.web.controller.data;

import java.util.List;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;

import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;

public class AbstractDsBaseController<M, P>
		extends AbstractDataController  {
	
	protected Class<M> modelClass;
	protected Class<P> paramClass;

	protected List<IDsServiceFactory> serviceFactories;
	
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}
	
	public List<IDsServiceFactory> getServiceFactories() {
		return serviceFactories;
	}

	public void setServiceFactories(List<IDsServiceFactory> serviceFactories) {
		this.serviceFactories = serviceFactories;
	}
	
	protected IDsService<M, P> getDsService(String dsName) throws Exception {
		IDsService<M, P> srv = null;
		for (IDsServiceFactory f : serviceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					srv.setDsServiceFactories(serviceFactories);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}
}
