 import express from 'express'
import protectRoute from '../middlewere/auth.js';
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/massageController.js';
 const messageRouter = express.Router();

 messageRouter.get("/users",protectRoute,getUsersForSidebar);
 messageRouter.get("/:id",protectRoute,getMessage);
 messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);
 export default messageRouter;