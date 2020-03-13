namespace de.linuxdozent;

service ControllerService @(requires: 'authenticated-user') {
  
  @cds.persistence.skip
  entity XSAUsers {
    key username:      String;
  };
}