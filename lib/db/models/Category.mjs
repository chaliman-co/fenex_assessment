import { Schema, model } from 'mongoose'
const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'name not provided']
  }
})
const categoryFields = function makeFields () {
  Object.assign(this, {
    name: undefined
  })
  Object.preventExtensions(this)
}

categorySchema.statics.Fields = categoryFields
export default model('Category', categorySchema)
