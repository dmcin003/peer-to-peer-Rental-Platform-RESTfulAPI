# Peer-to-Peer-Rental-Platform-Backend

🚀 Installation and Setup

$ git clone https://github.com/dmcin003/peer-to-peer-Rental-Platform-RESTfulAPI.git

$ cd into root directory where package.json is

$ npm install

$ npm run start

$ make sure you have nodemon installed!

$ localhost will run on port 8080

$ Use postman or a api client of your choice to test api

$ use localhost:8080/ping endpoint to make sure you have successfully connected to the local server. Response should say "ping successful"

$ Once connected you can configure the rest of the api in your client

$ To empty db delete db.json file and restart the server.

### API Documentation

GET /ping

    Response: "ping successful"

GET /search

Description: searches for available items on the platform. Can search by name and priceRange, name only, priceRange only. If no params are passed the endpoint responds with all available items.

    Query Params :
    name: string(optional)
    minPrice:number(optional)
    maxPrice:number(optional)
    minPrice && maxPrice should be used together.

    Example Response:
        [
    {
        "name": "old man and the sea",
        "description": "a great boookkk",
        "pricePerDay": 30,
        "id": "b7c54483-b710-56a8-bd25-a636a03baa6a",
        "available": true
    },
    {
        "name": "Lord of the Rings",
        "description": "a great boookkk",
        "pricePerDay": 30,
        "id": "cf790cf0-e229-59a8-b299-edf1cfaadddf",
        "available": true
    }]


POST /item

Description: Allows user to list item on the platform

    example Request body:
    {
    "name":"Lord of the Rings",
    "description":"a great boookkk",
    "pricePerDay": 30

    }


    Example Response: {
    "success": true,
    "message": "You listed: Lord of the Rings on the platform: item id: cf790cf0-e229-59a8-b299-edf1cfaadddf"}


PUT /rental/:id

Description: Allows user to rent item from the platform for a specific date range. Will check to make sure same user is not renting within an already choosen date range.

    Url param:
    id:string (required) found in the item object (ex. "cf790cf0-e229-59a8-b299-edf1cfaadddf")

    Query Params:
    startDate:string (required) format('YYYY-MM-DD')
    endDate:string (required) format('YYYY-MM-DD')
    userId:string (required)

    Example Response:{
    "success": true,
    "message": "You rented this item : {\"name\":\"Lord of the Rings\",\"description\":\"a great boookkk\",\"pricePerDay\":30,\"id\":\"fe81478a-3861-5844-b5fa-7a525a12e71f\",\"available\":false,\"startDate\":\"2025-01-27\",\"endDate\":\"2025-01-31\"}"}


PUT /return/rental/:id

Description: Allows user to return item and make available again

    Url param:
    id:string (required) found in the item object (ex. "cf790cf0-e229-59a8-b299-edf1cfaadddf")

    Example Response:
    {
    "sucess": true,
    "message": "Item returned: {\"name\":\"Lord of the Rings\",\"description\":\"a great boookkk\",\"pricePerDay\":30,\"id\":\"fe81478a-3861-5844-b5fa-7a525a12e71f\",\"available\":true,\"startDate\":\"\",\"endDate\":\"\"}"}


### Solution thought process

    My first steps for solving this problem were to make sure I understood the requirements fully and write down everything from a high level persepctive.
    Once I did that I built a basic local server using express and tested it.
    Then I added the routes for the basic operations like search, list item, rent item, and return item.
    After this I searched for a simple library to write and read from a JSON file and found npm lowdb.
    I initalized the basic db setup in the db.js file and created all the necessary operations for interacting with the json.file and its objects.
    For the storage I created an items array and a rentals array. The items array stores a list of item objects each having name,id,description,and pricePerDay attributes.
    The POST/item creates these objects and adds them to the array with an available attribute of true and generates a random id based on the items attributes.
    The id was necessary to make each item listed unique in the db(especially if multiple users list the same type of item).
    Also the id was necessary to pass to PUT/rental:id and PUT/return/rental/:id endpoints for those operations.
    The rental array was necessary to complete the bonus's overlapping date range conflicts section.
    I used this to store a rental when the user calls the PUT/rental/:id endpoint(also turns the available attribute to false for that item and adds the startDate and endDate attributes).
    I added a query param called userId so we could track rentals per user. This way if the same user tries to rent another item in the same date range that he already has an existing rental the endpoint will fail.
    Calling the PUT/return/rental/:id endpoint will make the item available again and also remove it from the rentals array.
    After creating all functionality for the API and testing it I began to refactor my code and modularize it.
    I created a controller.js, router.js, utils.js, and db.js for seperation of concerns.
    The util.js file holds all helper functions used by the API.
    The db.js file handles all database operations using lowdb library.
    The controller.js file holds all the API's main business logic and calls db operations from db.js and utility functions from util.js where necessary.
    The router.js file initializes the router and creates routes for each endpoint. Router.js calls functions from controller.js.
    The index.js file initializes the server created in the beginning and adds appropriate middleware.



Potential Improvements

    - Data validation for the db would be a good thing to add.
    Since this was a simple backend project I just allowed the user to input anything for each attribute.
    Ideally we would want to create some restrictions using a database schema for attribute types.
    Also we could potentially add more validation on the server itself prohibiting the user from passing incorrect data to specific parameters and responding with an appropriate error message.

    - Git commit style. For this project I created the whole API locally and then commited it to github.
    Ideally we would seperate parts of the application by commit. So once the basic server was built commit that, then the database and so on.

    - Add more attributes to items for more filtering options.(example: add a type attribute to allow user to filter by type of item when searching)







