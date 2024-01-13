"# Blog-posts-Task-newDigitalEasy" 



[post]   http://localhost:5000/user/register 

for admin    register
{
    "name": "John Doe",
    "email": "john.doge@example.com",
    "mobile": "123454678495",
    "password": "secretpassword",
    "role": "admin",
    "secretCode": "A1"          
}
for user 
{
    "name": "John Doe",
    "email": "john.doge@example.com",
    "mobile": "123454678495",
    "password": "secretpassword"
   
}
by default role it will take user

[post]   http://localhost:5000/user/login

login 
{
  "email": "admin@gmail.com",
  "password": "123"
}

login time generating one jwt token  using that token in heder only need to 
crete delete update get posts that token only user or admin have access or not all things verify

[GET]   http://localhost:5000/user/adminDashboard    admin token verify
[GET]   http://localhost:5000/user/userDashboard    usertoken verify

[PUT]    http://localhost:5000/post/create
 crete post 
 {
    "title": "admin Ti521t5le2s2",
    "description": "adm5kjin 82",
    "image": "example.jpg",
    "isPrivate": false
}

[PUT]   http://localhost:5000/post/postId
using post id update 

[DELETE] http://localhost:5000/post/postId
using post id delete 


[GET]  http://localhost:5000/post/posts
 admin only read all posts     

[GET]) http://localhost:5000/post/user/userId
admin using userid that particular user all posts he will read

[GET]  http://localhost:5000/post/postId
using post id that particular post read admin and user (user can read user created posts only)

[GET]  http://localhost:5000/post/user
user will read that user created all posts

[GET]  http://localhost:5000/post/page/4
pagination   using jwt  if user his posts get limit 10 in 1 page if admin he get all posts
