import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../../config';

// import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// !multer (for upload file in folder )

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null,'uploads/')
    cb(null, path.join(__dirname, '../../uploadFile/images'));
  },
  
  //   filename:function(req,file,cb){
  //     cb(null,file.originalname)
  //     // originalname means file type ///
  //   }

  filename: (
    req,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any
  ) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({ storage: storage });

// ! cloudinary ///

const uploadToCloudinary = async (file: any): Promise<any> => {
  //   cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  // { public_id: "olympic_flag" },
  // function(error, result) {console.log(result); });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      // { public_id: file.originalname },  //! don't need the line otherwise will type error

      (error: Error, result: any) => {
        fs.unlinkSync(file.path); ///! unlinkSync means delete file
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploadHelper = {
  uploadToCloudinary,
  upload,
};
