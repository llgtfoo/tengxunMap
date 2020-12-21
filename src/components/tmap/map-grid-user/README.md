# tq-grid-user(网格员组件)

## Props(组件参数)

### host

> gis后端服务主机，例如`59.202.51.218`

### port

> gis后端服务端口号

### appKey

> 云平台颁发的gis数据服务标识

### mapInstance

> 当前地图实例


### onGetUserList: `Promise<Array>`

> 获取网格员列表

#### 回调方法参数会传入以下字段

|    参数           |    说明                                           | 
|:--------- |: --------------------------------------------------------|
| userName: String  | 用户名                                             |
| isLine: String    | 是否在线，查全部：all，查在线：online，查离线：offline  |
| offset: Number    | 当前页                                             |
| limit: Number     | 每页条数                                           |


#### 回调方法返回结果应包含以下字段

|   参数             |   说明                        |
|: ---------------- |: ---------------------------- |
| userName: String  | 用户名                         |
| userLabel: String | 列表中显示的用户名称             |
| userPhone: String | 用户手机号                      |
| isLine: Boolean   | 是否在线，在线:true，离线:false  |
| address: String   | 地址                           |
| deviceId: String  | 设备ID                         |
| originTime: Date  | 最后在线时间                    |
| centerLon: String | 经度，WGS84坐标系               |
| centerLat: String | 维度，WGS84坐标系               |


### onGetTaskList: `Promise<Array>`

> 获取任务(轨迹)列表

#### 回调方法参数会传入以下字段

|    参数           |    说明        | 
|:---------------- |: --------------|
| userName: String | 用户名          |
| startTime: Date  | 开始时间        |
| endTime: Date    | 结束时间        |
| offset: Number   | 当前页          |
| limit: Number    | 每页条数        |

#### 回调方法返回结果应包含以下字段

|   参数             |   说明       |
|: ---------------- |: ----------- |
| startTime: Date   | 开始时间      |
| endTime: Date     | 结束时间      |
| distance: Number  | 距离          |


### onGetTrackDetail: `Promise<Array>`

> 查询轨迹详细信息，即组成轨迹的经纬度，用于在地图上绘制轨迹

#### 回调方法参数说明

组件内部会将`onGetTaskList`方法返回的列表中点击的项作为参数传入该方法中；

#### 回调方法返回结果应包含以下字段

|   参数             |   说明           |
|: ---------------- |: --------------- |
| centerLon: String | 经度，WGS84坐标系  |
| centerLat: String | 维度，WGS84坐标系  |
| originTime: Date  | 采集该点位时的时间  |


## Event(组件派发的事件)

| 事件名             |  说明                             | 事件参数  |
|: ---------------- |: -------------------------------- |: ------- |
| click-user-detail | 点击网格员弹框中"详情"按钮所派发的事件 | User     |
| close             | 网格员面板关闭事件                   |   -      |

## Method(方法)

| 方法名     |  说明                         | 参数                 | 返回值          |
|: -------- |: --------------------------- |: ------------------- |: ------------- |
| update    | 手动刷新组件状态                |  -                  |  -             |
