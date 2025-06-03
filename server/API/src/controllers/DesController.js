const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const axios = require('axios');

async function ViewDesImage(destination_id) {
   let result = await pool.query(queries.DestinationImage, [destination_id])
   let images = result.rows
   return images
}

async function ListNearbyHotels(destination_id) {
   let result = await pool.query(queries.viewHotel, [destination_id])
   let hotels = await result.rows
   return hotels
}

class DesController {
   async viewDestination(req, res) {
      console.log(req.query)
      let destination_id = req.query.destination_id
      let result = await pool.query(queries.viewDestinationAll, [destination_id])
      let destination = result.rows[0]

      let images = await ViewDesImage(destination.destination_id)
      destination.image = []
      for (let j = 0; j < images.length; j++) {
         (destination.image).push(images[j].image_url);
      }
      destination.hotels = []
      let NearbyHotels = await ListNearbyHotels(destination.destination_id)
      for (let j = 0; j < NearbyHotels.length; j++) {
         (destination.hotels).push(NearbyHotels[j]);
      }
      res.status(200).json({ status: 1, data: destination });
   }
   async viewAllDestination(req, res) {
      pool.query(queries.viewDestination, (err, result) => {
         if (err) {
            return res.status(500).json({ status: 0, message: err.message })
         }
         return res.status(200).json({ status: 1, data: result.rows })
      })
   }

   SaveTolovingList(req, res) {
      let user_id = req.body.user_id;
      let destination_id = req.body.destination_id
      pool.query(queries.AddLovingList, [user_id, destination_id], (err, result) => {
         if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ status: 0, message: err.message });
         }
         return res.status(200).json({ status: 1, message: 'Thành công!' });
      })
   }



   viewLovingList(req, res) {
      let user_id = req.params.user_id;
      pool.query(queries.ViewLovingList, [user_id], (err, result) => {
         if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ status: 0, message: err.message });
         }
         return res.status(200).json({ status: 1, data: result.rows })
      })
   }



   DeleteLovingList(req, res) {
      let user_id = req.params.user_id;
      let destination_id = req.params.destination_id
      pool.query(queries.DeleteLovingList, [user_id, destination_id], (err, result) => {
         if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ status: 0, message: err.message });
         }
         return res.status(200).json({ status: 1, message: 'Thành công!' });
      })
   }


   async addComment(req, res) {
      let user_id = req.body.user_id;
      let destination_id = req.body.destination_id;
      let rating = req.body.rating;
      // let result = await pool.query(queries.getDestinationRating, [destination_id]);
      // let objs = result.rows
      // for (const obj of objs) {
      //    rating += obj.rating;
      // }
      // rating = rating * 1.0 / objs.length
      Promise.resolve('success')
         .then(() => {
            console.log(req.body)
            let comment = req.body.comment;
            let ArgList = [user_id, destination_id, rating, comment]
            return ArgList
         })
         .then((ArgList) => {
            console.log(ArgList)
            pool.query(queries.addDestinationComment, ArgList, (err, result) => {
               if (err) {
                  console.error('Query error:', err);
                  return res.status(500).json({ status: 0, message: err.message });
               }
               res.status(200).json({ status: 1, message: 'Thành công!' });
            })
         })
   }

   async getComment(req, res) {
      let destination_id = req.params.destination_id
      pool.query(queries.getDestinationComment)
   }

   async GetUsersFromDestinationReview(req, res) {
      const user_id = req.params.user_id;

      // Kiểm tra destination_id có tồn tại không
      if (!user_id) {
         return res.status(400).json({
            status: 0,
            message: "User ID is required"
         });
      }

      try {
         // Query để join bảng DesReview với User để lấy thông tin user
         const query = `
            SELECT u.user_id, u.name, u.email, u.profile_image,u.role
            FROM "User" u
            WHERE user_id = $1;
        `;

         const result = await pool.query(query, [user_id]);

         // Kiểm tra có data không
         if (!result.rows.length) {
            return res.status(404).json({
               status: 0,
               message: "No reviews found for this destination"
            });
         }

         // Trả về kết quả thành công
         return res.status(200).json({
            status: 1,
            message: "Success",
            data: result.rows[0]
         });

      } catch (error) {
         // Log lỗi để debug
         console.error('Error in GetUsersFromDestinationReview:', error);

         return res.status(500).json({
            status: 0,
            message: "Internal server error",
            error: error.message // Chỉ trả về error message trong môi trường development
         });
      }
   }

   async checkDestinationReview(req,res){
      let user_id = req.params.user_id
      let destination_id = req.params.destination_id
      pool.query(queries.checkDestinationReview,[user_id,destination_id],(err,result)=>{
         if(err) return res.status(500).json({status : 0, message : err.message})
         return res.status(200).json({status : 1, message : 'Thành công!', data : result.rows})
      })
   }

}

module.exports = new DesController();