import { RequestHandler, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import User from '../models/user.models';
import Message from '../models/message.models';
import cloudinary from '../lib/cloudinary';


export const getUsersForSidebar: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const getMessages: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userChatId },
        { sender: userChatId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

}


export const sendMessage: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }
    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
    await newMessage.save();

    // todo: realtime functionality goes here using socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}