package net.nan21.dnet.core.presenter.action;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.Iterator;

import net.nan21.dnet.core.api.action.IDsExport;

public class DsXmlExport<M> extends AbstractDsExport<M> implements IDsExport<M> {

	private String rootTag = "records";
	
	public DsXmlExport(Class<M> modelClass) {
		super(modelClass);	
		this.outFileExtension = "csv";
	}

	@Override
	public void write(M data, boolean isFirst) throws IOException {
		Iterator<String> it = this.getFieldNames().iterator();
        StringBuffer sb = new StringBuffer();
        sb.append("<record>");
        while (it.hasNext()) {
            String k = it.next();
            try {
                Object x = this.fieldGetters.get(this.fieldGetterNames.get(k))
                        .invoke(data);
                if (x != null) {
                    if (x instanceof Date) {
                        sb.append("<" + k + ">" + this.serverDateFormat.format(x) + "</" + k + ">");
                    } else {
                        sb.append("<" + k + ">" + x.toString() + "</" + k + ">");
                    }                    
                } else {
                    sb.append("<" + k + "></" + k + ">");
                }
            } catch (IllegalArgumentException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        sb.append("</record>");
        this.bufferedWriter.write(sb.toString());
		
	}

	@Override
	protected void beginContent() throws Exception {
		this.bufferedWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        this.bufferedWriter.write("<"+rootTag+">");
	}

	@Override
	protected void endContent() throws Exception {
		this.bufferedWriter.write("</"+rootTag+">");
	}

	public String getRootTag() {
		return rootTag;
	}

	public void setRootTag(String rootTag) {
		this.rootTag = rootTag;
	}

	
}
