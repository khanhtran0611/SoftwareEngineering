const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const ServiceModel = require('../models/service.model.js')
class ServiceController{

   async getAllFacilities(req,res){
    let result = await pool.query(queries.getAllFacilities,(err,result)=>{
        if(err){
            res.status(500).json({status : 0, message: err.message });
        }
        return res.status(200).json({status : 1,data : result.rows});
    })
   }     
   
   async getAllServices(req,res){
    let result = await pool.query(queries.getAllServices,(err,result)=>{
        if(err){
            res.status(500).json({status : 0, message: err.message });
        }
        return res.status(200).json({status : 1,data : result.rows});
    })
   }    

   async AddFacility(req,res){
    let {facility_id, hotel_id, description} = req.body;
    
    try{
       pool.query(queries.UpdateFacilityForHotel,[facility_id, hotel_id, description],(err,result)=>{
        if(err){
            res.status(500).json({status : 0, message: err.message });
        }
        return res.status(200).json({status : 1, message: 'Thêm dịch vụ thành công' });
       })
    }catch(error){
        res.status(500).json({status : 0, message: error.message });
    }
   }     

    async UpdateFacility(req,res){
       let {facility_id, hotel_id, description} = req.body;
       try{
          pool.query(queries.UpdateFacility,[facility_id, hotel_id, description],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Cập nhật Facility thành công', data : result.rows[0]  });
          })
       }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    async ViewFacility(req,res){
        let {hotel_id} = req.params.hotel_id;
        let result = await pool.query(queries.viewfacility,[hotel_id],(err,result)=>{
            if(err){
              res.status(500).json({status : 0, message: err.message });
           }
           return res.status(200).json({status : 1,data : result.rows});
        });
    }

    async DeleteFacility(req,res){
        const {hotel_id, facility_id} = req.params;
        pool.query(queries.DeleteFacility,[facility_id, hotel_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Xóa Facility thành công', data : result.rows[0]  });
        })
    }

    async AddService(req,res){
        let {service_id, room_id} = req.body;
        console.log(req.body)
        try{
           pool.query(queries.UpdateServiceForRoom,[service_id, room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Thêm dịch vụ thành công' });
           })
        }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    

    async ViewService(req,res){
      let room_id = req.params.room_id;
       let result = await pool.query(queries.viewService,[room_id],(err,result)=>{
           if(err){
              res.status(500).json({status : 0, message: err.message });
           }
           return res.status(200).json({status : 1,data : result.rows});
       })

    }

    async DeleteService(req,res){
        const {room_id, service_id} = req.params;
        pool.query(queries.DeleteService,[service_id, room_id],(err,result)=>{
            if(err){
                res.status(500).json({status : 0, message: err.message });
            }
            return res.status(200).json({status : 1, message: 'Xóa dịch vụ thành công', data : result.rows[0]  });
        })
    } 

}

module.exports = new ServiceController();