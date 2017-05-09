#!/usr/bin/env python2

import os
import urllib2
import cgi
import json

def jsonOutput( jObj ):	
   print "Content-type: application/json"
   print 
   print(jObj)
   return True

def checkValue(errorObj, listObj, key):
    if not listObj[key]:
       errorObj['flag'] = True
       errorObj['message'] = key + 'not sent'
    return errorObj

def return_token():
    with open("../../config.ini") as f:
        config_file= f.read()
    config = ConfigParser.RawConfigParser(allow_no_value=True)
    config.readfp(io.BytesIO(config_file))
    token = config.get("zerotier", "token")
    return token

def main():
   arguments = cgi.FieldStorage()
   errorObj = { 'flag': False, 'message': ''}
   if arguments['action'] == 'status':
      url = "http://localhost:9993/controller"
   elif arguments['action'] == 'networkList':
      url = "http://localhost:9993/controller/network"

      
   token = return_token()
   request = urllib2.Request( url, None, headers={"X-ZT1-Auth": token})
   response = urllib2.urlopen(request)

   jObj = response.read()
   jsonOutput(jObj)


if __name__ == "__main__":
    main()
