package net.nan21.dnet.core.presenter.marshaller;

public class AbstractMarshaller<M,F,P> {
	
	protected Class<M> modelClass;
	protected Class<F> filterClass;
	protected Class<P> paramClass;
	 
	protected Class<M> getModelClass() {
		return this.modelClass;
	}

	public Class<F> getFilterClass() {
		return filterClass;
	}
	
	protected Class<P> getParamClass() {
		return this.paramClass;
	}
}
