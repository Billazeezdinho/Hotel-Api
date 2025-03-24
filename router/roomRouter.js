// const roomRouter = require('express').Router()
// const { createRoom, changeRoomImage, deleteRoomImage } = require('../controllers/roomController')
// const upload = require('../utils/multer');

// roomRouter.post('/room', upload.array('images', 10), createRoom)
// roomRouter.patch('/room/:id/:imageId', upload.single('image'), changeRoomImage);
// roomRouter.delete('/room/:id/:imageId', deleteRoomImage);


// module.exports = roomRouter;

const roomRouter = require("express").Router();
const { createRoom, changeRoomImage, deleteRoomImage } = require("../controllers/roomController");
const upload = require("../utils/multer");

/**
 * @swagger
 * /api/v1/room:
 *   post:
 *     summary: Create a new room
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
roomRouter.post("/room", upload.array("images", 10), createRoom);

/**
 * @swagger
 * /api/v1/room/{id}/{imageId}:
 *   patch:
 *     summary: Change a room image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         description: Image ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room image changed
 */
roomRouter.patch("/room/:id/:imageId", upload.single("image"), changeRoomImage);

/**
 * @swagger
 * /api/v1/room/{id}/{imageId}:
 *   delete:
 *     summary: Delete a room image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         description: Image ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room image deleted
 */
roomRouter.delete("/room/:id/:imageId", deleteRoomImage);

module.exports = roomRouter;
