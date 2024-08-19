import mongoose from'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, },
  lastName: { type: String, },
  name: {type: String},
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    // required: [true, 'Password is required'], // Make the field required
    minlength: [6, 'Password must be at least 6 characters long'], // Minimum length
    validate: {
      validator: function(v) {
        // Custom validation to check for at least one number and one special character
        return /[0-9]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v);
      },
      message: props => `${props.value} is not a valid password! Must include a number and a special character.`
    }
  },
  googleId: { type: String },
  avatar: {type: String,},
  role: { type: String, default: 'user' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
},{timestamps: true});

const User = mongoose.model('Userssssss', UserSchema);

export default User;
