package net.nan21.dnet.core.presenter.action;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.util.StringUtils;

public abstract class AbstractDsExport<M> {

	protected Class<M> modelClass;
	protected BufferedWriter bufferedWriter;
	protected File outFile;
	protected String outFileName;
	protected String outFilePath;
	protected String outFileExtension;
	
	protected Map<String, String> fieldGetterNames;
	protected Map<String, Method> fieldGetters;

	protected List<String> fieldNames;
	protected List<String> fieldTitles;
	protected List<String> fieldWidths;
	
	
	
	protected SimpleDateFormat serverDateFormat;
	 
	
	public AbstractDsExport(Class<M> modelClass) {
		super();
		this.modelClass = modelClass;
		this.init();
	}

	public abstract void write(M data, boolean isFirst) throws IOException ;
	
	private void init() {
		this.serverDateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm");
		
		if (this.outFileName == null) {
			this.outFileName = UUID.randomUUID().toString();
		}

		this.fieldGetters = new HashMap<String, Method>();
		Method[] methods = this.modelClass.getDeclaredMethods();

		this.fieldGetterNames = new HashMap<String, String>();
		if (this.getFieldNames() == null) {
			for (int i = 0; i < methods.length; i++) {
				Method m = methods[i];
				if (m.getName().startsWith("get")) {
					String fn = m.getName().substring(3);
					fn = fn.substring(0, 1).toLowerCase() + fn.substring(1);
					this.addFieldName(fn);
					this.fieldGetterNames.put(fn, m.getName());
					this.fieldGetters.put(m.getName(), m);
				}
			}
		} else {

			for (String fn : this.getFieldNames()) {
				Method m;
				try {
					m = this.modelClass.getMethod("get"
							+ StringUtils.capitalize(fn), null);
					this.fieldGetterNames.put(fn, m.getName());
					this.fieldGetters.put(m.getName(), m);
				} catch (SecurityException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (NoSuchMethodException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}

	}

	public void begin() throws Exception {
        this.openWriter();
        this.beginContent();
    }
     
    public void end() throws Exception {
        this.endContent();
        this.closeWriter();
    }
    protected abstract void beginContent() throws Exception;
    protected abstract void endContent() throws Exception;
     
    private void openWriter() throws Exception {
        if (this.outFile == null) {
        	if (this.outFilePath == null || this.outFileName == null || this.outFileExtension == null) {
        		throw new Exception("Either a File or a file-path, file-name and file-extension must be provided");
        	}
        	File dir = new File(this.outFilePath );
        	if (!dir.exists()) {
        		dir.mkdirs();
        	}
        	this.outFile = File.createTempFile(this.outFileName, "."+this.outFileExtension, dir);            
        }         
        FileWriter fstream = new FileWriter(this.outFile);
        this.bufferedWriter = new BufferedWriter(fstream);
    }
    
    private void closeWriter() throws IOException {
        this.bufferedWriter.flush();
        this.bufferedWriter.close();
    }
    
	public List<String> getFieldNames() {
		return fieldNames;
	}

	public void setFieldNames(List<String> fieldNames) {
		this.fieldNames = fieldNames;
	}

	public List<String> getFieldTitles() {
		return fieldTitles;
	}

	public void setFieldTitles(List<String> fieldTitles) {
		this.fieldTitles = fieldTitles;
	}

	public List<String> getFieldWidths() {
		return fieldWidths;
	}

	public void setFieldWidths(List<String> fieldWidths) {
		this.fieldWidths = fieldWidths;
	}

	public void addFieldName(String e) {
		if (this.fieldNames == null) {
			this.fieldNames = new ArrayList<String>();
		}
		this.fieldNames.add(e);
	}

	public void addFieldTitle(String e) {
		if (this.fieldTitles == null) {
			this.fieldTitles = new ArrayList<String>();
		}
		this.fieldNames.add(e);
	}

	public void addFieldWidth(String e) {
		if (this.fieldWidths == null) {
			this.fieldWidths = new ArrayList<String>();
		}
		this.fieldNames.add(e);
	}

	public File getOutFile() {
		return outFile;
	}

	public void setOutFile(File outFile) {
		this.outFile = outFile;
	}

	public String getOutFilePath() {
		return outFilePath;
	}

	public void setOutFilePath(String outFilePath) {
		this.outFilePath = outFilePath;
	}

	public String getOutFileName() {
		return outFileName;
	}

	public void setOutFileName(String outFileName) {
		this.outFileName = outFileName;
	}

	public String getOutFileExtension() {
		return outFileExtension;
	}

}
