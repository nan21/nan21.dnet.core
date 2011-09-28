Ext.ns("dnet");
dnet.Translation = Ext.apply({},{

	tlbitem : {
		// *******************  Standard common actions for data-control ******************

		 load__lbl : "Load"
		,load__tlp : "Load records from database according to specified filter. "

        ,clearFilter__lbl : "Clear filter"
		,clearFilter__tlp : "Clear filter."

        ,save__lbl : "Save"
		,save__tlp : "Save changes."
 
        // *******************  Standard actions for SINGLE-RECORD data-control ******************

		,edit__lbl : "Edit"
		,edit__tlp : "Toogle edit mode for the current record."

		,new__lbl : "New"
		,new__tlp : "Create new record"

		,copy__lbl : "Copy"
		,copy__tlp : "Create a copy of the current record."
		
		,next_rec__lbl : "Next"
		,next_rec__tlp : "Go to next selected record or next available record if no selection."

		,prev_rec__lbl : "Previous"
		,prev_rec__tlp : "Go to previous selected record or previous available record if no selection."

		,delete_current__lbl : "Delete"
		,delete_current__tlp : "Delete current record."
		
		,delete_selected__lbl : "Delete"
		,delete_selected__tlp : "Delete selected records."

        ,cancel__lbl : "Cancel"
		,cancel__tlp : "Cancel all changes made to all records since the last save or load."

		,back__lbl : "Back"
		,back__tlp : "Back to previous canvas."

        // *******************  Standard actions for MULTI-RECORD data-control ******************

       

	}
    ,appmenuitem: {
		 user__lbl : "User"
		,home__lbl : "Home"
		,appmenus__lbl : "Application menu"

		,client__lbl : "Client"
		,myaccount__lbl : "My account"
		,changepswd__lbl : "Change password"
		,userprefs__lbl : "Preferences"
		,session__lbl : "Session"
		,logout__lbl : "Logout"
		,lock__lbl : "Lock"
		,bookmark__lbl : "Bookmarks"
		,managebookmark__lbl : "Manage"
		,theme__lbl : "Theme"
		,theme_blue__lbl : "Blue"
		,theme_gray__lbl : "Gray"
		,theme_access__lbl : "Black"
		,lang__lbl : "Language"


		,help__lbl : "Help"
		,about__lbl : "About DNet"
		,version__lbl : "Version"
		
		,calendar__lbl : "Calendar"
	}
    
	,navmenu : {
		 mAD : "Administration"
			,smAD_BaseData : "Base data"
			,smAD_Geo : "Geography"
			,smAD_Currency : "Currencies"
			,smAD_Uom : "Measuring units"
			,smAD_Org : "Organization"
			,smAD_Application : "Application"
			,smAD_Resources : "Resources"
			,smAD_Dictionary : "Dictionary"
			,smAD_Sys : "System"
			,smAD_Wf : "Workflows"
			,smAD_Other : "Others"
				
		,mTC : "Business partners"
			,mTC_BaseData : "Definitions"
		
		,mMM : "Materials"
			,mMM_BaseData : "Definitions"
				
		,mCRM : "Customer Relationship"
			,mCAL : "Activities"
			,mCRM_BaseData : "Definitions"

		,mSD : "Sales & Distribution"
			,mSD_BAS : "Base data"
		
		,mPJ : "Projects"
			,mPJ_BAS : "Base data"

		,mHR : "Human resources"
				 
			,mHR_BAS: "Base data"
				,mHR_BAS_DEF: "Definitions"
				,mHR_BAS_GRADE: "Grades & Pay scales"
				,mHR_BAS_SKILL: "Competences"
				,mHR_BAS_JOB: "Jobs & Positions"
				,mHR_BAS_TEST : "Questions repository"

			,mHR_PAD: "Personnel administration"
				,mHR_PAD_DEF: "Definitions"
				,mHR_PAD_PIM: "Employees"
			,mHR_TIME: "Time management"
            ,mHR_PAYROL: "Payroll"
			,mHR_RECR : "Recruitment"
			,mHR_TRA : "Training"
				,mHR_TRA_DEF : "Definitions"
			,mHR_REP: "Reports"	
		
		,mMY : "My DNet"
			 ,mMY_ESS : "Employee self-service"
			 ,mMY_ESS_PIM : "Personal information"
			 ,mMY_ESS_TIME : "Time management"


	}

	,msg: {
       loading : "Loading"
	  ,initialize : "Initializing"

	  ,grid_emptytext: "No records found to match the specified selection criteria."

      ,login_title : "Authentication"
	  ,login_user : "User"
	  ,login_pswd : "Password"
	  ,login_client : "Client"
	  ,login_lang : "Language"
      ,login_btn : "Login"
      
	  ,upload_title : "Upload file"
	  ,upload_name : "Name"
	  ,upload_file : "File"	 
	  ,upload_btn : "Upload"
    	   
      ,chpswd_title : "Change password"
      ,chpswd_pswd1 : "New password"
      ,chpswd_pswd2 : "Confirm password"
      ,chpswd_btn : "Change password"
      ,chpswd_success : "Password changed.<BR> Use the new password on next login."
      ,chpswd_nomatch: "The new password is not confirmed correctly. Re-enter `Confirm password` field."

      ,dc_confirm_action: "Confirm action"
      ,dc_confirm_delete_selection : "Do you really want to delete the selected records? "

	  ,bool_true: "Yes"
	  ,bool_false: "No"
	}
 
	 ,exception: {
         NAVIGATE_BEFORE_FIRST : "At first available record."
        ,NAVIGATE_AFTER_LAST  : "At last available record."
        ,NO_CURRENT_RECORD: "There is no current record to perform the requested action."
	    ,NO_SELECTED_RECORDS: "There are no selected records to perform the requested action."
	    ,DIRTY_DATA_FOUND: "Unsaved changes found. Save your changes or discard them."
	    ,PARENT_RECORD_NEW : "Parent record is new. Save or discard changes then try again."
	}

   ,dcvgrid : {
        btn_perspective_txt : "Layout"
		,btn_perspective_tlp : "Manage custom layouts"

       ,imp_title: "Import data"
       ,imp_format: "Format"
       ,imp_file: "File"
       ,imp_btn: "Import"
       ,imp_run: "Run"
       ,imp_strgy : "Strategy"
	       ,imp_strgy_pos  : "Grid layout( Visible columns in grid match the fields in csv file in the same order )"
	       ,imp_strgy_bean : "Tehnical name( Fields in csv file have the same header as the grid data model - see export )"
	   ,imp_notes_lbl: "Notes"
	   ,imp_notes : "The first line from the file is skipped. It is assumed to be the headers line."

       ,exp_title: "Export data"
       ,exp_btn: "Export"
       ,exp_format: "Format"
       ,exp_layout: "Layout"
       ,exp_columns: "Columns"
	       ,exp_col_visible: "Visible columns"
	       ,exp_col_all: "All list columns"
	       ,exp_col_all2: "All available data"

       ,exp_records: "Records"
       	,exp_rec_sel: "Selected records"
       	,exp_rec_pag: "Current page"
       	,exp_rec_all: "All pages"
       ,exp_run: "Run"
       
       ,layout_mylayouts : "Select existing layout"
		,layout_name : "Save current layout as"
		,layout_title: "My layouts"
		,layout_applySelected : "Apply selected"
		,layout_saveCurrent :"Save current"
   }

    ,ds: {
        id: "ID"
       ,version: "Version"
    	   ,clientId:"Client" 	   
       ,code: "Code"
       ,name: "Name"
       ,description: "Description"
       ,notes: "Notes"
       ,active: "Active"
       ,valid: "Valid"
       ,statusId: "Status(ID)"
       ,statusName: "Status"

       ,bpartnerCode: "Business partner"
       ,bpartnerId: "Business partner(ID)"

       ,active: "Active"
       ,createdBy: "Created by"
	   ,createdAt: "Created at"
       ,modifiedBy: "Modified by"
       ,modifiedAt: "Modified at"

   }

    ,ui:{
  	    Countries_UI: "Countries"
	   ,Regions_UI: "Regions"
	   ,CountryMD_UI: "Country with details"
	   ,RegionMD_UI: "Region with details"
	   ,Currencies_UI: "Currencies"	    
	   ,CurrencyXrateProvider_UI :"Currency exchange rate providers"
	   ,CurrencyXRates_UI : "Currency exchange rates"
	   ,Classifications_UI: "Classifications"
		   
	   ,Uoms_UI :"Units of measure"
	   ,UomType_UI :"Unit of measure types"
	   ,UomMD_UI :"Unit of measure with details"
	   ,UomConversion_UI : "Unit of measure conversions"

	   ,ImportMapItem_UI: "Import files"
       ,ImportMap_UI: "Import file-sets"
       ,ImportJob_UI: "Import jobs"
       ,Client_UI:"Client"
	   ,SysDataSources_UI : "System components: Data-sources"
	   ,Reports_UI : "Reports"
	   ,ReportServers_UI : "Report servers"

	   ,OrgType_UI :"Organization types"
	   ,Org_UI :"Organizations"
	   ,Calendar_UI : "Calendars"
	   ,Users_UI :"Users"
	   ,UserGroups_UI : "User groups"
		,UserTypes_UI : "User types"
	   ,Role_UI : "Roles"
       ,AccessControl_UI : "Access rights"
	   ,MyBookmark_UI : "My bookmarks"
	   ,WorkflowAdmin_UI: "Workflow admin console"
	   ,WorkflowDef_UI : "Workflow definition"
       //CRM
       ,CalendarEventTypeDef_UI : "Calendar event definitions"       
       ,MyCalendarEvent_UI : "Calendar events"

	   ,Task_UI : "Tasks"
	   ,Meeting_UI : "Meetings"
	   ,Call_UI : "Calls"

       	//HR
       	,Grade_UI : "Grades"
		,GradeRate_UI : "Grade rates"
		,PayScale_UI :"Pay scales"
		,PayScaleRate_UI :"Pay scale rates"
		,RatingScale_UI : "Rating scales"
		,RatingLevel_UI : "Rating levels"
		,SkillType_UI : "Competence types"
		,Skill_UI : "Competences"
		,Qualification_UI : "Qualifications"		 
		,JobBaseDataDef_UI : "Job base data definitions"
		,Job_UI : "Jobs"		 
        ,Position_UI: "Positions"
        ,QuestionGroup_UI : "Question groups"
		,Question_UI : "Questions"

		// hr-pad
		,Absence_UI : "Absences"
		,AbsenceBaseData_UI : "Absence base data"
		,EmployeeTypeDefs_UI : "Employee base data definition"			 
		,EmploymentType_UI :"Employment types"	    
		,Employee_UI : "Employees"
		,Cand : "Applicants"
		,Payroll_UI: "Payroll"
		,Element_UI: "Elements"
		,ElementType_UI: "Element types"
		,ElementValue_UI: "Element values"
        ,CourseType_UI : "Course types"
		,Course_UI : "Courses"
        ,EmployeeBySkill_UI : "Employees by competence"
        
	   // MY 
	   ,MyAbsenceRequests_UI : "My absences"
	   ,MyTimeSheets_UI : "My timesheets"
	   ,WorkflowTodo_UI:"Tasks"

       	// BP
       	,BPartner_UI : "Business partners"
       	,Contact_UI : "Contacts"
       	,Bank_UI : "Banks"
       	,BP_BaseData_UI : "Definitions (BP)"
		,PersonTitles_UI   : "Person titles"
		,CommunicationChannelTypes_UI : "Communication types"

		,BpAccount_UI : "Business partner accounts"


		//MM
        ,ProductCategory_UI : "Product categories"
        ,ProductBaseData_UI : "Product base data"
        ,InventoryBaseData_UI : "Inventory base data"
        ,SubInventories_UI: "Sub-inventories"	
        ,Product_UI : "Products"
        ,ProductAccountGroup_UI : "Product account groups"
        ,ProductAttributeDefs_UI : "Product attributes"
        ,InvTransactions_UI : "Inventory transactions"
        ,InvBalance_UI: "Stocks"	
          //SD
        ,SalesOrderBaseData_UI : "Base data(Sales orders)"
        //,SalesOrderType_UI : "Order type"
        ,SalesOrder_UI : "Orders"

        //,SalesInvoiceStatus_UI : "Invoice status"
        //,SalesInvoiceType_UI : "Invoice type"
        ,SalesInvoiceBaseData_UI : "Base data(Sales invoice)"	
        ,SalesInvoice_UI: "Invoices"
        
        
        //PJ
        ,ProjectType_UI: "Project types"
        ,ProjectTaskType_UI: "Activity types"
        ,Projects_UI: "Projects"
		,ProjectTasks_UI: "Activities"



	}


});

