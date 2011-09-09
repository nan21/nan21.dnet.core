package net.nan21.dnet.core.web.controller.data;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.DsCsvExport;
import net.nan21.dnet.core.presenter.action.DsJsonExport;
import net.nan21.dnet.core.presenter.action.DsXmlExport;
import net.nan21.dnet.core.web.result.ActionResultFind;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

public class AbstractDsReadController<M, P>
		extends AbstractDsBaseController<M, P> {
 

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
			
			authorizeActionService.authorize(resourceName.substring(0, resourceName.length()-2), "find");	
			
			IDsService<M, P> service = getDsService(this.resourceName);
			IQueryBuilder<M,P> builder = service.createQueryBuilder().addFetchLimit(
					resultStart, resultSize).addSortInfo(orderByCol,
					orderBySense);

			IDsMarshaller<M, P> marshaller = service
					.createMarshaller(dataFormat);

			M filter = marshaller.readDataFromString(dataString);
			P params = marshaller.readParamsFromString(paramString);

			List<M> list = service.find(filter, params, builder);
			long totalCount = service.count(filter, params, builder); // service.count(filter, params, builder);

			IActionResultFind result = this
					.packfindResult(list, params, totalCount);
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
			@RequestParam(value = "c[export_col_names]", required = true, defaultValue = "") String colNames,
			@RequestParam(value = "c[export_col_titles]", required = true, defaultValue = "") String colTitles,
			@RequestParam(value = "c[export_col_widths]", required = true, defaultValue = "") String colWidths,
			
			HttpServletResponse response) throws Exception {
		try {
			this.prepareRequest();
			this.resourceName = resourceName;
			this.dataFormat = dataFormat;
			
			authorizeActionService.authorize(resourceName.substring(0, resourceName.length()-2), "export");	
			
			IDsService<M, P> service = getDsService(this.resourceName);
			IQueryBuilder<M,P> builder = service.createQueryBuilder().addFetchLimit(
					resultStart, resultSize).addSortInfo(orderByCol,
					orderBySense);

			IDsMarshaller<M, P> marshaller = service
					.createMarshaller("json");

			M filter = marshaller.readDataFromString(dataString);
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
			if(writer==null) {
				throw new Exception("Invalid data-format "+dataFormat);
			}
			
			writer.setFieldNames(Arrays.asList(colNames.split(",")));
			writer.setFieldTitles(Arrays.asList(colTitles.split(",")));
			writer.setFieldWidths(Arrays.asList(colWidths.split(",")));

			writer.setOutFilePath(Session.params.get().getTempPath());
			service.doExport(filter, params, builder, writer);
			
			if(this.dataFormat.equalsIgnoreCase("csv")) {
				response.setContentType("application/vnd.ms-excel");
			}
			if(this.dataFormat.equalsIgnoreCase("json")) {
				response.setContentType("text/plain");
			}
			if(this.dataFormat.equalsIgnoreCase("xml")) {
				response.setContentType("text/xml");
			}
			response.setHeader("Content-Description", "File Transfer");
			response.setHeader("Content-Disposition",
	                "inline; filename=\"export_file."
	                        + this.dataFormat.toLowerCase() + "\";");
	        
			this.sendFile(writer.getOutFile(), response.getOutputStream() );
			return null;
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}

	}
	
	public IActionResultFind packfindResult(List<M> data, P params, long totalCount) {
		IActionResultFind pack = new ActionResultFind();
		pack.setData(data);
		pack.setParams(params);
		pack.setTotalCount(totalCount);
		return pack;
	}
 

}
