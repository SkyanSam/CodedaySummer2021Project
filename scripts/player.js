class Player
{
    constructor()
    {
        this.rotY = 0;
        this.viewDirection = [0, 0, 1];
        this.center = [0, 0, 0];

        this.runSpeed = 0.02;
        this.turnSpeed = 0.16;
        this.currentSpeed = 0;
        this.currentTurnSpeed = 0;
        this.currentlyPressedKeys = {};
        this.x = 0;
        this.y = 0;
        this.z = -7;

        this.lastTime = 0;
    }

    animate()
    {
        var timeNow = new Date().getTime();
        if(this.lastTime !== 0)
        {
            var elapsed = timeNow - this.lastTime;
            var distance = this.currentSpeed * elapsed;
            this.rotY += this.currentTurnSpeed * elapsed;            
            this.x += distance * Math.sin(degToRad(this.rotY));
            this.z += distance * Math.cos(degToRad(this.rotY));
            var angle = degToRad(this.currentTurnSpeed * elapsed);
            glMatrix.vec3.rotateY(this.viewDirection, this.viewDirection, [this.x, this.y, this.z], angle);
            glMatrix.vec3.add(this.center, [this.x, this.y, this.z], this.viewDirection);
                   
        }
        this.lastTime = timeNow;
    }


    handleKeys()
    {
        if(this.currentlyPressedKeys[65]) // A
        {
            this.currentTurnSpeed = this.turnSpeed;
        }
        else if(this.currentlyPressedKeys[68]) // D
        {
            this.currentTurnSpeed = -this.turnSpeed;
        }
        else
        {
            this.currentTurnSpeed = 0;
        }

        
        if(this.currentlyPressedKeys[87]) // W
        {
            this.currentSpeed = this.runSpeed;
        }
        else if(this.currentlyPressedKeys[83]) // S
        {
            this.currentSpeed = -this.runSpeed;
        }
        else
        {
            this.currentSpeed = 0;
        }


    }


    handleKeyDown(event)
    {
	    this.currentlyPressedKeys[event.keyCode] = true;
    }

    handleKeyUp(event)
    {
        this.currentlyPressedKeys[event.keyCode] = false;
    }
}
