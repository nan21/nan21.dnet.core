package net.nan21.dnet.core.web.controller.data;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IAsgnService;
import net.nan21.dnet.core.presenter.service.ServiceLocator;
import net.nan21.dnet.core.web.result.ActionResultFind;

public class AbstractAsgnController<M, P> extends AbstractDataController {

	protected Class<M> modelClass;
	protected Class<P> paramClass;

	@Autowired
	private ServiceLocator serviceLocator;

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
	@RequestMapping(method = RequestMethod.POST, params = "action=findLeft")
	@ResponseBody
	public String find(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
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
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);

			IQueryBuilder<M, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize).addSortInfo(
							orderByCol, orderBySense);

			IDsMarshaller<M, P> marshaller = service
					.createMarshaller(dataFormat);

			M filter = marshaller.readDataFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			List<M> list = service.findLeft(filter, params, builder);
			long totalCount = service.countLeft(filter, params, builder); // service.count(filter,
																			// params,
																			// builder);

			IActionResultFind result = this.packfindResult(list, params,
					totalCount);
			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

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
	@RequestMapping(method = RequestMethod.POST, params = "action=findRight")
	@ResponseBody
	public String findRight(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
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
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);

			IQueryBuilder<M, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize).addSortInfo(
							orderByCol, orderBySense);

			IDsMarshaller<M, P> marshaller = service
					.createMarshaller(dataFormat);

			M filter = marshaller.readDataFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			List<M> list = service.findRight(filter, params, builder);
			long totalCount = service.countRight(filter, params, builder); // service.count(filter,
																			// params,
																			// builder);

			IActionResultFind result = this.packfindResult(list, params,
					totalCount);
			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * 
	 * @param resourceName
	 * @param dataFormat
	 * @param objectId
	 * @param selectionId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=setup")
	@ResponseBody
	public String setup(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));
			service.setObjectId(objectId);

			return service.setup(this.resourceName);
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

	/**
	 * 
	 * @param resourceName
	 * @param dataFormat
	 * @param objectId
	 * @param selectionId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=moveLeft")
	@ResponseBody
	public String moveLeft(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			@RequestParam(value = "p_selected_ids", required = true) String selectedIds,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);
			String[] tmp = selectedIds.split(",");
			List<Long> ids = new ArrayList<Long>();
			for (String i : tmp) {
				ids.add(new Long(i));
			}
			service.moveLeft(ids);

			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

	/**
	 * 
	 * @param resourceName
	 * @param dataFormat
	 * @param objectId
	 * @param selectionId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=moveRight")
	@ResponseBody
	public String moveRight(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			@RequestParam(value = "p_selected_ids", required = true) String selectedIds,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);
			String[] tmp = selectedIds.split(",");
			List<Long> ids = new ArrayList<Long>();
			for (String i : tmp) {
				ids.add(new Long(i));
			}
			service.moveRight(ids);

			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	@RequestMapping(method = RequestMethod.POST, params = "action=moveLeftAll")
	@ResponseBody
	public String moveLeftAll(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);

			service.moveLeftAll();

			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	@RequestMapping(method = RequestMethod.POST, params = "action=moveRightAll")
	@ResponseBody
	public String moveRightAll(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);

			service.moveRightAll();

			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

	@RequestMapping(method = RequestMethod.POST, params = "action=reset")
	@ResponseBody
	public String reset(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);
			service.reset();
			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	@RequestMapping(method = RequestMethod.POST, params = "action=save")
	@ResponseBody
	public String save(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "objectId", required = true) Long objectId,
			@RequestParam(value = "selectionId", required = true) String selectionId,
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			IAsgnService<M, P> service = this.findAsgnService(this
					.serviceNameFromResourceName(this.resourceName));

			service.setObjectId(objectId);
			service.setSelectionId(selectionId);
			service.save();
			return "";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	protected String serviceNameFromResourceName(String resourceName) {
		return resourceName + "AsgnService";
	}

	public IActionResultFind packfindResult(List<M> data, P params,
			long totalCount) {
		IActionResultFind pack = new ActionResultFind();
		pack.setData(data);
		pack.setParams(params);
		pack.setTotalCount(totalCount);
		return pack;
	}

	public IAsgnService<M, P> findAsgnService(String asgnName) throws Exception {
		return this.getServiceLocator().findAsgnService(asgnName);
	}

	// ===================== getters-setters ============================

	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}

	/**
	 * Get presenter service locator. If it is null attempts to retrieve it from
	 * Spring context.
	 * 
	 * @return
	 */
	public ServiceLocator getServiceLocator() {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.getWebappContext().getBean(
					ServiceLocator.class);
		}
		return serviceLocator;
	}

	/**
	 * Set presenter service locator.
	 * 
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocator serviceLocator) {
		this.serviceLocator = serviceLocator;
	}

}
