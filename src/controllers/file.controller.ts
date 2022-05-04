import { Request, Response } from "express";
import { User } from "../models/user.model";
// plug cloudinary
import { cloudinaryConfig } from "../config/cloudinary";

export class FileController {
  FileController() {}
  async upload(req: any, res: Response) {
    try {
      console.log('yooo',req.file)
      let cloud_dir="Kigali-Green-Gallery-store/"
      // checking which action to upload for
      const q = req.query.model;
      let model: any; // model to assign the object parallel to the given object
      if (q === "user") {
        model = await User.findById(req.params.id);
        cloud_dir+='profiles'
      } else
        return res.status(404).send({
          success: false,
          message: "Action not found",
        });
      if (!model)
        return res
          .send({
            success: false,
            message: "Object not found",
          })
          .status(404);
      let cloudResponse: any;
      if (model.file_link) {
        let fileData = model.file_link;
        await cloudinaryConfig.uploader.destroy(
          cloud_dir+'/' + fileData,
          function (error: any, result: string) {
            //   console.log(result, error)
          }
        );
        cloudResponse = await cloudinaryConfig.uploader.upload(req.file.path, {
          use_filename: true,
          unique_filename: false,
          folder: cloud_dir,
        });
      } else {
        cloudResponse = await cloudinaryConfig.uploader.upload(req.file.path, {
          use_filename: true,
          unique_filename: false,
          folder: cloud_dir,
        });

       
      }
      model.file_link = cloudResponse.secure_url;
      model.save();
      return res
        .json({
          success: true,
          message: "File saved successfully",
          data: model,
        })
        .status(200);
    } catch (error: any) {
      return res
        .send({
          success: false,
          message: error.message,
        })
        .status(400);
    }
  }
}







