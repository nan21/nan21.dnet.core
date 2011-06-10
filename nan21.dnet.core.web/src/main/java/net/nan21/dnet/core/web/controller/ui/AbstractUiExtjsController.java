package net.nan21.dnet.core.web.controller.ui;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.IProductInfo;
import net.nan21.dnet.core.web.settings.UiExtjsSettings;

import org.springframework.web.servlet.mvc.AbstractController;

public abstract class AbstractUiExtjsController  extends AbstractController  {

	protected IProductInfo productInfo;	 
	protected String jspName;
	protected String deploymentUrl;
	protected String uiUrl;
	protected Map<String, Object> model;
	protected UiExtjsSettings uiExtjsSettings;
	  
	protected void _prepare(HttpServletRequest request,
			HttpServletResponse response) {
		
		String server = request.getServerName();
		int port = request.getServerPort();
		String contextPath = request.getContextPath();
		String path = request.getServletPath();
		 
		this.deploymentUrl = ((request.isSecure())? "https" : "http" ) + "://" +server +  ((port!=80)?(":"+port):"" ) + contextPath;
		this.uiUrl = deploymentUrl + path;
		
		this.model = new HashMap<String, Object>();
		
		this.model.put("deploymentUrl", this.deploymentUrl);
		this.model.put("uiUrl", this.uiUrl);
		this.model.put("product", this.productInfo);
		  
		this.model.put("urlUiExtjs", uiExtjsSettings.getUrlUiExtjs() );
		this.model.put("urlUiExtjsCore", uiExtjsSettings.getUrlUiExtjsCore() );
		this.model.put("urlUiExtjsLibExtjs", uiExtjsSettings.getUrlUiExtjsLibExtjs() );
		
		this.model.put("shortLanguage", "en" );
		this.model.put("theme", "gray" );
		
	}
	 
	
	public IProductInfo getProductInfo() {
		return productInfo;
	}


	public void setProductInfo(IProductInfo productInfo) {
		this.productInfo = productInfo;
	}


	public String getJspName() {
		return jspName;
	}

	public void setJspName(String jspName) {
		this.jspName = jspName;
	}

	
	public UiExtjsSettings getUiExtjsSettings() {
		return uiExtjsSettings;
	}

	public void setUiExtjsSettings(UiExtjsSettings uiExtjsSettings) {
		this.uiExtjsSettings = uiExtjsSettings;
	}
	
	
	
	
}
