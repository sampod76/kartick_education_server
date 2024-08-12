import mongoose from "mongoose";
import { HomeVideoUploadModel } from "./homeVideoUpload.model"
import { HomeVideoUpload } from "./HomeVideo.interface";
const { ObjectId } = mongoose.Types;


const uploadVideoDataInDB = async (payload:HomeVideoUpload) => {

const result = await HomeVideoUploadModel.create(payload)

return result


    
}


const getAllVideoFromDb = async () => {


    const result = await HomeVideoUploadModel.find()

    // console.log(result);
    

    return result
    
}

const getSingleVideoFromDb = async (id:string) => {

    const result = await HomeVideoUploadModel.aggregate([
        {$match : {_id : new ObjectId(id)}}
    ])

    // console.log(result);
    

    return result
    
}


export const homeVedioUploadServices = {
    getAllVideoFromDb,
    getSingleVideoFromDb,
    uploadVideoDataInDB
}