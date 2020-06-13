const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.set('view engine', 'ejs');

function renderFrontPage (request, response) {
    response.render('index');
}

app.get('/', renderFrontPage);

app.listen(port, () => {
    console.log('Listening on port ', port);
});

Person = {
    name: String,
    emailAddress: String,
    phoneNumber: {
        areaCode: Number,
        number: Number
    },
    address: {
        street: String,
        postalCode: Number,
        cityTown: String,
        country: String,
        state: String
    },
    placeOfPractice: {
        nameOfPractice: String,
        address: {
            street: String,
            postalCode: Number,
            cityTown: String,
            country: String,
            state: String
        }
    },
    formalEducation: [{
        type: String,
        major: String,
        institute: String,
        yearAttained: Number,
        certificate: File,
        verified: Boolean
    }],
    continuingEducation: [{
        nameOfCourse: String,
        numberOfHours: Number,
        certificate: File,
        dateAttended: Date,
        verified: Boolean
    }],
    supervisionHours: [{
        supervisor: {
            name: String,
            email: String,
            phoneNumber: {
                areaCode: Number,
                number: Number
            }
        },
        numberOfHours: Number,
        documentation: File,
        verified: Boolean
    }],
    workExperience: [{
        organisation: {
            name:String,
            address: {
                street: String,
                postalCode: Number,
                cityTown: String,
                country: String,
                state: String
            }
        },
        startDate: Date,
        endDate: Date,
        roles: String,
        documentation: File,
        verified: Boolean
    }]
    // tests: [{
    //     testType: String,
    //     testDate: Date,
    //     testScore: Number,
    //     test: [{
    //         questionNumber: Number,
    //         correct: Boolean
    //     }]
    // }]
};
