const {
    body,
    validationResult ,
    param
} = require('express-validator');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

class AuthController {


    // validator for registration
    registerValidator = [
        body('email').isEmail().withMessage('Invalid email format')
        .notEmpty().withMessage('Email is required')
        .custom(async (value) => {
            const user = await User.findOne({
                email: value
            });
            if (user) {
                throw new Error('Email already in use');
            }
        }),
        body('password').isLength({
            min: 6
        }).withMessage('Password must be at least 6 characters long'),
        body('reEnterPassword').isLength({
            min: 6
        }).withMessage('Please re-enter your password'),
        body('firstName').notEmpty().trim().withMessage('First name is required'),
        body('lastName').notEmpty().trim().withMessage('Last name is required'),
        body('address').optional().isObject().withMessage('Address must be an object'),
        body('address.street').optional().isString().withMessage('Street must be a string'),
        body('address.city').optional().isString().withMessage('City must be a string'),
        body('address.state').optional().isString().withMessage('State must be a string'),
        body('address.zipCode').optional().isString().withMessage('Zip code must be a string'),
        body('address.country').optional().isString().withMessage('Country must be a string'),
    ]

    // fuction to register from public end users
    async register(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password,
            reEnterPassword,
            firstName,
            lastName,
            address,
            phone
        } = req.body;

        if (password !== reEnterPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }

        const existingUser = await User.findOne({
            $or: [{
                email
            }]
        });
        if (existingUser) {
            return res.status(409).json({
                message: 'email already exists'
            });
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            address,
            phone,
            roles: ['customer']
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            user: userResponse
        });
    }


    // login validator 
    loginValidator = [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({
            min: 6
        }),
        param('userType').isIn(['admin', 'customer']).withMessage('Invalid user type')
    ]


    //  login 
    async login(req, res) {
        const {
            email,
            password
        } = req.body;

        const userType = req.params.userType;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({
            email
        }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check user type
        if (!user.roles.includes(userType)) {
            return res.status(403).json({
                message: 'User does not have required role'
            });
        }

        // Compare password
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = require('jsonwebtoken').sign({
                userId: user._id,
                roles: user.roles
            },
            process.env.JWT_SECRET || 'your_jwt_secret', {
                expiresIn: '1d'
            }
        );

        // Respond with user info and token
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            user: userResponse,
            token
        });
    }

    async logout(req, res) {
        // For stateless JWT, logout is handled on client side by deleting token
        res.status(200).json({
            message: 'Logged out successfully'
        });
    }

}

module.exports = new AuthController();