
const pool = require('../config/db/index.js') /*ok*/

class HotelModel {
    static async createHotel(hotelData) {
        const { name, address, rating, longitude, latitude, description, thumbnail } = hotelData;
        
        const query = `
            INSERT INTO Hotel (name, address, rating, longitude, latitude, description, thumbnail)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        try {
            const values = [name, address, rating, longitude, latitude, description, thumbnail];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Không thể tạo khách sạn mới: ' + error.message);
        }
    }

    static async getAllHotels() {
        const query = 'SELECT * FROM Hotel';
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error('Không thể lấy danh sách khách sạn: ' + error.message);
        }
    }
} 