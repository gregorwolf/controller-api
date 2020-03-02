module.exports = cds.service.impl (srv => {

  srv.on('READ', 'XSAUsers', async (req) => {
    let response
    try {
      const srv = cds.connect.to('controller-config')
      const tx = srv.transaction(req)
      // try to query the users
      response = await tx.get('/users')
    } catch (error) {
      console.log("error.stack: " + error.stack)
    }
    let users = []
    response.users.forEach(function(item){
      users.push({username: item.userEntity.username})
    })  
    return users;
  })

})