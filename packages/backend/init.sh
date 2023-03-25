npm init --y
npm i dotenv express nodemon sequelize
npm install --save pg pg-hstore
npm install -D sequelize-cli
npx sequeize init
npx sequelize db:create
npm install date-fns express-async-errors express-oauth2-jwt-bearer cloudinary cors


npx sequelize model:generate --name project --attributes name:string,categoryId:integer,userId:integer,summary:text,details:text,bankAccountId:integer,status:enum:'{active,completed,cancelled}',location:string,githubRepoUrl:string,coverImage:string --underscored
npx sequelize model:generate --name pitchSlide --attributes projectId:integer,urlString:string --underscored
npx sequelize model:generate --name category --attributes name:string --underscored
npx sequelize model:generate --name bankAccount --attributes bankAccountNumber:string,bank:text --underscored
npx sequelize model:generate --name user --attributes name:string,mobile:string,email:string,linkedinUrl:string,githubUrl:string --underscored
npx sequelize model:generate --name skill --attributes skill:string --underscored
npx sequelize model:generate --name requiredSkill --attributes skillId:integer,projectId:integer --underscored
npx sequelize model:generate --name userSkill --attributes skillId:integer,userId:integer --underscored
#NOTE: Make sure to change migration files to snakecase and leave camel case in model files
#NOTE: data attributes in seeder config file requires snake case


npx sequelize seed:generate --name seed-categories
npx sequelize db:seed --seed 20230322142443-seed-categories.js

npx sequelize seed:generate --name seed-bank-accounts
npx sequelize db:seed --seed 20230322145218-seed-bank-accounts.js

npx sequelize seed:generate --name seed-users
npx sequelize db:seed --seed 20230322151915-seed-users.js

npx sequelize db:migrate:undo --name 20230320083057-create-project-pitch-deck.js
npx sequelize model:generate --name pitchSlide --attributes projectId:integer,urlString:string --underscored

npx sequelize seed:generate --name seed-skills
npx sequelize db:seed --seed 20230325073106-seed-skills.js

#RESET CODE:
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed --seed 20230322142443-seed-categories.js
npx sequelize db:seed --seed 20230322145218-seed-bank-accounts.js
npx sequelize db:seed --seed 20230322151915-seed-users.js
npx sequelize db:seed --seed 20230325073106-seed-skills.js
npm start

##ubuntu pg admin commands
sudo service postgresql start
sudo su postgres
psql boxybox
\l
\c rocketship




