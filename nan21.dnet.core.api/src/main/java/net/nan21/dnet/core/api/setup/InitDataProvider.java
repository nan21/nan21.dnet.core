package net.nan21.dnet.core.api.setup;

import java.util.ArrayList;
import java.util.List;

public class InitDataProvider implements IInitDataProvider {

	private List<InitData> list;

	public List<InitData> getList() {
		return list;
	}

	public void setList(List<InitData> list) {
		this.list = list;
	}

	public void addToList(InitData initData) {
		if (this.list == null) {
			this.list = new ArrayList<InitData>();
		}
		this.list.add(initData);
	}

}
