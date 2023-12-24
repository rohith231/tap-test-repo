////////////////////////////////////
////  USERS START //////////////////
////////////////////////////////////

Table users {
  id uuid [primary key]
}

Table roles {
  id uuid [primary key]
}

Table user_role {
  id uuid [primary key]
  role_id uuid
  user_id uuid
}

Ref: user_role.user_id > users.id // many-to-one
Ref: user_role.role_id > roles.id // many-to-one

////////////////////////////////////
////  USERS END ////////////////////
////////////////////////////////////

Table audit_controls {
  id uuid [primary key]
  user_id uuid
}
Ref: audit_controls.user_id > users.id // many-to-one


Table interrogators {
  id uuid [primary key]
  user_id uuid
}
Ref: interrogators.user_id > users.id // many-to-one


Table logs {
  id uuid [primary key]
}

Table notifications {
  id uuid [primary key]
}

Table permissions {
  id uuid [primary key]
}

Table role_permissions {
  id uuid [primary key]
  role_id uuid
  permission_id uuid
}

Ref: role_permissions.role_id > roles.id // many-to-one
Ref: role_permissions.permission_id > permissions.id // many-to-one

Table settings {
  id uuid [primary key]
}

////////////////////////////////////
////  STIGS START //////////////////
////////////////////////////////////

Table stigs {
  id uuid [primary key]
  user_id uuid
}
Ref: stigs.user_id > users.id // many-to-one

Table stigs_vulnerabilities {
  id uuid [primary key]
  stig_id uuid
  vulnerability_id uuid
}
Ref: stigs_vulnerabilities.stig_id > stigs.id // many-to-one
Ref: stigs_vulnerabilities.vulnerability_id > vulnerabilities.id // many-to-one

Table stig_commands {
  id uuid [primary key]
}

////////////////////////////////////
////  STIGS END ////////////////////
////////////////////////////////////

Table setting_role {
  id uuid [primary key]
  role_id uuid
  setting_id uuid
}

Ref: setting_role.role_id > roles.id // many-to-one
Ref: setting_role.setting_id > settings.id // many-to-one



Table vulnerabilities {
  id uuid [primary key]
  user_id uuid
}
Ref: vulnerabilities.user_id > users.id // many-to-one

////////////////////////////////////
////  DEVIATIONS START /////////////
////////////////////////////////////

Table deviations_vulnerabilities {
  id uuid [primary key]
  user_id uuid
  deviation_id uuid
}
Ref: deviations_vulnerabilities.user_id > users.id // many-to-one


Table deviations_commands {
  id uuid [primary key]
  user_id uuid
  deviation_vulnerability_id uuid
}
Ref: deviations_commands.user_id > users.id // many-to-one
Ref: deviations_commands.deviation_vulnerability_id > deviations_vulnerabilities.id // many-to-one

Table deviations {
  id uuid [primary key]
  user_id uuid
}
Ref: deviations.user_id > users.id // many-to-one

////////////////////////////////////
////  DEVIATIONS END ///////////////
////////////////////////////////////

Table ips {
  id uuid [primary key]
  system_id uuid
  user_id uuid
}
Ref: ips.system_id > systems.id // many-to-one
Ref: ips.user_id > users.id // many-to-one

Table devices {
  id uuid [primary key]
  system_id uuid
  credential_id uuid
  user_id uuid
}
Ref: devices.system_id > systems.id // many-to-one
Ref: devices.credential_id > system_credentials.id // many-to-one
Ref: devices.user_id > users.id // many-to-one

//////////////////////////////////////////
////  SYSTEMS START //////////////////////
//////////////////////////////////////////

Table systems {
  id uuid [primary key]
  organization_id uuid
  user_id uuid
}
Ref: systems.organization_id > organizations.id // many-to-one
Ref: systems.user_id > users.id // many-to-one




Table user_system {
  id uuid [primary key]
  system_id uuid
  user_id uuid
}
Ref: user_system.system_id > systems.id // many-to-one
Ref: user_system.user_id > users.id // many-to-one




Table system_framework {
  id uuid [primary key]
  system_id uuid
}
Ref: system_framework.system_id > systems.id // many-to-one





table system_credentials {
  id uuid [primary key]
  system_id uuid
}
Ref: system_credentials.system_id > systems.id // many-to-one

//////////////////////////////////////////
////  SYSTEMS END ////////////////////////
//////////////////////////////////////////

Table organizations {
  id uuid [primary key]
}

Table inheritances {
  id uuid [primary key]
  system_id uuid
  control_id uuid
}
Ref: inheritances.system_id > systems.id // many-to-one
Ref: inheritances.control_id > nist_800_171_r2_check_controls.id // many-to-one
Ref: inheritances.control_id > nist_800_53_r4_check_controls.id // many-to-one

Table validations {
  id uuid [primary key]
  device_id uuid
  control_id uuid
  vuln_num uuid
}

Ref: validations.device_id > devices.id // many-to-one
Ref: validations.control_id > nist_800_171_r2_check_controls.id // many-to-one
Ref: validations.control_id > nist_800_53_r4_check_controls.id // many-to-one

////////////////////////////////////
////  APPROVAL START ///////////////
////////////////////////////////////

Table approvals_processes {
  id uuid [primary key]
  system_id uuid
}

Ref: approvals_processes.system_id > systems.id // many-to-one




Table approvals_process_roles {
  id uuid [primary key]
  approval_process_id uuid
  role_id uuid
}

Ref: approvals_process_roles.approval_process_id > approvals_processes.id // many-to-one
Ref: approvals_process_roles.role_id > roles.id // many-to-one




Table approvals_process_user {
  id uuid [primary key]
  approval_process_id uuid
  user_id uuid
}

Ref: approvals_process_user.approval_process_id > approvals_processes.id // many-to-one
Ref: approvals_process_user.user_id > users.id // many-to-one



Table approvals_process_history {
  id uuid [primary key]
  system_id uuid
  control_id uuid
  approval_process_id uuid
  action_by uuid
}

Ref: approvals_process_history.system_id > systems.id // many-to-one
Ref: approvals_process_history.control_id > nist_800_171_r2_check_controls.id // many-to-one
Ref: approvals_process_history.control_id > nist_800_53_r4_check_controls.id // many-to-one
Ref: approvals_process_history.control_id > check_controls.id // many-to-one
Ref: approvals_process_history.control_id > custom_check_controls.id // many-to-one
Ref: approvals_process_history.approval_process_id > users.id // many-to-one
Ref: approvals_process_history.action_by > users.id // many-to-one


////////////////////////////////////
////  APPROVAL END /////////////////
////////////////////////////////////

Table check_controls {
  id uuid [primary key]
  system_id uuid
}
Ref: check_controls.system_id > systems.id // many-to-one

Table custom_check_controls {
  id uuid [primary key]
  system_id uuid
}
Ref: custom_check_controls.system_id > systems.id // many-to-one

Table poams {
  id uuid [primary key]
  system_id uuid
}
Ref: poams.system_id > systems.id // many-to-one

Table ssps {
  id uuid [primary key]
  system_id uuid
}
Ref: ssps.system_id > systems.id // many-to-one


Table audit {
  id uuid [primary key]
}

Table operating_systems {
  id uuid [primary key]
}

Table flushes {
  id uuid [primary key]
}

Table frameworks {
  id uuid [primary key] // REMOVE IT
}

Table validation_controls {
  id uuid [primary key] // REMOVE IT
}

Table nist_800_171_r2_controls {
  id uuid [primary key]
}




/****************************************
******* NIST 800 53 R4 START ************
/***************************************/

Table nist_800_53_controls {
  id uuid [primary key]
}



Table nist_800_53_r4_SSPs {
  id uuid [primary key]
  system_id uuid
}
Ref: nist_800_53_r4_SSPs.system_id > systems.id // many-to-one



Table nist_800_53_r4_check_controls {
  id uuid [primary key]
  system_id uuid
}
Ref: nist_800_53_r4_check_controls.system_id > systems.id // many-to-one
/****************************************
****** NIST 800 53 R4 END ***************
/***************************************/


/****************************************
****** NIST 800 171 R2 START ************
/***************************************/

Table nist_800_171_r2_SSPs {
  id uuid [primary key]
  system_id uuid
}
Ref: nist_800_171_r2_SSPs.system_id > systems.id // many-to-one



Table nist_800_171_r2_check_controls {
  id uuid [primary key]
  system_id uuid
}
Ref: nist_800_171_r2_check_controls.system_id > systems.id // many-to-one

/****************************************
****** NIST 800 171 R2 END ***************
/***************************************/


//  AUTO CREATED TABLE BY SEQUALIZE
Table SequalizeData {
  name string [primary key]
}

//  AUTO CREATED TABLE BY SEQUALIZE
Table SequalizeMeta {
  name string [primary key]
}

