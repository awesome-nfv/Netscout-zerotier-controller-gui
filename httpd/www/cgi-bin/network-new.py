#!/usr/bin/env python2

import requests, json, cgi

def json_output(json_obj, callback):
    """ spam spam spam"""
    print "Content-type: application/json"
    print "\n"
    #print json_obj
    print '{0}({1})'.format(callback, json_obj)
    return True

token = "zw6mri8j8q9kybizo5ybc846"
payload = {'some':'data'}
headers = {'content-type': 'application/json', 'X-ZT1-Auth': token}

arguments = cgi.FieldStorage()
callback = arguments.getvalue('callback')

url = "http://localhost:9993/controller/network/67ab4993c0______"
response = requests.post(url, data=json.dumps(payload), headers=headers)

json_obj = response.text
json_output(json_obj, callback)