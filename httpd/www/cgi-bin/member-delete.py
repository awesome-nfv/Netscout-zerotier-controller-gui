#!/usr/bin/env python2

import requests
import json
import cgi
import cgitb
cgitb.enable()

def json_output(json_obj, callback):
    """ spam spam spam"""
    print "Content-type: application/json"
    print "\n"
    #print json_obj
    print '{0}(["{1}"])'.format(callback, json_obj)
    #return True

token = "zw6mri8j8q9kybizo5ybc846"
payload = {'some':'data'}

arguments = cgi.FieldStorage()
callback = arguments.getvalue('callback')
network_id = arguments.getvalue('id')
member_id = arguments.getvalue('address')

headers = {'content-type': 'application/json', 'X-ZT1-Auth': token}
url = "http://localhost:9993/controller/network/" + network_id + "/member/" + member_id
response = requests.delete(url, data=json.dumps(payload), headers=headers)

json_obj = {"network_id": network_id, "member_id": member_id}
json_output(response, callback)