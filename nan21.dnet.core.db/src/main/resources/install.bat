@echo off
call ../../_lib/liquibase/liquibase --defaultsFile=../liquibase.properties --changeLogFile=install.xml update
pause...