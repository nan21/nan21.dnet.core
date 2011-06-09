package net.nan21.dnet.core.presenter.marshaller;

public class AbstractMarshaller<M, P> {
	
	protected Class<M> modelClass;
	protected Class<P> paramClass;
	
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}
	
}
