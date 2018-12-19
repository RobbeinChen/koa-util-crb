const Boom = require('boom')

module.exports  = cidInParams => method => async (ctx,next)=>{
    let customerId = cidInParams || 'customerId';
    let {aeUser,customer} = ctx.state.jwt;
    let boom;
    if(!aeUser && !customer){
        boom =  Boom.unauthorized();
    }else if(aeUser){
        if(!aeUser.id || aeUser.id.length !== 36){
            boom =  Boom.unauthorized();
        }
    }else if(customer){
        if(!customer.id || customer.id.length !== 36){
            boom =  Boom.unauthorized();
        }
        if(customer.id && customer.id !== ctx.params[customerId]){
            boom =  Boom.forbidden();
        }
    }

    if(boom && boom.isBoom){
        ctx.status = boom.output.statusCode;
        ctx.body = boom.output.payload;
    }else{
        await method(ctx,next)
    }
}
