import rclpy
import socketio

from rclpy.node import Node
from ssafy_msgs.msg import TurtlebotStatus,EnviromentStatus
from geometry_msgs.msg import Twist,Point
from std_msgs.msg import Float32, String, Int8MultiArray
from math import pi,cos,sin,sqrt,atan2

# Int8MultiArray = [map_create, map_create_turtle_bot, map_save] 
# lidar로 맵 스캔, 터틀봇 자동으로 움직이기, 만들어진 map 저장

info = {
    "robot" : {
        "pos" : [],
        "velocity" : 0,
        "battery" : 100,
        "mode" : 0
    },
    "environment" : {
        "month" : 30,
        "day" : 0,
        "hour" : 9,
        "minute" : 0,
        "temperature" : 10,
        "weather" : "Cloudy"
    }
}

# global 변수 설정, msg로 publish 하여 다른 node에서 조건에 맞게 실행하기 위함
global map_create, map_create_turtle_bot
map_create = False
map_create_turtle_bot = False

# socket 
sio = socketio.Client()

@sio.event
def connect():
    print('connection ROS')        
    
@sio.event
def disconnect():
    print('disconnected ROS from server')
    
@sio.event
def connect_error(data):
    print("connect_error!", data)

@sio.on("run_mapping")
def run_mapping(data):            
    print("run_mapping", data)

    global map_create, map_create_turtle_bot 

    # mapping을 시작한다.
    map_create = not map_create
    map_create_turtle_bot = not map_create_turtle_bot


# def get_map_create():
#     return [map_create, map_create_turtle_bot]
    
# ip_server = 'http://localhost:3001'
ip_server = 'https://j8b310.p.ssafy.io/socket'


print("connect ", ip_server)
sio.connect(ip_server)


class SocketClass(Node):

    def __init__(self):
        super().__init__('socket_info') 

        # 맵 만들 때 필요한 변수를 저장하는 주소 publish
        self.create_map_publisher = self.create_publisher(Int8MultiArray, '/create_map', 10)
        self.envir_sub = self.create_subscription(EnviromentStatus, '/envir_status', self.env_callback, 1000)
    

        self.timer_period = 1
        self.timer = self.create_timer(self.timer_period, self.timer_callback)

        # self.m_control_interval = 10
        # self.m_control_iter = 0
       

    # Front 신호 받아 온 값을 터틀 봇 내 msg로 저장

    # 시뮬레이터 환경 변수 전달.
    def env_callback(self, msg):
        print("env", msg)
        info["environment"]["month"] = msg.month
        info["environment"]["day"] = msg.day
        info["environment"]["hour"] = msg.hour
        info["environment"]["minute"] = msg.minute
        info["environment"]["weather"] = msg.weather
        info["environment"]["temperature"] = msg.temperature


    # socket 정보를 저장하거나 다른 곳에 쓸 수 있게 callback
    def timer_callback(self):

        # run_mapping을 하기위해 만든 함수. msg를 publish해서 run_mapping, wall_tracking을 할 수 있게 한다.
        msg = Int8MultiArray()
        msg.data = [map_create, map_create_turtle_bot]
        print("MapOperationList", msg)
        self.create_map_publisher.publish(msg)
        
        # envir_status 정보를 socket 통신을 통해 프론트에 전달.
        sio.emit("simulator_info", info)


        

def main(args=None):
        
    rclpy.init(args=args)    
    

    socket_info = SocketClass()
    rclpy.spin(socket_info)   
    socket_info.destory_node() 
    rclpy.shutdown()


if __name__ == '__main__':
    main()