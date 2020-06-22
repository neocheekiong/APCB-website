module.exports = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        name: 'string',
        emailAddress: 'string',
        passwordHash: 'Hash',
        phoneNumber: {
            areaCode: 'string',
            number: 'string'
        },
        address: {
            street: 'string',
            postalCode: 'string',
            cityTown: 'string',
            country: 'string',
            state: 'string'
        },
        placeOfPractice: {
            nameOfPractice: 'string',
            address: {
                street: 'string',
                postalCode: 'string',
                cityTown: 'string',
                country: 'string',
                state: 'string'
            }
        },
        formalEducation: [{
            type: 'string',
            major: 'string',
            institute: 'string',
            graduationDate: 'number',
            certificate: File,
            verified: 'boolean'
        }],
        continuingEducation: [{
            nameOfCourse: 'string',
            numberOfHours: 'number',
            certificate: File,
            dateAttended: 'date-time',
            verified: 'boolean'
        }],
        supervisionHours: [{
            supervisor: {
                name: 'string',
                email: 'string',
                phoneNumber: {
                    areaCode: 'number',
                    number: 'number'
                }
            },
            numberOfHours: 'number',
            documentation: File,
            verified: 'boolean'
        }],
        supervisorFeedback: [{
            question: '',
            answer: 'number'
        }],
        workExperience: [{
            organisation: {
                name:'string',
                address: {
                    street: 'string',
                    postalCode: 'number',
                    cityTown: 'string',
                    country: 'string',
                    state: 'string'
                }
            },
            startDate: 'date-time',
            endDate: 'date-time',
            roles: 'string',
            documentation: File,
            verified: 'boolean'
        }],
        tests: [{
            testType: 'string',
            testDate: 'date-time',
            testScore: 'number',
            test: [{
                test_ID: testObjectID,
                question_ID: QuestionObjectID,
                score: 'number'
            }]
        }]
    }
};
