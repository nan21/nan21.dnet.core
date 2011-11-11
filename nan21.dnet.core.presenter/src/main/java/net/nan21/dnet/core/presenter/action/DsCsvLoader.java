package net.nan21.dnet.core.presenter.action;

import java.beans.PropertyEditorManager;
import java.io.File;
import java.io.FileReader;
import java.util.List;

import net.nan21.dnet.core.presenter.model.AbstractDsModel;
import net.nan21.dnet.core.presenter.propertyeditors.BooleanEditor;
import net.nan21.dnet.core.presenter.propertyeditors.DateEditor;
import net.nan21.dnet.core.presenter.propertyeditors.IntegerEditor;
import net.nan21.dnet.core.presenter.propertyeditors.LongEditor;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.bean.ColumnPositionMappingStrategy;
import au.com.bytecode.opencsv.bean.CsvToBean;
import au.com.bytecode.opencsv.bean.HeaderColumnNameMappingStrategy;

public class DsCsvLoader {
	
	private char separator =';';
	private char quoteChar = '"' ;
	
	public DsCsvLoader() {
		PropertyEditorManager.registerEditor(
				java.lang.Boolean.class, 
				BooleanEditor.class );
		PropertyEditorManager.registerEditor(
                java.lang.Long.class,
                LongEditor.class );
		PropertyEditorManager.registerEditor(
                java.lang.Integer.class, 
                IntegerEditor.class ); 
		PropertyEditorManager.registerEditor(
				java.util.Date.class, 
                DateEditor.class );
	}
	
	
	public <M> List<M> run(File file, Class<M> dsClass, String[] columns) throws Exception {
		 
		FileReader fileReader = null;	     
	    CSVReader reader = null;
		try {
            List<M> list = null;
           // file = new File(this.path + "/"+ this.fileName);
            fileReader =  new FileReader(file);
            if (columns != null) {
            	reader = new CSVReader(fileReader,this.separator, this.quoteChar, 1);
            	CsvToBean<M> csv = new CsvToBean<M>();
            	ColumnPositionMappingStrategy<M> strategy = new ColumnPositionMappingStrategy<M>();
            	strategy.setType(dsClass);
            	strategy.setColumnMapping(columns);            	
            	list = csv.parse(strategy, reader);	
            } else {
            	reader = new CSVReader(new FileReader(file),this.separator, this.quoteChar );
            	CsvToBean<M> csv = new CsvToBean<M>();
            	HeaderColumnNameMappingStrategy<M> strategy = new HeaderColumnNameMappingStrategy<M>();			 
            	strategy.setType(dsClass);
            	list = csv.parse(strategy, reader);	
            }		
            return list;            
        } catch(Exception e) {
        	String msg = "Error loading data from file: "+file.getPath()+"/"+file.getName()+ ". \n Reason is: ";
        	if (e.getCause() != null) {
        		msg = msg + e.getCause().getLocalizedMessage();
        	} else {
        		msg = msg + e.getLocalizedMessage();
        	}        	 
        	throw new Exception(msg, e);
        }finally {
            if (reader != null ) {
                reader.close();              
            }
            if (fileReader != null ) {               
                fileReader.close();
            }
        }
	}
}
