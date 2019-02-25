# front-end

Pull code

npm install

npm start

For both web and api... + setup database
DATABASE: PostgreSQL - name: imdb, owner: postgres


FRONT-END ENDPOINTS::

http://localhost:4200

http://localhost:4200/login

http://localhost:4200/registration

http://localhost:4200/about   ---> In progress

Upon starting of app, you can create new accout on registration route, or via postman by posting 'fullname', 'email' and 'password' fields on http://localhost:3030/users.
You have to register to receive token for authorizations on other routes. 
Take token and use it to post other testing data.  (You can take token by posting 'email' and 'password' on http://localhost:3030/authentication)

JSON files for testing data you can find in "front-end/src/assets/jsons"
Coppy contents of those files and post them on corresponding api routes

genres > http://localhost:3030/genres

actors > http://localhost:3030/actors

movies > http://localhost:3030/movies

shows  > http://localhost:3030/shows

Now go on http://localhost:4200/login, login via created account and test app.


API(BACK-END) ENDPOINTS:

http://localhost:3030/authentication

http://localhost:3030/genres

http://localhost:3030/actors

http://localhost:3030/movies

http://localhost:3030/shows

http://localhost:3030/ratings

http://localhost:3030/users

