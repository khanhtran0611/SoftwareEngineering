const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

async function ListNearbyHotels(destination_id){
    let result = await pool.query(queries.viewHotel,[destination_id])
    let hotels = await result.rows
    return hotels
}

async function ListofRooms(hotel_id){
    let result = await pool.query(queries.ViewHotelRooms,[hotel_id])
    let rooms =  await result.rows
    for(let i = 0;i < rooms.length ;i++){
      let service = await ListofServices(rooms[i].room_id);
      rooms[i].services = []
      for(let j = 0;j < service.length;j++){
          (rooms[i].services).push(service[j]);
      }
    }
    return rooms
}

async function ListofFacilities(hotel_id){
      let result = await pool.query(queries.ListofFacilities,[hotel_id])
      let facilities = await result.rows
      return facilities
}

async function ListofServices(room_id){
      let result = await pool.query(queries.ListofServices,[room_id])
      let services = await result.rows;
      return services
}

class HotelController{

    // View all hotel information for customers
    async viewHotels(req,res){
        let hotel_id = req.params.hotel_id;
        let result = await pool.query(queries.viewHotelInfo,[hotel_id])
        let hotel = result.rows[0]
        res.status(200).json({status : 1,data : hotel}); 
    }

    async addComment(req,res){
        let user_id = req.body.user_id;
        let rating = req.body.rating;
        // let result = await pool.query(queries.getHotelRating,[hotel_id]);
        // let objs = result.rows
        // for(const obj of objs){
        //    rating += obj.rating;
        // }
        // rating = rating*1.0 / objs.length 
        Promise.resolve('success')
        .then(()=>{
           console.log(req.body)
           let hotel_id = req.body.hotel_id;
           let comment = req.body.comment;
           let ArgList = [user_id,hotel_id,rating,comment]
           return ArgList
        })
        .then((ArgList)=>{
           console.log(ArgList)
           pool.query(queries.addComment,ArgList,(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({status : 0, message: err.message });
                 }
               res.status(200).json({status : 1, message: 'Thành công!', data: result.rows[0] });
           })
        })
   }

   async checkHotelReview(req,res){
    let user_id = req.params.user_id
    let hotel_id = req.params.hotel_id
    pool.query(queries.CheckHotelReview,[user_id,hotel_id],(err,result)=>{
        if(err){
            return res.status(500).json({status : 0, message : err.message})
        }   
        return res.status(200).json({status : 1, data : result.rows})
    })
   }    
}

module.exports = new HotelController();

