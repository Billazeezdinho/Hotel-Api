const categoryModel = require("../models/category");
const roomModel = require("../models/room");

exports.createRoom = async (req, res) => {
  try {
    // Extract the user ID from the request User Object
    const { id: categoryId } = req.params;
    // Extract the required fields from the request Body
    const { roomName, price, roomNumber, description } = req.body;

    //Check if category exists
    const categoryExists = await categoryModel.findById(categoryId);
    if (categoryExists == null) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    // Get the file into a variable
    const file = req.files;
    //Declare an empty Array to help hold the results from cloudinary
    const imageArray = [];

    //Handle the multiple image to cloudinary one after the other
    for (const image of file) {
      const categoryModel = require("../models/category");
      const roomModel = require("../models/room");

      const result = await cloudinary.uploader.upload(image.path);
      // delete the image from local storage
      fs.unlinkSync(image.path);
      //create the image properties using the results from the cloudinary
      const imageProperties = {
        imageUrl: result.secure_url,
        imageId: result.public_id,
      };
      imageArray.push(imageProperties);
    }
    // create an instance of the document
    const room = new roomModel({
      category: categoryId,
      roomName,
      roomNumber,
      price,
      description,
      image: imageArray,
    });

    //  save the room details to dataBase
    await room.save();
    await categoryExists.save();

    //send a response message
    res.status(200).json({
      message: "Room added successfully",
      data: room
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// exports.createRoom = async (req, res) => {
//   try {
//     // Extract the user ID from the request User Object
//     const { id: categoryId } = req.params;
//     // Extract the required fields from the request Body
//     const { roomName, price, roomNumber, description } = req.body;

//     //Check if category exists
//     const categoryExists = await categoryModel.findById(categoryId);
//     if (categoryExists == null) {
//       return res.status(404).json({
//         message: "Category not found",
//       });
//     }
//     // Get the file into a variable
//     const file = req.files;
//     //Declare an empty Array to help hold the results from cloudinary
//     const imageArray = [];

//     //Handle the multiple image to cloudinary one after the other
//     for (const image of file) {
//       const result = await cloudinary.uploader.upload(image.path);
//       // delete the image from local storage
//       fs.unlinkSync(image.path);
//       //create the image properties using the results from the cloudinary
//       const imageProperties = {
//         imageUrl: result.secure_url,
//         imageId: result.public_id,
//       };
//       imageArray.push(imageProperties);
//     }
//     // create an instance of the document
//     const room = new roomModel({
//       category: categoryId,
//       roomName,
//       roomNumber,
//       price,
//       description,
//       image: imageArray,
//     });

//     //  save the room details to dataBase
//     await room.save();
//     await categoryExists.save();

//     //send a response message
//     res.status(200).json({
//       message: "Room added successfully",
//       data: room,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };


exports.changeRoomImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        // Find the room by ID
        const roomExist = await roomModel.findById(id);
        if (roomExist == null) {
            return res.status(404).json({ 
                message: "Room Not Found" 
            });
        }

        
        const imageIndex = roomExist.images.findIndex(img => img.public_id === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ 
                message: "Image Not Found in this Room" 
            });
        }
        await cloudinary.uploader.destroy(imageId);

        // Upload new image to Cloudinary
        const cloudImage = await cloudinary.uploader.upload(req.file.path);

        // Update the image details in the array
        roomExists.images[imageIndex] = {
            public_id: cloudImage.public_id,
            imageUrl: cloudImage.secure_url
        };

        // Save the updated room document
        await roomExist.save();

        // Delete the uploaded file from local storage
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            } else {
                console.log("Local file deleted successfully.");
            }
        });
        // Return success response
        return res.status(200).json({
            message: "Room image updated successfully",
            data: roomExist
        });

    } catch (err) {
        console.error("Error updating room image:", err);
        res.status(500).json({ 
            message: "Internal Server Error: " + err.message 
        });
    }
};


exports.deleteRoomImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        // Find the room by ID
        const roomExists = await roomModel.findById(id);
        if (roomExists == null) {
            return res.status(404).json({ 
                message: "Room Not Found" 
            });
        }

        const imageIndex = roomExists.images.findIndex(img => img.public_id === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ 
                message: "Image Not Found in this Room" 
            });
        }    

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // Remove the image details from the array
        roomExists.images.splice(imageIndex, 1);

        // Save the updated room document
        await roomExists.save();

        // Return success response
        return res.status(200).json({
            message: "Room image deleted successfully",
            data: roomExists
        });

    } catch (err) {
        console.error("Error deleting room image:", err);
        res.status(500).json({ 
            message: "Internal Server Error: " + err.message 
        });
    }
};