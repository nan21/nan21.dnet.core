package net.nan21.dnet.core.presenter.model;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ModelPrinter {

	SimpleDateFormat dateFormat;

	public ModelPrinter() {
		dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm");
	}

	public String print(String v) {
		return v;
	}

	public String print(Boolean v) {
		return (v) ? "yes" : "no";
	}

	public String print(Integer v) {
		return v.toString();
	}

	public String print(Long v) {
		return v.toString();
	}

	public String print(Float v) {
		return v.toString();
	}

	public String print(BigDecimal v) {
		return v.toString();
	}

	public String print(Date v) {
		return dateFormat.format(v);
	}

}
