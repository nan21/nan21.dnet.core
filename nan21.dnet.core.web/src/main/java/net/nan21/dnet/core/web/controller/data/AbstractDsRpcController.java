package net.nan21.dnet.core.web.controller.data;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.action.IActionResultRpcData;
import net.nan21.dnet.core.api.action.IActionResultRpcFilter;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.web.result.ActionResultRpcData;
import net.nan21.dnet.core.web.result.ActionResultRpcFilter;

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
	@RequestMapping(params = { "action=rpc", "rpcType=data" })
	@ResponseBody
	public String rpcData(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "rpcName", required = true) String rpcName,
			@RequestParam(value = "data", required = false, defaultValue = "[]") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			this.prepareRequest(request, response);
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;

			this.authorizeAction(resourceName.substring(0, resourceName
					.length() - 2), rpcName);

			if (this.dataFormat.equals("stream")) {
				IDsService<M, F, P> service = this
						.findDsService(this.resourceName);
				IDsMarshaller<M, F, P> marshaller = service
						.createMarshaller("json");

				M data = marshaller.readDataFromString(dataString);
				P params = marshaller.readParamsFromString(paramString);

				InputStream s = service.rpcDataStream(rpcName, data, params);
				this.sendFile(s, response.getOutputStream());
				return "";
			} else {
				IDsService<M, F, P> service = this
						.findDsService(this.resourceName);
				IDsMarshaller<M, F, P> marshaller = service
						.createMarshaller(dataFormat);

				M data = marshaller.readDataFromString(dataString);
				P params = marshaller.readParamsFromString(paramString);

				service.rpcData(rpcName, data, params);
				IActionResultRpcData result = this.packRpcDataResult(data,
						params);
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
	@RequestMapping(method = RequestMethod.POST, params = { "action=rpc",
			"rpcType=filter" })
	@ResponseBody
	public String rpcFilter(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "rpcName", required = true) String rpcName,
			@RequestParam(value = "data", required = false, defaultValue = "{}") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			this.prepareRequest(request, response);
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;

			this.authorizeAction(resourceName.substring(0, resourceName
					.length() - 2), rpcName);

			IDsService<M, F, P> service = this.findDsService(this.resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			F filter = marshaller.readFilterFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			service.rpcFilter(rpcName, filter, params);
			IActionResultRpcFilter result = this.packRpcFilterResult(filter,
					params);
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
