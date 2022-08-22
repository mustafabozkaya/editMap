const Config = {
  ROSBRIDGE_SERVER_IP: "192.168.108.18", // local host for testing
  ROSBRIDGE_SERVER_PORT: "9090", //default port is 9090
  RECONNECTION_TIMER: 5000, // 5 seconds
  CMD_VEL_TOPIC: "/cmd_vel", // topic name
  ODOM_TOPIC: "/odom", // topic for odometry
  POSE_TOPIC: "/amcl_pose", // topic for pose
};

export default Config; // export the Config object to use in other components
