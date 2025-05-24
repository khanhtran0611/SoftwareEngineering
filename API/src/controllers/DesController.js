const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

async function ViewDesImage(destination_id){
    let result = await pool.query(queries.DestinationImage,[destination_id])
    let images = result.rows
    return images
  }
  
  async function ListNearbyHotels(destination_id){
      let result = await pool.query(queries.viewHotel,[destination_id])
      let hotels = await result.rows
      return hotels
  }

class DesController{
    async viewDestination(req,res){
        console.log(req.query)
        let destination_id = req.query.destination_id
        let result = await pool.query(queries.viewDestinationAll,[destination_id])
        let destination = result.rows[0]
       
        let images = await ViewDesImage(destination.destination_id)
        destination.image = []
        for (let j = 0; j < images.length;j++){
              (destination.image).push(images[j].image_url);
        }
        destination.hotels = []
        let NearbyHotels = await ListNearbyHotels(destination.destination_id) 
        for (let j = 0; j < NearbyHotels.length;j++){
          (destination.hotels).push(NearbyHotels[j]);
        }
        res.status(200).json({status : 1, data : destination}); 
    }
   async viewAllDestination(req,res){
        pool.query(queries.viewDestination,(err,result)=>{
          if(err){
            return res.status(500).json({status : 0, message : err.message})
          }
          return res.status(200).json({status : 1, data :result.rows})
       })
   }

    SaveTolovingList(req,res){
        let user_id = req.user.user_id;
        let destination_id = req.body.destination_id
        pool.query(queries.AddLovingList,[user_id,destination_id],(err,result)=>{
             if (err) {
                console.error('Query error:', err);     
                return res.status(500).json({status : 0, message : err.message });
             }
             return res.status(200).json({status : 1, message: 'Thành công!' });
        }) 
     }



     viewLovingList(req,res){
        let user_id = req.user.user_id;
        pool.query(queries.ViewLovingList,[user_id],(err,result)=>{
             if (err) {
                console.error('Query error:', err);     
                return res.status(500).json({status : 0, message : err.message });
             }
          return res.status(200).json({status : 1, data :result.rows})
        })
      }



      DeleteLovingList(req,res){
        let user_id = req.user.user_id;
        let destination_id = req.body.destination_id
        pool.query(queries.DeleteLovingList,[user_id,destination_id],(err,result)=>{
             if (err) {
                console.error('Query error:', err);     
                return res.status(500).json({status : 0, message : err.message });
             }
             return res.status(200).json({status : 1, message: 'Thành công!' });
        })
    }


        async addComment(req,res){
        let user_id = req.user.user_id;
        let destination_id = req.body.destination_id;
        let rating = 0;
        let result = await pool.query(queries.getDestinationRating,[destination_id]);
        let objs = result.rows
        for(const obj of objs){
           rating += obj.rating;
        }
        rating = rating*1.0 / objs.length 
        Promise.resolve('success')
        .then(()=>{
           console.log(req.body)
           let comment = req.body.comment;
           let ArgList = [user_id,destination_id,rating,comment]
           return ArgList
        })
        .then((ArgList)=>{
           console.log(ArgList)
           pool.query(queries.addDestinationComment,ArgList,(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({status : 0, message: err.message });
                 }
               res.status(200).json({status : 1, message: 'Thành công!' });
           })
        })
   }
}

module.exports = new DesController();