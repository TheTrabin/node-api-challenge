const express = require('express');

const Projects = require('../helpers/projectModel');
// const Actions = require('../helpers/actionModel');
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
    const {id} =req.params;
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

router.get('/:id/actions'), (req,res) => {
    
}


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


//put



//delete



//custom Middleware

//by ID

module.exports = router;