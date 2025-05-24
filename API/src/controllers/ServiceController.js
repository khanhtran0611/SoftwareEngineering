const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const ServiceModel = require('../models/service.model.js')
class ServiceController{
    async UpdateFacility(req,res){
       let facility_infos = req.body;
       if(!Array.isArray(facility_infos)){
            return res.status(400).json({status : 2, message: 'Thiếu facility_infos' });
       }
       try{
          await ServiceModel.UpdateFacility(facility_infos);
          res.json({ message: 'Cập nhật Hotelfacility thành công' })
       }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    async ViewFacility(req,res){
        let result = await pool.query(queries.viewfacility,(err,result)=>{
            if(err){
              res.status(500).json({status : 0, message: err.message });
           }
        });
        return res.status(200).json({status : 1,data : result.rows});
    }

    async UpdateService(req,res){
        let services_infos = req.body;
        console.log(req.body)
        if(!Array.isArray(services_infos)){
            return res.status(400).json({status : 2, message: 'Thiếu services_infos' });
        }
        try{
            await ServiceModel.UpdateService(services_infos);
            res.json({status : 1, message: 'Cập nhật RoomService thành công' })
        }catch(error){
          res.status(500).json({status : 0, message: error.message });
       }
    }

    async ViewService(req,res){
       let result = await pool.query(queries.viewService,(err,result)=>{
           if(err){
              res.status(500).json({status : 0, message: err.message });
           }
       })
       return res.status(200).json({status : 1,data : result.rows});
    }
}

module.exports = new ServiceController();