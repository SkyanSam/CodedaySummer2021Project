/////
// Utility functions for loading from files, doing math and handling matrices.

var loadTextResource = function (url, callback) 
{
	var request = new XMLHttpRequest();
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function () 
    {
        if (request.status < 200 || request.status > 299) 
        {
			callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
        } 
        else 
        {
			callback(null, request.responseText);
		}
    }
    
	request.send();
}

var loadImage = function (url, callback) 
{
	var image = new Image();
    image.onload = function () 
    {
		callback(null, image);
    }
    
	image.src = url;
}

function loadJSONResource(name, url, callback)
{
    loadTextResource(url, function (err, result) 
    {
        if (err) 
        {
			callback(err);
        } 
        else 
        {
            try 
            {
				callback(null, JSON.parse(result), name);
            } 
            catch (e) 
            {
				callback(e);
			}
		}
	});
}

function modelViewPushMatrix() 
{
    var copy = glMatrix.mat4.clone(modelViewMatrix);
    modelViewMatrixStack.push(copy);
}
  
function modelViewPopMatrix() 
{
    if (modelViewMatrixStack.length == 0) 
    {
      throw "Invalid popMatrix!";
    }
    modelViewMatrix = modelViewMatrixStack.pop();
 
}


function degToRad(deg)
{
	return deg * Math.PI / 180;
}
