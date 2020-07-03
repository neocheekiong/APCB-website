# APCB-website
This is a place for Addictions Therapists to submit their applications to be certified as an addictions therapist. This includes the upload of documentation for the registrar to review

This website will also list certified members for the public to examine and verify.

A registrar will be able to view pending applications to verify and approve the applicants' fitness to practice addictions therapy.

# Stack
Express Server, EJS views, MongoDB Model.
express sessions and mongodb-session store.
Cloudinary for file uploads.
multer as a middleware to help with file uploads.
bcrypt for encryption of passwords.
I adapted my verification code from online sources.
I wrote my own authentication code.

## Approach and Process

### 1. What in my process and approach to this project would I do differently next time?

Planning was quite haphazard. I might have started refactoring too early. My functions changed several times.

### 2. What in my process and approach to this project went well that I would repeat next time?

Using a user flow diagram to figure out what routes I would need.

--

## Code and Code Design

### 1. What in my code and program design in the project would I do differently next time?

Proper authentication is hard. Use a well-maintained authentication library.

```
const authorizationRequired = allowedRoles => userData => {
    console.log('Auth function:', allowedRoles, userData);
    if (allowedRoles.includes('public')) {
        return true;
    } else if (userData) {
        const userRoleAllowed = allowedRoles.includes(userData.role);
        return userData.role === 'admin' || userRoleAllowed;
    }
    return false;
};
```

### 2. What in my code and program design in the project went well? Is there anything I would do the same next time?

Attempted to use functional programming approaches with higher order functions. 

```
 renderMemberInfoPage: page => (allowedRoles = ['public']) => {
        return async (request, response) => {
            const sessionUser = request.session.currentUser;
            const userData = await repositories.findOne({
                _id: new ObjectID(sessionUser)
            })('users');
            console.log('renderPage session data:', sessionUser, 'page ID');
            console.log('userdata', userData);

            authorizationRequired(allowedRoles)(userData) || response.render(views.ERROR_PAGE, {
                message: 'You\'re not allowed to view this page!',
                currentUser: userData
            });
            response.render(page, {
                currentUser: userData
            });
        };
    },
```


  For each, please include code examples.
  1. Code snippet up to 20 lines.
  2. Code design documents or architecture drawings / diagrams.

## Unit 2 Post Mortem
### 1. What habits did I use during this unit that helped me?
Taking notes on design architecture whenever possible.

### 2. What habits did I have during this unit that I can improve on?
During the Circuit Breaker, It's easy to get distracted during class.

### 3. How is the overall level of the course during this unit? (instruction, course materials, etc.)


# Further improvements
1) Create a front-end view where a candidate can click on a button to add additional fields.
2) Email Reminders and prompts to admin/registrar roles.
3) Use passport.js for authentication.


## Heroku
https://apcb.herokuapp.com/

## Github
https://github.com/neocheekiong/APCB-website
