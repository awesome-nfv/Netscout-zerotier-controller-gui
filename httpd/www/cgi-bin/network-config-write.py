#!/usr/bin/env python2

import requests
import cgi
import json

def json_output(json_obj, callback):
    """ spam spam spam"""
    print "Content-type: application/json"
    print "\n"
    print json_obj
    return True

def check_value(error_obj, list_obj, key):
    """ spam spam spam """
    if not list_obj[key]:
        error_obj['flag'] = True
        error_obj['message'] = key + 'not sent'
    return error_obj

def main():
    """ spam spam spam """
    arguments = cgi.FieldStorage()
    callback = arguments.getvalue('callback')
    post_data = {}
    name_list = ['id', 'name', 'capabilities', 'objtype', 'enableBroadcast', 'allowPassiveBridging','private', 'multicastLimit']
    for name in name_list:
        post_data[name] = arguments.getvalue(name)
    name_list = ['v4AssignMode', 'v6AssignMode', 'authTokens', 'routes', 'ipAssignmentPools', 'rules', 'tags']
    for name in name_list:
        post_data[name] = json.loads(arguments.getvalue(name))
    url = "http://localhost:9993/controller/network/" + post_data['id']
    token = "zw6mri8j8q9kybizo5ybc846"
    response = requests.post(url, json=post_data, headers={"X-ZT1-Auth": token})
    json_output(response, callback)

if __name__ == "__main__":
    main()
