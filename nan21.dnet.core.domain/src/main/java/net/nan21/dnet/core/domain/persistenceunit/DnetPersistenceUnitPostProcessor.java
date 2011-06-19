/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.domain.persistenceunit;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.orm.jpa.persistenceunit.MutablePersistenceUnitInfo;
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitPostProcessor;

public class DnetPersistenceUnitPostProcessor implements
        PersistenceUnitPostProcessor {

    private String persistenceUnitName;
    private Properties persistenceProperties;
    private DataSource dataSource;
    private Map<String, List<String>> puiClasses = new HashMap<String, List<String>>();
    
    public DnetPersistenceUnitPostProcessor(final String persistenceUnitName,
            final DataSource dataSource, final Properties persistenceProperties) {
        this.persistenceUnitName = persistenceUnitName;
        this.persistenceProperties = persistenceProperties;
        this.dataSource = dataSource;
    }

    @Override
    public void postProcessPersistenceUnitInfo(
             MutablePersistenceUnitInfo pui) {
    	
    	List<String> classes = puiClasses.get(pui.getPersistenceUnitName());
    	  if (classes == null)
    	  {
    	   classes = new ArrayList<String>();
    	   puiClasses.put(pui.getPersistenceUnitName(), classes);
    	  }
    	  pui.getManagedClassNames().addAll(classes);

    	  final List<String> names = pui.getManagedClassNames();
    	  classes.addAll(pui.getManagedClassNames());
    	  
    	  
        if (this.persistenceUnitName.equals(pui.getPersistenceUnitName())) {            
            final Properties properties = pui.getProperties();
            for (final Map.Entry entries : this.persistenceProperties.entrySet()) {
                properties.put(entries.getKey(), entries.getValue());
            }

        }
    }

}
