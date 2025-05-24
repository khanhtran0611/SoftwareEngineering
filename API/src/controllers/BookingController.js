const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

class BookingController {

   ViewPendingBooking(req,res){
       pool.query(queries.ViewPendingBooking,(err,result)=>{
           if(err){
               return res.status(500).json({
                        status : 0, 
                        message: err.message 
                    });
           }
           res.status(200).json(result.rows)
       })
   }

   ViewCancelBooking(req,res){
       pool.query(queries.ViewCancelBooking,(err,result)=>{
           if(err){
               return res.status(500).json({
                        status : 0, 
                        message: err.message 
                    });
           }
           res.status(200).json(result.rows)
       })
   }


    AcceptBooking(req, res) {
        Promise.resolve('success')
        .then(() => {
            const booking_id = req.params.booking_id;
            
            if (!booking_id) {
                return res.status(400).json({ 
                    status : 0,
                    error: 'Vui lòng cung cấp ID của booking' 
                });
            }

            // Cập nhật trạng thái booking
            pool.query(queries.acceptBooking, [booking_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({
                        status : 0, 
                        error: 'Không thể chấp nhận booking: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        status : 0,
                        error: 'Không tìm thấy booking này hoặc booking không ở trạng thái chờ duyệt' 
                    });
                }

                // Lấy thông tin chi tiết booking sau khi cập nhật
                pool.query(queries.getBookingDetail, [booking_id], (err, detailResult) => {
                    if (err) {
                        console.error('Query error:', err);
                        return res.status(500).json({ 
                            status : 0,
                            error: 'Không thể lấy thông tin chi tiết booking' 
                        });
                    }

                    res.status(200).json({
                        status : 1,
                        message: 'Đã chấp nhận booking thành công!',
                        data: detailResult.rows[0]
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                error: 'Đã xảy ra lỗi khi xử lý yêu cầu' 
            });
        });
    }

    RejectBooking(req, res) {
        Promise.resolve('success')
        .then(() => {
            const booking_id = req.params.booking_id;
            
            if (!booking_id) {
                return res.status(400).json({ 
                    status : 0,
                    error: 'Vui lòng cung cấp ID của booking' 
                });
            }

            // Cập nhật trạng thái booking
            pool.query(queries.rejectBooking, [booking_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        error: 'Không thể từ chối booking: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        status : 0,
                        error: 'Không tìm thấy booking này hoặc booking không ở trạng thái chờ duyệt' 
                    });
                }

                // Lấy thông tin chi tiết booking sau khi cập nhật
                pool.query(queries.getBookingDetail, [booking_id], (err, detailResult) => {
                    if (err) {
                        console.error('Query error:', err);
                        return res.status(500).json({ 
                            status : 0,
                            error: 'Không thể lấy thông tin chi tiết booking' 
                        });
                    }

                    res.status(200).json({
                        status : 1,
                        message: 'Đã từ chối booking thành công!',
                        data: detailResult.rows[0]
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                error: 'Đã xảy ra lỗi khi xử lý yêu cầu' 
            });
        });
    }
}

module.exports = new BookingController(); 