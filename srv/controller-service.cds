namespace de.linuxdozent;

service ControllerService @(requires: 'authenticated-user') {
  entity XSAUsers {
    key username:      String;
  };
}