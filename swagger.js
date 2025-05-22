import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const options = {
definition: {
openapi: '3.0.0',
info: {
  title:'College Event Management System',
  description:"College Event Management System --description pending",
  contact: {
    name: "Kaif Khan, Farhan Ahmad, Meer Alam, Mosannefa Khanam",
    email: "kaiffkhann.292@gmail.com",
    url:"",
  },
  version: '1.0.0',
},
servers: [
  {
    url: "http://localhost:3000/",
    description: "Local server"
  },
  {
    url: "<your live url here>--pending",
    description: "Live server"
  },
]
},
// looks for configuration in specified directories
apis: ['./routers/*router.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
// Swagger Page
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Documentation in JSON format
app.get('/docs.json', (req, res) => {
res.setHeader('Content-Type', 'application/json')
res.send(swaggerSpec)
})
}
export default swaggerDocs

