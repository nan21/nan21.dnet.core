package net.nan21.dnet.core.presenter.action;

import java.beans.PropertyEditorManager;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import net.nan21.dnet.core.presenter.libextensions.HeaderColumnNameMappingStrategy_Dnet;
import net.nan21.dnet.core.presenter.propertyeditors.BooleanEditor;
import net.nan21.dnet.core.presenter.propertyeditors.DateEditor;
import net.nan21.dnet.core.presenter.propertyeditors.FloatEditor;
import net.nan21.dnet.core.presenter.propertyeditors.IntegerEditor;
import net.nan21.dnet.core.presenter.propertyeditors.LongEditor;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.bean.ColumnPositionMappingStrategy;
import au.com.bytecode.opencsv.bean.CsvToBean;

public class DsCsvLoader {

	private char separator = ';';
	private char quoteChar = '"';

	public DsCsvLoader() {

		// TODO: move this from here

		PropertyEditorManager.registerEditor(java.lang.Boolean.class,
				BooleanEditor.class);
		PropertyEditorManager.registerEditor(java.lang.Long.class,
				LongEditor.class);
		PropertyEditorManager.registerEditor(java.lang.Integer.class,
				IntegerEditor.class);
		PropertyEditorManager.registerEditor(java.lang.Float.class,
				FloatEditor.class);
		PropertyEditorManager.registerEditor(java.util.Date.class,
				DateEditor.class);
	}

	public <M> List<M> run(File file, Class<M> dsClass, String[] columns)
			throws Exception {
		return this.run_(file, dsClass, columns).getResult();
	}

	public <M> DsCsvLoaderResult<M> run2(File file, Class<M> dsClass,
			String[] columns) throws Exception {
		return this.run_(file, dsClass, columns);
	}

	public <M> List<M> run(InputStream inputStream, Class<M> dsClass,
			String[] columns, String sourceName) throws Exception {
		return this.run_(inputStream, dsClass, columns, sourceName).getResult();
	}

	public <M> DsCsvLoaderResult<M> run2(InputStream inputStream,
			Class<M> dsClass, String[] columns, String sourceName)
			throws Exception {
		return this.run_(inputStream, dsClass, columns, sourceName);
	}

	protected <M> DsCsvLoaderResult<M> run_(File file, Class<M> dsClass,
			String[] columns) throws Exception {
		InputStream inputStream = new FileInputStream(file);
		return this.run_(inputStream, dsClass, columns, file.getAbsolutePath());
	}

	protected <M> DsCsvLoaderResult<M> run_(InputStream inputStream,
			Class<M> dsClass, String[] columns, String sourceName)
			throws Exception {

		InputStreamReader inputStreamReader = null;
		CSVReader csvReader = null;
		try {
			List<M> list = null;
			DsCsvLoaderResult<M> result = new DsCsvLoaderResult<M>();
			// file = new File(this.path + "/"+ this.fileName);
			inputStreamReader = new InputStreamReader(inputStream);
			if (columns != null) {
				csvReader = new CSVReader(inputStreamReader, this.separator,
						this.quoteChar, 1);
				CsvToBean<M> csv = new CsvToBean<M>();
				ColumnPositionMappingStrategy<M> strategy = new ColumnPositionMappingStrategy<M>();
				strategy.setType(dsClass);
				strategy.setColumnMapping(columns);
				list = csv.parse(strategy, csvReader);
				result.setHeader(columns);
				result.setResult(list);
			} else {
				csvReader = new CSVReader(inputStreamReader, this.separator,
						this.quoteChar);
				CsvToBean<M> csv = new CsvToBean<M>();
				HeaderColumnNameMappingStrategy_Dnet<M> strategy = new HeaderColumnNameMappingStrategy_Dnet<M>();
				strategy.setType(dsClass);
				list = csv.parse(strategy, csvReader);
				result.setHeader(strategy.getHeader());
				result.setResult(list);
			}
			return result;
		} catch (Exception e) {
			String msg = "Error loading data from source: " + sourceName
					+ ". \n Reason is: ";
			String details = null;
			if (e.getCause() != null) {
				details = e.getCause().getLocalizedMessage();
			} else {
				details = e.getLocalizedMessage();
			}
			if (details != null && !"".equals(details)) {
				msg = msg + details;
			} else {
				msg = msg + e.getStackTrace()[0];
			}
			throw new Exception(msg, e);
		} finally {
			if (csvReader != null) {
				csvReader.close();
			}
			if (inputStreamReader != null) {
				inputStreamReader.close();
			}
		}
	}
}
