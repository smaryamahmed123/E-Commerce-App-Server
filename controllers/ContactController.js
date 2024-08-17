import Contact from '../models/Contact.js';
import User from '../models/User.js';

export const ContactUs = async (req, res) => {
  const { name, email, message } = req.body;
  const userId = req.user.id;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const contact = new Contact({ name, email, message });
    const savedContact = await contact.save();

    await User.findByIdAndUpdate(userId, {
      $push: { messages: savedContact._id }
    });

    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};