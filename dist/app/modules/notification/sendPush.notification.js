"use strict";
// //? notification admin
// const tokens = [
//   'fhO0RDSTQjeIVBE0jL12sM:APA91bFqsIF_2TeSdHLrqSdnIpE7sc-1WQnJlppASH_pbZcE0dcIUyy89G-yyrE0_IkU5e1QQ3BLQTUfjJXR2BuqDAXCKftc0jImqA6MR5HIITxgE73e9e6tKaR4WuXIWXgfVZTnS1DH',
//   'dzxh2ZCa60ALt0Zq7CHDAS:APA91bEX2eicWF100gvcX_etXPFthsefNGoLPLSiV4d0iiYMnW0QExwIji0W_c1AHlrXP-w2-1rNATPwjvBwys-hHJLtGA9xcb5buXaDcJCaZ7SMqqnjad29nfJUNB_6HBQ_Lxxb0u2O',
// ];
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationsToUsers = void 0;
// //? notification admin
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const firebaseApp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)('./app-service-69072-firebase-adminsdk-4fxmd-45859ef483.json'),
}, 'Salon Training');
function sendNotificationsToUsers(userTokens, message) {
    // const options = {
    //   priority: 'high',
    //   timeToLive: 60 * 60 * 24,
    // };
    const messaging = (0, messaging_1.getMessaging)(firebaseApp);
    const successTokens = [];
    const errorTokens = [];
    userTokens.forEach(userToken => {
        messaging
            .send({
            token: userToken,
            data: {
                customData: (message === null || message === void 0 ? void 0 : message.customData) || '',
                id: message.id,
                subTitle: (message === null || message === void 0 ? void 0 : message.subTitle) || '',
            },
            //   android: {
            //     notification: {
            //       body: 'This is body part is my application',
            //       title: 'This is title part is my application',
            //       color:"#5858FA",
            //       sound:"default",
            //       imageUrl:
            //         'https://images.unsplash.com/photo-1613963761543-cc92783708fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=300',
            //     },
            //   },
            notification: {
                body: message.body + `/NS/${message.id}/NE/`,
                title: message.title,
                imageUrl: message.imageUrl ||
                    'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=300',
            },
        })
            .then(response => {
            successTokens.push(userToken);
            console.log('Successfully sent message to user', userToken, ':', response);
        })
            .catch(error => {
            errorTokens.push(userToken);
            console.error('Error sending message to user', userToken, ':', error);
        });
    });
    return { successTokens, errorTokens };
}
exports.sendNotificationsToUsers = sendNotificationsToUsers;
