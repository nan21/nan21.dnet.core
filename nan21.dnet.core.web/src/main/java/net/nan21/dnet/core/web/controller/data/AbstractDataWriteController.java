package net.nan21.dnet.core.web.controller.data;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.web.result.ActionResultFind;
import net.nan21.dnet.core.web.result.ActionResultSave;

public class AbstractDataWriteController<M extends IDsModel<?>, P extends IDsParam>
	extends AbstractDataReadController<M, P>{

	/**
	 * Default handler for insert action.
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method=RequestMethod.POST , params="action=insert")
	@ResponseBody
	public String insert(
				@PathVariable String resourceName,
				@PathVariable String dataformat,
				@RequestParam(value="data", required=false, defaultValue="[]") String dataString,
				@RequestParam(value="params", required=false, defaultValue="{}") String paramString				 
	) throws Exception {
		 
		this.resourceName = resourceName;		
		IDsService<M, P> service = getDsService();
		
		List<M> list = this.getMarshaller().readListFromString(dataString);
		P params = this.getMarshaller().readParamsFromString(paramString); 	
		
		service.insert(list);
		
		IActionResultSave result = this.packResult(list, params); 
		return this.getMarshaller().writeResultToString(result);
	}
	
	/**
	 * Default handler for update action.
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method=RequestMethod.POST , params="action=update")
	@ResponseBody
	public String update(
				@PathVariable String resourceName,
				@PathVariable String dataformat,
				@RequestParam(value="data", required=false, defaultValue="[]") String dataString,
				@RequestParam(value="params", required=false, defaultValue="{}") String paramString				 
	) throws Exception {
		
		this.resourceName = resourceName;		
		IDsService<M, P> service = getDsService();
		
		List<M> list = this.getMarshaller().readListFromString(dataString);
		P params = this.getMarshaller().readParamsFromString(paramString); 	
		
		service.update(list);

		IActionResultSave result = this.packResult(list, params); 
		return this.getMarshaller().writeResultToString(result);
	}
	
	public IActionResultSave packResult(List<M> data, P params ) {
		IActionResultSave pack = new ActionResultSave();
		pack.setData(data);
		pack.setParams(params);
		return pack;
	}
	
	 
}
