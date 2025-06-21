import express from 'express'
import mongoose from 'mongoose';
import User from '../models/User.js'

import { v2 as cloudinary } from 'cloudinary';
import Message from '../models/Message.js';
import { io, userSocketMap} from '../server.js';

cloudinary.config({
  cloud_name: 'dsdeulelt',
  api_key: '242125981991162',
  api_secret: 'vwOt0XljkqBcZ1UNecrzM-9LFyM',
});


export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (message.length > 0) {
        unseenMessages[user._id] = message.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

  
    if (!mongoose.Types.ObjectId.isValid(selectedUserId) || !mongoose.Types.ObjectId.isValid(myId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessage:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Message ID is required' });
    }
    
    const updatedMessage = await Message.findByIdAndUpdate(
      id, 
      { seen: true }, 
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    res.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ success: false, message: 'Text or image is required' });
    }

    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMessage', newMessage);
    }

    const senderSocket = userSocketMap[senderId];
    if (senderSocket) {
      io.to(senderSocket).emit('newMessage', newMessage);
    }

    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};