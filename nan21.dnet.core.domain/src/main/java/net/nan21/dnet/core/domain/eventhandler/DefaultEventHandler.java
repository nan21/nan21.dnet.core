package net.nan21.dnet.core.domain.eventhandler;

import org.eclipse.persistence.config.DescriptorCustomizer;
import org.eclipse.persistence.descriptors.ClassDescriptor;
import org.eclipse.persistence.descriptors.DescriptorEvent;
import org.eclipse.persistence.descriptors.DescriptorEventAdapter;

public class DefaultEventHandler extends DescriptorEventAdapter
		implements DescriptorCustomizer {
	
	public void customize(ClassDescriptor descriptor) {		
		descriptor.getEventManager().setAboutToInsertSelector("aboutToInsert");		  
		descriptor.getEventManager().setAboutToUpdateSelector("aboutToUpdate");
		descriptor.getEventManager().addListener(this); 
	}
	
	@Override
    public void postInsert(DescriptorEvent event) {
		this.processWriteEvent(event);
    }
	
 
   @Override
	public void postUpdate(DescriptorEvent event) {
	   this.processWriteEvent(event);
	}
     
	
   protected void processWriteEvent(DescriptorEvent event)
   { 
//       AuditEntry entry = new AuditEntry();
//       entry.setOperation(event.getEventCode() == 7 ? AuditEntry.UPDATE_OPERATION : 
//               AuditEntry.INSERT_OPERATION);
//       entry.setOperationTime(new Date());
//       entry.setResourceEntityId(event.getSource().hashCode());
//
//       Collection fields = new LinkedList();
//       WriteObjectQuery query = (WriteObjectQuery) event.getQuery();
//       Vector changes = query.getObjectChangeSet().getChanges();
//       for (int i = 0; i < changes.size(); i++)
//       {
//           if (changes.elementAt(i) instanceof DirectToFieldChangeRecord)
//           {
//               DirectToFieldChangeRecord fieldChange = (DirectToFieldChangeRecord) changes.elementAt(i);
//               AuditField field = new AuditField();
//               field.setAuditEntry(entry);
//               field.setFieldName(fieldChange.getAttribute());
//               field.setFieldValue(fieldChange.getNewValue().toString());
//               fields.add(field);
//           }
//       }
//       entry.setFields(fields);
//
//       InsertObjectQuery insertQuery = new InsertObjectQuery(entry);
//       event.getSession().executeQuery(insertQuery);
//       
//       for (AuditField field : fields)
//       {
//           insertQuery = new InsertObjectQuery(field);
//           event.getSession().executeQuery(insertQuery);
//       }
   }
	
	
}
