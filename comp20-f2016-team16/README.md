Team 16: Matthew Epstein, DK Kim, Conor Ward, Nathan Watts<br />
Comp20 Semester Group Project<br />
README.md<br />

Project Title:<br />
Vhoto

Problem Statement:<br />
Even with modern messaging systems making it easier than ever to keep in touch with friends, it’s still difficult to feel like a part of your friends’ lives, and the sense of friendly competition and rivalry that comes with playing games with friends is missing.

Solution:<br />
Vhoto is a continuous daily photography competition between you and your friends, which allows you a glimpse into each other’s daily lives, incentivized with a sense of friendly competition, and inspires users to find the beauty in everyday moments through daily photography challenges.

Use Scenario:<br />
When a user first opens the application, they are led through the process of creating an account. This process involves establishing basic profile parameters -- name, location permissions, camera permissions, username, and password, at a minimum. The user then has the option to join as many photo challenges as they wish. Once the user has joined a challenge, they will have a predetermined amount of time to submit a single photo that responds to the challenge's prompt (e.g., "take the best flower photo").  Users will have the option to invite their friends to challenges. Users can be in multiple challenges simultaneously and will see their different challenges on the homescreen.The purpose of the game is to take a picture that fits the challenge prompt and to post it to the website, where it will compete to be named the best photo. Throughout the submission period, users can add potential submissions to a repository, but before the submission period ends they must select only one photo to submit to the challenge. Once the submission period has ended, all of the submitted photos will be sorted into pairs and placed in a tournament bracket. Then the first round of voting will commence, and every member of the challenge will have a predetermined amount of time to vote on each submission pair. Users cannot vote on the submission pair containing their photo submission. After the first round of voting ends, the second round of voting will begin, again lasting for a predetermined amount of time. This cycle will continue until only two photos remain and a winner is determined. 

The website will offer users several other affordances. First of all, users will be able to browse other challenges and winning submissions from around the world. The will also be able to access sortable statistical data and analytics regarding who has won the most games, etc.

Features:<br />
Geolocation to get each user's location so that 1) users can be put into a group of contestants properly by location and 2) photo/video prompts based on location may be properly given to user<br/>
Server-side persistence is necessary for games to be stored on the server so they continue even if a given player disconnects<br/>
Notification system (SMS, email) to notify players when voting begins/ends, if they won, if another player has added a picture, etc.<br/>
Visualizations such as graphs and charts for vote distribution and each user's rank <br/>

Data Collected and Used:<br />
Current location of the user<br />
Basic profile information including user ID, password, name, age, and gender (link Google/Facebook account if possible)<br />
Total score for each user to put him or her into the correct rank<br />
Date of each photo taken<br />
A collection of prompts for photos<br />

Algorithms or Special Techniques:<br />
Distance finding algorithms such as the haversine formula will be needed to established shared landmarks (for location-specific challenge prompts such as, "take the best photo of the Golden Gate Bridge") <br />
Balanced binary search tree such as a red-black tree<br />
Rank-finding algorithm in order to search, insert, and update each user’s earned score<br />

APIs:<br />
Google Map or any geolocation API to get the user location in order to put him or her into a appropriate group for competition<br />
Login API to get the user profile such as ID, Password, and name etc <br />
Database API to store each group of data including user profile and the photos/videos submitted per user<br />
Data/graphing API to visualize vote distribution and each user's rank <br />
Photo/video API to allow users to upload or take photos/videos <br />

Mock Ups:<br />
![alt tag](https://raw.githubusercontent.com/cward01/comp20-f2016-team16/master/comp20-f2016-team16/Vhoto_Wireframes_Annotated_First Visit.jpg) <br />
![alt tag](https://raw.githubusercontent.com/cward01/comp20-f2016-team16/master/comp20-f2016-team16/Vhoto_Wireframes_Annotated_Home Screen.jpg) <br />

#Comments by Ming
* I really like this game is photos-based
* "link Google/Facebook account if possible" => YES, do that.  Better use of your time and better security if you use something well-established.
* Broken images in doc --darn it, don't use white space in file name.

