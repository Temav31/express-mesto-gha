Skip to content
Temav31
/
express-mesto-gha

Type / to search
Command palette
Create new...
Issues
Pull requests
You have unread notifications
Code
Issues
Pull requests
Actions
Projects
Security
Insights
Settings
Pane width
Use a value between 17% and 36%

21
Change width
Code
Go to file
t
routes content loaded
.github
controllers
cards.js
users.js
middlwares
auth.js
error.js
models
card.js
user.js
routes
cards.js
index.js
users.js
utils
.editorconfig
.eslintrc
.gitignore
README.md
app.js
package-lock.json
package.json
Documentation • Share feedback
Breadcrumbsexpress-mesto-gha/routes
/users.js
Latest commit
Temav31
Temav31
15
5b121dd
 ·
14 hours ago
History
File metadata and controls

Code

Blame
44 lines (44 loc) · 970 Bytes
const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { pattern } = require("../utils/constants");
//  импорт обработчиков
const {
  getUsers,
  getUserById,
  UpdateProfile,
  UpdateAvatar,
  getCurrentUser,
} = require("../controllers/users");
// обработка путей
router.get("/me", getCurrentUser);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  UpdateProfile
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(pattern),
    }),
  }),
  UpdateAvatar
);
router.get("/", getUsers);
router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().length(24),
    }),
  }),
  getUserById
);
// экспорт роута
module.exports = router;
express-mesto-gha/routes/users.js at b29573af4e11b898ce874bf32b41026a987a4efa · Temav31/express-mesto-gha · GitHub
