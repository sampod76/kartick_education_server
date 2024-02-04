import DeviceDetector from 'node-device-detector';
export const getDeviceInfo = (user_agent: string) => {
    // if(user_agent){
        
    // }
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  const result = detector.detect(user_agent);
  return result;
};
