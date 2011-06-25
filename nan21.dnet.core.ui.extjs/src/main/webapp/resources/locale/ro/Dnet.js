Ext.ns("dnet");
dnet.Translation = Ext.apply({},{

	tlbitem : {
		// *******************  Standard common actions for data-control ****************** 

		 load__lbl : "Filtrează"
		,load__tlp : "Încarcă înregistrările care corespund criteriilor de filtrare specificate."

        ,clearFilter__lbl : "Sterge filtru"
		,clearFilter__tlp : "Sterge filtru."

        ,save__lbl : "Salvează"
		,save__tlp : "Salvează modificările."                  

		,save__lbl : "Salvează"
		,save__tlp : "Salvează modificările."
        // *******************  Standard actions for SINGLE-RECORD data-control ******************

		,edit__lbl : "Modifică"
		,edit__tlp : "Afisează formularul de modificare."

		,new__lbl : "Crează"
		,new__tlp : "Crează înregistrare nouă"

		,copy__lbl : "Copiază"
		,copy__tlp : "Copiază înregistrarea curentă"

		,next_rec__lbl : "Următor"
		,next_rec__tlp : "Incarcă înregistrarea următoare din cele selectate sau următoare disponibilă dacă nu există selecţie multiplă"

		,prev_rec__lbl : "Anterior"
		,prev_rec__tlp : "Incarcă înregistrarea anterioară din cele selectate sau cea anterioră disponibilă dacă nu există selecţie multiplă"

		,delete_current__lbl : "Sterge"
		,delete_current__tlp : "Sterge înregistrarea curentă"

		,delete_selected__lbl : "Sterge"
		,delete_selected__tlp : "Sterge înregistrările selectate"

        ,cancel__lbl : "Anulează"
		,cancel__tlp : "Anulează modificările utilizatorului."

		,back__lbl : "Înapoi"
		,back__tlp : "Înapoi."

        // *******************  Standard actions for MULTI-RECORD data-control ******************

        

	}

	,appmenuitem: {

		 user__lbl : "Utilizator"
		,home__lbl : "Acasă"
		,appmenus__lbl : "Meniuri aplicaţie"

		,client__lbl : "Client"
		,myaccount__lbl : "Contul meu"
		,changepswd__lbl : "Schimbă parola"
		,userprefs__lbl : "Preferinţe"
		,session__lbl : "Sesiune"
		,logout__lbl : "Închide"
		,lock__lbl : "Blochează"		
		,bookmark__lbl : "Marcaje"
		,managebookmark__lbl : "Gestionare"
		,theme__lbl : "Stil"
		,theme_blue__lbl : "Albastru"
		,theme_gray__lbl : "Gri"
		,theme_access__lbl : "Negru"
		,lang__lbl : "Limbă"


		,help__lbl : "Ajutor"
		,about__lbl : "Despre DNet"
		,version__lbl : "Versiune"		
		,calendar__lbl : "Calendar"
	}

	,navmenu : {		
		 mAD : "Administrare"
			,smAD_BaseData : "Date de bază"
			,smAD_Geo : "Geografie"
			,smAD_Currency : "Valute"
			,smAD_Uom : "Unitaţi de masură"
			,smAD_Org : "Organizaţii"
			,smAD_Application : "Aplicaţie"
			,smAD_Resources : "Resurse"
			,smAD_Sys : "Sistem"
			,smAD_Wf : "Workflow-uri"
			,smAD_Other : "Altele"
			,smAD_Dictionary : "Dicţionar"
				
		,mTC : "Terţi"
			,mTC_BaseData : "Definiţii"
		
		,mMM : "Produse & Servicii"
			,mMM_BaseData : "Definiţii"

		,mCRM : "Relaţii clienţi"
			,mCAL : "Activităţi"
			,mCRM_BaseData : "Definiţii"
    
		,mSD : "Vanzări & Distribuţie"
			,mSD_BAS : "Date de bază"
		
		,mPJ : "Proiecte"
			,mPJ_BAS : "Definiţii"

		,mHR : "Resurse umane"
			,mHR_BAS: "Date de bază"
				,mHR_BAS_DEF: "Definiţii"
				,mHR_BAS_GRADE: "Grade & Grile salarizare"
				,mHR_BAS_SKILL: "Competenţe"
				,mHR_BAS_JOB: "Funcţii & Posturi"
	            ,mHR_BAS_TEST : "Intrebări teste"

			,mHR_PAD: "Administrare personal"
				,mHR_PAD_DEF: "Definiţii"
				,mHR_PAD_PIM: "Date angajat"
			,mHR_TIME: "Pontaj"

            ,mHR_PAYROL: "Salarizare"
			,mHR_RECR : "Recrutare"
            ,mHR_TRA : "Training"
				,mHR_TRA_DEF : "Definiţii"
			,mHR_REP: "Rapoarte"
			
		,mMY : "DNet personal"
			 ,mMY_ESS : "Employee self-service"
			 ,mMY_ESS_PIM : "Date personale"
			 ,mMY_ESS_TIME : "Pontaje & Absente"
	}
	,msg: {
       loading : "Încarcă"
	   ,initialize : "Iniţializare"
	   
	   ,grid_emptytext: "Nu s-au găsit înregistrări care să corespundă criteriilor de filtrare."

	  ,login_title : "Autentificare"
	  ,login_user : "Utilizator"
	  ,login_pswd : "Parolă"
	  ,login_client : "Client"
	  ,login_lang : "Limbă"
      ,login_btn : "Conectare"

      ,chpswd_title : "Schimbare parolă"
      ,chpswd_pswd1 : "Parola nouă"
      ,chpswd_pswd2 : "Confirmare parolă"
      ,chpswd_btn : "Schimbă parola"
      ,chpswd_success : "Parola a fost schimbată.<BR> Folosiţi noua parolă la următoarea autentificare."
      ,chpswd_nomatch: "Noua parolă nu este confirmată corect. Introduceţi din nou campul `Confirmare parolă`."

      ,dc_confirm_action: "Confirmare acţiune"
      ,dc_confirm_delete_selection : "Doriţi să ștergeţi inregistrările selectate? "

	  ,bool_true: "Da"
	  ,bool_false: "Nu"
	}
 
    ,exception: {
         NAVIGATE_BEFORE_FIRST : "La prima înregistrare disponibilă."
        ,NAVIGATE_AFTER_LAST  : "La ultima înregistrare disponibilă."
        ,NO_CURRENT_RECORD: "Nu există înregistrare curentă pentru acţiunea solicitată."
	    ,NO_SELECTED_RECORDS: "Nu există înregistrări selectate pentru acţiunea solicitată."
	    ,DIRTY_DATA_FOUND: "Salvaţi sau anulaţi mai întai modificările făcute."
        ,PARENT_RECORD_NEW : "Acţiunea solicitată este in contextul unei înregistrări noi.<br> Salvaţi sau anulaţi mai întai inregistrarea părinte."
	}


   ,dcvgrid : {
       btn_perspective_txt : "Layout"
	  ,btn_perspective_tlp : "Layout-uri salvate"

       ,imp_title: "Import date"
       ,imp_btn: "Import"
       ,imp_format: "Format"
       ,imp_file: "Fișier"
       ,imp_run: "Execută"
       ,imp_strgy : "Strategie"
	       ,imp_strgy_pos  : "Layout listă( Coloanele vizibile din listă reprezintă campurile din fișier in aceeași ordine. )"
	       ,imp_strgy_bean : "Denumiri tehnice( campurile din fișier au aceleași anteturi ca și modelul de date al listei - vezi export )"
       ,imp_notes_lbl: "Observatii"
	   ,imp_notes : "Prima linie din fișier este ignorată. Se presupune că este linia cu anteturi."

       ,exp_title: "Export date"
       ,exp_btn: "Export"
       ,exp_format: "Format"
       ,exp_layout: "Orientare"
       ,exp_columns: "Coloane"
	       ,exp_col_visible: "Vizibile in listă"
	       ,exp_col_all: "Toate din listă"
	       ,exp_col_all2: "Toate disponibile"

       ,exp_records: "Înregistrări"
       	,exp_rec_sel: "Selectate"
       	,exp_rec_pag: "Pagina curentă"
       	,exp_rec_all: "Toate paginile"
       ,exp_run: "Execută"
       
        ,layout_mylayouts : "Alegeti layout existent"
		,layout_name : "Salveaza layout curent"
		,layout_title: "My layouts"
		,layout_applySelected : "Aplica selectia"
		,layout_saveCurrent :"Salveaza cel curent"
   }
   
   ,ds: {
        id: "ID"
       ,code: "Cod"
       ,name: "Denumire"
       ,description: "Descriere"
       ,notes: "Observatii"
       ,active: "Activ"
       ,valid: "Valid"
       ,statusId: "Stare(ID)"
       ,statusName: "Stare"

       ,bpartnerCode: "Terţ"
       ,bpartnerId: "Terţ(ID)"

       ,createdBy: "Creat de"
	   ,createdAt: "Creat la"
       ,modifiedBy: "Modificat de"
       ,modifiedAt: "Modificat la"

   }

  ,ui:{
  	    Countries_UI: "Tări"
  	   ,Regions_UI: "Judeţe"
  	   ,CountryMD_UI: "Tară cu detalii"
	   ,RegionMD_UI: "Judeţ cu detalii"
	   ,Currencies_UI: "Valute"
	   ,CurrencyXrateProvider_UI :"Furnizori rate de schimb"
	   ,CurrencyXRates_UI : "Rate de schimb valutar"

	   ,Uoms_UI :"Unităţi de masură"
	   ,UomMD_UI :"Unitate de masurăcu detalii"
       ,UomConversion_UI : "Conversii unităţi de masură"

	   ,ImportMapItem_UI: "Fisiere import"
	   ,ImportMap_UI: "Seturi fisiere import"
	   ,ImportJob_UI: "Procese import"
	   ,Client_UI:"Client"
       ,SysDataSources_UI : "Componente sistem: Surse de date"
       ,Reports_UI : "Rapoarte"
	   ,ReportServers_UI : "Servere raportare"

	   ,OrgType_UI :"Tipuri organizaţii"
	   ,Org_UI :"Organizaţii"
	   ,Calendar_UI : "Calendare"
	   ,Users_UI :"Utilizatori"
	   ,UserGroups_UI : "Grupuri utilizator"
	   ,Role_UI : "Roluri"
       ,AclDs_UI : "Drepturi de acces"
       ,MyBookmark_UI : "Marcajele mele"
       ,Workflow_UI: "Administrare Workflow"
        ,WorkflowDef_UI : "Definire Workflow"

	   //CRM
	   ,CalendarEventPriority_UI : "Priorităţi eveniment"
       ,CalendarEventStatus_UI : "Stări eveniment"
    	,CalendarEventType_UI : "Tipuri eveniment"

       ,Task_UI : "Activităţi"
	   ,Meeting_UI : "Sedinţe"
	   ,Call_UI : "Apeluri"

       	//HR

       	,Grade_UI : "Grade"
		,GradeRate_UI : "Grade rates"
		,PayScale_UI :"Grile salarizare"
		,PayScaleRate_UI :"Pay scale rates"
		,RatingScale_UI : "Grile evaluare"
		,RatingLevel_UI : "Nivele evaluare"
		,SkillType_UI : "Tipuri competenţe"
		,Skill_UI : "Competenţe"
		,Qualification_UI : "Seturi competenţe"
		,WorkRequirementType_UI : "Tipuri cerinţe loc de muncă"
		,WorkRequirement_UI : "Cerinţe loc de muncă"
		,Job_UI : "Funcţii"
		,JobTypes_UI : "Tipuri funcţii"
		,Position_UI: "Posturi"
        ,QuestionGroup_UI : "Grupuri intrebări"
		,Question_UI : "Intrebări"
		// hr-pad
		,Absence_UI : "Absenţe"
		,TimeManagementBaseData_UI : "Definitii pontaj"
		,LicenseType_UI : "Tipuri licenţă"
		,EducationType_UI : "Tipuri studiu"
		,EmploymentType_UI :"Forme de angajare"
        ,EmployeeContactRelationship_UI : "Relaţii contact"

		,Employee_UI : "Angajaţi"
		,Cand : "Candidaţi"
		,Payroll_UI: "Salarizare"
		,Element_UI: "Elemente"
		,ElementValue_UI: "Valori element"
		,ElementType_UI: "Tipuri element"
		,CourseType_UI : "Tipuri cursuri"
		,Course_UI : "Cursuri"
        ,EmployeeBySkill_UI : "Angajati cu competente"


        // MY
	   ,MyAbsenceRequests_UI : "Absentele mele"
	   ,MyTimeSheets_UI : "Pontajele mele"
	   ,Todo_UI:"Activităţi"

     	// BP
       	,BPartner_UI : "Terţi"
       	,Contact_UI : "Contacte"
       	,Bank_UI : "Bănci"

		,PersonTitles_UI   : "Apelative persoane"
		,CommunicationChannelTypes_UI : "Moduri de comunicare"
        ,BP_BaseData_UI : "Definiţii (terţi)"

		,BpAccount_UI : "Conturi terţ"


        //MM
        ,ProductCategory_UI : "Categorii articole"
        ,ProductManufacturer_UI : "Producători"
        ,Product_UI : "Articole"
	    ,ProductAccountGroup_UI : "Clase cont articol"


	    //SD
	    ,SD_BaseData_UI : "Definiţii (comenzi, facturi)"
        //,SalesOrderStatus_UI : "Stări comenzi"
        //,SalesOrderType_UI : "Tipuri comenzi"
        ,SalesOrder_UI : "Comenzi"

		//,SalesInvoiceStatus_UI : "Stări factura"
        //,SalesInvoiceType_UI : "Tipuri factura"
        ,SalesInvoice_UI: "Facturi"


        //PJ
        ,ProjectType_UI: "Tipuri proiect"
        ,ProjectTaskType_UI: "Tipuri activităţi"
        ,Projects_UI: "Proiecte"
		,ProjectTasks_UI: "Activităţi"

	}


});

