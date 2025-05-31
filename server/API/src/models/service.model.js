const pool = require('../config/db/index.js') /*ok*/
const queries = require('../config/db/queries.js')

class ServiceModel{
     static async UpdateFacility(facility_infos){
         const client = await pool.connect();
         try{
            await client.query('BEGIN');
            await client.query("DELETE FROM hotelfacilities");
            for(const {facility_id,name} of facility_infos){
                await client.query(queries.insertFacility,[facility_id,name]);
            }
            await client.query('COMMIT');
            return {success : true};
         }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật hotelfacilities: ' + err.message);
          } finally {
            client.release();
          }
     }

     static async UpdateService(service_infos){
          const client = await pool.connect();
          try{
                await client.query('BEGIN');
                await client.query("DELETE FROM roomservice");
                for(const {service_id,name} of service_infos){
                    await client.query(queries.insertService,[service_id,name]);
                }
                await client.query('COMMIT');
                return {success : true};
          }catch(err){
            await client.query('ROLLBACK');
            throw new Error('Không thể cập nhật roomservice: ' + err.message);
          } finally {
            client.release();
          }
     }
}

module.exports = ServiceModel;