package net.nan21.dnet.core.welcome;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

public class HomeController extends AbstractController {

	private String productName;
	private String productVersion;
	private String jspName;
	
	public void setProductName(String productName) {
		this.productName = productName;
	}
 
	public void setProductVersion(String productVersion) {
		this.productVersion = productVersion;
	}
 	
	public String getProductName() {
		return productName;
	}

	public String getProductVersion() {
		return productVersion;
	}
	
	public String getJspName() {
		return jspName;
	}

	public void setJspName(String jspName) {
		this.jspName = jspName;
	}

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return new ModelAndView(this.jspName)
			.addObject("productName", this.productName)
			.addObject("productVersion", this.productVersion);
	}

}
