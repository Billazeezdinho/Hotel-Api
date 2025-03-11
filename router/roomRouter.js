const roomRouter = require('express').Router()
const { createRoom, changeRoomImage, deleteRoomImage } = require('../controllers/roomController')
const upload = require('../utils/multer');

roomRouter.post('/room', upload.array('images', 10), createRoom)
roomRouter.patch('/room/:id/:imageId', upload.single('image'), changeRoomImage);
roomRouter.delete('/room/:id/:imageId', deleteRoomImage);


module.exports = roomRouter;

