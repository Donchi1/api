import { v2 } from "cloudinary";
import fs from "fs";

const cloudinary = v2;
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "donny12",
  api_key: process.env.API_KEY || "356334839991679",
  api_secret: process.env.API_SECRET || "gDkF1r2xFX9ZmUfm8-R-dOtaUXU",
});

// Upload

export const imageUploaderMultiple = async (clientFiles) => {
  const file = Object.values(clientFiles)
  file.forEach(each => {
    each.mv(`${each.tempFilePath}${each.name}`, (err) => {
      if (err) return console.log(err);
    });
 
  })
  try {
    // uload image to cloudinary
    const data = await Promise.all(
     file.map(async each => {
        return await cloudinary.uploader.upload(
          `${each.tempFilePath}${each.name}`,
          { public_id: each.name.split(".")[0] }
        );
      })
    )
    
    file.forEach(item => {
      fs.unlink(`${item.tempFilePath}${item.name}`, (err) => {
        if (err) return console.log(err.message);
      });
    })
    
    
    return { error: false, data };
  } catch (err) {
    // delete the img locally if there is error
    file.forEach(item => {
      fs.unlink(`${item.tempFilePath}${item.name}`, (err) => {
        if (err) return console.log(err.message);
      });
    })
    return { error: true, data: err };
  }
};
export const imageUploader = async (file) => {
  file.mv(`${file.tempFilePath}${file.name}`, (err) => {
    if (err) return console.log(err);
  });
  try {
    // uload image to cloudinary
    const data = await cloudinary.uploader.upload(
      `${file.tempFilePath}${file.name}`,
      { public_id: file.name.split(".")[0] }
    );
    // delete the image locally after storing in cloudinary
    fs.unlink(`${file.tempFilePath}${file.name}`, (err) => {
      if (err) return console.log(err.message);
    });
    return { error: false, data };
  } catch (err) {
    // delete the img locally if there is error
    fs.unlink(`${file.tempFilePath}${file.name}`, (err) => {
      if (err) return console.log(err.message);
    });
    return { error: true, data: err };
  }
};
export const imageDeleteMultiple = async (filesForDelete) => {

  try {
    //delete image in cloudinary
  await Promise.all(
    filesForDelete.map(async each => {
      await cloudinary.uploader.destroy(each.imgId);
    })
    )
    return { success: true, error: false, data: "" };
  } catch (err) {
    return { success: false, error: true, data: err };
  }
};
export const imageDelete = async (fileId) => {
  try {
    //delete image in cloudinary
    await cloudinary.uploader.destroy(fileId);
    return { success: true, error: false, data: "" };
  } catch (err) {
    return { success: false, error: true, data: err };
  }
};
