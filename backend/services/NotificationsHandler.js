import * as notificationListener from './NotificationListener';


export default class NotificationHandler {

  constructor() {
    this.listenNotification();
  }

  listenNotification() {
    notificationListener((notification) => {
      global.mainWindow.webContents.send("notification", notification);
    })
  }

  async sendNotification(payload, receivers = null) {
    // broadcast
    if (!receivers) {
      await global.DB.Notification.create({...payload});
      return;
    }

    const notifications = receivers.map((receiverId) => {
      return {
        ...payload,
        receiver_id: receiverId
      }
    });

    await global.DB.Notification.bulkCreate(notifications);
  }


}
