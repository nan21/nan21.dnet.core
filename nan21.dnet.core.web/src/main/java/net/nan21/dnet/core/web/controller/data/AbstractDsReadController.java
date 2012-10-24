package net.nan21.dnet.core.web.controller.data;

import java.io.File;
import java.io.FileWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.Constants;
import net.nan21.dnet.core.api.SysParam;
import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.DsCsvExport;
import net.nan21.dnet.core.presenter.action.DsHtmlExport;
import net.nan21.dnet.core.presenter.action.DsJsonExport;
import net.nan21.dnet.core.presenter.action.DsXmlExport;
import net.nan21.dnet.core.presenter.model.FilterRule;
import net.nan21.dnet.core.presenter.model.ModelPrinter;
import net.nan21.dnet.core.presenter.model.SortToken;
import net.nan21.dnet.core.web.result.ActionResultFind;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import freemarker.template.Configuration;
import freemarker.template.ObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

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
	@RequestMapping(method = RequestMethod.POST, params = Constants.REQUEST_PARAM_ACTION
			+ "=" + Constants.DS_QUERY)
	@ResponseBody
	public String find(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = Constants.REQUEST_PARAM_FILTER, required = false, defaultValue = "{}") String filterString,
			@RequestParam(value = Constants.REQUEST_PARAM_ADVANCED_FILTER, required = false, defaultValue = "") String filterRulesString,
			@RequestParam(value = Constants.REQUEST_PARAM_PARAMS, required = false, defaultValue = "{}") String paramString,
			@RequestParam(value = Constants.REQUEST_PARAM_START, required = false, defaultValue = "0") int resultStart,
			@RequestParam(value = Constants.REQUEST_PARAM_SIZE, required = false, defaultValue = "500") int resultSize,
			@RequestParam(value = Constants.REQUEST_PARAM_SORT, required = false, defaultValue = "") String orderByCol,
			@RequestParam(value = Constants.REQUEST_PARAM_SENSE, required = false, defaultValue = "") String orderBySense,
			@RequestParam(value = Constants.REQUEST_PARAM_ORDERBY, required = false, defaultValue = "") String orderBy,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			StopWatch stopWatch = new StopWatch();
			stopWatch.start();
			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					Constants.DS_QUERY);

			IDsService<M, F, P> service = this.findDsService(resourceName);
			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller(dataFormat);

			F filter = marshaller.readFilterFromString(filterString);
			P params = marshaller.readParamsFromString(paramString);

			IQueryBuilder<M, F, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize).addFilter(filter)
					.addParams(params);

			if (orderBy != null && !orderBy.equals("")) {
				List<SortToken> sortTokens = marshaller.readListFromString(
						orderBy, SortToken.class);
				builder.addSortInfo(sortTokens);
			} else {
				builder.addSortInfo(orderByCol, orderBySense);
			}

			if (filterRulesString != null && !filterRulesString.equals("")) {
				List<FilterRule> filterRules = marshaller.readListFromString(
						filterRulesString, FilterRule.class);
				builder.addFilterRules(filterRules);
			}

			List<M> list = service.find(builder);
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
	 * Default handler for export action.
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
	@RequestMapping(params = Constants.REQUEST_PARAM_ACTION + "="
			+ Constants.DS_EXPORT)
	@ResponseBody
	public String export(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = Constants.REQUEST_PARAM_FILTER, required = false, defaultValue = "{}") String filterString,
			@RequestParam(value = Constants.REQUEST_PARAM_PARAMS, required = false, defaultValue = "{}") String paramString,
			@RequestParam(value = Constants.REQUEST_PARAM_START, required = false, defaultValue = "0") int resultStart,
			@RequestParam(value = Constants.REQUEST_PARAM_SIZE, required = false, defaultValue = "500") int resultSize,
			@RequestParam(value = Constants.REQUEST_PARAM_SORT, required = false, defaultValue = "") String orderByCol,
			@RequestParam(value = Constants.REQUEST_PARAM_SENSE, required = false, defaultValue = "") String orderBySense,
			@RequestParam(value = Constants.REQUEST_PARAM_ORDERBY, required = false, defaultValue = "") String orderBy,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_NAMES, required = true, defaultValue = "") String colNames,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_TITLES, required = true, defaultValue = "") String colTitles,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_WIDTHS, required = true, defaultValue = "") String colWidths,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					Constants.DS_EXPORT);

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

			F filter = marshaller.readFilterFromString(filterString);
			P params = marshaller.readParamsFromString(paramString);

			IDsExport<M> writer = null;
			if (dataFormat.equals(Constants.DATA_FORMAT_CSV)) {
				writer = new DsCsvExport<M>(service.getModelClass());
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_JSON)) {
				writer = new DsJsonExport<M>(service.getModelClass());
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_XML)) {
				writer = new DsXmlExport<M>(service.getModelClass());
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_PDF)) {
				writer = new DsXmlExport<M>(service.getModelClass());
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_HTML)) {
				writer = new DsHtmlExport<M>(service.getModelClass());
				Map<String, Object> properties = new HashMap<String, Object>();
				properties.put("cssUrl", this.getSystemConfig()
						.getSysParamValue(SysParam.CORE_EXP_HTML_CSS));
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

			if (dataFormat.equals(Constants.DATA_FORMAT_CSV)) {
				response.setContentType("application/vnd.ms-excel");
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_JSON)) {
				response.setContentType("text/plain");
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_HTML)) {
				response.setContentType("text/html");
			}
			if (dataFormat.equals(Constants.DATA_FORMAT_XML)) {
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

	@RequestMapping(params = Constants.REQUEST_PARAM_ACTION + "="
			+ Constants.DS_PRINT)
	@ResponseBody
	public String report(
			@PathVariable String resourceName,
			@PathVariable String dataFormat,
			@RequestParam(value = Constants.REQUEST_PARAM_FILTER, required = false, defaultValue = "{}") String filterString,
			@RequestParam(value = Constants.REQUEST_PARAM_PARAMS, required = false, defaultValue = "{}") String paramString,
			@RequestParam(value = Constants.REQUEST_PARAM_START, required = false, defaultValue = "0") int resultStart,
			@RequestParam(value = Constants.REQUEST_PARAM_SIZE, required = false, defaultValue = "500") int resultSize,
			@RequestParam(value = Constants.REQUEST_PARAM_SORT, required = false, defaultValue = "") String orderByCol,
			@RequestParam(value = Constants.REQUEST_PARAM_SENSE, required = false, defaultValue = "") String orderBySense,
			@RequestParam(value = Constants.REQUEST_PARAM_ORDERBY, required = false, defaultValue = "") String orderBy,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_NAMES, required = true, defaultValue = "") String colNames,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_TITLES, required = true, defaultValue = "") String colTitles,
			@RequestParam(value = Constants.REQUEST_PARAM_EXPORT_COL_WIDTHS, required = true, defaultValue = "") String colWidths,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			this.prepareRequest(request, response);

			this.authorizeDsAction(
					resourceName.substring(0, resourceName.length() - 2),
					Constants.DS_EXPORT);

			IDsService<M, F, P> service = this.findDsService(resourceName);

			IDsMarshaller<M, F, P> marshaller = service
					.createMarshaller("json");
			F filter = marshaller.readFilterFromString(filterString);
			P params = marshaller.readParamsFromString(paramString);

			IQueryBuilder<M, F, P> builder = service.createQueryBuilder()
					.addFetchLimit(resultStart, resultSize).addFilter(filter)
					.addParams(params);

			if (orderBy != null && !orderBy.equals("")) {
				List<SortToken> sortTokens = marshaller.readListFromString(
						orderBy, SortToken.class);
				builder.addSortInfo(sortTokens);
			} else {
				builder.addSortInfo(orderByCol, orderBySense);
			}

			List<M> data = service.find(builder);

			File resultFile = new File(Session.params.get().getTempPath() + "/"
					+ "print-list.html");

			Configuration cfg = new Configuration();

			cfg.setDirectoryForTemplateLoading(new File("D:/tmp/freemarker"));

			cfg.setObjectWrapper(ObjectWrapper.DEFAULT_WRAPPER);

			Map<String, Object> root = new HashMap<String, Object>();

			root.put("printer", new ModelPrinter());
			root.put("data", data);
			root.put("colNames", colNames.split(","));
			root.put("colTitles", colTitles.split(","));

			Map<String, Object> reportConfig = new HashMap<String, Object>();
			reportConfig.put("orientation", "portrait");
			reportConfig.put("title", "Report title");
			reportConfig.put(
					"logo",
					this.getSystemConfig().getSysParamValue(
							SysParam.CORE_LOGO_URL_REPORT));
			reportConfig.put("runBy", Session.user.get().getDisplayName());
			reportConfig.put("runAt", new Date());

			root.put("cfg", reportConfig);

			Template temp = cfg.getTemplate("test.ftl");

			Writer out = new FileWriter(resultFile);
			try {
				temp.process(root, out);
			} catch (TemplateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
			out.flush();

			if (dataFormat.equals(Constants.DATA_FORMAT_HTML)) {
				response.setContentType("text/html");
			}
			response.setHeader("Content-Description", "File Transfer");
			response.setHeader(
					"Content-Disposition",
					"inline; filename=\"export_file."
							+ dataFormat.toLowerCase() + "\";");

			this.sendFile(resultFile, response.getOutputStream());
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
