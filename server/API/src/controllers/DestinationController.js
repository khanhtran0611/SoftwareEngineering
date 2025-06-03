const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const DesModel = require('../models/des.model.js')
class DestinationController {
    AddDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            // const { 
            //     name, rating = 0, location, transportation, 
            //     entry_fee, description, latitude, longitude,type,
            //      images = [] 
            // } = req.body;
            const thumbnail = req.body.thumbnail
            const name = req.body.name
            const rating = req.body.rating
            const location = req.body.location
            const transportation = req.body.transportation
            const entry_fee = req.body.entry_fee
            const description = req.body.description
            const latitude = req.body.latitude
            const longitude = req.body.longitude
            const type = req.body.type
            const images = req.body.images
            // Validate dữ liệu bắt buộc
            if (!name || !location) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc (tên, địa điểm)' 
                });
            }

            // Validate kiểu dữ liệu
            if (rating && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Rating phải là số từ 0 đến 5' 
                });
            }

            if (entry_fee && typeof entry_fee !== 'number') {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Phí vào cửa phải là số' 
                });
            }

            if ((latitude && typeof latitude !== 'number') || 
                (longitude && typeof longitude !== 'number')) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Tọa độ phải là số' 
                });
            }

            const values = [
                name, rating, location, transportation || null,
                entry_fee || 0, description || null,
                latitude || null, longitude || null,type || null,
                thumbnail || null
            ];
            console.log(entry_fee)
            return { values, images };
        })
        .then(({ values, images }) => {
            // Thêm destination mớ
            
            pool.query(queries.addDestination, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        message: 'Không thể thêm điểm đến mới: ' + err.message 
                    });
                }
                const destination = result.rows[0];

                // Nếu có images, thêm vào bảng Image
                {
                    res.status(201).json({
                        status : 1,
                        message: 'Thêm điểm đến mới thành công!',
                        data: destination
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                message: 'Đã xảy ra lỗi khi thêm điểm đến mới: ' + error.message
            });
        });
    }

    UpdateDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            // const { 
            //     name, rating, location, transportation, 
            //     entry_fee, description, latitude, longitude, 
            //     type, images 
            // } = req.body;
            const name = req.body.name
            const rating = req.body.rating
            const location = req.body.location
            const transportation = req.body.transportation
            const entry_fee = req.body.entry_fee
            const description = req.body.description
            const latitude = req.body.latitude
            const longitude = req.body.longitude
            const thumbnail = req.body.thumbnail
            const type = req.body.type
            const images = req.body.images
            // if (!destination_id) {
            //     return res.status(400).json({ 
            //         status : 2,
            //         message: 'Vui lòng cung cấp ID điểm đến' 
            //     });
            // }

            // // Validate dữ liệu nếu được cung cấp
            // if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
            //     return res.status(400).json({ 
            //         status : 2,
            //         message: 'Rating phải là số từ 0 đến 5' 
            //     });
            // }

            // if (entry_fee !== undefined && typeof entry_fee !== 'number') {
            //     return res.status(400).json({ 
            //         status : 2,
            //         message: 'Phí vào cửa phải là số' 
            //     });
            // }
            console.log(req.body)
            const values = [
                destination_id || 0,
                name || null,
                rating || 0,
                location || null,
                transportation || null,
                entry_fee || 0,
                description || null,
                latitude || 0,
                longitude || 0,
                thumbnail || null,
                type || null
            ]
            console.log(values)
            return values;
        })
        .then((values) => {
            // Cập nhật thông tin destination
            pool.query(queries.updateDestination, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        message: 'Không thể cập nhật điểm đến: ' + err.message 
                    });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        status : 2,
                        message: 'Không tìm thấy điểm đến với ID này' 
                    });
                }
                console.log(result.rows)
                // Nếu có cập nhật images
               {
                    res.status(200).json({
                        status : 1,
                        message: 'Cập nhật điểm đến thành công!',
                        data: result.rows[0]
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                message: 'Đã xảy ra lỗi khi cập nhật điểm đến' 
            });
        });
    }

    DeleteDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            
            if (!destination_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID điểm đến' 
                });
            }

            pool.query(queries.deleteDestination, [destination_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        message: 'Không thể xóa điểm đến: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        status : 0,
                        message: 'Không tìm thấy điểm đến với ID này' 
                    });
                }

                res.status(200).json({
                    status : 1,
                    message: 'Xóa điểm đến thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                message: 'Đã xảy ra lỗi khi xóa điểm đến' 
            });
        });
    }

    GetAllDestinations(req, res) {
        Promise.resolve('success')
        .then(() => {
            pool.query(queries.getAllDestinations, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        message: 'Không thể lấy danh sách điểm đến: ' + err.message 
                    });
                }

                res.status(200).json({
                    status : 1,
                    message: 'Lấy danh sách điểm đến thành công!',
                    data: result.rows
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                message: 'Đã xảy ra lỗi khi lấy danh sách điểm đến' 
            });
        });
    }

    GetDestinationDetail(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            
            if (!destination_id) {
                return res.status(400).json({ 
                    status : 2,
                    message: 'Vui lòng cung cấp ID điểm đến' 
                });
            }
            

            pool.query(queries.getDestinationDetail, [destination_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        status : 0,
                        message: 'Không thể lấy thông tin điểm đến: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        status : 0,
                        message: 'Không tìm thấy điểm đến với ID này' 
                    });
                }

                const destination = result.rows[0];
                console.log(result.rows)
                // Xử lý danh sách khách sạn gần đó
                // destination.nearby_hotels = destination.nearby_hotels[0] === null ? [] : 
                //     destination.nearby_hotels.map(hotel => {
                //         const [id, name, rating] = hotel.split(',');
                //         return {
                //             hotel_id: parseInt(id),
                //             name,
                //             rating: parseFloat(rating)
                //         };
                //     });
                
                res.status(200).json({
                    status : 1,
                    message: 'Lấy thông tin điểm đến thành công!',
                    data: destination
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                status : 0,
                message: 'Đã xảy ra lỗi khi lấy thông tin điểm đến' 
            });
        });
    }

    GetDestinationImage(req,res){
        let destination_id = req.params.destination_id
        pool.query(queries.getDestinationImages,[destination_id],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0, message : err.message})
            }
            return res.status(200).json({status : 1, data : result.rows})
        })
    }

    async DeleteOldImages(req,res){
        let images = req.files;
        let destination_id = req.body.destination_id
        console.log(req.files)
        
        if(!Array.isArray(infos)){
            return res.status(400).json({status : 2, message: 'Thiếu ảnh !!' });
        }
        try{
            await DesModel.DeleteoldImages(images,destination_id);
            res.json({status : 1, message: 'Xóa ảnh cũ thành công' })
        }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    async UpdateDestinationImage(req,res){
        let images = req.files;
        let destination_id = req.body.destination_id
        console.log(req.files)
        
        if(!Array.isArray(infos)){
            return res.status(400).json({status : 2, message: 'Thiếu ảnh !!' });
        }
        try{
            await DesModel.UpdateDestinationImage(images,destination_id);
            res.json({status : 1, message: 'Cập nhật Images thành công' })
        }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    async FilterDestination(req,res){
        let name = req.query.name
        let minPrice = req.query.minPrice
        let maxPrice = req.query.maxPrice
        let location = req.query.location
        console.log(name)
        console.log(minPrice)
        console.log(maxPrice)
        console.log(location)
        pool.query(queries.Browse,[name,minPrice,maxPrice,location],(err,result)=>{
            console.log(result.rows)
            if(err){
                return res.status(500).json({status : 0, message : err.message})
            }

            return res.status(200).json({status : 1, data : result.rows})
        })
    }
 

    async AddDestinationImage(req,res){
        let images_url = req.body.image_url;
        let destination_id = req.body.destination_id
        console.log(req.body)
        pool.query(queries.addDestinationImage,[destination_id,images_url],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0, message : err.message})
            }
            return res.status(200).json({status : 1, data : result.rows[0]})
        })
        
    }   

    async DeleteDestinationImage(req,res){
        let images_id= req.params.images_id
        console.log(images_id)
        await pool.query(queries.removeDestinationImage,[images_id],(err,result)=>{
            if(err){
                console.log(err)
                return res.status(500).json({status : 0, message : err.message})
            }
            console.log(result.rows)
            return res.status(200).json({status : 1, data : result.rows[0]})
        })
    }

    async UpdateDestinationImage(req,res){
        let images_id = req.params.images_id
        let images_url = req.body.images_url
        console.log(req.body)
        pool.query(queries.updateDestinationImage,[images_id,images_url],(err,result)=>{
            if(err){
                return res.status(500).json({status : 0, message : err.message})
            }
            return res.status(200).json({status : 1, data : result.rows[0]})
        })
    }

    async GetRecommendedDestinations(req, res) {
          try {
             const { user_id } = req.session.user_id;
    
             // Validate user_id
             if (!user_id) {
                   return res.status(400).json({
                      status: 0,
                      message: "Missing user_id in request body",
                   });
             }
    
             // Call Flask API to get recommended destinations
             const response = await axios.post("http://localhost:5002/destination/recommend", {
                   user_id,
             });
    
             const recommendedDestinationIds = response.data; // Array of destination IDs
    
             // Fetch detailed information for each recommended destination
             const destinations = await Promise.all(
                   recommendedDestinationIds.map(async (destination_id) => {
                      const result = await pool.query(queries.getDestinationDetail, [destination_id]);
                      return result.rows[0];
                   })
             );
    
             return res.status(200).json({
                   status: 1,
                   message: "Recommended destinations fetched successfully",
                   data: destinations,
             });
          } catch (error) {
             console.error("Error recommending destinations:", error);
             return res.status(500).json({
                   status: 0,
                   message: "Failed to fetch recommended destinations: " + error.message,
             });
          }
       }
}

module.exports = new DestinationController(); 