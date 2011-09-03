/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.domain.eventhandler;

import org.eclipse.persistence.descriptors.ClassDescriptor;

public class DomainEntityBaseEventHandler extends DomainEntityEventAdapter  {

    @Override
    public void customize(ClassDescriptor descriptor) {
        super.customize(descriptor);
        descriptor.getEventManager().addListener(this);  
    }

}
