import * as Three from "three";

 function getYawFromQuat(q) {
  var quat = new Three.Quaternion(q.x, q.y, q.z, q.w);
  var yaw = new Three.Euler().setFromQuaternion(quat);
  return yaw["_z"] * (180 / Math.PI);
}
export default getYawFromQuat
