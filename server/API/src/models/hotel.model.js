
const pool = require('../config/db/index.js') /*ok*/
const queries = require('../config/db/queries.js')

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

    static async updateHotelArround(hotel_id, destination_ids) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM HotelArround WHERE hotel_id = $1', [hotel_id]);
            for (const destination_id of destination_ids) {
                await client.query(
                    'INSERT INTO HotelArround (hotel_id, destination_id) VALUES ($1, $2)',
                    [hotel_id, destination_id]
                );
            }
            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật HotelArround: ' + error.message);
        } finally {
            client.release();
        }
    }

    static async updateHotelFacilities(facility_infos,hotel_id){
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            await client.query("DELETE FROM FacilitiesPossessing WHERE hotel_id = $1",[hotel_id]);
            for (const {facility_id,description} of facility_infos){
                await client.query(queries.UpdateFacilityForHotel,[facility_id,hotel_id,description]);
            }
            await client.query('COMMIT');
            return {success : true};
        }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật FacilitiesPossessing: ' + err.message);
        } finally {
            client.release();
        }
    }

    static async updateRoomService(service_ids,room_id){
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            await client.query("DELETE FROM ServicePossessing where room_id = $1",[room_id]);
            for (const service_id of service_ids){
                await client.query(queries.UpdateServiceForRoom,[service_id,room_id]);
            }
            await client.query('COMMIT');
            return {success : true};
        }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật ServicePossessing: ' + err.message);
        } finally {
            client.release();
        }
    }


} 
module.exports = HotelModel;