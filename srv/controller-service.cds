namespace de.linuxdozent;
using de.linuxdozent as my from '../db/controller-schema';

service ControllerService @(requires: 'authenticated-user') {
  entity XSAUsers as projection on my.XSAUsers;
}