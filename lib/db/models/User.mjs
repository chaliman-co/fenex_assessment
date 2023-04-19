import { Schema, model } from 'mongoose'
import googleLibPhoneNumber from 'google-libphonenumber'
import { hash } from 'bcrypt'
import process from 'process'
const phoneUtil = googleLibPhoneNumber.PhoneNumberUtil.getInstance()
const phoneNumberSchema = new Schema({
  digits: {
    type: String,
    required: [true, 'digits not provided']
  },
  region: {
    type: String,
    required: [true, 'region not provided']
  }
})

const userSchema = Schema({

  firstName: {
    type: String,
    required: [true, 'first name not provided'],
    lowercase: true
  },

  lastName: {
    type: String,
    required: [true, 'last name not provided'],
    lowercase: true
  },

  password: {
    type: String,
    required: [true, 'password not provided'],
    validate: {
      async validator (password) {
        this.password = await hash(password, 5)
      }
    }
  },
  country: {
    type: String,
    required: [true, 'country not provided']
  },

  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },

  imageUrl: String,

  role: {
    type: String,
    enum: ['admin', 'user'],
    // default: 'user'
    default: ~process.argv.indexOf('create-admin') ? 'admin' : 'user'
  },

  phoneNumber: {
    type: phoneNumberSchema,
    required: [true, 'phone number not provided'],
    validate: {
      validator: function validatePhoneNumber (number) {
        let phoneNumber
        try {
          phoneNumber = phoneUtil.parseAndKeepRawInput(number.digits, number.region)
        } catch (err) {
          return false
        }
        return phoneUtil.isValidNumberForRegion(phoneNumber, number.region)
      },
      message: 'phone number invalid'
    }
  },

  emailAddress: {
    type: String,
    unique: true,
    required: [true, 'email address not provided'],
    validate: {
      validator: function validateEmail (val) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(val)
      },
      message: 'email address invalid'
    },
    lowercase: true
  },

  createdAt: {
    type: Date,
    default: new Date()
  }

})

const PhoneNumberFields = function makeFields () {
  Object.assign(this, {
    digits: undefined,
    region: undefined
  })
  Object.preventExtensions(this)
}

const UserFields = function makeFields () {
  Object.assign(this, {
    phoneNumber: new PhoneNumberFields(),
    lastName: undefined,
    firstName: undefined,
    emailAddress: undefined,
    imageUrl: undefined,
    country: undefined,
    password: undefined
  })
  Object.preventExtensions(this)
}

Object.assign(userSchema.statics, {
  Fields: UserFields
})

export default model('User', userSchema)
