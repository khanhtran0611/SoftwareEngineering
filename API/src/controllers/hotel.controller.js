const pool = require('../config/db/index.js');
const queries = require('../config/db/queries.js');
const HotelModel = require('../models/hotel.model.js');

class HotelController {
    async createHotel(req, res) {
        try {
            const { name, address, rating, longitude, latitude, description, thumbnail } = req.body;

            // Validate dữ liệu
            if (!name || !address || !rating || !longitude || !latitude || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin khách sạn'
                });
            }

            const result = await pool.query(queries.createHotel, 
                [name, address, rating, longitude, latitude, description, thumbnail]
            );
            
            return res.status(201).json({
                success: true,
                message: 'Tạo khách sạn mới thành công',
                data: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Không thể tạo khách sạn mới: ' + error.message
            });
        }
    }

    async getAllHotels(req, res) {
        try {
            const result = await pool.query(queries.getAllHotels);
            
            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách khách sạn thành công',
                data: result.rows
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách khách sạn: ' + error.message
            });
        }
    }
    async updateHotelArround(req, res) {
        const { hotel_id, destination_ids } = req.body;
        if (!hotel_id || !Array.isArray(destination_ids)) {
            return res.status(400).json({ message: 'Thiếu hotel_id hoặc destination_ids' });
        }
        try {
            await HotelModel.updateHotelArround(hotel_id, destination_ids);
            res.json({ message: 'Cập nhật HotelArround thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new HotelController(); 