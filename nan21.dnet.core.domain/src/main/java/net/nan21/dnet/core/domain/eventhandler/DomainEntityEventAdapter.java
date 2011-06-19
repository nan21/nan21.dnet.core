package net.nan21.dnet.core.domain.eventhandler;

import org.eclipse.persistence.config.DescriptorCustomizer;
import org.eclipse.persistence.descriptors.ClassDescriptor;
import org.eclipse.persistence.descriptors.DescriptorEventAdapter;

/**
 * Default event adapter definition for domain entities.
 * Triggers aboutToInsert and aboutToUpdate method calls on corresponding events.
 * It is used to populate the creation/modification audit fields.
 * For other logic use one of its subclasses. 
 * @author AMATHE
 *
 */
public class DomainEntityEventAdapter extends DescriptorEventAdapter
		implements DescriptorCustomizer {
	public void customize(ClassDescriptor descriptor) {		
		descriptor.getEventManager().setAboutToInsertSelector("aboutToInsert");		  
		descriptor.getEventManager().setAboutToUpdateSelector("aboutToUpdate");
		descriptor.getEventManager().addListener(this); 
	}
}
