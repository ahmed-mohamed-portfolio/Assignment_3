// ===========================  Assignment 3  =======================

// Part1: Core Modules ( 1.5 Grades)

// 1. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
// • Input Example: "./big.txt"
// • Output Example: log each chunk


const fs = require('fs')

const ReadFilePath = './big.txt';


function readStream(ReadFilePath) {

    const streamData = fs.createReadStream(ReadFilePath, {
        encoding: 'utf-8',
        highWaterMark: 64 * 1024
    })


    streamData.on('data', (chunk) => {
        console.log(chunk);
        console.log(chunk.length);


    })

}


//  readStream(ReadFilePath)

//==================================================================

// 2. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
// • Input Example: "./source.txt", "./dest.txt"
// • Output Example: File copied using streams

const writeFilePath = 'write.txt';


function copyContentUsingStream(ReadFilePath, writeFilePath) {

    const streamData = fs.createReadStream(ReadFilePath, {
        encoding: 'utf-8',
        highWaterMark: 64 * 1024
    })


    const writeStream = fs.createWriteStream(writeFilePath)

    streamData.on('data', (chunk) => {
        console.log(chunk);
        console.log(chunk.length);

        writeStream.write(chunk)
    })


    streamData.on('end', () => {
        console.log("File copied using streams");

    })


}


// copyContentUsingStream(ReadFilePath,writeFilePath)

//==================================================================

// 3. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
// • Input Example: "./data.txt", "./data.txt.gz"


//refrance :: https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-options

const { pipeline } = require('node:stream/promises');
// const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
    await pipeline(
        fs.createReadStream('big.txt'),
        zlib.createGzip(),
        fs.createWriteStream('archive.txt.gz'),
    );
    console.log('Pipeline succeeded.');
}

// run().catch(console.error);

//==================================================================

// Part2: Simple CRUD Operations Using HTTP ( 5.5 Grades):
// For all the following APIs, you must use the fs module to read and write data from a JSON file (e.g., users.json).
// Do not store or manage data using arrays (0.5 Grades).

// 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before) (1 Grade)
//  URL: POST /user



const http = require('http')

const users = fs.readFileSync('users.json', 'utf-8')

const server = http.createServer((req, res) => {
    const { url, method } = req;


    if (url == '/user' && method == 'POST') {
        let postuser;
        req.on('data', (chunk) => {
            postuser = JSON.parse(chunk);
        })

        req.on('end', () => {

            let formatedUsers = JSON.parse(users)
            let userData = formatedUsers.find((user) => user.email == postuser.email)
            if (!postuser.id) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: "ID is required" }))
                console.log({ "message": "ID is required" });
                res.end()
            } else
                if (userData) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: "Email already exists" }))
                    console.log({ "message": "Email already exists" });
                    res.end()

                }
                else {
                    formatedUsers.push(postuser)
                    fs.writeFile('users.json', JSON.stringify(formatedUsers), 'utf8', ((err, data) => {
                        if (err) {
                            console.log(err);

                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ message: "user added successfully" }))
                            res.end()

                            console.log('user added successfully');
                        }

                    }))

                }

        })

    } else {
        res.writeHead(200, { 'content-type': 'text' })
        res.write("server is running")
        res.end()
    }

})



// server.listen(3000, () => {
//     console.log("server is running in server 3000");
// })

//==================================================================

// 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the URL (1 Grade)
// Note: Remember to update the corresponding values in the JSON file
// URL: PATCH /user/id



const server2 = http.createServer((req, res) => {
    const { url, method } = req;


    if (url.includes('/user/') && method == 'PATCH') {
        let postuser;
        req.on('data', (chunk) => {
            postuser = JSON.parse(chunk);
        })

        req.on('end', () => {
            const userId = url.split('/')[2]
            console.log(userId);

            let formatedUsers = JSON.parse(users)
            let userIndex = formatedUsers.findIndex((user) => user.id == userId);


            if (userIndex < 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: "USER ID not found" }))
                console.log({ "message": "USER ID not found" });
                res.end()

            }
            else {

                if (postuser.email) {
                    formatedUsers[userIndex].email = postuser.email

                }

                if (postuser.age) {
                    formatedUsers[userIndex].age = postuser.age

                }

                if (postuser.name) {
                    formatedUsers[userIndex].name = postuser.name

                }

                fs.writeFile('users.json', JSON.stringify(formatedUsers), 'utf8', ((err, data) => {
                    if (err) {
                        console.log(err);

                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ message: "user updated successfully" }))
                        res.end()

                        console.log('user updated successfully');
                    }

                }))

            }

        })

    } else {
        res.writeHead(200, { 'content-type': 'text' })
        res.write("server is running")
        res.end()
    }

})



// server2.listen(3000, () => {
//     console.log("server is running in server 3000");
// })


//==================================================================

// 3. Create an API that deletes a User by ID. The user id should be retrieved from the URL (1 Grade)
// Note: Remember to delete the user from the file
//  URL: DELETE /user/id



const server3 = http.createServer((req, res) => {
    const { url, method } = req;


    if (url.includes('/user/') && method == 'DELETE') {


        const userId = url.split('/')[2]
        console.log(userId);

        let formatedUsers = JSON.parse(users)
        let userData = formatedUsers.find((user) => user.id == userId)

        if (!userData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: "User Id Not found" }))
            console.log({ "message": "User Id Not found" });
            res.end()

        }
        else {
            const filtered = formatedUsers.filter(user => user.id !== userId);

            fs.writeFile('users.json', JSON.stringify(filtered), 'utf8', ((err, data) => {
                if (err) {
                    console.log(err);

                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: "user deleted successfully" }))
                    res.end()

                    console.log('user deleted successfully');
                }

            }))

        }



    } else {
        res.writeHead(200, { 'content-type': 'text' })
        res.write("server is running")
        res.end()
    }

})



// server3.listen(3000, () => {
//     console.log("server is running in server 3000");
// })


//==================================================================
// 4. Create an API that gets all users from the JSON file. (1 Grade)
//  URL: GET /user


const server4 = http.createServer((req, res) => {
    const { url, method } = req;


    if (url == '/users' && method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(users)
        res.end()
    }
    else {
        res.writeHead(200, { 'content-type': 'text' })
        res.write("server is running")
        res.end()
    }

})

// server4.listen(3000, () => {
//     console.log("server is running in server 3000");
// })


//==================================================================

// 5. Create an API that gets User by ID. (1 Grade)
//  URL: GET /user/:id

const server5 = http.createServer((req, res) => {

    const { url, method } = req;

    if (url.includes('/user') && method == 'GET') {
        const userId = url.split('/')[2]
        console.log(userId);

        let formatedUsers = JSON.parse(users)
        let userData = formatedUsers.find((user) => user.id == userId)
        if (userData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(userData))
            res.end()
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: "user not found" }))
            res.end()
        }

    }
    else {
        res.writeHead(200, { 'content-type': 'text' })
        res.write("server is running")
        res.end()
    }

})

// server5.listen(3000, () => {
//     console.log("server is running in server 3000");
// })


//==================================================================
// important Notes about postman
// 1. Name the endpoint with a meaningful name like 'Add User', not dummy names.
// 2. Save your changes on each request( ctrl+s ).
// 3. Include the Postman collection link (export your Postman collection ) in the email with your assignment link

//https://www.postman.com/route-c-45-http/workspace/http-c45/collection/34632160-fc9dd744-aa8e-4e44-81c7-d8510c0a0962?action=share&source=copy-link&creator=34632160

//==================================================================


// Part3: Node Internals (3 Grades):
// 1. What is the Node.js Event Loop? (0.5 Grade)

//refrance:: https://www.geeksforgeeks.org/node-js/node-js-event-loop/

// Answer :
// The event loop in Node.js is a mechanism that allows asynchronous tasks to be handled efficiently without blocking the execution of other operations. 
// It:
// => Executes JavaScript synchronously first and then processes asynchronous operations.
// => Delegates heavy tasks like I/O operations, timers, and network requests to the libuv library.
// => Ensures smooth execution of multiple operations by queuing and scheduling callbacks efficiently.

// ex:
function name() {
    console.log("This is the first statement");

    setTimeout(function () {
        console.log("This is the second statement");
    }, 1000);

    console.log("This is the third statement");
}


// The first statement is logged immediately.
// setTimeout schedules the second statement to log after 1000 milliseconds.
// The third statement is logged immediately after.
// After 1000 milliseconds, the callback from setTimeout is executed, logging Second statement.

//=======================================      =================================================       ===============


// 2. What is Libuv and What Role Does It Play in Node.js? (0.5 Grade)

// refrance :: https://www.geeksforgeeks.org/node-js/libuv-in-node-js/

// Answer :
// Node.js relies on various dependencies under the hood for providing various features.Libuv is one of them, 
// libuv is a C library originally written for Node.js to abstract non-blocking I/O operations. 

// => Event-driven asynchronous I/O model is integrated.
// => It allows the CPU and other resources to be used simultaneously while still performing I/O operations, thereby resulting in efficient use of resources and network.
// => It facilitates an event-driven approach wherein I/O and other activities are performed using callback-based notifications.

// Example: If a program is querying the database, the CPU sits idle until the query is processed and the program stays at a halt,  
//          thereby causing wastage of system resources. To prevent this, libuv is used in Node.js which facilitates a non-blocking I/O.


//=======================================      =================================================       ===============


// 3. How Does Node.js Handle Asynchronous Operations Under the Hood? (0.5 Grade)

//Answer:
const timersOperation = [] // setTimeout // setInterval // setImmediate
const longRunningOperation = [] // fs // crypto
const osOperation = [] // http server

/*
 1- check the TimersOperation if there is any setTimeOut // setInterval ready to be executed
 2- check the longRunningOperation and osOperation
 3- wait
 4- check if there is any setImmediate to execute
 5- check if there is any close server service
 6- next tick
*/

// example :

function jsHandleAsynchronous() {

    setTimeout(() => {
        console.log("hello from setTimeout");
    }, 5000);

    const fs = require("fs");

    fs.readFile("data.json", "utf-8", (err, data) => {
        setImmediate(() => {
            console.log("hello from line 13");
        });

        setTimeout(() => {
            console.log("from setTimeout line 17");
        }, 0);
    });

    const http = require("http");

    const server = http.createServer((req, res) => { });

    server.listen(3000, () => {
        console.log("server is running on port 3000");
    });

    setTimeout(()=>{
        server.close()
        console.log("server closed")
    },8000)

}
// jsHandleAsynchronous()
//=======================================      =================================================       ===============


// 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js? (0.5 Grade)
// Answer :
//Call Stack  ==>  Stores and executes function calls in a synchronous order (LIFO).
//Event Queue ==>  Holds asynchronous callbacks ready for execution.
//Event Loop  ==>  Manages the execution of the event queue and the call stack.


//=======================================      =================================================       ===============


// 5. What is the Node.js Thread Poparamsol and How to Set the Thread Pool Size? (0.5 Grade)

//refrance :: https://medium.com/@mubashir_ejaz/understanding-processes-threads-and-the-thread-pool-in-node-js-00e1be1ca057

// Answer :
// Threads in Node.js
// A thread is the smallest unit of execution within a process. While Node.js itself is single-threaded (executing JavaScript code on one thread), 
//          it uses threads in the background for I/O operations, file handling, and other asynchronous tasks.



// The Thread Pool
// The thread pool in Node.js is a collection of threads managed by Libuv. 
//                            It is responsible for offloading expensive operations — such as file I/O, DNS lookups, or cryptography — so they don’t block the main thread.

// The default thread pool size is 4, but you can adjust it using the UV_THREADPOOL_SIZE environment variable


//=======================================      =================================================       ===============


// 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution? (0.5 Grade)

// refrance :: https://www.geeksforgeeks.org/node-js/blocking-and-non-blocking-in-node-js/

// Answer:
/*
In NodeJS, blocking and non-blocking are two ways of writing code. 
    Blocking code stops everything else until it's finished,
    while non-blocking code lets other things happen while it's waiting.

Blocking in NodeJS
When your code runs a task, it stops and waits for that task to completely finish before moving on to the next thing.
It's like reading a book one word at a time, never skipping ahead.

=> The program waits patiently for the current operation to finish.
=> No other code can run until that operation is done.

ex:

function myFunction() {
    console.log("Starting a task...");
    // Simulate a long-running task (blocking)
    let sum = 0;
    for (let i = 0; i < 1000000000; i++) { // A big loop!
        sum += i;
    }
    console.log("Task finished!");
    return sum;
}

console.log("Before the function call");
let result = myFunction(); 
console.log("After the function call");
console.log("Result:", result);



The for loop acts like a long-running task. The program waits for it to complete.
The "After the function call" message doesn't print until the loop is totally done.
This makes the code run step-by-step, one thing at a time.

*/ 


/*
Non-Blocking in NodeJS
Non-blocking means your program can keep doing other things while a task is running in the background. 
It doesn't have to stop and wait for that task to finish before moving on.

The program doesn't wait for the current task to complete.
Other code can run while the task is working in the background.

ex:
function myFunction() {
    console.log("Starting a task...");
    // Simulate a long-running task (non-blocking) - using setTimeout
    setTimeout(() => {
        let sum = 0;
        for (let i = 0; i < 1000000000; i++) { // A big loop!
            sum += i;
        }
        console.log("Task finished!");
        console.log("Result:", sum);
    }, 0); // The 0 delay makes it asynchronous
}

console.log("Before the function call");
myFunction(); // The program doesn't wait here
console.log("After the function call");



The setTimeout makes the big loop run in the background. The program doesn't stop.
"After the function call" prints before "Task finished!" because the loop runs later.
This lets the program do multiple things "at the same time."
*/ 

//=======================================      =================================================       ===============

