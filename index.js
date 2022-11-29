
let poruke = [
    {
      id: 1,
      sadrzaj: 'HTML je jednostavan',
      vazno: true
    },
    {
      id: 2,
      sadrzaj: 'React koristi JSX sintaksu',
      vazno: false
    },
    {
      id: 3,
      sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
      vazno: true
    }
  ]
  
  const Poruka = require('./models/poruka')
  const express = require('express')
  const cors = require('cors')
  const app = express()
  app.use(express.static('build'))
  app.use(cors())
  app.use(express.json())
  
  
  app.get('/', (req, res) =>{
    res.send('<h1>Pozdrav od Express servera!</h1>')
  })
  
  app.get('/api/poruke', (req, res) => {
    Poruka.find({})
      .then( rezultat =>{
        res.json(rezultat)
      })
  })


  app.get('/api/poruke/:id', (req, res,next) => {
    Poruka.findById(req.params.id)
      .then(poruka => {
        if (poruka) {
          res.json(poruka)
        } else {
          res.status(404).end()
        }
  
      })
      .catch(error => {
        err=>next(err)
      })
  })

  app.delete('/api/poruke/:id', (req, res,next) => {
    Poruka.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
  })
  
  app.post('/api/poruke', (req, res, next) => {
    const podatak = req.body
    
    const poruka = new Poruka({
      sadrzaj: podatak.sadrzaj,
      vazno: podatak.vazno || false,
      datum: new Date()
    })
  
    poruka.save()
    .then(spremljenaPoruka => {
      res.json(spremljenaPoruka)
    })
    .catch(err => next(err))
  })

  app.put('/api/poruke/:id', (req, res,next) => {
    const podatak = req.body
    const id = req.params.id
  
    const poruka = {
      sadrzaj: podatak.sadrzaj,
      vazno: podatak.vazno
    }
  
    Poruka.findByIdAndUpdate(id, poruka, {new: true})
    .then( novaPoruka => {
      res.json(novaPoruka)
    })
    .catch(err => next(err))
  
  })

  const errorHandler = (err, req, res, next ) => {
    console.log(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({error: 'krivi format ID-a'})
    }
    else if (err.name === 'ValidationError'){
      return res.status(400).send({error: err.message})
    }
    next(err)
  }
  app.use(errorHandler)

  function zadnjiErrorHandler (err, req, res, next) {
    res.status(500)
    res.send('error', { error: err })
  }
  app.use(zadnjiErrorHandler)


  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Posluzitelj je pokrenut na portu ${PORT}`);
  })