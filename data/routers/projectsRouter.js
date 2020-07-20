const express = require('express');

const Projects = require('../helpers/projectModel');
const Actions = require('../helpers/actionModel');
const router = express.Router();

// get,
// insert,
// update,
// remove,
// getProjectActions


//get 
//get list: Complete
router.get('/', (req,res) => {
    Projects.get()
    .then((proj) => {
        res.status(200).json(proj);
    })
    .catch((error) => {
        res.status(500).json({
            message: "Can't Find the projects. Here's the Reasoning: ", error
        })
    })
})

//get ID - complete - Also returns, shockingly enough, the actions.
router.get('/:id', (req,res) => {
    const {id} = req.params;
    Projects.get(id)
    .then((proj) => {
        if (proj) {
            req.proj = proj;
            res.status(200).json(req.proj);
        } else {
            res.status(404).json({
                message: "The ID of this Project is non-existant. Please check it and try again."
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong with the request. Here's some Info: ", error
        })
    })
}) 
// Get - Actions for project - Functions.
router.get('/:id/actions', validateId(), (req,res) => {
    Projects.getProjectActions(req.params.id)
    .then(acts => {
        res.status(200).json(acts)
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "Can't seem to find the actions. You sure? Here's some info: ", error
        })
    })
})


//post
//Base post for Projects themselves is functioning perfectly.
router.post('/', (req, res) => {
	const ProjInfo = req.body;
	Projects.insert(ProjInfo)
		.then(() => {
			if (!ProjInfo.name) {
				// throw new Error
				res.error(400).json({
					errorMessage: 'Please provide name and description for the post.',
				});
			}

			if (!ProjInfo.description) {
				// throw new Error
				res.error(400).json({
					errorMessage: 'Please provide name and description for the post.',
				});
			}

			
			res.status(201).json(ProjInfo);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				error: 'There was an error while saving the project to the database', error
			});
		});
});

//post - Post Actions to project - might work on having that function at actionsRouter
router.post('/:id/actions', (req, res) => {
	const actionInfo = { ...req.body, project_id: req.params.id };
	const { text } = req.body;

	if (!text) {
		res.status(400).json({
			errorMessage: 'Please provide text for the comment.',
		});
	}
	try {
		Actions.insert(actionInfo);
		res.status(201).json(actionInfo);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: 'There was an error while saving the action to the database',
			err,
		});
	}
});

//put - Functions

router.put('/:id', validateId(), (req,res) => {
    Projects.update(req.params.id, req.body)
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch((error) => {
        res.status(500).json({
            message: "Can't update for some reason. Here's some info: ", error
        })
    })
})


//delete - Functions
router.delete('/:id',  async (req, res) => {
	await Projects.remove(req.params.id)
		.then((proj) => {
			if (proj > 0) {
				res.status(200).json({ message: 'This project has been deleted' });
			} else {
				res.status(404).json({ message: 'The project could not be found' });
			}
		})
		.catch(error)
		.json({
			message: 'Error removing the project',
            error: 'The user could not be removed',
            error
		});
});


//custom Middleware

function validateId() {
    return (req, res, next) => {
      if (req.params.id) {
        Projects.get(req.params.id)
          .then(project => {
            if (project) {
              req.project = project
              next()
            } else {
              res.status(400).json({
                message: "Whoops! Can't find that Project. Try again."
              })
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: "Huh. Nothing's Happening. Check this out: ", error
            })
          })
      } else {
        res.status(400).json({
          errorMessage: "This is a little Embarrasing. Maybe try again?"
        })
      }
    }
  }
  

  function validateProject() {
    return (req, res, next) => {
      if (!req.body.name || !req.body.description) {
        res.status(400).json({
          errorMessage: "You might want to add either a name, or a description here."
        })
      } else {
        next();
      }
    }
  }




module.exports = router;