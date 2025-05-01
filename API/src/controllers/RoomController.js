const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

class RoomController {
    AddNewRoom(req, res) {
        Promise.resolve('success')
        .then(() => {
            const hotel_id = req.params.hotel_id;
            const { 
                name, 
                type, 
                location, 
                availability = 'Available', // Giá trị mặc định
                max_guests, 
                price_per_night, 
                description,
                thumbnail 
            } = req.body;

            // Validate dữ liệu bắt buộc
            if (!hotel_id || !name || !type || !max_guests || !price_per_night) {
                return res.status(400).json({ 
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc của phòng' 
                });
            }

            // Validate kiểu dữ liệu
            if (typeof max_guests !== 'number' || max_guests <= 0) {
                return res.status(400).json({ 
                    error: 'Số lượng khách tối đa phải là số dương' 
                });
            }

            if (typeof price_per_night !== 'number' || price_per_night <= 0) {
                return res.status(400).json({ 
                    error: 'Giá phòng phải là số dương' 
                });
            }

            const values = [
                hotel_id,
                name,
                type,
                location || null,
                availability,
                max_guests,
                price_per_night,
                description || null,
                thumbnail || null
            ];

            return values;
        })
        .then((values) => {
            pool.query(queries.addRoom, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể thêm phòng mới: ' + err.message });
                }
                res.status(201).json({ 
                    message: 'Thêm phòng mới thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm phòng mới' });
        });
    }

    EditRoomInfo(req, res) {
        Promise.resolve('success')
        .then(() => {
            const room_id = req.params.room_id;
            const { 
                name, 
                type, 
                location, 
                availability, 
                max_guests, 
                price_per_night, 
                description,
                thumbnail 
            } = req.body;

            // Kiểm tra room_id
            if (!room_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID phòng' 
                });
            }

            // Kiểm tra có thông tin cập nhật không
            if (!name && !type && !location && !availability && 
                max_guests === undefined && price_per_night === undefined && 
                !description && !thumbnail) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ít nhất một thông tin để cập nhật' 
                });
            }

            // Validate dữ liệu nếu được cung cấp
            if (max_guests !== undefined && (typeof max_guests !== 'number' || max_guests <= 0)) {
                return res.status(400).json({ 
                    error: 'Số lượng khách tối đa phải là số dương' 
                });
            }

            if (price_per_night !== undefined && (typeof price_per_night !== 'number' || price_per_night <= 0)) {
                return res.status(400).json({ 
                    error: 'Giá phòng phải là số dương' 
                });
            }

            const values = [
                room_id,
                name || null,
                type || null,
                location || null,
                availability || null,
                max_guests || null,
                price_per_night || null,
                description || null,
                thumbnail || null
            ];

            return values;
        })
        .then((values) => {
            pool.query(queries.updateRoom, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ error: 'Không thể cập nhật thông tin phòng: ' + err.message });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy phòng với ID này' });
                }

                // Lấy thông tin chi tiết phòng sau khi cập nhật
                pool.query(queries.getRoomById, [values[0]], (err, detailResult) => {
                    if (err) {
                        console.error('Query error:', err);
                        return res.status(500).json({ error: 'Không thể lấy thông tin chi tiết phòng' });
                    }

                    const room = detailResult.rows[0];
                    
                    // Xử lý danh sách dịch vụ
                    room.services = room.services[0] === null ? [] : room.services.map(service => {
                        const [service_id, name, description] = service.split(',');
                        return {
                            service_id: parseInt(service_id),
                            name,
                            description
                        };
                    });

                    res.status(200).json({ 
                        message: 'Cập nhật thông tin phòng thành công!',
                        data: room
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin phòng' });
        });
    }
}

module.exports = new RoomController();
