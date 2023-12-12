// import FCM from 'fcm-node';
// import fs from 'fs';
// import path from 'path';
// import ApiError from '../app/errors/ApiError';
// export const sendPushNotification = async (
//   fcm_tokens: string[],
//   message: string
// ) => {
//   try {
//     fs.readFile(
//       path.join(__dirname, '../../FireBaseConfig.json'),
//       'utf8',
//       async (err, jsonString) => {
//         if (err) {
//           console.log('Error reading file from disk:', err);
//           throw new ApiError(
//             400,
//             err?.message || 'Error reading file from disk'
//           );
//           //   return err;
//         }
//         try {
//           //firebase push notification send
//           const data = JSON.parse(jsonString);
//           const serverKey = data.SERVER_KEY;
//           const fcm = new FCM(serverKey);

//           if (fcm_tokens.length > 0) {
//             const pushMessage = {
//               //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//               registration_ids: fcm_tokens,
//               content_available: true,
//               mutable_content: true,

//               notification: {
//                 body: message + "kano dura thako ",
//                 title:"sampod chander nath title",
//                 icon: 'myicon', //Default Icon
//                 sound: 'mySound', //Default sound
//                 imageUrl:"https://plus.unsplash.com/premium_photo-1665413643122-4a86ca3057f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=300"

//                 // badge: badgeCount, example:1 or 2 or 3 or etc....
//               },
//               // data: {
//               //   notification_type: 5,
//               //   conversation_id:inputs.user_id,
//               // }
//             };

//             fcm.send(pushMessage, function (err: any, response: any) {
//               if (err) {
//                 console.log('Something has gone wrong!', err);
//                 return {
//                   success: false,
//                   message: 'error sending push notification',
//                 };
//               } else {
//                 console.log('Push notification sent.', response);
//                 return {
//                   success: true,
//                   message: 'successfully send push notification',
//                 };
//               }
//             });
//           }
//         } catch (err: any) {
//           return {
//             success: false,
//             message: 'error sending push notification',
//           };
//         }
//       }
//     );
//   } catch (error: any) {
//     console.log(error);
//     throw new ApiError(
//       400,
//       error?.message || 'Something has gone wrong notification'
//     );
//   }
// };
