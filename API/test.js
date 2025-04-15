const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')


async function ViewDesImage(destination_id){
  let result = await pool.query(queries.DestinationImage,[destination_id])
  let images = result.rows
  return images
  // ,(err,result)=>{
  //  if (err) {
  //    console.error('Query error:', err);     
  //    return res.status(500).json({ error: 'Database error' });
  // }
  // res.status(200).json(result.rows);
  // })
}

async function ListNearbyHotels(destination_id){
    let result = await pool.query(queries.viewHotel,[destination_id])
    let hotels = await result.rows
    return hotels
}

async function ListofRooms(hotel_id){
    let result = await pool.query(queries.ViewHotelRooms,[hotel_id])
    let rooms =  await result.rows
    return rooms
}


class OrderController{

    viewOrder(req,res,next){
       Promise.resolve('success')
          .then(()=>{
              let user_id = req.user.user_id;
              return user_id
          })
          .then((user_id)=>{
             pool.query(queries.viewOrderHistory,[user_id],(err, result) =>{
                if (err) {
                    console.error('Query error:', err);     
                    return res.status(500).json({ error: 'Database error' });
                  }
                  let bookinglist = result.rows
                  let newDate =  new Date(bookinglist[0].check_in_date);
                  let formattedDate = newDate.toISOString().split('T')[0];
                  bookinglist[0].check_in_date = formattedDate;
                  newDate =  new Date(bookinglist[0].check_out_date);
                  formattedDate = newDate.toISOString().split('T')[0];
                  bookinglist[0].check_out_date = formattedDate;
                  console.log(req.user)
                  res.status(200).json(result.rows); 
             })
          })
    }

    viewDestination(req,res){
        Promise.resolve('success')
        .then(()=>{
           pool.query(queries.viewDestination,(err, result) =>{
              if (err) {
                  console.error('Query error:', err);     
                  return res.status(500).json({ error: 'Database error' });
                }
                console.log(result.rows)
                res.status(200).json(result.rows); 
           })
        })
    }

    async viewDestination2(req,res){
        let destination_id = req.params.destination_id
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
        res.status(200).json(destination); 
    }

    async viewHotels(req,res){

        let hotel_id = req.params.hotel_id;
        let result = await pool.query(queries.viewHotelInfo,[hotel_id])
        let hotel = result.rows[0]
        let room = await ListofRooms(hotel_id)
        hotel.rooms = []
        for (let j = 0; j < room.length;j++){
          (hotel.rooms).push(room[j]);
        }
        res.status(200).json(hotel); 
    }

    // viewRoomInfo(){
    //      let room_id = req.params.room_id
    //      pool.query(queries.ViewRoomInfo,[room_id],(err,result)=>{
    //       if (err) {
    //         console.error('Query error:', err);     
    //         return res.status(500).json({ error: 'Database error' });
    //       }
    //       res.status(200).json(result.rows);
    //      })
    // }
    
    addComment(req,res){
         Promise.resolve('success')
         .then(()=>{
            console.log(req.body)
            let user_id = req.user.user_id;
            let destination_id = req.body.destination_id;
            let comment = req.body.comment;
            let rating = req.body.rating;
            let ArgList = [user_id,destination_id,rating,comment]
            return ArgList
         })
         .then((ArgList)=>{
            console.log(ArgList)
            pool.query(queries.addComment,ArgList,(err,result)=>{
                if (err) {
                    console.error('Query error:', err);     
                    return res.status(500).json({ error: 'Database error' });
                  }
                res.status(200).json({ message: 'Thành công!' });
            })
         })
    }

    RequestcancelBooking(req,res){
        Promise.resolve('success')
        .then(()=>{
            let booking_id = req.params.booking_id;
            return booking_id
        })
        .then((booking_id)=>{
           pool.query(queries.RequestcancelBooking,[booking_id],(err, result) =>{
              if (err) {
                  console.error('Query error:', err);     
                  return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Thành công!' }); 
           })
        })
    }

    CancelBooking(req,res){
        Promise.resolve('success')
        .then(()=>{
            let booking_id = req.params.booking_id;
            return booking_id
        })
        .then((booking_id)=>{
           pool.query(queries.CancelBooking,[booking_id],(err, result) =>{
              if (err) {
                  console.error('Query error:', err);     
                  return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Thành công!' }); 
           })
        })
    }

    PlaceOrder(req,res){
        Promise.resolve('success')
        .then(()=>{
           console.log(req.body)
           let user_id = req.user.user_id;
           let room_id = req.body.room_id;
           let total_price = req.body.total_price;
           let check_in_date = req.body.check_in_date;
           let check_out_date = req.body.check_out_date
           let ArgList = [user_id,room_id,total_price,check_in_date,check_out_date]
           return ArgList
        })
        .then((ArgList)=>{
           console.log(ArgList)
           pool.query(queries.BookingRoom,ArgList,(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({ error: 'Database error' });
                 }
               res.status(200).json({ message: 'Thành công!' });
           })
        })
    }

    EditProfile(req,res){
        Promise.resolve('success')
        .then(()=>{
           console.log(req.body)
           let user_id = req.user.user_id;
           let name = req.body.name;
           let email = req.body.email;
           let phone_number = req.body.phone_number;
           let gender = req.body.gender;
           let date_of_birth = req.body.date_of_birth
           let role = req.body.role
           let password = req.body.password
           let ArgList = [name,email,phone_number,gender,date_of_birth,role,password,user_id]
           return ArgList
        })
        .then((ArgList)=>{
           console.log(ArgList)
           pool.query(queries.editProfile,ArgList,(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({ error: 'Database error' });
                 }
               res.status(200).json({ message: 'Thành công!' });
           })
        })
    }


    SaveTolovingList(req,res){
      let user_id = req.user.user_id;
      let destination_id = req.body.destination_id
      pool.query(queries.AddLovingList,[user_id,destination_id],(err,result)=>{
           if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ error: 'Database error' });
           }
           res.status(200).json({ message: 'Thành công!' });
      }) 
   }

    async EditBooking(req, res) {
        try {
          const { booking_id, room_id, status, check_in_date, check_out_date } = req.body;
      
          const startDate = new Date(check_in_date);
          const endDate = new Date(check_out_date);
      
          const DiffMins = endDate - startDate;
          const DiffNgihts = (DiffMins / (1000 * 60 * 60 * 24)) - 1;
      
          // 1. Lấy giá phòng
          const result = await pool.query(queries.PriceExtract, [room_id]);
          const rawPrice = result.rows[0].price_per_night;
      
          const priceValue = parseFloat(String(rawPrice).replace(/[$,]/g, ""));
          const totalPrice = priceValue * DiffNgihts;
      
          // 2. Định dạng lại giá nếu muốn lưu dưới dạng USD string
          const formattedPrice = totalPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          });
      
          // 3. Cập nhật thông tin booking
          await pool.query(
            queries.editBooking,
            [booking_id, room_id, formattedPrice, check_in_date, check_out_date, status]
          );
      
          return res.status(200).json({ message: 'Thành công!' });
        } catch (err) {
          console.error('Lỗi khi update booking:', err);
          return res.status(500).json({ error: 'Database error' });
        }
      }
      
    viewLovingList(req,res){
      let user_id = req.user.user_id;
      pool.query(queries.ViewLovingList,[user_id],(err,result)=>{
        return res.status(200).json(result.rows);
      })
    }

    DeleteLovingList(req,res){
      let user_id = req.user.user_id;
      let destination_id = req.body.destination_id
      pool.query(queries.DeleteLovingList,[user_id,destination_id],(err,result)=>{
           if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ error: 'Database error' });
           }
           res.status(200).json({ message: 'Thành công!' });
      })
  }

    BrowseTypeBased(req,res){
       let type = req.params.type;
       pool.query(queries.TypeBrowse,[type],(err,result)=>{
           if (err) {
             console.error('Query error:', err);     
             return res.status(500).json({ error: 'Database error' });
           }   
           res.status(200).json(result.rows);
       })
    }



    BrowseLocationBased(req,res){
      let location = req.params.location;
      let formattedLocation = location.replace(/\s+/g, "");
      console.log(formattedLocation); // "Hanoi"
      pool.query(queries.LocationBrowse,[formattedLocation],(err,result)=>{
          if (err) {
            console.error('Query error:', err);     
            return res.status(500).json({ error: 'Database error' });
          }   
          res.status(200).json(result.rows);
      })
    }

    BrowseFeeBased(req,res){
       let fee = req.params.fee;
       pool.query(queries.FeeBrowse,[fee - 50000,fee],(err,result)=>{
        if (err) {
          console.error('Query error:', err);     
          return res.status(500).json({ error: 'Database error' });
        }   
        res.status(200).json(result.rows);
       })
    }
    
}

module.exports = new OrderController();


