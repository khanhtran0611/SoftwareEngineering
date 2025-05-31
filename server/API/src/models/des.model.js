const pool = require('../config/db/index.js') /*ok*/
const queries = require('../config/db/queries.js')
const fs = require('fs');
const path = require('path');
const multer = require('multer');

class DesModel{

   deleteImage(fileName) {
     const imagePath = path.join(__dirname, 'public\\img', fileName);

  // Kiểm tra xem file tồn tại không
      if (fs.existsSync(imagePath)) {
         fs.unlinkSync(imagePath); // Xóa đồng bộ
         console.log(`Đã xóa ảnh: ${fileName}`);
    } 
}

   static async DeleteoldImages(req,res,next){
      const client = await pool.connect();
        try{
            await client.query('BEGIN');
            let old_images = await client.query("DELETE FROM ServicePossessing where destination_id = $1 RETURING *",[destination_id]);
            for(const old_image of old_images){
               deleteImage(old_image)
            }
            await client.query('COMMIT');
            return {success : true};
        }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể xóa ảnh cũ: ' + err.message);
        } finally {
            client.release();
            next();
        }      
   }

   static async UpdateDestinationImage(images,destination_id){
      const client = await pool.connect();
        try{
            await client.query('BEGIN');
            for (const image of images){
                await client.query(queries.addDestinationImage,[destination_id,image]);
            }
            await client.query('COMMIT');
            return {success : true};
        }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật ServicePossessing: ' + err.message);
        } finally {
            client.release();
        }
   }
}


module.exports = DesModel;