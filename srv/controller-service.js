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
      console.log("JWT: " + jwt)
      req.attr.token = jwt
      const tx = controllerAPI.transaction(req)
      // try to query the users
      response = await tx.get('/v2/users')
      response.users.forEach(function(item){
        users.push({username: item.userEntity.username})
      })
    } catch (error) {
      console.log("error.config.baseURL: " + error.config.baseURL)
      console.log("error.config.url: " + error.config.url)
      console.log("error.stack: " + error.stack)
      req.error(error.response.status, error.response.data)
    }
    return users;
  })

})