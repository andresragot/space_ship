class Enemy_k extends Enemy
{
    constructor(img, initialPosition, life)
    {
        super(img, initialPosition, life);
        this.speed = 1000;
        this.stateMachine = {
            View: 0,
            Launch: 1,
        };
        this.actualState = this.stateMachine.View;

        this.waitTime = 1;
    }

    Update(deltaTime)
    {
        if (this.actualState == this.stateMachine.View)
        {
            this.targetRotation = Math.atan2(
                player.position.y - this.position.y,
                player.position.x - this.position.x
            );
    
            this.rotation = this.targetRotation;

            if (this.waitTime <= 0)
            {
                this.waitTime = 1;
                this.actualState = this.stateMachine.Launch;
            }
            else
            {
                this.waitTime -= deltaTime;
            }

        }
        else if (this.actualState == this.stateMachine.Launch)
        {
            this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
            this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;

            if (this.position.x < sceneLimits.x + this.boundingRadius)
            {
                this.position.x = sceneLimits.x + this.boundingRadius;
                this.actualState = this.stateMachine.View;
            }
            if (this.position.x > sceneLimits.x + sceneLimits.width - this.boundingRadius)
            {
                this.position.x = sceneLimits.x + sceneLimits.width - this.boundingRadius;
                this.actualState = this.stateMachine.View;
            }
            if (this.position.y < sceneLimits.y + this.boundingRadius)
            {
                this.position.y = sceneLimits.y + this.boundingRadius;
                this.actualState = this.stateMachine.View;
            }
            if (this.position.y > sceneLimits.y + sceneLimits.height - this.boundingRadius)
            {
                this.position.y = sceneLimits.y + sceneLimits.height - this.boundingRadius;
                this.actualState = this.stateMachine.View;
            }
        }
    }

}