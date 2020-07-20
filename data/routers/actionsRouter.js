const express = require('express');
const Projects = require('../helpers/projectModel');
const Actions = require('../helpers/actionModel');
const router = express.Router();

// get,
// insert,
// update,
// remove,

// get

//get actions - Returns "Actions!!!"
router.get('/', (req, res) => {
    res.status(200).json({
      message: "Actions!!!"
    })
  })
  
  //get action by ID - Gets the Action by ID.
  router.get('/:id', validateId(), (req, res) => {
    Actions.get(req.params.id)
      .then(action => {
        res.status(200).json(action)
      })
      .catch(err => {
        console.log('Error: ', err);
        res.status(500).json({
          errorMessage: "Could not retrieve action by id..."
        })
      })
  })

// post (insert) - COMPLETE!

router.post('/', (req, res) => {
    Actions.get()
      .then(() => {
        if (!req.body.project_id || !req.body.description || !req.body.notes) {
          res.status(400).json({
            message: "Look, I like your gumption, but you need a project ID and a description of your Action, and some notes."
          })
        } else {
          Actions.insert(req.body)
            .then(act => {
              res.status(200).json(act)
            })
            .catch(err => {
              res.status(500).json({
                message: "Hey. So, Like, Something isn't correct here."
              })
            })
        }
      })
      .catch((error) => {
        res.status(500).json({
          errorMessage: "Something isn't right. Check this info: ", error
        })
      })
  })

// put (update)

router.put('/:id', validateId(), (req, res) => {
    Actions.update(req.params.id, req.body)
      .then(updateAct => {
        res.status(200).json(updateAct)
      })
      .catch((error) => {
        res.status(500).json({
          message: "Hmmm. Something happened. It's not good. Here's some info: ", error
        })
      })
  })

// delete (remove)

router.delete('/:id', validateId(), (req, res) => {
    Actions.remove(req.params.id)
      .then(() => {
        res.status(200).json({
          message: "Say goodbye to that action. Successfully deleted."
        })
      })
      .catch((error) => {
        res.status(500).json({
          message: "Alright, something didn't happen. Might be there, might not. Here's info: ", error
        })
      })
  })


//Validate the ID - Custom Middleware

function validateId() {
    return (req, res, next) => {
      Actions.get(req.params.id)
        .then(action => {
          if (action) {
            req.action = action
            next();
          } else {
            res.status(400).json({
              message: "Something isn't right here. Wrong ID. Try again."
            })
          }
        })
        .catch((error) => {
            res.status(500).json({
            message: "Something is amiss. Wanna try again? Here's some info: ", error
          })
        })
    }
  }


module.exports = router;