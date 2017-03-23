# DOMParticles
DOM Particle Engine

Move HTML elements around like particles.

# Reference

null DOMParticles::newParticle ( [options = { [x = 0], [y = 0], [speed = 0], [maxspeed = 10], [acceleration = .1], [angle = 0], [weight = 100], [friction = null], [container = document.body], [className = 'particle'], [styles = {}], [paused = false]}] )

- *x*: X coordinate.
- *y*: Y coordinate.
- *speed*: Initial speed.
- *maxspeed*: Maximum speed.
- *acceleration*: Acceleration rate (typically between 0 and 1).
- *angle*: Initial degrees of rotation (zero aims right along X).
- *weight*: Weight of the particle (effects acceleration and bounce).
- *friction*: (Not yet implemented.)
- *container*: The containing DOM element whose sides the particles will be bound inside.
- *className*: The class to be applied to the new particle.
- *styles*: Any styles to apply to the new particle (must by JS style names (eg. marginLeft)).
- *paused*: Indicates whether or not the particle is in a suspended state.

