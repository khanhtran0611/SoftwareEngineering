const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

class AddHotelController {
    AddNewHotel(req, res) {
        Promise.resolve('success')
        .then(() => {
            const { name, address, rating, longitude, latitude, description, thumbnail } = req.body;
            
            // Validate dữ liệu đầu vào
            if (!name || !address || !rating || !longitude || !latitude || !description) {
                return res.status(400).json({ 
                    error: 'Vui lòng điền đầy đủ thông tin khách sạn' 
                });
            }

            // Validate kiểu dữ liệu
            if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                return res.status(400).json({ 
                    error: 'Rating phải là số từ 0 đến 5' 
                });
            }

            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
                return res.status(400).json({ 
                    error: 'Longitude và latitude phải là số' 
                });
            }

            const values = [name, address, rating, longitude, latitude, description, thumbnail];
            return values;
        })
        .then((values) => {
            pool.query(queries.createHotel, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể thêm khách sạn: ' + err.message });
                }
                res.status(201).json({ 
                    message: 'Thêm khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm khách sạn' });
        });
    }

    RemoveHotel(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            if (!hotel_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID khách sạn' 
                });
            }
            return hotel_id;
        })
        .then((hotel_id) => {
            pool.query(queries.removeHotel, [hotel_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể xóa khách sạn: ' + err.message });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID này' });
                }
                res.status(200).json({ 
                    message: 'Xóa khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khách sạn' });
        });
    }

    ViewHotelDetail(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            if (!hotel_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID khách sạn' 
                });
            }
            return hotel_id;
        })
        .then((hotel_id) => {
            pool.query(queries.getHotelDetail, [hotel_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể lấy thông tin khách sạn: ' + err.message });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID này' });
                }

                // Xử lý dữ liệu trả về
                const hotel = result.rows[0];
                
                // Chuyển đổi chuỗi rooms thành mảng đối tượng
                hotel.rooms = hotel.rooms[0] === null ? [] : hotel.rooms.map(room => {
                    const [room_id, name, type, price, thumbnail] = room.split(',');
                    return {
                        room_id: parseInt(room_id),
                        name,
                        type,
                        price_per_night: parseFloat(price),
                        thumbnail
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
                    message: 'Lấy thông tin khách sạn thành công!',
                    data: hotel
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin khách sạn' });
        });
    }

    EditHotelInfo(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            const { name, address, rating, longitude, latitude, description, thumbnail } = req.body;

            // Kiểm tra xem có hotel_id không
            if (!hotel_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID khách sạn' 
                });
            }

            // Kiểm tra xem có thông tin nào được cung cấp để cập nhật không
            if (!name && !address && !rating && !longitude && !latitude && !description && !thumbnail) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ít nhất một thông tin để cập nhật' 
                });
            }

            // Validate dữ liệu nếu được cung cấp
            if (rating !== undefined) {
                if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                    return res.status(400).json({ 
                        error: 'Rating phải là số từ 0 đến 5' 
                    });
                }
            }

            if (longitude !== undefined && typeof longitude !== 'number') {
                return res.status(400).json({ 
                    error: 'Longitude phải là số' 
                });
            }

            if (latitude !== undefined && typeof latitude !== 'number') {
                return res.status(400).json({ 
                    error: 'Latitude phải là số' 
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
                thumbnail || null
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
                    message: 'Cập nhật thông tin khách sạn thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin khách sạn' });
        });
    }
}

module.exports = new AddHotelController(); 