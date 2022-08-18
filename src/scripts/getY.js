import * as Three from "three"; // three is used to get the yaw from the quaternion

const getYawFromQuaternion = (quaternion) => {
  const q = new Three.Quaternion(); // quaternion is a vector of length 4
  q.copy(quaternion); // copy the quaternion into q
  const yaw = new Three.Euler().setFromQuaternion(q, "YXZ"); // set the yaw from q
  alert("yaw: " + yaw);
  return yaw.y; // return the yaw
};

const getYawFromQuater = (q) => {
  var quat = new Three.Quaternion(q.x, q.y, q.z, q.w);
  var yaw = new Three.Euler().setFromQuaternion(quat);
  alert("yaw: " + yaw);
  return yaw["_z"] * (180 / Math.PI);
};

export default getYawFromQuater;