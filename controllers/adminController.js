import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AdminRequest from '../models/AdminRequest.js';
import User from '../models/User.js';
import { adminApprovalList } from '../config/adminApprovalList.js';

dotenv.config();


export const Users = async (req, res) => {
    try {
      const users = await User.find().populate('orders').populate('messages');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

export const GetRequestUser = async (req, res) => {
    try {
      const requests = await AdminRequest.find({ status: 'pending' });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

export const PostRequestUser =  async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    if (adminApprovalList.includes(email)) {
      return res.status(400).json({ message: 'Email is already in the approval list' });
    }
  
    try {
      const existingRequest = await AdminRequest.findOne({ email });
      if (existingRequest) {
        return res.status(400).json({ message: 'Request already exists' });
      }
  
      const newRequest = new AdminRequest({ email });
      await newRequest.save();
  
      res.status(200).json({ message: 'Admin request submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


export const ApproveRequest = async (req, res) => {
    const { email } = req.body;
  
    try {
      const request = await AdminRequest.findOne({ email });
  
      if (!request || request.status !== 'pending') {
        return res.status(404).json({ message: 'Request not found or already processed' });
      }
  
      request.status = 'approved';
      await request.save();
  
      const user = await User.findOne({ email });
      if (user) {
        user.role = 'admin';
        await user.save();
      }
  
      res.status(200).json({ message: 'Admin request approved' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const DenyRequest = async (req, res) => {
    const { email } = req.body;
  
    try {
      const request = await AdminRequest.findOne({ email });
  
      if (!request || request.status !== 'pending') {
        return res.status(404).json({ message: 'Request not found or already processed' });
      }
  
      request.status = 'denied';
      await request.save();
  
      res.status(200).json({ message: 'Admin request denied' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  