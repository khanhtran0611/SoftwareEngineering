const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const HotelModel = require('../models/hotel.model.js');
class AddHotelController {
    calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Find nearby hotels within a certain distance
    async findNearbyHotels(hotel_id,hotel_latidue,hotel_longitude) {
    maxDistance = 30;
    
    let infos = await pool.query(queries.getDestinationLocation);
    destination_ids = []
    for({destination_id,latiude,longitude} of infos){
            if(calculateDistance(latitude,longitude,hotel_latidue,hotel_longitude) < maxDistance){
                valid_des.push(destination_ids)
            }
    }
    try {
            await HotelModel.updateHotelArround(hotel_id, destination_ids);
            return res.json({status : 1, message: 'Cập nhật HotelArround thành công' });
        } catch (error) {
            return res.status(500).json({status : 0, message: error.message });
    }
}

    async getRole(user_id){
       let result = await pool.query(queries.RoleExtract,[user_id]);
       return result.rows[0];
    }

    AddNewHotel(req, res) {
        Promise.resolve('success')
        .then(() => {
            let user_id = req.user.user_id
            const { name, address, rating, longitude, latitude, description,contact_phone } = req.body;
            thumbnail = req.file.originalname

            if(this.getRole(user_id) != 'hotel owner'){
                return res.status(400).json({ 
                    status : 2,
                    error: 'Only hotel owner can add a hotel' 
                });
            }

            // Validate dữ liệu đầu vào
            if (!name || !address || !rating || !longitude || !latitude || !description) {
                return res.status(400).json({ 
                    status : 2,
                    error: 'Vui lòng điền đầy đủ thông tin khách sạn' 
                });
            }

            // Validate kiểu dữ liệu
            if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                return res.status(400).json({ 
                    status : 2,
                    error: 'Rating phải là số từ 0 đến 5' 
                });
            }

            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
                return res.status(400).json({ 
                    status : 2,
                    error: 'Longitude và latitude phải là số' 
                });
            }

            const values = [name, address, rating, longitude, latitude, description, thumbnail,contact_phone,user_id];
            return values;
        })
        .then((values) => {
            rating = 0;
            pool.query(queries.createHotel, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể thêm khách sạn: ' + err.message });
                }
                findNearbyHotels(hotel_id,values[4],values[3]);
                res.status(201).json({ 
                    status : 1,
                    message: 'Thêm khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status : 0, message: error.message });
        });
    }

    
    RemoveHotel(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            if (!hotel_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID khách sạn' 
                });
            }
            return hotel_id;
        })
        .then((hotel_id) => {
            pool.query(queries.removeHotel, [hotel_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({status : 0, error: 'Không thể xóa khách sạn: ' + err.message });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({status : 0, error: 'Không tìm thấy khách sạn với ID này' });
                }
                res.status(200).json({ 
                    status : 1,
                    message: 'Xóa khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status : 0, error: 'Đã xảy ra lỗi khi xóa khách sạn' });
        });
    }

    ViewHotelDetail(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            if (!hotel_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID khách sạn' 
                });
            }
            return hotel_id;
        })
        .then((hotel_id) => {
            pool.query(queries.getHotelDetail, [hotel_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({status : 0, message: 'Không thể lấy thông tin khách sạn: ' + err.message });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({status : 0, message: 'Không tìm thấy khách sạn với ID này' });
                }

                // Xử lý dữ liệu trả về
                const hotel = result.rows[0];
                
                // Chuyển đổi chuỗi rooms thành mảng đối tượng
                hotel.rooms = hotel.rooms[0] === null ? [] : hotel.rooms.map(room => {
                    const [room_id, name, type, thumbnail, price] = room.split(',');
                    return {
                        room_id: parseInt(room_id),
                        name,
                        type,
                        thumbnail,
                        price_per_night: price
                    };
                });

                // Chuyển đổi chuỗi facilities thành mảng đối tượng
                hotel.facilities = hotel.facilities[0] === null ? [] : hotel.facilities.map(facility => {
                    const [facility_id, name, description] = facility.split(',');
                    return {
                        facility_id: parseInt(facility_id),
                        name,
                        description
                    };
                });

                res.status(200).json({
                    status : 1, 
                    message: 'Lấy thông tin khách sạn thành công!',
                    data: hotel
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status : 0, message: error.message });
        });
    }

    EditHotelInfo(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            const { name, address, rating, longitude, latitude, description, contact_phone } = req.body;
            thumbnail = req.file

            // Kiểm tra xem có hotel_id không
            if (!hotel_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID khách sạn' 
                });
            }

            // Kiểm tra xem có thông tin nào được cung cấp để cập nhật không
            if (!name && !address && !rating && !longitude && !latitude && !description && !thumbnail && !contact_phone) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ít nhất một thông tin để cập nhật' 
                });
            }

            // Validate dữ liệu nếu được cung cấp
            if (rating !== undefined) {
                if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                    return res.status(400).json({ 
                        status : 2,
                        message: 'Rating phải là số từ 0 đến 5' 
                    });
                }
            }

            if (longitude !== undefined && typeof longitude !== 'number') {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Longitude phải là số' 
                });
            }

            if (latitude !== undefined && typeof latitude !== 'number') {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Latitude phải là số' 
                });
            }

            const values = [
                hotel_id,
                name || null,
                address || null,
                rating || null,
                longitude || null,
                latitude || null,
                description || null,
                thumbnail || null,
                contact_phone || null
            ];

            return values;
        })
        .then((values) => {
            pool.query(queries.updateHotel, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể cập nhật thông tin khách sạn: ' + err.message });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID này' });
                }

                res.status(200).json({
                    status: 1, 
                    message: 'Cập nhật thông tin khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({status: 1,  message: error.message });
        });
    }
}

module.exports = new AddHotelController(); 