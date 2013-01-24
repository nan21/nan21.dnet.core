package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.ArrayList;
import java.util.List;

public class Dependencies {

	public static final String TYPE_DS = "ds";
	public static final String TYPE_DC = "dc";
	public static final String TYPE_LOV = "lov";
	public static final String TYPE_ASGN = "asgn";
	public static final String TYPE_UI = "frame";

	private List<String> ds;
	private List<String> dc;
	private List<String> lov;
	private List<String> asgn;

	public void addDs(String cmp) {
		if (this.ds == null) {
			this.ds = new ArrayList<String>();
		}
		if (!this.ds.contains(cmp)) {
			this.ds.add(cmp);
		}
	}

	public void addDc(String cmp) {
		if (this.dc == null) {
			this.dc = new ArrayList<String>();
		}
		if (!this.dc.contains(cmp)) {
			this.dc.add(cmp);
		}
	}

	public void addLov(String cmp) {
		if (this.lov == null) {
			this.lov = new ArrayList<String>();
		}
		if (!this.lov.contains(cmp)) {
			this.lov.add(cmp);
		}
	}

	public void addAsgn(String cmp) {
		if (this.asgn == null) {
			this.asgn = new ArrayList<String>();
		}
		if (!this.asgn.contains(cmp)) {
			this.asgn.add(cmp);
		}
	}

	public List<String> getDs() {
		return ds;
	}

	public void setDs(List<String> ds) {
		this.ds = ds;
	}

	public List<String> getDc() {
		return dc;
	}

	public void setDc(List<String> dc) {
		this.dc = dc;
	}

	public List<String> getLov() {
		return lov;
	}

	public void setLov(List<String> lov) {
		this.lov = lov;
	}

	public List<String> getAsgn() {
		return asgn;
	}

	public void setAsgn(List<String> asgn) {
		this.asgn = asgn;
	}

}
