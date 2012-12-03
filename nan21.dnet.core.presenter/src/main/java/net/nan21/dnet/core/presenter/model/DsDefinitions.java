package net.nan21.dnet.core.presenter.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import net.nan21.dnet.core.api.descriptor.IDsDefinition;
import net.nan21.dnet.core.api.descriptor.IDsDefinitions;

import org.springframework.beans.BeansException;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.TypedStringValue;
import org.springframework.beans.factory.support.ManagedMap;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class DsDefinitions implements IDsDefinitions, BeanFactoryAware,
		ApplicationContextAware {

	private BeanFactory beanFactory;

	private ApplicationContext applicationContext;

	@Override
	public Collection<IDsDefinition> getDsDefinitions() throws Exception {
		Collection<IDsDefinition> result = new ArrayList<IDsDefinition>();

		ConfigurableListableBeanFactory factory = (ConfigurableListableBeanFactory) beanFactory;

		String[] names = factory.getBeanDefinitionNames();

		for (int i = 0; i < names.length; i++) {

			String name = names[i];
			String modelClass = null;
			String readOnly = null;

			if (name.endsWith("DsService") || name.endsWith("AsgnService")) {

				BeanDefinition beanDef = factory.getBeanDefinition(name);

				DsDefinition dsDefinition = new DsDefinition();
				
				if (name.endsWith("AsgnService")) {
					dsDefinition.setAsgn(true);
					dsDefinition.setName(name.replace("AsgnService", ""));
				} else {
					dsDefinition.setName(name.replace("DsService", ""));
				}

				MutablePropertyValues mpv = beanDef.getPropertyValues();

				modelClass = ((TypedStringValue) mpv.getPropertyValue(
						"modelClass").getValue()).getValue();
				dsDefinition.setModelClass(this.applicationContext
						.getClassLoader().loadClass(modelClass));

				if (mpv.contains("readOnly")) {
					readOnly = ((TypedStringValue) mpv.getPropertyValue(
							"readOnly").getValue()).getValue();
					dsDefinition.setReadOnly(Boolean.getBoolean(readOnly));
				}

				if (mpv.contains("rpcData")) {
					@SuppressWarnings("unchecked")
					ManagedMap<TypedStringValue, Object> rpcData = (ManagedMap<TypedStringValue, Object>) mpv
							.getPropertyValue("rpcData").getValue();

					List<String> services = new ArrayList<String>();
					for (TypedStringValue tsv : rpcData.keySet()) {
						services.add(tsv.getValue());
					}
					dsDefinition.setServiceMethods(services);
				}

				if (mpv.contains("rpcFilter")) {
					@SuppressWarnings("unchecked")
					ManagedMap<TypedStringValue, Object> rpcFilter = (ManagedMap<TypedStringValue, Object>) mpv
							.getPropertyValue("rpcFilter").getValue();
					List<String> services = new ArrayList<String>();
					for (TypedStringValue tsv : rpcFilter.keySet()) {
						services.add(tsv.getValue());
					}
					dsDefinition.setServiceMethods(services);
				}
				
				result.add(dsDefinition);
			}
		}
		return result;
	}

	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		this.beanFactory = beanFactory;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext = applicationContext;
	}

}
