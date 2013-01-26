package net.nan21.dnet.core.presenter.test.qb;

import java.util.ArrayList;
import java.util.List;

import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;
import net.nan21.dnet.core.presenter.model.DsDescriptor;
import net.nan21.dnet.core.presenter.model.FilterRule;
import net.nan21.dnet.core.presenter.model.ViewModelDescriptorManager;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class QueryBuilderWithJpqlTest {

	@SuppressWarnings("unchecked")
	@Test
	public void testQueryBuilderWithModelOnly() throws Exception {

		Model filter = new Model();

		User su = new User("test", "test", "test", false, false, false, true,
				"TEST", 1L, null, null, null, null, null);
		Session.user.set(su);

		try {

			// ==================== prepare ======================

			DsDescriptor<Model> descriptor = ViewModelDescriptorManager
					.getDsDescriptor(Model.class, false);

			@SuppressWarnings("rawtypes")
			QueryBuilderWithJpql qb = new QueryBuilderWithJpql();

			qb.setModelClass(Model.class);
			qb.setFilterClass(Model.class);

			qb.setBaseEql("BASE-EQL");
			qb.setDescriptor(descriptor);

			qb.setDefaultWhere(descriptor.getJpqlDefaultWhere());
			qb.setDefaultSort(descriptor.getJpqlDefaultSort());

			// ================== execute =======================

			filter.setCode("x");
			filter.setSequenceNoAlias(1);

			FilterRule rule;
			List<FilterRule> rules = new ArrayList<FilterRule>();

			// 1
			rule = new FilterRule();
			rule.setFieldName("code");
			rule.setOperation(QueryBuilderWithJpql.OP_EQ);
			rule.setValue1("a");
			rules.add(rule);

			// 2
			rule = new FilterRule();
			rule.setFieldName("code");
			rule.setOperation(QueryBuilderWithJpql.OP_NOT_EQ);
			rule.setValue1("a");
			rules.add(rule);

			// 3
			rule = new FilterRule();
			rule.setFieldName("code");
			rule.setOperation(QueryBuilderWithJpql.OP_LIKE);
			rule.setValue1("a");
			rules.add(rule);

			// 4
			rule = new FilterRule();
			rule.setFieldName("code");
			rule.setOperation(QueryBuilderWithJpql.OP_NOT_LIKE);
			rule.setValue1("a");
			rules.add(rule);

			// 5
			rule = new FilterRule();
			rule.setFieldName("id");
			rule.setOperation(QueryBuilderWithJpql.OP_GT);
			rule.setValue1("1");
			rules.add(rule);

			// 6
			rule = new FilterRule();
			rule.setFieldName("id");
			rule.setOperation(QueryBuilderWithJpql.OP_GT_EQ);
			rule.setValue1("1");
			rules.add(rule);

			// 7
			rule = new FilterRule();
			rule.setFieldName("id");
			rule.setOperation(QueryBuilderWithJpql.OP_LT);
			rule.setValue1("1");
			rules.add(rule);

			// 8
			rule = new FilterRule();
			rule.setFieldName("id");
			rule.setOperation(QueryBuilderWithJpql.OP_LT_EQ);
			rule.setValue1("1");
			rules.add(rule);

			// 9
			rule = new FilterRule();
			rule.setFieldName("id");
			rule.setOperation(QueryBuilderWithJpql.OP_BETWEEN);
			rule.setValue1("1");
			rule.setValue1("2");
			rules.add(rule);

			qb.setFilter(filter);
			qb.setFilterRules(rules);

			String expectedEql = "BASE-EQL join fetch e.parent1 left join fetch e.parent2 where  e.name not null  and e.sequenceNo > :sequenceNoAlias and e.code like :code and e.clientId = :clientId and e.code = :code_1 and e.code <> :code_2 and e.code like :code_3 and e.code not like :code_4 and e.id > :id_5 and e.id >= :id_6 and e.id < :id_7 and e.id <= :id_8 and e.id between :id_9_1 and :id_9_2 order by e.code,e.name desc";
			String resultEql = qb.buildQueryStatement();

			System.out.println("expected: " + expectedEql);
			System.out.println("result: " + resultEql);

			assertEquals(expectedEql, resultEql);
		} finally {
			Session.user.set(null);
		}
	}
}
