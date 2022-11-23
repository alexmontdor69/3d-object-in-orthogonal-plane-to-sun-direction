# Display a 3D object in a Plane orthogonal to the sun beams

## Objective
The objective is to simulate the position of points of a model in the plane orthogonal to direction of the sun beams.

With the help of the range bar, The user can vary either :

- The position of the object in the X-Y Plane
- Change the position of the azimuth of the sun
- Change the position of the elevation of the sun

The user can reset the position of the object and access to different plane view. The azimuth and elevation angle are changed.

All the angle are indicated and some visual indicators allow a better understand of the orientation of the 3D model.

## Libraries
This app uses 2 open source libraries.

- [solar-plane-calculator](https://github.com/alexmontdor69/solar-plane-calculator)
- [matrix-lib-js](https://github.com/alexmontdor69/matrix-lib-js)

## Run this application

### Requirement

npm should be install

### Command
- developpement mode

<code>
npm install
npm start
</code>

- production mode

<code>
npm install
npm build
serve -s build
</code>

The application runs in develocally theoritically on [http://localhost:3000](http://localhost:3000) accessible from any web browser

