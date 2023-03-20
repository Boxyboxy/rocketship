npm init --y
npm i dotenv express nodemon sequelize
npm install --save pg pg-hstore
$ npm install -D sequelize-cli
npx sequeize init
npx sequelize db:create
npm install date-fns express-async-errors express-oauth2-jwt-bearer cloudinary cors


npx sequelize model:generate --name project --attributes name:string,category_id:integer,owner_user_id:integer,description:text,bank_account_id:integer,status:enum:'{active,completed,cancelled}',location:string,github_repo_url:string --underscored
npx sequelize model:generate --name project_pitch_deck --attributes project_id:integer,url_string:string --underscored
npx sequelize model:generate --name category --attributes name:string --underscored
npx sequelize model:generate --name bank_account --attributes bank_account_number:string,bank:text --underscored

##ubuntu pg admin commands
sudo service postgresql start
sudo su postgres
psql boxybox
\l
\c rocketship