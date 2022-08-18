import React, { useRef, useEffect, useState } from "react";
import * as ROS2D from "ros2d";
import * as ROSLIB from "roslib";
import createjs from "createjs-module";
import goal from "../scripts/goal.png";
import robot from "../scripts/robot.png";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import charging_station from "../scripts/charging_station.png";
import getYawFromQuat from "../scripts/getY";
import { IoIosRefresh } from "react-icons/io";
import { BsZoomIn } from "react-icons/bs";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { GiStoneWall } from "react-icons/gi";
import { BiShapePolygon } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { GiPositionMarker } from "react-icons/gi";
import { AiOutlineSave } from "react-icons/ai";
import { Row, Col, Container } from "react-bootstrap"; // import feature from react bootstrap
const Map = (props) => {
  var gridClient;
  var robot_image;
  var viewer;
  var canvas;
  var context;
  var trace_shape;
  var global_path_image;
  var local_path_image;
  var goal_image;
  var panView;
  var mouseDown = false;
  var zoomKey = false;
  var panKey = false;
  var dbclick = false;
  var clickedPolygon = false;
  var selectedPointIndex = null;
  var charging_station_param = null;
  var cahrging_station_image1 = null;
  var cahrging_station_image2 = null;
  const map = useRef(null);
  const [points, setpoints] = useState(null);
  var startPos = new ROSLIB.Vector3();
  const ros = props.ros;
  var type = null;

  useEffect(() => {
    view_map();
    map.current.style.pointerEvents = "null";
    map.current.children[0].id = "canvas";
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = "#FF";
    // var footprintParam = new ROSLIB.Param({
    //   ros: ros,
    //   name: "/move_base_node/footprint",
    // });
    // footprintParam.get((footprintpoints) => {
    //   footprint = footprintpoints;
    //   // console.log(footprint);
    //   // drawFootprint();
    // });
  }, []);
  // function drawFootprint() {
  //   var x = 10;
  //   var y = 10;
  //   //console.log(footprint);
  //   // console.log(robot_image);
  //   var point1 = { x: 0, y: 0 };
  //   var point2 = { x: 0, y: 0 };
  //   var point3 = { x: 0, y: 0 };
  //   var point4 = { x: 0, y: 0 };

  //   point1.x = x + 1;
  //   point1.y = y + 1;

  //   point2.x = x - 1;
  //   point2.y = y + 1;

  //   point3.x = x - 1;
  //   point3.y = y - 1;

  //   point4.x = x + 1;
  //   point4.y = y - 1;

  //   // footprint[0][1] = y - 1;
  //   // footprint[1][0] = x + 1;
  //   // footprint[1][1] = y + 1;
  //   // footprint[2][0] = x - 1;
  //   // footprint[2][1] = y + 1;
  //   // footprint[3][0] = x - 1;
  //   // footprint[3][1] = y - 1;
  //   //  footprint[0]=robot_image.orientation- 0.213;

  //   var points = [point1, point2, point3, point4];
  //   console.log("points:" + points);

  //   var polygon = new ROS2D.PolygonMarker({
  //     pointSize: 0.000001,
  //     lineSize: 0.06,
  //     // pointColor: pointColor,
  //     lineColor: createjs.Graphics.getRGB(121, 65, 181, 212),
  //   });
  //   viewer.scene.addChild(polygon);
  //   for (let index = 0; index < points.length; index++) {
  //     var obj = { x: points[index].x, y: points[index].y, z: 0 };
  //     // var obj = { x: points[index][0], y: points[index][1], z: 0 };
  //     console.log(obj);
  //     polygon.addPoint(obj);

  //   }
  //   // polygon.addPoint({ x: points[0][0], y: points[0][1] });
  //   // polygon.addPoint({ x: points[1][0], y: points[1][1] });
  //   // polygon.addPoint({ x: points[2][0], y: points[2][1] });
  //   // polygon.addPoint({ x: points[3][0], y: points[3][1] });
  // }
  // function drawfootprint(footprintpolygon) {
  //   var pointColor = null;

  //   for (let i = 0; i < footprintpolygon.length; i++) {
  //     var polygon_iterator = new ROS2D.PolygonMarker({
  //       pointSize: 0.000001,
  //       lineSize: 0.06,
  //       pointColor: pointColor,
  //       lineColor: createjs.Graphics.getRGB(121, 65, 181),
  //     });
  //     viewer.scene.addChild(polygon_iterator);
  //     for (let j = 0; j < footprintpolygon[i].polygon.points.length; j++) {
  //       polygon_iterator.addPoint(footprintpolygon[i].polygon.points[j]);
  //     }
  //   }
  // }
  function charging_stations1() {
    cahrging_station_image1.x = charging_station_param.position.x;
    cahrging_station_image1.y = -charging_station_param.position.y;
    cahrging_station_image1.rotation = (-getYawFromQuat(
      charging_station_param.orientation
    )).toFixed(2);
  }
  function charging_stations2() {
    cahrging_station_image2.x = charging_station_param.position.x;
    cahrging_station_image2.y = -charging_station_param.position.y;
    cahrging_station_image2.rotation = (-getYawFromQuat(
      charging_station_param.orientation
    )).toFixed(2);
  }
  function render_elments() {
    let polygon_zone = [];
    var position = new ROSLIB.Topic({
      ros: ros,
      name: "/robot_pose",
      messageType: "geometry_msgs/Pose",
    });
    position.subscribe((message) => {
      robot_image.x = message.position.x.toFixed(2);
      robot_image.y = -message.position.y.toFixed(2);
      robot_image.rotation = (-getYawFromQuat(message.orientation)).toFixed(2);
      trace_shape.addPose(message);
    });
    var trace_Shape = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base/feedback",
      messageType: "/move_base_msgs/MoveBaseActionFeedback",
    });
    trace_Shape.subscribe(function (message) {
      trace_shape.addPose(message.feedback.base_position.pose);
    });
    var zone = new ROSLIB.Topic({
      ros: ros,
      name: "/zones",
      messageType: "/mir_msgs/Zone",
    });
    zone.subscribe((message) => {
      let logic = false;
      for (let i = 0; i < polygon_zone.length; i++) {
        if (polygon_zone[i].zone_id === message.zone_id) {
          logic = true;
          break;
        }
      }
      if (!logic) {
        polygon_zone.push(message);
        draw_polygons(polygon_zone);
      }
    });
    var ros_station_param1 = new ROSLIB.Param({
      ros: ros,
      name: "/station1",
    });
    ros_station_param1.get((param) => {
      charging_station_param = param;
      charging_stations1();
    });
    var ros_station_param2 = new ROSLIB.Param({
      ros: ros,
      name: "/station2",
    });
    ros_station_param2.get((param) => {
      charging_station_param = param;
      charging_stations2();
    });
    var goal_subscriber = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_simple/goal",
      messageType: "geometry_msgs/PoseStamped",
    });
    var local_path = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_node/DWBLocalPlanner/local_plan",
      messageType: "nav_msgs/Path",
    });
    local_path.subscribe((message) => {
      local_path_image.setPath(message);
    });
    var global_path = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_node/DWBLocalPlanner/global_plan",
      messageType: "nav_msgs/Path",
    });
    global_path.subscribe((message) => {
      global_path_image.setPath(message);
    });
    robot_image = new ROS2D.NavigationImage({
      size: 1.1,
      image: robot,
      pulse: false,
      alpha: 0.9,
    });
    robot_image.x = 10;
    robot_image.y = -10;
    global_path_image = new ROS2D.PathShape({
      strokeSize: 0.03,
      strokeColor: createjs.Graphics.getRGB(0, 0, 0),
    });
    goal_image = new ROS2D.NavigationImage({
      size: 0.8,
      image: goal,
      alpha: 1,
      pulse: false,
    });
    trace_shape = new ROS2D.TraceShape({
      strokeSize: 0.3,
      maxPoses: 20,
      minDist: 0.03,
      strokeColor: createjs.Graphics.getRGB(255, 0, 0, 0.6),
    });
    local_path_image = new ROS2D.PathShape({
      strokeSize: 0.3,
      strokeColor: createjs.Graphics.getRGB(0, 0, 250, 0.6),
    });
    cahrging_station_image1 = new ROS2D.NavigationImage({
      size: 1.4,
      image: charging_station,
      alpha: 1,
      pulse: false,
    });
    cahrging_station_image2 = new ROS2D.NavigationImage({
      size: 1.4,
      image: charging_station,
      alpha: 1,
      pulse: false,
    });
    cahrging_station_image1.x = -200;
    cahrging_station_image1.y = -200;
    cahrging_station_image2.x = -200;
    cahrging_station_image2.y = -200;
    goal_image.x = -200;
    goal_image.y = -200;
    viewer.scene.addChild(cahrging_station_image1);
    viewer.scene.addChild(cahrging_station_image2);
    viewer.scene.addChild(global_path_image);
    viewer.scene.addChild(local_path_image);
    viewer.scene.addChild(trace_shape);

    goal_subscriber.subscribe((message) => {
      var yaw = getYawFromQuat(message.pose.orientation);
      goal_image.x = message.pose.position.x;
      goal_image.y = -message.pose.position.y;
      goal_image.rotation = yaw;
    });

    viewer.scene.addChild(goal_image);
    viewer.scene.addChild(robot_image);
  }
  function view_map() {
    if (map.current.innerHTML !== "") return;
    viewer = new ROS2D.Viewer({
      divID: "map",
      width: 700,
      height: 600,
    });
    gridClient = new ROS2D.OccupancyGridClient({
      ros: ros,
      rootObject: viewer.scene,
      continuous: true,
    });
    panView = new ROS2D.PanView({
      rootObject: viewer.scene,
    });

    gridClient.on("change", () => {
      viewer.scaleToDimensions(
        gridClient.currentGrid.width,
        gridClient.currentGrid.height,
        viewer.scaleToDimensions(
          gridClient.currentGrid.width,
          gridClient.currentGrid.height
        )
      );

      try {
        viewer.shift(
          gridClient.currentGrid.pose.position.x,
          gridClient.currentGrid.pose.position.y
        );
      } catch (error) {
        return;
      }
    });
    render_elments();
  }
  function Zomming() {
    resetMap();
    var startPos = new ROSLIB.Vector3();
    var zoomView = new ROS2D.ZoomView({
      rootObject: viewer.scene,
    });
    function mousedown(event) {
      zoomKey = true;
      zoomView.startZoom(event.stageX, event.stageY);
      startPos.x = event.stageX;
      startPos.y = event.stageY;
      mouseDown = true;
    }
    viewer.scene.addEventListener("stagemousedown", mousedown);

    function mouseup(event) {
      if (mouseDown === true) {
        if (zoomKey === true) {
          var dy = event.stageY - startPos.y;
          var zoom = 1 + (10 * Math.abs(dy)) / viewer.scene.canvas.clientHeight;
          if (dy < 0) zoom = 1 / zoom;
          zoomView.zoom(zoom);
        }
      }
    }
    viewer.scene.addEventListener("stagemousemove", mouseup);

    function mousemove() {
      if (mouseDown === true) {
        if (zoomKey === true) {
          zoomKey = false;
          mouseDown = false;
        }
      }
    }
    viewer.scene.addEventListener("stagemouseup", mousemove);
  }
  function panning() {
    resetMap();
    function mousedown(event) {
      panKey = true;
      panView.startPan(event.stageX, event.stageY);

      startPos.x = event.stageX;
      startPos.y = event.stageY;
      // mouseDown = true;
    }
    viewer.scene.addEventListener("stagemousedown", mousedown);
    function mousemove(event) {
      if (panKey === true) {
        panView.pan(event.stageX, event.stageY);
      } else {
        // var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        // navGoal.orientGoalSelection(pos);
      }
    }
    viewer.scene.addEventListener("stagemousemove", mousemove);
    function mouseup(event) {
      if (panKey === true) {
        panKey = false;
      } else {
        // var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        // var goalPose = navGoal.endGoalSelection(pos);
        // navGoal.sendGoal(goalPose);
      }
      // mouseDown = false;
    }
    viewer.scene.addEventListener("stagemouseup", mouseup);
  }
  function resetMap() {
    setpoints(null);
    map.current.innerHTML = "";
    view_map();
  }
  function send_goal() {
    resetMap();

    viewer.scene.addEventListener("click", function (event) {
      var pose = viewer.scene.globalToRos(event.stageX, event.stageY);
      var goal_pub = new ROSLIB.Topic({
        ros: ros,
        name: "/move_base_simple/goal",
        messageType: "geometry_msgs/PoseStamped",
      });

      var goal = new ROSLIB.Message({
        header: {
          frame_id: "map",
        },
        pose: {
          position: {
            x: pose.x,
            y: pose.y,
            z: 0,
          },
          orientation: {
            x: 0,
            y: 0,
            z: 0,
            w: 1,
          },
        },
      });
      goal_pub.publish(goal);
    });
  }
  function draw_polygons(polygon_zone) {
    for (let i = 0; i < polygon_zone.length; i++) {
      var pointColor = null;
      var x = polygon_zone[i].zone_type;
      switch (x) {
        case 1:
          pointColor = createjs.Graphics.getRGB(205, 155, 190, 0.1); // BLUE
          break;
        case 2:
          pointColor = createjs.Graphics.getRGB(174, 223, 249, 0.1); // pink
          break;
        default: // BLACK
          pointColor = createjs.Graphics.getRGB(0, 0, 0, 0.1);
          break;
      }
      var polygon_iterator = new ROS2D.PolygonMarker({
        pointSize: 0.000001,
        lineSize: 0.06,
        pointColor: pointColor,
        lineColor: createjs.Graphics.getRGB(121, 65, 181),
      });
      viewer.scene.addChild(polygon_iterator);
      for (let j = 0; j < polygon_zone[i].polygon.points.length; j++) {
        polygon_iterator.addPoint(polygon_zone[i].polygon.points[j]);
      }
    }
  }
  function add_polygon() {
    resetMap();
    var pointCallBack = function (type, event, index) {
      if (type === "mousedown") {
        if (event.nativeEvent.shiftKey === true) {
          polygon.remPoint(index);
          setpoints(polygon.pointContainer);
        } else {
          selectedPointIndex = index;
        }
      }
    };
    var polygon = new ROS2D.PolygonMarker({
      pointSize: 0.2,
      lineSize: 0.1,
      pointColor: createjs.Graphics.getRGB(120, 194, 173, 0.1),
      lineColor: createjs.Graphics.getRGB(120, 194, 173, 0.1),
      pointCallBack: pointCallBack,
    });
    viewer.scene.mouseMoveOutside = false;
    function mouseup(event) {
      if (selectedPointIndex !== null) {
        selectedPointIndex = null;
      } else if (viewer.scene.mouseInBounds === true) {
        var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        polygon.addPoint(pos);
        if (polygon.pointContainer.children.length === 1) {
          polygon.addPoint(pos);
        }
        setpoints(polygon.pointContainer);
      }
    }
    viewer.scene.addEventListener("stagemouseup", mouseup);
    function mousemove(event) {
      if (dbclick === true) return;
      if (selectedPointIndex !== null) {
        var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        polygon.movePoint(selectedPointIndex, pos);
        setpoints(polygon.pointContainer);
      }
    }
    viewer.scene.addChild(polygon);
    viewer.scene.addEventListener("stagemousemove", mousemove);
  }
  function add_virtual_wall() {
    resetMap();
    var pointCallBack = function (
      type,
      event,
      index // create a point to draw polygon
    ) {
      if (type === "mousedown") {
        if (event.nativeEvent.shiftKey === true) {
          polygon.remPoint(index);
        } else {
          selectedPointIndex = index;
        }
      }
      // to start draw a polygon
      clickedPolygon = true;
    };
    var polygon = new ROS2D.PolygonMarker({
      pointSize: 0.2,
      lineSize: 0.1,
      pointColor: createjs.Graphics.getRGB(144, 144, 144, 0.3),
      lineColor: createjs.Graphics.getRGB(226, 202, 248),
      pointCallBack: pointCallBack,
    });

    // viewer.scene.mouseMoveOutside = false;
    function mouseup(event) {
      if (selectedPointIndex !== null) {
        selectedPointIndex = null;
      } else if (viewer.scene.mouseInBounds === true) {
        var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        if (polygon.pointContainer.children.length < 2) {
          polygon.addPoint(pos);
          setpoints(polygon.pointContainer);
        }
      }
      clickedPolygon = false;
    }
    viewer.scene.addEventListener("stagemouseup", mouseup);
    function mousemove(event) {
      if (dbclick === true) return;
      // Move point when it's dragged
      if (selectedPointIndex !== null) {
        var pos = viewer.scene.globalToRos(event.stageX, event.stageY);
        polygon.movePoint(selectedPointIndex, pos);
        setpoints(polygon.pointContainer);
        clickedPolygon = true;
      }
    }
    viewer.scene.addChild(polygon);
    viewer.scene.addEventListener("stagemousemove", mousemove);
  }
  function save_virtual_wall(type) {
    console.log(points);

    if (points === null) return;
    var save_wall_to_file = new ROSLIB.Topic({
      ros: ros,
      name: "/create_new_zone",
      messageType: "/mir_msgs/NewZone",
    });

    var message = new ROSLIB.Message({
      point_count: points.children.length,
      type: 1,
      points: [],
    });

    for (let i = 0; i < points.children.length; i++) {
      message.points.push({
        x: points.children[i].x,
        y: -points.children[i].y,
        z: 0,
      });
    }
    save_wall_to_file.publish(message);

    // var srv = new ROSLIB.Service({
    //   ros: ros,
    //   name: "/virtualmap",
    //   serviceType: " virtualmap/Virtualmap",
    // });

    // var request = new ROSLIB.ServiceRequest({
    // point1:{x:points.children[1].x,y:points.children[1].y,z:0},
    // point2:{x:points.children[2].x,y:points.children[2].y,z:0},
    // });
    // srv.callService(request, function(result) {
    //   console.log('Result for service call on ');
    // });
  }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div ref={map} id="map"></div>
          </Col>
          <Col>
            <Row>
              <ToggleButtonGroup
                // type="radio"
                name="options"
                size="lg"
                id="togglegroup"
              >
                <ToggleButton
                  id="tbg-radio-1"
                  value={1}
                  title="Pan"
                  onClick={panning}
                >
                  <FaExpandArrowsAlt></FaExpandArrowsAlt>
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-2"
                  value={2}
                  title="Zoom"
                  onClick={Zomming}
                >
                  <BsZoomIn></BsZoomIn>
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-3"
                  value={3}
                  title="Add Zone"
                  onClick={add_polygon}
                >
                  <BiShapePolygon></BiShapePolygon>
                </ToggleButton>
                <ToggleButton id="tbg-radio-4" value={4} title="Delete">
                  <RiDeleteBinLine></RiDeleteBinLine>
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-5"
                  value={5}
                  title="Add Virtual Wall"
                  onClick={add_virtual_wall}
                >
                  <GiStoneWall></GiStoneWall>
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-6"
                  value={6}
                  title="Send Goal"
                  onClick={send_goal}
                >
                  <GiPositionMarker></GiPositionMarker>
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-7"
                  value={7}
                  title="Reset Map"
                  onClick={resetMap}
                >
                  <IoIosRefresh></IoIosRefresh>
                </ToggleButton>
              </ToggleButtonGroup>
            </Row>
            <br />
            <Row>
              <ToggleButtonGroup name="options" size="lg" id="togglegroup">
                <ToggleButton
                  id="tbg-radio-8"
                  value={8}
                  title="Save Virtual Wall"
                  onClick={() => save_virtual_wall(1)}
                >
                  <AiOutlineSave></AiOutlineSave>
                  <GiStoneWall></GiStoneWall>
                </ToggleButton>
                <ToggleButton
                  id="save2"
                  title="Save Zone"
                  value={9}
                  onClick={() => save_virtual_wall(2)}
                >
                  <AiOutlineSave></AiOutlineSave>
                  <BiShapePolygon></BiShapePolygon>
                </ToggleButton>
              </ToggleButtonGroup>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Map;
