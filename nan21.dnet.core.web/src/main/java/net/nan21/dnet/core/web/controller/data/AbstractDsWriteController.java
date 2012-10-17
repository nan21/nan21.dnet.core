package net.nan21.dnet.core.web.controller.data;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.nan21.dnet.core.api.action.IActionResultDelete;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.web.result.ActionResultDelete;
import net.nan21.dnet.core.web.result.ActionResultSave;

public class AbstractDsWriteController<M, F, P> extends
		AbstractDsRpcController<M, F, P> {

	/**
	 * Default handler for insert action.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=insert")
	@ResponseBody
	public String insert(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "[]") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {

			StopWatch stopWatch = new StopWatch();
			stopWatch.start();

			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"insert");

			if (!dataString.startsWith("[")) {
				dataString = "[" + dataString + "]";
			}

			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			List<M> list = marshaller.readListFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			service.insert(list, params);

			IActionResultSave result = this.packResultSave(list, params);
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());

			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Default handler for update action.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=update")
	@ResponseBody
	public String update(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "[]") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {

			StopWatch stopWatch = new StopWatch();
			stopWatch.start();

			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"update");

			if (!dataString.startsWith("[")) {
				dataString = "[" + dataString + "]";
			}
			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			List<M> list = marshaller.readListFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			service.update(list, params);

			IActionResultSave result = this.packResultSave(list, params);
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());

			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			this.handleException(e, response);
			return null;
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Default handler for delete action.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param idsString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=delete")
	@ResponseBody
	public String delete(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "[]") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {

			StopWatch stopWatch = new StopWatch();
			stopWatch.start();

			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"delete");

			if (!dataString.startsWith("[")) {
				dataString = "[" + dataString + "]";
			}
			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			List<M> list = marshaller.readListFromString(dataString);
			// P params = marshaller.readParamsFromString(paramString);

			List<Object> ids = new ArrayList<Object>();
			for (M ds : list) {
				ids.add(((IModelWithId) ds).getId());
			}
			service.deleteByIds(ids);

			IActionResultDelete result = this.packResultDelete();
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());

			return marshaller.writeResultToString(result);

		} catch (Exception e) {
			this.handleException(e, response);
			return null;
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Default handler for delete action.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param idsString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = "action=deleteById")
	@ResponseBody
	public String deleteById(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "[]") String idsString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {

			StopWatch stopWatch = new StopWatch();
			stopWatch.start();

			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"delete");

			if (!idsString.startsWith("[")) {
				idsString = "[" + idsString + "]";
			}
			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			List<Object> list = marshaller.readListFromString(idsString,
					Object.class);

			service.deleteByIds(list);

			IActionResultDelete result = this.packResultDelete();
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());

			return marshaller.writeResultToString(result);
		} catch (Exception e) {
			this.handleException(e, response);
			return null;
		} finally {
			this.finishRequest();
		}
	}

	public IActionResultSave packResultSave(List<M> data, P params) {
		IActionResultSave pack = new ActionResultSave();
		pack.setData(data);
		// pack.setParams(params);
		return pack;
	}

	public IActionResultDelete packResultDelete() {
		IActionResultDelete pack = new ActionResultDelete();
		return pack;
	}

}
