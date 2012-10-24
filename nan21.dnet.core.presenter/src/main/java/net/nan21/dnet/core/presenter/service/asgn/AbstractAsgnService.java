package net.nan21.dnet.core.presenter.service.asgn;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IAsgnTxService;
import net.nan21.dnet.core.api.service.IAsgnTxServiceFactory;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;
import net.nan21.dnet.core.presenter.model.AbstractAsgnModel;
import net.nan21.dnet.core.presenter.model.AsgnDescriptor;
import net.nan21.dnet.core.presenter.model.ViewModelDescriptorManager;
import net.nan21.dnet.core.presenter.service.AbstractPresenterReadService;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.StringUtils;

/**
 * Base abstract class for assignment service. An assignment component is used
 * to manage the many-to-many associations between entities.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractAsgnService<M extends AbstractAsgnModel<E>, F, P, E>
		extends AbstractPresenterReadService<M, F, P> {

	/**
	 * Source entity type it works with.
	 */
	private Class<E> entityClass;

	private AsgnDescriptor<M> descriptor;

	private List<IAsgnTxServiceFactory> asgnTxServiceFactories;
	/**
	 * Delegate service in business layer to perform transactions.
	 */
	private IAsgnTxService<E> txService;

	private String leftTable;
	private String rightTable;
	private String leftPkField = "id";
	private String rightObjectIdField;
	private String rightItemIdField;

	private String asgnTxFactoryName;

	private String selectionId;
	private Long objectId;

	// TODO: this becomes findasgTxService
	private IAsgnTxService<E> findTxService() throws Exception {
		for (IAsgnTxServiceFactory f : asgnTxServiceFactories) {
			if (this.asgnTxFactoryName != null
					&& this.asgnTxFactoryName.equals(f.getName())) {
				try {
					IAsgnTxService<E> es = f.create("baseAsgnTxService"); // this.getEntityClass()
					if (es != null) {
						// this.entityService = es;
						es.setEntityClass(entityClass);
						es.setObjectId(objectId);
						es.setSelectionId(selectionId);

						es.setLeftTable(leftTable);
						es.setRightItemIdField(rightItemIdField);
						es.setRightTable(rightTable);
						es.setRightObjectIdField(rightObjectIdField);
						es.setLeftPkField(leftPkField);
						return es;
					}
				} catch (NoSuchBeanDefinitionException e) {
					// service not found in this factory, ignore
				}
			}
		}
		throw new Exception("Transactional assignement service not found ");

	}

	public IAsgnTxService<E> getTxService() throws Exception {
		if (this.txService == null) {
			this.txService = this.findTxService();
		}
		return this.txService;
	}

	public void setTxService(IAsgnTxService<E> txService) {
		this.txService = txService;
	}

	/**
	 * Add the specified list of IDs to the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveRight(List<Long> ids) throws Exception {
		this.getTxService().moveRight(ids);
	}

	/**
	 * Add all the available values to the selected ones.
	 * 
	 * @throws Exception
	 */
	public void moveRightAll(F filter, P params) throws Exception {
		// TODO: send the filter also to move all according to filter
		this.getTxService().moveRightAll();
	}

	/**
	 * Remove the specified list of IDs from the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveLeft(List<Long> ids) throws Exception {
		this.getTxService().moveLeft(ids);
	}

	/**
	 * Remove all the selected values.
	 * 
	 * @throws Exception
	 */
	public void moveLeftAll(F filter, P params) throws Exception {
		// TODO: send the filter also to move all according to filter
		this.getTxService().moveLeftAll();
	}

	public void save() throws Exception {
		this.getTxService().save();
	}

	/**
	 * Initialize the component's temporary workspace.
	 * 
	 * @return the UUID of the selection
	 * @throws Exception
	 */
	public String setup(String asgnName) throws Exception {
		return this.getTxService().setup(asgnName);
	}

	/**
	 * Clean-up the temporary selections.
	 * 
	 * @throws Exception
	 */
	public void cleanup() throws Exception {
		this.getTxService().cleanup();
	}

	/**
	 * Restores all the changes made by the user to the initial state.
	 * 
	 * @throws Exception
	 */
	public void reset() throws Exception {
		this.getTxService().reset();
	}

	public List<M> findLeft(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception {
		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;

		bld.addFilterCondition(" e.clientId = :pClientId and e."
				+ this.leftPkField
				+ " not in (select x.itemId from TempAsgnLine x where x.selectionId = :pSelectionId)");

		bld.setFilter(filter);
		bld.setParams(params);

		List<M> result = new ArrayList<M>();
		TypedQuery<E> q = bld.createQuery(this.getEntityClass());
		q.setParameter("pClientId", Session.user.get().getClientId());
		q.setParameter("pSelectionId", this.selectionId);
		List<E> list = q.setFirstResult(bld.getResultStart())
				.setMaxResults(bld.getResultSize()).getResultList();
		for (E e : list) {
			M m = this.getModelClass().newInstance();
			entityToModel(e, m);
			result.add(m);
		}
		return result;
	}

	public List<M> findRight(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception {
		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;

		bld.addFilterCondition(" e.clientId = :pClientId and e."
				+ this.leftPkField
				+ " in (select x.itemId from TempAsgnLine x where x.selectionId = :pSelectionId)");
		bld.setFilter(filter);
		bld.setParams(params);

		List<M> result = new ArrayList<M>();

		TypedQuery<E> q = bld.createQuery(this.getEntityClass());
		q.setParameter("pClientId", Session.user.get().getClientId());
		q.setParameter("pSelectionId", this.selectionId);
		List<E> list = q.setFirstResult(bld.getResultStart())
				.setMaxResults(bld.getResultSize()).getResultList();
		for (E e : list) {
			M m = this.getModelClass().newInstance();
			entityToModel(e, m);
			result.add(m);
		}
		return result;
	}

	public void entityToModel(E e, M m) throws Exception {
		ExpressionParser parser = new SpelExpressionParser();
		StandardEvaluationContext context = new StandardEvaluationContext(e);
		Map<String, String> refpaths = this.getDescriptor().getE2mConv();
		Method[] methods = this.getModelClass().getMethods();
		for (Method method : methods) {
			if (!method.getName().equals("set__clientRecordId__")
					&& method.getName().startsWith("set")) {
				String fn = StringUtils.uncapitalize(method.getName()
						.substring(3));
				try {
					method.invoke(m, parser.parseExpression(refpaths.get(fn))
							.getValue(context));
				} catch (Exception exc) {

				}
			}
		}
	}

	public Long countLeft(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception {
		return this.count_(filter, params, builder);
	}

	public Long countRight(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception {
		return this.count_(filter, params, builder);
	}

	protected Long count_(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception {
		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;
		Query q = bld.createQueryCount();
		q.setParameter("pClientId", Session.user.get().getClientId());
		q.setParameter("pSelectionId", this.selectionId);
		Object count = q.getSingleResult();
		if (count instanceof Integer) {
			return ((Integer) count).longValue();
		} else {
			return (Long) count;
		}
	}

	public IDsMarshaller<M, F, P> createMarshaller(String dataFormat)
			throws Exception {
		IDsMarshaller<M, F, P> marshaller = null;
		if (dataFormat.equals(IDsMarshaller.JSON)) {
			marshaller = new JsonMarshaller<M, F, P>(this.getModelClass(),
					this.getFilterClass(), this.getParamClass());
		}
		return marshaller;
	}

	public IQueryBuilder<M, F, P> createQueryBuilder() throws Exception {
		QueryBuilderWithJpql<M, F, P> qb = new QueryBuilderWithJpql<M, F, P>();
		qb.setFilterClass(this.getFilterClass());
		qb.setParamClass(this.getParamClass());
		qb.setDescriptor(this.getDescriptor());
		qb.setEntityManager(this.getTxService().getEntityManager());
		qb.setSystemConfig(this.getSystemConfig());
		if (qb instanceof QueryBuilderWithJpql) {
			QueryBuilderWithJpql<M, F, P> jqb = (QueryBuilderWithJpql<M, F, P>) qb;
			jqb.setBaseEql("select e from "
					+ this.getEntityClass().getSimpleName() + " e");
			jqb.setBaseEqlCount("select count(1) from "
					+ this.getEntityClass().getSimpleName() + " e");

			if (this.getDescriptor().isWorksWithJpql()) {
				jqb.setDefaultWhere(this.getDescriptor().getJpqlDefaultWhere());
				jqb.setDefaultSort(this.getDescriptor().getJpqlDefaultSort());
			}
		}

		return qb;
	}

	// ==================== getters- setters =====================

	public String getSelectionId() {
		return selectionId;
	}

	public void setSelectionId(String selectionId) {
		this.selectionId = selectionId;
	}

	public Long getObjectId() {
		return objectId;
	}

	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}

	public Class<E> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

	public List<IAsgnTxServiceFactory> getAsgnTxServiceFactories() {
		return asgnTxServiceFactories;
	}

	public void setAsgnTxServiceFactories(
			List<IAsgnTxServiceFactory> asgnTxServiceFactories) {
		this.asgnTxServiceFactories = asgnTxServiceFactories;
	}

	public String getLeftTable() {
		return leftTable;
	}

	public void setLeftTable(String leftTable) {
		this.leftTable = leftTable;
	}

	public String getRightTable() {
		return rightTable;
	}

	public void setRightTable(String rightTable) {
		this.rightTable = rightTable;
	}

	public String getLeftPkField() {
		return leftPkField;
	}

	public void setLeftPkField(String leftPkField) {
		this.leftPkField = leftPkField;
	}

	public String getRightObjectIdField() {
		return rightObjectIdField;
	}

	public void setRightObjectIdField(String rightObjectIdField) {
		this.rightObjectIdField = rightObjectIdField;
	}

	public String getRightItemIdField() {
		return rightItemIdField;
	}

	public void setRightItemIdField(String rightItemIdField) {
		this.rightItemIdField = rightItemIdField;
	}

	public String getAsgnTxFactoryName() {
		return asgnTxFactoryName;
	}

	public void setAsgnTxFactoryName(String asgnTxFactoryName) {
		this.asgnTxFactoryName = asgnTxFactoryName;
	}

	public AsgnDescriptor<M> getDescriptor() throws Exception {
		if (this.descriptor == null) {
			this.descriptor = ViewModelDescriptorManager.getAsgnDescriptor(this
					.getModelClass(), this.getSystemConfig()
					.shouldCacheDescriptor());
		}
		return descriptor;
	}

	public void setDescriptor(AsgnDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}

}
