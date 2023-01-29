const db = require("_helpers/db");
const Files = db.Files;
//const Shops = db.Shops;


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(res) {
  const files = await Files.find();
  return res.status(200).json( {
    message: "ok",
    data: files,
  });
}

async function getById(id , req, res) {
  files = await Files.findById(id);

  //shop = await Shops.findById(shoes.shopId);

  data = {"files": files/*, "shop": shop*/}
  return res.status(200).json( {
    message: "ok",
    data,
  });
}

async function create(FilesParam, req, res) {
  try {

    // create Shoes
    const files = new Files(FilesParam);

    // save Shoes
    const files_ = await files.save();

    if (files_) {
      res.status(200).send({"message": "ok","data": files_.toJSON()});    
    }   

  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}

async function update(id, FilesParam, res) {
    try{
        const files = await Files.findById(id);
        // validate
        if (!files) return res.status(400).json({message : "Files not found" });
        
        // copy ShoesParam properties to Shoes
        Object.assign(files, FilesParam);
        const Files_ = await files.save();
        if (Files_) {
          res.status(200).send({"message": "ok","data": Files_.toJSON()});    
        }   

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

async function _delete(id, res) {
    await Files.findByIdAndRemove(id);
    res.status(200);
}
