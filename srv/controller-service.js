const cds = require('@sap/cds')
const { retrieveJwt } = require('@sap/cloud-sdk-core')

module.exports = cds.service.impl (srv => {
  const controllerAPI = cds.connect.to('controller-config')

  srv.on('READ', 'XSAUsers', async (req) => {
    let response
    let users = []
    try {
      // Read jwt and find a way to use it with the CAP service call
      var jwt = retrieveJwt(req._.req)
      // console.log("JWT: " + jwt)
      req.attr.token = jwt
      const tx = controllerAPI.transaction(req)
      // try to query the users
      response = await tx.get('/v2/users')
      if(response && response.users) {
        response.users.forEach(function(item){
          if(item.userEntity.username) {
            users.push({username: item.userEntity.username})
          }
        })
      }
    } catch (error) {
      console.log("error.stack: " + error.stack)
      req.error(401, "message: " + error.message + " stack: " + error.stack)
    }
    return users;
  })

})