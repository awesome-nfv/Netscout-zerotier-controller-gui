var app = {
	'defaultData': {
		'network': {
			"activeMemberCount": 0,
			"authTokens": [],
			"authorizedMemberCount": 0,
			"capabilities": [],
			"clock": 0,
			"creationTime": 0,
			"enableBroadcast": true,
			"id": "",
			"allowPassiveBridging": false,
			"ipAssignmentPools": [{
				'ipRangeEnd': '',
				'ipRangeStart': ''
			}],
			"lastModified": 0,
			"multicastLimit": 32,
			"name": "",
			"nwid": "",
			"objtype": "network",
			"private": true,
			"revision": 0,
			"routes": [],
			"rules": [{
				'type': 'ACTION_ACCEPT'
			}],
			"totalMemberCount": 0,
			"v4AssignMode": {
				"zt": true
			},
			"v6AssignMode": {
				'6plane': false,
				'rfc4193': false,
				'zt': false
			}
		},
		'user': {
			"activeBridge": false,
			"address": "",
			"authHistory": [],
			"authorized": false,
			"capabilities": [],
			"clock": 0,
			"creationTime": 0,
			"id": "",
			"identity": "",
			"ipAssignments": [],
			"lastAuthorizedTime": 0,
			"lastDeauthorizedTime": 0,
			"lastModified": 0,
			"lastRequestMetaData": "",
			"noAutoAssignIps": false,
			"nwid": "",
			"objtype": "member",
			"recentLog": [],
			"revision": 0,
			"tags": []
		}
	}
};

app.newData = {
		'networkData': {
			'valueList': ['id', 'name', 'capabilities', 'objtype', 'enableBroadcast', 'allowPassiveBridging','private', 'multicastLimit'],
			'objList': ['v4AssignMode', 'v6AssignMode', 'authTokens', 'routes', 'ipAssignmentPools', 'rules', 'tags']
		},
		'userData': {}
}

function serverStatus() {
	$.getJSON("cgi-bin/server-status.py?callback=?", function(serverStatusObj) {
		if (serverStatusObj.controller === true) {
			$("#statusRow > td:nth-child(1)").text("On");
			$("#statusRow > td:nth-child(2)").text(serverStatusObj.apiVersion + "v");
			$("#statusRow > td:nth-child(3)").text(Date(serverStatusObj.clock));
		}
	});
}

function networkList() {
	$.getJSON("cgi-bin/network-list.py?callback=?", function(networkListObj) {
		networkListObj.forEach(function(cVal, i, arr) {
			$('#networkList > tbody:nth-child(2)').append('<tr><td>' + (i + 1) + '</td><td>' + cVal + '</td><td><span class="icon"><i class="fa fa-pencil-square-o" aria-hidden="true" id="networkEdit"></i></span><span class="icon"><i class="fa fa-users" aria-hidden="true" id="networkUsers"></i></span><span class="icon"><i class="fa fa-remove" aria-hidden="true" id="networkRemove"></i></span></td></tr>');
		}, this);
		$("i#networkEdit").on("click", function() {
			var networkID = this.parentElement.parentElement.previousSibling.textContent;
			$.getJSON("cgi-bin/network-config-read.py?networkID=" + networkID + "&callback=?", function(networkObj) {
				prefillNetworkPanel(networkObj, networkID);
				displayPanel("Edit Network", "network");
			});
		});
		$("i#networkUsers").on("click", function() {
			var networkID = this.parentElement.parentElement.previousSibling.textContent;
			$.getJSON("cgi-bin/network-user-list.py?networkID=" + networkID + "&callback=?", function(userListObj) {
				for ( var i = $('#userList > div:nth-child(1) > table:nth-child(2) > tbody > tr').length; i > 1; i--){
					$('#userList > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(' + i + ')').remove();
				}
				$('i#userNew').data("networkID", networkID);
				Object.keys(userListObj).forEach(function(cVal, i, arr) {
					$('#userList > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2)').append('<tr><td>' + (i + 1) + '</td><td>' + cVal + '</td><td><span class="icon"><i class="fa fa-pencil-square-o" aria-hidden="true" id="userEdit"></i></span><span class="icon"><i class="fa fa-remove" aria-hidden="true" id="userRemove"></i></span></td></tr>');
				});
				$("i#userEdit").on("click", function() {
					var userID = this.parentElement.parentElement.previousSibling.textContent;
					$.getJSON("cgi-bin/network-user-config-read.py?networkID=" + networkID + "&userID=" + userID + "&callback=?", function(userObj) {
						userObj['networkID'] = networkID;
						prefillUserPanel(userObj);
						displayPanel("Edit User", "user");
					})
				});
				$("i#userRemove").on("click", function() {
					var userID = this.parentElement.parentElement.previousSibling.textContent;
					var networkID = $("i#userNew").data("networkID");
					$.getJSON("cgi-bin/member-delete.py?id=" + networkID + "&address=" + userID + "&callback=?", function() { location.reload() });
				});
				$("#userList").toggle('display');
			});
		});
		$("i#networkRemove").on("click", function() {
			var networkID = this.parentElement.parentElement.previousSibling.textContent;
			$.getJSON("cgi-bin/network-delete.py?id=" + networkID + "&callback=?", function() { location.reload() });
		});
	});
};

function displayPanel(displayText, form) {
	$("article#" + form + "Panel > div.message-header > p").text(displayText);
	$("#" + form + "FormSubmit").text(displayText);
	$("#" + form + "Panel").toggle('display');
};

function dateTimeOption(key, value, form) {
	var dateFlag = false;
	['clock', 'creationTime', 'lastAuthorizedTime', 'lastModified', 'lastDeauthorizedTime', 'creationTime'].forEach(function(e) {
		if (e == key) {
			dateFlag = true;
		};
	});
	document.forms[form][key].value = (dateFlag ? new Date(value) : value);
	return true;
};

function prefillNetworkPanel(networkObj, networkID) {
	document.forms.networkPanelForm.id.value = networkID;
	var keysList = Object.keys(networkObj);
	for (var i = 0; i < keysList.length; i++) {
		if (document.forms.networkPanelForm[keysList[i]] !== null) {
			switch (typeof(networkObj[keysList[i]])) {
			case 'number':
				dateTimeOption(keysList[i], networkObj[keysList[i]], "networkPanelForm");
				break;
			case 'object':
				document.forms.networkPanelForm[keysList[i]].value = JSON.stringify(networkObj[keysList[i]]);
				break;
			default:
				document.forms.networkPanelForm[keysList[i]].value = networkObj[keysList[i]];
				break;
			}
		};
	};
};

function prefillUserPanel(userObj) {
	var keysList = Object.keys(userObj);
	for (var i = 0; i < keysList.length; i++) {
		if (document.forms.userPanelForm[keysList[i]] !== null) {
			switch (typeof(userObj[keysList[i]])) {
			case 'number':
				dateTimeOption(keysList[i], userObj[keysList[i]], "userPanelForm");
				break;
			case 'object':
				document.forms.userPanelForm[keysList[i]].value = JSON.stringify(userObj[keysList[i]]);
				break;
			default:
				document.forms.userPanelForm[keysList[i]].value = userObj[keysList[i]];
				break;
			}
		};
	};
};

function processNetworkForm() { $.post("cgi-bin/network-config-write.py", $('#networkPanelForm').serialize() ) };

function processUserForm() { $.post("cgi-bin/network-user-config-write.py", $('#userPanelForm').serialize() ) };

function getFormData(formName) {
	var data = {};
	for (var i = 0; i < app.newData[formName + 'Data'].valueList.length; i++) {
		data[app.newData[formName + 'Data'].valueList[i]] = document.forms[formName + 'PanelForm'][app.newData[formName + 'Data'].valueList[i]].value;
	}
	for (var i = 0; i < app.newData[formName + 'Data'].objList.length; i++) {
		data[app.newData[formName + 'Data'].objList[i]] = JSON.parse(document.forms[formName + 'PanelForm'][app.newData[formName + 'Data'].objList[i]].value);
	}
	return data;
};

$(document).ready(function() {
	// get the intial server information
	serverStatus();
	networkList();
	$("#networkNew").on("click", function() {
		$.getJSON("cgi-bin/network-new.py?callback=?", function() { location.reload() });
	});
	$("#userNew").on("click", function() {
		document.forms.userPanelForm.networkID.value = $("i#userNew").data("networkID");
		prefillUserPanel(app.defaultData.user);
		displayPanel("New User", "user");
	});
	$("section.section:nth-child(3) > article:nth-child(2) > div:nth-child(1) > button:nth-child(2)").on("click", function() {
		//console.log( "close network panel");
		$("section.section:nth-child(3) > article:nth-child(2)").toggle('display');
	});
	$("section.section:nth-child(4) > article:nth-child(2) > div:nth-child(1) > button:nth-child(2)").on("click", function() {
		//console.log( "close user panel" );
		$("section.section:nth-child(4) > article:nth-child(2)").toggle('display');
	});
});