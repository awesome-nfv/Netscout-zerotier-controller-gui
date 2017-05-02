#!/usr/bin/env python2

import cgi, json, os, requests

base_url = 'http://locaalhost:9993'

def format_output(obj):
    return_string = ''
    return_data = {}

    if obj['type'] == 'server':
        return_string = base_url + "/controller"
    if obj['type'] == 'network':
        return_string = base_url + "/controller/network"
        if obj['action'] == 'add':
            return_string += controller_id + "______"
            return_data = {'private': True}
        if (obj['action'] == 'edit' or obj['action'] == 'delete'):
            return_string += obj['networkID']
            return_data = define_data(obj)
    if obj['type'] == 'user':
        return_string = base_url + "/controller/network/" + obj['networkID']
        if obj['action'] == 'list':
            return_string += "/member"
        if obj['action'] == 'active':
            return_string += "/active"
        if (obj['action'] == 'add' or obj['action'] == 'edit' or obj['action'] == 'delete'):
            return_string += "/member/" + obj['userID']
            return_data = define_data(obj)            
        return_obj = {"url": return_string, "data": return_data}
        return return_obj

def define_data(obj):
    ''' spam spam spam '''
    return obj

def json_output(json_obj, callback):
    """ spam spam spam"""
    print "Content-type: application/json"
    print "\n"
    print '{0}({1})'.format(callback, json_obj)
    return True

def main():
    """ spam spam spam """
    exec(compile(open('myconfig.py').read()))
    arguments = cgi.FieldStorage()
    output_object = format_output(arguments)
    #
    #
    callback = arguments['callback']
    json_output(json_obj, callback)

if __name__ == "__main__":
    main()