import { Schema, model, Types } from 'mongoose'
import Category from './Category.mjs'
const { ObjectId } = Types
const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name not provided']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'category not provided'],
    validate: {
      async validator (id) {
        try {
          const categoryId = new ObjectId(id)
          return await Category.exists({ _id: categoryId }).exec()
        } catch (err) {
          return false
        }
      },
      message: 'category not found'
    }
  },
  price: {
    type: Number,
    required: [true, 'price not provided']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: [true, 'image not provided']
  }
})

ProductSchema.statics.Fields = function makeFields () {
  Object.assign(this, {
    category: undefined,
    name: undefined,
    price: undefined,
    imageUrl: undefined
  })
  Object.preventExtensions(this)
}
export default model('Products', ProductSchema)
