const pool = require('../config/db/index.js');
const queries = require('../config/db/queries.js');
const HotelModel = require('../models/hotel.model.js');
const axios = require('axios');

class HotelController {
    async createHotel(req, res) {
        try {
            
            const { name, address, rating, longitude, latitude, description, thumbnail } = req.body;

            // Validate dữ liệu
            if (!name || !address || !rating || !longitude || !latitude || !description) {
                return res.status(400).json({
                    status : 0,
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin khách sạn'
                });
            }

            const result = await pool.query(queries.createHotel, 
                [name, address, rating, longitude, latitude, description, thumbnail]
            );
            
            return res.status(201).json({
                status : 1,
                success: true,
                message: 'Tạo khách sạn mới thành công',
                data: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                status : 0,
                success: false,
                message: 'Không thể tạo khách sạn mới: ' + error.message
            });
        }
    }

    async getAllHotels(req, res) {
        try {
            let user_id = req.params.user_id
            console.log(user_id)
            const result = await pool.query(queries.getAllHotels,[user_id]);
            
            return res.status(200).json({
                status : 1,
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
            return res.status(400).json({status : 0, message: 'Thiếu hotel_id hoặc destination_ids' });
        }
        try {
            await HotelModel.updateHotelArround(hotel_id, destination_ids);
            return res.json({ status : 1, message: 'Cập nhật HotelArround thành công' });
        } catch (error) {
            return res.status(500).json({status : 0, message: error.message });
        }
    }

    async updateHotelFacilities(req,res){
        const {facility_infos,hotel_id} = req.body;
        if(!hotel_id || !Array.isArray(facility_infos)){
            return res.status(400).json({status : 0, message: 'Thiếu hotel_id hoặc facility_infos' });
        }
        try {
            await HotelModel.updateHotelFacilities(facility_infos,hotel_id);
            return res.json({status : 1, message: 'Cập nhật FacilitiesPossessing thành công' })
        } catch (error) {
            return res.status(500).json({status : 0, message: error.message });
        }
    }

    async updateRoomService(req,res){
        const {service_ids,hotel_id} = req.body;
        console.log({service_ids,hotel_id})
        if(!hotel_id){
            return res.status(400).json({status : 0, message: 'Thiếu room_id hoặc service_ids' });
        }
        try {
            await HotelModel.updateRoomService(service_ids,hotel_id);
            return res.json({status : 1, message: 'Cập nhật ServicePossessing thành công' })
        } catch (error) {
            return res.status(500).json({status : 0, message: error.message });
        }
    }

    async getHotelFacilities(req,res){
        let hotel_id = req.params.hotel_id;
        pool.query(queries.getHotelFacilities,[hotel_id],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0,message : err.message})
            }
            for(let i = 0; i < result.rows.length; i++){
                const {facility_id,name,description} = result.rows[i]
                result.rows[i] = {
                    facility : {facility_id,name},
                    description : description
                }
                console.log(result.rows[i])
            }
            return res.status(200).json({status : 1,data : result.rows})
        })
    }

    async getRoomServices(req,res){
         let room_id = req.params.room_id;
        pool.query(queries.getRoomServices,[room_id],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0,message : err.message})
            }
            return res.status(200).json({status : 1,data : result.rows})
        })
    }

    async getNearbyDestination(req,res){
        let hotel_id = req.params.hotel_id;
        pool.query(queries.getNearbyDestination,[hotel_id],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0,message : err.message})
            }
            return res.status(200).json({status : 1,data : result.rows})
        })
    }
    
    async processNearbyHotel(req, res) {
        try {
            const { user_id, hotels } = req.body;
            if (!user_id || !Array.isArray(hotels)) {
                return res.status(400).json({ status: 0, message: 'Thiếu user_id hoặc hotels' });
            }
            // Lấy danh sách hotel_id từ mảng hotels
            const hotelIds = hotels.map(h => h.hotel_id);

            // Gọi Flask API
            const response = await axios.post('http://localhost:5001/recommend', {
                user_id,
                hotels: hotelIds
            });

            let recommendations = response.data; // [[hotel_id, estimatedRating], ...]
            recommendations.sort((a, b) => b[1] - a[1]);
            const hotelMap = {};
            hotels.forEach(hotel => {
                hotelMap[hotel.hotel_id] = hotel;
            });
            const sortedHotels = recommendations
                .map(([hotel_id]) => hotelMap[hotel_id])
                .filter(hotel => hotel);
            return res.status(200).json({ status: 1, data: sortedHotels });
        } catch (error) {
            return res.status(500).json({ status: 0, message: error.message });
        }
    }


}
                                   
module.exports = new HotelController();