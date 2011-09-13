package net.nan21.dnet.core.presenter.model;

import java.util.HashMap;
import java.util.Map;

public final class ViewModelDescriptorManager {

	private static Map<String, AbstractViewModelDescriptor<?>> store = new HashMap<String, AbstractViewModelDescriptor<?>>();
	
	public static <M> DsDescriptor<M> getDsDescriptor(Class<M> modelClass) throws Exception {
	 
		boolean useCache = false;
		if (useCache) {
			String key = modelClass.getCanonicalName();
			if ( !store.containsKey(key)) {
				store.put(key, new DsDescriptor<M>(modelClass));			
			}
			return (DsDescriptor<M>)store.get(key);
		} else {
			return new DsDescriptor<M>(modelClass);
		}
				 
	}
	
	public static <M> AsgnDescriptor<M> getAsgnDescriptor(Class<M> modelClass) throws Exception {
		boolean useCache = false;
		if (useCache) {
			String key = modelClass.getCanonicalName();
			if ( !store.containsKey(key)) {
				store.put(key, new AsgnDescriptor<M>(modelClass));			
			}
			return (AsgnDescriptor<M>)store.get(key);	
		}else {
			return new AsgnDescriptor<M>(modelClass);
		}
		 
	}
	
	public static void remove(AbstractViewModelDescriptor<?> descriptor) {
		store.remove(descriptor.getModelClass().getCanonicalName());		
	}	
	
}
