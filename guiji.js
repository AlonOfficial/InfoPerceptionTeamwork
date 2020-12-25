//返回原始数据
var getData = function (did, begin, end){
    var trace;
    $.ajax({
        type : "GET",
        url : 'https://www.jsciot.com/wm-api/web/rest/v2/positionInfo/listAllRoundTrack?dids=' + did +
            '&orderByType=ASC&pageNo=1&pageSize=1000000&positionModes=1,2,3&processMode=1&showOriginalTrack=0' + '&utcBegin='+begin + '&utcEnd='+end,
        async : false,

        contentType : "application/x-www-form-urlencoded",
        crossDomain : true,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjZiZWZhNzg1LTk3NTktNDRiYi04MTE3LTFjZjc5YjVmOGMyMiJ9.sOakAJn48C9KhuDRig0UYjVWvO1iFXFCHLWOle0g2ZbU-j0GM76qetw5P110_keo53Kbz1zxuL8AxEI4yIC_oA");
        },
        success : function(res, textStatus)
        {
            trace = res;
        }
    });
    return trace;
};
//返回点的实体entities(array)
var getPointEntities = function (data){
    var entities=[];
    var points = data[0].rows;
    for (var i=0; i<points.length; i++){
        var p = points[i];
        let entity = new Cesium.Entity({
            id: p.id.toString(), //id一定要注意，entities里面其他entity的id不能相同。
            name: p.address,
            show:true,
            position:Cesium.Cartesian3.fromDegrees(p.lngGps, p.latGps),
            point:new Cesium.PointGraphics
            ({
                show : true,
                pixelSize :  5,
                color : Cesium.Color.WHITE,
            })

        });
        entities.push(entity);
    }
    return entities;
};
//返回线的czml结构(array)
var getLineCzml = function (data){
    var lineCzml = [{
        id: "document",
        name: "CZML Geometries: Polyline",
        version: "1.0",
    }];
    var points = data[0].rows;
    for(var i=0; i<points.length-1; i++) {
        var p1 = points[i];
        var p2 = points[i + 1];
        var idstr = p1.id.toString() + p2.id.toString();
        var tLine = {
            id: idstr,
            polyline: {
                positions: {
                    cartographicDegrees: [p1.lngGps, p1.latGps, 500000, p2.lngGps, p2.latGps, 500000],
                },
                material: {
                    solidColor: {
                        color: {
                            rgba: [0, 0, 255, 100],
                        },
                    },
                },
                width: 3,
                clampToGround: true,
            }
        };
        lineCzml.push(tLine);
    }
    return lineCzml;
};
//时间与时间戳互换
//戳-时：str.getTime();
//时-戳：var t = new Data("2017-12-08 20:5:30");