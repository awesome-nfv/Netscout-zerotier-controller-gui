#!/usr/bin/env python2

import os
import urllib2
import cgi
import json
import ConfigParser
import io

def json_output(json_obj, callback):
    """ spam spam spam"""
    print "Content-type: application/json"
    print "\n"
    #print json_obj
    print '{0}({1})'.format(callback, json_obj)
    return True

def check_value(error_obj, list_obj, key):
    """ spam spam spam """
    if not list_obj[key]:
        error_obj['flag'] = True
        error_obj['message'] = key + 'not sent'
    return error_obj

def return_token():
    with open("../../config.ini") as f:
        config_file= f.read()
    config = ConfigParser.RawConfigParser(allow_no_value=True)
    config.readfp(io.BytesIO(config_file))
    token = config.get("zerotier", "token")
    return token

def main():
    """ spam spam spam """
    arguments = cgi.FieldStorage()
    callback = arguments.getvalue('callback')
    #error_obj = {'flag': False, 'message': ''}
    url = "http://localhost:9993/controller"
    token = return_token()
    request = urllib2.Request(url, None, headers={"X-ZT1-Auth": token})
    response = urllib2.urlopen(request)
    json_obj = response.read()
    json_output(json_obj, callback)


if __name__ == "__main__":
    main()
