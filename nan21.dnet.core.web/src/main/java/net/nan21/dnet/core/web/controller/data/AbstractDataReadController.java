package net.nan21.dnet.core.web.controller.data;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.web.result.ActionResultFind;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

public class AbstractDataReadController<M extends IDsModel<?>, P extends IDsParam>
		extends AbstractDataController {

	protected Class<M> modelClass;
	protected Class<P> paramClass;
	// protected IDsService<M, P> service;

	protected List<IDsServiceFactory> serviceFactories;

	// protected List<IDsService> osgiService;

	/**
	 * Default handler for find action.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @param resultStart
	 * @param resultSize
	 * @param orderByCol
	 * @param orderBySense
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=find")
	@ResponseBody
	public String find(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "{}") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			@RequestParam(value = "resultStart", required = false, defaultValue = "0") int resultStart,
			@RequestParam(value = "resultSize", required = false, defaultValue = "500") int resultSize,
			@RequestParam(value = "orderByCol", required = false, defaultValue = "") String orderByCol,
			@RequestParam(value = "orderBySense", required = false, defaultValue = "") String orderBySense,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IDsService<M, P> service = getDsService(this.resourceName);
			IQueryBuilder builder = service.createQueryBuilder().addFetchLimit(
					resultStart, resultSize).addSortInfo(orderByCol,
					orderBySense);

			IDsMarshaller<M, P> marshaller = service
					.createMarshaller(dataFormat);

			M filter = marshaller.readDataFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			List<M> list = service.find(filter, params, builder);
			long totalCount = 30L; // service.count(filter, params, builder);

			IActionResultFind result = this
					.packResult(list, params, totalCount);
			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}

	protected IDsService<M, P> getDsService(String dsName) throws Exception {
		IDsService<M, P> srv = null;
		for (IDsServiceFactory f : serviceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}

	public IActionResultFind packResult(List<M> data, P params, long totalCount) {
		IActionResultFind pack = new ActionResultFind();
		pack.setData(data);
		pack.setParams(params);
		pack.setTotalCount(totalCount);
		return pack;
	}

	public List<IDsServiceFactory> getServiceFactories() {
		return serviceFactories;
	}

	public void setServiceFactories(List<IDsServiceFactory> serviceFactories) {
		this.serviceFactories = serviceFactories;
	}

}
