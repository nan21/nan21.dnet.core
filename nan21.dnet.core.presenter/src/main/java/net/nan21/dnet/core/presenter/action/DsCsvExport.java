package net.nan21.dnet.core.presenter.action;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.Iterator;

import net.nan21.dnet.core.api.action.IDsExport;

public class DsCsvExport<M> extends AbstractDsExport<M> implements IDsExport<M> {

	private char csvSeparator = ';';
	
	public DsCsvExport(Class<M> modelClass) {
		super(modelClass);
		this.outFileExtension = "csv";
	}

	
	@Override
	public void write(M data, boolean isFirst) throws IOException {
		Iterator<String> it = this.getFieldNames().iterator();
        StringBuffer sb = new StringBuffer();
        sb.append("\n");
        while (it.hasNext()) {
            String k = it.next();
            try {
                Object x = this.fieldGetters.get(this.fieldGetterNames.get(k))
                        .invoke(data);
                if (x != null) {
                    if (x instanceof Date) {                        
                        sb.append('"' + this.serverDateFormat.format(x) + '"');
                    } else {
                        sb.append('"' + x.toString() + '"');
                    }                     
                }
                
                if (it.hasNext()) {
                    sb.append(this.csvSeparator);
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
        this.bufferedWriter.write(sb.toString());
		
	}

	@Override
	protected void beginContent() throws Exception {
		boolean isFirst = true;
        for(String fn : this.getFieldNames() ) {
            if (!isFirst) { this.bufferedWriter.write(this.csvSeparator); }
            this.bufferedWriter.write("\"" + fn + "\"");
            isFirst = false;
        }
	}

	@Override
	protected void endContent() throws Exception {
		// TODO Auto-generated method stub
		
	}

	public char getCsvSeparator() {
		return csvSeparator;
	}

	public void setCsvSeparator(char csvSeparator) {
		this.csvSeparator = csvSeparator;
	}

 

}
