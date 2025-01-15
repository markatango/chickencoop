var LogMessage = require("mongoose").model('LogMessage');

module.exports = function(){
    
    return {
        getNext: async function (req, res){
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 50;
        
            try {
                const documents = await LogMessage.find().sort({created:-1}).skip(offset).limit(limit);
                res.json(documents);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error');
            }
        }
    }
}


    