package net.nan21.dnet.core.web.controller.data;

import java.util.List;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;
import net.nan21.dnet.core.presenter.service.BaseDsService;
import net.nan21.dnet.core.web.result.ActionResultFind;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

public class AbstractDataReadController<M extends IDsModel<?>, P extends IDsParam>
		extends AbstractDataController {
 
	protected Class<M> modelClass;
	protected Class<P> paramClass;
 
	private IDsMarshaller<M, P> marshaller;
	protected IDsService<M, P> service;
 
	/**
	 * Default handler for find action.
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
	@RequestMapping(method=RequestMethod.POST , params="action=find")
	@ResponseBody
	public String find(
				@PathVariable String resourceName,
				@PathVariable String dataformat,
				@RequestParam(value="data", required=false, defaultValue="{}") String dataString,
				@RequestParam(value="params", required=false, defaultValue="{}") String paramString,
				@RequestParam(value="resultStart", required=false, defaultValue="0") int resultStart,
				@RequestParam(value="resultSize", required=false, defaultValue="500") int resultSize,
				@RequestParam(value="orderByCol", required=false, defaultValue="" ) String orderByCol,
				@RequestParam(value="orderBySense", required=false, defaultValue="") String orderBySense
	) throws Exception {
		
		this.resourceName = resourceName;		
		IDsService<M, P> service = getDsService();
		IQueryBuilder builder = service.createQueryBuilder()
			.addFetchLimit(resultStart, resultSize)
			.addSortInfo(orderByCol, orderBySense);
		 
		 
		M filter = this.getMarshaller().readDataFromString(dataString);
		P params = this.getMarshaller().readParamsFromString(paramString);
		
		List<M> list = service.find(filter, params, builder);
		long totalCount = service.count(filter, params, builder);
		
		IActionResultFind result = this.packResult(list, params, totalCount);		 
		return this.getMarshaller().writeResultToString(result);
		
	}
 
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}

	protected IDsService<M, P> getDsService() {
		if (this.service == null) {
			this.service = (IDsService<M,P>)this.getWebappContext().getBean("osgiBaseDsService");
		}
		return this.service;
	}
	 
	protected IDsMarshaller<M, P> getMarshaller() {
		if (this.marshaller == null) {
			if (this.dataFormat.equals(IDsMarshaller.JSON)) {
				this.marshaller = new JsonMarshaller<M, P>(this.modelClass,
						this.paramClass);
			}
		}
		return this.marshaller;
	}
	
	public IActionResultFind packResult(List<M> data, P params, long totalCount) {
		IActionResultFind pack = new ActionResultFind();
		pack.setData(data);
		pack.setParams(params);
		pack.setTotalCount(totalCount);
		return pack;
	}
	
	 
	
}
