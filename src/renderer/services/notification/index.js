import apiClient from '@/services/axios'

export async function notificationAPI (payload) {

  let { form, allSystems, allRoles, allUsers } = payload;

  var data = {}
  switch (form.type) {
    case 'Organization':
      data = {
        type: form.type.toLowerCase(),
        text: form.message,
      }
      break
    case 'Systems':
      var systemsArr = form.selectedSystems == 'All Systems' ? allSystems.map(system => system.id) : form.selectedSystems;
      var groupArr = form.selectedRoles == 'All Roles' ? allRoles.map(role => role.id) : form.selectedRoles;
      data = {
        type: form.type.toLowerCase(),
        text: form.message,
        systemsArr,
        groupArr,
      }
      break
    case 'Users':
      var usersArr = form.selectedUsers == 'All Users' ? allUsers.map(user => user.id) : form.selectedUsers;
      var groupArr = form.selectedRoles == 'All Roles' ? allRoles.map(role => role.id) : form.selectedRoles;
      data = {
        type: form.type.toLowerCase(),
        text: form.message,
        usersArr,
        groupArr,
      }
      break
    default:
      break
  }

  return apiClient
    .post('/notifications/messages', data)
    .then(response => response)
    .catch(err => console.error(err))
}
