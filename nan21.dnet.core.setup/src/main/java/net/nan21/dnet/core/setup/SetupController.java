package net.nan21.dnet.core.setup;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.setup.ISetupParticipant;
import net.nan21.dnet.core.api.setup.ISetupTask;
import net.nan21.dnet.core.api.setup.ISetupTaskParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.ModelAndView;

  
@Controller
public class SetupController {
	
	protected HttpServletRequest request; 
	@Autowired
	protected List<ISetupParticipant> participants;
	 
	@Autowired
	protected WebApplicationContext webappContext;

	@RequestMapping(value="/home")
	protected ModelAndView home(HttpServletRequest request) throws Exception {
		try {
			this.request = request;
			if(this.isAuthenticated()) {			 
				Map<String, Object> model = new HashMap<String, Object>();
				prepareListModel(model);
				if (model.containsKey("currentTask")) {
					return new ModelAndView("main", model);
				} else {
					return new ModelAndView("notasks", model);
				}				
			} else {
				return new ModelAndView("login");
			}
		} finally {
			Session.user.set(null);
		}		
	}

	@RequestMapping(value="/list") // delete this
	protected ModelAndView list(HttpServletRequest request) throws Exception {
		try {
			this.request = request;
			if(this.isAuthenticated()) {
				Map<String, Object> model = new HashMap<String, Object>();
				if (model.containsKey("currentTask")) {
					return new ModelAndView("main", model);
				} else {
					return new ModelAndView("notasks", model);
				}
			} else {
				return new ModelAndView("login");
			}
		} finally {
			Session.user.set(null);
		}	
	}
	 
	@RequestMapping(value="/doLogout" )
	protected ModelAndView doLogout(
			HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			request.getSession().removeAttribute("setupUser");
			response.sendRedirect("/nan21.dnet.core.welcome");
			return null;
		} finally {
			 
		}	
	}
	
	@RequestMapping(value="/doLogin",method=RequestMethod.POST)
	protected ModelAndView doLogin(
			@RequestParam(value = "user", required = true) String user,
			@RequestParam(value = "password", required = true) String password,
			HttpServletRequest request
		) throws Exception {
		try {
			this.request = request;
			boolean success = this.authenticate(user,password);
			if (success) {
				Map<String, Object> model = new HashMap<String, Object>();
				prepareListModel(model);
				if (model.containsKey("currentTask")) {
					return new ModelAndView("main", model);
				} else {
					return new ModelAndView("notasks", model);
				}	
			} else {
				Map<String, String> model = new HashMap<String, String>();
				model.put("error", "Invalid credentials. Authentication failed.");
				return new ModelAndView("login", model);
			}
		} finally {
			Session.user.set(null);
		}	
	}
	
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/doSetup")
	protected ModelAndView doSetup(
			@RequestParam(value = "taskId", required = true ) String taskId,
			@RequestParam(value = "bundleId", required = true ) String bundleId,
			HttpServletRequest request) throws Exception {	
		try {
			this.request = request;
			
			if(this.isAuthenticated()) {
				Map<String, Object> values = request.getParameterMap();
				for(ISetupParticipant participant :participants) {
					if (participant.getBundleId().equals(bundleId)) {
						ISetupTask task = participant.getTask(taskId);
						task.setParamValues(values);
						participant.run();
					}
				} 
				
				Map<String, Object> model = new HashMap<String, Object>();
				prepareListModel(model);
				
				if (model.containsKey("currentTask")) {
					return new ModelAndView("main", model);
				} else {
					return new ModelAndView("notasks", model);
				}	
			} else {
				return new ModelAndView("login");
			} 
		} finally {
			Session.user.set(null);
		}	
	}
	
	
	private void prepareListModel(Map<String, Object> model) {
		model.put("paramPrefix", ISetupTaskParam.PREFIX);
		if(participants.size()>0) {
			ISetupParticipant current = participants.get(0);
			if(current.getTasks().size()>0) {
				ISetupTask currentTask = current.getTasks().get(0);
				model.put("bundleId", current.getBundleId() );
				model.put("taskId", currentTask.getId() );
				model.put("currentTask", currentTask);
				model.put("current_title", currentTask.getTitle());
				model.put("current_description", currentTask.getDescription());
				model.put("current_bundle", current.getTargetName());
			}
		} 
	}
	private boolean isAuthenticated() {
		if(this.request.getSession().getAttribute("setupUser") != null) {
			Session.user.set( (User)this.request.getSession().getAttribute("setupUser"));
			return true;
		} else {
			return false;
		}
	}
	private boolean authenticate(String user, String password) {		 
		if(user.equals("admin") && password.equals("admin")) {
			User su = new User(user, user, password, false, false, false, true, null, null, null, null, null);
			Session.user.set(su);
			this.request.getSession().setAttribute("setupUser", su);
			return true;
		} else {
			return false;
		}
		
	}
	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	public List<ISetupParticipant> getParticipants() {
		return participants;
	}

	public void setParticipants(List<ISetupParticipant> participants) {
		this.participants = participants;
	}
 
}
