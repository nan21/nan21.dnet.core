package net.nan21.dnet.core.presenter.service.ds;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;
import net.nan21.dnet.core.presenter.model.RpcDefinition;
import net.nan21.dnet.core.presenter.service.AbstractPresenterBaseService;

/**
 * Implements the rpc(remote-procedure call) actions for an entity-ds. See the
 * super-classes for more details.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractEntityDsRpcService<M extends AbstractDsModel<E>, F, P, E>
		extends AbstractEntityDsWriteService<M, F, P, E> {

	private Map<String, RpcDefinition> rpcData = new HashMap<String, RpcDefinition>();
	private Map<String, RpcDefinition> rpcFilter = new HashMap<String, RpcDefinition>();

	// ======================== RPC ===========================

	/**
	 * Execute an arbitrary service method with the data object.
	 */
	public void rpcData(String procedureName, M ds, P params) throws Exception {
		if (!rpcData.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: " + procedureName);
		}
		RpcDefinition def = rpcData.get(procedureName);
		AbstractPresenterBaseService delegate = def.getDelegateClass()
				.newInstance();
		this.prepareDelegate(delegate);
		Method m = null;
		boolean withParams = false;
		try {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getModelClass(), getParamClass());
			withParams = true;
		} catch (NoSuchMethodException e) {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getModelClass());
		}
		if (withParams) {
			m.invoke(delegate, ds, params);
		} else {
			m.invoke(delegate, ds);
		}
		if (def.getReloadFromEntity()) {
			if (ds instanceof IModelWithId) {
				if (((IModelWithId) ds).getId() != null) {
					E e = (E) this
							.getEntityService()
							.getEntityManager()
							.find(this.getEntityClass(),
									((IModelWithId) ds).getId());
					this.getConverter().entityToModel(e, ds);
				}
			}
		}
		// delegate.execute(ds);
	}

	/**
	 * Execute an arbitrary service method with the data object returning a
	 * stream as result.
	 * 
	 * @param procedureName
	 * @param ds
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public InputStream rpcDataStream(String procedureName, M ds, P params)
			throws Exception {
		if (!rpcData.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: " + procedureName);
		}
		RpcDefinition def = rpcData.get(procedureName);
		AbstractPresenterBaseService delegate = def.getDelegateClass()
				.newInstance();
		this.prepareDelegate(delegate);

		Method m = null;
		boolean withParams = false;
		try {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getModelClass(), getParamClass());
			withParams = true;
		} catch (NoSuchMethodException e) {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getModelClass());
		}
		InputStream result = null;
		if (withParams) {
			result = (InputStream) m.invoke(delegate, ds, params);
		} else {
			result = (InputStream) m.invoke(delegate, ds);
		}

		// delegate.execute(ds);
		return result;
	}

	/**
	 * Execute an arbitrary service method with the filter object.
	 * 
	 * @param procedureName
	 * @param filter
	 * @param params
	 * @throws Exception
	 */
	public void rpcFilter(String procedureName, F filter, P params)
			throws Exception {
		if (!rpcFilter.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: " + procedureName);
		}
		RpcDefinition def = rpcFilter.get(procedureName);
		AbstractPresenterBaseService delegate = def.getDelegateClass()
				.newInstance();
		this.prepareDelegate(delegate);
		Method m = null;
		boolean withParams = false;
		try {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getFilterClass(), getParamClass());
			withParams = true;
		} catch (NoSuchMethodException e) {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getFilterClass());
		}
		if (withParams) {
			m.invoke(delegate, filter, params);
		} else {
			m.invoke(delegate, filter);
		}

		// delegate.execute(filter);
	}

	/**
	 * Execute an arbitrary service method with the filter object returning a
	 * stream as result.
	 * 
	 * @param procedureName
	 * @param filter
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public InputStream rpcFilterStream(String procedureName, F filter, P params)
			throws Exception {
		if (!rpcFilter.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: " + procedureName);
		}
		RpcDefinition def = rpcFilter.get(procedureName);
		AbstractPresenterBaseService delegate = def.getDelegateClass()
				.newInstance();
		this.prepareDelegate(delegate);
		Method m = null;
		boolean withParams = false;
		try {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getFilterClass(), getParamClass());
			withParams = true;
		} catch (NoSuchMethodException e) {
			m = def.getDelegateClass().getMethod(def.getMethodName(),
					getFilterClass());
		}
		InputStream result = null;
		if (withParams) {
			result = (InputStream) m.invoke(delegate, filter, params);
		} else {
			result = (InputStream) m.invoke(delegate, filter);
		}

		return result;
	}

	public void rpcData(String procedureName, List<M> list, P params)
			throws Exception {
		throw new Exception("Not implemented yet");
	}

	public InputStream rpcDataStream(String procedureName, List<M> list,
			P params) throws Exception {
		throw new Exception("Not implemented yet");
	}

	public Map<String, RpcDefinition> getRpcData() {
		return rpcData;
	}

	public void setRpcData(Map<String, RpcDefinition> rpcData) {
		this.rpcData = rpcData;
	}

	public Map<String, RpcDefinition> getRpcFilter() {
		return rpcFilter;
	}

	public void setRpcFilter(Map<String, RpcDefinition> rpcFilter) {
		this.rpcFilter = rpcFilter;
	}

}
