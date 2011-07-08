package net.nan21.dnet.core.presenter.propertyeditors;
import java.beans.PropertyEditorSupport;
 

public class BooleanEditor extends PropertyEditorSupport  {
	  
		public static final String VALUE_TRUE = "true";
		public static final String VALUE_FALSE = "false";

		public static final String VALUE_ON = "on";
		public static final String VALUE_OFF = "off";

		public static final String VALUE_YES = "yes";
		public static final String VALUE_NO = "no";

		public static final String VALUE_1 = "1";
		public static final String VALUE_0 = "0";


		private final String trueString;

		private final String falseString;

		private final boolean allowEmpty;

		public BooleanEditor() {
			this(null, null, true);
		}
		
		public BooleanEditor(boolean allowEmpty) {
			this(null, null, allowEmpty);
		}
 
		 
		public BooleanEditor(String trueString, String falseString, boolean allowEmpty) {
			this.trueString = trueString;
			this.falseString = falseString;
			this.allowEmpty = allowEmpty;
		}

		@Override
		public void setAsText(String text) throws IllegalArgumentException {
			String input = (text != null ? text.trim() : null);
			if (this.allowEmpty && (input == null || input.equals(""))  ) {
				// Treat empty String as null value.
				setValue(null);
			}
			else if (this.trueString != null && input.equalsIgnoreCase(this.trueString)) {
				setValue(Boolean.TRUE);
			}
			else if (this.falseString != null && input.equalsIgnoreCase(this.falseString)) {
				setValue(Boolean.FALSE);
			}
			else if (this.trueString == null &&
					(input.equalsIgnoreCase(VALUE_TRUE) || input.equalsIgnoreCase(VALUE_ON) ||
					input.equalsIgnoreCase(VALUE_YES) || input.equals(VALUE_1))) {
				setValue(Boolean.TRUE);
			}
			else if (this.falseString == null &&
					(input.equalsIgnoreCase(VALUE_FALSE) || input.equalsIgnoreCase(VALUE_OFF) ||
					input.equalsIgnoreCase(VALUE_NO) || input.equals(VALUE_0))) {
				setValue(Boolean.FALSE);
			}
			else {
				throw new IllegalArgumentException("Invalid boolean value [" + text + "]");
			}
		}

		@Override
		public String getAsText() {
			if (Boolean.TRUE.equals(getValue())) {
				return (this.trueString != null ? this.trueString : VALUE_TRUE);
			}
			else if (Boolean.FALSE.equals(getValue())) {
				return (this.falseString != null ? this.falseString : VALUE_FALSE);
			}
			else {
				return "";
			}
		}

	}