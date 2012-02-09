package net.nan21.dnet.core.presenter.action;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.Iterator;

import net.nan21.dnet.core.api.action.IDsExport;

public class DsHtmlExport<M> extends AbstractDsExport<M> implements IDsExport<M> {

	//private String rootTag = "records";
	
	public DsHtmlExport(Class<M> modelClass) {
		super(modelClass);	
		this.outFileExtension = "html";
	}

	@Override
	public void write(M data, boolean isFirst) throws IOException {
		Iterator<String> it = this.getFieldNames().iterator();
        StringBuffer sb = new StringBuffer();
        sb.append("<tr>");
        int i=1;
		int size = this.fieldTitles.size();
        while (it.hasNext()) {
            String k = it.next();
            try {
                Object x = this.fieldGetters.get(this.fieldGetterNames.get(k))
                        .invoke(data);
                if (x != null) {
                    if (x instanceof Date) {
                        sb.append("<td  class=\""+this.getCssClass(i,size,"data")+"\">" + this.serverDateFormat.format(x) + "</td>");
                    } else {
                        sb.append("<td  class=\""+this.getCssClass(i,size,"data")+"\">" + x.toString() + "</td>");
                    }                    
                } else {
                    sb.append("<td class=\""+this.getCssClass(i,size,"data")+"\">-</td>");
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
            i++;
        }
        sb.append("</tr>");
        this.bufferedWriter.write(sb.toString());
		
	}

	
	private String getCssClass(int idx, int len, String cssClass) {
		if (idx==1) {
    		return "first-"+cssClass;
    	}else if (idx == len ) {
    		return "last-"+cssClass;
    	} else {
    		return "middle-"+cssClass;
    	}
	}
	
	
	@Override
	protected void beginContent() throws Exception {
		StringBuffer sb = new StringBuffer();
		
		sb.append("<html><head>");
		sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+this.properties.get("cssUrl")+"\"/>");
		sb.append("</head>");
		sb.append("<body>");
		sb.append("<table class=\"result\">");
		sb.append("<thead><tr>");
		int i=1;
		int size = this.fieldTitles.size();
        for(String title: this.fieldTitles) {
        	sb.append("<th class=\""+this.getCssClass(i,size,"title")+"\">"+title+"</th>");
        	i++;
        }
        sb.append("</tr></thead>");
        sb.append("<tbody>");
        this.bufferedWriter.write(sb.toString());
	}

	@Override
	protected void endContent() throws Exception {
		this.bufferedWriter.write("</tbody>");
		this.bufferedWriter.write("</table>");
		this.bufferedWriter.write("</body>");
		this.bufferedWriter.write("</html>");
	}
 

	
}
