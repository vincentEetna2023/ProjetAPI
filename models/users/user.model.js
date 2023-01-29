const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  prenom: { type: String, unique: true, required: true },
  nom: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: false },
  email :{ type: String, unique: true, required:true},
  password : {type: String, required: true},
  listIdFavFiles : [{type: Schema.Types.ObjectId, ref: 'files' , default:[]}]
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.hash;
  },
});

module.exports = mongoose.model("Users", schema);