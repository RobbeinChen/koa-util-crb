const Boom = require('boom')

module.exports = (ctx,error) => {
    let boom;
    // debugger;
    if(error.isJoi){
        boom = Boom.badRequest(error.details[0].message);
    }else if(error.isBoom){
        boom = error;
    }else{
        boom = Boom.boomify(error,{statusCode:500});
        console.error(error.stack);
    }
    ctx.status = boom.output.statusCode;
    ctx.body = boom.output.payload;
}
