# angular-MQTT

This project is based on https://github.com/mqttjs/MQTT.js#browser

## USE

```bash
bower install angular-mqtt
```


```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-mqtt/src/browserMqtt.js"></script>
<script src="bower_components/angular-mqtt/src/AngularMQTTClient.js"></script>

```


```javascript
    var app = angular.module('app', [
        'ngMQTT'
    ]);

    app.config(['MQTTProvider',function(MQTTProvider){
        var host  = "ws://OrgId.messaging.internetofthings.ibmcloud.com";
        var port  = "1883";
        var user  = "Your API Key";
        var pass  = "Your API Secret";

        MQTTProvider.setHref(host+":"+port);
        MQTTProvider.setAuth(user+":"+pass);
        MQTTProvider.setClient("a:OrgId:AppId");
    }]);

    app.controller('indexCtrl', ['$scope', 'MQTTService', function ($scope, MQTTService) {
        
        // Subscribing to device events
        MQTTService.on('iot-2/type/device_type/id/device_id/evt/event_id/fmt/format_string', function(data){
            alert(data)
        });
        
        // Publishing device commands
        MQTTService.send('iot-2/type/device_type/id/device_id/cmd/command_id/fmt/format_string','on');
        MQTTService.send('iot-2/type/device_type/id/device_id/cmd/command_id/fmt/format_string','off');
        MQTTService.send('iot-2/type/device_type/id/device_id/cmd/command_id/fmt/format_string','{"status":"on"}');
        
        // Subscribing to device commands
        MQTTService.on('iot-2/type/device_type/id/device_id/evt/event_id/fmt/format_string', function(data){
            alert(data)
        });
        
    }]);

```

---
MQTT server install mothod see: http://blog.csdn.net/qhdcsj/article/details/45042515

Bluemix IoT Platform API connections see: https://console.ng.bluemix.net/docs/services/IoT/applications/mqtt.html
