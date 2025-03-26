!include "MUI2.nsh"

Name "Queue System Full Installer"
OutFile "installers/full_installer.exe"
InstallDir "$PROGRAMFILES\QueueSystem"
RequestExecutionLevel admin

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Main Section" SEC01
  SetOutPath "$INSTDIR\Kiosk"
  File /r "installers/kiosk\QueueKiosk-win32-x64\*.*"
  CreateShortCut "$DESKTOP\Queue Kiosk.lnk" "$INSTDIR\Kiosk\QueueKiosk.exe"
  CreateDirectory "$SMPROGRAMS\Queue System"
  CreateShortCut "$SMPROGRAMS\Queue System\Queue Kiosk.lnk" "$INSTDIR\Kiosk\QueueKiosk.exe"

  SetOutPath "$INSTDIR\TVPanel"
  File /r "installers/tv_panel\QueueTVPanel-win32-x64\*.*"
  CreateShortCut "$DESKTOP\Queue TV Panel.lnk" "$INSTDIR\TVPanel\QueueTVPanel.exe"
  CreateShortCut "$SMPROGRAMS\Queue System\Queue TV Panel.lnk" "$INSTDIR\TVPanel\QueueTVPanel.exe"

  SetOutPath "$INSTDIR\Operator"
  File /r "installers/operator\QueueOperator-win32-x64\*.*"
  CreateShortCut "$DESKTOP\Queue Operator.lnk" "$INSTDIR\Operator\QueueOperator.exe"
  CreateShortCut "$SMPROGRAMS\Queue System\Queue Operator.lnk" "$INSTDIR\Operator\QueueOperator.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\Kiosk\*.*"
  RMDir /r "$INSTDIR\Kiosk"
  Delete "$INSTDIR\TVPanel\*.*"
  RMDir /r "$INSTDIR\TVPanel"
  Delete "$INSTDIR\Operator\*.*"
  RMDir /r "$INSTDIR\Operator"
  Delete "$DESKTOP\Queue Kiosk.lnk"
  Delete "$DESKTOP\Queue TV Panel.lnk"
  Delete "$DESKTOP\Queue Operator.lnk"
  Delete "$SMPROGRAMS\Queue System\Queue Kiosk.lnk"
  Delete "$SMPROGRAMS\Queue System\Queue TV Panel.lnk"
  Delete "$SMPROGRAMS\Queue System\Queue Operator.lnk"
  RMDir "$SMPROGRAMS\Queue System"
  RMDir "$INSTDIR"
SectionEnd