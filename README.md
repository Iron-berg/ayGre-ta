# ayGre-ta
> Social network for climate change warriors

![home page](public/images/readme-imgs/home.png)

Responsive app that shows the latest news on climate change and it lets users interact with each other 

## Demo
![features demonstration](public/images/readme-imgs/features.gif)

Live version [https://aygre-ta.herokuapp.com/](https://aygre-ta.herokuapp.com/)

## Installing
In order to run this project locally do the following:

1. Clone the project
2. Run `npm install` to install all the dependencies
3. Change [.envExample](https://github.com/Iron-berg/ayGre-ta/blob/master/.envExample) file name to .env and paste the required environment variables in the corresponding field 
4. Run `npm run dev` to launch the application and access it at localhost:port

## Features
* Main page shows a carousel with five of the latest news as well as some insightful information about the environment
* News page displays up to a hundred of the latest news on climate changes, environment, global warming...
* Users can sign up and login, both using Facebook and providing username and password 
* When logged in, users can: 
  - Favorite/unfavorite news using the leaf button, which will be saved in their favorite page
  - Look for user's to follow using search bar
  - Manage their followers and following via opening modal window
  - Create their own posts and like posts from the people they follow by cliking the victory button
* Users will get a point per follower and two points per liked post 
* Profile page shows a leaderboard of the Top 5 users as well as logged user's own score

**To do:**
* Improve app's design
* Include live chat

## Technologies
* [Handlebars.js](https://handlebarsjs.com/) and [Bootstrap](https://getbootstrap.com/) to get the structure and styling of the app
* [Express.js](https://expressjs.com/) as the foundation to build the app's backend
* [Mongoose.js](https://mongoosejs.com/) to handle platform models and database

## Overview 
This is the second of three projects to be made during the Ironhack Web Development Bootcamp. It has been a great opportunity to work as a team to develop a full stack web application from the ground up, not following any kind of guideline or tutorial whatsoever.

## Contributing
If you wish to contribute to this project, you may add yourself to [CONTRIBUTING.md](https://github.com/Iron-berg/ayGre-ta/blob/master/CONTRIBUTING.md)

## License
Please refer to [LICENSE.md](https://github.com/Iron-berg/ayGre-ta/blob/master/LICENSE.md)

## Team
<table>
<tr><td align="center"><a href="https://github.com/anaSegarra"><img src="https://avatars3.githubusercontent.com/u/45148338?s=400&v=4" width="100px;" alt="Ana avatar"/><br/><sub><b>Ana Segarra</b></sub></a><br/><a href="https://github.com/anaSegarra"></a>
<td align="center"><a href="https://github.com/joseanher81"><img src="https://avatars3.githubusercontent.com/u/23436377?s=400&v=4" width="100px;" alt="Jose avatar"/><br/><sub><b>Jose Ángel Hernández</b></sub></a><br/><a href="https://github.com/joseanher81"></a>
</table>
