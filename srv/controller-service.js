const cds = require('@sap/cds')
const axios = require('axios');
const { executeHttpRequest, HttpMethod, addDestinationToRequestConfig } = require('@sap/cloud-sdk-core')

module.exports = cds.service.impl (srv => {
  const controllerAPI = cds.connect.to('controller-config')

  srv.on('READ', 'XSAUsers', async (req) => {
    let response
    let users = []
    try {
      var responseUsers = [] 
      /*
      // It seems that CAP does not yet support using the JWT for it's requests
      //
      // Read jwt and find a way to use it with the CAP service call
      console.log("JWT: " + req.attr.token)
      const tx = controllerAPI.transaction(req)
      // try to query the users
      response = await tx.get('/v2/users')
      if(response && response.users) {
        responseUsers = response.users
      }
      */
      /*
      // Also Cloud SDK Request doesn't send JWT
      //
      const destinationNameAndJwt = { destinationName: 'controller-config', jwt: req.attr.token};
      const httpRequest = {
          method: HttpMethod.GET,
          url: "/v2/users"
      };
      response = await executeHttpRequest(destinationNameAndJwt, httpRequest)
      if(response && response.data && response.data.users) {
        responseUsers = response.data.users
      }
      */

     const destinationNameAndJwt = { destinationName: 'controller-config', jwt: req.attr.token};
     const httpRequest = {
        method: HttpMethod.GET,
        url: "/v2/users"
      };

      var config = await addDestinationToRequestConfig(destinationNameAndJwt, httpRequest)
      // Providing the destinationNameAndJwt does not have the effect to send the token so we add it manually
      config.headers = {"Authorization": "Bearer " + req.attr.token}
      response = await axios(config)
      if(response && response.data && response.data.users) {
        responseUsers = response.data.users
      }

      if(responseUsers) {
        responseUsers.forEach(function(item){
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