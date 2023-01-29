const db = require("_helpers/db");
const User = db.User;
const bcrypt = require("bcryptjs");
const config = require("config.json");
const jwt = require("jsonwebtoken");

var mongoose = require('mongoose');


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getUserListIdFavFilesById,
  updateUserPlaylistSongs,
  deleteUserPlaylistSongs,
  authenticate,
};

async function authenticate(userAuthentification,res) {
  try {
    var user = await User.findOne({ email: userAuthentification.email });
    if(!user){
      res.status(404).json({message: "User not find, please verify email!"});
    }
    const comparePassword = await bcrypt.compare(userAuthentification.password, user.password);

    if(!comparePassword){
      res.status(404).json({message: "User not find, please verify password!"});
    }
    if (comparePassword) {
      
      const token = jwt.sign({ sub: user }, config.secret, {
        expiresIn: "7d",
      });

      return {
        message: "ok",
        token: token,
      };
    
    } 

  } catch (error) {
    res.status(500).json({message: error.message});
  }

}

async function getAll(res) {
  const user = await User.find();
  return res.status(200).json( {
    message: "ok",
    data: user,
  });
}

async function getById(id) {
  user = await User.findById(id);
  return user;
}

async function create(userParam, req, res) {
  try {
    // validate
    if (await User.findOne({ prenom: userParam.prenom })) {
      return res.status(400).json({ message: 'prenom "' + userParam.prenom + '" is already taken' });
    }

    if (await User.findOne({ nom: userParam.nom })) {
      return res.status(400).json({message : 'Nom "' + userParam.nom + '" is already taken'});
    }

    userParam.password = bcrypt.hashSync(userParam.password);

    // create User
    const user = new User(userParam);
    // save user
    const user_ = await user.save();

    if (user_) {
      res.status(200).send({"message": "ok","data": user_.toJSON()});    
    }   

  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}

async function update(id, userParam, res) {
    try{
        const user = await User.findById(id);
        // validate
        if (!user) return res.status(400).json({message : "User not found" });
        
        // copy userParam properties to user
        Object.assign(user, userParam);
        const user_ = await user.save();
        if (user_) {
          res.status(200).send({"message": "ok","data": user_.toJSON()});    
        }   

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

async function _delete(id, res) {
    await User.findByIdAndRemove(id);
    res.status(200);
}


async function getUserListIdFavFilesById(id,res) {
  const user = await User.findById(id);
  if(!user) return res.status(404).json({message: "Error get Fav Files"});
  return res.status(200).json(user.listIdFavFiles);
}

async function updateUserPlaylistSongs(id, param, res) {
  const user = await User.findById(id);
  if(!user) return res.status(404).json({message: "erreur Fav Files list"});
  if( typeof param.fileId === 'undefined' || param.fileId === null || param.fileId === "" ) return res.status(402).json({message: "Error: Champ id file est vide"});
  user.listIdFavFiles.push(mongoose.Types.ObjectId( param.fileId ));
  user.save();
  return res.status(200).json({"message" : "File added!"});
}

async function deleteUserPlaylistSongs(id, param, res) {
  var listIdFavFilesN = param.fileId.map(s => s.toString());
  await User.updateOne( // select your doc in moongo
    { _id: id }, // your query, usually match by _id
    { $pullAll: { listIdFavFiles: listIdFavFilesN } }, // item(s) to match from array you want to pull/remove
    { multi: true } // set this to true if you want to remove multiple elements.
  )
  return res.status(200).json("Files " + listIdFavFilesN + " deleted");
}