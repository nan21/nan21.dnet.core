package net.nan21.dnet.core.web.controller.data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.action.SortToken;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.DsCsvExport;
import net.nan21.dnet.core.presenter.action.DsHtmlExport;
import net.nan21.dnet.core.presenter.action.DsJsonExport;
import net.nan21.dnet.core.presenter.action.DsXmlExport;
import net.nan21.dnet.core.web.result.ActionResultFind;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

public class AbstractDsReadController<M, F, P> extends
		AbstractDsController<M, F, P> {

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
	 * @param orderBy
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
			@RequestParam(value = "orderBy", required = false, defaultValue = "") String orderBy,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			StopWatch stopWatch = new StopWatch();
			stopWatch.start();
			this.prepareRequest(request, response);
			// this.resourceName = resourceName;
			// this.dataFormat = dataFormat;

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"find");

			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			IQueryBuilder<M, F, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize);

			if (orderBy != null && !orderBy.equals("")) {
				List<SortToken> sortTokens = marshaller.readListFromString(
						orderBy, SortToken.class);
				builder.addSortInfo(sortTokens);
			} else {
				builder.addSortInfo(orderByCol, orderBySense);
			}

			F filter = marshaller.readFilterFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			List<M> list = service.find(filter, params, builder);
			long totalCount = service.count(filter, params, builder);

			IActionResultFind result = this.packfindResult(list, params,
					totalCount);
			stopWatch.stop();
			result.setExecutionTime(stopWatch.getTime());

			String out = marshaller.writeResultToString(result);
			return out;
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
	@RequestMapping(params = "action=export")
	@ResponseBody
	public String export(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = "data", required = false, defaultValue = "{}") String dataString,
			@RequestParam(value = "params", required = false, defaultValue = "{}") String paramString,
			@RequestParam(value = "resultStart", required = false, defaultValue = "0") int resultStart,
			@RequestParam(value = "resultSize", required = false, defaultValue = "500") int resultSize,
			@RequestParam(value = "orderByCol", required = false, defaultValue = "") String orderByCol,
			@RequestParam(value = "orderBySense", required = false, defaultValue = "") String orderBySense,
			@RequestParam(value = "orderBy", required = false, defaultValue = "") String orderBy,
			@RequestParam(value = "c[export_col_names]", required = true, defaultValue = "") String colNames,
			@RequestParam(value = "c[export_col_titles]", required = true, defaultValue = "") String colTitles,
			@RequestParam(value = "c[export_col_widths]", required = true, defaultValue = "") String colWidths,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);
			// this.resourceName = resourceName;
			// this.dataFormat = dataFormat;

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					"export");

			IDsService<M, F, P> service = this.findDsService(resourceName);
			IQueryBuilder<M, F, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller("json");

			if (orderBy != null && !orderBy.equals("")) {
				List<SortToken> sortTokens = marshaller.readListFromString(
						orderBy, SortToken.class);
				builder.addSortInfo(sortTokens);
			} else {
				builder.addSortInfo(orderByCol, orderBySense);
			}

			F filter = marshaller.readFilterFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			IDsExport<M> writer = null;
			if (dataFormat.equalsIgnoreCase("csv")) {
				writer = new DsCsvExport<M>(service.getModelClass());
			}
			if (dataFormat.equalsIgnoreCase("json")) {
				writer = new DsJsonExport<M>(service.getModelClass());
			}
			if (dataFormat.equalsIgnoreCase("xml")) {
				writer = new DsXmlExport<M>(service.getModelClass());
			}
			if (dataFormat.equalsIgnoreCase("pdf")) {
				writer = new DsXmlExport<M>(service.getModelClass());
			}
			if (dataFormat.equalsIgnoreCase("html")) {
				writer = new DsHtmlExport<M>(service.getModelClass());
				Map<String, Object> properties = new HashMap<String, Object>();
				properties.put("cssUrl", this.getSystemConfig()
						.getSysParamValue("CORE_EXP_HTML_CSS"));
				writer.setProperties(properties);
			}
			if (writer == null) {
				throw new Exception("Invalid data-format " + dataFormat);
			}

			writer.setFieldNames(Arrays.asList(colNames.split(",")));
			writer.setFieldTitles(Arrays.asList(colTitles.split(",")));
			writer.setFieldWidths(Arrays.asList(colWidths.split(",")));

			writer.setOutFilePath(Session.params.get().getTempPath());
			service.doExport(filter, params, builder, writer);

			if (dataFormat.equalsIgnoreCase("csv")) {
				response.setContentType("application/vnd.ms-excel");
			}
			if (dataFormat.equalsIgnoreCase("json")) {
				response.setContentType("text/plain");
			}
			if (dataFormat.equalsIgnoreCase("xml")) {
				response.setContentType("text/xml");
			}
			response.setHeader("Content-Description", "File Transfer");
			response.setHeader(
					"Content-Disposition",
					"inline; filename=\"export_file."
							+ dataFormat.toLowerCase() + "\";");

			this.sendFile(writer.getOutFile(), response.getOutputStream());
			return null;
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}

	public IActionResultFind packfindResult(List<M> data, P params,
			long totalCount) {
		IActionResultFind pack = new ActionResultFind();
		pack.setData(data);
		pack.setParams(params);
		pack.setTotalCount(totalCount);
		return pack;
	}

}
