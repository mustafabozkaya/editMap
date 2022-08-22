import * as Three from "three"; // three is used to get the yaw from the quaternion

const getYawFromQuaternion = (quaternion) => {
  const q = new Three.Quaternion(); // quaternion is a vector of length 4
  q.copy(quaternion); // copy the quaternion into q
  const euler = new Three.Euler().setFromQuaternion(q, "YXZ"); // set the euler from the quaternion, returns an euler object (x,y,z,order), order is the order of the rotation (YXZ),ya

  return euler.y;
};

const getYawFromQuater = (q) => {
  var quat = new Three.Quaternion(q.x, q.y, q.z, q.w); // quaternion is a vector of length 4 (x,y,z,w)
  var euler = new Three.Euler().setFromQuaternion(quat); // set from quaternion to euler (yaw, pitch, roll),returns an euler object (x,y,z,order)
  // console.log("yaw: " + yaw);
  // write the all items in the yaw to the console

  // console.log("order: " + euler.order);
  // console.log("pitch: " + euler["y"]);
  // console.log("roll: " + euler["x"]);
  // console.log("yaw: " + euler["z"]);
  // console.log("eular yaw is: " + euler["z"]);

  return euler["z"] * (180 / Math.PI);
};

export default getYawFromQuater;
