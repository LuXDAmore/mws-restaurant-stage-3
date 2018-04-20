# Mobile Web Specialist Certification Course

## Project Overview: Stage 3

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### _Three Stage Course Material Project - Restaurant Reviews_

---

### Install

1. Clone this repo `git clone https://github.com/LuXDAmore/mws-restaurant-stage-3/`
2. Go to the folder
3. Run `npm install`

_[ In my computer i have installed [ImageMagick](http://www.imagemagick.org/script/download.php "Go to Download page"), so if you are experiencing issues in `images-tasks` probably you'll need to install it. ]_

### Run && Watch

1. Development, with livereload: `npm run dev` or `npm run serve`
2. Staging, with livereload: `npm run staging` or `npm run serve:staging`
3. Production, with livereload: `npm run production` or `npm run serve:production`
4. Production, no livereload: `npm run production` or `npm run view:production`

_It watch files under the `dist/` folder, on port `4000`, to changing it check `var options` in the `gulpfile.js`*_

### Build

1. Production in the `dist/` folder: `npm run build`
2. Staging in the `dist/` folder: `npm run build:staging`
3. [Github Pages](https://pages.github.com/ "Github Pages") in the `docs/` folder: `npm run build:github:pages`

---

### Demos

[Live Netlify](https://mws3-restaurant.netlify.com "Demo Netlify") - [Live Github Pages](https://luxdamore.github.io/mws-restaurant-stage-3/ "Demo Github Pages")

### Info

**Main configurations are in the `gulpfile.js` file, in a variable called `options`;**
**For Github Pages, you should read the documentation setting branch `master` with `docs/` folder and you should check `var options.github` in the `gulpfile.js`**
**This building tool is compatible with [Netlify](https://www.netlify.com/ "Netlify").**

--

## Local Development API Server

### Usage

#### Get Restaurants

`curl "http://localhost:1337/restaurants/"`

#### Get Restaurants by id

`curl "http://localhost:1337/restaurants/{3}"`

### Architecture

Local server:

- Node.js
- Sails.js

--

#### Start only server

`npm run start`: development, Port: 1337

##### Start the server and the building process together

`npm run sailsjs`: production, Port: 1337, you manually have to go to url `http://localhost:1377`
_Served from `.tmp/public` folder_

--

#### Audits // Lighthouse

![Image of 99% on Lighthouse](https://raw.githubusercontent.com/LuXDAmore/mws-restaurant-stage-3/master/performance.png)

--

## Endpoints

### GET Endpoints

#### Get all restaurants

```http://localhost:1337/restaurants/```

#### Get favorite restaurants

```http://localhost:1337/restaurants/?is_favorite=true```

#### Get a restaurant by id

```http://localhost:1337/restaurants/<restaurant_id>```

#### Get all reviews for a restaurant

```http://localhost:1337/reviews/?restaurant_id=<restaurant_id>```

#### Get all restaurant reviews

```http://localhost:1337/reviews/```

#### Get a restaurant review by id

```http://localhost:1337/reviews/<review_id>```

### POST Endpoints

#### Create a new restaurant review

```http://localhost:1337/reviews/```

```json

{
    "restaurant_id": <restaurant_id>,
    "name": <reviewer_name>,
    "rating": <rating>,
    "comments": <comment_text>
}

```

### PUT Endpoints

#### Favorite a restaurant

```http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true```

#### Unfavorite a restaurant

```http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=false```

#### Update a restaurant review

```http://localhost:1337/reviews/<review_id>```

```json

{
    "name": <reviewer_name>,
    "rating": <rating>,
    "comments": <comment_text>
}

```

### DELETE Endpoints

#### Delete a restaurant review

```http://localhost:1337/reviews/<review_id>```
