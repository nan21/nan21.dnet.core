package net.nan21.dnet.core.presenter.model;

import java.util.HashMap;
import java.util.Map;

import net.nan21.dnet.core.api.descriptor.IDsDescriptor;

public final class DsDescriptorManager {

	private static Map<String, IDsDescriptor> store = new HashMap<String, IDsDescriptor>();
	
	public static IDsDescriptor get(Class<?> dsClass) throws Exception {
		//TODO: check if it is a DsModel 
		String key = dsClass.getCanonicalName();
		if ( !store.containsKey(key)) {
			store.put(key, new DsDescriptor(dsClass));			
		}
		return store.get(key);		 
	}
	public static void remove(IDsDescriptor descriptor) {
		store.remove(descriptor.getDsClass().getCanonicalName());		
	}	
	
}
