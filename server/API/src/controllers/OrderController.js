const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc SMTP server khác
  auth: {
    user: 'trangiakhanht@gmail.com', // Email của bạn
    pass: 'kfjv ppqk mdap ystf' // Mật khẩu ứng dụng (với Gmail)
  }
});

function isEmail(string) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(string);
 }

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isValidDate(dateString) {
  // Kiểm tra định dạng yyyy-mm-dd
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!regex.test(dateString)) return false;
  
  // Tách năm, tháng, ngày
  const [year, month, day] = dateString.split("-").map(Number);
  
  // Kiểm tra số ngày hợp lệ theo tháng
  const daysInMonth = [31, 28 + (isLeapYear(year) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

class OrderController{

    viewOrder(req,res,next){
       Promise.resolve('success')
          .then(()=>{
              let user_id = req.params.user_id;
              return user_id
          })
          .then((user_id)=>{
             pool.query(queries.viewOrderHistory,[user_id],(err, result) =>{
                if (err) {
                    console.error('Query error:', err);     
                    return res.status(500).json({ error: 'Database error' });
                  }
                  let bookinglist = result.rows
                  for (let i = 0; i < bookinglist.length; i++) {
                    let checkInDate = new Date(bookinglist[i].check_in_date);
                    let checkOutDate = new Date(bookinglist[i].check_out_date);
                  
                    // Format theo múi giờ Việt Nam
                    bookinglist[i].check_in_date = checkInDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // yyyy-mm-dd
                    bookinglist[i].check_out_date = checkOutDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
                  }
                  return res.status(200).json({
                    status : 1,
                    data : bookinglist
                  }); 
             })
          })
    }

    ViewBookingDetail(req,res){
      let booking_id = req.params.booking_id;
      pool.query(queries.viewBookingDetail,[booking_id],(err, result) =>{
        if (err) {
          console.error('Query error:', err);     
          return res.status(500).json({ status : 0 , error: err.message });
        }
        let checkInDate = new Date(result.rows[0].check_in_date);
        let checkOutDate = new Date(result.rows[0].check_out_date);
      
        // Format theo múi giờ Việt Nam
        result.rows[0].check_in_date = checkInDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // yyyy-mm-dd
        result.rows[0].check_out_date = checkOutDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
        return res.status(200).json({
          status : 1,
          data : result.rows[0]
        }); 
      })
    }

    getRoomDetail(req,res){
      let room_id = req.params.room_id;
      pool.query(queries.getRoomDetail,[room_id],(err, result) =>{
        if (err) {   
          return res.status(500).json({ status : 0 , error: err.message });
        }
        return res.status(200).json({
          status : 1,
          data : result.rows[0]
        }); 
      })
    }

    CheckLovingList(req,res){
      let user_id = req.params.user_id
      let destination_id = req.params.destination_id
      pool.query(queries.CheckLovingList,[user_id,destination_id],(err,result)=>{
        return res.status(200).json({status : 1, data : result.rows})
      })
    }


    BookingStatusChange(req,res){
        Promise.resolve('success')
        .then(()=>{
          let booking_id = req.params.booking_id;
          let status = req.body.status;
           pool.query(queries.BookingStatusChange,[booking_id,status],(err, result) =>{
              if (err) {
                  console.error('Query error:', err);     
                  return res.status(500).json({ status : 0 });
                }
                let checkInDate = new Date(result.rows[0].check_in_date);
                let checkOutDate = new Date(result.rows[0].check_out_date);
               
                // Format theo múi giờ Việt Nam
                result.rows[0].check_in_date = checkInDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // yyyy-mm-dd
                result.rows[0].check_out_date = checkOutDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
                res.status(200).json({ status: 1, data : result.rows[0]}); 
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
                  return res.status(500).json({ status : 0 });
                }
                res.status(200).json({ status: 1 }); 
           })
        })
    }





   async checkValidRoomStatus(room_id){
      let result = await pool.query(queries.getRoomStatus);
      if(result.rows == null){
         return false
      }
      if(result.rows[0] != 'available') return false
      return true;
   }

    async PlaceOrder(req,res){
        
           console.log(req.body)
           let user_id = req.body.user_id;
           let room_id = req.body.room_id;
           let check_in_date = req.body.check_in_date;
           let check_out_date = req.body.check_out_date;
           let peoples = req.body.people;
           let total_price = req.body.total_price;

          //  if(!checkValidRoomStatus(room_id)){
          //     return res.status(400).json(
          //       { 
          //         status : 2,
          //         error : 'The room is unavialble to be booked !' 
          //       }
          //     )
          //  }

          //  if(peoples < 1){
          //     return res.status(400).json({ 
          //          status : 2,
          //          error : 'Number of peoples need to be larger than 0' 
          //       })
          //  }

          //  if(!this.isValidDate(check_in_date) || !this.isValidDate(check_out_date)){
          //    return res.status(400).json({ 
          //       status : 2,
          //       error : 'Check in or Check out date needs to be in format of date : dd-mm-yyyy' 
          //       })
          //  }

          //  if(check_in_date == check_out_date){
          //     return res.status(400).json({ 
          //          status : 2,
          //          error : 'Check in or Check out date needs to be different' 
          //         })
          //  }

           let ArgList = [user_id,room_id,total_price,check_in_date,check_out_date,peoples]
           try{
              let bookingresult = await pool.query(queries.BookingRoom,ArgList,(err,result)=>{
                  if(err){
                     return res.status(500).json({ 
                       status : 0,
                       error: 'Error when extracting the price of a room' 
                      }); 
                  }
                  res.status(200).json({ 
                    status : 1,
                    message: 'Thành công!',
                    data : result.rows[0]
                    });
              })

           }catch(err){
                 return res.status(500).json({ 
                  status : 0,
                  error: 'Error when extracting the price of a room' 
                }); 
           }
    }

    ViewComment(req,res){
        let hotel_id = req.params.hotel_id
         pool.query(queries.viewComment,[hotel_id],(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({
                     status : 0,
                     error: 'Database error' });
                 }
               res.status(200).json({status : 1, data : result.rows});
           })
    }

    ViewDestinationComment(req,res){
      let destination_id = req.params.destination_id
         pool.query(queries.ViewDestinationComment,[destination_id],(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({
                     status : 0,
                     error: 'Database error' });
                 }
               
               res.status(200).json({status : 1, data : result.rows});
           })
    }

    EditDestinationComment(req,res){
      let destination_id = req.body.destination_id
      let user_id = req.body.user_id
      let comment = req.body.comment
      let rating = req.body.rating
      let ArgList = [user_id,destination_id,rating,comment]
      pool.query(queries.editDestinationComment,ArgList,(err,result)=>{
        if(err){
          return res.status(500).json({status : 0, error: 'Database error'})
        }
        return res.status(200).json({status : 1, message: 'Thành công!',data : result.rows[0]})
      })
    }     

    DeleteDestinationComment(req,res){
      let destination_id = req.params.destination_id
      let user_id = req.params.user_id
      pool.query(queries.deleteDestinationComment,[user_id,destination_id],(err,result)=>{
        if(err){  
          return res.status(500).json({status : 0, error: 'Database error'})
        }
        return res.status(200).json({status : 1, message: 'Thành công!',data : result.rows[0]})
      })
    } 

    AddDestinationComment(req,res){
      let destination_id = req.params.destination_id
      let user_id = req.user.user_id
      let comment = req.body.comment
      let rating = req.body.rating
      let ArgList = [destination_id,user_id,comment,rating]
      pool.query(queries.AddDestinationComment,ArgList,(err,result)=>{
        if(err){
          return res.status(500).json({status : 0, error: 'Database error'})
        }
        return res.status(200).json({status : 1, message: 'Thành công!'})
      })
    }

    ViewProfile(req,res){
       let user_id = req.params.user_id;
       pool.query(queries.viewProfile,[user_id],(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json({ status : 0, error: 'Database error' });
                 }
               res.status(200).json(
                { 
                 status : 1 , 
                 data : result.rows[0]
                }
              );
           })
    }



    EditProfile(req,res){
        Promise.resolve('success')
        .then(()=>{
           let user_id = req.body.user_id;
           let name = req.body.name;
           let email = req.body.email;
           let phone_number = req.body.phone_number;
           let gender = req.body.gender;
           let date_of_birth = req.body.date_of_birth;
           let profile_image = req.body.profile_image;
           let ArgList = [name,email,phone_number,gender,date_of_birth,profile_image,user_id]
           
           if(gender != 'male' && gender != 'female'){
              return res.status(500).json({
                status: 2,
                message : "We only accept male or female !"
              })
           }
           
           if(!isValidDate(date_of_birth)){
              return res.status(500).json({
                  status: 2,
                  message : "Please return a valid date of birth"
                })
           }

          //  if(!isEmail(email)){
          //     return res.status(500).json({
          //         status: 2,
          //         message : "Please enter a valid email !"
          //       })
          //  }
           return ArgList
        })
        .then((ArgList)=>{
          
           pool.query(queries.editProfile,ArgList,(err,result)=>{
               if (err) {
                   console.error('Query error:', err);     
                   return res.status(500).json(
                    { 
                      status : 0,
                      message: err.message
                    }
                  );
                 }
               res.status(200).json(
                {
                  status : 1 ,
                  message: 'Thành công!' ,
                  data : result.rows[0]
                }
              );
           })
        })
    }




    SaveTolovingList(req,res){
      let user_id = req.user.user_id;
      let destination_id = req.body.destination_id
      pool.query(queries.AddLovingList,[user_id,destination_id],(err,result)=>{
           if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ 
                status : 0,
                message: err.message
              });
           }
           res.status(200).json({ 
            status : 1,
            message: 'Thành công!' });
      }) 
   }

    async EditBooking(req, res) {
        try {
          const { booking_id, room_id, status, check_in_date, check_out_date, people } = req.body;
           
          console.log(booking_id, room_id, status, check_in_date, check_out_date, people)
          if(!isValidDate(check_in_date) || !isValidDate(check_out_date)){
             return res.status(400).json({ 
                status : 2,
                message : 'Check in or Check out date needs to be in format of date : dd-mm-yyyy' 
                })
           }
          
          if(status != 'pending' && status != 'completed' && status != 'cancelled' && status != 'cancel_requested'){
             return res.status(400).json({ 
                status : 2,
                message : 'Status can only be "pending" or "completed" or "cancelled" or "cancel_requested"' 
                })
          }
          console.log(booking_id, room_id, status, check_in_date, check_out_date, people)
          let startDate = new Date(check_in_date);
          let endDate = new Date(check_out_date);
      
          let DiffMins = endDate - startDate;
          let DiffNgihts = (DiffMins / (1000 * 60 * 60 * 24));
          // 1. Lấy giá phòng
          let result = await pool.query(queries.PriceExtract, [room_id]);
          let rawPrice = result.rows[0].price_per_night;
          let totalPrice = rawPrice * DiffNgihts;
      
          // 2. Định dạng lại giá nếu muốn lưu dưới dạng USD string
          // const formattedPrice = totalPrice.toLocaleString('en-US', {
          //   style: 'currency',
          //   currency: 'USD',
          // });
      
          // 3. Cập nhật thông tin booking
          // await pool.query(
          //   queries.editBooking,
          //   [booking_id, room_id, totalPrice, check_in_date, check_out_date, status,peoples]
          // );
          result = await pool.query(queries.editBooking, [booking_id, room_id, totalPrice, check_in_date, check_out_date, status,people]);
          return res.status(200).json({ status : 1, data: result.rows[0]});
        } catch (err) {
          console.error('Lỗi khi update booking:', err);
          return res.status(500).json({ status : 0, message: err.message });
        }
      }
      
    viewLovingList(req,res){
      let user_id = req.user.user_id;
      pool.query(queries.ViewLovingList,[user_id],(err,result)=>{
        return res.status(200).json({status : 1,data : result.rows});
      })
    }

    DeleteLovingList(req,res){
      let user_id = req.user.user_id;
      let destination_id = req.body.destination_id
      pool.query(queries.DeleteLovingList,[user_id,destination_id],(err,result)=>{
           if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({status : 0, error: 'Database error' });
           }
           res.status(200).json({status : 1, message: 'Thành công!' });
      })
  }

    // BrowseTypeBased(req,res){
    //    let type = req.params.type;
    //    pool.query(queries.TypeBrowse,[type],(err,result)=>{
    //        if (err) {
    //          console.error('Query error:', err);     
    //          return res.status(500).json({ error: 'Database error' });
    //        }   
    //        res.status(200).json(result.rows);
    //    })
    // }



    // BrowseLocationBased(req,res){
    //   let location = req.params.location;
    //   let formattedLocation = location.replace(/\s+/g, "");
    //   console.log(formattedLocation); // "Hanoi"
    //   pool.query(queries.LocationBrowse,[formattedLocation],(err,result)=>{
    //       if (err) {
    //         console.error('Query error:', err);     
    //         return res.status(500).json({ error: 'Database error' });
    //       }   
    //       res.status(200).json(result.rows);
    //   })
    // }

    // BrowseFeeBased(req,res){
    //    let fee = req.params.fee;
    //    pool.query(queries.FeeBrowse,[fee - 50000,fee],(err,result)=>{
    //     if (err) {
    //       console.error('Query error:', err);     
    //       return res.status(500).json({ error: 'Database error' });
    //     }   
    //     res.status(200).json(result.rows);
    //    })
    // }

    Browse(req,res){
        let type = req.query.type;
        if(type === 'location'){
          let location = req.query.location
          pool.query(queries.BrowseLocationBased,[location],(err,result)=>{
            if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ status : 0, message: err.message });
            }   
            res.status(200).json({status : 1, data : result.rows});
          })
        }else if(type === 'name'){
           let name = req.query.name
           pool.query(queries.BrowseLocationBased,[name],(err,result)=>{
            if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ status : 0,  message: err.message });
            }   
            res.status(200).json({status : 1, data : result.rows});
          })
        }else if(type === 'fee'){
           let fee = req.query.fee
           pool.query(queries.BrowseLocationBased,[fee],(err,result)=>{
            if (err) {
              console.error('Query error:', err);     
              return res.status(500).json({ status : 0,  message: err.message });
            }   
            res.status(200).json({status : 1, data : result.rows});
          })
        }else{
          let travel_type = req.query.travel_type
          pool.query(queries.BrowseLocationBased,[travel_type],(err,result)=>{
           if (err) {
             console.error('Query error:', err);     
             return res.status(500).json({status : 0,  message: err.message });
           }   
           res.status(200).json({status : 1, data : result.rows});
         })
        }
    }

    async UpdatePassword(req,res){
      let password = req.body.new_password;
      let user_id = req.body.user_id;
      pool.query(queries.updatePassword,[user_id,password],(err,result)=>{
        if (err) {
          console.error('Query error:', err);     
          return res.status(500).json({status : 0,  message: err.message });
        }   
        res.status(200).json({status : 1, data : result.rows[0]});
      }) 
    }

    async updatePasswordBasedEmail(req,res){
      let email = req.body.email;
      let password = req.body.new_password;
      pool.query(queries.updatePasswordBasedEmail,[email,password],(err,result)=>{
        if (err) {
          console.error('Query error:', err);     
          return res.status(500).json({status : 0,  message: err.message });
        }   
        res.status(200).json({status : 1, data : result.rows[0]});
      })
    }

    sendEmail(req,res){
      try{
        const { to, subject, html } = req.body;
        const mailOptions = {
          from: 'trangiakhanht@gmail.com',
          to: to,
          subject: subject,
          html: html
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ status: 0, message: 'Error sending email' });
          }
        });
        res.status(200).json({ status: 1, message: 'Email sent successfully' });
      }catch(error){
        console.error('Error sending email:', error);
        return res.status(500).json({ status: 0, message: 'Error sending email' });
      }
    } 
    
}

module.exports = new OrderController();


