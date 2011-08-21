var moveForward = false,
    moveBackwards = false,
    moveLeft = false,
    moveRight = false,
    yawLeft = false,
    yawRight = false,
    moveUp/*pitchUp*/ = false,
    moveDown/*pitchDown*/ = false,
    rollLeft = false,
    rollRight = false,
    isShiftDown = false,
    isCtrlDown = false;

var move_scale = 10;

var degrees_to_radians = 180 / Math.PI;
var camera_rotation = 0.5;

function onDocumentKeyDown(event) {

    switch (event.keyCode) {

        case 38:
            moveForward = true;
            break; // up
        case 40:
            moveBackwards = true;
            break; // down
        case 37:
            moveLeft = true;
            break; // left
        case 39:
            moveRight = true;
            break; // right
        case 65:
            yawLeft = true;
            break; // a
        case 68:
            yawRight = true;
            break; // d
        case 87:
            moveUp/*pitchUp*/ = true;
            break; // w
        case 83:
            moveDown/*pitchDown*/ = true;
            break; // s
        case 90:
            rollLeft = true;
            break; // z
        case 67:
            rollRight = true;
            break; // c

        case 16:
            isShiftDown = true;
            break;
        case 17:
            isCtrlDown = true;
            break;

    }

}

function onDocumentKeyUp(event) {

    switch (event.keyCode) {

        case 38:
            moveForward = false;
            break; // up
        case 40:
            moveBackwards = false;
            break; // down
        case 37:
            moveLeft = false;
            break; // left
        case 39:
            moveRight = false;
            break; // right
        case 65:
            yawLeft = false;
            break; // a
        case 68:
            yawRight = false;
            break; // d
        case 87:
            moveUp/*pitchUp*/ = false;
            break; // w
        case 83:
            moveDown/*pitchDown*/ = false;
            break; // s
        case 90:
            rollLeft = false;
            break; // z
        case 67:
            rollRight = false;
            break; // c

        case 16:
            isShiftDown = false;
            break;
        case 17:
            isCtrlDown = false;
            break;
    }
}

function move_camera() {

    if (moveUp) {
        if (isShiftDown) {
            camera.rotation.y += camera_rotation * deg_to_rad;
            //   } else if (isCtrlDown) {
            //      directionalLight.position.y += camera_rotation;
            //      directionalLight.position.normalize();
        } else {
            camera.position.y += move_scale;
        }
    }

    if (moveDown) {
        if (isShiftDown) {
            camera.rotation.y -= camera_rotation * degrees_to_radians;
            //  } else if (isCtrlDown) {
            //      directionalLight.position.y -= camera_rotation;
            //      directionalLight.position.normalize();
        } else {
            camera.position.y -= move_scale;
        }
    }
    if (moveLeft) {
        if (isShiftDown) {
            camera.rotation.x -= camera_rotation * degrees_to_radians;
            //     } else if (isCtrlDown) {
            //        directionalLight.position.x -= camera_rotation;
        } else {
            camera.position.x -= move_scale;
        }
    }
    if (moveRight) {

        if (isShiftDown) {
            camera.rotation.x += camera_rotation * degrees_to_radians;
            //    } else if (isCtrlDown) {
            //         directionalLight.position.x += camera_rotation;
            //          directionalLight.position.normalize();
        } else {
            camera.position.x += move_scale;
        }
    }
    if (moveForward) {

        if (isShiftDown) {
            camera.rotation.z += camera_rotation * degrees_to_radians;
            //    } else if (isCtrlDown) {
            ///        directionalLight.position.z += camera_rotation;
            //     directionalLight.position.normalize();
        } else {
            camera.position.z += move_scale;
        }
    }
    if (moveBackwards) {

        if (isShiftDown) {
            camera.rotation.z -= camera_rotation * degrees_to_radians;
            //   } else if (isCtrlDown) {
            //        directionalLight.position.z -= camera_rotation;
        } else {
            camera.position.z -= move_scale;
        }
    }

    if (rollRight) {
    }
}