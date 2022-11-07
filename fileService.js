const path = require('path')

class FileService{

    saveFile(file,id_file,type){
   //     try{
        const filePath = path.resolve('static',id_file+'.'+ type)
        file.mv(filePath);
        console.log('filePath',filePath);
         return filePath
    // }catch(e){
    //     console.log(e)
    // }

    }
}
module.exports = new FileService()
