const Boom = require('boom')

const ROLE = {
    ADMIN: 'admin',
    USER: 'user',
    URGER: 'urger',
    CUSTOMER: 'customer'
};

const checkRole = roleList => {
    if(!roleList){
        roleList = Object.values(ROLE);
    }
    if(!Array.isArray(roleList)){
        roleList = [roleList]
    }
    return role => {
        let pass = false;
        pass = roleList.some(item => {
            return item === role
        })
        // debugger
        return pass
    }
}

const Wrapper  = roleList => method => async (ctx,next)=>{
    // debugger;
    let boom;
    let {aeUser,customer} = ctx.state.jwt;
    let role = null;
    if(customer && customer.id && customer.id.length === 36){
        role = ROLE.CUSTOMER;
        debugger;
        let customerId = ctx.params.id || ctx.params.customerId;
        if(customerId && (customer.id !== customerId) ){
            boom =  Boom.forbidden();
        }
    }else if(aeUser && aeUser.id && aeUser.id.length === 36){
        role = aeUser.role
    }
    if(!role){
        boom =  Boom.unauthorized();
    }else if(!checkRole(roleList)(role)){
        boom = Boom.forbidden();
    }

    if(boom && boom.isBoom){
        ctx.status = boom.output.statusCode;
        ctx.body = boom.output.payload;
    }else{
        await method(ctx,next)
    }
}

module.exports = {
    ROLE,
    Wrapper
}
