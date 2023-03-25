npm init --y
npm i dotenv express nodemon sequelize
npm install --save pg pg-hstore
npm install -D sequelize-cli
npx sequeize init
npx sequelize db:create
npm install date-fns express-async-errors express-oauth2-jwt-bearer cloudinary cors


npx sequelize model:generate --name project --attributes name:string,category_id:integer,owner_user_id:integer,summary:text,details:text,bank_account_id:integer,status:enum:'{active,completed,cancelled}',location:string,github_repo_url:string --underscored
npx sequelize model:generate --name project_pitch_deck --attributes project_id:integer,url_string:string --underscored
npx sequelize model:generate --name category --attributes name:string --underscored
npx sequelize model:generate --name bank_account --attributes bank_account_number:string,bank:text --underscored
npx sequelize model:generate --name user --attributes name:string,mobile:string,email:string,linkedin_url:string,github_url:string --underscored
npx sequelize model:generate --name skill --attributes skill:string --underscored
npx sequelize model:generate --name required_skill --attributes skill_id:integer,project_id:integer --underscored
npx sequelize model:generate --name user_skill --attributes skill_id:integer,user_id:integer --underscored

npx sequelize db:migrate

npx sequelize seed:generate --name seed-categories
npx sequelize db:seed --seed 20230322142443-seed-categories.js

npx sequelize seed:generate --name seed-bank-accounts
npx sequelize db:seed --seed 20230322145218-seed-bank-accounts.js

npx sequelize seed:generate --name seed-users
npx sequelize db:seed --seed 20230322151915-seed-users.js

npx sequelize db:migrate:undo --name 20230320083057-create-project-pitch-deck.js
npx sequelize model:generate --name pitch_slide --attributes project_id:integer,url_string:string --underscored
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed --seed 20230322142443-seed-categories.js
npx sequelize db:seed --seed 20230322145218-seed-bank-accounts.js
npx sequelize db:seed --seed 20230322151915-seed-users.js
##ubuntu pg admin commands
sudo service postgresql start
sudo su postgres
psql boxybox
\l
\c rocketship