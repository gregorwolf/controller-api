module.exports = cds.service.impl (srv => {

  srv.on('READ', 'XSAUsers', async (req) => {
    let response
    let users = []
    try {
      const srv = cds.connect.to('controller-config')
      const tx = srv.transaction(req)
      // try to query the users
      response = await tx.get('/users')
      response.users.forEach(function(item){
        users.push({username: item.userEntity.username})
      })
    } catch (error) {
      console.log("error.config.baseURL: " + error.config.baseURL)
      console.log("error.stack: " + error.stack)
      req.error(error.response.status, error.response.data)
    }
    return users;
  })

})