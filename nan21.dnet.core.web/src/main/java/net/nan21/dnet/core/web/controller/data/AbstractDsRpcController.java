package net.nan21.dnet.core.web.controller.data;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.Constants;
import net.nan21.dnet.core.api.action.IActionResultRpcData;
import net.nan21.dnet.core.api.action.IActionResultRpcFilter;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.web.result.ActionResultRpcData;
import net.nan21.dnet.core.web.result.ActionResultRpcFilter;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

public class AbstractDsRpcController<M, F, P> extends
		AbstractDsReadController<M, F, P> {

	/**
	 * Default handler for remote procedure call on a single value-object.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(params = {
			Constants.REQUEST_PARAM_ACTION + "=" + Constants.DS_RPC,
			Constants.DS_RPC + "Type=data" })
	@ResponseBody
	public String rpcData(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = Constants.REQUEST_PARAM_SERVICE_NAME_PARAM, required = true) String rpcName,
			@RequestParam(value = Constants.REQUEST_PARAM_DATA, required = false, defaultValue = "{}") String dataString,
			@RequestParam(value = Constants.REQUEST_PARAM_PARAMS, required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			StopWatch stopWatch = new StopWatch();
			stopWatch.start();
			if (logger.isDebugEnabled()) {
				logger.debug("Processing request: {}.{} -> action = {}-data / {}",
						new String[] { resourceName, dataFormat,
								Constants.DS_RPC,rpcName });
				logger.debug("  --> request-data: {} ",
						new String[] { dataString });
				logger.debug("  --> request-params: {} ",
						new String[] { paramString });
			}
			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					rpcName);

			if (dataFormat.equals("stream")) {
				IDsService<M, F, P> service = this.findDsService(resourceName);
				IDsMarshaller<M, F, P> marshaller = service
						.createMarshaller("json");

				M data = marshaller.readDataFromString(dataString);
				P params = marshaller.readParamsFromString(paramString);

				InputStream s = service.rpcDataStream(rpcName, data, params);
				this.sendFile(s, response.getOutputStream());
				return "";
			} else {
				IDsService<M, F, P> service = this.findDsService(resourceName);
				IDsMarshaller<M, F, P> marshaller = service
						.createMarshaller(dataFormat);

				M data = marshaller.readDataFromString(dataString);
				P params = marshaller.readParamsFromString(paramString);

				service.rpcData(rpcName, data, params);
				IActionResultRpcData result = this.packRpcDataResult(data,
						params);
				stopWatch.stop();
				result.setExecutionTime(stopWatch.getTime());
				return marshaller.writeResultToString(result);
			}

		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Default handler for remote procedure call on a filter.
	 * 
	 * @param resourceName
	 * @param dataformat
	 * @param dataString
	 * @param paramString
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST, params = {
			Constants.REQUEST_PARAM_ACTION + "=" + Constants.DS_RPC,
			Constants.DS_RPC + "Type=filter" })
	@ResponseBody
	public String rpcFilter(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = Constants.REQUEST_PARAM_SERVICE_NAME_PARAM, required = true) String rpcName,
			@RequestParam(value = Constants.REQUEST_PARAM_DATA, required = false, defaultValue = "{}") String dataString,
			@RequestParam(value = Constants.REQUEST_PARAM_PARAMS, required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			StopWatch stopWatch = new StopWatch();
			stopWatch.start();
			if (logger.isDebugEnabled()) {
				logger.debug("Processing request: {}.{} -> action = {}-filter / {}",
						new String[] { resourceName, dataFormat,
								Constants.DS_RPC,rpcName });
				logger.debug("  --> request-data: {} ",
						new String[] { dataString });
				logger.debug("  --> request-params: {} ",
						new String[] { paramString });
			}
			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					rpcName);

			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			F filter = marshaller.readFilterFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			service.rpcFilter(rpcName, filter, params);
			IActionResultRpcFilter result = this.packRpcFilterResult(filter,
					params);
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());
			return marshaller.writeResultToString(result);
		} finally {
			this.finishRequest();
		}
	}

	public IActionResultRpcData packRpcDataResult(M data, P params) {
		IActionResultRpcData pack = new ActionResultRpcData();
		pack.setData(data);
		pack.setParams(params);
		return pack;
	}

	public IActionResultRpcFilter packRpcFilterResult(F filter, P params) {
		IActionResultRpcFilter pack = new ActionResultRpcFilter();
		pack.setData(filter);
		pack.setParams(params);
		return pack;
	}

}
