const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

class RoomController {
    AddNewRoom(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            const thumbnail = req.body.thumbnail
            const name = req.body.name
            const type = req.body.type
            const location = req.body.location
            const availability = req.body.availability
            const max_guests = req.body.max_guests
            const price_per_night = req.body.price_per_night
            const description = req.body.description


            const values = [
                hotel_id,
                name || null,
                type || null,
                location || null,
                availability || true,
                max_guests || 0,
                price_per_night || 0,
                description || null,
                thumbnail || null
            ];

            return values;
        })
        .then((values) => {
            console.log(values)
            pool.query(queries.addRoom, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({status : 0, message: 'Không thể thêm phòng mới: ' + err.message });
                }
                res.status(201).json({ 
                    status : 1,
                    message: 'Thêm phòng mới thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status : 0, message: 'Đã xảy ra lỗi khi thêm phòng mới' });
        });
    }

    EditRoomInfo(req, res) {
        Promise.resolve('success')
        .then(() => {
            const room_id = req.params.room_id;
            let thumbnail = req.body.thumbnail  
            let name = req.body.name
            let type = req.body.type
            let location = req.body.location
            let availability = req.body.availability
            let max_guests = req.body.max_guests
            let price_per_night = req.body.price_per_night
            let description = req.body.description

            // Kiểm tra room_id
            if (!room_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID phòng' 
                });
            }

            // Kiểm tra có thông tin cập nhật không
            if (!name && !type && !location && !availability && 
                max_guests === undefined && price_per_night === undefined && 
                !description && !thumbnail) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ít nhất một thông tin để cập nhật' 
                });
            }

            // Validate dữ liệu nếu được cung cấp
            if (max_guests !== undefined && (typeof max_guests !== 'number' || max_guests <= 0)) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Số lượng khách tối đa phải là số dương' 
                });
            }

            if (price_per_night !== undefined && (typeof price_per_night !== 'number' || price_per_night <= 0)) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Giá phòng phải là số dương' 
                });
            }

            const values = [
                room_id,
                name || null,
                type || null,
                location || null,
                availability || true,
                max_guests || 0,
                price_per_night || 0,
                description || null,
                thumbnail || null
            ];

            return values;
        })
        .then((values) => {
            pool.query(queries.updateRoom, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({status : 0, message: 'Không thể cập nhật thông tin phòng: ' + err.message });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({status : 0, message: 'Không tìm thấy phòng với ID này' });
                }

                // Lấy thông tin chi tiết phòng sau khi cập nhật
                pool.query(queries.getRoomById, [values[0]], (err, detailResult) => {
                    if (err) {
                        console.error('Query error:', err);
                        return res.status(500).json({status : 0, message: 'Không thể lấy thông tin chi tiết phòng:' + err.message  });
                    }

                    const room = detailResult.rows[0];
                    
                    res.status(200).json({ 
                        status : 1,
                        message: 'Cập nhật thông tin phòng thành công!',
                        data: room
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status : 0, message: 'Đã xảy ra lỗi khi cập nhật thông tin phòng:' + err.message });
        });
    }

    ViewRoomDetail(req,res){
        let room_id = req.params.room_id
        pool.query(queries.ViewRoom,[room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: + err.message });
            }
            return res.status(200).json({status : 1, data : result.rows[0]})
        })
    }

    async ListofRooms(req,res){
        let hotel_id = req.params.hotel_id
        let result = await pool.query(queries.ViewHotelRooms,[hotel_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, data : result.rows})
        })
         
    }

    GetHotelForRoom(req,res){
        let room_id = req.params.room_id
        pool.query(queries.getHotelForRoom,[room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, data : result.rows[0]})
        })
    }

    GetRoomListFromRoomId(req,res){
        let room_id = req.params.room_id
        pool.query(queries.getRoomListFromRoomId,[room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, data : result.rows})
        })
    }   

    RemoveRoom(req,res){
        let room_id = req.params.room_id
        pool.query(queries.removeRoom,[room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Xóa phòng thành công!', data : result.rows[0]})
        })
    }   

    updateRoomStatus(req,res){
        let room_id = req.params.room_id
        let status = req.body.availability
        if(status == true){
            status = 1      
        }else{
            status = 0
        }
        pool.query(queries.updateRoomStatus,[room_id,status],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Cập nhật trạng thái phòng thành công!', data : result.rows[0]})
        })
    }   
}

module.exports = new RoomController();
