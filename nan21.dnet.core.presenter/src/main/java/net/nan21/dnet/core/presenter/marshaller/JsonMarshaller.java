package net.nan21.dnet.core.presenter.marshaller;

import java.io.OutputStream;
import java.util.List;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultRpcData;
import net.nan21.dnet.core.api.action.IActionResultRpcFilter;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.type.TypeFactory;

public class JsonMarshaller<M, P> extends AbstractMarshaller<M, P>
		implements IDsMarshaller<M, P> {

	private ObjectMapper mapper;
	 
	public JsonMarshaller(Class<M> modelClass, Class<P> paramClass) {
		
		this.modelClass = modelClass;
		this.paramClass = paramClass;
		
		this.mapper = new ObjectMapper();
        this.mapper.configure(
                SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS,
                false);
        this.mapper.configure(
        		SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS,
                false);
        this.mapper.configure(
                DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);
        
	}
	 
	@Override
	public M readDataFromString(String source) throws Exception {
		return this.mapper.readValue(source, getModelClass());
	}
	
	@Override
	public List<M> readListFromString(String source) throws Exception {
		return this.mapper.readValue(source,
    			TypeFactory.collectionType(List.class, getModelClass()));
	}	
	@Override
	public P readParamsFromString(String source) throws Exception {
		if(getParamClass() == null) {
			return null;
		} else {
			return this.mapper.readValue(source, getParamClass());
		}		
	}
	@Override
	public <T> List<T> readListFromString(String source, Class<T> type) throws Exception {
		return this.mapper.readValue(source,
    			TypeFactory.collectionType(List.class, type));
	}
	
	@Override
	public String writeDataToString(M m) throws Exception {
		return this.mapper.writeValueAsString(m);
	}
	@Override
	public String writeListToString(List<M> list) throws Exception {
		return this.mapper.writeValueAsString(list);
	}
	@Override
	public String writeParamsToString(P p) throws Exception {
		return this.mapper.writeValueAsString(p);
	}
	@Override
	public String writeResultToString(IActionResultFind result)
			throws Exception {
		return this.mapper.writeValueAsString(result);
	}
	@Override
	public String writeResultToString(IActionResultSave result)
			throws Exception {
		return this.mapper.writeValueAsString(result);
	}
	@Override
	public String writeResultToString(IActionResultRpcData result)
			throws Exception {
		return this.mapper.writeValueAsString(result);
	}
	@Override
	public String writeResultToString(IActionResultRpcFilter result)
			throws Exception {
		return this.mapper.writeValueAsString(result);
	}
	 
	@Override
	public void writeDataToStream(M m, OutputStream out) throws Exception {
		this.mapper.writeValue(out, m);
	} 
	@Override
	public void writeListToStream(List<M> list, OutputStream out)
			throws Exception {
		this.mapper.writeValue(out, list);
	}
	@Override
	public void writeParamsToStream(P p, OutputStream out) throws Exception {
		this.mapper.writeValue(out, p);
	}
	@Override
	public void writeResultToStream(IActionResultFind result, OutputStream out)
			throws Exception {
		this.mapper.writeValue(out, result);
	}

	@Override
	public void writeResultToStream(IActionResultSave result, OutputStream out)
			throws Exception {
		this.mapper.writeValue(out, result);
	}
	@Override
	public void writeResultToStream(IActionResultRpcData result, OutputStream out)
			throws Exception {
		this.mapper.writeValue(out, result);
	}
	@Override 
	public void writeResultToStream(IActionResultRpcFilter result, OutputStream out)
			throws Exception {
		this.mapper.writeValue(out, result);
	}
 
}
