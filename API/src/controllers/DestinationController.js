const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')

class DestinationController {
    AddDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            const { 
                name, rating = 0, location, transportation, 
                entry_fee, description, latitude, longitude, 
                thumbnail, images = [] 
            } = req.body;

            // Validate dữ liệu bắt buộc
            if (!name || !location) {
                return res.status(400).json({ 
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc (tên, địa điểm)' 
                });
            }

            // Validate kiểu dữ liệu
            if (rating && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
                return res.status(400).json({ 
                    error: 'Rating phải là số từ 0 đến 5' 
                });
            }

            if (entry_fee && typeof entry_fee !== 'number') {
                return res.status(400).json({ 
                    error: 'Phí vào cửa phải là số' 
                });
            }

            if ((latitude && typeof latitude !== 'number') || 
                (longitude && typeof longitude !== 'number')) {
                return res.status(400).json({ 
                    error: 'Tọa độ phải là số' 
                });
            }

            const values = [
                name, rating, location, transportation || null,
                entry_fee || null, description || null,
                latitude || null, longitude || null,
                thumbnail || null
            ];

            return { values, images };
        })
        .then(({ values, images }) => {
            // Thêm destination mới
            pool.query(queries.addDestination, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        error: 'Không thể thêm điểm đến mới: ' + err.message 
                    });
                }

                const destination = result.rows[0];

                // Nếu có images, thêm vào bảng Image
                if (images.length > 0) {
                    const imagePromises = images.map(image_url => 
                        new Promise((resolve, reject) => {
                            pool.query(
                                queries.addDestinationImage, 
                                [destination.destination_id, image_url],
                                (err, result) => {
                                    if (err) reject(err);
                                    else resolve(result.rows[0]);
                                }
                            );
                        })
                    );

                    Promise.all(imagePromises)
                        .then(imageResults => {
                            destination.images = imageResults.map(img => img.image_url);
                            res.status(201).json({
                                message: 'Thêm điểm đến mới thành công!',
                                data: destination
                            });
                        })
                        .catch(error => {
                            console.error('Error adding images:', error);
                            res.status(201).json({
                                message: 'Thêm điểm đến thành công nhưng không thể thêm một số hình ảnh',
                                data: destination
                            });
                        });
                } else {
                    res.status(201).json({
                        message: 'Thêm điểm đến mới thành công!',
                        data: destination
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                error: 'Đã xảy ra lỗi khi thêm điểm đến mới' 
            });
        });
    }

    UpdateDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            const { 
                name, rating, location, transportation, 
                entry_fee, description, latitude, longitude, 
                thumbnail, type, images 
            } = req.body;

            if (!destination_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID điểm đến' 
                });
            }

            // Validate dữ liệu nếu được cung cấp
            if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
                return res.status(400).json({ 
                    error: 'Rating phải là số từ 0 đến 5' 
                });
            }

            if (entry_fee !== undefined && typeof entry_fee !== 'number') {
                return res.status(400).json({ 
                    error: 'Phí vào cửa phải là số' 
                });
            }

            const values = [
                destination_id,
                name || null,
                rating || null,
                location || null,
                transportation || null,
                entry_fee || null,
                description || null,
                latitude || null,
                longitude || null,
                thumbnail || null,
                type || null
            ];

            return { values, images };
        })
        .then(({ values, images }) => {
            // Cập nhật thông tin destination
            pool.query(queries.updateDestination, values, (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        error: 'Không thể cập nhật điểm đến: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        error: 'Không tìm thấy điểm đến với ID này' 
                    });
                }

                // Nếu có cập nhật images
                if (images && Array.isArray(images)) {
                    // Lấy thông tin chi tiết sau khi cập nhật
                    pool.query(queries.getDestinationDetail, [values[0]], (err, detailResult) => {
                        if (err) {
                            console.error('Query error:', err);
                            return res.status(500).json({ 
                                error: 'Không thể lấy thông tin chi tiết điểm đến' 
                            });
                        }

                        const destination = detailResult.rows[0];
                        
                        // Xử lý danh sách khách sạn gần đó
                        destination.nearby_hotels = destination.nearby_hotels[0] === null ? [] : 
                            destination.nearby_hotels.map(hotel => {
                                const [id, name, rating] = hotel.split(',');
                                return {
                                    hotel_id: parseInt(id),
                                    name,
                                    rating: parseFloat(rating)
                                };
                            });

                        res.status(200).json({
                            message: 'Cập nhật điểm đến thành công!',
                            data: destination
                        });
                    });
                } else {
                    res.status(200).json({
                        message: 'Cập nhật điểm đến thành công!',
                        data: result.rows[0]
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                error: 'Đã xảy ra lỗi khi cập nhật điểm đến' 
            });
        });
    }

    DeleteDestination(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            
            if (!destination_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID điểm đến' 
                });
            }

            pool.query(queries.deleteDestination, [destination_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        error: 'Không thể xóa điểm đến: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        error: 'Không tìm thấy điểm đến với ID này' 
                    });
                }

                res.status(200).json({
                    message: 'Xóa điểm đến thành công!',
                    data: result.rows[0]
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                error: 'Đã xảy ra lỗi khi xóa điểm đến' 
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
                        error: 'Không thể lấy danh sách điểm đến: ' + err.message 
                    });
                }

                res.status(200).json({
                    message: 'Lấy danh sách điểm đến thành công!',
                    data: result.rows
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                error: 'Đã xảy ra lỗi khi lấy danh sách điểm đến' 
            });
        });
    }

    GetDestinationDetail(req, res) {
        Promise.resolve('success')
        .then(() => {
            const destination_id = req.params.destination_id;
            
            if (!destination_id) {
                return res.status(400).json({ 
                    error: 'Vui lòng cung cấp ID điểm đến' 
                });
            }

            pool.query(queries.getDestinationDetail, [destination_id], (err, result) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json({ 
                        error: 'Không thể lấy thông tin điểm đến: ' + err.message 
                    });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ 
                        error: 'Không tìm thấy điểm đến với ID này' 
                    });
                }

                const destination = result.rows[0];

                // Xử lý danh sách khách sạn gần đó
                destination.nearby_hotels = destination.nearby_hotels[0] === null ? [] : 
                    destination.nearby_hotels.map(hotel => {
                        const [id, name, rating] = hotel.split(',');
                        return {
                            hotel_id: parseInt(id),
                            name,
                            rating: parseFloat(rating)
                        };
                    });

                res.status(200).json({
                    message: 'Lấy thông tin điểm đến thành công!',
                    data: destination
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ 
                error: 'Đã xảy ra lỗi khi lấy thông tin điểm đến' 
            });
        });
    }
}

module.exports = new DestinationController(); 