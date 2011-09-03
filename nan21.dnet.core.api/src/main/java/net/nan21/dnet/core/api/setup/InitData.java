package net.nan21.dnet.core.api.setup;

import java.util.List;

public class InitData {
	
	private String sequence;
	private String name;
	private List<InitDataItem> items;
	
	
	public String getSequence() {
		return sequence;
	}
	public void setSequence(String sequence) {
		this.sequence = sequence;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<InitDataItem> getItems() {
		return items;
	}
	public void setItems(List<InitDataItem> items) {
		this.items = items;
	}
	
	
	
}
