package net.nan21.dnet.core.api.descriptor;

import java.util.Collection;

public interface IDsDefinitions {

	/**
	 * Check if this context contains the given data-source definition. The
	 * lookup is performed appending a 'Service' suffix to the given name.
	 * 
	 * For example CountryDs data-source is declared as CountryDsService bean.
	 * 
	 * @param name
	 * @return
	 */
	public boolean containsDs(String name);

	/**
	 * Returns the definition for the given data-source name.
	 * 
	 * @param name
	 * @return
	 * @throws Exception
	 */
	public IDsDefinition getDsDefinition(String name) throws Exception;

	/**
	 * Returns a collection with all the data-source definitions from this
	 * context.
	 * 
	 * @return
	 * @throws Exception
	 */
	public Collection<IDsDefinition> getDsDefinitions() throws Exception;
}
