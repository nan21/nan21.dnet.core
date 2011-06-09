package net.nan21.dnet.core.web.controller.data;

import java.util.List;

import net.nan21.dnet.core.api.action.IActionContextFind;
import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;

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
		IActionContextFind ctx = service.createContextFind(resultStart, resultSize, orderByCol, orderBySense);
		 
		M filter = this.getMarshaller().readDataFromString(dataString);
		P params = this.getMarshaller().readParamsFromString(paramString);
		
		List<M> list = service.find(filter, params, ctx);
		long totalCount = service.count(filter, params, ctx);
		
		IActionResultFind result = service.packResultFind(list, params, totalCount);		 
		return this.getMarshaller().writeResultToString(result);
		
	}

	/*
	 * protected IActionResultFind packActionResultFind(List<M> data, P params,
	 * long totalCount) { IActionResultFind result = new ActionResultFind();
	 * result.setData(data); result.setParams(params);
	 * result.setTotalCount(totalCount); return result; }
	 * 
	 * protected IActionResultSave packActionResultSave(List<M> data, P params)
	 * { IActionResultSave result = new ActionResultSave();
	 * result.setData(data); result.setParams(params); return result; }
	 */

 
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}

	protected IDsService<M, P> getDsService() {
		return null;
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
}
