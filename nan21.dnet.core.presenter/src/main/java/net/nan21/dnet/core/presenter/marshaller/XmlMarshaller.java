package net.nan21.dnet.core.presenter.marshaller;

import java.io.OutputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import net.nan21.dnet.core.api.action.IActionResultDelete;
import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultRpcData;
import net.nan21.dnet.core.api.action.IActionResultRpcFilter;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;

public class XmlMarshaller<M, F, P> extends AbstractMarshaller<M, F, P>
		implements IDsMarshaller<M, F, P> {

	public XmlMarshaller(Class<M> modelClass, Class<F> filterClass,
			Class<P> paramClass) throws Exception {

		this.modelClass = modelClass;
		this.filterClass = filterClass;
		this.paramClass = paramClass;

	}

	@Override
	public Object getDelegate() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public M readDataFromString(String source) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<M> readListFromString(String source) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <T> List<T> readListFromString(String source, Class<T> type)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public F readFilterFromString(String source) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public P readParamsFromString(String source) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String writeDataToString(M m) throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller().marshal(m, writer);
		return writer.toString();
	}

	@Override
	public String writeListToString(List<M> list) throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller().marshal(list, writer);
		return writer.toString();
	}

	@Override
	public String writeFilterToString(F f) throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller().marshal(f, writer);
		return writer.toString();
	}

	@Override
	public String writeParamsToString(P p) throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller().marshal(p, writer);
		return writer.toString();
	}

	@Override
	public String writeResultToString(IActionResultFind result)
			throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller(new Class[] { result.getClass() }).marshal(result,
				writer);
		return writer.toString();
	}

	@Override
	public String writeResultToString(IActionResultSave result)
			throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller(new Class[] { result.getClass() }).marshal(result,
				writer);
		return writer.toString();
	}

	@Override
	public String writeResultToString(IActionResultDelete result)
			throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller(new Class[] { result.getClass() }).marshal(result,
				writer);
		return writer.toString();
	}

	@Override
	public String writeResultToString(IActionResultRpcData result)
			throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller(new Class[] { result.getClass() }).marshal(result,
				writer);
		return writer.toString();
	}

	@Override
	public String writeResultToString(IActionResultRpcFilter result)
			throws Exception {
		StringWriter writer = new StringWriter();
		createMarshaller(new Class[] { result.getClass() }).marshal(result,
				writer);
		return writer.toString();
	}

	@Override
	public void writeDataToStream(M m, OutputStream out) throws Exception {
		createMarshaller().marshal(m, out);
	}

	@Override
	public void writeListToStream(List<M> list, OutputStream out)
			throws Exception {
		createMarshaller().marshal(list, out);
	}

	@Override
	public void writeFilterToStream(F f, OutputStream out) throws Exception {
		createMarshaller().marshal(f, out);
	}

	@Override
	public void writeParamsToStream(P p, OutputStream out) throws Exception {
		createMarshaller().marshal(p, out);
	}

	@Override
	public void writeResultToStream(IActionResultFind result, OutputStream out)
			throws Exception {
		createMarshaller(new Class[] { result.getClass() })
				.marshal(result, out);
	}

	@Override
	public void writeResultToStream(IActionResultSave result, OutputStream out)
			throws Exception {
		createMarshaller(new Class[] { result.getClass() })
				.marshal(result, out);
	}

	@Override
	public void writeResultToStream(IActionResultRpcData result,
			OutputStream out) throws Exception {
		createMarshaller(new Class[] { result.getClass() })
				.marshal(result, out);
	}

	@Override
	public void writeResultToStream(IActionResultRpcFilter result,
			OutputStream out) throws Exception {
		createMarshaller(new Class[] { result.getClass() })
				.marshal(result, out);
	}

	public Marshaller createMarshaller(Class<?>... classesToBeBound)
			throws JAXBException {

		List<Class<?>> classes = new ArrayList<Class<?>>();
		if (classesToBeBound != null) {
			for (int i = 0; i < classesToBeBound.length; i++) {
				classes.add(classesToBeBound[i]);
			}
		}

		classes.add(this.filterClass);
		classes.add(this.modelClass);
		if (this.paramClass != null) {
			classes.add(this.paramClass);
		}

		Class<?>[] x = classes.toArray(new Class<?>[] {});

		JAXBContext context = JAXBContext.newInstance(x);
		Marshaller m = context.createMarshaller();
		m.setProperty(javax.xml.bind.Marshaller.JAXB_FORMATTED_OUTPUT,
				Boolean.TRUE);
		m.setProperty(Marshaller.JAXB_SCHEMA_LOCATION, "");
		return m;
	}

}
