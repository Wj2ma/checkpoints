import * as mongoose from 'mongoose';

const schema = {
  token: { type: String, required: true, unique: true },
  user_id: { type: Number, required: true, ref: 'User' },
  client_id: { type: String, required: true },
  expires: { type: Date, required: true }
};

const accessTokenSchema = new mongoose.Schema(schema);

accessTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);
export default AccessToken;