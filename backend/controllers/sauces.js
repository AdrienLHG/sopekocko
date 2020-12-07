
const Sauce = require('../models/Sauces'); 
const fs = require('fs'); 

// fonction de l'ajout d'une sauce à la base de données
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// fonction de modification d'une sauce dans la base de données
exports.modifySauce = (req, res, next) => { 
    const sauceObject = req.file ? 
        {
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }; 
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
}; 

// fonction de suppression d'une sauce de la base de données
exports.deleteSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id }) 
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fs.unlink(`images/${filename}`, () => { 
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// fonction pour trouver une sauce présente dans la base de données
exports.findOneSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// fonction pour afficher toutes les sauces présentes dans la base de données
exports.findAllSauces = (req, res, next) => { 
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// fonction pour "likes or dislike" une sauce dans la base de données
exports.likeOrDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
   .then(sauce => {
       switch (req.body.like) {
           case -1: //utilisateur n'aime pas la sauce
               Sauce.updateOne({_id: req.params.id }, {
                   $inc: {dislikes:1},
                   $push: {usersDisliked: req.body.userId},
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: "utilisateur n'aime pas la sauce !"}))
                   .catch( error => res.status(400).json({ error }))
               break;
           
           case 0:
               if (sauce.usersLiked.find(user => user === req.body.userId)) { //utilisateur n'aime plus la sauce (enlève son like)
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {likes:-1},
                       $pull: {usersLiked: req.body.userId},
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: "utilisateur n'aime plus la sauce !"}))
                       .catch( error => res.status(400).json({ error }))
               }

               if (sauce.usersDisliked.find(user => user === req.body.userId)) { //utilisateur aime finalement la sauce (enlève son dislike)
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {dislikes:-1},
                       $pull: {usersDisliked: req.body.userId},
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: "utilisateur aime finalement la sauce !"}))
                       .catch( error => res.status(400).json({ error }));
               }
               break;
           
           case 1:
               Sauce.updateOne({ _id: req.params.id }, { //utilisateur aime la sauce
                   $inc: {likes:1},
                   $push: {usersLiked: req.body.userId},
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: "utilisateur aime la sauce !"}))
                   .catch( error => res.status(400).json({ error }));
               break;
           default:
               return res.status(500).json({ error });
       }
   })
   .catch(error => res.status(500).json({ error }))
};


