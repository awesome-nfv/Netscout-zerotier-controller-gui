import json
import requests
token = "zw6mri8j8q9kybizo5ybc846"
#payload = {"ipAssignmentPools":[{"ipRangeStart":"192.168.1.1","ipRangeEnd":"192.168.1.254"}]}
payload = {"something":"nothing"}
headers = {'content-type': 'application/json', 'X-ZT1-Auth': token}
#url = "http://localhost:9993/controller/network/67ab4993c045fa71"
url = "http://localhost:9993/controller/network/67ab4993c045fa71/active"
#response = requests.post(url, data=json.dumps(payload), headers=headers)
response = requests.get(url, data=json.dumps(payload), headers=headers)
print response.text