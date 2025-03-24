// const roomRouter = require('express').Router()
// const { createRoom, changeRoomImage, deleteRoomImage } = require('../controllers/roomController')
// const upload = require('../utils/multer');

// roomRouter.post('/room', upload.array('images', 10), createRoom)
// roomRouter.patch('/room/:id/:imageId', upload.single('image'), changeRoomImage);
// roomRouter.delete('/room/:id/:imageId', deleteRoomImage);


// module.exports = roomRouter;
const roomRouter = require('express').Router();
const { createRoom, changeRoomImage, deleteRoomImage } = require('../controllers/roomController');
const upload = require('../utils/multer');

/**
 * @swagger
 * /api/v1/room:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Room created successfully
 */
roomRouter.post('/room', upload.array('images', 10), createRoom);

/**
 * @swagger
 * /api/v1/room/{id}/{imageId}:
 *   patch:
 *     summary: Change room image
 *     tags:
 *       - Rooms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room image changed successfully
 */
roomRouter.patch('/room/:id/:imageId', upload.single('image'), changeRoomImage);

/**
 * @swagger
 * /api/v1/room/{id}/{imageId}:
 *   delete:
 *     summary: Delete room image
 *     tags:
 *       - Rooms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room image deleted successfully
 */
roomRouter.delete('/room/:id/:imageId', deleteRoomImage);

module.exports = roomRouter;
